from langchain_community.vectorstores import FAISS
from ..ai_core.knowledge.embeddings import get_embeddings
from ..ai_core.knowledge.dynamic_loader import load_csv_data
from ..ai_core.knowledge.static_loader import load_static_content
from ..ai_core.knowledge.database_loader import load_database_content, make_doc_id
import logging
import os
import threading
from typing import List, Optional
from langchain_core.documents import Document
from backend.config import FAISS_SEARCH_K

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('faiss.log')]
)
logger = logging.getLogger(__name__)


def _stable_ids_for_documents(documents: List[Document]) -> List[str]:
    ids = []
    for i, doc in enumerate(documents):
        meta = doc.metadata or {}
        if meta.get("source") == "database" and meta.get("type") is not None and meta.get("id") is not None:
            ids.append(make_doc_id(str(meta["type"]), int(meta["id"])))
        else:
            ids.append(f"static:{meta.get('source', 'doc')}:{meta.get('type', 'x')}:{i}")
    return ids


class FAISSManager:
    def __init__(self):
        self.vector_store = None
        self.embeddings = get_embeddings()
        self.profile_data = {}
        self.knowledge_version = 0
        self._store_lock = threading.RLock()

    def initialize(self, documents: List[Document]):
        logger.info(f"Initializing FAISS with {len(documents)} documents")
        try:
            if not documents:
                with self._store_lock:
                    self.vector_store = None
                logger.warning("No documents provided for FAISS initialization")
                return

            ids = _stable_ids_for_documents(documents)
            new_store = FAISS.from_documents(documents, self.embeddings, ids=ids)
            with self._store_lock:
                self.vector_store = new_store
            logger.info("FAISS vector store initialized")
        except Exception as e:
            logger.error(f"Failed to initialize FAISS: {str(e)}")
            with self._store_lock:
                self.vector_store = None

    def update_vector_store(self):
        logger.info("Updating vector store (full rebuild)...")
        csv_docs = []
        data_dir = "backend/data"
        os.makedirs(data_dir, exist_ok=True)
        for filename in os.listdir(data_dir):
            if filename.endswith(".csv"):
                csv_docs.extend(load_csv_data(os.path.join(data_dir, filename)))

        static_docs, profile_data = load_static_content()
        self.profile_data = profile_data

        db_docs = load_database_content()
        all_docs = csv_docs + static_docs + db_docs
        self.initialize(all_docs)
        logger.info("Vector store updated.")

    def delete_documents(self, ids: List[str]) -> None:
        if not ids:
            return
        with self._store_lock:
            if self.vector_store is None:
                return
            try:
                self.vector_store.delete(ids)
            except Exception as e:
                # Some FAISS builds complain if an id is missing; ignore and continue
                logger.warning(f"FAISS delete warning for {ids}: {e}")

    def upsert_documents(self, documents: List[Document], ids: Optional[List[str]] = None) -> None:
        if not documents:
            return
        doc_ids = ids or _stable_ids_for_documents(documents)
        with self._store_lock:
            if self.vector_store is None:
                self.initialize(documents)
                return
            try:
                # Replace existing vectors for the same ids
                try:
                    self.vector_store.delete(doc_ids)
                except Exception:
                    pass
                self.vector_store.add_documents(documents, ids=doc_ids)
            except Exception as e:
                logger.error(f"FAISS upsert failed: {e}", exc_info=True)
                raise

    def search(self, query, k=FAISS_SEARCH_K, filter=None):
        # No DB polling here — index is kept fresh via CDC on write.
        logger.info(f"Searching FAISS for query: {query[:50]}...")
        with self._store_lock:
            store = self.vector_store
        if store is None:
            logger.warning("FAISS vector store not initialized")
            return []
        try:
            results = store.similarity_search(query, k=k, filter=filter)
            logger.info(f"Found {len(results)} results")
            return results
        except Exception as e:
            logger.error(f"Error in FAISS search: {str(e)}")
            return []


faiss_manager = FAISSManager()
