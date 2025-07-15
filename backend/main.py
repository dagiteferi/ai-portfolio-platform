from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.endpoints.chat import router as chat_router
from backend.vector_db.faiss_manager import faiss_manager

import uvicorn
import os
import logging
import structlog
import sentry_sdk
from backend.config import API_PORT

# Define the logs directory
LOGS_DIR = "logs"

# Create the logs directory if it doesn't exist
os.makedirs(LOGS_DIR, exist_ok=True)

# Configure structlog processors
shared_processors = [
    structlog.stdlib.add_logger_name,
    structlog.stdlib.add_log_level,
    structlog.processors.TimeStamper(fmt="iso"),
]

# Configure structlog
structlog.configure(
    processors=shared_processors + [
        structlog.dev.ConsoleRenderer() if os.getenv("ENV") == "development" else structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Configure standard logging to use structlog
# This ensures that logs from other libraries also get processed by structlog
logging.basicConfig(level=logging.INFO, handlers=[]) # Remove default handlers

# Create a structlog formatter for all handlers
formatter = structlog.stdlib.ProcessorFormatter(
    processor=structlog.dev.ConsoleRenderer() if os.getenv("ENV") == "development" else structlog.processors.JSONRenderer(),
    foreign_pre_chain=shared_processors,
)

# Define specific file handlers for different log types
log_handlers = {
    "app": logging.FileHandler(os.path.join(LOGS_DIR, 'app.log')),
    "chat": logging.FileHandler(os.path.join(LOGS_DIR, 'chat.log')),
    "faiss": logging.FileHandler(os.path.join(LOGS_DIR, 'faiss.log')),
    "nodes": logging.FileHandler(os.path.join(LOGS_DIR, 'nodes.log')),
    "embeddings": logging.FileHandler(os.path.join(LOGS_DIR, 'embeddings.log')),
}

# Set formatter for all file handlers
for handler in log_handlers.values():
    handler.setFormatter(formatter)

# Add handlers to specific loggers
logging.getLogger("backend.api.endpoints.chat").addHandler(log_handlers["chat"])
logging.getLogger("backend.vector_db.faiss_manager").addHandler(log_handlers["faiss"])
logging.getLogger("backend.ai_core.agent.nodes").addHandler(log_handlers["nodes"])
logging.getLogger("backend.ai_core.knowledge.embeddings").addHandler(log_handlers["embeddings"])

# Add a console handler to the root logger for general output
root_logger = logging.getLogger()
root_logger.addHandler(logging.StreamHandler())
root_logger.addHandler(log_handlers["app"]) # General app logs

# Configure uvicorn loggers to propagate to the root logger
logging.getLogger("uvicorn.access").handlers = []
logging.getLogger("uvicorn.access").propagate = True
logging.getLogger("uvicorn.error").handlers = []
logging.getLogger("uvicorn.error").propagate = True

# Initialize Sentry SDK
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

logger = structlog.get_logger(__name__)

app = FastAPI(title="AI Portfolio Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    try:
        faiss_manager.update_vector_store()
        logger.info("FAISS vector store updated at startup.")
        app.state.profile = faiss_manager.profile_data
        logger.info("Profile data loaded at startup.")
    except Exception as e:
        logger.error("Failed to update FAISS at startup", error=str(e))

try:
    app.include_router(chat_router, prefix="/api")
    logger.info("Chat router included successfully")
except Exception as e:
    logger.error("Failed to include chat router", error=str(e))
    raise

@app.get("/health")
async def health_check():
    logger.info("Health check requested")
    return {"status": "healthy"}

