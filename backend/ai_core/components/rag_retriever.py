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
    user_input = state.get("input", "")

    try:
        logger.info(f"Searching knowledge base for query: {user_input}")
        docs = faiss_manager.search_combined(user_input, k=FAISS_SEARCH_K)
        
        # Filter documents if the query is about top chats and senders
        if "top chats and senders" in user_input.lower() or "chat data" in user_input.lower():
            filtered_docs = [doc for doc in docs if "top_10_chats_and_senders.csv" in doc.metadata.get("source", "")]
            state["retrieved_docs"] = filtered_docs if filtered_docs else []
        else:
            state["retrieved_docs"] = docs if docs else []

        logger.info(f"Retrieved {len(state["retrieved_docs"])} documents.")
    except Exception as e:
        logger.error(f"FAISS search failed: {e}", exc_info=True)
        state["retrieved_docs"] = []

    return state
