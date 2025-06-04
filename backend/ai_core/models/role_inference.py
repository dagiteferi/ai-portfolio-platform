def infer_role(query: str) -> bool:
    """
    Infers the user's role based on query keywords.
    
    Args:
        query (str): The user's input query.
    
    Returns:
        bool: True if recruiter, False if visitor.
    """
    query = query.lower()
    recruiter_keywords = ["hire", "job", "recruit", "position", "technical", "interview"]
    return any(keyword in query for keyword in recruiter_keywords)