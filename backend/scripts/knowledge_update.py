import schedule
import time
from backend.vector_db.faiss_manager import faiss_manager
from backend.ai_core.utils.logger import log_interaction
import os

def check_resume_update():
      resume_path = os.path.join(os.path.dirname(__file__), "../../ai_core/knowledge/resume.pdf")
      if os.path.exists(resume_path):
          mtime = os.path.getmtime(resume_path)
          last_mtime_path = os.path.join(os.path.dirname(__file__), "last_resume_mtime.txt")
          last_mtime = 0
          if os.path.exists(last_mtime_path):
              with open(last_mtime_path, "r") as f:
                  last_mtime = float(f.read() or 0)

          if mtime > last_mtime:
              faiss_manager.update_vector_store()
              log_interaction("Resume PDF updated", f"Updated vector store at {time.ctime()}")
              with open(last_mtime_path, "w") as f:
                  f.write(str(mtime))

def run_update_scheduler():
      check_resume_update()
      schedule.every(1).minutes.do(check_resume_update)

      log_interaction("Scheduler started", "Content update scheduler running every minute on resume changes.")
      while True:
          schedule.run_pending()
          time.sleep(60)

if __name__ == "__main__":
      run_update_scheduler()