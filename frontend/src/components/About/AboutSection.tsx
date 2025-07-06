import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * AboutSection component displays information about Dagmawi Teferi, including a profile image,
 * a brief biography, and technical skills with animated progress bars.
 * The component is memoized to optimize performance by preventing unnecessary re-renders.
 */
const AboutSection: React.FC = memo(() => {
  // State to control the visibility of the section for animation purposes.
  const [isVisible, setIsVisible] = useState(false);
  // State to manage the animation status of individual skill bars.
  const [animatedSkills, setAnimatedSkills] = useState<boolean[]>([]);
  // State to track hover status on the profile image for a dynamic effect.
  const [isHovered, setIsHovered] = useState(false);
  // Ref to observe the section's intersection with the viewport.
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

  /**
   * Effect hook to set up an Intersection Observer.
   * When the section enters the viewport, it triggers animations for the section and skill bars.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate skills one by one with a delay for a staggered effect.
          skills.forEach((_, index) => {
            setTimeout(() => {
              setAnimatedSkills(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 200); // Staggered animation delay.
          });
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible.
    );

    // Observe the section if the ref is attached.
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup function to disconnect the observer when the component unmounts.
    return () => observer.disconnect();
  }, [skills]); // Dependency array includes skills to re-run if skills data changes.

  /**
   * Callback function to handle opening the LinkedIn profile.
   * Memoized to prevent unnecessary re-creations.
   */
  const handleViewLinkedIn = useCallback(() => {
    window.open('https://www.linkedin.com/in/dagmawi-teferi', '_blank');
  }, []); // Empty dependency array as the URL is static.

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Passionate AI/ML engineer with expertise in building intelligent solutions that drive innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile Image Section */}
          <div className={`${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
            onMouseEnter={() => setIsHovered(true)} // Set hovered state on mouse enter.
            onMouseLeave={() => setIsHovered(false)} // Clear hovered state on mouse leave.
          >
            <div className="relative max-w-xl mx-auto">
              <div className="aspect-square rounded-2xl overflow-hidden card-elegant">
                <img
                  src={isHovered ? '/assets/aboutprofile.jpg' : '/assets/profile-photo.png'} // Dynamically change image source on hover.
                  alt="Dagmawi Teferi"
                  className="w-full h-full object-cover object-top" // Ensure image covers and top is visible.
                />
              </div>
              {/* Decorative background blur effect. */}
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl -z-10 blur-2xl"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="space-y-6">
              <p className="text-lg text-gray-900 leading-relaxed">
                I am a passionate AI and machine learning engineer, full stack developer, and Flutter 
                enthusiast with a strong computer science background, holding a 3.93 GPA, dedicated to 
                creating intelligent systems and scalable applications.
              </p>
              
              <p className="text-lg text-gray-900 leading-relaxed">
                My expertise spans across deep learning, natural language processing, 
                computer vision, full‑stack development, Flutter, and MLOps, and I 
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
              onClick={handleViewLinkedIn} // Use memoized callback for LinkedIn button.
              className="btn-gradient hover-scale group"
            >
              <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              View LinkedIn Profile
            </Button>
          </div>
        </div>

        {/* Technical Skills Section */}
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
