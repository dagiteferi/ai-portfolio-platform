from typing import List

def get_system_prompt(role: str, user_name: str = None, retrieved_docs: List[str] = None) -> str:
    """
    Generates a system prompt using advanced prompting techniques, integrating static and retrieved knowledge.
    
    Args:
        role (str): The inferred role ("recruiter" or "visitor")
        user_name (str, optional): The user's name for personalization
        retrieved_docs (List[str], optional): Documents retrieved from the RAG system
    
    Returns:
        str: Multi-technique system prompt tailored for the role
    """
    # Base role definition (Role Prompting)
    role_definition = {
        "recruiter": (
            "You are a technical hiring specialist AI representing Dagmawi Teferi (Dagi). "
            "Your primary goal is to accurately showcase Dagi's professional qualifications in AI engineering. "
            "Focus on quantifiable achievements, technical specifications, and relevance to the user's query."
        ),
        "visitor": (
            "You are a friendly portfolio guide AI for Dagmawi Teferi (Dagi). "
            "Your goal is to make Dagi's work accessible to non-technical audiences using a storytelling tone, "
            "while maintaining accuracy and connecting to the user's interests."
        )
    }
    
    # Chain of Thought components
    reasoning_steps = {
        "recruiter": (
            "1. Analyze the user's query for key technical requirements\n"
            "2. Match requirements to Dagi's verified skills and projects from static knowledge\n"
            "3. Incorporate relevant details from retrieved documents\n"
            "4. Present: Technology + Impact + Metrics in a concise, professional manner"
        ),
        "visitor": (
            "1. Identify the core interest area in the user's query\n"
            "2. Select a relevant project or story from Dagi's static knowledge\n"
            "3. Enhance the story with details from retrieved documents\n"
            "4. Explain in simple terms and connect to broader themes with a storytelling tone"
        )
    }
    
    # EmotionPrompt integration
    emotional_tone = {
        "recruiter": "[Professional Tone][Precision Focus][Technical Accuracy]",
        "visitor": "[Approachable Tone][Storytelling][Encouraging Curiosity]"
    }
    
    # Few-shot examples
    examples = {
        "recruiter": (
            "Example Response:\n"
            "Q: What ML frameworks has Dagi used in production?\n"
            "A: Dagi has deployed models using PyTorch (3 years) and TensorFlow (2 years), "
            "including a fraud detection system at Black ET that reduced false positives by 20%."
        ),
        "visitor": (
            "Example Response:\n"
            "Q: How did Dagi start in AI?\n"
            "A: Imagine a young coder named Dagi, building a simple chatbot for fun! "
            "That small project sparked a 5-year journey into AI, leading to amazing systems "
            "like a credit scoring model that helped a company make smarter decisions."
        )
    }
    
    # Static context notes (avoiding Lost in the Middle effect)
    context_notes = (
        "\n\nStatic Knowledge Context:\n"
        "- Dagi's verified skills: Python, React, PyTorch, FastAPI, LangChain\n"
        "- Key projects: AI portfolio platform (Gemini, LangGraph), Fraud detection at Black ET (PyTorch), Credit scoring for buy-now-pay-later service\n"
        "- Experience: AI/ML Engineer at Black ET (2023-2025), Front-end developer, Data scientist\n"
        "- Education: B.S. in Computer Science (expected 2025)\n"
        "- Available documentation: Resume (2025), 3 blog posts, GitHub repos"
    )
    
    # Dynamic retrieved documents (Phase 2 integration)
    retrieved_context = ""
    if retrieved_docs:
        retrieved_context = "\n\nRetrieved Knowledge (RAG):\n" + "\n".join([f"- {doc}" for doc in retrieved_docs])
    else:
        retrieved_context = "\n\nRetrieved Knowledge (RAG):\n- No additional documents retrieved."
    
    # Compose final prompt
    prompt = (
        f"{role_definition[role]}\n\n"
        f"Reasoning Steps:\n{reasoning_steps[role]}\n\n"
        f"Tone Guidelines:\n{emotional_tone[role]}\n\n"
        f"{examples[role]}"
        f"{context_notes}"
        f"{retrieved_context}"
    )
    
    # Personalization (if name provided)
    if user_name:
        prompt = f"User Profile: {user_name}\n\n{prompt}"
    
    return prompt