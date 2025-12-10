//app/ui/Page_Index
import React from 'react';
import Image from 'next/image';
import './SponsorsCarousel.css';

const sponsors = [
  { id: 1, src: '/sponsor/argennova.jpg', alt: 'Argennova', href: 'https://argennova.org/' },
  { id: 2, src: '/sponsor/argennova2.jpg', alt: 'Argennova 2', href: 'https://argennova.org/' },
  { id: 3, src: '/sponsor/argennovaoficial.jpg', alt: 'Argennova Oficial', href: 'https://argennova.org/' },
  { id: 4, src: '/sponsor/berisys.jpg', alt: 'Berisys', href: 'https://crm.berisys.com.ar/' },
  { id: 5, src: '/sponsor/berisys2.jpg', alt: 'Berisys 2', href: 'https://crm.berisys.com.ar/' },
  { id: 6, src: '/sponsor/bethedrive.jpg', alt: 'Be The Drive', href: 'https://bethedriver.global/' },
  { id: 7, src: '/sponsor/bethedrive2.jpg', alt: 'Be The Drive 2', href: 'https://bethedriver.global/' },
  { id: 8, src: '/sponsor/bisenergia.jpg', alt: 'Bisenergia', href: 'https://www.bisenergia.com/' },
  { id: 9, src: '/sponsor/bolsasecologicas.jpg', alt: 'Bolsas Ecologicas', href: 'https://www.bolsasecologicas.com.ar/' },
  { id: 10, src: '/sponsor/bolsasecologicas2.jpg', alt: 'Bolsas Ecologicas 2', href: 'https://www.bolsasecologicas.com.ar/' },
  { id: 11, src: '/sponsor/dag.jpg', alt: 'Dag', href: 'https://www.resortesdag.com.ar/' },
  { id: 12, src: '/sponsor/ecoenergia.jpg', alt: 'Ecoenergia', href: 'https://eco-energia.com.ar/' },
  { id: 13, src: '/sponsor/ecotec.jpg', alt: 'Ecotec', href: 'https://ecotecalternativas.wixsite.com/coop' },
  { id: 14, src: '/sponsor/fagus.jpg', alt: 'Fagus', href: 'https://www.tiendafagua.com.ar/' },
  { id: 15, src: '/sponsor/gestionparque.jpg', alt: 'Gestion Parque', href: 'https://gestionparque.com.ar/' },
  { id: 16, src: '/sponsor/jlf.jpg', alt: 'JLF', href: 'https://electrojlf.com.ar/' },
  { id: 17, src: '/sponsor/jlf2.jpg', alt: 'JLF 2', href: 'https://electrojlf.com.ar/' },
  { id: 18, src: '/sponsor/mccordones.jpg', alt: 'MC Cordones', href: 'https://mccordones.com.ar/' },
  { id: 19, src: '/sponsor/metsur.jpg', alt: 'Metsur', href: 'https://metsur.com/' },
  { id: 20, src: '/sponsor/nittihermanos.jpg', alt: 'Nitti Hermanos', href: 'https://nittihnosautopartes.mercadoshops.com.ar/' },
  { id: 21, src: '/sponsor/palletpro.jpg', alt: 'Pallet Pro', href: 'https://palletpro.com.ar/' },
  { id: 22, src: '/sponsor/palletpro2.jpg', alt: 'Pallet Pro 2', href: 'https://palletpro.com.ar/' },
  { id: 23, src: '/sponsor/rds.jpg', alt: 'RDS', href: 'https://www.instagram.com/reparaciones.del.sur/' },
  { id: 24, src: '/sponsor/rds2.jpg', alt: 'RDS 2', href: 'https://www.instagram.com/reparaciones.del.sur/' },
  { id: 25, src: '/sponsor/rfsoluciones.jpg', alt: 'RF Soluciones', href: '#' },
  { id: 26, src: '/sponsor/rfsoluciones2.jpg', alt: 'RF Soluciones 2', href: '#' },
  { id: 27, src: '/sponsor/santacruz.jpg', alt: 'Santa Cruz', href: 'https://alimentossantacruz.com/' },
  { id: 28, src: '/sponsor/santacruz2.jpg', alt: 'Santa Cruz 2', href: 'https://alimentossantacruz.com/' },
  { id: 29, src: '/sponsor/selsa.jpg', alt: 'Selsa', href: 'https://selsa.com.ar/' },
  { id: 30, src: '/sponsor/selsa2.jpg', alt: 'Selsa2', href: 'https://selsa.com.ar/' },
  { id: 31, src: '/sponsor/selsaoficial.jpg', alt: 'Selsa Oficial', href: 'https://selsa.com.ar/' },
  { id: 32, src: '/sponsor/sergiogerullo.jpg', alt: 'Sergio Gerullo', href: 'https://www.sergiocerullo.com.ar/' },
  { id: 33, src: '/sponsor/shekk.jpg', alt: 'Shekk', href: 'https://find.shell.com/ar/fuel/10130005-kosc-nicolas-s-a/es_AR' },
  { id: 34, src: '/sponsor/smartway.jpg', alt: 'Smartway', href: 'https://www.smartway.com.ar/' },
  { id: 35, src: '/sponsor/solari.jpg', alt: 'Solari', href: 'https://ejsolari.com/' },
  { id: 36, src: '/sponsor/solari2.jpg', alt: 'Solari 2', href: 'https://ejsolari.com/' },
  { id: 37, src: '/sponsor/startingpoint.jpg', alt: 'Starting Point', href: 'https://www.startingpoint.com.ar/' },
  { id: 38, src: '/sponsor/todoslossponsor.jpg', alt: 'Todos los Sponsor', href: '#' },
  { id: 39, src: '/sponsor/torcel.jpg', alt: 'Torcel', href: 'https://torcel.com.ar/' },
  { id: 40, src: '/sponsor/trabajamos.jpg', alt: 'Trabajamos', href: '#' },
  { id: 41, src: '/sponsor/work.jpg', alt: 'Work', href: 'https://estabilizadoreswork.com.ar/' },
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
