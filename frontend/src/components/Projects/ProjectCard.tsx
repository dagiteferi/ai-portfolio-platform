import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

interface ProjectCardProps {
  project: {
    title: string;
    category: string;
    description: string;
    image: string;
    technologies: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
  };
  isVisible: boolean;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isVisible, index }) => {
  return (
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
                <p className="text-sm text-gray-900">{project.category}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {project.github && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(project.github, '_blank')}
                  className="hover:bg-muted"
                >
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {project.demo && (
                <Button
                  size="sm"
                  onClick={() => window.open(project.demo, '_blank')}
                  className="btn-gradient group/btn"
                >
                  <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                </Button>
              )}
            </div>
          </div>

          {/* Project Description */}
          <p className="text-gray-900 leading-relaxed text-lg">
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
              {project.demo && (
                <Button
                  onClick={() => window.open(project.demo, '_blank')}
                  className="btn-gradient flex-1 group/btn"
                >
                  <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                  View Live Project
                </Button>
              )}
              {project.github && (
                <Button
                  variant="outline"
                  onClick={() => window.open(project.github, '_blank')}
                  className="flex-1 hover:bg-muted"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Source Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
