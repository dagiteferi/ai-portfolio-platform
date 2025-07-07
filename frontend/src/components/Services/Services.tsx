import React, { useState, useEffect, useRef, memo } from 'react';
import { services } from './data';
import ServiceCard from './ServiceCard';

const Services = () => {
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
    <section ref={sectionRef} id="services" className="section-padding bg-background" style={{ backgroundImage: 'url(/assets/service_background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Comprehensive AI/ML and development services to bring your ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} isVisible={isVisible} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="card-elegant max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss how I can help bring your AI/ML vision to reality
            </p>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gradient hover-scale"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Services);
