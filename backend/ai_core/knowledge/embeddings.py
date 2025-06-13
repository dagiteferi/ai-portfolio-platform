from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings
import logging
import time

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('embeddings.log')]
)
logger = logging.getLogger(__name__)

class CustomSentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2", batch_size=32):
        logger.info(f"Initializing embeddings with model: {model_name}")
        self.model_name = model_name
        self.batch_size = batch_size
        self.model = None
        self.device = "cpu"

    def _load_model(self):
        if self.model is None:
            logger.info(f"Loading model: {self.model_name}")
            try:
                start_time = time.time()
                self.model = SentenceTransformer(self.model_name, device=self.device)
                logger.info(f"Model loaded in {time.time() - start_time:.2f} seconds")
            except Exception as e:
                logger.error(f"Failed to load model: {str(e)}")
                raise

    def embed_documents(self, texts):
        self._load_model()
        logger.debug(f"Embedding {len(texts)} documents")
        try:
            embeddings = self.model.encode(
                texts,
                batch_size=self.batch_size,
                convert_to_numpy=True,
                show_progress_bar=False
            ).tolist()
            logger.debug(f"Embedded {len(texts)} documents")
            return embeddings
        except Exception as e:
            logger.error(f"Error embedding documents: {str(e)}")
            raise

    def embed_query(self, text):
        self._load_model()
        logger.debug(f"Embedding query: {text[:50]}...")
        try:
            embedding = self.model.encode(
                [text],
                convert_to_numpy=True,
                show_progress_bar=False
            )[0].tolist()
            logger.debug("Query embedded")
            return embedding
        except Exception as e:
            logger.error(f"Error embedding query: {str(e)}")
            raise

def get_embeddings():
    return CustomSentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")