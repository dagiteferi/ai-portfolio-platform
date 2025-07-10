import logging
from typing import Dict
from backend.vector_db.faiss_manager import faiss_manager
from backend.config import FAISS_SEARCH_K

logger = logging.getLogger(__name__)

def retrieve_rag_context(state: Dict) -> Dict:
    """
    Retrieves relevant documents from the knowledge base based on the user's input.
    """
    user_input = state.get("input", "")

    try:
        logger.info(f"Searching knowledge base for query: {user_input}")
        docs = faiss_manager.search(user_input, k=FAISS_SEARCH_K)
        state["retrieved_docs"] = docs if docs else []

        if docs:
            for doc in docs:
                logger.info(f"Retrieved document content: {doc.page_content}")

        logger.info(f"Retrieved {len(state["retrieved_docs"])} documents.")
    except Exception as e:
        logger.error(f"FAISS search failed: {e}", exc_info=True)
        state["retrieved_docs"] = []

    return state
