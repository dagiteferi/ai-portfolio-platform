import React from 'react';
import { Github, Linkedin, Twitter, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/dagmawi-teferi',
      label: 'LinkedIn'
    },
    { 
      icon: Github, 
      href: 'https://github.com/dagmawi-teferi',
      label: 'GitHub'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/dagmawi_teferi',
      label: 'Twitter'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Dagmawi Teferi
                  </span>
                </h3>
                <p className="text-lg text-muted-foreground max-w-md">
                  AI/ML Engineer passionate about building intelligent solutions that drive innovation 
                  and create meaningful impact in the world.
                </p>
              </div>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 bg-background/10 rounded-lg hover:bg-primary hover:scale-110 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon 
                      size={20} 
                      className="text-background group-hover:text-white transition-colors duration-300" 
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-background">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About', href: '#about' },
                  { name: 'Services', href: '#services' },
                  { name: 'Projects', href: '#projects' },
                  { name: 'Contact', href: '#contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => {
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-background">Get in Touch</h4>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <a 
                    href="mailto:contact@dagmawiteferi.com"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    contact@dagmawiteferi.com
                  </a>
                </p>
                <p>
                  <a 
                    href="tel:+15551234567"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    +1 (555) 123-4567
                  </a>
                </p>
                <p>San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span>© {currentYear} Dagmawi Teferi. Made with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>and lots of coffee</span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="group flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary rounded-lg transition-all duration-300 hover:scale-105"
                aria-label="Scroll to top"
              >
                <span className="text-sm font-medium text-background">Back to top</span>
                <ArrowUp className="w-4 h-4 text-background group-hover:translate-y-[-2px] transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Floating Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 lg:hidden"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;