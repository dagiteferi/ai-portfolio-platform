import React, { useState, useEffect, useRef, memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { workExperience } from './data';
import JobCard from './JobCard';

const Work = () => {
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
    <section ref={sectionRef} id="work" className="section-padding bg-background" style={{ backgroundImage: 'url(/assets/back_n.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Professional journey building intelligent solutions across various industries
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>
          
          <div className="space-y-12">
            {workExperience.map((job, index) => (
              <JobCard key={index} job={job} index={index} isVisible={isVisible} />
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

export default memo(Work);
