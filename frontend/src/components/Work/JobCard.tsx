import React, { useState } from 'react';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { WorkExperienceEntry } from './data';

interface JobCardProps {
  job: WorkExperienceEntry;
  index: number;
  isVisible: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, index, isVisible }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div
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
                <div className="flex items-center text-gray-900">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-2 md:mt-0">
              <div className="flex items-center text-gray-900">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">{job.period}</span>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {job.type}
              </span>
            </div>
          </div>

          <p className="text-gray-900 leading-relaxed">{job.description}</p>

          <button
            onClick={toggleExpanded}
            className="flex items-center text-primary hover:text-primary-glow transition-colors duration-300 font-medium"
          >
            <span>{expanded ? 'Show Less' : 'Show More'}</span>
            <ChevronRight 
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                expanded ? 'rotate-90' : ''
              }`} 
            />
          </button>

          {expanded && (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Key Achievements:</h4>
                <ul className="space-y-2">
                  {job.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-900">{achievement}</span>
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
                      className="px-3 py-1 bg-muted text-gray-900 rounded-full text-sm font-medium"
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
  );
};

export default JobCard;
