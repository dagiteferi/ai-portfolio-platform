import os
from dotenv import load_dotenv
from google.generativeai import GenerativeModel
import logging as logger

load_dotenv()

class GeminiClient:
    def __init__(self, temperature: float = 0.7):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        self.model = GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"temperature": temperature}
        )

    def generate_response(self, messages):
        try:
            prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
            response = self.model.generate_content(prompt)
            if hasattr(response, "text") and response.text:
                return response.text.strip()
            else:
                return "No response generated."
        except Exception as e:
         logger.error(f"Exception in generate_response: {str(e)}", exc_info=True)
        # logger.debug(f"Prompt on error: {full_prompt}")
