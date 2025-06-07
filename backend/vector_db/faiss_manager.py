from langchain_community.vectorstores import FAISS
from backend.ai_core.knowledge.static_loader import load_static_content
from backend.ai_core.knowledge.dynamic_loader import load_github_data
from backend.ai_core.knowledge.chunker import chunk_documents
from backend.ai_core.knowledge.embeddings import get_embeddings
from backend.ai_core.utils.logger import log_interaction
from typing import List
import time
import threading
import logging

# Set up logging to ensure output is visible
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Output to console
        logging.FileHandler('debug.log')  # Also log to a file
    ]
)
logger = logging.getLogger(__name__)

class FAISSManager:
   
    def __init__(self, source="knowledge_base"):
        self.embeddings = get_embeddings()
        self.source = source
        # Initialize both stores synchronously to avoid race conditions
        self.static_vector_store = self.initialize_static_vector_store()
        self.dynamic_vector_store = self.initialize_dynamic_vector_store()
        # Start a background thread for periodic updates to dynamic store
        threading.Thread(target=self.periodic_update_dynamic_store, daemon=True).start()

    def periodic_update_dynamic_store(self):
        """Periodically update the dynamic vector store every 24 hours."""
        while True:
            time.sleep(24 * 60 * 60)  # Sleep for 24 hours
            logger.debug("DEBUG: Starting periodic update of dynamic vector store")
            self.update_dynamic_vector_store()

    def initialize_static_vector_store(self):
        start_time = time.time()
        documents = load_static_content(source=self.source)
        chunked_docs = chunk_documents(documents)
        vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
        end_time = time.time()
        log_interaction("Static vector store initialized", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
        logger.debug(f"DEBUG: Static vector store initialized with {len(chunked_docs)} documents")
        return vector_store

    def initialize_dynamic_vector_store(self):
        start_time = time.time()
        github_data = load_github_data()
        if github_data:
            chunked_docs = chunk_documents(github_data)
            vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
            end_time = time.time()
            log_interaction("Dynamic vector store initialized", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
            logger.debug(f"DEBUG: Dynamic vector store initialized with {len(chunked_docs)} documents")
        else:
            vector_store = None
            end_time = time.time()
            log_interaction("Dynamic vector store not initialized", f"No GitHub data fetched, Time: {end_time - start_time:.2f} seconds")
            logger.debug("DEBUG: Dynamic vector store not initialized due to no GitHub data")
        return vector_store

    def update_dynamic_vector_store(self):
        start_time = time.time()
        github_data = load_github_data()
        if github_data:
            chunked_docs = chunk_documents(github_data)
            new_vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
            self.dynamic_vector_store = new_vector_store
            end_time = time.time()
            log_interaction("Dynamic vector store updated", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
            logger.debug(f"DEBUG: Dynamic vector store updated with {len(chunked_docs)} documents")
        else:
            end_time = time.time()
            log_interaction("Dynamic vector store update skipped", f"No GitHub data fetched, Time: {end_time - start_time:.2f} seconds")
            logger.debug("DEBUG: Dynamic vector store update skipped due to no GitHub data")

    def search_static(self, query: str, k: int = 2) -> List:
        results = self.static_vector_store.similarity_search(query, k=k) if self.static_vector_store else []
        logger.debug(f"DEBUG: Static search for query '{query}': {len(results)} results")
        return results

    def search_dynamic(self, query: str, k: int = 2) -> List:
        if not self.dynamic_vector_store:
            logger.debug(f"DEBUG: Dynamic search for query '{query}' skipped: dynamic_vector_store is None")
            return []
        results = self.dynamic_vector_store.similarity_search(query, k=k)
        logger.debug(f"DEBUG: Dynamic search for query '{query}': {len(results)} results")
        return results

    def search_combined(self, query: str, k: int = 2) -> List:
        logger.debug(f"DEBUG: Starting combined search for query '{query}'")
        static_results = self.search_static(query, k)
        dynamic_results = self.search_dynamic(query, k)
        combined_results = static_results + dynamic_results
        logger.debug(f"DEBUG: Combined search results for query '{query}': {len(combined_results)} results (Static: {len(static_results)}, Dynamic: {len(dynamic_results)})")
        return combined_results

faiss_manager = FAISSManager(source="knowledge_base")