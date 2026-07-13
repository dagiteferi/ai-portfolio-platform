#!/usr/bin/env python3
"""Manually rebuild the RAG vector store from DB + static sources."""
from backend.services.knowledge_refresh import full_rebuild, get_knowledge_status

if __name__ == "__main__":
    full_rebuild()
    print("Knowledge base fully rebuilt")
    print(get_knowledge_status())
