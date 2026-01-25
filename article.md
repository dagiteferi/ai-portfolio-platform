# Beyond the Resume: Architecting an AI-Powered Portfolio with RAG and LangGraph

## Introduction

For years, I struggled with a common engineering paradox: the more complex my work became, the harder it was to represent on a static page. A PDF resume or a standard portfolio site could list my skills, but they couldn't demonstrate my ability to solve problems or explain architectural trade-offs.

I realized that if I wanted to truly showcase my expertise in AI and full-stack development, I shouldn't just *talk* about it—I should *build* it. I needed a platform that could represent me when I wasn't there, answering questions with the same context and nuance that I would provide in an interview.

This motivation led me to build the **AI Portfolio Platform**, an open-source system that combines a modern React frontend with a sophisticated RAG (Retrieval-Augmented Generation) backend. It’s not just a website; it’s an autonomous agent trained on my professional life.

## Project Overview

The system serves two distinct audiences: visitors (recruiters, developers) and myself (the admin). You can see the live version here: [https://dagmawi-teferi.vercel.app/](https://dagmawi-teferi.vercel.app/)

For visitors, it offers a polished, responsive interface where they can explore my projects and chat with an AI agent. This agent isn't a generic chatbot; it has access to a structured database of my career history, allowing it to answer specific questions like *"How did Dagmawi handle scaling in his last project?"* or *"What is his proficiency in Python?"*

For me, it provides a secure Admin Dashboard to manage this data. Instead of editing code to update my portfolio, I built a CMS that allows me to add projects, update work experience, and monitor the system's performance in real-time.

## System Architecture

I architected the system to be modular, separating the presentation layer from the intelligence layer.

*   **Frontend**: A **React** application built with **TypeScript** and **Tailwind CSS**. I prioritized performance and interactivity, using **React Query** to manage server state and caching.
*   **Backend**: A **FastAPI** service that acts as the central orchestrator. It handles API requests, manages authentication, and executes the AI workflow.
*   **AI Engine**: The core intelligence is built on **LangGraph** and **Google Gemini**. I chose a graph-based approach over a linear chain to allow for more complex, stateful reasoning loops.
*   **Data Layer**: I used **PostgreSQL** for structured relational data (projects, skills, logs) and **FAISS** for vector storage. This hybrid approach ensures data integrity while enabling semantic search.

## RAG Pipeline Deep Dive

The Retrieval-Augmented Generation pipeline is the heart of this project. I didn't want a system that simply "looked up keywords." I needed it to understand intent.

### 1. Ingestion and Embedding
I wrote a custom ingestion script (`database_loader.py`) that pulls data from PostgreSQL and formats it into rich, semantic text chunks. For example, a project record isn't just dumped as JSON; it's formatted into a narrative string: *"Project: AI Portfolio. Category: Web Dev. Description: A RAG-based system..."*. I then generate embeddings for these chunks and index them locally using FAISS.

### 2. Query Decomposition
One specific problem I encountered was that users often ask compound questions, such as *"Tell me about his education and his experience with React."* A simple vector search would likely retrieve documents for one topic but miss the other.

To solve this, I implemented a **Query Decomposition** step in the RAG pipeline. Before searching, the system uses a lightweight LLM call to break the user's prompt into sub-queries:
1.  *"What is his educational background?"*
2.  *"What is his experience with React?"*

This ensures that I retrieve relevant context for *both* parts of the question.

### 3. Metadata Filtering
I also added a heuristic layer (`get_metadata_filter`) that analyzes the query for intent. If a user asks about "projects," the system automatically applies a filter to search only documents tagged with `type: "project"`. This simple addition drastically reduced "noise" in the retrieval process.

### 4. The LangGraph Workflow
I modeled the agent's logic as a state machine using **LangGraph**. The graph consists of nodes like `infer_user_role`, `retrieve_rag_context`, and `generate_response`. This structure allows me to maintain conversation history and state (like the user's name or role) across multiple turns, making the interaction feel natural and coherent.

## Frontend Design Decisions

