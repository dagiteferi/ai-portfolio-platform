import os
import logging
import time
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import content_types
from google.api_core import exceptions as google_exceptions
from backend.config import LLM_MODEL_NAME, LLM_TEMPERATURE

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables and configure the API key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    logger.error("GOOGLE_API_KEY not found in environment variables.")
    raise ValueError("GOOGLE_API_KEY is not set.")
genai.configure(api_key=api_key)

class GeminiClient:
    """
    A robust client for interacting with the Google Gemini API, 
    featuring retry logic and token usage logging.
    """
    def __init__(self, temperature: float = LLM_TEMPERATURE, retries: int = 3, delay: int = 5):
        """
        Initializes the Gemini client.
        Args:
            temperature (float): The temperature for the generation config.
            retries (int): The number of times to retry on failure.
            delay (int): The delay in seconds between retries.
        """
        self.temperature = temperature
        self.retries = retries
        self.delay = delay
        logger.info(f"Gemini client initialized for model: {LLM_MODEL_NAME}")

    def generate_response(self, system_prompt: str, history: list, user_input: str) -> str:
        """
        Generates a response from the Gemini model with retry logic.
        Args:
            system_prompt (str): The system prompt to guide the model.
            history (list): The conversation history.
            user_input (str): The user's current input.
        Returns:
            str: The generated response text.
        """
        # CRITICAL FIX: Initialize the model WITH the system_prompt on every call.
        # This ensures the AI always has the correct persona and instructions.
        model = genai.GenerativeModel(
            model_name=LLM_MODEL_NAME,
            system_instruction=system_prompt,
            generation_config=genai.GenerationConfig(temperature=self.temperature)
        )

        formatted_history = []
        for turn in history:
            formatted_history.append({"role": "user", "parts": [turn["user"]]})
            formatted_history.append({"role": "model", "parts": [turn["assistant"]]})

        messages = formatted_history + [{"role": "user", "parts": [user_input]}]

        for attempt in range(self.retries):
            try:
                # Log token count before making the API call
                input_token_count = model.count_tokens(messages).total_tokens
                logger.info(f"Attempt {attempt + 1}/{self.retries} - Input tokens: {input_token_count}")

                response = model.generate_content(contents=messages)

                if response and response.text:
                    output_token_count = model.count_tokens(response.text).total_tokens
                    logger.info(f"Successfully generated response from Gemini. Output tokens: {output_token_count}")
                    return response.text.strip()
                else:
                    logger.warning("Received an empty or invalid response from Gemini.")
                    return "I'm sorry, I couldn't generate a response at the moment. Please try again later."

            except (google_exceptions.ResourceExhausted, google_exceptions.ServiceUnavailable, google_exceptions.InternalServerError) as e:
                logger.warning(f"Gemini API error (attempt {attempt + 1}/{self.retries}): {e}. Retrying in {self.delay} seconds...")
                time.sleep(self.delay)
            except Exception as e:
                logger.error(f"An unexpected exception occurred in generate_response: {e}", exc_info=True)
                break
        
        logger.error(f"Failed to generate response after {self.retries} attempts.")
        return "I'm facing a technical issue and can't respond right now. Please try again in a few moments."