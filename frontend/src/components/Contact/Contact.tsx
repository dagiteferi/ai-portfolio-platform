import React, { useState, useEffect, useRef, memo } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { contactInfo, availableServices } from './data';
import ContactInfoCard from './ContactInfoCard';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { showToast } = useToast();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      showToast("Message sent successfully! Thank you for reaching out. I'll get back to you soon.", "success");

      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <section ref={sectionRef} id="contact" className="section-padding bg-background" style={{ backgroundImage: 'url(/assets/service_background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Ready to discuss your next AI/ML project? Let's connect and explore possibilities together
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Information */}
            <div className={`lg:col-span-2 space-y-8 ${isVisible ? 'animate-slide-in-right' : ''}`}>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Let's Start a Conversation
                </h3>
                <p className="text-lg text-gray-900 leading-relaxed mb-8">
                  I'm always excited to discuss new opportunities, collaborate on innovative projects,
                  or simply chat about the latest developments in AI and machine learning. Let's connect!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <ContactInfoCard key={index} {...info} />
                ))}
              </div>

              <div className="card-elegant bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-foreground">Available for:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {availableServices.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`lg:col-span-3 ${isVisible ? 'animate-slide-in-right' : ''}`}>
              <div className="card-elegant">
                <h3 className="text-2xl font-bold text-foreground mb-6">Send a Message</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell me about your project or just say hello..."
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gradient hover-scale group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-gray-900 text-center">
                    Typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Contact);
