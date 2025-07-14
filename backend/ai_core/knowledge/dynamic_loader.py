import re
import pandas as pd
from langchain_core.documents import Document
from backend.ai_core.utils.logger import log_interaction
import time

def load_github_data() -> list[Document]:
    return []

def get_repo_languages(languages_url: str, token: str) -> list[str]:
    return []

def load_csv_data(file_path: str) -> list[Document]:
    start_time = time.time()
    try:
        df = pd.read_csv(file_path)
        documents = []
        for index, row in df.iterrows():
            if 'top_10_chats_and_senders.csv' in file_path:
                content = f"""Chat Entry:
Chat ID: {row.get('chat_title', 'N/A')}
Sender: {row.get('sender_name', 'N/A')}
Message Count: {row.get('chat_message_count', 'N/A')}"""
            elif 'cleaned_Linkdin_data.csv' in file_path:
                first_name = row.get('First Name', '')
                last_name = row.get('Last Name', '')
                full_name = f"{first_name} {last_name}".strip()
                headline = row.get('Headline', '')
                summary = row.get('Summary', '')
                industry = row.get('Industry', '')
                location = row.get('Geo Location', '')
                
                content = f"""LinkedIn Profile for {full_name}:
Headline: {headline}
Summary: {summary}
Industry: {industry}
Location: {location}
"""
                # Add more specific metadata for LinkedIn data
                metadata = {
                    "source": file_path,
                    "type": "linkedin_profile",
                    "name": full_name,
                    "headline": headline,
                    "summary": summary,
                    "industry": industry,
                    "location": location
                }
                # Attempt to extract current job information from headline or summary
                # This is a heuristic and might need refinement based on actual data
                current_job_match = re.search(r'(?P<title>[^,]+) at (?P<company>[^,]+)', headline)
                if current_job_match:
                    metadata["current_title"] = current_job_match.group('title').strip()
                    metadata["current_company"] = current_job_match.group('company').strip()
                    metadata["is_current"] = True
                
                documents.append(Document(page_content=content, metadata=metadata))
            elif 'cleaned_favorited_data.csv' in file_path:
                content = f"Favorited Item: {row.get('title', 'N/A')} by {row.get('author', 'N/A')}. Category: {row.get('category', 'N/A')}"
                documents.append(Document(page_content=content, metadata={"source": file_path, "type": "favorited_item", "title": row.get('title', 'N/A')}))
            elif 'cleaned_followers_data.csv' in file_path:
                content = f"Follower: {row.get('follower_name', 'N/A')}. Follower ID: {row.get('follower_id', 'N/A')}"
                documents.append(Document(page_content=content, metadata={"source": file_path, "type": "follower", "follower_name": row.get('follower_name', 'N/A')}))
            elif 'cleaned_following_data.csv' in file_path:
                content = f"Following: {row.get('following_name', 'N/A')}. Following ID: {row.get('following_id', 'N/A')}"
                documents.append(Document(page_content=content, metadata={"source": file_path, "type": "following", "following_name": row.get('following_name', 'N/A')}))
            elif 'top_20_common_words.csv' in file_path:
                content = f"Common Word: {row.get('word', 'N/A')}. Count: {row.get('count', 'N/A')}"
                documents.append(Document(page_content=content, metadata={"source": file_path, "type": "common_word", "word": row.get('word', 'N/A')}))
            else:
                # Generic handling for any other CSVs, try to make content more descriptive
                content_parts = []
                metadata = {"source": file_path, "type": "csv_data"}
                for col in df.columns:
                    value = row[col]
                    content_parts.append(f"{col}: {value}")
                    metadata[col.lower().replace(' ', '_')] = value # Add all columns as metadata
                content = "; ".join(content_parts)
                documents.append(Document(page_content=content, metadata=metadata))
        end_time = time.time()
        log_interaction("CSV data loaded", f"File: {file_path}, Rows: {len(documents)}, Time: {end_time - start_time:.2f} seconds")
        return documents
    except Exception as e:
        log_interaction("Error loading CSV data", f"File: {file_path}, Error: {str(e)}")
        return []
