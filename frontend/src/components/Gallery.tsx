import React from 'react';

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

        <div className="overflow-hidden rounded-lg border-2 border-primary shadow-lg group">
          <div className="flex space-x-8 py-4 animate-scroll-x group-hover:pause">
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <a
                key={index}
                href={item.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 border border-gray-300"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold text-center px-4">{item.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;