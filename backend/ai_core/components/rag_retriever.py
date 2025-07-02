import logging
from typing import Dict
from backend.vector_db.faiss_manager import faiss_manager
from backend.config import SEARCH_KEYWORDS, GREETING_KEYWORDS, FAISS_SEARCH_K

logger = logging.getLogger(__name__)

def retrieve_rag_context(state: Dict) -> Dict:
    """
    Retrieves relevant documents from the knowledge base based on the user's input.
    Skips retrieval for simple greetings or small talk.
    """
    user_input = state.get("input", "").lower()

    if any(greet in user_input for greet in GREETING_KEYWORDS) and not any(kw in user_input for kw in SEARCH_KEYWORDS):
        state["retrieved_docs"] = []
        logger.info("Skipping knowledge base search for simple greeting.")
    else:
        try:
            logger.info(f"Searching knowledge base for query: {user_input}")
            docs = faiss_manager.search_combined(user_input, k=FAISS_SEARCH_K)
            state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
            logger.info(f"Retrieved {len(state['retrieved_docs'])} documents.")
        except Exception as e:
            logger.error(f"FAISS search failed: {e}", exc_info=True)
            state["retrieved_docs"] = []

    return state
