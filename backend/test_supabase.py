"""
Test script to verify Supabase connection and setup storage bucket.
"""
import os
import sys
from dotenv import load_dotenv

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(dotenv_path=dotenv_path)

from backend.utils.supabase_client import get_supabase_client

def test_supabase_connection():
    """Test Supabase connection and setup bucket."""
    try:
        supabase = get_supabase_client()
        print("✓ Supabase client initialized successfully")
        
        bucket_name = "documents"
        
        # Try to list buckets
        try:
            buckets = supabase.storage.list_buckets()
            print(f"✓ Found {len(buckets)} bucket(s)")
            
            bucket_exists = any(b.name == bucket_name for b in buckets)
            
            if bucket_exists:
                print(f"✓ Bucket '{bucket_name}' already exists")
            else:
                print(f"✗ Bucket '{bucket_name}' does not exist")
                print(f"  Creating bucket '{bucket_name}'...")
                
                # Create the bucket with public access
                supabase.storage.create_bucket(
                    bucket_name,
                    options={"public": True}
                )
                print(f"✓ Bucket '{bucket_name}' created successfully")
                
        except Exception as e:
            print(f"✗ Error accessing buckets: {str(e)}")
            return False
        
        # Test uploading a small file
        try:
            test_content = b"test content"
            test_path = "test/test_file.txt"
            
            supabase.storage.from_(bucket_name).upload(
                path=test_path,
                file=test_content,
                file_options={"content-type": "text/plain", "upsert": "true"}
            )
            print(f"✓ Test file uploaded successfully")
            
            # Get public URL
            public_url = supabase.storage.from_(bucket_name).get_public_url(test_path)
            print(f"✓ Public URL: {public_url}")
            
            # Clean up test file
            supabase.storage.from_(bucket_name).remove([test_path])
            print(f"✓ Test file removed")
            
        except Exception as e:
            print(f"✗ Error testing file upload: {str(e)}")
            return False
        
        print("\n✓ All tests passed! Supabase is configured correctly.")
        return True
        
    except Exception as e:
        print(f"✗ Failed to initialize Supabase client: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_supabase_connection()
    sys.exit(0 if success else 1)
