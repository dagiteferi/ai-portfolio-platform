from langchain_community.vectorstores import FAISS
from backend.ai_core.knowledge.static_loader import load_static_content
from backend.ai_core.knowledge.dynamic_loader import load_github_data as load_dynamic_github_data
from backend.ai_core.knowledge.chunker import chunk_documents
from backend.ai_core.knowledge.embeddings import get_embeddings
from backend.ai_core.utils.logger import log_interaction
from typing import List
import time
import threading
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('debug.log')
    ]
)
logger = logging.getLogger(__name__)

class FAISSManager:
    def __init__(self, source="all"):
        self.embeddings = get_embeddings()
        self.source = source
        self.static_vector_store = self.initialize_static_vector_store()
        self.dynamic_vector_store = self.initialize_dynamic_vector_store()
        threading.Thread(target=self.periodic_update_dynamic_store, daemon=True).start()

    def periodic_update_dynamic_store(self):
        """Periodically update the dynamic vector store every 24 hours."""
        while True:
            time.sleep(24 * 60 * 60)
            logger.debug("Starting periodic update of dynamic vector store")
            self.update_dynamic_vector_store()

    def initialize_static_vector_store(self):
        start_time = time.time()
        try:
            documents = load_static_content(source=self.source)
            if not documents:
                logger.warning("No static documents found for indexing")
                return None
            chunked_docs = chunk_documents(documents)
            vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
            end_time = time.time()
            log_interaction("Static vector store initialized", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
            logger.debug(f"Static vector store initialized with {len(chunked_docs)} documents")
            return vector_store
        except Exception as e:
            logger.error(f"Failed to initialize static vector store: {str(e)}")
            return None

    def initialize_dynamic_vector_store(self):
        start_time = time.time()
        try:
            github_data = load_dynamic_github_data()
            if github_data:
                chunked_docs = chunk_documents(github_data)
                vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
                end_time = time.time()
                log_interaction("Dynamic vector store initialized", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
                logger.debug(f"Dynamic vector store initialized with {len(chunked_docs)} documents")
            else:
                vector_store = None
                end_time = time.time()
                log_interaction("Dynamic vector store not initialized", f"No GitHub data fetched, Time: {end_time - start_time:.2f} seconds")
                logger.debug("Dynamic vector store not initialized due to no GitHub data")
            return vector_store
        except Exception as e:
            logger.error(f"Failed to initialize dynamic vector store: {str(e)}")
            return None

    def update_dynamic_vector_store(self):
        start_time = time.time()
        try:
            github_data = load_dynamic_github_data()
            if github_data:
                chunked_docs = chunk_documents(github_data)
                new_vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
                self.dynamic_vector_store = new_vector_store
                end_time = time.time()
                log_interaction("Dynamic vector store updated", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
                logger.debug(f"Dynamic vector store updated with {len(chunked_docs)} documents")
            else:
                end_time = time.time()
                log_interaction("Dynamic vector store update skipped", f"No GitHub data fetched, Time: {end_time - start_time:.2f} seconds")
                logger.debug("Dynamic vector store update skipped due to no GitHub data")
        except Exception as e:
            logger.error(f"Failed to update dynamic vector store: {str(e)}")

    def search_static(self, query: str, k: int = 2) -> List:
        if not self.static_vector_store:
            logger.debug(f"Static search for query '{query}' skipped: static_vector_store is None")
            return []
        results = self.static_vector_store.similarity_search(query, k=k)
        logger.debug(f"Static search for query '{query}': {len(results)} results")
        return results

    def search_dynamic(self, query: str, k: int = 2) -> List:
        if not self.dynamic_vector_store:
            logger.debug(f"Dynamic search for query '{query}' skipped: dynamic_vector_store is None")
            return []
        results = self.dynamic_vector_store.similarity_search(query, k=k)
        logger.debug(f"Dynamic search for query '{query}': {len(results)} results")
        return results

    def search_combined(self, query: str, k: int = 2) -> List:
        logger.debug(f"Starting combined search for query '{query}'")
        static_results = self.search_static(query, k)
        dynamic_results = self.search_dynamic(query, k)
        combined_results = static_results + dynamic_results
        logger.debug(f"Combined search results for query '{query}': {len(combined_results)} results (Static: {len(static_results)}, Dynamic: {len(dynamic_results)})")
        return combined_results[:k]

faiss_manager = FAISSManager(source="all")