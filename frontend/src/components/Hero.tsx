import React from 'react';
import { Download, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from './ui/button';


const Hero = () => {
  const handleDownloadCV = () => {
    // Create a placeholder CV download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,This is a placeholder CV file for Dagmawi Teferi - AI/ML Engineer';
    link.download = 'Dagmawi_Teferi_CV.txt';
    link.click();
  };

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

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/hero-bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                <span className="block">Dagmawi Teferi</span>
                <span className="block text-gradient text-3xl md:text-4xl lg:text-5xl mt-2">
                  Fullstack Developer
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Building Modern Web Solutions & Digital Experiences
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Button
                  onClick={handleDownloadCV}
                  className="btn-gradient hover-scale group"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Download CV
                </Button>
                
                <Button
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="bg-white/20 text-white border border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm transition-all duration-300 hover-scale"
                >
                  Get In Touch
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex justify-center lg:justify-start space-x-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-primary hover:border-primary transition-all duration-300 hover-scale"
                    aria-label={social.label}
                  >
                    <social.icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Profile Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative animate-fade-in-up">
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl hover-scale">
                {/* <img 
                  src={profilePhoto} 
                  alt="Dagmawi Teferi - Fullstack Developer" 
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;