I chose **React** and **TypeScript** for the frontend to ensure type safety and maintainability. One key decision I made was to rely heavily on **React Query** (TanStack Query).

In the Admin Dashboard, this was a game-changer. When I upload a new project image or edit a skill, React Query automatically invalidates the relevant cache and refetches the data. This makes the UI feel instant and reactive without me having to write complex state management logic.

For styling, I used **Tailwind CSS**. It allowed me to rapidly prototype the "glassmorphism" aesthetic I wanted for the chat widget without wrestling with custom CSS files.

## Backend & API Design

I selected **FastAPI** for the backend because of its native support for asynchronous programming. LLM operations are I/O bound and can take several seconds. By using `async/await`, I ensured that the server remains responsive to other requests (like health checks or static asset loading) while the AI is "thinking."

I also implemented **structured logging** using `structlog`. In a production environment, seeing plain text logs is insufficient. My logs are output as JSON objects containing timestamps, log levels, and request context, which makes debugging issues in the RAG pipeline significantly easier.

## Database & Storage Choices

I made a deliberate choice to keep the stack simple and self-contained.

For the vector store, I chose **FAISS** running locally within the container over a managed service like Pinecone. My reasoning was practical: a personal portfolio has thousands of data points, not millions. The overhead of an external network call to a vector DB wasn't customized for this scale. FAISS provides lightning-fast similarity search with zero network latency.

For the primary database, **PostgreSQL** was the obvious choice for its reliability and strong data integrity guarantees, which are essential when managing the relationships between projects, skills, and categories.

## Infrastructure & Deployment

I containerized the entire application using **Docker**. My `docker-compose.yml` defines the services for the frontend, backend, and database, ensuring that the environment I develop in is identical to production.

I strictly separated configuration from code using `.env` files. This allows me to open-source the repository without leaking my API keys or database credentials. I also integrated **Sentry** for error monitoring, which alerts me immediately if the Python backend throws an unhandled exception in production.

## Open-Source Design Philosophy

I built this project with the community in mind. I structured the codebase so that the "AI Core" (`backend/ai_core`) is decoupled from the specific data.

This means that another developer can clone the repository, run the `seed_db.py` script with their own `data.json`, and have a fully functional AI portfolio representing *them* in minutes. I believe that tools like this should be accessible, not just for those who can build them from scratch.

## Challenges & Lessons Learned

**The "Lost in the Middle" Phenomenon**
Early in development, I noticed that if I retrieved too many documents (e.g., top-10), the LLM would sometimes ignore information buried in the middle of the context window. I learned that *precision* matters more than *recall*. I reduced the retrieval count (`k`) and improved the ranking logic, which actually increased the accuracy of the answers.

**Latency vs. Accuracy**
There is always a trade-off between how smart the model is and how fast it responds. I experimented with different models and found that using a faster, lighter model for the query decomposition step and a more capable model for the final response generation struck the right balance.

## Future Improvements

I am currently exploring **GraphRAG** to better map the relationships between my skills and projects. For example, I want the agent to understand that because I used "FastAPI" in "Project A," I implicitly have experience with "REST APIs," even if I never explicitly stated it.

I also plan to add a **Voice Interface**, allowing users to speak to the portfolio agent directly, making the experience even more immersive.

## Conclusion

Building the AI Portfolio Platform was more than just a coding exercise; it was an investigation into how we can use AI to represent ourselves digitally. By combining the structured reliability of traditional software engineering with the flexible intelligence of LLMs, I created a system that is greater than the sum of its parts.

I invite you to explore the code, fork the repository, and build your own intelligent portfolio.

## Repository & Contribution Guide

You can find the full source code on GitHub: [https://github.com/dagiteferi/ai-portfolio-platform](https://github.com/dagiteferi/ai-portfolio-platform)

**To run it locally:**
1.  Clone the repository.
2.  Copy `.env.example` to `.env` and add your API keys.
3.  Run `docker-compose up --build`.

I welcome contributions! Whether it's a new UI theme, a better prompting strategy, or a bug fix, feel free to open a Pull Request.

*License: MIT*
