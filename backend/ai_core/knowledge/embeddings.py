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
        # Lazy load — importing the app should not download/load the model.
        self.model = None

    def initialize_model(self):
        if self.model is not None:
            return
        logger.info(f"Initializing embeddings with model: {EMBEDDINGS_MODEL_NAME}")
        try:
            SentenceTransformer(EMBEDDINGS_MODEL_NAME)
            self.model = HuggingFaceEmbeddings(
                model_name=EMBEDDINGS_MODEL_NAME,
                model_kwargs={"device": "cpu"},
            )
            logger.info("Model loaded and wrapped for LangChain compatibility.")
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
