from sentence_transformers import SentenceTransformer
import logging
from backend.config import EMBEDDINGS_MODEL_NAME
from langchain_huggingface import HuggingFaceEmbeddings

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

class EmbeddingsManager:
    def __init__(self):
        self.model = None
        self.initialize_model()

    def initialize_model(self):
        logger.info(f"Initializing embeddings with model: {EMBEDDINGS_MODEL_NAME}")
        try:
            # Initialize SentenceTransformer model
            sentence_transformer_model = SentenceTransformer(EMBEDDINGS_MODEL_NAME)
            # Wrap it with HuggingFaceEmbeddings for LangChain compatibility
            self.model = HuggingFaceEmbeddings(model_name=EMBEDDINGS_MODEL_NAME, model_kwargs={'device': 'cpu'})
            logger.info(f"Model loaded and wrapped for LangChain compatibility.")
        except Exception as e:
            logger.error(f"Failed to load embeddings model: {str(e)}")
            self.model = None

    def get_embeddings(self):
        if self.model is None:
            self.initialize_model()
        return self.model

embeddings_manager = EmbeddingsManager()

def get_embeddings():
    return embeddings_manager.get_embeddings()