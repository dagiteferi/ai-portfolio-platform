# Building My AI Portfolio: A Deep Dive into the Architecture of an Open-Source RAG Agent

As an engineer working with AI technologies to build software systems, I have consistently felt that traditional portfolio websites do not offer the level of engagement I require as a professional. A simple list of my skills and past projects provides insight into what I have accomplished but does not adequately outline how I solve problems or think creatively. Therefore, I was looking for a way to create a more engaging experience for users while also allowing them to interact with an AI solution that truly understands my work.



In order to address this need, I developed a new type of portfolio that combines open-source technology with Artificial Intelligence to create an interactive experience. This solution uses Retrieval-Augmented Generation (RAG) technology to provide detailed answers to complex questions relating to my career. In this article I will detail the design of the solution including the architectural design choices I made throughout the process, as well as the lessons learned while building the application and exploring the resulting architecture.



Ultimately my problem stemmed from a lack of context when evaluating simple webpages related to my work. I chose to use a RAG based architecture since it allows for artificial intelligence solutions to generate factually accurate truths by retrieving specific information from a dedicated knowledge-base - in this scenario, I used my own resume, project documentation, and historical background as the source data for building the knowledge-base.

### Project Overview

At its core, the system is a web platform that serves as my personal portfolio, but with an AI chatbot that acts as my personal agent. Visitors can ask it complex questions like:

*   "What was your role in the project involving FastAPI and what were the key performance optimizations you implemented?"
*   "Which of your skills are most relevant for a backend-focused role in a fintech company?"
*   "Can you explain the architecture of this AI portfolio project?" (A fun, meta-question it can actually answer).

The AI doesn’t just guess; it retrieves relevant documents from a specialized database, synthesizes the information, and provides a coherent, accurate answer. The entire platform is containerized, open-source, and designed for both local development and production deployment.

### System Architecture

I architectured a solution where all functional components of the application (UI, API, and AI Server) can be designed and deployed as independent entities. This was an important decision I made as the only developer; it allows me to break down the system into smaller pieces that are easier to understand and maintain.


The following is the high-level overview of how the data moves through the entire system.

1.  A user interacts with the **React** frontend and sends a message to the chatbot.
2.  An **NGINX** reverse proxy routes the API request to the backend.
3.  The **FastAPI backend** receives the request, handles the chat session, and forwards the query to the AI core.
4.  The **AI Core** orchestrates the RAG pipeline:
    *   The **RAG Retriever** queries a **Vector Database** (like FAISS or Pinecone) to find the most relevant information from my professional history.
    *   The **Response Generator** constructs a detailed prompt containing the user's query and the retrieved context.
    *   This prompt is sent to a Large Language Model (LLM), in this case, **Google's Gemini**.
5.  The LLM generates a response, which flows back through the system to the user's screen.
6.  All my structured data (portfolio items, user info) is stored in a **PostgreSQL** database.

This modular architecture makes the system robust and maintainable. Let's dive into each component.

### RAG Pipeline Deep Dive

This Project centers around having the AI respond correctly to questions; this is provided through the ai_core module of the Backend and is built as an independent RAG Engine.

**1. Data Ingestion and Embeddings**

Data ingestion and embeddings are used to populate the Knowledge Base in RAG Systems. A versatile Data Ingestion pipeline has been built for processing Information from multiple different sources.

*   **Knowledge Sources:** The system can load data from a variety of places. I've configured it to process local files, scrape Git repositories (using `gitScraper.py`), and even pull from dynamic sources like my exported Instagram and Telegram data. This is all managed by the services in the `backend/ai_core/knowledge/` directory.
*   **Chunking:** Documents are broken down into smaller, semantically meaningful chunks using my `chunker.py` module. This is critical for retrieval accuracy; I found that if chunks are too large, the context is diluted, and if they're too small, it’s fragmented.
*   **Embedding Generation:** Each chunk is then converted into a numerical representation (a vector embedding). I opted for Google's `text-embedding-005` model due to its performance. The `embeddings.py` service handles this conversion.

**2. Vector Storage and Retrieval**

These vector embeddings are stored in a vector database, which is optimized for finding the "closest" or most semantically similar vectors to a given query vector.

*   **Flexible Vector Stores:** I designed the system to support multiple vector databases. The `backend/vector_db/` directory contains managers for **FAISS**, a library that's perfect for local development, and **Pinecone**, a managed service ideal for production. This choice is configurable via environment variables, which saved me a lot of headaches when moving between local and cloud environments.
*   **Retrieval:** When a user asks a question, the `RAGRetriever` component (`ai_core/components/rag_retriever.py`) converts the query into an embedding and searches the vector database for the top-k most similar document chunks.

