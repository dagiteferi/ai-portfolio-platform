import React from 'react';

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
};

export default Skeleton;
