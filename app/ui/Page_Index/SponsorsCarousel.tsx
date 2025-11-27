
import React from 'react';
import './SponsorsCarousel.css';

const sponsors = [
  { id: 1, src: '/fotos/logo-flecha.jpg', alt: 'Sponsor 1', href: 'https://www.sponsor1.com' },
  { id: 2, src: '/fotos/logo-flecha.jpg', alt: 'Sponsor 2', href: 'https://www.sponsor2.com' },
  { id: 3, src: '/fotos/logo-flecha.jpg', alt: 'Sponsor 3', href: 'https://www.sponsor3.com' },
  { id: 4, src: '/fotos/logo-flecha.jpg', alt: 'Sponsor 4', href: 'https://www.sponsor4.com' },
  { id: 5, src: '/fotos/logo-flecha.jpg', alt: 'Sponsor 5', href: 'https://www.sponsor5.com' },
];

const SponsorsCarousel = () => {
  return (
    <div className="sponsors-carousel-container">
      <div className="sponsors-carousel-track">
        {sponsors.map((sponsor) => (
          <div className="sponsor-slide" key={sponsor.id}>
            <a href={sponsor.href} target="_blank" rel="noopener noreferrer">
              <img src={sponsor.src} alt={sponsor.alt} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorsCarousel;
