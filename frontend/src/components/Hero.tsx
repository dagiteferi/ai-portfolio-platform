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
    <div className="front">
      <img className="back" src="/assets/back_n.png" alt="" />

      <div className="front-child1">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block text-gray-900">Dagmawi Teferi</span>
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

          <div className="flex items-center justify-center lg:justify-start flex-wrap gap-y-2 mb-8 text-black">
            <span className="text-2xl font-mono mr-2">{'</'}</span>
            <span className="text-sm md:text-base font-medium">Believe</span>
            <span className="text-cyan-500 text-base mx-2">→</span>
            <span className="text-sm md:text-base font-medium">Learn</span>
            <span className="text-cyan-500 text-base mx-2">→</span>
            <span className="text-sm md:text-base font-medium">Write</span>
            <span className="text-cyan-500 text-base mx-2">→</span>
            <span className="text-sm md:text-base font-medium">Solve</span>
            <span className="text-cyan-500 text-base mx-2">→</span>
            <span className="text-sm md:text-base font-medium">Repeat</span>
            <span className="text-2xl font-mono ml-2">{'>'}</span>
          </div>

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
              onClick={onChatButtonClick}
              size="lg"
              className="bg-white/80 text-gray-800 border border-gray-400 hover:bg-white hover:text-primary backdrop-blur-sm transition-all duration-300 hover-scale"
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
                className="group p-3 rounded-full bg-gray-200/50 backdrop-blur-sm border border-gray-400 text-gray-800 hover:bg-primary hover:border-primary transition-all duration-300 hover-scale"
                aria-label={social.label}
              >
                <social.icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="front-child2">
        <img className="hero hero1" src="/assets/hero-bg.png" alt="/" />
        <img className="hero hero2" src="/assets/hero-bg.png" alt="/" />
      </div>
    </div>
  );
});

export default Hero;
