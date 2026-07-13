"""
Change-data-capture for the RAG knowledge base.

Does NOT poll the database on chat requests.
Instead:
  1. SQLAlchemy flush/commit events capture which rows changed
  2. Only those rows are upserted/deleted in FAISS
  3. PostgreSQL NOTIFY fans the change out to other Gunicorn workers
"""
from __future__ import annotations

import json
import logging
import select
import threading
from typing import Dict, List, Optional, Tuple

from sqlalchemy import event, text
from sqlalchemy.orm import Session

from backend.database import engine
from backend.ai_core.knowledge.database_loader import (
    MODEL_TO_DOC_TYPE,
    doc_type_for_model,
    load_entity_document,
    make_doc_id,
)

logger = logging.getLogger(__name__)

NOTIFY_CHANNEL = "knowledge_changed"

# Models that map into the RAG index (CV is stored but not embedded)
INDEXED_MODELS = tuple(MODEL_TO_DOC_TYPE.keys())

_apply_lock = threading.Lock()
_listener_thread: Optional[threading.Thread] = None
_listener_stop = threading.Event()
_change_count = 0
_listeners_registered = False

ChangeEvent = Dict[str, object]  # {op, type, id}


def _pg_notify(events: List[ChangeEvent]) -> None:
    if not events:
        return
    payload = json.dumps({"events": events})
    # NOTIFY payload limit is ~8000 bytes; truncate if needed
    if len(payload) > 7000:
        payload = json.dumps({"events": events[:20], "truncated": True})
    try:
        with engine.connect() as conn:
            conn.execute(
                text("SELECT pg_notify(:channel, :payload)"),
                {"channel": NOTIFY_CHANNEL, "payload": payload},
            )
            conn.commit()
    except Exception as e:
        logger.warning(f"pg_notify failed (local apply still runs): {e}")


def apply_change_events(events: List[ChangeEvent], source: str = "local") -> int:
    """
    Apply captured row changes to the in-memory FAISS index.
    insert/update -> one SELECT for that row, then upsert
    delete -> remove by stable doc id (no SELECT)
    """
    from backend.vector_db.faiss_manager import faiss_manager

    if not events:
        return 0

    global _change_count
    applied = 0

    with _apply_lock:
        for event_item in events:
            op = str(event_item.get("op"))
            doc_type = str(event_item.get("type"))
            row_id = int(event_item.get("id"))  # type: ignore[arg-type]
            doc_id = make_doc_id(doc_type, row_id)

            try:
                if op == "delete":
                    faiss_manager.delete_documents([doc_id])
                    applied += 1
                    logger.info(f"[{source}] Removed {doc_id} from knowledge base")
                    continue

                doc = load_entity_document(doc_type, row_id)
                if doc is None:
                    faiss_manager.delete_documents([doc_id])
                    applied += 1
                    logger.info(f"[{source}] Row missing; removed {doc_id}")
                    continue

                faiss_manager.upsert_documents([doc], [doc_id])
                applied += 1
                logger.info(f"[{source}] Upserted {doc_id} into knowledge base")
            except Exception as e:
                logger.error(
                    f"[{source}] Failed to apply {op} {doc_type}:{row_id}: {e}",
                    exc_info=True,
                )

        _change_count += applied
        faiss_manager.knowledge_version = _change_count

    return applied


def _apply_events_async(events: List[ChangeEvent], source: str = "local") -> None:
    threading.Thread(
        target=apply_change_events,
        args=(events, source),
        daemon=True,
        name="knowledge-cdc-apply",
    ).start()


def full_rebuild() -> bool:
    """Full rebuild from CSV + static JSON + DB. Manual / startup only."""
    from backend.vector_db.faiss_manager import faiss_manager

    with _apply_lock:
        faiss_manager.update_vector_store()
        global _change_count
        _change_count += 1
        faiss_manager.knowledge_version = _change_count
        return True


def get_knowledge_status() -> dict:
    from backend.vector_db.faiss_manager import faiss_manager

    return {
        "change_count": _change_count,
        "local_version": getattr(faiss_manager, "knowledge_version", -1),
        "vector_store_ready": faiss_manager.vector_store is not None,
        "capture_mode": "sqlalchemy_cdc+pg_notify",
        "polls_db_on_search": False,
    }


# ---------------------------------------------------------------------------
# SQLAlchemy CDC listeners
# ---------------------------------------------------------------------------

