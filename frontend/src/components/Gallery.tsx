import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  src: string;
  alt: string;
  linkedinUrl: string;
  title: string;
}

const galleryItems: GalleryItem[] = [
  {
    src: '/assets/10acadamy graducation.png',
    alt: '10 Academy Graduation',
    linkedinUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:PLACEHOLDER_LINK_1',
    title: '10 Academy Graduation Ceremony',
  },
  {
    src: '/assets/10acadamy post about me .jpg',
    alt: '10 Academy Post About Me',
    linkedinUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:PLACEHOLDER_LINK_2',
    title: 'Featured Post by 10 Academy',
  },
  {
    src: '/assets/posted image .png',
    alt: 'General Posted Image',
    linkedinUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:PLACEHOLDER_LINK_3',
    title: 'My Recent Achievement',
  },
  {
    src: '/assets/skylight graduation.png',
    alt: 'Skylight Graduation',
    linkedinUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:PLACEHOLDER_LINK_4',
    title: 'Skylight Graduation Day',
  },
  {
    src: '/assets/YAG cerimony.DNG',
    alt: 'YAG Ceremony',
    linkedinUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:PLACEHOLDER_LINK_5',
    title: 'YAG Ceremony Participation',
  },
];

const Gallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth / 2 - 1) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    }, 25);
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
              <a
                key={index}
                href={item.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 group border border-gray-300"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold text-center px-4">{item.title}</p>
                </div>
              </a>
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
