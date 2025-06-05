import schedule
import time
from backend.vector_db.faiss_manager import faiss_manager
from backend.ai_core.utils.logger import log_interaction

def update_knowledge_base():
    """
    Updates the dynamic knowledge base by refreshing GitHub data.
    """
    try:
        faiss_manager.update_dynamic_vector_store()
        log_interaction("Scheduled update completed", "Dynamic knowledge base refreshed")
    except Exception as e:
        log_interaction("Scheduled update failed", str(e))

def main():
    # Schedule daily updates at midnight
    schedule.every().day.at("00:00").do(update_knowledge_base)
    log_interaction("Scheduler started", "Running daily updates at 00:00")

    # Initial update on startup
    update_knowledge_base()

    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()