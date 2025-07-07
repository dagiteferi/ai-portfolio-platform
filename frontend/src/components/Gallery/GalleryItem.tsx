import React from 'react';

interface GalleryItemProps {
  src: string;
  alt: string;
  title: string;
  linkedinUrl: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ src, alt, title, linkedinUrl }) => {
  return (
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-80 h-64 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 group border border-gray-300"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-lg font-semibold text-center px-4">{title}</p>
      </div>
    </a>
  );
};

export default GalleryItem;
