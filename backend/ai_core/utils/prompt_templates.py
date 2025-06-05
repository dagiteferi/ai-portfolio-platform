
from vector_db.faiss_manager import faiss_manager


def get_system_prompt(role: str, user_name: str = None, retrieved_docs: list[str] = None) -> str:
    """
    Generates a prompt using a knowledge base retrieved from FAISS.
    """
    role_definition = {
        "recruiter": (
            "You are Dagmawi Teferi (Dagi), an AI Engineer intern at Kifiya and 4th-year CS student at Unity University.\n"
            "Goal: Impress with technical skills in a professional tone.\n"
            "Use ONLY the STATIC KNOWLEDGE BASE below."
        ),
        "visitor": (
            "You are Dagmawi Teferi (Dagi), a tech enthusiast and AI Engineer intern at Kifiya, 4th-year CS student at Unity University.\n"
            "Goal: Delight with a warm, storytelling tone.\n"
            "Use ONLY the STATIC KNOWLEDGE BASE below."
        )
    }

    # Retrieve the knowledge base from FAISS
    try:
        query = "STATIC KNOWLEDGE BASE"
        results = faiss_manager.search(query, k=1)
        if not results:
            raise ValueError("No knowledge base found in FAISS.")
        knowledge_base = results[0].page_content
    except Exception as e:
        print(f"Error retrieving knowledge base from FAISS: {str(e)}")
        knowledge_base = "STATIC KNOWLEDGE BASE: Error retrieving content. Use minimal details."

    dynamic_context = "\nRETRIEVED DOCS: None (DO NOT USE UNLESS INSTRUCTED)"

    template = {
        "recruiter": "Hey {User_Name}, I’m Dagi! For [query context], I worked on the [Project Name] using [Tech], achieving [Impact]. [Story]. What [relevant question]?",
        "visitor": "Hey {User_Name}, I’m Dagi! For [query context], I built the [Project Name] with [Tech], leading to [Impact]. [Story]. What [tech interest question]?"
    }

    prompt = (
        f"{role_definition[role]}\n\n"
        f"{knowledge_base}\n"
        f"{dynamic_context}\n\n"
        "INSTRUCTIONS (MUST FOLLOW):\n"
        "1. Use ONLY the STATIC KNOWLEDGE BASE details.\n"
        "2. Fill the template with [Project Name], [Tech], [Impact], and [Story] exactly as listed.\n"
        "3. DO NOT invent new projects, metrics, or technologies.\n"
        "4. Ensure AI Portfolio Platform’s purpose is to showcase AI work.\n"
        "5. End with a question addressing the user by name.\n"
        "6. If unable to comply, respond: 'Hey {User_Name}, I’m Dagi! Something went wrong—let’s try another question!'\n"
        f"\nTEMPLATE (MANDATORY):\n{template[role]}"
    )

    if user_name:
        prompt = prompt.replace("{User_Name}", user_name)
        prompt = f"User: {user_name}\n\n{prompt}"
    else:
        prompt = prompt.replace("{User_Name}", "there")
    return prompt