@event.listens_for(Session, "before_flush")
def _capture_changes_before_flush(session, flush_context, instances):
    """
    Capture object refs before flush. Deletes store id immediately;
    inserts/updates resolve primary keys in after_flush.
    """
    tracked = session.info.setdefault("knowledge_tracked", [])

    for obj in list(session.deleted):
        doc_type = doc_type_for_model(type(obj))
        if doc_type and getattr(obj, "id", None) is not None:
            tracked.append({"op": "delete", "type": doc_type, "id": int(obj.id)})

    for obj in list(session.new):
        if isinstance(obj, INDEXED_MODELS):
            tracked.append({"op": "insert", "obj": obj})

    for obj in list(session.dirty):
        if isinstance(obj, INDEXED_MODELS) and session.is_modified(obj, include_collections=False):
            tracked.append({"op": "update", "obj": obj})


@event.listens_for(Session, "after_flush")
def _resolve_ids_after_flush(session, flush_context):
    tracked = session.info.pop("knowledge_tracked", [])
    if not tracked:
        return

    events: List[ChangeEvent] = session.info.setdefault("knowledge_events", [])
    for item in tracked:
        if item.get("op") == "delete" and "id" in item:
            events.append({"op": "delete", "type": item["type"], "id": item["id"]})
            continue

        obj = item.get("obj")
        if obj is None:
            continue
        doc_type = doc_type_for_model(type(obj))
        row_id = getattr(obj, "id", None)
        if not doc_type or row_id is None:
            continue
        events.append({"op": item["op"], "type": doc_type, "id": int(row_id)})


@event.listens_for(Session, "after_commit")
def _apply_captured_changes_after_commit(session):
    events: List[ChangeEvent] = session.info.pop("knowledge_events", [])
    session.info.pop("knowledge_tracked", None)
    if not events:
        return

    # De-dupe by (type, id): delete wins; otherwise last write wins
    latest: Dict[Tuple[str, int], ChangeEvent] = {}
    for ev in events:
        key = (str(ev["type"]), int(ev["id"]))  # type: ignore[arg-type]
        if latest.get(key, {}).get("op") == "delete":
            continue
        if ev.get("op") == "delete":
            latest[key] = ev
        else:
            latest[key] = ev
    deduped = list(latest.values())

    try:
        _pg_notify(deduped)
        _apply_events_async(deduped, source="local")
    except Exception as e:
        logger.error(f"Failed to apply captured DB changes: {e}", exc_info=True)


@event.listens_for(Session, "after_rollback")
def _clear_captured_changes_on_rollback(session):
    session.info.pop("knowledge_events", None)
    session.info.pop("knowledge_tracked", None)


# ---------------------------------------------------------------------------
# Cross-worker fan-out via PostgreSQL LISTEN/NOTIFY
# ---------------------------------------------------------------------------

def _listen_loop() -> None:
    """Background listener so other Gunicorn workers update without polling."""
    raw_conn = None
    try:
        raw_conn = engine.raw_connection()
        raw_conn.set_isolation_level(0)  # AUTOCOMMIT required for LISTEN
        cursor = raw_conn.cursor()
        cursor.execute(f"LISTEN {NOTIFY_CHANNEL};")
        logger.info(f"Listening for DB knowledge changes on channel '{NOTIFY_CHANNEL}'")

        while not _listener_stop.is_set():
            if select.select([raw_conn], [], [], 2.0) == ([], [], []):
                continue
            raw_conn.poll()
            while raw_conn.notifies:
                notify = raw_conn.notifies.pop(0)
                try:
                    data = json.loads(notify.payload or "{}")
                    events = data.get("events") or []
                    if events:
                        apply_change_events(events, source="pg_notify")
                except Exception as e:
                    logger.error(f"Failed handling NOTIFY payload: {e}", exc_info=True)
    except Exception as e:
        logger.error(f"Knowledge LISTEN loop stopped: {e}", exc_info=True)
    finally:
        if raw_conn is not None:
            try:
                raw_conn.close()
            except Exception:
                pass


def start_change_listener() -> None:
    global _listener_thread
    if _listener_thread and _listener_thread.is_alive():
        return
    _listener_stop.clear()
    _listener_thread = threading.Thread(
        target=_listen_loop,
        daemon=True,
        name="knowledge-pg-listen",
    )
    _listener_thread.start()


def stop_change_listener() -> None:
    _listener_stop.set()


def register_knowledge_listeners() -> None:
    global _listeners_registered
    _listeners_registered = True
    logger.info("Knowledge CDC listeners ready (no DB polling on search)")


register_knowledge_listeners()


# Backwards-compatible aliases used by older endpoints/scripts
def ensure_revision_table() -> None:
    return


def get_knowledge_version() -> int:
    return _change_count


def bump_knowledge_version() -> int:
    global _change_count
    _change_count += 1
    return _change_count


def refresh_vector_store_if_stale(force: bool = False) -> bool:
    if force:
        return full_rebuild()
    return False


def on_content_changed() -> int:
    full_rebuild()
    return get_knowledge_version()
