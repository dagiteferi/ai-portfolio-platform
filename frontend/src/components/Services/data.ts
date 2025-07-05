import { Brain, Code, Database, Cloud, BarChart, Zap } from 'lucide-react';

export const services = [
  {
    icon: Brain,
    title: 'Machine Learning Consulting',
    description: 'Expert guidance on ML strategy, model selection, and implementation to solve your business challenges.',
    color: 'from-primary to-primary-glow'
  },
  {
    icon: Code,
    title: 'Web Development',
    description: 'Modern, responsive web applications built with React, TypeScript, and cutting-edge technologies.',
    color: 'from-accent to-info'
  },
  {
    icon: Database,
    title: 'Data Analysis',
    description: 'Transform raw data into actionable insights using advanced statistical methods and visualization.',
    color: 'from-success to-secondary'
  },
  {
    icon: Cloud,
    title: 'AI Model Deployment',
    description: 'Scalable deployment of AI models to production environments using cloud platforms and MLOps.',
    color: 'from-warning to-beige'
  },
  {
    icon: BarChart,
    title: 'Business Intelligence',
    description: 'Create dashboards and analytics solutions that drive data-driven decision making.',
    color: 'from-pink to-accent'
  },
  {
    icon: Zap,
    title: 'AI Automation',
    description: 'Automate repetitive tasks and workflows using intelligent AI-powered solutions.',
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
