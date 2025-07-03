import React, { useState, useEffect, useRef } from 'react';
import { Github, ExternalLink, Filter } from 'lucide-react';
import { Button } from './ui/button';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const categories = ['All', 'AI/ML', 'Web Development', 'Mobile Apps', 'DSA'];

  const projects = [
    {
      title: 'Prompt Engineering Optimization',
      category: 'AI/ML',
      description: 'Advanced prompt engineering framework for optimizing LLM outputs with visual mapping of prompt components to techniques.',
      image: '/api/placeholder/400/250',
      technologies: ['Python', 'OpenAI API', 'LangChain', 'React', 'D3.js'],
      github: 'https://github.com/dagmawi-teferi/prompt-optimizer',
      demo: 'https://prompt-optimizer-demo.com',
      featured: true
    },
    {
      title: 'Neural Style Transfer App',
      category: 'AI/ML',
      description: 'Real-time neural style transfer application using deep learning to transform images into artistic masterpieces.',
      image: '/api/placeholder/400/250',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'React'],
      github: 'https://github.com/dagmawi-teferi/neural-style-transfer',
      demo: 'https://neural-style-demo.com'
    },
    {
      title: 'Predictive Analytics Dashboard',
      category: 'AI/ML',
      description: 'Machine learning dashboard for business analytics with real-time predictions and interactive visualizations.',
      image: '/api/placeholder/400/250',
      technologies: ['Python', 'Scikit-learn', 'Plotly', 'FastAPI', 'PostgreSQL'],
      github: 'https://github.com/dagmawi-teferi/analytics-dashboard',
      demo: 'https://analytics-demo.com'
    },
    {
      title: 'E-commerce Platform',
      category: 'Web Development',
      description: 'Full-stack e-commerce platform with AI-powered product recommendations and modern payment integration.',
      image: '/api/placeholder/400/250',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
      github: 'https://github.com/dagmawi-teferi/ecommerce-platform',
      demo: 'https://ecommerce-demo.com'
    },
    {
      title: 'Task Management System',
      category: 'Web Development',
      description: 'Collaborative task management application with real-time updates and team collaboration features.',
      image: '/api/placeholder/400/250',
      technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
      github: 'https://github.com/dagmawi-teferi/task-manager',
      demo: 'https://task-manager-demo.com'
    },
    {
      title: 'Fitness Tracking App',
      category: 'Mobile Apps',
      description: 'React Native fitness app with AI-powered workout recommendations and progress tracking.',
      image: '/api/placeholder/400/250',
      technologies: ['React Native', 'Firebase', 'TensorFlow Lite', 'Redux'],
      github: 'https://github.com/dagmawi-teferi/fitness-tracker',
      demo: 'https://fitness-app-demo.com'
    },
    {
      title: 'Social Media Mobile App',
      category: 'Mobile Apps',
      description: 'Cross-platform social media application with real-time messaging and content sharing.',
      image: '/api/placeholder/400/250',
      technologies: ['React Native', 'Socket.io', 'MongoDB', 'AWS S3'],
      github: 'https://github.com/dagmawi-teferi/social-app',
      demo: 'https://social-app-demo.com'
    },
    {
      title: 'Advanced Graph Algorithms',
      category: 'DSA',
      description: 'Implementation of advanced graph algorithms with visualizations for educational purposes.',
      image: '/api/placeholder/400/250',
      technologies: ['JavaScript', 'D3.js', 'HTML5 Canvas', 'Algorithm Visualization'],
      github: 'https://github.com/dagmawi-teferi/graph-algorithms',
      demo: 'https://graph-algo-demo.com'
    },
    {
      title: 'Dynamic Programming Solutions',
      category: 'DSA',
      description: 'Collection of optimized dynamic programming solutions with step-by-step explanations.',
      image: '/api/placeholder/400/250',
      technologies: ['Python', 'JavaScript', 'Interactive Tutorials', 'Algorithm Analysis'],
      github: 'https://github.com/dagmawi-teferi/dp-solutions',
      demo: 'https://dp-solutions-demo.com'
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

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <section ref={sectionRef} id="projects" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of innovative solutions across AI/ML, web development, and mobile applications
          </p>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveFilter(category)}
              variant={activeFilter === category ? 'default' : 'outline'}
              className={`hover-scale ${
                activeFilter === category 
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' 
                  : 'hover:border-primary hover:text-primary'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Prompt Engineering Project */}
        {activeFilter === 'All' || activeFilter === 'AI/ML' ? (
          <div className={`mb-16 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="card-elegant bg-gradient-to-br from-primary/5 via-accent/5 to-pink/5 border-primary/20">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium rounded-full">
                      Featured Project
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      AI/ML
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-foreground">
                    Prompt Engineering Optimization
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Advanced framework for optimizing Large Language Model outputs through systematic prompt engineering. 
                    Features visual mapping of prompt components to techniques with interactive diagrams using pastel 
                    colors and gradient backgrounds.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {['Python', 'OpenAI API', 'LangChain', 'React', 'D3.js'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-background text-foreground text-sm rounded-full border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Button className="btn-gradient hover-scale group">
                      <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      View Code
                    </Button>
                    <Button variant="outline" className="hover:border-primary hover:text-primary">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-beige via-pink/30 to-purple-500/30 p-8">
                    <div className="h-full bg-white/80 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-success/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground">Prompt Components</div>
                          </div>
                          <div className="bg-info/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground">Prompt Techniques</div>
                          </div>
                          <div className="bg-warning/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground">Context Mapping</div>
                          </div>
                          <div className="bg-pink/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground">Output Analysis</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Interactive Prompt Engineering Visualization
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {filteredProjects.filter(p => !p.featured).map((project, index) => (
            <div
              key={project.title}
              className={`group transition-all duration-300 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: isVisible ? `${index * 0.2}s` : '0s'
              }}
            >
              <div className="card-elegant hover-scale h-full">
                <div className="space-y-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Github className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{project.category}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.github, '_blank')}
                        className="hover:bg-muted"
                      >
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => window.open(project.demo, '_blank')}
                        className="btn-gradient group/btn"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-2 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => window.open(project.demo, '_blank')}
                        className="btn-gradient flex-1 group/btn"
                      >
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                        View Live Project
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.github, '_blank')}
                        className="flex-1 hover:bg-muted"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Source Code
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="card-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to See More?
            </h3>
            <p className="text-muted-foreground mb-6">
              Check out my GitHub for additional projects and contributions to open-source
            </p>
            <Button
              onClick={() => window.open('https://github.com/dagmawi-teferi', '_blank')}
              className="btn-gradient hover-scale"
            >
              <Github className="w-4 h-4 mr-2" />
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;