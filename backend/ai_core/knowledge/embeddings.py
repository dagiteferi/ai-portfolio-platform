from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings

class CustomSentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name="paraphrase-MiniLM-L3-v2"):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        """Embed a list of texts."""
        return self.model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, text):
        """Embed a single query text."""
        return self.model.encode([text], convert_to_numpy=True)[0].tolist()

def get_embeddings():
    """Returns a custom embedding instance using SentenceTransformer."""
    return CustomSentenceTransformerEmbeddings(model_name="paraphrase-MiniLM-L3-v2")