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

# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer() if os.getenv("ENV") == "development" else structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Configure standard logging to use structlog
logging.basicConfig(
    level=logging.INFO,
    handlers=[logging.StreamHandler(), logging.FileHandler('app.log')]
)

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
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
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

if __name__ == "__main__":
    port = int(os.getenv("PORT", API_PORT))
    logger.info("Starting Uvicorn server", port=port)
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )