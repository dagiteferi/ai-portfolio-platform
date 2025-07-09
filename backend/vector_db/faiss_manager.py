from langchain_community.vectorstores import FAISS
from ..ai_core.knowledge.embeddings import get_embeddings
from ..ai_core.knowledge.dynamic_loader import load_github_data, load_csv_data
import logging
from backend.config import FAISS_DOCUMENT_COUNT, FAISS_SEARCH_K

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('faiss.log')]
)
logger = logging.getLogger(__name__)

class FAISSManager:
    def __init__(self):
        self.vector_store = None
        self.embeddings = get_embeddings()

    def initialize(self, documents):
        logger.info(f"Initializing FAISS with {len(documents)} documents")
        try:
            self.vector_store = FAISS.from_documents(documents, self.embeddings)
            logger.info("FAISS vector store initialized")
        except Exception as e:
            logger.error(f"Failed to initialize FAISS: {str(e)}")
            self.vector_store = None

    def update_dynamic_vector_store(self):
        logger.info("Updating dynamic vector store...")
        github_docs = load_github_data()
        csv_docs = load_csv_data("/home/dagi/Documents/ai-portfolio-platform/backend/data/top_10_chats_and_senders.csv")
        all_docs = github_docs + csv_docs
        self.initialize(all_docs)
        logger.info("Dynamic vector store updated.")

    def search_combined(self, query, k=FAISS_SEARCH_K):
        logger.info(f"Searching FAISS for query: {query[:50]}...")
        if self.vector_store is None:
            logger.warning("FAISS vector store not initialized")
            return []
        try:
            results = self.vector_store.similarity_search(query, k=k)
            logger.info(f"Found {len(results)} results")
            return results
        except Exception as e:
            logger.error(f"Error in FAISS search: {str(e)}")
            return []

faiss_manager = FAISSManager()