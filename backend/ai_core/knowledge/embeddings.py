from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings
import logging
import torch

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('embeddings.log')
    ]
)
logger = logging.getLogger(__name__)

class CustomSentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2", batch_size=32):
        """
        Initialize the embeddings with lazy loading.
        
        Args:
            model_name (str): SentenceTransformer model name.
            batch_size (int): Batch size for embedding documents.
        """
        self.model_name = model_name
        self.batch_size = batch_size
        self.model = None  # Lazy initialization
        self.device = "cpu"  # Explicitly use CPU
        logger.info(f"Initialized CustomSentenceTransformerEmbeddings with model: {model_name}, device: {self.device}")

    def _load_model(self):
        """Load the SentenceTransformer model if not already loaded."""
        if self.model is None:
            logger.info(f"Loading SentenceTransformer model: {self.model_name}")
            try:
                start_time = time.time()
                self.model = SentenceTransformer(self.model_name, device=self.device)
                end_time = time.time()
                logger.info(f"Model {self.model_name} loaded in {end_time - start_time:.2f} seconds")
            except Exception as e:
                logger.error(f"Failed to load model {self.model_name}: {str(e)}")
                raise

    def embed_documents(self, texts):
        """Embed a list of texts with batch processing."""
        self._load_model()
        logger.debug(f"Embedding {len(texts)} documents")
        try:
            embeddings = self.model.encode(
                texts,
                batch_size=self.batch_size,
                convert_to_numpy=True,
                show_progress_bar=False
            ).tolist()
            logger.debug(f"Embedded {len(texts)} documents successfully")
            return embeddings
        except Exception as e:
            logger.error(f"Error embedding documents: {str(e)}")
            raise

    def embed_query(self, text):
        """Embed a single query text."""
        self._load_model()
        logger.debug(f"Embedding query: {text[:50]}...")
        try:
            embedding = self.model.encode(
                [text],
                convert_to_numpy=True,
                show_progress_bar=False
            )[0].tolist()
            logger.debug("Query embedded successfully")
            return embedding
        except Exception as e:
            logger.error(f"Error embedding query: {str(e)}")
            raise

def get_embeddings():
    """Returns a custom embedding instance using SentenceTransformer."""
    return CustomSentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")