**3. Response Generation**

Simply returning the raw retrieved chunks would be unhelpful. The final step is to use an LLM to synthesize this information into a human-readable answer.

*   **Prompt Engineering:** The `ResponseGenerator` (`ai_core/components/response_generator.py`) uses templates from `prompt_templates.py` to construct a detailed prompt. I spent a good amount of time iterating on this prompt to instruct the LLM to act as a professional agent and answer the user's query *only* using the provided context. This grounding is what minimizes hallucinations.
*   **LLM Integration:** The system uses Google's Gemini model via the `ai_core/models/gemini.py` module to generate the final response.
*   **Stateful Agent:** For more complex interactions, I implemented a stateful agent using a graph-based approach (`ai_core/agent/`). This allows the AI to maintain context across multiple turns in a conversation, leading to a more natural and intelligent dialogue.

### Frontend Design Decisions

For the user interface, my goal was a clean, modern, and intuitive experience. I chose a stack I'm very comfortable with:

*   **React & TypeScript:** For building a robust, type-safe, and component-based UI. TypeScript was non-negotiable for me to maintain code quality as the project grew.
*   **Tailwind CSS:** For rapid, utility-first styling. This lets me build and iterate on UIs quickly without getting bogged down in separate CSS files.

The frontend is organized into two main areas:

1.  **The Public Portfolio:** This includes standard sections like a hero, about me, projects, and work experience. The data is fetched from the backend API and rendered into components found in `frontend/src/components/`.
2.  **The AI Chat & Admin Dashboard:**
    *   The `Chat` component is the primary interface for interacting with the AI agent. It manages the conversation state using a custom hook (`useChat.ts`) and communicates with the backend's `/chat` endpoint.
    *   The `AdminDashboardPage.tsx` provides a secure area where I can log in to manage my portfolio content, upload new documents to the AI's knowledge base, and view system statistics.

This separation makes the public-facing site fast and lightweight, while providing powerful management tools for myself behind an authentication layer.

### Backend & API Design

I chose FastAPI for the backend because of its incredible performance, automatic OpenAPI documentation, and reliance on Pydantic for data validation. The backend has three main responsibilities:

1.  **Serving Portfolio Content:** Standard CRUD endpoints provide the frontend with all the necessary data for my work experience, projects, skills, etc.
2.  **Orchestrating the AI/RAG Pipeline:** The `/api/chat` endpoint is the gateway to the AI. It receives the user's query, invokes the `ai_core` to execute the RAG pipeline, and streams the response back to the client.
3.  **Managing the Knowledge Base:** Endpoints under `/api/knowledge` allow me to trigger the data ingestion process, effectively "teaching" the AI new information by adding documents to its RAG corpus.

The code is highly modular. I made a conscious decision to keep the web-facing API logic in `backend/api/` completely decoupled from the AI logic in `backend/ai_core/`. This means I could easily swap out the FastAPI framework for another, or use the `ai_core` in a completely different application, without a major refactor.

### Database & Storage Choices

A project like this requires a hybrid storage strategy. I realized early on that I couldn't rely on a single database to handle both structured and unstructured data efficiently.

*   **PostgreSQL for Structured Data:** I chose PostgreSQL as the primary relational database to store all the structured portfolio content. Its reliability and the power of SQLAlchemy (my ORM) and Alembic (for database migrations) make it a solid choice for managing well-defined data like project details or work history. The schema is defined in `backend/models/sql_models.py`.
*   **Vector Database for AI Knowledge:** As discussed, a vector database (FAISS/Pinecone) is used for the unstructured text data that fuels the RAG pipeline.
*   **Supabase Storage for Files:** For handling file uploads, like my resume PDF or project images, I integrated Supabase. The `backend/services/file_upload.py` service uses the Supabase client to store these files, which keeps large binary data out of my primary database.

### Infrastructure & Deployment

For local development, I wanted a simple, one-command setup. For the public-facing deployment, my goal was to leverage the best free-tier platforms available to keep costs at zero.

