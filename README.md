
# AI Portfolio Platform

<p align="center">
  <img src="./frontend/public/assets/ai-portfolio.png" alt="AI Portfolio Platform" width="700"/>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dagi-b/ai-portfolio-platform)
[![Docker Pulls](https://img.shields.io/docker/pulls/dagib/ai-portfolio-platform.svg)](https://hub.docker.com/r/dagib/ai-portfolio-platform)

An open-source, enterprise-grade platform for creating and showcasing AI-powered projects. This repository provides a complete solution, including a React frontend, a Python backend with advanced RAG capabilities, and a containerized infrastructure for seamless deployment.

## Overview

The AI Portfolio Platform is designed for developers, data scientists, and AI enthusiasts to build, deploy, and demonstrate their work. It features a sophisticated chatbot powered by a Retrieval-Augmented Generation (RAG) pipeline, allowing it to answer questions and interact based on a custom knowledge base. The platform is built with a modern tech stack and follows best practices for scalability, security, and maintainability.

## Key Features

*   **Interactive AI Chatbot:** A conversational agent that leverages a RAG pipeline to provide context-aware responses.
*   **Dynamic Knowledge Base:** Easily update the chatbot's knowledge by adding or removing documents (PDFs, text files, etc.) without redeploying.
*   **User Role Analysis:** The system can infer the user's role (e.g., recruiter, developer) to tailor interactions.
*   **Scalable Architecture:** A microservices-based design using Docker and Nginx, ready for production workloads.
*   **Comprehensive UI:** A responsive and modern frontend built with React and TypeScript.
*   **Secure by Design:** Includes authentication middleware and emphasizes the use of environment variables for secrets management.

## Tech Stack

**Frontend:**
*   React
*   TypeScript
*   Tailwind CSS
*   Vite

**Backend:**
*   Python
*   FastAPI
*   Gunicorn
*   LangChain
*   FAISS (for vector storage)
*   Pinecone (optional, for cloud-based vector storage)

**Infrastructure:**
*   Docker & Docker Compose
*   Nginx

## System Architecture

The platform is composed of three main services, orchestrated by Docker Compose:

1.  **Frontend Service:** A React/TypeScript application that serves the user interface. It communicates with the backend via API calls.
2.  **Backend Service:** A FastAPI application that exposes a REST API for the frontend. It handles business logic, AI processing, and communication with the vector database.
3.  **Nginx Service:** A reverse proxy that routes incoming traffic to the appropriate service. It also serves the static frontend files in production and can be configured for SSL/TLS.

The AI core of the backend uses a RAG pipeline:
*   **Knowledge Ingestion:** Documents are loaded, chunked, and converted into vector embeddings.
*   **Vector Storage:** Embeddings are stored in a FAISS vector database for efficient similarity searches.
*   **Chat Logic:** When a user sends a message, the system retrieves relevant information from the knowledge base, combines it with the conversation history, and generates a response using a large language model.

## Documentation

For a deeper dive into the project's architecture, components, and integration details, please see the [full documentation here](./Docs).

## Getting Started

### Prerequisites

*   Docker and Docker Compose
*   Git
*   An environment file with your API keys (see Configuration section)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dagi-b/ai-portfolio-platform.git
    cd ai-portfolio-platform
    ```

2.  **Create the environment file:**
    Create a `.env` file in the root of the project and add the necessary environment variables. See the `backend/config.py` file for a list of required variables. **Do not commit this file to version control.**

    ```env
    # Example .env file
    GOOGLE_API_KEY="your_google_api_key"
    PINECONE_API_KEY="your_pinecone_api_key"
    # Add other configuration variables as needed
    ```

3.  **Build and run the application:**
    ```bash
    docker-compose up --build
    ```

The application will be available at `http://localhost:80`.

## Configuration

All configuration is managed through environment variables. The backend configuration is defined in `backend/config.py` and expects variables to be present in the environment. This approach avoids hardcoding sensitive information.

Key configuration variables include:
*   `GOOGLE_API_KEY`: Your API key for Google AI services.
*   `PINECONE_API_KEY`: Your API key for Pinecone (if used).
*   `EMBEDDING_MODEL_NAME`: The name of the embedding model to use.
*   `LLM_MODEL_NAME`: The name of the large language model to use.

## Deployment

The included `docker-compose.yml` file is designed for both development and production. For a production deployment, you should:

1.  **Use a production-grade server:** Deploy the application on a cloud provider like AWS, GCP, or Azure.
2.  **Configure DNS:** Point your domain to the server's IP address.
3.  **Enable HTTPS:** Modify the `nginx/config.conf` to include an SSL/TLS certificate. Let's Encrypt is a good free option.
4.  **Use a managed database:** For improved reliability, consider using a managed database service for any persistent data.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) file for details.
