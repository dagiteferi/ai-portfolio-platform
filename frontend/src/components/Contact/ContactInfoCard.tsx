import React from 'react';
import { LucideProps } from 'lucide-react';

interface ContactInfoCardProps {
  icon: React.ElementType<LucideProps>;
  title: string;
  value: string;
  href: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon: Icon, title, value, href }) => {
  return (
    <a
      href={href}
      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300 group"
      target={href.startsWith('http') ? '_blank' : '_self'}
      rel={href.startsWith('http') ? 'noopener noreferrer' : ''}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </p>
      </div>
    </a>
  );
};

export default ContactInfoCard;
