import { GraduationCap, Award } from 'lucide-react';

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
  highlights?: string[];
  courses?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  skills: string[];
  image: string;
}

export const education: EducationEntry[] = [
  {
    degree: 'Generative Ai, ML Engineering, Data Engineering',
    institution: '10 Academy, online',
    period: 'Dec 2024 - Mar 2025', 
    description: 'Specialized in Artificial Intelligence and Machine Learning  on Deep Learning and Natural Language Processing.',
    gpa: '(with Distinction)',
     highlights: [
      'Completed a 12-week KAIM AI Mastery Training powered by Kifiya & Mastercard Foundation',
      'Delivered a polished finance-sector capstone with structured code, documentation, and unit tests',
      'Built real-world ML systems: solar-farm site selection, financial sentiment analysis, telecom forecasting, healthcare data warehousing, fraud detection, and portfolio forecasting',
      'Cultivated professional skills through cohort collaboration, mentorship, guest speakers, and challenge-based learning'
    ],
    courses: ['Data cleaning ', 'Advanced Pythona and SQL', 'CI/CD', 'Docker', 'Machine Learning']
  },
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Unity University , Adama-Campus',
    period: 'Sep 2022 - Present',
    description: 'Strong foundation in computer systems,  database design ,object-oriented programming (OOP)  Data Strucher and algorithms, and software engineering with honors.',

    gpa: '3.9/4.0', 
    highlights: [
      "Dean's List for 6 consecutive semesters",
      'Developed full-stack web app for Reant Managment System for final project Uing React ,FastAPI and PostgreSQL',
      'Developed full-stack web app for QR - based Attendace  Managment Sysytem for Unity   Uing HTML , CSS, JS  ,PHP and MySQL',
      'developed full-stack mobile app for my class project using Flutter and mySQL',
    ],
    courses: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems', 'Computer Networks' , 'flutter']
  }
];

export const certifications: Certification[] = [
  {
    name: 'Data Science',
    issuer: '10 Academy',
    date: '2025',
    skills: ['MLOps', 'TensorFlow', 'ML'],
    image: '/assets/data-science-10Acadamy-Certificate.jpg',
  },
  {
    name: 'Data Science Learning',
    issuer: '10 Academy',
    date: '2025',
    skills: ['Data Preprocessing', 'Exploratory Data Analysis', 'Model Evaluation', 'Data Visualization'],
    image: '/assets/10acadami learing certaficate.jpg',
  },
  {
    name: 'KIFIYA YAG',
    issuer: 'Kifiya Financial Technology PLC',
    date: '2025',
    skills: ['Leadership', 'Community Development', 'Communication' , 'Ideas Development'],
    image: '/assets/kifiya YAG Certificate.jpg',
  },
  {
    name: 'Full stack web development',
    issuer: 'Kuraz',
    date: '2021',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    image: '/assets/kurazw web-dev-Certificate.jpeg',
  },
  {
    name: 'React JS',
    issuer: 'SoloLearn',
    date: '2023',
    skills: ['React', 'Frontend Development', 'UI/UX'],
    image: '/assets/React-js-Certificate.png',
  },
  {
    name: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    date: '2023',
    skills: ['JavaScript', 'Algorithms', 'Data Structures'],
    image: '/assets/javascript-Certificate.jpeg',
  },
  {
    name: 'Software Engineering Internship',
    issuer: 'ABC Tech',
    date: '2023',
    skills: ['Software Development', 'Teamwork', 'Problem Solving'],
    image: '/assets/intership-Certificate.png',
  },
  {
    name: 'Computer Science Fundamentals',
    issuer: 'HarvardX',
    date: '2023',
    skills: ['Computer Science', 'Programming', 'Algorithms'],
    image: '/assets/computer-science-Certificate.jpeg',
  },
];
