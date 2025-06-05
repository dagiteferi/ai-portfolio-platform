from langchain_community.vectorstores import FAISS
from backend.ai_core.knowledge.static_loader import load_static_content
from backend.ai_core.knowledge.dynamic_loader import load_github_data
from backend.ai_core.knowledge.chunker import chunk_documents
from backend.ai_core.knowledge.embeddings import get_embeddings
from backend.ai_core.utils.logger import log_interaction
from typing import List
import time
import threading

class FAISSManager:
   
    def __init__(self, source="knowledge_base"):
        self.embeddings = get_embeddings()
        self.source = source
        self.static_vector_store = self.initialize_static_vector_store()
        self.dynamic_vector_store = None
        # Start dynamic initialization in a background thread
        threading.Thread(target=self.initialize_dynamic_vector_store_async, daemon=True).start()

    def initialize_dynamic_vector_store_async(self):
        self.dynamic_vector_store = self.initialize_dynamic_vector_store()

    def initialize_static_vector_store(self):
        start_time = time.time()
        documents = load_static_content(source=self.source)
        chunked_docs = chunk_documents(documents)
        vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
        end_time = time.time()
        log_interaction("Static vector store initialized", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
        return vector_store

    def initialize_dynamic_vector_store(self):
        start_time = time.time()
        github_data = load_github_data()
        if github_data:
            chunked_docs = chunk_documents(github_data)
            vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
            end_time = time.time()
            log_interaction("Dynamic vector store initialized", f"Total documents: {len(chunked_docs)}, Time: {end_time - start_time:.2f} seconds")
        else:
            vector_store = None
            end_time = time.time()
            log_interaction("Dynamic vector store not initialized", f"No GitHub data fetched, Time: {end_time - start_time:.2f} seconds")
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
        else:
            end_time = time.time()
            log_interaction("Dynamic vector store update skipped", f"No GitHub data fetched, Time: {end_time - start_time:.2f} seconds")

    def search_static(self, query: str, k: int = 2) -> List:
        return self.static_vector_store.similarity_search(query, k=k) if self.static_vector_store else []

    def search_dynamic(self, query: str, k: int = 2) -> List:
        return self.dynamic_vector_store.similarity_search(query, k=k) if self.dynamic_vector_store else []

    def search_combined(self, query: str, k: int = 2) -> List:
        static_results = self.search_static(query, k)
        dynamic_results = self.search_dynamic(query, k)
        return static_results + dynamic_results

faiss_manager = FAISSManager(source="knowledge_base")