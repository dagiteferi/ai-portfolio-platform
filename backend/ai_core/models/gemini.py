import os
import logging
from dotenv import load_dotenv
from google.generativeai import GenerativeModel, GenerationConfig
from google.generativeai.types import content_types
from backend.config import LLM_MODEL_NAME, LLM_TEMPERATURE

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

class GeminiClient:
    """
    A client for interacting with the Google Gemini API.
    """
    def __init__(self, temperature: float = LLM_TEMPERATURE):
        """
        Initializes the Gemini client.

        Args:
            temperature (float): The temperature for the generation config.
        """
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            logger.error("GOOGLE_API_KEY not found in environment variables.")
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        self.temperature = temperature
        logger.info("Gemini client initialized successfully.")

    def generate_response(self, system_prompt: str, history: list, user_input: str) -> str:
        """
        Generates a response from the Gemini model using the correct message format.

        Args:
            system_prompt (str): The system prompt to guide the model.
            history (list): The conversation history.
            user_input (str): The user's current input.

        Returns:
            str: The generated response text.
        """
        try:
            # Initialize the model with the system prompt
            model = GenerativeModel(
                model_name=LLM_MODEL_NAME,
                system_instruction=system_prompt,
            )

            # Format the history for the Google AI SDK
            # The roles must be 'user' and 'model'
            formatted_history = []
            for turn in history:
                formatted_history.append(content_types.to_content({"role": "user", "parts": [turn["user"]]}))
                formatted_history.append(content_types.to_content({"role": "model", "parts": [turn["assistant"]]}))

            # Add the current user input to the conversation
            messages = formatted_history + [content_types.to_content({"role": "user", "parts": [user_input]})]

            # Generate the response
            response = model.generate_content(
                contents=messages,
                generation_config=GenerationConfig(temperature=self.temperature)
            )

            if response and hasattr(response, "text") and response.text:
                logger.info("Successfully generated response from Gemini.")
                return response.text.strip()
            else:
                logger.warning("Received an empty or invalid response from Gemini.")
                return "I'm sorry, I couldn't generate a response at the moment. Please try again later."

        except Exception as e:
            logger.error(f"Exception in generate_response: {e}", exc_info=True)
            return "I'm facing a technical issue and can't respond right now. Please try again in a few moments."