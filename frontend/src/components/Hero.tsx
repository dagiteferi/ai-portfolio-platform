import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Download, Github, Linkedin, Facebook } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Props for the Hero component.
 * @interface
 */
interface HeroProps {
  /**
   * Callback function to be executed when the chat button is clicked.
   */
  onChatButtonClick: () => void;
}

/**
 * Hero component displays the main introductory section of the portfolio.
 * It features a dynamic role display, call-to-action buttons, and social media links.
 * The component is memoized to optimize performance by preventing unnecessary re-renders.
 */
const Hero: React.FC<HeroProps> = memo(({ onChatButtonClick }) => {
  // Array of roles to be displayed dynamically.
  const roles = ["Beliver", "AI/ML Engineer", "Flutter Developer", "Full-stack Dev"];
  // State to manage the currently displayed role's index.
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  /**
   * Effect hook to cycle through the roles array every 3 seconds.
   * Cleans up the interval on component unmount.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]); // Dependency array ensures effect runs only if roles.length changes.

  /**
   * Callback function to handle CV download.
   * Uses useCallback to memoize the function, preventing unnecessary re-creations on re-renders.
   */
  const handleDownloadCV = useCallback(() => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,This is a placeholder CV file for Dagmawi Teferi - AI/ML Engineer';
    link.download = 'Dagmawi_Teferi_CV.txt';
    link.click();
  }, []); // Empty dependency array ensures the function is created only once.

  // Static array of social media links and their corresponding icons.
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
      icon: Facebook, 
      href: 'https://twitter.com/dagmawi_teferi',
      label: 'Twitter'
    }
  ];

  return (
    <div className="front">
      {/* Background image for the hero section. */}
      <img className="back" src="/assets/back_n.png" alt="" />
      
      {/* Left content area: Name, dynamic role, and call-to-action buttons. */}
      <div className="front-child1">
        <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                <span className="block text-gray-900">Dname</span>
                {/* AnimatePresence manages the exit and enter animations of the role text. */}
                <AnimatePresence mode='wait'>
                  <motion.span
                    key={currentRoleIndex} // Key prop is crucial for AnimatePresence to detect changes.
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
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                Building Modern Web Solutions & Digital Experiences
              </p>

              {/* Call-to-action buttons. */}
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
                  onClick={onChatButtonClick} // Triggers the chatbox via prop.
                  size="lg"
                  className="bg-white/80 text-gray-800 border border-gray-400 hover:bg-white hover:text-primary backdrop-blur-sm transition-all duration-300 hover-scale"
                >
                Chat With My Agent
                </Button>
              </div>

              {/* Social media links. */}
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
      
      {/* Right content area: Hero images. */}
      <div className="front-child2">
        <img className="hero hero1" src="/assets/hero-bg.png" alt="/" style={{width:"80%" , height:"900px"}} />
        <img className="hero hero2" src="/assets/hero-bg.png" alt="/"  style={{width:"900px" , height:"200px"}} />
      </div>
    </div>
  );
});

export default Hero;
