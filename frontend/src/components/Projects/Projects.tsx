import React, { useState, useEffect, useRef, memo } from 'react';
import { Filter, Github, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import ProjectCard from './ProjectCard';
import { Project } from '../../services/api';

interface ProjectsProps {
  projectsData?: Project[];
}

const Projects: React.FC<ProjectsProps> = memo(({ projectsData }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      // Sort projects: AI/ML first, then by ID descending (newest first)
      const sortedProjects = [...projectsData].sort((a, b) => {
        const isA_AI = a.category === 'AI/ML';
        const isB_AI = b.category === 'AI/ML';

        if (isA_AI && !isB_AI) return -1;
        if (!isA_AI && isB_AI) return 1;

        return b.id - a.id;
      });

      const mappedProjects = sortedProjects.map(proj => ({
        title: proj.title,
        category: proj.category || 'Uncategorized',
        description: proj.description || '',
        technologies: proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : [],
        image: proj.image_url || '',
        github: proj.github_url || '',
        demo: proj.project_url || '#',
        featured: proj.is_featured
      }));
      setProjects(mappedProjects);

      // Extract unique categories
      const uniqueCategories = ['All', ...Array.from(new Set(mappedProjects.map(p => p.category)))];
      setCategories(uniqueCategories);
    }
  }, [projectsData]);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter, projects]);

  const featuredProject = projects.find(p => p.featured);

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            A showcase of innovative solutions across AI/ML, web development, and mobile applications
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveFilter(category)}
              variant={activeFilter === category ? 'default' : 'outline'}
              className={`hover-scale ${activeFilter === category
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                : 'hover:border-primary hover:text-primary'
                }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {category}
            </Button>
          ))}
        </div>

        {activeFilter === 'All' && featuredProject ? (
          <div className="mb-16">
            <div className="card-elegant bg-gradient-to-br from-primary/5 via-accent/5 to-pink/5 border-primary/20 overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 items-center justify-items-center lg:justify-items-start">
                <div className="space-y-6 text-center lg:text-left w-full">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium rounded-full">
                      Featured Project
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {featuredProject.category}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground">
                    {featuredProject.title}
                  </h3>

                  <p className="text-lg text-gray-900 leading-relaxed">
                    {featuredProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {featuredProject.technologies.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-background text-foreground text-sm rounded-full border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4 justify-center lg:justify-start">
                    {featuredProject.github && (
                      <Button className="btn-gradient hover-scale group" onClick={() => window.open(featuredProject.github, '_blank')}>
                        <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        View Code
                      </Button>
                    )}
                    {featuredProject.demo && (
                      <Button variant="outline" className="hover:border-primary hover:text-primary" onClick={() => window.open(featuredProject.demo, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-beige via-pink/30 to-purple-500/30 p-8">
                    <div className="h-full bg-white/80 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-success/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground"> Components</div>
                          </div>
                          <div className="bg-info/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground"> Techniques</div>
                          </div>
                          <div className="bg-warning/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground">Context Mapping</div>
                          </div>
                          <div className="bg-pink/20 rounded-lg p-3 text-center">
                            <div className="text-sm font-medium text-foreground">Output Analysis</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-900">
                          Interactive  Engineering Visualization
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center">
          {filteredProjects.filter(p => !p.featured).map((project, index) => (
            <ProjectCard key={project.title} project={project} isVisible={true} index={index} />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="card-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to See More?
            </h3>
            <p className="text-gray-900 mb-6">
              Check out my GitHub for additional projects and contributions to open-source
            </p>
            <Button
              onClick={() => window.open('https://github.com/dagiteferi/', '_blank')}
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
});

export default Projects;
