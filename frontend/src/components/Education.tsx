import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Award, ExternalLink, X } from 'lucide-react';

const Education = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const education = [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      period: '2020 - 2022',
      description: 'Specialized in Artificial Intelligence and Machine Learning with focus on Deep Learning and Natural Language Processing.',
      gpa: '3.9/4.0',
      highlights: [
        'Summa Cum Laude graduate with highest honors',
        'Research focus on neural networks and NLP',
        'Published 2 papers in top-tier conferences',
        'Teaching Assistant for ML courses'
      ],
      courses: ['Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'Statistical Learning']
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      institution: 'University of California, Berkeley',
      period: '2016 - 2020',
      description: 'Strong foundation in computer systems, algorithms, and software engineering with honors.',
      gpa: '3.8/4.0',
      highlights: [
        'Dean\'s List for 6 consecutive semesters',
        'President of Computer Science Club',
        'Winner of hackathon competitions',
        'Completed senior capstone project on AI'
      ],
      courses: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems', 'Computer Networks']
    }
  ];

  const certifications = [
    {
      name: 'Google Professional ML Engineer',
      issuer: 'Google Cloud',
      date: '2023',
      skills: ['MLOps', 'TensorFlow', 'GCP']
    },
    {
      name: 'AWS ML Specialty',
      issuer: 'Amazon Web Services',
      date: '2023',
      skills: ['SageMaker', 'ML Pipeline', 'AWS']
    },
    {
      name: 'TensorFlow Developer',
      issuer: 'TensorFlow',
      date: '2022',
      skills: ['Deep Learning', 'TensorFlow', 'Keras']
    },
    {
      name: 'Full Stack Development',
      issuer: 'Meta',
      date: '2022',
      skills: ['React', 'Node.js', 'Database Design']
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

  const handleCertificateClick = (certificateUrl: string) => {
    setSelectedCertificate(certificateUrl);
  };

  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  return (
    <section ref={sectionRef} id="education" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Education & <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Academic background and professional certifications that shape my expertise
          </p>
        </div>

        {/* Education Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {education.map((edu, index) => (
            <div
              key={index}
              className={`card-elegant hover-scale transition-all duration-300 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: isVisible ? `${index * 0.2}s` : '0s'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="text-lg text-gray-900 leading-relaxed">{edu.period}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{edu.degree}</h3>
                <p className="text-primary font-semibold">{edu.institution}</p>
                {edu.gpa && (
                  <p className="text-lg text-gray-900 leading-relaxed">GPA: {edu.gpa}</p>
                )}
                
                <p className="text-lg text-gray-900 leading-relaxed">{edu.description}</p>
                
                {edu.highlights && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Highlights:</h4>
                    <ul className="space-y-1">
                      {edu.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-lg text-gray-900">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {edu.courses && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Relevant Coursework:</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course, i) => (
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
          ))}
        </div>

        {/* Certifications Section */}
        <div>
          <h3 className={`text-3xl font-bold text-foreground text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Professional <span className="text-gradient">Certifications</span>
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className={`card-elegant hover-scale transition-all duration-300 text-center ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{
                  animationDelay: isVisible ? `${index * 0.1 + 0.5}s` : '0s'
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{cert.name}</h4>
                <p className="text-primary font-semibold mb-2">{cert.issuer}</p>
                <p className="text-sm text-muted-foreground mb-4">{cert.date}</p>
                {cert.skills && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {cert.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">Certificate Preview</h3>
                  <button
                    onClick={closeCertificateModal}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 text-center border-2 border-dashed border-primary/30">
                  <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg text-foreground mb-2">Certificate Placeholder</p>
                  <p className="text-muted-foreground">
                    This would display the actual certificate image in a real implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
