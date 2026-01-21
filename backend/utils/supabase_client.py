import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(dotenv_path=dotenv_path)

# Get credentials from environment, but do not create the client here
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    """
    Creates and returns a new Supabase client instance.
    This ensures that each request gets its own client, preventing
    thread-safety issues with a single global client.
    """
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment.")
    return create_client(url, key)

