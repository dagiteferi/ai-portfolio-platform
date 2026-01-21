import os
import logging
import structlog
import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.config import API_PORT
from backend.vector_db.faiss_manager import faiss_manager
from backend.ai_core.agent.graph import create_chatbot_graph
from backend.api.endpoints.chat import router as chat_router
from backend.api.endpoints.admin import router as admin_router
from backend.api.endpoints.knowledge import router as knowledge_router
from backend.api.endpoints.health import router as health_router
from backend.api.endpoints.stats import router as stats_router

LOGS_DIR = "logs"
os.makedirs(LOGS_DIR, exist_ok=True)

shared_processors = [
    structlog.stdlib.add_logger_name,
    structlog.stdlib.add_log_level,
    structlog.processors.TimeStamper(fmt="iso"),
]

structlog.configure(
    processors=shared_processors + [
        structlog.dev.ConsoleRenderer() if os.getenv("ENV") == "development" else structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logging.basicConfig(level=logging.INFO, handlers=[])

formatter = structlog.stdlib.ProcessorFormatter(
    processor=structlog.dev.ConsoleRenderer() if os.getenv("ENV") == "development" else structlog.processors.JSONRenderer(),
    foreign_pre_chain=shared_processors,
)

log_handlers = {
    "app": logging.FileHandler(os.path.join(LOGS_DIR, 'app.log')),
    "chat": logging.FileHandler(os.path.join(LOGS_DIR, 'chat.log')),
    "faiss": logging.FileHandler(os.path.join(LOGS_DIR, 'faiss.log')),
    "nodes": logging.FileHandler(os.path.join(LOGS_DIR, 'nodes.log')),
    "embeddings": logging.FileHandler(os.path.join(LOGS_DIR, 'embeddings.log')),
}

for handler in log_handlers.values():
    handler.setFormatter(formatter)

logging.getLogger("backend.api.endpoints.chat").addHandler(log_handlers["chat"])
logging.getLogger("backend.vector_db.faiss_manager").addHandler(log_handlers["faiss"])
logging.getLogger("backend.ai_core.agent.nodes").addHandler(log_handlers["nodes"])
logging.getLogger("backend.ai_core.knowledge.embeddings").addHandler(log_handlers["embeddings"])

root_logger = logging.getLogger()
root_logger.addHandler(logging.StreamHandler())
root_logger.addHandler(log_handlers["app"])

logging.getLogger("uvicorn.access").handlers = []
logging.getLogger("uvicorn.access").propagate = True
logging.getLogger("uvicorn.error").handlers = []
logging.getLogger("uvicorn.error").propagate = True

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

logger = structlog.get_logger(__name__)

app = FastAPI(title="AI Portfolio Chatbot Backend")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
        app.state.graph = create_chatbot_graph()
        logger.info("Chatbot graph created and cached at startup.")
    except Exception as e:
        logger.error("Failed to complete startup tasks", error=str(e))

try:
    app.include_router(health_router, prefix="/api")
    app.include_router(chat_router, prefix="/api")
    app.include_router(admin_router, prefix="/api")
    app.include_router(knowledge_router, prefix="/api")
    app.include_router(stats_router, prefix="/api")
    logger.info("All routers included successfully")
except Exception as e:
    logger.error("Failed to include routers", error=str(e))
    raise
