import Link from 'next/link';
import React from 'react';

// Icono de Casa (simula IoHome)
const IconHome = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-11" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
</svg>

);

// Icono de Balanza (simula LuScale - Política)
const IconScale = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-11 lucide lucide-scale-icon lucide-scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
);

// Icono de Gráfico/Economía (simula LuChartNoAxesCombined)
const IconChart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-11 lucide lucide-chart-no-axes-combined-icon lucide-chart-no-axes-combined" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/></svg>
);

// Icono de Maletín (simula BsBriefcase - PYMES)
const IconBriefcase = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-11 lucide lucide-briefcase-business-icon lucide-briefcase-business" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
);

// Icono de Mundo (simula TbWorld - Interés general)
const IconWorld = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-11 lucide lucide-globe-icon lucide-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);


// Mapeo de enlaces usando los componentes Icono SVG locales.
const links = [
  { 
    name: 'Inicio', 
    href: '/',
    Icon: IconHome,
  },
  {
    name: 'Política', 
    href: "/Categorias/Noticias",
    Icon: IconScale,
  },
  {
    name: 'Economía',
    href: '/Categorias/Noticias',
    Icon: IconChart,
  },
  {
    name: 'PYMES',
    href: '/Categorias/Noticias',
    Icon: IconBriefcase,
  },
  {
    name: 'Interés general',
    href: '/Categorias/Noticias',
    Icon: IconWorld,
  },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const Icon = link.Icon; 

        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[18%] w-[100%] text-lg grow items-center border-b-black transition duration-300 gap-1 p-2 pl-[20%] hover:bg-blue-100 hover:text-black"
          >
            <Icon />

            {link.name}
          </Link>
        );
      })}
    </>
  );
}