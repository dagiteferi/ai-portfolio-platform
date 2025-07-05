import { MapPin, Calendar } from 'lucide-react';

export interface WorkExperienceEntry {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const workExperience: WorkExperienceEntry[] = [
  {
    title: 'Senior AI/ML Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    period: '2022 - Present',
    type: 'Full-time',
    description: 'Leading the development of cutting-edge AI solutions for enterprise clients, focusing on NLP and computer vision applications.',
    achievements: [
      'Developed a multi-modal AI system that increased client engagement by 40%',
      'Led a team of 6 engineers in building scalable ML infrastructure',
      'Implemented MLOps practices that reduced model deployment time by 60%',
      'Published 3 research papers in top-tier AI conferences'
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'AWS', 'Docker']
  },
  {
    title: 'Machine Learning Engineer',
    company: 'DataFlow Solutions',
    location: 'Seattle, WA',
    period: '2020 - 2022',
    type: 'Full-time',
    description: 'Built and deployed machine learning models for predictive analytics and recommendation systems.',
    achievements: [
      'Designed recommendation system serving 1M+ daily users',
      'Optimized ML pipelines resulting in 30% cost reduction',
      'Mentored junior engineers and established best practices',
      'Collaborated with cross-functional teams to deliver 15+ projects'
    ],
    technologies: ['Python', 'Scikit-learn', 'Apache Spark', 'GCP', 'PostgreSQL', 'React']
  },
  {
    title: 'AI Research Intern',
    company: 'Stanford AI Lab',
    location: 'Stanford, CA',
    period: '2021 (Summer)',
    type: 'Internship',
    description: 'Conducted research on transformer architectures for natural language understanding.',
    achievements: [
      'Contributed to breakthrough research on attention mechanisms',
      'Improved BERT model performance by 12% on benchmark tasks',
      'Co-authored paper accepted at NeurIPS 2021',
      'Developed novel pre-training techniques for domain adaptation'
    ],
    technologies: ['Python', 'PyTorch', 'Transformers', 'CUDA', 'Linux', 'Git']
  },
  {
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    period: '2020 (Summer)',
    type: 'Internship',
    description: 'Worked on machine learning infrastructure for Google Search ranking algorithms.',
    achievements: [
      'Implemented distributed training for large-scale neural networks',
      'Optimized inference pipeline reducing latency by 25%',
      'Contributed to open-source TensorFlow codebase',
      'Received outstanding intern performance rating'
    ],
    technologies: ['C++', 'Python', 'TensorFlow', 'Protocol Buffers', 'MapReduce', 'Bigtable']
  }
];
