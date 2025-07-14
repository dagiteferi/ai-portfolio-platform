# AI Portfolio Chatbot Backend Documentation: Comprehensive Guide

Welcome to the comprehensive backend documentation for the AI Portfolio Chatbot! This document is designed to provide a deep, end-to-end understanding of the project's architecture, core components, and the intricate workings of its AI.This guide will equip you to confidently discuss, debug, extend, and contribute to the codebase.

This documentation serves as both a technical manual and an onboarding guide, clearly explaining the "what," "why," and "how" of the backend system.

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Project Overview & Core Concepts](#2-project-overview--core-concepts)
    *   [Retrieval-Augmented Generation (RAG)](#retrieval-augmented-generation-rag)
    *   [LangGraph](#langgraph)
3.  [Backend Features](#3-backend-features)
4.  [Backend Folder Structure](#4-backend-folder-structure)
5.  [End-to-End Backend Code Walkthrough](#5-end-to-end-backend-code-walkthrough)
    *   [`main.py` - The Application Entry Point](#mainpy---the-application-entry-point)
    *   [`api/endpoints/chat.py` - The Chat API Endpoint](#apiendpointschatpy---the-chat-api-endpoint)
    *   [`ai_core/agent/graph.py` - The LangGraph Orchestrator](#ai_coreagentgraphpy---the-langgraph-orchestrator)
    *   [`ai_core/agent/nodes.py` - The Agent's Steps (Orchestration Layer)](#ai_coreagentnodespy---the-agents-steps-orchestration-layer)
    *   [`ai_core/components/` - The Modular AI Functions](#ai_corecomponents---the-modular-ai-functions)
        *   [`input_processor.py`](#input_processorpy)
        *   [`role_analyzer.py`](#role_analyzerpy)
        *   [`rag_retriever.py`](#rag_retrieverpy)
        *   [`response_generator.py`](#response_generatorpy)
        *   [`memory_updater.py`](#memory_updaterpy)
    *   [`ai_core/knowledge/` - Your Knowledge Base](#ai_coreknowledge---your-knowledge-base)
        *   [`static_loader.py`](#static_loaderpy)
        *   [`dynamic_loader.py`](#dynamic_loaderpy)
        *   [`embeddings.py`](#embeddingspy)
    *   [`ai_core/models/gemini.py` - The LLM Client](#ai_coremodelsgeminipy---the-llm-client)
    *   [`ai_core/utils/prompt_templates.py` - The Prompt Engineer](#ai_coreutilsprompt_templatespy---the-prompt-engineer)
    *   [`vector_db/faiss_manager.py` - The Vector Database Manager](#vector_dbfaiss_managerpy---the-vector-database-manager)
    *   [`config.py` - Centralized Configuration](#configpy---centralized-configuration)
    *   [`scripts/knowledge_update.py`](#scripts/knowledge_update.py)
6.  [How the AI Works (End-to-End Flow)](#6-how-the-ai-works-end-to-end-flow)
7.  [Getting Started & Running the Backend](#7-getting-started--running-the-backend)
    *   [Prerequisites](#prerequisites)
    *   [Setup Instructions](#setup-instructions)
    *   [Running the Backend](#running-the-backend)
8.  [Future Improvements & Considerations](#8-future-improvements--considerations)

## 1. Introduction

Welcome to the comprehensive backend documentation for the AI Portfolio Chatbot! This document is designed to provide a deep, end-to-end understanding of the project's architecture, core components, and the intricate workings of its AI.This guide will equip you to confidently discuss, debug, extend, and contribute to the codebase.

The primary goal of this backend is to power an intelligent chatbot that acts as my personal AI agent. It answers questions about my profile, projects, and skills, adapting its responses based on the user's role (e.g., a friendly visitor or a professional recruiter). This is achieved through a sophisticated combination of Retrieval-Augmented Generation (RAG) and a state-machine-based agent orchestration using LangGraph.

This documentation serves as both a technical manual and an onboarding guide, clearly explaining the "what," "why," and "how" of the backend system.

## 2. Project Overview & Core Concepts

At its heart, this project is a **Retrieval-Augmented Generation (RAG)** system orchestrated by a **LangGraph** agent.

### Retrieval-Augmented Generation (RAG)

Imagine you have a vast library of information (your knowledge base). When someone asks a question, instead of trying to answer from memory alone, you first quickly find the most relevant "books" (retrieval) and then use those books to formulate a precise answer (generation). That's RAG. In my case, the "books" are documents about my profile, and the "librarian" is a vector database.

**Why RAG?**

*   **Accuracy & Factuality:** RAG grounds the LLM's responses in specific, verifiable information from my portfolio, reducing hallucinations and ensuring accuracy.
*   **Up-to-Date Information:**  can update my portfolio content without retraining the entire LLM.
*   **Reduced LLM Size:** The LLM doesn't need to memorize  entire portfolio; it only needs to be good at understanding context and generating text.

### LangGraph

Think of LangGraph as a blueprint for how my AI thinks and acts. It allows  to define a sequence of steps (nodes) and decisions (edges) that the AI follows to process a user's input, retrieve information, generate a response, and update its memory. It's a state machine that ensures a structured and predictable flow for complex AI interactions.

**Why LangGraph?**

*   **Orchestration:** Provides a clear, visual way to define complex AI workflows.
*   **Modularity:** Each step (node) can be a self-contained function, making the system easier to develop, test, and maintain.
*   **State Management:** Manages the flow of information (state) between different AI components.
*   **Debugging:** The graph structure makes it easier to trace the execution path and debug issues.

## 3. Backend Features

*   **AI-Powered Chatbot:** An intelligent chatbot that can answer questions about my projects, skills, and experience.
*   **Retrieval-Augmented Generation (RAG):** The chatbot uses RAG to retrieve relevant information from my portfolio content and generate accurate, context-aware responses.
*   **Role-Based Responses:** The chatbot adapts its tone and focus based on the inferred role of the user (e.g., a recruiter, a fellow developer, or a general visitor).
*   **Scalable Backend:** Built with FastAPI, designed for high performance and easy integration.
*   **Modular AI Architecture:** Components are designed for reusability and easy extension.
*   **FAISS Vector Store:** Efficiently manages and searches the knowledge base for relevant information.

## 4. Backend Folder Structure

The `backend` directory is meticulously organized to promote modularity, maintainability, and scalability. Understanding this structure is key to navigating and contributing to the project.

```
backend/
├───__init__.py
├───main.py                 # FastAPI application entry point
├───config.py               # Centralized configuration settings
├───Dockerfile              # Dockerfile for the backend service
├───requirements.txt        # Backend-specific Python dependencies
├───test_chatbot.py         # Unit tests for chatbot functionality
├───ai_core/                # Core AI logic and components
│   ├───__init__.py
│   ├───agent/              # LangGraph agent definition and nodes
│   │   ├───__init__.py
│   │   ├───graph.py        # Defines the LangGraph state machine
│   │   ├───nodes.py        # Orchestrates the agent's steps (calls components)
│   │   └───__pycache__/
│   ├───components/         # Modular, single-responsibility AI functions
│   │   ├───__init__.py
│   │   ├───input_processor.py  # Handles initial input and state normalization
│   │   ├───memory_updater.py   # Manages conversation history
│   │   ├───rag_retriever.py    # Performs knowledge base retrieval
│   │   ├───response_generator.py # Generates AI responses using LLM
│   │   └───role_analyzer.py    # Infers user's role (recruiter/visitor)
│   ├───knowledge/          # Data loading and embedding generation
│   │   ├───__init__.py
│   │   ├───chunker.py      # (Placeholder for future text splitting)
│   │   ├───dynamic_loader.py # (Placeholder for dynamic content loading)
│   │   ├───embeddings.py   # Handles text embedding generation
│   │   ├───gitScraper.py   # (Placeholder for Git repo scraping)
│   │   ├───static_loader.py  # Loads static knowledge base content
│   │   └───__pycache__/
│   ├───memory/             # (Currently unused, but for future session management)
│   │   ├───history_store.py
│   │   └───session_manager.py
│   ├───models/             # Large Language Model (LLM) integrations
│   │   ├───__init__.py
│   │   ├───gemini.py       # Gemini LLM client
│   │   ├───role_inference.py # (Potentially for more advanced role inference)
│   │   └───__pycache__/
│   └───utils/              # Utility functions
│       ├───__init__.py
│       ├───logger.py       # Custom logging setup
│       ├───prompt_templates.py # Generates dynamic system prompts
│       ├───token_utils.py  # (Placeholder for token counting)
│       └───__pycache__/
├───api/                    # API endpoints and middleware
│   ├───__init__.py
│   ├───endpoints/          # Specific API routes
│   │   ├───__init__.py
│   │   ├───admin.py        # (Placeholder for admin functions)
│   │   ├───chat.py         # Main chat endpoint
│   │   ├───knowledge.py    # (Placeholder for knowledge management API)
│   │   └───__pycache__/
│   ├───middlewares/        # (Placeholder for FastAPI middleware)
│   │   ├───auth.py
│   │   └───session.py
│   └───__pycache__/
├───scripts/                # Utility scripts
│   ├───db_setup.py         # (Placeholder for database setup)
│   └───knowledge_update.py # (Placeholder for knowledge base updates)
├───vector_db/              # Vector database integrations
│   ├───faiss_manager.py    # Manages FAISS vector store
│   ├───pinecone_manager.py # (Placeholder for Pinecone integration)
│   └───__pycache__/
└───.pytest_cache/          # Python test cache
```

## 5. End-to-End Backend Code Walkthrough

Let's trace the journey of a user's message through the backend, explaining each component's role in detail. This section provides a technical deep-dive into the core functionalities.

### `main.py` - The Application Entry Point

*   **Purpose:** This is the primary entry point for the FastAPI application. It handles the initialization of the web server, middleware configuration, and the setup of critical services like the FAISS vector store upon application startup.
*   **Key Responsibilities:**
    *   **FastAPI Application Instance:** Creates the FastAPI application instance (`app = FastAPI(...)`), which is the foundation of our web API.
    *   **CORS Configuration:** Configures Cross-Origin Resource Sharing (CORS) using `CORSMiddleware`. This is crucial for allowing a frontend application (e.g., running on `localhost:3000`) to securely communicate with this backend API.
    *   **FAISS Vector Store Initialization:** At startup, it calls `faiss_manager.update_vector_store()`. This function is responsible for loading all static and dynamic knowledge (from JSON and CSV files), processing it, and initializing the FAISS vector store. It also loads the profile data into `app.state.profile` to make it available to the chat endpoint.
    *   **API Endpoint Mounting:** Mounts the chat API endpoints (defined in `api/endpoints/chat.py`) under the `/api` path using `app.include_router(chat_router, prefix="/api")`. This makes the `/api/chat` endpoint accessible.
    *   **Uvicorn Server Startup:** Starts the Uvicorn ASGI server (`uvicorn.run(...)`), making the FastAPI application accessible over HTTP.

### `api/endpoints/chat.py` - The Chat API Endpoint

*   **Purpose:** This file defines the `/api/chat` endpoint, which is the primary interface for external clients (like a frontend application or Swagger UI) to interact with the chatbot. It receives user messages and orchestrates the AI's response generation process.
*   **Key Responsibilities:**
    *   **Request Data Validation:** Defines the expected structure of incoming JSON requests (e.g., `message`, `user_name`, `history`) using Pydantic's `ChatRequest(BaseModel)`. This ensures robust data validation, preventing malformed requests from reaching the core AI logic.
    *   **Endpoint Registration:** Registers the `chat_endpoint` asynchronous function to handle HTTP POST requests to `/api/chat` using the `@router.post("/chat")` decorator.
    *   **LangGraph Initialization:** Initializes the LangGraph state machine (`graph = create_chatbot_graph()`). This graph encapsulates the entire flow of how the AI processes a request, from input to response.
    *   **Initial State Preparation:** Prepares the `initial_state` dictionary containing essential data such as the user's input, conversation history, and the user's profile (from `request.app.state.profile`), which is passed into the LangGraph for processing.
    *   **LangGraph Execution:** Executes the core AI logic by asynchronously running the LangGraph (`response_state = await graph.ainvoke(initial_state)`). This is where the `initial_state` traverses through all the defined nodes and edges of the graph.
    *   **Response Extraction and Return:** Extracts the final generated response from the `response_state` and returns it as a JSON object to the client.

### `ai_core/agent/graph.py` - The LangGraph Orchestrator

*   **Purpose:** This file is the "brain" of the AI, defining the state machine that dictates the flow of information and processing steps. It leverages LangGraph to create a directed graph of operations, ensuring a structured and predictable AI workflow.
*   **Key Responsibilities:**
    *   **State Definition:** Defines the structure of the `state` object (`class AgentState(TypedDict):`) that is passed between nodes in the graph. Each node receives and potentially modifies this `state`, maintaining the conversational context and intermediate processing results.
    *   **Workflow Initialization:** Initializes the LangGraph workflow (`workflow = StateGraph(AgentState)`) with the defined state schema.
    *   **Node Addition:** Adds individual processing steps (nodes) to the graph using `workflow.add_node("node_name", node_function)`. Each `node_function` is a reference to a function defined in `ai_core/agent/nodes.py`, representing a distinct stage in the AI's thought process.
    *   **Entry Point Definition:** Specifies the starting point of the graph execution using `workflow.set_entry_point("receive_user_input")`.
    *   **Edge Definition:** Defines the transitions between nodes using `workflow.add_edge("source_node", "target_node")`. This dictates the sequence of operations; after `source_node` completes, the updated `state` is passed to `target_node`.
    *   **Graph Termination:** Marks the end of the graph execution with `workflow.add_edge("return_response", END)`.
    *   **Graph Compilation:** Compiles the defined graph into an executable object (`return workflow.compile()`), ready to process incoming requests.

### `ai_core/agent/nodes.py` - The Agent's Steps (Orchestration Layer)

*   **Purpose:** This file serves as an orchestration layer, acting as an intermediary between the LangGraph definition (`graph.py`) and the actual functional components (`ai_core/components`). It imports the specific component functions and exposes them as "nodes" that the LangGraph can call, promoting a clean separation of concerns.
*   **Key Responsibilities:**
    *   **Component Importation:** Imports specific component functions (e.g., `from backend.ai_core.components.input_processor import process_user_input`).
    *   **Node Wrapping:** Each function within this file (e.g., `receive_user_input`, `infer_user_role`, `call_retrieve_rag_context`, `generate_response`, `update_memory`, `return_response`) corresponds to a step in the AI's thought process. These functions primarily serve as lightweight wrappers, delegating the actual work to the specialized component functions and ensuring the `state` object is correctly passed and returned.

### `ai_core/components/` - The Modular AI Functions

This directory contains the core business logic of the AI, broken down into small, reusable, and testable functions. Each component is designed with a single, well-defined responsibility, adhering to the Single Responsibility Principle.

#### `input_processor.py`
*   **Purpose:** Responsible for cleaning, normalizing, and preparing the initial user input, as well as setting up default values within the `state` object for subsequent processing stages.
*   **How it works:** Ensures that the `message` is consistently formatted as `input`, initializes the `history` list, and sets up initial `role_confidence` scores. This standardization prevents errors and ensures smooth data flow throughout the AI pipeline.

#### `role_analyzer.py`
*   **Purpose:** Infers the likely role of the user (e.g., "recruiter" or "visitor") based on keywords present in their message. This inference is crucial for tailoring the AI's tone and response strategy.
*   **How it works:** Utilizes predefined `RECRUITER_KEYWORDS` (sourced from `config.py`) to analyze the user's input. It then adjusts confidence scores for each role, which directly influences how the AI will interact in subsequent steps, ensuring a contextually appropriate response.

### `ai_core/components/rag_retriever.py`

*   **Purpose:** Implements the "Retrieval" part of the Retrieval-Augmented Generation (RAG) process. Its function is to search the knowledge base for information relevant to the user's query using a sophisticated multi-query strategy.
*   **How it works:**
    *   **Query Decomposition:** Instead of using the user's raw query directly, it first calls `generate_sub_queries()` to use an LLM to break down a potentially complex user question into several simpler, self-contained sub-queries. This allows for more targeted and comprehensive retrieval.
    *   **Metadata Filtering:** For each generated sub-query, it calls `get_metadata_filter()` to analyze the query and determine if a specific metadata filter should be applied (e.g., `{"type": "project"}` if the query is about projects). This significantly narrows down the search space and improves the relevance of retrieved documents.
    *   **Iterative Search:** It then iterates through each sub-query, performing a FAISS search with the corresponding metadata filter.
    *   **Aggregation and De-duplication:** The results from all sub-query searches are aggregated, and duplicates are removed to create a clean, comprehensive set of documents.
    *   Finally, it stores the content of these retrieved documents in `state["retrieved_docs"]`, making them available as context for the Large Language Model (LLM) during the generation phase.

#### `response_generator.py`
*   **Purpose:** Implements the "Generation" part of the RAG process. It is responsible for using the Large Language Model (LLM) to formulate the final, coherent response to the user.
*   **How it works:**
    *   Constructs a dynamic `system_prompt` by calling `prompt_templates.get_system_prompt()`. This prompt is a sophisticated combination of the inferred user role, user name, and crucially, the `retrieved_docs` from the RAG step.
    *   Initializes the `GeminiClient` (from `ai_core/models/gemini.py`) to establish communication with the Gemini LLM.
    *   Calls `gemini.generate_response(system_prompt, history, user_input)` to send the comprehensive prompt, conversation history, and current user input to the LLM. The LLM then generates a response based on this rich context.
    *   Stores the generated text in `state["response"]`, making it ready to be returned to the user.

#### `memory_updater.py`
*   **Purpose:** Manages and maintains the conversation history, allowing the AI to remember previous turns and provide contextually aware responses over time.
*   **How it works:** Appends the latest user input and the AI's generated response to the `state["history"]` list. To manage token limits and optimize performance, it typically keeps the history concise (e.g., retaining only the last 5 turns), ensuring that the LLM receives relevant but not excessive context.

### `ai_core/knowledge/` - Your Knowledge Base

This directory handles the loading, processing, and embedding of your portfolio's knowledge base, which is critical for the RAG system's effectiveness.

### `ai_core/knowledge/static_loader.py`

*   **Purpose:** Responsible for loading static profile information, project details, and personal data from predefined JSON files. This file represents the core of the personal and professional knowledge base.
*   **How it works:**
    *   It scans the `ai_core/knowledge` directory for JSON files.
    *   **`github_knowledge_base.json`:**
        *   It parses the `profile` section, creating individual `Document` objects for education, experience, skills, and projects, each with detailed metadata (e.g., `{"source": "profile", "type": "experience"}`). It specifically identifies the "current" job.
        *   It processes `repositories`, creating a `Document` for each with the repo's README content and metadata.
        *   It processes `recent_activity`, creating documents for recent GitHub events.
    *   **`personal_knowledge_base.json`:**
        *   It parses `interests`, creating documents for different categories like books, movies, etc.
        *   It processes `work_experience` in a similar way to the github experience, creating documents for each role and its responsibilities.
    *   This detailed parsing and metadata assignment are crucial for the `rag_retriever`'s ability to perform targeted searches.

### `ai_core/knowledge/dynamic_loader.py`

*   **Purpose:** Responsible for loading dynamic data from various CSV files located in the `/data` directory. This allows for easy updates to certain types of data without changing the core application code.
*   **How it works:**
    *   The `load_csv_data` function is the main entry point, which takes a file path as input.
    *   It has specific parsing logic for different CSV files, identified by their filenames:
        *   `top_10_chats_and_senders.csv`: Creates documents with chat title, sender, and message count.
        *   `cleaned_Linkdin_data.csv`: Creates detailed documents from LinkedIn profile data, including headline, summary, and location, with rich metadata.
        *   `cleaned_favorited_data.csv`, `cleaned_followers_data.csv`, `cleaned_following_data.csv`, `top_20_common_words.csv`: Each of these is parsed to create documents with relevant content and metadata.
    *   A generic handler ensures that any other CSV file is also parsed, with its columns and values turned into content and metadata.

#### `embeddings.py`
*   **Purpose:** Converts textual data (both your knowledge base documents and user queries) into numerical representations called "embeddings." These embeddings are high-dimensional vectors that capture the semantic meaning of the text, enabling efficient similarity searches.
*   **How it works:**
    *   Utilizes a `SentenceTransformer` model (e.g., `all-MiniLM-L6-v2`) to generate these embeddings.
    *   Crucially, it wraps the `SentenceTransformer` with `HuggingFaceEmbeddings` (from `langchain_huggingface`) to ensure compatibility with LangChain's vector store interfaces. This compatibility is essential for seamless integration with FAISS and other LangChain-compatible components.

### `ai_core/models/gemini.py` - The LLM Client

*   **Purpose:** Provides a robust and abstracted interface for interacting with the Google Gemini Large Language Model. This client handles the communication specifics with the Gemini API.
*   **How it works:**
    *   Initializes the `GenerativeModel` with the specified `model_name` and `temperature` (configured in `config.py`).
    *   **Key Detail:** The `system_instruction` (which defines your dynamic persona and operational rules for the AI) is passed directly during the `GenerativeModel` initialization. This is a vital mechanism for ensuring the AI consistently adopts your persona and adheres to your instructions throughout the conversation.
    *   Formats the conversation `history` and the current `user_input` into the `contents` format, which is the expected input structure for the Gemini API.
    *   Calls `model.generate_content()` to send the formatted content to the Gemini LLM and retrieve the AI's generated response.

### `ai_core/utils/prompt_templates.py` - The Prompt Engineer

*   **Purpose:** Dynamically constructs the `system_prompt` that guides the LLM's behavior. This is a critical component where the "magic" of persona, role-based responses, and contextual grounding happens, ensuring the AI responds appropriately and effectively to different users and queries.
*   **How it works:**
    *   Defines a core `persona` for Dagi, establishing the AI's identity and overall communication style.
    *   Sets `core_instructions` for the AI (e.g., "answer *only* from knowledge base," "never mention being an AI," "politely decline private info"). These instructions act as essential guardrails for the LLM's behavior.
    *   Applies `role`-specific `tone_guideline` (e.g., a professional tone for recruiters, a warm and helpful tone for general visitors) to tailor the interaction style based on the inferred user role.
    *   **Crucially, it emphasizes the importance of the "current" role by explicitly instructing the AI to prioritize and highlight any information where `is_current` is `True` in the metadata.**
    *   Combines all these elements—persona, core instructions, tone guidelines, and crucially, the `retrieved_docs` (from the RAG process)—into a single, powerful `final_prompt`. This comprehensive prompt is then sent to the Gemini LLM, providing it with all the necessary context and directives to generate an accurate and appropriate response.

### `vector_db/faiss_manager.py` - The Vector Database Manager

*   **Purpose:** Manages the FAISS (Facebook AI Similarity Search) vector store. FAISS is a highly efficient library designed for rapid similarity search on large datasets of embeddings, making it ideal for quickly retrieving relevant information from your knowledge base.
*   **How it works:**
    *   `initialize(documents)`: Takes your knowledge base documents (after they've been converted into embeddings by `embeddings.py`) and builds the FAISS index. This process makes the embedded knowledge base searchable.
    *   `search_combined(query, k)`: Takes a user's query (which is also converted into an embedding) and efficiently finds the `k` most semantically similar documents within the FAISS index. These retrieved documents are the "relevant books" for the RAG process, providing the LLM with specific, grounded context for its response generation.

### `config.py` - Centralized Configuration

*   **Purpose:** Serves as a single source of truth for all configurable parameters within the backend application. This centralized approach significantly simplifies modification and tuning of the AI's behavior without requiring changes deep within the codebase.
*   **Key Details:** Includes essential settings such as API ports, the names and temperature settings for the LLM models, the names of embedding models, parameters for FAISS searches, and keywords used for role inference and knowledge base searching. Any parameter that might vary between development, testing, and production environments, or that requires frequent tuning, is placed here to enhance maintainability and flexibility.

### `scripts/knowledge_update.py`

*   **Purpose:** Provides a mechanism for periodically updating the knowledge base with fresh data from dynamic sources.
*   **How it works:**
    *   The `update_knowledge_base` function calls `faiss_manager.update_dynamic_vector_store()`, which is responsible for re-fetching and processing data from dynamic sources like GitHub.
    *   The `main` function uses the `schedule` library to run the `update_knowledge_base` function on a daily basis at midnight. It also runs the update once on startup. This ensures that the chatbot's knowledge is kept reasonably up-to-date without manual intervention.

## 6. How the AI Works (End-to-End Flow)

This section provides a step-by-step walkthrough of how a user's message is processed by the AI, from initial input to final response, highlighting the interaction between different backend components:

1.  **User Input:** A user sends a message (e.g., "Hi Dagi, I'm a recruiter, tell me about your projects.") to the `/api/chat` endpoint of the FastAPI application.
2.  **Initial Processing (`input_processor.py`):** The `chat_endpoint` receives the message and passes it to the LangGraph. The first node (`receive_user_input`) normalizes the input and initializes the conversation `state`, ensuring data consistency for subsequent steps.
3.  **Role Inference (`role_analyzer.py`):** The next node (`infer_user_role`) analyzes the user's message for keywords (e.g., "recruiter," "visitor") to determine their role. This updates the `state` with `is_recruiter` and `role_confidence`, which will influence the AI's tone and focus.
4.  **Knowledge Retrieval (`rag_retriever.py`):** The `call_retrieve_rag_context` node checks if a knowledge base search is necessary. If so, it takes the user's query, converts it into an embedding (using `embeddings.py`), and queries the FAISS vector store (via `faiss_manager.py`) to find the most relevant documents from your portfolio's knowledge base. These documents are then added to the `state` as `retrieved_docs`.
5.  **Prompt Construction (`prompt_templates.py`):** The `generate_response` node then calls `get_system_prompt` to dynamically build a comprehensive `system_prompt`. This prompt is a sophisticated blend of your core persona, specific instructions for the AI (e.g., to answer only from the knowledge base), a tone guideline tailored to the inferred user role, and the `retrieved_docs` as contextual information.
6.  **Response Generation (`gemini.py`):** The `generate_response` node initializes the `GeminiClient` and sends the dynamically constructed `system_prompt`, the conversation `history`, and the current `user_input` to the Google Gemini LLM. The LLM processes all this information to generate a coherent, context-aware, and persona-aligned response.
7.  **Memory Update (`memory_updater.py`):** The `update_memory` node adds the latest user input and the AI's generated response to the `history` in the `state`. This maintains conversational context for future turns and helps manage token limits for the LLM by keeping the history concise.
8.  **Final Response (`return_response`):** The `return_response` node extracts the final generated text from the `state` and sends it back to the user via the FastAPI endpoint, completing the request-response cycle.

## 7. Getting Started & Running the Backend

This section provides detailed instructions for setting up and running the AI Portfolio Chatbot backend. While Docker is recommended for a streamlined setup, direct execution instructions are also provided.

### Prerequisites

*   **Python 3.9+**: The backend is developed using Python 3.9 or newer.
*   **`pip`**: Python's package installer, used for managing dependencies.
*   **`uvicorn`**: An ASGI server, required to run the FastAPI application.
*   **Google Gemini API Key**: Essential for the AI backend to interact with the Gemini Large Language Model. This key should be set as an environment variable (`GOOGLE_API_KEY`).

### Setup Instructions

#### Using Docker (Recommended)

For the most straightforward setup, especially in a multi-service environment, Docker is highly recommended.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dagiteferi/ai-portfolio-platform.git
    cd ai-portfolio-platform
    ```
2.  **Set up your Google Gemini API Key:**
    *   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Create a `.env` file in the root of your project (`ai-portfolio-platform/`) and add your API key:
        ```
        GOOGLE_API_KEY="YOUR_API_KEY_HERE"
        ```
3.  **Build and run the Docker containers:**
    ```bash
    docker-compose up --build
    ```
    This command will:
    *   Build the Docker images for both the backend and any other configured services (e.g., frontend).
    *   Start all defined services, making them accessible.

4.  **Access the Backend API:**
    *   Once the services are running, you can access the Backend API's interactive documentation (Swagger UI) at: `http://localhost:8000/docs`

#### Running Backend Directly

If you prefer to run the backend application without Docker, follow these steps:

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```
2.  **Create a virtual environment and install dependencies:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```
3.  **Set up your Google Gemini API Key:**
    *   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Create a `.env` file in the `backend/` directory (if not already present) and add your API key:
        ```
        GOOGLE_API_KEY="YOUR_API_KEY_HERE"
        ```
4.  **Prepare your Knowledge Base:**
    *   Ensure your static knowledge base content (e.g., defined or loaded by `backend/ai_core/knowledge/static_loader.py`) is up-to-date with your profile, projects, and skills. This content is crucial for the RAG system's accuracy and relevance.

### Running the Backend

1.  **Start the Uvicorn server:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    *   `--reload`: This flag enables automatic server reloading when code changes are detected, which is highly convenient during development.
    *   `--host 0.0.0.0`: Makes the server accessible from any network interface, allowing access from other devices on your local network or within a Docker container.
    *   `--port 8000`: Specifies that the server will listen on port 8000.
    The backend API will then be available at `http://localhost:8000`.

## 8. Future Improvements & Considerations

This section outlines potential enhancements and important considerations for the future development of the AI Portfolio Chatbot backend:

### Production Readiness Enhancements

To ensure the chatbot backend is robust, observable, and performant in a production environment, several key enhancements have been implemented:

#### Asynchronous Operations for FAISS Search
*   **Issue Addressed:** Previously, the `faiss_manager.search` function was a synchronous call. In a FastAPI application, synchronous I/O operations can block the event loop, leading to performance bottlenecks and reduced concurrency, especially under heavy load.
*   **Solution Implemented:** The `retrieve_rag_context` function in `ai_core/components/rag_retriever.py` has been refactored to be asynchronous (`async def`). The synchronous `faiss_manager.search` call within it is now executed in a separate thread using `asyncio.to_thread()`. This offloads the potentially blocking I/O operation from the main event loop, allowing the FastAPI application to remain responsive and handle multiple concurrent requests efficiently.
*   **Code Changes:**
    *   `ai_core/components/rag_retriever.py`: `retrieve_rag_context` is now an `async` function, and `faiss_manager.search` is awaited using `await asyncio.to_thread()`. `generate_sub_queries` is also now awaited using `await asyncio.to_thread()`. 
    *   `ai_core/agent/nodes.py`: The `call_retrieve_rag_context` function is now an `async` function and `await`s the call to `retrieve_rag_context`.

#### Structured Logging with `structlog`
*   **Issue Addressed:** The default Python `logging` module provides plain text logs, which are difficult to parse, filter, and analyze programmatically in a production environment. For effective monitoring and debugging, especially with centralized logging systems (like ELK stack, Datadog, Splunk), structured (e.g., JSON) logs are essential.
*   **Solution Implemented:** The logging setup has been migrated to use `structlog`. `structlog` allows for context-rich, machine-readable logs, making it easier to query and understand application behavior.
*   **Code Changes:**
    *   `backend/ai_core/utils/logger.py`: This file now configures `structlog` to output JSON-formatted logs (or console-rendered logs in development). The `log_interaction` function has been updated to pass key-value pairs for structured logging.
    *   `backend/main.py`: `structlog` is configured at the application startup. Standard Python `logging` is also configured to pipe its output through `structlog`'s processors.

#### Error Tracking with Sentry
*   **Issue Addressed:** Unhandled exceptions in a production application can lead to unexpected behavior, degraded user experience, and a lack of visibility for developers. Without a dedicated error tracking system, identifying, diagnosing, and resolving these issues can be challenging.
*   **Solution Implemented:** `sentry-sdk` has been integrated into the application. Sentry is an open-source error tracking platform that automatically captures unhandled exceptions, provides detailed stack traces, context (e.g., user information, request details), and aggregates errors for easier management.
*   **Code Changes:**
    *   `backend/main.py`: `sentry_sdk.init()` is called at application startup, configured with a Data Source Name (DSN) from the `SENTRY_DSN` environment variable. This enables automatic error reporting to your Sentry project.
    *   **Configuration Note:** For Sentry to function, you must set the `SENTRY_DSN` environment variable in your production deployment.

### Other Considerations

*   **Dynamic Knowledge Base Updates:** Implement the functionality within `dynamic_loader.py` and `knowledge_update.py` to allow for real-time or scheduled updates to the knowledge base without requiring a server restart. This would enable more agile content management.
*   **Robust Session Management:** Fully utilize the `backend/ai_core/memory/` module to implement more robust session management. This would allow for persistent conversation history across multiple user interactions and potentially different sessions, enhancing the user experience.
*   **Advanced Role Inference:** Explore and integrate more sophisticated methods for user role inference beyond simple keyword matching. This could involve machine learning models or more complex linguistic analysis for greater accuracy.
*   **Frontend Integration:** Develop a dedicated React frontend (as hinted in the project structure) to provide a user-friendly and visually appealing interface for interacting with the chatbot.
*   **WhatsApp Integration:** Integrating this backend with platforms like WhatsApp would involve utilizing a WhatsApp Business API client (e.g., Twilio, MessageBird) to send and receive messages, routing them through your FastAPI backend for AI processing. This would expand the chatbot's reach.
*   **Scalability and Deployment:** Consider production-grade deployment strategies, including container orchestration (Kubernetes), load balancing, and database scaling for high-traffic scenarios.
*   **Security Enhancements:** Implement more advanced security measures, including input sanitization, rate limiting, and robust authentication/authorization for sensitive endpoints.

This comprehensive documentation provides a solid foundation for understanding, developing, and contributing to the AI Portfolio Chatbot backend. Good luck with your contributions!