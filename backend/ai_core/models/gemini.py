import os
from dotenv import load_dotenv
from google.generativeai import GenerativeModel

load_dotenv()

class GeminiClient:
    def __init__(self):
        """Initialize the Gemini API client with the specified model."""
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        self.model = GenerativeModel("gemini-1.5-flash")

    def generate_response(self, messages):
        """
        Generate a response using the Gemini API.
        
        Args:
            messages (list): List of message objects with 'role' and 'content' (e.g., SystemMessage, HumanMessage).
        
        Returns:
            str: The generated response text.
        """
        try:
            # Convert messages to a single prompt string for Gemini
            prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error generating response: {str(e)}"