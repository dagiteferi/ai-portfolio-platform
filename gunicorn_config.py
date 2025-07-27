import os

workers = int(os.environ.get('GUNICORN_PROCESSES', '2'))
threads = int(os.environ.get('GUNICORN_THREADS', '4'))
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8000')
workers = 4
worker_class = 'uvicorn.workers.UvicornWorker'
timeout = 120
keepalive = 5

# Set a cache directory for pip to speed up dependency resolution
# This will store downloaded packages and reuse them on subsequent runs
# You can change this path if you prefer a different location
import os
os.environ["PIP_CACHE_DIR"] = "/tmp/pip_cache"

