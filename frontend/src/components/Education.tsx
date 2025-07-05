import React, { useState, useEffect, useRef, memo } from 'react';
import { GraduationCap, Award, ExternalLink, X } from 'lucide-react';
import EducationCard from './Education/EducationCard';
import CertificationCard from './Education/CertificationCard';

interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
  highlights?: string[];
  courses?: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  skills: string[];
  image: string;
}

const education: EducationEntry[] = [
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
      "Dean's List for 6 consecutive semesters",
      'President of Computer Science Club',
      'Winner of hackathon competitions',
      'Completed senior capstone project on AI'
    ],
    courses: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems', 'Computer Networks']
  }
];

const certifications: Certification[] = [
  {
    name: 'Data Science',
    issuer: '10 Academy',
    date: '2023',
    skills: ['MLOps', 'TensorFlow', 'GCP'],
    image: '/assets/data-science-10Acadamy-Certificate.jpg',
  },
  {
    name: 'Data Science Learning',
    issuer: '10 Academy',
    date: '2023',
    skills: ['Data Preprocessing', 'Exploratory Data Analysis', 'Model Evaluation', 'Data Visualization'],
    image: '/assets/10acadami learing certaficate.jpg',
  },
  {
    name: 'YALI RLC',
    issuer: 'Kifiya',
    date: '2023',
    skills: ['Leadership', 'Community Development', 'Entrepreneurship'],
    image: '/assets/kifiya YAG Certificate.jpg',
  },
  {
    name: 'Web Development',
    issuer: 'Kuraz',
    date: '2022',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    image: '/assets/kurazw web-dev-Certificate.jpeg',
  },
  {
    name: 'React JS',
    issuer: 'SoloLearn',
    date: '2022',
    skills: ['React', 'Frontend Development', 'UI/UX'],
    image: '/assets/React-js-Certificate.png',
  },
  {
    name: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    date: '2021',
    skills: ['JavaScript', 'Algorithms', 'Data Structures'],
    image: '/assets/javascript-Certificate.jpeg',
  },
  {
    name: 'Software Engineering Internship',
    issuer: 'ABC Tech',
    date: '2020',
    skills: ['Software Development', 'Teamwork', 'Problem Solving'],
    image: '/assets/intership-Certificate.png',
  },
  {
    name: 'Computer Science Fundamentals',
    issuer: 'HarvardX',
    date: '2019',
    skills: ['Computer Science', 'Programming', 'Algorithms'],
    image: '/assets/computer-science-Certificate.jpeg',
  },
];

const Education = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
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
            <EducationCard
              key={index}
              {...edu}
              animationDelay={isVisible ? `${index * 0.2}s` : '0s'}
            />
          ))}
        </div>

        {/* Certifications Section */}
        <div>
          <h3 className={`text-3xl font-bold text-foreground text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Professional <span className="text-gradient">Certifications</span>
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <CertificationCard
                key={index}
                {...cert}
                animationDelay={isVisible ? `${index * 0.1 + 0.5}s` : '0s'}
                onClick={handleCertificateClick}
              />
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
                  <img src={selectedCertificate} alt="Certificate Preview" className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default Education;