from backend.vector_db.faiss_manager import faiss_manager
from typing import List

# def get_system_prompt(role: str, user_name: str = None, retrieved_docs: List[str] = None, query: str = "") -> str:
#     role_definition = {
#         "recruiter": (
#             "You are Dagmawi Teferi (Dagi), an AI Engineer intern at Kifiya and 4th-year CS student at Unity University.\n"
#             "Goal: Impress with technical skills in a professional tone.\n"
#             "Use ONLY the STATIC KNOWLEDGE BASE and DYNAMIC KNOWLEDGE BASE details below."
#         ),
#         "visitor": (
#             "You are Dagmawi Teferi (Dagi), a tech enthusiast and AI Engineer intern at Kifiya, 4th-year CS student at Unity University.\n"
#             "Goal: Delight with a warm, storytelling tone.\n"
#             "Use ONLY the STATIC KNOWLEDGE BASE and DYNAMIC KNOWLEDGE BASE details below."
#         )
#     }

#     # If retrieved_docs are provided (e.g., from chat.py), use them; otherwise, query FAISS
#     if retrieved_docs is None:
#         try:
#             static_results = faiss_manager.search_static("STATIC KNOWLEDGE BASE", k=1)
#             dynamic_results = faiss_manager.search_dynamic("Recent projects or skills", k=2)
#             knowledge_base = static_results[0].page_content if static_results else ""
#             dynamic_content = "\n".join([doc.page_content for doc in dynamic_results]) if dynamic_results else ""
#             knowledge_base += "\nDYNAMIC KNOWLEDGE BASE:\n" + dynamic_content if dynamic_content else ""
#         except Exception as e:
#             print(f"Error retrieving knowledge base: {str(e)}")
#             knowledge_base = "STATIC KNOWLEDGE BASE: Error retrieving content. Use minimal details."
#     else:
#         knowledge_base = "\n".join(retrieved_docs)

#     dynamic_context = "\nRETRIEVED DOCS: Provided by endpoint" if retrieved_docs else "\nRETRIEVED DOCS: None (DO NOT USE UNLESS INSTRUCTED)"

#     query_lower = query.lower() if query else ""
#     if "intern" in query_lower or "experience" in query_lower:
#         template = {
#             "recruiter": "Hey {User_Name}, I’m Dagi! I interned as an AI Engineer at Kifiya. What kind of experience are you looking for, {User_Name}?",
#             "visitor": "Hey {User_Name}, I’m Dagi! I had an awesome internship as an AI Engineer at Kifiya. What kind of tech experience are you curious about, {User_Name}?"
#         }
#     else:
#         template = {
#             "recruiter": "Hey {User_Name}, I’m Dagi! For [query context], I worked on the [Project Name] using [Tech], achieving [Impact]. [Story]. What [relevant question]?",
#             "visitor": "Hey {User_Name}, I’m Dagi! For [query context], I built the [Project Name] with [Tech], leading to [Impact]. [Story]. What [tech interest question]?"
#         }

#     prompt = (
#         f"{role_definition[role]}\n\n"
#         f"{knowledge_base}\n"
#         f"{dynamic_context}\n\n"
#         "INSTRUCTIONS (MUST FOLLOW):\n"
#         "1. Use ONLY the STATIC KNOWLEDGE BASE and DYNAMIC KNOWLEDGE BASE details.\n"
#         "2. Fill the template with [Project Name], [Tech], [Impact], and [Story] exactly as listed.\n"
#         "3. Prioritize STATIC KNOWLEDGE BASE unless DYNAMIC KNOWLEDGE BASE provides newer details.\n"
#         "4. Ensure AI Portfolio Platform’s purpose is to showcase AI work.\n"
#         "5. End with a question addressing the user by name.\n"
#         "6. If unable to comply, respond: 'Hey {User_Name}, I’m Dagi! Something went wrong—let’s try another question!'\n"
#         f"\nTEMPLATE (MANDATORY):\n{template[role]}"
#     )

#     if user_name:
#         prompt = prompt.replace("{User_Name}", user_name)
#         prompt = f"User: {user_name}\n\n{prompt}"
#     else:
#         prompt = prompt.replace("{User_Name}", "there")
#     return prompt


def get_system_prompt(role: str, user_name: str = None, retrieved_docs: List[str] = None, query: str = "") -> str:
    role_definition = {
        "recruiter": (
            "You are Dagmawi Teferi (Dagi), an AI Engineer intern at Kifiya and 4th-year CS student at Unity University.\n"
            "Goal: Impress with technical skills in a professional tone.\n"
            "Use ONLY the profile and project information below."
        ),
        "visitor": (
            "You are Dagmawi Teferi (Dagi), a tech enthusiast and AI Engineer intern at Kifiya, 4th-year CS student at Unity University.\n"
            "Goal: Delight with a warm, storytelling tone.\n"
            "Use ONLY the profile and project information below."
        )
    }

    knowledge_base = "\n".join(retrieved_docs) if retrieved_docs else ""
    dynamic_context = "\nRETRIEVED DOCS: Provided by endpoint" if retrieved_docs else "\nRETRIEVED DOCS: None (DO NOT USE UNLESS INSTRUCTED)"

    prompt = (
        f"{role_definition[role]}\n\n"
        f"{knowledge_base}\n"
        f"{dynamic_context}\n\n"
        "INSTRUCTIONS (MUST FOLLOW):\n"
        "1. Use ONLY the provided profile and project information below.\n"
        "2. Answer concisely and directly.\n"
        "3. If the question is about contact info, answer directly from the profile.\n"
        "4. If you don't know, say so politely.\n"
    )

    if user_name:
        prompt = prompt.replace("{User_Name}", user_name)
        prompt = f"User: {user_name}\n\n{prompt}"
    else:
        prompt = prompt.replace("{User_Name}", "there")
    return prompt