from langchain_core.documents import Document
import os
import pdfplumber

def load_resume():
      resume_path = os.path.join(os.path.dirname(__file__), "resume.pdf")
      if os.path.exists(resume_path):
          try:
              with pdfplumber.open(resume_path) as pdf:
                  resume_content = ""
                  for page in pdf.pages:
                      resume_content += page.extract_text() or ""
          except Exception as e:
              print(f"Error reading PDF resume: {str(e)}")
              resume_content = """
              Name: Dagmawi Teferi
              Summary: An AI/ML Engineer with a strong foundation in Computer Science, including database design, object-oriented programming (OOP), algorithms, data structures, and Python. Proven experience in building ML models, including credit scoring and fraud detection. Skilled in data engineering tasks like ETL pipeline development, data processing, and data visualization. Proficient in Dockerization for containerized deployment.
              Skills:
              - Programming Languages: Python, SQL, Java, JavaScript
              - Frameworks: Pandas, Numpy, Scikit-Learn, Matplotlib
              - Database: MySQL, PostgreSQL
              - Environments: Visual Studio Code, PyCharm, Colab, Kaggle
              - Soft Skills: Rapport Building, Blog Writing, Excellent Communication
              - Tools: Excel, PowerPoint, Slack, Notion
              Experience:
              - Youth Advisor, Kifiya Financial Technology, Addis Ababa, Ethiopia (Dec 2023 - Present)
                Identified and communicated youth needs, collaborated with stakeholders in 4+ meetings to design strategic programs.
              - AI Engineer Intern, Kifiya Financial Technology, Addis Ababa, Ethiopia (Mar 2025 - Present)
                Developed Agentic AI systems with LLMs, built RAG pipelines, and deployed scalable AI solutions.
              - Front End Developer, Purpose Black ET, Addis Ababa, Ethiopia (Remote) (Mar 2023 - Jun 2023)
                Created user-friendly web interfaces during a three-month internship, enhanced 1 application.
              Projects:
              - Fraud Detection Models
                Built a machine learning model for e-commerce fraud detection, deployed via Flask API and Docker, with 83% accuracy and 92% precision.
              - Ethiopian Medical Data Warehouse
                Scraped medical data from Telegram, integrated YOLO for categorization, reduced manual efforts by 20%.
              - Credit Scoring Model
                Developed a credit risk model for BNPL, reduced default rates by ~40% and improved efficiency by 35%.
              Education:
              - 10 Academy, online - Certificates in Generative AI, ML Engineering, Data Engineering (Dec 2024 - Mar 2025)
              - Unity University, Adama, Ethiopia - BSc in Computer Science, GPA: 3.95/4 (Sep 2022 - Present)
              - Kuraz Technology, online - Certificate in Full Stack Web Development
              Contact: +251920362324 | dagiteferi2011@gmail.com | LinkedIn
              """
      else:
          resume_content = """
          Name: Dagmawi Teferi
          Summary: An AI/ML Engineer with a strong foundation in Computer Science, including database design, object-oriented programming (OOP), algorithms, data structures, and Python. Proven experience in building ML models, including credit scoring and fraud detection. Skilled in data engineering tasks like ETL pipeline development, data processing, and data visualization. Proficient in Dockerization for containerized deployment.
          Skills:
          - Programming Languages: Python, SQL, Java, JavaScript
          - Frameworks: Pandas, Numpy, Scikit-Learn, Matplotlib
          - Database: MySQL, PostgreSQL
          - Environments: Visual Studio Code, PyCharm, Colab, Kaggle
          - Soft Skills: Rapport Building, Blog Writing, Excellent Communication
          - Tools: Excel, PowerPoint, Slack, Notion
          Experience:
          - Youth Advisor, Kifiya Financial Technology, Addis Ababa, Ethiopia (Dec 2023 - Present)
            Identified and communicated youth needs, collaborated with stakeholders in 4+ meetings to design strategic programs.
          - AI Engineer Intern, Kifiya Financial Technology, Addis Ababa, Ethiopia (Mar 2025 - Present)
            Developed Agentic AI systems with LLMs, built RAG pipelines, and deployed scalable AI solutions.
          - Front End Developer, Purpose Black ET, Addis Ababa, Ethiopia (Remote) (Mar 2023 - Jun 2023)
            Created user-friendly web interfaces during a three-month internship, enhanced 1 application.
          Projects:
          - Fraud Detection Models
            Built a machine learning model for e-commerce fraud detection, deployed via Flask API and Docker, with 83% accuracy and 92% precision.
          - Ethiopian Medical Data Warehouse
            Scraped medical data from Telegram, integrated YOLO for categorization, reduced manual efforts by 20%.
          - Credit Scoring Model
            Developed a credit risk model for BNPL, reduced default rates by ~40% and improved efficiency by 35%.
          Education:
          - 10 Academy, online - Certificates in Generative AI, ML Engineering, Data Engineering (Dec 2024 - Mar 2025)
          - Unity University, Adama, Ethiopia - BSc in Computer Science, GPA: 3.95/4 (Sep 2022 - Present)
          - Kuraz Technology, online - Certificate in Full Stack Web Development
          Contact: +251920362324 | dagiteferi2011@gmail.com | LinkedIn
          """
      return [Document(page_content=resume_content, metadata={"source": "resume"})]

def load_static_content():
      documents = []
      documents.extend(load_resume())
      return documents