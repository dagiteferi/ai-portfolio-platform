import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';


const AboutSection: React.FC = memo(() => {

  const [isVisible, setIsVisible] = useState(false);
  const [animatedSkills, setAnimatedSkills] = useState<boolean[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Data for technical skills, including name and proficiency level.
  const skills = [
    { name: 'Python', level: 95 },
    { name: 'Pandas', level: 90 },
    { name: 'Sql', level: 88 },
    { name: 'React', level: 85 },
    { name: 'Machine Learning', level: 92 },
    { name: 'Deep Learning', level: 89 },
    { name: 'Data Science', level: 87 },
    { name: 'Flutter', level: 83 }
  ];


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          skills.forEach((_, index) => {
            setTimeout(() => {
              setAnimatedSkills(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 200);
          });
        }
      },
      { threshold: 0.1 }
    );


    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [skills]);


  const handleViewLinkedIn = useCallback(() => {
    window.open('https://www.linkedin.com/in/dagmawi-teferi', '_blank');
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">

        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-900 max-w-3xl mx-auto px-4">
            Passionate AI/ML engineer with expertise in building intelligent solutions that drive innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Profile Image Section */}
          <div className={`${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative max-w-xl mx-auto">
              <div className="aspect-square rounded-2xl overflow-hidden card-elegant">
                <img
                  src={isHovered ? '/assets/aboutprofile.jpg' : '/assets/profile-photo.png'}
                  alt="Dagmawi Teferi - AI/ML Engineer and Fullstack Developer Profile"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl -z-10 blur-2xl"></div>
            </div>
          </div>

          <div className={`space-y-6 sm:space-y-8 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed">
                I am a passionate AI and machine learning engineer, full stack developer, and Flutter
                enthusiast with a strong computer science background, holding a 3.93 GPA, dedicated to
                creating intelligent systems and scalable applications.
              </p>

              <p className="text-base sm:text-lg text-gray-900 leading-relaxed">
                My expertise spans across deep learning, natural language processing,
                computer vision, full‑stack development, Flutter, and MLOps, and I
                thrive at the intersection of research and engineering, transforming
                innovative ideas into production-ready solutions.
              </p>

              <p className="text-base sm:text-lg text-gray-900 leading-relaxed">
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

        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className={`text-center mb-8 sm:mb-10 lg:mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Technical <span className="text-gradient">Skills</span>
            </h3>
            <p className="text-base sm:text-lg text-gray-900">
              Technologies and frameworks I work with
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: animatedSkills[index] ? `${skill.level}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
