import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types.content_types import ContentDict

load_dotenv()

class GeminiClient:
    def __init__(self, temperature: float = 0.7):
        """
        Initialize the Gemini API client with a model and optional temperature.
        """
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config={"temperature": temperature})

    def generate_response(self, messages: list) -> str:
        """
        Generate a response from Gemini based on role-based message history.
        
        Args:
            messages (list): List of dicts like {'role': 'user', 'content': 'Hello!'}
        
        Returns:
            str: The AI-generated response.
        """
        try:
            # Format the conversation as content blocks
            content: list[ContentDict] = [{"role": m["role"], "parts": [m["content"]]} for m in messages]
            response = self.model.generate_content(content)
            return response.text.strip() if hasattr(response, "text") else "No response generated."
        except Exception as e:
            return f"Error generating response: {str(e)}"
