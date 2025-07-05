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
    degree: 'Master of Science in Computer Science',
    institution: 'Stanford University',
    period: '2020 - 2022',
    description: 'Specialized in Artificial Intelligence and Machine Learning with focus on Deep Learning and Natural Language Processing.',
    gpa: '3.9/4.0',
    highlights: [
      'Summa Cum Laude graduate with highest honors',
      'Research focus on neural networks and NLP',
      'Published 2 papers in top-tier conferences',
      'Teaching Assistant for ML courses'
    ],
    courses: ['Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'Statistical Learning']
  },
  {
    degree: 'Bachelor of Science in Computer Engineering',
    institution: 'University of California, Berkeley',
    period: '2016 - 2020',
    description: 'Strong foundation in computer systems, algorithms, and software engineering with honors.',
    gpa: '3.8/4.0',
    highlights: [
      "Dean's List for 6 consecutive semesters",
      'President of Computer Science Club',
      'Winner of hackathon competitions',
      'Completed senior capstone project on AI'
    ],
    courses: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems', 'Computer Networks']
  }
];

export const certifications: Certification[] = [
  {
    name: 'Data Science',
    issuer: '10 Academy',
    date: '2023',
    skills: ['MLOps', 'TensorFlow', 'GCP'],
    image: '/assets/data-science-10Acadamy-Certificate.jpg',
  },
  {
    name: 'Data Science Learning',
    issuer: '10 Academy',
    date: '2023',
    skills: ['Data Preprocessing', 'Exploratory Data Analysis', 'Model Evaluation', 'Data Visualization'],
    image: '/assets/10acadami learing certaficate.jpg',
  },
  {
    name: 'YALI RLC',
    issuer: 'Kifiya',
    date: '2023',
    skills: ['Leadership', 'Community Development', 'Entrepreneurship'],
    image: '/assets/kifiya YAG Certificate.jpg',
  },
  {
    name: 'Web Development',
    issuer: 'Kuraz',
    date: '2022',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    image: '/assets/kurazw web-dev-Certificate.jpeg',
  },
  {
    name: 'React JS',
    issuer: 'SoloLearn',
    date: '2022',
    skills: ['React', 'Frontend Development', 'UI/UX'],
    image: '/assets/React-js-Certificate.png',
  },
  {
    name: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    date: '2021',
    skills: ['JavaScript', 'Algorithms', 'Data Structures'],
    image: '/assets/javascript-Certificate.jpeg',
  },
  {
    name: 'Software Engineering Internship',
    issuer: 'ABC Tech',
    date: '2020',
    skills: ['Software Development', 'Teamwork', 'Problem Solving'],
    image: '/assets/intership-Certificate.png',
  },
  {
    name: 'Computer Science Fundamentals',
    issuer: 'HarvardX',
    date: '2019',
    skills: ['Computer Science', 'Programming', 'Algorithms'],
    image: '/assets/computer-science-Certificate.jpeg',
  },
];
