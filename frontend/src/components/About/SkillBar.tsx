import React, { useEffect, useState } from 'react';

interface SkillBarProps {
  name: string;
  level: number;
  isVisible: boolean;
  index: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, isVisible, index }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setAnimated(true);
      }, index * 50); // Staggered animation delay
    }
  }, [isVisible, index]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-sm text-muted-foreground">{level}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: animated ? `${level}%` : '0%',
          }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;