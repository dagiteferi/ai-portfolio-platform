import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const Work = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const workExperience = [
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

  const toggleExpanded = (index: number) => {
    setExpandedJob(expandedJob === index ? null : index);
  };

  return (
    <section ref={sectionRef} id="work" className="section-padding bg-background">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional journey building intelligent solutions across various industries
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>
          
          <div className="space-y-12">
            {workExperience.map((job, index) => (
              <div
                key={index}
                className={`relative transition-all duration-300 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{
                  animationDelay: isVisible ? `${index * 0.2}s` : '0s'
                }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                
                {/* Content */}
                <div className="ml-20 card-elegant hover-scale">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">{job.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                          <p className="text-lg text-primary font-semibold">{job.company}</p>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-2 md:mt-0">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">{job.period}</span>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>

                    <button
                      onClick={() => toggleExpanded(index)}
                      className="flex items-center text-primary hover:text-primary-glow transition-colors duration-300 font-medium"
                    >
                      <span>{expandedJob === index ? 'Show Less' : 'Show More'}</span>
                      <ChevronRight 
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                          expandedJob === index ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>

                    {expandedJob === index && (
                      <div className="space-y-4 animate-fade-in-up">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Key Achievements:</h4>
                          <ul className="space-y-2">
                            {job.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-muted-foreground">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`text-center mt-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <Button
            onClick={() => window.open('https://www.linkedin.com/in/dagmawi-teferi', '_blank')}
            className="btn-gradient hover-scale group"
          >
            <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            View Full Experience on LinkedIn
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Work;