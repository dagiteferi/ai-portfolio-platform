from langchain_community.vectorstores import FAISS
from backend.ai_core.knowledge.static_loader import load_static_content
from backend.ai_core.knowledge.chunker import chunk_documents
from backend.ai_core.knowledge.embeddings import get_embeddings
from backend.ai_core.utils.logger import log_interaction

class FAISSManager:
    def __init__(self, source="knowledge_base"):
        self.embeddings = get_embeddings()
        self.source = source
        self.vector_store = self.initialize_vector_store()

    def initialize_vector_store(self):
        documents = load_static_content(source=self.source)
        chunked_docs = chunk_documents(documents)
        vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
        log_interaction("Vector store initialized", f"Total documents: {len(chunked_docs)}")
        return vector_store

    def update_vector(self):
        documents = load_static_content(source=self.source)
        chunked_docs = chunk_documents(documents)
        new_vector_store = FAISS.from_documents(chunked_docs, self.embeddings)
        self.vector_store = new_vector_store
        log_interaction("Vector store updated", f"Total documents: {len(chunked_docs)}")

    def search(self, query: str, k: int = 2):
        return self.vector_store.similarity_search(query, k=k) if self.vector_store else []

faiss_manager = FAISSManager(source="knowledge_base")