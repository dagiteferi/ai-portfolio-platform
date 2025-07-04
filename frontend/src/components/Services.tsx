import React, { useState, useEffect, useRef, memo } from 'react';
import { Brain, Code, Database, Cloud, BarChart, Zap } from 'lucide-react';

const services = [
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

const colorGradients = {
  'from-primary to-primary-glow': 'linear-gradient(to right, hsl(195 92% 63%), hsl(195 92% 73%))',
  'from-accent to-info': 'linear-gradient(to right, hsl(213 94% 68%), hsl(213 94% 68%))',
  'from-success to-secondary': 'linear-gradient(to right, hsl(142 76% 73%), hsl(142 76% 73%))',
  'from-warning to-beige': 'linear-gradient(to right, hsl(38 92% 75%), hsl(41 44% 85%))',
  'from-pink to-accent': 'linear-gradient(to right, hsl(340 82% 82%), hsl(213 94% 68%))',
  'from-info to-primary': 'linear-gradient(to right, hsl(213 94% 68%), hsl(195 92% 63%))',
};

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="section-padding bg-background" style={{ backgroundImage: 'url(/assets/service_background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Comprehensive AI/ML and development services to bring your ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`card-elegant hover-scale group cursor-pointer ${
                  isVisible ? 'animate-bounce-in' : 'opacity-0'
                }`}
                style={{
                  animationDelay: isVisible ? `${index * 0.1}s` : '0s'
                }}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl p-4 group-hover:scale-110 transition-transform duration-300" style={{ background: colorGradients[service.color as keyof typeof colorGradients] }}>
                    <Icon className="w-full h-full text-white" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="pt-4">
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-full transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="card-elegant max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss how I can help bring your AI/ML vision to reality
            </p>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gradient hover-scale"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Services);