*   **Local Development (Docker):** The entire application is containerized. The `docker-compose.yml` file in the root directory is the key to the local setup. With a single command (`docker-compose up`), anyone can spin up the entire stack: the React frontend, the FastAPI backend, and the PostgreSQL database.
*   **Production Deployment (The Free-Tier Stack):**
    *   **Frontend:** I deployed the React application on **Vercel**. Its seamless Git integration and global CDN are perfect for a fast user experience.
    *   **Backend & AI:** The FastAPI backend, which includes the AI agent, is deployed on **Hugging Face Spaces**. This was a natural choice, as it keeps the AI models and the API that serves them in the same ecosystem.
    *   **Database:** The PostgreSQL database is a managed instance from **Supabase**. Supabase also handles file storage for the RAG knowledge base, which was a nice bonus.
*   **The Trade-offs of "Free":** One trade-off I accepted with this approach is the limitations of free tiers. These services can "go to sleep" after periods of inactivity, which might cause a delay on the first visit. Resource allocations are also limited, but for a personal portfolio project, this was a perfectly acceptable compromise to avoid infrastructure costs.
*   **Environment Configuration:** All configuration is managed through environment variables, following the 12-factor app methodology. The `.env.example` file serves as a template for both local and production setups.

### Open-Source Design Philosophy

I structured the repository to be as clear and welcoming as possible for anyone who might want to learn from it.

*   **Clear Folder Structure:** The top-level directories (`frontend/`, `backend/`, `infrastructure/`) create a clean separation of concerns.
*   **Modularity:** Inside the backend, the `ai_core` is the most significant example of modularity. It’s a powerful, self-contained AI engine that could be published as its own library.
*   **Extensibility:** I designed the system so that adding a new data loader to the RAG pipeline or a new vector database is straightforward. You simply implement a new class that conforms to the existing interface and update the configuration.

### Challenges & Lessons Learned

Building this system was an incredible learning experience, but it wasn't without its challenges.

*   **Prompt Engineering is an Art:** One trade-off I accepted was the time it would take to get the prompts right. Getting the LLM to consistently use the provided context and avoid falling back on its internal knowledge required a lot of experimentation with the prompt templates. The phrasing has to be precise.
*   **The "Lost in the Middle" Problem:** When providing a lot of retrieved context to an LLM, information in the middle of the context window can sometimes be ignored. I had to fine-tune the number of retrieved documents (`top_k`) and the chunk size to find a sweet spot between providing enough context and not overwhelming the model.
*   **State Management in Agents:** Building a stateful chat agent is significantly more complex than a simple request-response RAG pipeline. Managing the conversation history and ensuring it's used effectively in subsequent turns required careful design of the agent graph. This decision simplified the user experience but introduced a lot of backend complexity.
*   **Navigating Free-Tier Limitations:** While using free services from Vercel, Hugging Face, and Supabase was great for my budget, it came with its own set of challenges. The primary issue was dealing with services "going to sleep." This meant the first user to visit the site after a period of inactivity would experience a significant cold start delay. I learned to communicate this possibility and accept it as a reasonable trade-off for a personal project that costs nothing to run.

### Future Improvements

This project is a living system, and I have many ideas for its future:

*   **Advanced Retrieval Strategies:** I plan to explore more sophisticated retrieval techniques, such as hybrid search (combining keyword and semantic search) or re-ranking models to improve the quality of the retrieved context.
*   **Automated Knowledge Updates:** I want to set up a CI/CD pipeline that automatically re-indexes the knowledge base whenever I update my resume or add a new project to my Git repositories.
*   **Full Streaming for Chat:** While the backend is capable, I haven't fully implemented end-to-end streaming to the frontend. This would create a much more dynamic and responsive user experience.

### Conclusion

Building this AI portfolio has been a rewarding journey. It forced me to think not just as a developer, but as a system architect, a data engineer, and a product designer. The result is a portfolio that doesn't just list my skills—it demonstrates them in real-time. It’s a testament to the power of modern AI tools to create truly personal and interactive experiences.

I believe this open-source project can serve as a valuable resource for the community. Whether you're looking to build your own AI agent, learn about RAG architecture, or simply find a well-structured, production-ready reference project, I hope you find it useful.

### Repository & Contribution Guide

You can see the live project here and explore the full codebase on GitHub.

*   **Live Demo:** [https://dagmawi-teferi.vercel.app/](https://dagmawi-teferi.vercel.app/)
*   **Repository:** [https://github.com/dagiteferi/ai-portfolio-platform](https://github.com/dagiteferi/ai-portfolio-platform)

To get started with the code, simply clone the repository, configure your `.env` file based on the `.env.example`, and run `docker-compose up --build`.

I welcome contributions of all kinds, from bug fixes and documentation improvements to new features. Please feel free to open an issue or submit a pull request. The project is licensed under the MIT License.
