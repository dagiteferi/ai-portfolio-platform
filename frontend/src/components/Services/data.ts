import { Brain, Code, Cloud, Zap, BarChart, Smartphone } from 'lucide-react';

export const services = [
  {
    icon: Brain,
    title: 'AI Model Development',
    description: 'Crafting tailored machine learning models to address specific business challenges, enhancing decision-making and operational efficiency.',
    color: 'from-primary to-primary-glow'
  },
  {
    icon: Code,
    title: 'Full-Stack Web Development',
    description: 'Modern, responsive web applications built with React, TypeScript, and cutting-edge technologies.',
    color: 'from-accent to-info'
  },
  {
    icon: BarChart,
    title: 'Data Science & Analytics',
    description: 'Leveraging advanced statistical methods and machine learning to extract actionable insights and drive data-driven strategies.',
    color: 'from-success to-secondary'
  },
  {
    icon: Cloud,
    title: 'AI Model Deployment',
    description: 'Scalable deployment of AI models to production environments using cloud platforms and MLOps.',
    color: 'from-warning to-beige'
  },
  {
    icon: Smartphone,
    title: 'Flutter Mobile App Development',
    description: 'Crafting high-performance, cross-platform mobile applications with Flutter for seamless user experiences.',
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
