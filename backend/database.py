from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse
import os
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(dotenv_path=dotenv_path)

# Get DATABASE_URL from environment variables
raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url:
    raise ValueError("DATABASE_URL environment variable is not set")

# Fix for passwords with special characters (like @)
try:
    # 1. Separate host/db from credentials using the last '@'
    if "@" in raw_db_url:
        scheme_creds, host_db = raw_db_url.rsplit("@", 1)
        
        # 2. Separate scheme from credentials
        if "://" in scheme_creds:
            scheme, creds = scheme_creds.split("://", 1)
            
            # 3. Separate username from password using the first ':'
            if ":" in creds:
                username, password = creds.split(":", 1)
                
                # 4. Encode the password
                encoded_password = urllib.parse.quote_plus(password)
                
                # 5. Reconstruct the URL
                DATABASE_URL = f"{scheme}://{username}:{encoded_password}@{host_db}"
            else:
                DATABASE_URL = raw_db_url
        else:
            DATABASE_URL = raw_db_url
    else:
        DATABASE_URL = raw_db_url
except Exception as e:
    print(f"Warning: Failed to parse/fix DATABASE_URL: {e}")
    DATABASE_URL = raw_db_url

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
