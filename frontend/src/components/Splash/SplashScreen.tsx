import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        {/* Logo with pulsing animation */}
        <div
          className="h-24 w-40 animate-pulse"
          style={{
            backgroundColor: 'hsl(213 94% 68%)',
            maskImage: `url('/assets/withbg.png')`,
            WebkitMaskImage: `url('/assets/withbg.png')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
          aria-label="Loading Logo"
        ></div>
      </div>
      <div className="mt-6 flex items-center space-x-2">
        <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
        </div>
        <p className="text-lg font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
