import os
from pathlib import Path

def create_folder_structure(root_path="."):
    """Creates the professional folder structure in the specified root"""
    root = Path(root_path)
    
    # Backend Structure
    (root / "backend/ai_core/agent").mkdir(parents=True, exist_ok=True)
    (root / "backend/ai_core/knowledge").mkdir(parents=True, exist_ok=True)
    (root / "backend/ai_core/models").mkdir(parents=True, exist_ok=True)
    (root / "backend/ai_core/memory").mkdir(parents=True, exist_ok=True)
    (root / "backend/ai_core/utils").mkdir(parents=True, exist_ok=True)
    
    (root / "backend/api/endpoints").mkdir(parents=True, exist_ok=True)
    (root / "backend/api/middlewares").mkdir(parents=True, exist_ok=True)
    
    (root / "backend/vector_db").mkdir(parents=True, exist_ok=True)
    (root / "backend/scripts").mkdir(parents=True, exist_ok=True)

    # Frontend Structure
    (root / "frontend/public").mkdir(parents=True, exist_ok=True)
    (root / "frontend/src/components/Chat").mkdir(parents=True, exist_ok=True)
    (root / "frontend/src/components/Analytics").mkdir(parents=True, exist_ok=True)
    (root / "frontend/src/components/Common").mkdir(parents=True, exist_ok=True)
    
    (root / "frontend/src/services").mkdir(parents=True, exist_ok=True)
    (root / "frontend/src/contexts").mkdir(parents=True, exist_ok=True)
    (root / "frontend/src/hooks").mkdir(parents=True, exist_ok=True)
    (root / "frontend/src/utils").mkdir(parents=True, exist_ok=True)

    # Infrastructure
    (root / "infrastructure/nginx").mkdir(parents=True, exist_ok=True)
    (root / "infrastructure/scripts").mkdir(parents=True, exist_ok=True)

    # Create all empty files
    backend_files = [
        "backend/ai_core/agent/graph.py",
        "backend/ai_core/agent/nodes.py",
        "backend/ai_core/agent/state.py",
        "backend/ai_core/knowledge/static_loader.py",
        "backend/ai_core/knowledge/dynamic_loader.py",
        "backend/ai_core/knowledge/chunker.py",
        "backend/ai_core/knowledge/embeddings.py",
        "backend/ai_core/models/gemini.py",
        "backend/ai_core/models/role_inference.py",
        "backend/ai_core/memory/session_manager.py",
        "backend/ai_core/memory/history_store.py",
        "backend/ai_core/utils/prompt_templates.py",
        "backend/ai_core/utils/token_utils.py",
        "backend/ai_core/utils/logger.py",
        "backend/api/endpoints/chat.py",
        "backend/api/endpoints/admin.py",
        "backend/api/endpoints/knowledge.py",
        "backend/api/middlewares/auth.py",
        "backend/api/middlewares/session.py",
        "backend/vector_db/faiss_manager.py",
        "backend/vector_db/pinecone_manager.py",
        "backend/scripts/db_setup.py",
        "backend/scripts/knowledge_update.py",
        "backend/Dockerfile",
        "backend/requirements.txt",
        "backend/main.py"
    ]

    frontend_files = [
        "frontend/src/components/Chat/ChatWidget.jsx",
        "frontend/src/components/Chat/MessageBubble.jsx",
        "frontend/src/components/Chat/RoleHint.jsx",
        "frontend/src/components/Analytics/Dashboard.jsx",
        "frontend/src/components/Analytics/MetricCard.jsx",
        "frontend/src/components/Common/Header.jsx",
        "frontend/src/components/Common/SessionManager.jsx",
        "frontend/src/services/api.js",
        "frontend/src/services/session.js",
        "frontend/src/contexts/ChatContext.jsx",
        "frontend/src/hooks/useChat.js",
        "frontend/src/hooks/useAnalytics.js",
        "frontend/src/utils/roleDetector.js",
        "frontend/src/utils/eventTracking.js",
        "frontend/src/App.jsx",
        "frontend/src/index.js",
        "frontend/Dockerfile",
        "frontend/package.json",
        "frontend/.env.local"
    ]

    infra_files = [
        "infrastructure/docker-compose.yml",
        "infrastructure/nginx/config.conf",
        "infrastructure/scripts/deploy.sh",
        "infrastructure/scripts/migrate_db.py"
    ]

    root_files = [
        ".gitignore",
        "README.md",
        ".env"
    ]

    for file in backend_files + frontend_files + infra_files + root_files:
        (root / file).parent.mkdir(parents=True, exist_ok=True)
        (root / file).touch()

    print(f"Professional structure created in: {root.absolute()}")

if __name__ == "__main__":
    create_folder_structure()