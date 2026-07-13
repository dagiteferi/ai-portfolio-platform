import React, { useState, useEffect, useRef, memo } from 'react';
import { X } from 'lucide-react';
import EducationCard from './EducationCard';
import CertificationCard from './CertificationCard';
import { Education, Certificate } from '../../services/api';

interface EducationContentProps {
  educationData?: Education[];
  certificatesData?: Certificate[];
}

const EducationContent: React.FC<EducationContentProps> = memo(({ educationData, certificatesData }) => {
  const education = React.useMemo(() => {
    if (!educationData || educationData.length === 0) return [];

    const mapped = educationData.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      period: `${edu.start_date ? new Date(edu.start_date).getFullYear() : ''} - ${edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}`,
      description: edu.description || '',
      gpa: edu.gpa || '',
      highlights: edu.highlights ? edu.highlights.split(';').map(h => h.trim()) : [],
      courses: edu.courses ? edu.courses.split(',').map(c => c.trim()) : []
    }));

    // Filter duplicates based on degree
    return mapped.filter((item, index, self) =>
      index === self.findIndex((t) => t.degree === item.degree)
    );
  }, [educationData]);

  const certifications = React.useMemo(() => {
    if (!certificatesData || certificatesData.length === 0) return [];

    return certificatesData.map(cert => ({
      id: cert.id,
      name: cert.title,
      issuer: cert.issuer,
      date: cert.date_issued ? new Date(cert.date_issued).getFullYear().toString() : '',
      image: cert.url || '',
      skills: cert.description ? cert.description.split(',').map(s => s.trim()).filter(Boolean) : []
    }));
  }, [certificatesData]);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCertificateClick = (certificateUrl: string, name?: string) => {
    if (!certificateUrl) return;
    setSelectedCertificate({ url: certificateUrl, name: name || 'Certificate' });
  };

  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  return (
    <section ref={sectionRef} id="education" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Education & <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Academic background and professional certifications that shape my expertise
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {education.map((edu, index) => (
            <EducationCard
              key={index}
              {...edu}
              animationDelay={isVisible ? `${index * 0.2}s` : '0s'}
            />
          ))}
        </div>

        <div>
          <h3 className={`text-3xl font-bold text-foreground text-center mb-12 ${isVisible ? 'animate-fade-in-up' : ''}`}>
            Professional <span className="text-gradient">Certifications</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <CertificationCard
                key={cert.id}
                name={cert.name}
                issuer={cert.issuer}
                date={cert.date}
                image={cert.image}
                skills={cert.skills}
                animationDelay={isVisible ? `${index * 0.05}s` : '0s'}
                onClick={(url) => handleCertificateClick(url, cert.name)}
              />
            ))}
          </div>
        </div>

        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">{selectedCertificate.name}</h3>
                  <button
                    onClick={closeCertificateModal}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 text-center border-2 border-dashed border-primary/30">
                  {selectedCertificate.url.match(/\.pdf($|\?)/i) ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">This certificate is a PDF.</p>
                      <a
                        href={selectedCertificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                      >
                        Open PDF
                      </a>
                    </div>
                  ) : (
                    <img
                      src={selectedCertificate.url}
                      alt={selectedCertificate.name}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default EducationContent;
