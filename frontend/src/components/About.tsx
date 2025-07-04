import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';


const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedSkills, setAnimatedSkills] = useState<boolean[]>([]);
  const [isHovered, setIsHovered] = useState(false); // Added this line
  const sectionRef = useRef<HTMLElement>(null);

  const skills = [
    { name: 'Python', level: 95 },
    { name: 'TensorFlow', level: 90 },
    { name: 'PyTorch', level: 88 },
    { name: 'React', level: 85 },
    { name: 'Machine Learning', level: 92 },
    { name: 'Deep Learning', level: 89 },
    { name: 'Data Science', level: 87 },
    { name: 'Cloud Computing', level: 83 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate skills one by one
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate AI/ML engineer with expertise in building intelligent solutions that drive innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile Image */}
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

          {/* Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm a passionate AI/ML engineer with over 5 years of experience in developing cutting-edge 
                machine learning solutions. I specialize in building scalable AI systems that solve real-world 
                problems and drive business value.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                My expertise spans across deep learning, natural language processing, computer vision, and 
                MLOps. I love working at the intersection of research and engineering, turning innovative 
                ideas into production-ready solutions.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                When I'm not coding, you can find me contributing to open-source projects, writing technical 
                articles, or exploring the latest advancements in AI research.
              </p>
            </div>

            <Button
              onClick={() => window.open('https://www.linkedin.com/in/dagmawi-teferi', '_blank')}
              className="btn-gradient hover-scale group"
            >
              <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              View LinkedIn Profile
            </Button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20">
          <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Technical <span className="text-gradient">Skills</span>
            </h3>
            <p className="text-lg text-muted-foreground">
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
};

export default About;