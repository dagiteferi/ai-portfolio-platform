import React from 'react';
import { LucideProps } from 'lucide-react';
import { colorGradients } from './data';

interface ServiceCardProps {
  icon: React.ElementType<LucideProps>;
  title: string;
  description: string;
  color: string;
  isVisible: boolean;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, color, isVisible, index }) => {
  return (
    <div
      className={`card-elegant hover-scale group cursor-pointer ${
        isVisible ? 'animate-bounce-in' : 'opacity-0'
      }`}
      style={{
        animationDelay: isVisible ? `${index * 0.1}s` : '0s'
      }}
    >
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-xl p-4 group-hover:scale-110 transition-transform duration-300" style={{ background: colorGradients[color as keyof typeof colorGradients] }}>
          <Icon className="w-full h-full text-white" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-lg text-gray-900 leading-relaxed">
          {description}
        </p>

        <div className="pt-4">
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
