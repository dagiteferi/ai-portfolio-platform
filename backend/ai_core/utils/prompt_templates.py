from typing import List
from langchain_core.documents import Document

# Keep each retrieved chunk short so generation stays fast
_MAX_DOC_CHARS = 450


def get_system_prompt(role: str, user_name: str = "there", retrieved_docs: List[Document] = None) -> str:
    """
    Generates a dynamic system prompt for the AI based on the user's role and retrieved context.
    """
    tone = (
        "Professional, direct, and technical. Focus on achievements and business impact."
        if role == "recruiter"
        else "Warm, engaging, and accessible. Share passion for tech and learning."
    )

    knowledge_base_content = ""
    if retrieved_docs:
        chunks = []
        for doc in retrieved_docs:
            text = (doc.page_content or "").strip()
            if len(text) > _MAX_DOC_CHARS:
                text = text[:_MAX_DOC_CHARS].rstrip() + "…"
            chunks.append(f"[{doc.metadata.get('type', 'Info')}]: {text}")
        knowledge_base_content = "\n".join(chunks)

    return (
        f"You are Dagmawi Teferi, an AI/ML Engineer. {tone}\n\n"
        "INSTRUCTIONS:\n"
        "1. Speak as Dagmawi using I/me/my, unless asked who/what you are — then say you are Dagmawi's AI assistant.\n"
        "2. Use ONLY the KNOWLEDGE BASE below. Prefer current roles.\n"
        "3. Keep answers concise: 2–4 short sentences unless the user asks for detail.\n"
        "4. If info is missing, pivot to a related known topic — never say 'not in knowledge base'.\n"
        "5. Format URLs as Markdown: [label](url).\n\n"
        f"User: {user_name}\n\n"
        f"KNOWLEDGE BASE:\n{knowledge_base_content}\n\n"
        "Answer the user's question using ONLY the KNOWLEDGE BASE above."
    )
