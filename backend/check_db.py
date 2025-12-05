from sqlalchemy import create_engine, inspect
from backend.database import DATABASE_URL
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_tables():
    try:
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print("Successfully connected to the database.")
        print("Found the following tables:")
        for table in tables:
            print(f"- {table}")
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    check_tables()
