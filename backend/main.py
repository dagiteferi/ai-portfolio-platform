from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.endpoints.chat import router as chat_router
from backend.vector_db.faiss_manager import faiss_manager
from backend.ai_core.knowledge.static_loader import load_static_content
from backend.ai_core.knowledge.dynamic_loader import load_csv_data
import uvicorn
import os
import logging
from backend.config import API_PORT

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('app.log')]
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

# Initialize FAISS vector store
try:
    # Load static content (JSON)
    static_documents, profile = load_static_content(source="all")
    
    # Load dynamic content (CSV)
    csv_documents = []
    data_dir = "backend/data"
    for filename in os.listdir(data_dir):
        if filename.endswith(".csv"):
            file_path = os.path.join(data_dir, filename)
            csv_documents.extend(load_csv_data(file_path))
            
    # Combine all documents
    all_documents = static_documents + csv_documents
    
    faiss_manager.initialize(all_documents)
    app.state.profile = profile 
    logger.info(f"FAISS vector store initialized at startup with {len(all_documents)} documents")
except Exception as e:
    logger.error(f"Failed to initialize FAISS at startup: {str(e)}")

try:
    app.include_router(chat_router, prefix="/api")
    logger.info("Chat router included successfully")
except Exception as e:
    logger.error(f"Failed to include chat router: {str(e)}")
    raise

@app.get("/health")
async def health_check():
    logger.info("Health check requested")
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", API_PORT))
    logger.info(f"Starting Uvicorn server on port {port}")
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )