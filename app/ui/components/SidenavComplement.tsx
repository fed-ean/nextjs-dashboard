import React from "react";

type Sponsor = {
  id?: string;
  image: string; // url
  alt?: string;
  href?: string;
};

type SocialLink = {
  id?: string;
  href: string;
  label?: string;
  // one of: 'facebook' | 'twitter' | 'email' | 'instagram' | custom svg
  type: "facebook" | "twitter" | "email" | "instagram" | "custom";
  // if custom, provide `svg` string (raw SVG) or leave out to render a placeholder
  svg?: string;
};

export default function SidenavComplement({
  sponsors = [],
  socialLinks = [],
  className = "",
}: {
  sponsors?: Sponsor[];
  socialLinks?: SocialLink[];
  className?: string;
}) {
  // duplicate sponsors to create a seamless horizontal marquee
  const items = sponsors.length ? [...sponsors, ...sponsors] : [];

  // automatic animation duration based on number of logos (keeps speed reasonable)
  const durationSeconds = Math.max(10, Math.round((sponsors.length || 4) * 3));
  const marqueeStyle: React.CSSProperties = {
    // expose a CSS variable that the stylesheet below uses
    // TypeScript accepts this as a CSSProperties object
    ["--marquee-duration" as any]: `${durationSeconds}s`,
  };

  return (
    <aside className={`w-full max-w-[340px] ${className}`} aria-label="Complemento lateral">
      {/* Social "flecha de 4" */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 gap-3 transform rotate-45">
          {socialLinks.slice(0, 4).map((s, i) => (
            <a
              key={i}
              href={s.href}
              aria-label={s.label || s.type}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-white shadow-sm p-2 block rotate-[-45deg]"
              target="_blank"
              rel="noreferrer"
            >
              {renderSocialIcon(s)}
            </a>
          ))}
        </div>
      </div>

      {/* Separator (decorative) */}
      <div className="w-full flex justify-center mb-3">
        <div className="w-3/4 border-t border-dashed border-gray-200" />
      </div>

      {/* Título pequeño */}
      <div className="text-center text-xs tracking-wider text-gray-600 mb-3">SPONSORS</div>

      {/* Horizontal marquee carousel (renders only if hay sponsors) */}
      <div className="relative overflow-hidden">
        <div
          className="marquee will-change-transform"
          style={marqueeStyle}
          aria-hidden={items.length === 0}
        >
          {items.map((s, idx) => (
            <a
              key={`${s.image}-${idx}`}
              href={s.href || "#"}
              className="flex-shrink-0 w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md"
              target="_blank"
              rel="noreferrer"
            >
              <img src={s.image} alt={s.alt || "sponsor"} className="object-contain w-full h-full p-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Small accessibility note */}
      <p className="sr-only">Carrusel de patrocinadores en movimiento. Pausa al pasar el ratón.</p>

      {/* styles */}
      <style>{`
        .marquee {
          display: flex;
          gap: 1rem;
          padding-bottom: 0.5rem;
          align-items: center;

          /* use CSS variable for easy overrides */
          --marquee-duration: 18s;
          animation: marquee var(--marquee-duration) linear infinite;
        }

        /* pause when hovered or focused for accessibility */
        .marquee:hover,
        .marquee:focus-within {
          animation-play-state: paused;
        }

        .marquee img {
          display: block;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Small responsive tweaks */
        @media (max-width: 640px) {
          .marquee { gap: 0.75rem; }
        }
      `}</style>

      {/* Usage notes for developers (kept in file for convenience) */}
      {/*
        Para agregar más fotos: en el lugar donde importás este componente, pasale más objetos en el array `sponsors`.

        Ejemplo:

        <SidenavComplement
          socialLinks={[
            { type: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
            { type: 'twitter', href: 'https://twitter.com', label: 'Twitter' },
            { type: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
            { type: 'email', href: 'mailto:info@radio.com', label: 'Email' },
          ]}
          sponsors={[
            { image: '/sponsors/s1.png', alt: 'Sponsor 1', href: '#' },
            { image: '/sponsors/s2.png', alt: 'Sponsor 2', href: '#' },
            { image: '/sponsors/s3.png', alt: 'Sponsor 3', href: '#' },
            { image: '/sponsors/s4.png', alt: 'Sponsor 4', href: '#' },
            // agregá más objetos aquí y el carrusel los mostrará
          ]}
        />

        Nota: colocá las imágenes en /public/sponsors/ o en URLs absolutas.
      */}
    </aside>
  );
}

function renderSocialIcon(s: SocialLink) {
  switch (s.type) {
    case "facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 5.006 3.657 9.145 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.145 22 17.006 22 12z" fill="#1877F2"/>
        </svg>
      );
    case "twitter":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M22 5.924c-.63.28-1.307.469-2.018.554a3.52 3.52 0 0 0 1.547-1.944 7.036 7.036 0 0 1-2.23.85 3.506 3.506 0 0 0-5.973 3.197A9.95 9.95 0 0 1 3.17 4.9a3.506 3.506 0 0 0 1.083 4.68 3.48 3.48 0 0 1-1.588-.439v.044a3.507 3.507 0 0 0 2.814 3.438 3.525 3.525 0 0 1-1.582.06 3.507 3.507 0 0 0 3.273 2.433A7.03 7.03 0 0 1 2 19.54a9.92 9.92 0 0 0 5.384 1.577c6.458 0 9.987-5.349 9.987-9.987 0-.152-.004-.303-.01-.453A7.133 7.133 0 0 0 22 5.924z" fill="#1DA1F2"/>
        </svg>
      );
    case "email":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11zM4.5 6l7.5 5 7.5-5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "instagram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="#E1306C" strokeWidth="1.2"/>
          <path d="M16 11.37A4 4 0 1 1 11.37 7 4 4 0 0 1 16 11.37z" stroke="#E1306C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 6.5h.01" stroke="#E1306C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "custom":
    default:
      if (s.svg) {
        return (
          <span dangerouslySetInnerHTML={{ __html: s.svg }} aria-hidden />
        );
      }
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#CBD5E1" strokeWidth="1.2"/>
        </svg>
      );
  }
}

/*
Usage:

import SidenavComplement from './SidenavComplement';

<SidenavComplement
  socialLinks={[
    { type: 'facebook', href: 'https://facebook.com/tuRadio', label: 'Facebook' },
    { type: 'twitter', href: 'https://twitter.com/tuRadio', label: 'Twitter' },
    { type: 'email', href: 'mailto:info@tuRadio.com', label: 'Email' },
    { type: 'instagram', href: 'https://instagram.com/tuRadio', label: 'Instagram' },
  ]}
  sponsors={[
    { image: '/sponsors/logo1.png', href: '#', alt: 'Sponsor 1' },
    { image: '/sponsors/logo2.png', href: '#', alt: 'Sponsor 2' },
    { image: '/sponsors/logo3.png', href: '#', alt: 'Sponsor 3' },
  ]}
/>

Integration notes:
- Poné este componente entre tu Sidenav y el contenido del artículo en la plantilla de la página de noticia.
- Si querés usar el carrusel que ya tenés en el proyecto, reemplazá el bloque de "marquee" por tu componente y pasale `sponsors`.
- Ajustá `animation-duration` en la regla `@keyframes marquee` para acelerar/ralentizar.
- El carrusel pausa al pasar el ratón por accesibilidad.
*/
