import React, { useRef, useEffect, memo } from 'react';
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

const Gallery = memo(() => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTimestamp = useRef<DOMHighResTimeStamp>(0);
  const scrollSpeed = 0.2; // Pixels per frame, adjusted for slower movement

  const startAutoScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const animateScroll = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const deltaTime = timestamp - lastTimestamp.current;

      scrollContainer.scrollLeft += scrollSpeed * (deltaTime / 16); // Adjust for consistent speed across different frame rates

      // If scrolled past the halfway point (where duplicates start), reset to beginning
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }

      lastTimestamp.current = timestamp;
      animationFrameId.current = requestAnimationFrame(animateScroll);
    };

    animationFrameId.current = requestAnimationFrame(animateScroll);
  };

  const stopAutoScroll = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      stopAutoScroll(); // Stop auto-scroll on manual interaction

      const itemWidth = 320; // w-80 (320px) + space-x-8 (32px) = 352px per item
      const scrollAmount = itemWidth * 2; // Scroll by two items for a noticeable jump

      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }

      // Resume auto-scroll after a short delay
      setTimeout(() => {
        startAutoScroll();
      }, 1000); // 1 second delay before resuming auto-scroll
    }
  };

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

        <div className="relative group">
          <div className="overflow-hidden rounded-lg border-2 border-primary shadow-lg">
            <div
              ref={scrollRef}
              className="flex space-x-8 py-4"
              style={{ width: `${galleryItems.length * 352 * 4}px` }} // Increased width for longer horizontal display
            >
              {/* Original items */}
              {galleryItems.map((item, index) => (
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
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold text-center px-4">{item.title}</p>
                  </div>
                </a>
              ))}
              {/* Duplicate items for seamless looping (repeated 3 times for longer effect) */}
              {galleryItems.map((item, index) => (
                <a
                  key={`duplicate-1-${index}`}
                  href={item.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 group border border-gray-300"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold text-center px-4">{item.title}</p>
                  </div>
                </a>
              ))}
              {galleryItems.map((item, index) => (
                <a
                  key={`duplicate-2-${index}`}
                  href={item.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 group border border-gray-300"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold text-center px-4">{item.title}</p>
                  </div>
                </a>
              ))}
              {galleryItems.map((item, index) => (
                <a
                  key={`duplicate-3-${index}`}
                  href={item.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 group border border-gray-300"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold text-center px-4">{item.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-primary/70 text-primary-foreground hover:bg-primary transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-primary/70 text-primary-foreground hover:bg-primary transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
});

export default Gallery;
