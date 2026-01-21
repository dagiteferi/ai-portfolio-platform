import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Download, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { CV } from '../services/api';

interface HeroProps {
  onChatButtonClick: () => void;
  cvData?: CV[];
}

const Hero: React.FC<HeroProps> = memo(({ onChatButtonClick, cvData }) => {
  const roles = ["Beliver", "AI/ML Engineer", "Full-stack Dev"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  const handleDownloadCV = useCallback(() => {
    const latestCV = cvData && cvData.length > 0
      ? cvData.reduce((prev, current) => (new Date(prev.created_at) > new Date(current.created_at) ? prev : current))
      : null;

    const link = document.createElement('a');
    link.href = latestCV ? latestCV.url : '/assets/Dagmawi Teferi\'s cv.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }, [cvData]);

  const socialLinks = [
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/dagmawi-teferi',
      label: 'LinkedIn'
    },
    {
      icon: Github,
      href: 'https://github.com/dagiteferi',
      label: 'GitHub'
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/dagmawi_teferi',
      label: 'Twitter'
    }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background decorative image */}
      <img className="absolute top-0 left-0 w-full h-full object-cover opacity-10 -z-10 pointer-events-none" src="/assets/back_n.png" alt="" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                <span className="block text-foreground">Dagmawi Teferi</span>
                <AnimatePresence mode='wait'>
                  <motion.span
                    key={currentRoleIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="block text-gradient text-3xl md:text-4xl lg:text-5xl mt-2"
                  >
                    {roles[currentRoleIndex]}
                  </motion.span>
                </AnimatePresence>
              </h1>

              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mb-8 font-mono text-sm md:text-base text-muted-foreground">
                <span className="text-primary font-bold">{'</'}</span>
                <span>Believe</span>
                <span className="text-accent">→</span>
                <span>Learn</span>
                <span className="text-accent">→</span>
                <span>Write</span>
                <span className="text-accent">→</span>
                <span>Solve</span>
                <span className="text-accent">→</span>
                <span>Repeat</span>
                <span className="text-primary font-bold">{'>'}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Button
                  onClick={handleDownloadCV}
                  className="btn-gradient hover-scale group w-full sm:w-auto"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Download CV
                </Button>

                <Button
                  onClick={onChatButtonClick}
                  size="lg"
                  variant="outline"
                  className="hover-scale w-full sm:w-auto border-primary/20 hover:border-primary/50 backdrop-blur-sm"
                >
                  Chat With My Agent
                </Button>
              </div>

              <div className="flex justify-center lg:justify-start space-x-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-muted/50 border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300 hover-scale"
                    aria-label={social.label}
                  >
                    <social.icon size={24} className="group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[500px] lg:max-w-full aspect-square lg:aspect-auto lg:h-[70vh] flex justify-center items-center">
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-accent/20 to-pink/20 rounded-full blur-3xl animate-pulse -z-10" />

              <img
                className="w-full h-full object-contain mix-blend-darken drop-shadow-2xl animate-float"
                src="/assets/hero-bg.png"
                alt="Dagmawi Teferi"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
