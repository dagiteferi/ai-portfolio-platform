import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from backend.config import (
    LLM_MODEL_NAME,
    LLM_TEMPERATURE,
    MAX_HISTORY_TURNS,
    MAX_OUTPUT_TOKENS,
)
import structlog

logger = structlog.get_logger(__name__)

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    logger.error("GOOGLE_API_KEY not found in environment variables.")
    raise ValueError("GOOGLE_API_KEY is not set.")
genai.configure(api_key=api_key)


class GeminiClient:
    """
    Fast Gemini client: one generate_content call per turn (no count_tokens round-trips).
    """

    def __init__(
        self,
        temperature: float = LLM_TEMPERATURE,
        retries: int = 2,
        delay: int = 1,
    ):
        self.temperature = temperature
        self.retries = retries
        self.delay = delay
        self._model_cache = {}

    def _get_model(self, system_prompt: str):
        # Cache by prompt hash so we do not rebuild the model object every time for identical prompts
        key = (LLM_MODEL_NAME, self.temperature, hash(system_prompt))
        model = self._model_cache.get(key)
        if model is None:
            model = genai.GenerativeModel(
                model_name=LLM_MODEL_NAME,
                system_instruction=system_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=self.temperature,
                    max_output_tokens=MAX_OUTPUT_TOKENS,
                ),
            )
            self._model_cache[key] = model
            # Keep cache small
            if len(self._model_cache) > 8:
                self._model_cache.pop(next(iter(self._model_cache)))
        return model

    def generate_response(self, system_prompt: str, history: list, user_input: str) -> str:
        model = self._get_model(system_prompt)

        if len(history) > MAX_HISTORY_TURNS:
            history = history[-MAX_HISTORY_TURNS:]

        formatted_history = []
        for turn in history:
            user_part = (turn.get("user") or "").strip()
            assistant_part = (turn.get("assistant") or "").strip()
            if user_part:
                formatted_history.append({"role": "user", "parts": [user_part]})
            if assistant_part:
                formatted_history.append({"role": "model", "parts": [assistant_part]})

        messages = formatted_history + [{"role": "user", "parts": [user_input]}]

        for attempt in range(self.retries):
            try:
                response = model.generate_content(contents=messages)

                if response and response.text:
                    usage = getattr(response, "usage_metadata", None)
                    if usage:
                        logger.info(
                            "Gemini response ready",
                            prompt_tokens=getattr(usage, "prompt_token_count", None),
                            output_tokens=getattr(usage, "candidates_token_count", None),
                        )
                    return response.text.strip()

                logger.warning("Received an empty or invalid response from Gemini.")
                return "I'm sorry, I couldn't generate a response at the moment. Please try again later."

            except (
                google_exceptions.ResourceExhausted,
                google_exceptions.ServiceUnavailable,
                google_exceptions.InternalServerError,
            ) as e:
                logger.warning(
                    f"Gemini API error (attempt {attempt + 1}/{self.retries}): {e}. "
                    f"Retrying in {self.delay} seconds..."
                )
                time.sleep(self.delay)
            except Exception as e:
                logger.error(f"An unexpected exception occurred in generate_response: {e}", exc_info=True)
                break

        logger.error(f"Failed to generate response after {self.retries} attempts.")
        return "I'm facing a technical issue and can't respond right now. Please try again in a few moments."


# Shared client — avoids re-init overhead on every chat turn
gemini_client = GeminiClient()
