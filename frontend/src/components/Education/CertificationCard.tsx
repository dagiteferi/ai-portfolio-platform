import React from 'react';

interface CertificationCardProps {
  name: string;
  issuer: string;
  date: string;
  skills: string[];
  image: string;
  animationDelay: string;
  onClick: (imageUrl: string) => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  name,
  issuer,
  date,
  skills,
  image,
  animationDelay,
  onClick,
}) => {
  return (
    <div
      className="card-elegant hover-scale transition-all duration-300 text-center animate-scale-in"
      style={{ animationDelay, willChange: 'transform, opacity' }}
      onClick={() => onClick(image)}
    >
      <div className="w-full h-48 bg-gradient-to-r from-primary to-accent rounded-t-lg flex items-center justify-center mx-auto mb-4">
        <img src={image} alt={name} className="w-full h-full object-cover rounded-t-lg" loading="lazy" />
      </div>
      <h4 className="text-lg font-bold text-foreground mb-2">{name}</h4>
      <p className="text-primary font-semibold mb-2">{issuer}</p>
      <p className="text-sm text-muted-foreground mb-4">{date}</p>
      {skills && (
        <div className="flex flex-wrap gap-1 justify-center">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(CertificationCard);
