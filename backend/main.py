from fastapi import FastAPI
from backend.api.endpoints.chat import router as chat_router

app = FastAPI(title="AI Portfolio Chatbot Backend")
app.include_router(chat_router)