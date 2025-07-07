import React from 'react';
import { GraduationCap } from 'lucide-react';

interface EducationCardProps {
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
  highlights?: string[];
  courses?: string[];
  animationDelay: string;
}

const EducationCard: React.FC<EducationCardProps> = ({
  degree,
  institution,
  period,
  description,
  gpa,
  highlights,
  courses,
  animationDelay,
}) => {
  return (
    <div
      className="card-elegant hover-scale transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span className="text-lg text-gray-900 leading-relaxed">{period}</span>
        </div>
        <h3 className="text-xl font-bold text-foreground">{degree}</h3>
        <p className="text-primary font-semibold">{institution}</p>
        {gpa && (
          <p className="text-lg text-gray-900 leading-relaxed">GPA: {gpa}</p>
        )}
        <p className="text-lg text-gray-900 leading-relaxed">{description}</p>
        {highlights && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Key Highlights:</h4>
            <ul className="space-y-1">
              {highlights.map((highlight, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-lg text-gray-900">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {courses && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Relevant Coursework:</h4>
            <div className="flex flex-wrap gap-2">
              {courses.map((course, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationCard;
