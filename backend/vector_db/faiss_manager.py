from langchain_community.vectorstores import FAISS
from ..ai_core.knowledge.embeddings import get_embeddings
from ..ai_core.knowledge.dynamic_loader import load_github_data, load_csv_data
from ..ai_core.knowledge.static_loader import load_static_content
from ..ai_core.knowledge.database_loader import load_database_content
import logging
import os
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

    def update_vector_store(self):
        logger.info("Updating vector store...")
        # Load all CSV files from the data directory
        csv_docs = []
        data_dir = "backend/data"
        os.makedirs(data_dir, exist_ok=True)
        os.makedirs(data_dir, exist_ok=True)  # Ensure the data directory exists
        for filename in os.listdir(data_dir):
            if filename.endswith(".csv"):
                csv_docs.extend(load_csv_data(os.path.join(data_dir, filename)))

        # Load all JSON files using the refined static_loader
        static_docs, profile_data = load_static_content()
        self.profile_data = profile_data

        # Load all data from the database
        db_docs = load_database_content()

        all_docs = csv_docs + static_docs + db_docs
        self.initialize(all_docs)
        logger.info("Vector store updated.")

    def search(self, query, k=FAISS_SEARCH_K, filter=None):
        logger.info(f"Searching FAISS for query: {query[:50]}...")
        if self.vector_store is None:
            logger.warning("FAISS vector store not initialized")
            return []
        try:
            # Pass the filter to the similarity search if it's provided
            results = self.vector_store.similarity_search(query, k=k, filter=filter)
            logger.info(f"Found {len(results)} results")
            return results
        except Exception as e:
            logger.error(f"Error in FAISS search: {str(e)}")
            return []

faiss_manager = FAISSManager()