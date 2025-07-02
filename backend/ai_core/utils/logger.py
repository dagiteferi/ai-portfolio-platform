import logging

logging.basicConfig(
    filename="chatbot.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def log_interaction(query: str, response: str):
    """
    Logs the user query and chatbot response to a file.
    
    Args:
        query (str): The user's input query.
        response (str): The chatbot's response.
    """
    logging.info(f"Query: {query}")
    logging.info(f"Response: {response}")