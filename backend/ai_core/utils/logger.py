import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

def log_interaction(user_input, response):
    logger.info(f"User Input: {user_input} | Response: {response}")