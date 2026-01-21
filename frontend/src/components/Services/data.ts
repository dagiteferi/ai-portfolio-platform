import { Brain, Code, Cloud, BarChart, Database, Zap } from 'lucide-react';

export const services = [
  {
    icon: Brain,
    title: 'Agentic AI Systems',
    description: 'Designing and implementing intelligent agents using LangGraph and RAG, enabling sophisticated, context-aware autonomous reasoning for enterprise applications.',
    color: 'from-primary to-primary-glow'
  },
  {
    icon: Database,
    title: 'Backend Development',
    description: 'Building robust and scalable server-side architectures using FastAPI, PostgreSQL, and Docker, ensuring high-performance API integration and secure data management.',
    color: 'from-accent to-info'
  },
  {
    icon: BarChart,
    title: 'Data Science & Analytics',
    description: 'Extracting actionable intelligence from complex datasets using advanced machine learning, statistical modeling, and predictive analytics to drive data-informed decisions.',
    color: 'from-success to-secondary'
  },
  {
    icon: Cloud,
    title: 'MLOps & Cloud Infrastructure',
    description: 'Architecting robust deployment pipelines and scalable cloud infrastructure to ensure the reliable performance and monitoring of AI models in production.',
    color: 'from-warning to-beige'
  },
  {
    icon: Code,
    title: 'Frontend Development',
    description: 'Developing modern, interactive user interfaces with React, focusing on creating responsive and intuitive web experiences for AI-powered applications.',
    color: 'from-pink to-accent'
  },
  {
    icon: Zap,
    title: 'Data Engineering & Vision',
    description: 'Building high-performance data warehouses and real-time object detection systems (YOLO) to manage and analyze large-scale information and visual data.',
    color: 'from-info to-primary'
  }
];

export const colorGradients = {
  'from-primary to-primary-glow': 'linear-gradient(to right, hsl(195 92% 63%), hsl(195 92% 73%))',
  'from-accent to-info': 'linear-gradient(to right, hsl(213 94% 68%), hsl(213 94% 68%))',
  'from-success to-secondary': 'linear-gradient(to right, hsl(142 76% 73%), hsl(142 76% 73%))',
  'from-warning to-beige': 'linear-gradient(to right, hsl(38 92% 75%), hsl(41 44% 85%))',
  'from-pink to-accent': 'linear-gradient(to right, hsl(340 82% 82%), hsl(213 94% 68%))',
  'from-info to-primary': 'linear-gradient(to right, hsl(213 94% 68%), hsl(195 92% 63%))',
};
