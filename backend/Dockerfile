# Stage 1: Builder
FROM python:3.12-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements to leverage Docker cache
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Stage 2: Production image
FROM python:3.12-slim

# Set environment variables for Python and Hugging Face
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONPATH=/app
ENV HF_HOME=/tmp/.cache/huggingface

# Create a non-root user and group
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy pre-built wheels from the builder stage
COPY --from=builder /wheels /wheels

# Install dependencies from wheels
RUN pip install --no-cache-dir /wheels/*

# Copy the application code into a 'backend' subdirectory to preserve package structure
COPY backend/ /app/backend/

# Ensure correct permissions
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port the FastAPI application will run on
EXPOSE 8000

# Command to run the FastAPI application using Gunicorn with Uvicorn workers
# We specify the module path for gunicorn, and run from /app
CMD ["gunicorn", "backend.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]