import asyncio
import logging
import json
import structlog
from typing import Dict, Optional, List
from backend.vector_db.faiss_manager import faiss_manager
from backend.config import FAISS_SEARCH_K
from backend.ai_core.models.gemini import GeminiClient
from langchain_core.documents import Document

logger = structlog.get_logger(__name__)

def generate_sub_queries(query: str) -> List[str]:
    """
    Uses the LLM to decompose a complex query into a list of simpler sub-queries.
    """
    prompt = f"""
    You are an expert at query decomposition. Your task is to break down a complex user question about a person named Dagmawi Teferi into 1 to 3 simple, self-contained search queries. These queries will be used to retrieve relevant documents from a vector database containing his professional and personal information. The output MUST be a JSON-formatted list of strings.

    User Question: "{query}"

    Decomposed Queries about Dagmawi Teferi (JSON List):
    """
    try:
        # Using a low temperature for deterministic, focused output
        query_generator_llm = GeminiClient(temperature=0.1)
        response_text = query_generator_llm.generate_response(system_prompt="You are a helpful assistant.", history=[], user_input=prompt)
        
        # Clean and parse the JSON output
        # The model might sometimes add markdown backticks around the JSON
        if response_text.startswith("```json"):
            response_text = response_text[7:-4].strip()

        sub_queries = json.loads(response_text)
        if isinstance(sub_queries, list):
            logger.info(f"Generated sub-queries: {sub_queries}")
            return sub_queries
        return [query] # Fallback to the original query
    except Exception as e:
        logger.error(f"Failed to generate sub-queries: {e}. Falling back to original query.")
        return [query]

def get_metadata_filter(query: str) -> Optional[Dict]:
    """
    Analyzes the query to determine if a metadata filter should be applied.
    """
    query_lower = query.lower()

    # Add a specific check for the current job to avoid ambiguity
    if "current" in query_lower and ("job" in query_lower or "role" in query_lower or "experience" in query_lower):
        return {"is_current": True}

    if "project" in query_lower or "portfolio" in query_lower:
        return {"type": "project"}
    if "skill" in query_lower or "technolog" in query_lower:
        return {"type": "skills"}
    if "experience" in query_lower or "job" in query_lower or "work" in query_lower or "role" in query_lower:
        return {"type": "experience"}
    if "education" in query_lower or "degree" in query_lower or "university" in query_lower:
        return {"type": "education"}
    if "contact" in query_lower or "email" in query_lower or "reach out" in query_lower:
        return {"type": "contact"}
    return None

async def retrieve_rag_context(state: Dict) -> Dict:
    """
    Retrieves relevant documents from the knowledge base using a multi-query strategy.
    It decomposes the main query into sub-queries, searches for each, and aggregates the results.
    """
    user_input = state.get("input", "")
    
    # Step 1: Decompose the user query into sub-queries
    sub_queries = await asyncio.to_thread(generate_sub_queries, user_input)
    
    all_retrieved_docs = []
    doc_content_set = set()

    try:
        # Step 2: Execute search for each sub-query
        for sub_query in sub_queries:
            metadata_filter = get_metadata_filter(sub_query)
            
            if metadata_filter:
                logger.info(f"Applying metadata filter: {metadata_filter} for sub-query: {sub_query}")
            
            docs = await asyncio.to_thread(faiss_manager.search, sub_query, k=FAISS_SEARCH_K, filter=metadata_filter)
            
            # Step 3: Aggregate and de-duplicate documents
            for doc in docs:
                if doc.page_content not in doc_content_set:
                    doc_content_set.add(doc.page_content)
                    all_retrieved_docs.append(doc)
                    logger.info(f"Retrieved document for sub-query '{sub_query}': {doc.metadata.get('type')} - {doc.page_content[:100]}...")

        state["retrieved_docs"] = all_retrieved_docs
        logger.info(f"Total unique documents retrieved: {len(all_retrieved_docs)}")

    except Exception as e:
        logger.error(f"FAISS multi-query search failed: {e}", exc_info=True)
        state["retrieved_docs"] = []

    return state