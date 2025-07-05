import React, { useRef, useEffect, useState } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const animateScroll = () => {
      if (!isPaused) {
        scrollContainer.scrollLeft += 0.5; // Adjust scroll speed as needed

        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstElementChild?.clientWidth ?? 0;
      const scrollAmount = itemWidth * 2;

      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
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

        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-lg border-2 border-primary shadow-lg">
            <div
              ref={scrollRef}
              className="flex space-x-8 py-4 no-scrollbar"
              style={{ width: `${galleryItems.length * 2 * 352}px` }}
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
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-primary/70 text-primary-foreground hover:bg-primary transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => scroll('right')}
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