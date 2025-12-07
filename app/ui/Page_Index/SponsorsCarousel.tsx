//app/ui/Page_Index
import React from 'react';
import Image from 'next/image';
import './SponsorsCarousel.css';

const sponsors = [
  { id: 1, src: '/sponsor/argennova.jpg', alt: 'Argennova', href: '#' },
  { id: 2, src: '/sponsor/argennova2.jpg', alt: 'Argennova 2', href: '#' },
  { id: 3, src: '/sponsor/argennovaoficial.jpg', alt: 'Argennova Oficial', href: '#' },
  { id: 4, src: '/sponsor/berisys.jpg', alt: 'Berisys', href: '#' },
  { id: 5, src: '/sponsor/berisys2.jpg', alt: 'Berisys 2', href: '#' },
  { id: 6, src: '/sponsor/bethedrive.jpg', alt: 'Be The Drive', href: '#' },
  { id: 7, src: '/sponsor/bethedrive2.jpg', alt: 'Be The Drive 2', href: '#' },
  { id: 8, src: '/sponsor/bisenergia.jpg', alt: 'Bisenergia', href: '#' },
  { id: 9, src: '/sponsor/bolsasecologicas.jpg', alt: 'Bolsas Ecologicas', href: '#' },
  { id: 10, src: '/sponsor/bolsasecologicas2.jpg', alt: 'Bolsas Ecologicas 2', href: '#' },
  { id: 11, src: '/sponsor/dag.jpg', alt: 'Dag', href: '#' },
  { id: 12, src: '/sponsor/ecoenergia.jpg', alt: 'Ecoenergia', href: '#' },
  { id: 13, src: '/sponsor/ecotec.jpg', alt: 'Ecotec', href: '#' },
  { id: 14, src: '/sponsor/fagus.jpg', alt: 'Fagus', href: '#' },
  { id: 15, src: '/sponsor/gestionparque.jpg', alt: 'Gestion Parque', href: '#' },
  { id: 16, src: '/sponsor/jlf.jpg', alt: 'JLF', href: '#' },
  { id: 17, src: '/sponsor/jlf2.jpg', alt: 'JLF 2', href: '#' },
  { id: 18, src: '/sponsor/mccordones.jpg', alt: 'MC Cordones', href: '#' },
  { id: 19, src: '/sponsor/metsur.jpg', alt: 'Metsur', href: '#' },
  { id: 20, src: '/sponsor/nittihermanos.jpg', alt: 'Nitti Hermanos', href: '#' },
  { id: 21, src: '/sponsor/palletpro.jpg', alt: 'Pallet Pro', href: '#' },
  { id: 22, src: '/sponsor/palletpro2.jpg', alt: 'Pallet Pro 2', href: '#' },
  { id: 23, src: '/sponsor/rds.jpg', alt: 'RDS', href: '#' },
  { id: 24, src: '/sponsor/rds2.jpg', alt: 'RDS 2', href: '#' },
  { id: 25, src: '/sponsor/rfsoluciones.jpg', alt: 'RF Soluciones', href: '#' },
  { id: 26, src: '/sponsor/rfsoluciones2.jpg', alt: 'RF Soluciones 2', href: '#' },
  { id: 27, src: '/sponsor/santacruz.jpg', alt: 'Santa Cruz', href: '#' },
  { id: 28, src: '/sponsor/santacruz2.jpg', alt: 'Santa Cruz 2', href: '#' },
  { id: 29, src: '/sponsor/selsa.jpg', alt: 'Selsa', href: '#' },
  { id: 30, src: '/sponsor/selsa2.jpg', alt: 'Selsa2', href: '#' },
  { id: 31, src: '/sponsor/selsaoficial.jpg', alt: 'Selsa Oficial', href: '#' },
  { id: 32, src: '/sponsor/sergiogerullo.jpg', alt: 'Sergio Gerullo', href: '#' },
  { id: 33, src: '/sponsor/shekk.jpg', alt: 'Shekk', href: '#' },
  { id: 34, src: '/sponsor/smartway.jpg', alt: 'Smartway', href: '#' },
  { id: 35, src: '/sponsor/solari.jpg', alt: 'Solari', href: '#' },
  { id: 36, src: '/sponsor/solari2.jpg', alt: 'Solari 2', href: '#' },
  { id: 37, src: '/sponsor/startingpoint.jpg', alt: 'Starting Point', href: '#' },
  { id: 38, src: '/sponsor/todoslossponsor.jpg', alt: 'Todos los Sponsor', href: '#' },
  { id: 39, src: '/sponsor/torcel.jpg', alt: 'Torcel', href: '#' },
  { id: 40, src: '/sponsor/trabajamos.jpg', alt: 'Trabajamos', href: '#' },
  { id: 41, src: '/sponsor/work.jpg', alt: 'Work', href: '#' },
];

const SponsorsCarousel = () => {
  return (
    <div className="sponsors-container">
      <h2 className="sponsors-title">Sponsor</h2>
      <div className="sponsors-carousel-container">
        <div className="sponsors-carousel-track">
          {sponsors.map((sponsor) => (
            <div className="sponsor-slide" key={sponsor.id}>
              <a href={sponsor.href} target="_blank" rel="noopener noreferrer">
                <Image 
                  src={sponsor.src} 
                  alt={sponsor.alt} 
                  width={150} 
                  height={100}
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsCarousel;
