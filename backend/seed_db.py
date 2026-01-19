import sys
import os
from datetime import date, datetime

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine
from backend.models import sql_models as models

def seed_data():
    db = SessionLocal()
    
    # Reset database schema
    print("Resetting database schema...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    # Re-create session after schema reset
    db = SessionLocal()

    print("Seeding Education...")
    education_data = [
        {
            "degree": 'Generative Ai, ML Engineering, Data Engineering',
            "institution": '10 Academy, online',
            "start_date": date(2024, 12, 1),
            "end_date": date(2025, 3, 1),
            "description": 'Specialized in Artificial Intelligence and Machine Learning on Deep Learning and Natural Language Processing.',
            "gpa": '(with Distinction)',
            "highlights": 'Completed a 12-week KAIM AI Mastery Training powered by Kifiya & Mastercard Foundation; Delivered a polished finance-sector capstone with structured code, documentation, and unit tests; Built real-world ML systems: solar-farm site selection, financial sentiment analysis, telecom forecasting, healthcare data warehousing, fraud detection, and portfolio forecasting; Cultivated professional skills through cohort collaboration, mentorship, guest speakers, and challenge-based learning',
            "courses": 'Data cleaning, Advanced Python and SQL, CI/CD, Docker, Machine Learning'
        },
        {
            "degree": 'Bachelor of Science in Computer Science',
            "institution": 'Unity University , Adama-Campus',
            "start_date": date(2022, 9, 1),
            "end_date": None, # Present
            "description": "Strong foundation in computer systems, database design, object-oriented programming (OOP) Data Structures and algorithms, and software engineering with honors.",
            "gpa": '3.9/4.0',
            "highlights": "Dean's List for 6 consecutive semesters; Developed full-stack web app for Rent Management System for final project Using React, FastAPI and PostgreSQL; Developed full-stack web app for QR-based Attendance Management System for Unity Using HTML, CSS, JS, PHP and MySQL; Developed full-stack mobile app for my class project using Flutter and MySQL",
            "courses": 'Data Structures, Algorithms, Software Engineering, Database Systems, Computer Networks, Flutter'
        }
    ]
    for edu in education_data:
        db.add(models.Education(**edu))

    print("Seeding Certificates...")
    certificates_data = [
        {
            "title": 'Data Science',
            "issuer": '10 Academy',
            "date_issued": date(2025, 1, 1), # Approx
            "description": 'Skills: MLOps, TensorFlow, ML',
            "url": '/assets/data-science-10Acadamy-Certificate.jpg'
        },
        {
            "title": 'Data Science Learning',
            "issuer": '10 Academy',
            "date_issued": date(2025, 1, 1),
            "description": 'Skills: Data Preprocessing, Exploratory Data Analysis, Model Evaluation, Data Visualization',
            "url": '/assets/10acadami learing certaficate.jpg'
        },
        {
            "title": 'KIFIYA YAG',
            "issuer": 'Kifiya Financial Technology PLC',
            "date_issued": date(2025, 1, 1),
            "description": 'Skills: Leadership, Community Development, Communication, Ideas Development',
            "url": '/assets/kifiya YAG Certificate.jpg'
        },
        {
            "title": 'Full stack web development',
            "issuer": 'Kuraz',
            "date_issued": date(2021, 1, 1),
            "description": 'Skills: HTML, CSS, JavaScript, React',
            "url": '/assets/kurazw web-dev-Certificate.jpeg'
        },
        {
            "title": 'React JS',
            "issuer": 'SoloLearn',
            "date_issued": date(2023, 1, 1),
            "description": 'Skills: React, Frontend Development, UI/UX',
            "url": '/assets/React-js-Certificate.png'
        },
        {
            "title": 'JavaScript Algorithms and Data Structures',
            "issuer": 'freeCodeCamp',
            "date_issued": date(2023, 1, 1),
            "description": 'Skills: JavaScript, Algorithms, Data Structures',
            "url": '/assets/javascript-Certificate.jpeg'
        },
        {
            "title": 'Software Engineering Internship',
            "issuer": 'ABC Tech',
            "date_issued": date(2023, 1, 1),
            "description": 'Skills: Software Development, Teamwork, Problem Solving',
            "url": '/assets/intership-Certificate.png'
        },
        {
            "title": 'Computer Science Fundamentals',
            "issuer": 'HarvardX',
            "date_issued": date(2023, 1, 1),
            "description": 'Skills: Computer Science, Programming, Algorithms',
            "url": '/assets/computer-science-Certificate.jpeg'
        }
    ]
    for cert in certificates_data:
        db.add(models.Certificate(**cert))

    print("Seeding Memorable Moments...")
    moments_data = [
        {
            "title": '10 Academy Graduation Ceremony',
            "image_url": '/assets/10acadamy graducation.png',
            "description": '10 Academy Graduation'
        },
        {
            "title": 'Kifiya AI Mastery Program Alumni',
            "image_url": '/assets/10acadamy post about me .jpg',
            "description": '10 Academy Kifiya AI Mastery Program Alumni'
        },
        {
            "title": '10 Academy Graduation Ceremony',
            "image_url": '/assets/posted image .png',
            "description": 'General Posted Image'
        },
        {
            "title": 'Skylight Graduation Day',
            "image_url": '/assets/skylight graduation.png',
            "description": 'Skylight Graduation'
        },
        {
            "title": 'YAG Ceremony Participation',
            "image_url": '/assets/YAG cerimony.DNG',
            "description": 'YAG Ceremony'
        }
    ]
    for moment in moments_data:
        db.add(models.MemorableMoment(**moment))

    print("Seeding Work Experience...")
    work_data = [
        {
            "title": 'AI Engineer Intern,',
            "company": 'Kifiya Financial Technology',
            "location": 'Addis Ababa, Ethiopia',
            "start_date": date(2025, 3, 1),
            "end_date": None, # Present
            "is_current": True,
            "description": "Crafting innovative AI solutions at Kifiya Financial Technology, I specialize in building and fine-tuning Agentic AI systems with LLMs and RAG pipelines. Working closely with diverse teams, I create scalable tools that boost decision-making, streamline operations, and elevate customer experiences in the fintech world.",
            "achievements": "Developing GenAI solutions using LangGraph and Retrieval-Augmented Generation (RAG) techniques; Designing and implementing conversational workflows with the LangChain ecosystem for enterprise use cases; Test and modify the ML models; Collaborating with senior engineers and cross-functional teams; Gaining hands-on experience in applying AI technologies within fintech and digital services",
            "technologies": "Python, LangGraph, Docker, FastAPI, VectorDB, Docker, postgresql"
        },
        {
            "title": 'Youth Advisor ',
            "company": 'Kifiya Financial Technology',
            "location": 'Addis Ababa, Ethiopia',
            "start_date": date(2023, 12, 1),
            "end_date": date(2025, 4, 1),
            "is_current": False,
            "description": "As a Youth Advisor, I amplify the voices of young people, translating their needs into actionable insights for impactful programs. Through strategic collaboration with stakeholders in multiple engagements, I shape and deliver initiatives that tackle real challenges, fostering meaningful, youth-driven solutions that inspire change.",
            "achievements": "Identified and communicated the needs of the youth, providing valuable advice and insights to support youth-focused initiatives; Collaborated with stakeholders in 4+ meetings to design and implement strategic programs that address youth needs,ensuring effective and impactful solutions",
            "technologies": "Advisory, Teamwork, Communication, Ideas Development, Easily Adaptable"
        },
        {
            "title": 'Computer Networking Engineer',
            "company": 'GABI Technology PLC',
            "location": 'Adama, Oromia Region, Ethiopia',
            "start_date": date(2024, 7, 1),
            "end_date": date(2024, 12, 1),
            "is_current": False,
            "description": "At GABI Technology PLC, I engineered robust network solutions, designing and implementing LAN infrastructure for Adama City Administration to ensure reliable connectivity for over 500 users. By configuring Cisco switches and routers, I boosted network performance and security, while collaborating with teams to troubleshoot issues and build a scalable data center for enhanced data accessibility.",
            "achievements": "Designed and implemented a LAN network infrastructure for Adama City Administration, reducing downtime and ensuring reliable connectivity for over 500 users; Configured and optimized Cisco switches and routers, enhancing network performance and security for seamless organizational communication; Collaborated with cross-functional teams to troubleshoot and resolve network issues, minimizing disruptions and ensuring smooth daily operations; Built and configured a data center to support scalable and secure data storage, improving data accessibility and processing efficiency",
            "technologies": "putty, cisco packet tracer, CMD, punch down tool, Crimper, fibber optic, Utp- calble"
        },
        {
            "title": 'Software Engineering Intern',
            "company": 'Forage',
            "location": 'Remote',
            "start_date": date(2023, 11, 1),
            "end_date": date(2023, 11, 1),
            "is_current": False,
            "description": "Software Engineer Intern at Forage, I honed my skills in software development, mastering best practices in coding, debugging, and version control. Working remotely, I contributed to impactful projects, leveraging project management tools to deliver efficient solutions and gain practical experience in a dynamic tech environment.",
            "achievements": "Developed and debugged features for Forage’s virtual job simulation platform; Streamlined code integration using version contro; Earned recognition for high-quality code contributions during intern code reviews; Received outstanding intern performance rating",
            "technologies": "JavaScript, Python, Git, Node.js, React, Jira"
        },
        {
            "title": 'Frontend Web Developer',
            "company": 'PURPOSE BLACK ETH',
            "location": 'Remote',
            "start_date": date(2023, 3, 1),
            "end_date": date(2023, 6, 1),
            "is_current": False,
            "description": "I crafted and optimized user-friendly web interfaces, enhancing user experience through responsive design and seamless functionality. Collaborating closely with design and development teams in a hybrid setting, I implemented new features and improved applications, ensuring alignment with project goals and timely delivery.",
            "achievements": "Developed and optimized user-friendly web interfaces, improving user experience through responsive design and enhanced functionality; Collaborated with design and development teams to implement new features and improve existing applications, ensuring alignment with project requirements and deadlines",
            "technologies": "React.js, Bootstrap, GitLab, Front-End Development"
        }
    ]
    for work in work_data:
        db.add(models.WorkExperience(**work))

    print("Seeding Projects...")
    projects_data = [
        {
            "title": 'ai-portfolio-platform',
            "category": 'AI/ML',
            "description": 'Advanced prompt engineering framework for optimizing LLM outputs with visual mapping of prompt components to techniques.',
            "technologies": 'Python, Gemini API, LangChain, React, fastapi, vector Db, redis',
            "image_url": '/assets/ai portifilo.png',
            "github_url": 'https://github.com/dagiteferi/ai-portfolio-platform',
            "project_url": 'https://prompt-optimizer-demo.com',
            "is_featured": False
        },
        {
            "title": 'RENT-MANAGMENT-SYSTEM',
            "category": 'Web Development',
            "description": 'My final year project under development.',
            "technologies": 'Python, React, FastApi, PostgrewSql',
            "image_url": '/assets/rent managent .png',
            "github_url": 'https://github.com/dagiteferi/RENT-MANAGMENT-SYSTEM',
            "project_url": '#',
            "is_featured": True
        },
        {
            "title": 'Credit scoring model',
            "category": 'AI/ML',
            "description": 'leveraging data from an eCommerce platform to enable a buy-now-pay-later service for customers.',
            "technologies": 'Python, Scikit-learn, mlops, FastAPI',
            "image_url": '/assets/Credit Risk Analyzer.png',
            "github_url": 'https://github.com/dagiteferi/Credit-scoring-model',
            "project_url": 'https://credit-scoring-frontend.onrender.com/'
        },
        {
            "title": 'TimeSeries-Portfolio-Optimization',
            "category": 'AI/ML',
            "description": 'predict stock prices (TSLA, BND, SPY) using ARIMA, SARIMA, and LSTM models. It optimizes portfolios to maximize returns, minimize risks, and provides actionable insights for data-driven investment decisions.',
            "technologies": 'ARIMA, SARIMA, LSTM, python',
            "image_url": '/assets/time seri.png',
            "github_url": 'https://github.com/dagiteferi/TimeSeries-Portfolio-Optimization',
            "project_url": '#'
        },
        {
            "title": 'brent-price-change-analysis',
            "category": 'AI/ML',
            "description": 'to analyze Brent oil price fluctuations by detecting change points and identifying their causes using statistical modeling. This includes Bayesian methods, ARIMA, GARCH, and interactive visualizations to provide insights for investors, policymakers, and analysts.',
            "technologies": 'GARCH, ARIMA, python',
            "image_url": '/assets/Brent Oil.png',
            "github_url": 'https://github.com/dagiteferi/brent-price-change-analysis',
            "project_url": '#'
        },
        {
            "title": 'TelegramBot',
            "category": 'Software Applications',
            "description": 'React Native fitness app with AI-powered workout recommendations and progress tracking.',
            "technologies": 'React Native, Firebase, TensorFlow Lite, Redux',
            "github_url": 'https://github.com/dagiteferi/TelegramBot',
            "project_url": '#'
        },
        {
            "title": 'fraud-detection-models',
            "category": 'AI/ML',
            "description": 'develop the detection of fraudulent transactions in e-commerce using advanced machine learning techniques.It involves data analysis, preprocessing, feature engineering, model building, and deployment.The project includes API with Flask, containerization with Docker, and dashboards with Dash',
            "technologies": 'Python, LIME, Dash, Flask-Api, Docker',
            "image_url": '/assets/fround detaction.png',
            "github_url": 'https://github.com/dagiteferi/fraud-detection-models',
            "project_url": '#'
        },
        {
            "title": 'Ethiopian-Medical-DataWarehouse',
            "category": 'Data Solutions',
            "description": 'data warehouse for Ethiopian medical businesses by scraping data from Telegram channels. The project integrates object detection using YOLO and provides CRUD operations via FastAPI to enable comprehensive data analysis and user interaction.',
            "technologies": 'Python, postgresql, Yolo, Dpt, FastAPI, Scrapy',
            "image_url": '/assets/medical data .png',
            "github_url": 'https://github.com/dagiteferi/Ethiopian-Medical-DataWarehouse',
            "project_url": '#'
        },
        {
            "title": 'EthioMart-Amharic-NERLLM-Model',
            "category": 'AI/ML',
            "description": 'fine-tuning Named Entity Recognition (NER) models for the Amharic language, aimed at extracting key entities such as product names, prices, and locations from Ethiopian-based e-commerce Telegram channels.Dataset Source: Telegram e-commerce channels (e.g. @mertteka)',
            "technologies": 'Python, NLP, NER, amharic languch',
            "image_url": '/assets/LLM.png',
            "github_url": 'https://github.com/dagiteferi/EthioMart-Amharic-NERLLM-Model',
            "project_url": '#'
        },
        {
            "title": 'User-Overview-Engagement-and-Experience-Analysis',
            "category": 'Data Solutions',
            "description": 'analysis of TellCo, focusing on user behavior, engagement, experience, and satisfaction. Includes data preparation, exploratory analysis, dashboard development, and predictive modeling to provide actionable insights for growth opportunities.',
            "technologies": 'Python, behavior-analysis, sfaction-analysis, Notebook',
            "image_url": '/assets/useroverview.png',
            "github_url": 'https://github.com/dagiteferi/User-Overview-Engagement-and-Experience-Analysis',
            "project_url": '#'
        },
        {
            "title": 'sales-Prediction-model',
            "category": 'AI/ML',
            "description": 'An end-to-end machine learning solution for forecasting sales across all stores of Rossmann Pharmaceuticals in several cities, six weeks ahead. Accurate sales predictions will assist the finance team in better planning and decision-making',
            "technologies": 'Python, flask, ML, Xgboost, sales prediction',
            "image_url": '/assets/salxe prediction.png',
            "github_url": 'https://github.com/dagiteferi/sales-Prediction-model',
            "project_url": 'https://sales-prediction-model.vercel.app'
        },
        {
            "title": 'Spiritual-Tracker',
            "category": 'Mobile Apps',
            "description": 'Spiritual Tracker App for Ethiopian Gospel Believers Church Overview The Spiritual Tracker App supports the spiritual journey of the Ethiopian Gospel Believers Church community. It provides daily Bible verses and devotions, a platform for prayer requests, an event calendar, and access to sermon recordings.',
            "technologies": 'Dart, Flutter, Mysql, mobile-app',
            "image_url": '/assets/spritual tracer.jpg',
            "github_url": 'https://github.com/dagiteferi/Spiritual-Tracker',
            "project_url": '#'
        },
        {
            "title": 'insurance-risk-analytics',
            "category": 'Data Solutions',
            "description": 'Comprehensive data analytics project to optimize car insurance strategies for AlphaCare Insurance Solutions. Includes EDA, statistical modeling, and A/B testing to identify low-risk clients and enhance marketing effectiveness using historical insurance claim data.',
            "technologies": 'python, notebook',
            "github_url": 'https://github.com/dagiteferi/insurance-risk-analytics',
            "project_url": '#'
        },
        {
            "title": 'stu-infomation',
            "category": 'Software Applications',
            "description": 'A student information management system built with Visual Basic .NET to efficiently store, retrieve, and manage student records and academic data.',
            "technologies": 'Visual basic.Net',
            "github_url": 'https://github.com/dagiteferi/stu-infomation',
            "project_url": '#'
        },
        {
            "title": 'solar-farm-data_analysis',
            "category": 'Data Solutions',
            "description": 'MoonLight Energy Solutions focuses on crafting a strategic approach to enhance operational efficiency and sustainability through targeted solar investments.',
            "technologies": 'Python, Pandas, Numpy, Matplotlib, Seaborn, Streamlit',
            "image_url": '/assets/solarfarm.png',
            "github_url": 'https://github.com/dagiteferi/solar-farm-data_analysis',
            "project_url": 'https://moonlight-energy-ryl8arjoafnxkzwmendlb7.streamlit.app/'
        },
        {
            "title": 'registration-software',
            "category": 'Software Applications',
            "description": 'A desktop registration software application developed using Visual Basic .NET, designed to streamline user enrollment and event registration processes.',
            "technologies": 'Visual basic.Net',
            "github_url": 'https://github.com/dagiteferi/registration-software',
            "project_url": '#'
        },
        {
            "title": 'Calculator',
            "category": 'Mobile Apps',
            "description": 'A cross-platform mobile calculator application built with Flutter and Dart, featuring a clean, intuitive UI and support for standard arithmetic operations.',
            "technologies": 'Dart, Flutter',
            "image_url": '/assets/flutter calculater.jpg',
            "github_url": 'https://github.com/dagiteferi/Calculator',
            "project_url": '#'
        },
        {
            "title": 'Attendance-System',
            "category": 'Web Development',
            "description": 'A web-based attendance management system utilizing PHP and MySQL for backend data handling, coupled with a responsive HTML/CSS/JS frontend for real-time tracking.',
            "technologies": 'HTML, CSS, JavaScript, PHP, MySQL',
            "image_url": '/assets/qr attendace.png',
            "github_url": 'https://github.com/dagiteferi/Attendance-System',
            "project_url": 'https://attendance-system-plum-eta.vercel.app/'
        },
        {
            "title": 'BinarySearchTree',
            "category": 'DSA',
            "description": 'An efficient C++ implementation of the Binary Search Tree data structure, demonstrating core algorithms for insertion, deletion, and traversal.',
            "technologies": 'C++',
            "github_url": 'https://github.com/dagiteferi/BinarySearchTree',
            "project_url": '#'
        },
        {
            "title": 'AVL-Tree-Implementation',
            "category": 'DSA',
            "description": 'A robust C++ implementation of an AVL Tree (self-balancing binary search tree), ensuring optimal O(log n) time complexity for search, insert, and delete operations.',
            "technologies": 'C++',
            "github_url": 'https://github.com/dagiteferi/AVL-Tree-Implementation',
            "project_url": '#'
        },
        {
            "title": 'FIRSR-IN-FIRST-OUT',
            "category": 'DSA',
            "description": 'A C++ implementation of the First-In-First-Out (FIFO) queue data structure, showcasing fundamental memory management and data processing principles.',
            "technologies": 'C++',
            "github_url": 'https://github.com/dagiteferi/FIFS',
            "project_url": 'https://attendance-system-plum-eta.vercel.app/'
        },
        {
            "title": 'Anasimos',
            "category": 'Web Development',
            "description": 'A responsive web application built with HTML, CSS, and JavaScript, focusing on clean design aesthetics and interactive user interface elements.',
            "technologies": 'Html, css, javascript',
            "image_url": '/assets/anasimoseproject.jpeg',
            "github_url": 'https://github.com/dagiteferi/Anasimos',
            "project_url": 'https://attendance-system-plum-eta.vercel.app/'
        },
        {
            "title": 'Search-And-Sort-Algorithms-using-c-',
            "category": 'DSA',
            "description": 'A comprehensive collection of classic search and sort algorithms implemented in C++, serving as an educational resource for understanding algorithmic efficiency and logic.',
            "technologies": 'C++',
            "image_url": '/assets/search sort.jpeg',
            "github_url": 'https://github.com/dagiteferi/Search-And-Sort-Algorithms-using-c-',
            "project_url": '#'
        },
        {
            "title": 'library-managment-sysem',
            "category": 'DSA',
            "description": 'the c++ program that store , update,delete data ,sort book by name ,ISBN number, it also store the data in database.txt file',
            "technologies": 'C++',
            "image_url": '/assets/lab managment.jpeg',
            "github_url": 'https://github.com/dagiteferi/library-managment-sysem',
            "project_url": '#'
        }
    ]
    for proj in projects_data:
        db.add(models.Project(**proj))

    print("Seeding Skills...")
    skills_data = [
        { "name": 'Python', "proficiency": '95' },
        { "name": 'Pandas', "proficiency": '90' },
        { "name": 'Sql', "proficiency": '88' },
        { "name": 'React', "proficiency": '85' },
        { "name": 'Machine Learning', "proficiency": '92' },
        { "name": 'Deep Learning', "proficiency": '89' },
        { "name": 'Data Science', "proficiency": '87' },
        { "name": 'Flutter', "proficiency": '83' }
    ]
    for skill in skills_data:
        db.add(models.TechnicalSkill(**skill))

    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
