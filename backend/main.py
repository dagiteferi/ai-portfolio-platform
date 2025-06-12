from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints.chat import router as chat_router
import uvicorn
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Portfolio Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    app.include_router(chat_router, prefix="/api/chatbot")  # Updated prefix to match test script
    logger.info("Chat router included successfully")
except Exception as e:
    logger.error(f"Failed to include chat router: {str(e)}")
    raise

@app.get("/health")
async def health_check():
    """Health check endpoint for testing server status."""
    logger.info("Health check requested")
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting Uvicorn server on port {port}")
    uvicorn.run(
        "main:app",  # Relative to backend/ directory
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )