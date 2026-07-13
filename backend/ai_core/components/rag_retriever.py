import asyncio
import structlog
from typing import Dict, Optional, List
from backend.vector_db.faiss_manager import faiss_manager
from backend.config import FAISS_SEARCH_K, MAX_RETRIEVED_DOCS, GREETING_KEYWORDS

logger = structlog.get_logger(__name__)


def _is_greeting(query: str) -> bool:
    q = query.lower().strip()
    if not q:
        return True
    if len(q) < 4:
        return True
    return any(q == g or q.startswith(g + " ") or q.startswith(g + "!") or q.startswith(g + ",") for g in GREETING_KEYWORDS)


def get_metadata_filter(query: str) -> Optional[Dict]:
    """
    Analyzes the query to determine if a metadata filter should be applied.
    """
    query_lower = query.lower()

    if "current" in query_lower and ("job" in query_lower or "role" in query_lower or "experience" in query_lower):
        return {"is_current": True}

    if "project" in query_lower or "portfolio" in query_lower:
        return {"type": "project"}
    if "skill" in query_lower or "technolog" in query_lower:
        return {"type": "skills"}
    if "experience" in query_lower or "job" in query_lower or "work" in query_lower or "role" in query_lower:
        return {"type": "experience"}
    if "certificate" in query_lower or "certification" in query_lower or "certified" in query_lower:
        return {"type": "certificate"}
    if "moment" in query_lower or "gallery" in query_lower or "memorable" in query_lower:
        return {"type": "moment"}
    if "friend" in query_lower or "best friend" in query_lower or "friends" in query_lower or "relationship" in query_lower:
        return {"type": "friend"}
    if "education" in query_lower or "degree" in query_lower or "university" in query_lower:
        return {"type": "education"}
    if "hobby" in query_lower or "hobbies" in query_lower or "interest" in query_lower or "interests" in query_lower:
        return {"type": "hobbies"}
    if "spiritual" in query_lower or "faith" in query_lower or "belief" in query_lower or "principles" in query_lower or "religion" in query_lower:
        return {"type": "spiritual_beliefs"}
    if "contact" in query_lower or "email" in query_lower or "reach out" in query_lower:
        return {"type": "contact"}
    return None


async def retrieve_rag_context(state: Dict) -> Dict:
    """
    Fast RAG: one FAISS search on the user query (no extra LLM decomposition call).
    Greetings skip retrieval entirely.
    """
    user_input = state.get("input", "")

    if _is_greeting(user_input):
        logger.info("Greeting detected — skipping RAG retrieval")
        state["retrieved_docs"] = []
        return state

    metadata_filter = get_metadata_filter(user_input)
    if metadata_filter:
        logger.info(f"Applying metadata filter: {metadata_filter}")

    try:
        docs = await asyncio.to_thread(
            faiss_manager.search,
            user_input,
            k=FAISS_SEARCH_K,
            filter=metadata_filter,
        )

        # If a tight filter returned nothing, retry once without filter
        if not docs and metadata_filter:
            docs = await asyncio.to_thread(
                faiss_manager.search,
                user_input,
                k=FAISS_SEARCH_K,
                filter=None,
            )

        unique_docs: List = []
        seen = set()
        for doc in docs:
            if doc.page_content in seen:
                continue
            seen.add(doc.page_content)
            unique_docs.append(doc)
            if len(unique_docs) >= MAX_RETRIEVED_DOCS:
                break

        state["retrieved_docs"] = unique_docs
        logger.info(f"Retrieved {len(unique_docs)} documents for RAG")
    except Exception as e:
        logger.error(f"FAISS search failed: {e}", exc_info=True)
        state["retrieved_docs"] = []

    return state
