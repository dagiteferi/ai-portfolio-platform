import structlog

logger = structlog.get_logger(__name__)

def log_interaction(user_input, response):
    logger.info("User Interaction", user_input=user_input, response=response)