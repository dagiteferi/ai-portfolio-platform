from fastapi import FastAPI
from .api.endpoints.chat import router as chat_router  # Relative import from the current directory

app = FastAPI(title="AI Portfolio Chatbot Backend")
app.include_router(chat_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)