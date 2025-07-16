import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryItems } from './data';
import GalleryItem from './GalleryItem';

const Gallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth / 2 - 1) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    }, 25) as number;
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isHovering) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [isHovering, startAutoScroll, stopAutoScroll]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = 320 + 32; // w-80 (320px) + space-x-8 (32px)
      const scrollAmount = itemWidth * 1;

      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <section id="gallery" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Memorable <span className="text-gradient">Moments</span>
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            A collection of significant events and achievements from my journey.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={scrollRef}
            className="flex space-x-8 py-4 overflow-x-auto no-scrollbar rounded-lg border-2 border-primary shadow-lg"
          >
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <GalleryItem key={index} {...item} />
            ))}
          </div>

          <button
            onClick={() => handleManualScroll('left')}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-primary/70 text-primary-foreground hover:bg-primary transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-primary/70 text-primary-foreground hover:bg-primary transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;