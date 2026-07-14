import os

# Hugging Face Spaces expect the app on $PORT (usually 7860).
port = os.environ.get("PORT") or os.environ.get("GUNICORN_PORT") or "7860"
bind = os.environ.get("GUNICORN_BIND", f"0.0.0.0:{port}")

# One worker avoids 4x embedding/FAISS cold starts on CPU Spaces.
workers = int(os.environ.get("GUNICORN_PROCESSES", "1"))
threads = int(os.environ.get("GUNICORN_THREADS", "4"))
worker_class = "uvicorn.workers.UvicornWorker"

# Embedding + first chat can be slow on CPU.
timeout = int(os.environ.get("GUNICORN_TIMEOUT", "180"))
keepalive = 5
graceful_timeout = 30

os.environ.setdefault("PIP_CACHE_DIR", "/tmp/pip_cache")
os.environ.setdefault("HF_HOME", "/tmp/.cache/huggingface")
os.environ.setdefault("TRANSFORMERS_CACHE", "/tmp/.cache/huggingface")
os.environ.setdefault("SENTENCE_TRANSFORMERS_HOME", "/tmp/.cache/sentence_transformers")
