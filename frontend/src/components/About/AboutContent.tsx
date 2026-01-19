import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import SkillBar from './SkillBar';
import { TechnicalSkill } from '../../services/api';

interface Skill {
  name: string;
  level: number;
}

interface AboutContentProps {
  skillsData?: TechnicalSkill[];
}

const AboutContent: React.FC<AboutContentProps> = memo(({ skillsData }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (skillsData && skillsData.length > 0) {
      const mappedSkills: Skill[] = skillsData.map(s => ({
        name: s.name,
        level: s.proficiency === 'Expert' ? 95 : s.proficiency === 'Advanced' ? 85 : s.proficiency === 'Intermediate' ? 75 : 65
      }));
      setSkills(mappedSkills);
    }
  }, [skillsData]);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleViewLinkedIn = useCallback(() => {
    window.open('https://www.linkedin.com/in/dagmawi-teferi', '_blank');
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Passionate AI/ML engineer with expertise in building intelligent solutions that drive innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative max-w-xl mx-auto">
              <div className="aspect-square rounded-2xl overflow-hidden card-elegant">
                <img
                  src={isHovered ? '/assets/aboutprofile.jpg' : '/assets/profile-photo.png'}
                  alt="Dagmawi Teferi"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl -z-10 blur-2xl"></div>
            </div>
          </div>

          <div className={`space-y-8 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="space-y-6">
              <p className="text-lg text-gray-900 leading-relaxed">
                I am a passionate AI and machine learning engineer, full stack developer,
                enthusiast with a strong computer science background, holding a 3.93 GPA, dedicated to
                creating intelligent systems and scalable applications.
              </p>

              <p className="text-lg text-gray-900 leading-relaxed">
                My expertise spans across deep learning, natural language processing,
                computer vision, full‑stack development, and MLOps, and I
                thrive at the intersection of research and engineering, transforming
                innovative ideas into production-ready solutions.
              </p>

              <p className="text-lg text-gray-900 leading-relaxed">
                I am committed to continuous learning and professional development.
                I actively seek opportunities to expand my knowledge, stay updated with emerging
                technologies, and embrace new challenges that enhance my skills and expertise.
              </p>
            </div>

            <Button
              onClick={handleViewLinkedIn}
              className="btn-gradient hover-scale group"
            >
              <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              View LinkedIn Profile
            </Button>
          </div>
        </div>

        <div className="mt-20">
          <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Technical <span className="text-gradient">Skills</span>
            </h3>
            <p className="text-lg text-gray-900">
              Technologies and frameworks I work with
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill: Skill, index: number) => (
              <SkillBar key={skill.name} {...skill} isVisible={isVisible} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutContent;
