// app/ui/components/SidenavComplement.tsx
'use client';

import React from 'react';

export type Sponsor = {
  id?: string;
  image: string;
  alt?: string;
  href?: string;
};

export type SocialLink = {
  id?: string;
  href: string;
  label?: string;
  type: 'facebook' | 'twitter' | 'email' | 'instagram' | 'custom';
  svg?: string;
};

export const SidenavComplement: React.FC<{
  sponsors?: Sponsor[];
  socialLinks?: SocialLink[];
  className?: string;
}> = ({ sponsors = [], socialLinks = [], className = '' }) => {
  // Limit a 16 items como en tu versión original
  const sponsorsToUse = (sponsors || []).slice(0, 39);
  const items = sponsorsToUse.length ? [...sponsorsToUse, ...sponsorsToUse] : [];
  const durationSeconds = Math.max(12, Math.round((sponsorsToUse.length || 4) * 4));
  const visibleHeight = '2150px'; // mantené o ajustá según quieras
  const marqueeStyle: React.CSSProperties = {
    ['--marquee-duration' as any]: `${durationSeconds}s`,
    ['--marquee-visible-height' as any]: visibleHeight,
  };

  return (
    <aside className={`w-full max-w-[340px] ${className}`} aria-label="Complemento lateral">
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

      <div className="w-full flex justify-center mb-3">
        <div className="w-3/4 border-t border-dashed border-gray-200" />
      </div>

      <div className="text-center text-xs tracking-wider text-gray-600 mb-3">SPONSORS</div>

      <div className="relative flex justify-center" style={marqueeStyle}>
        <div className="marquee-viewport" style={{ height: visibleHeight, overflow: 'hidden' }}>
          {items.length > 0 ? (
            <div className="marquee-vertical will-change-transform" aria-hidden>
              {items.map((s, idx) => (
                <a
                  key={`${s.image}-${idx}`}
                  href={s.href || '#'}
                  className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={s.image} alt={s.alt || 'sponsor'} className="object-contain w-full h-full p-6" />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-xs text-gray-400">No hay sponsors</div>
          )}
        </div>
      </div>

      <p className="sr-only">Carrusel de patrocinadores en movimiento. Pausa al pasar el ratón.</p>

      <style>{`
        .marquee-vertical {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          --marquee-duration: 18s;
          animation: marquee-vertical var(--marquee-duration) linear infinite;
        }
        .marquee-vertical:hover,
        .marquee-vertical:focus-within {
          animation-play-state: paused;
        }
        @keyframes marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @media (max-width: 640px) {
          .marquee-vertical { gap: 0.5rem; }
        }
      `}</style>
    </aside>
  );
};

export default SidenavComplement;

// helpers (mismo renderSocialIcon que tenías)
function renderSocialIcon(s: SocialLink) {
  switch (s.type) {
    case 'facebook':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 5.006 3.657 9.145 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.145 22 17.006 22 12z" fill="#1877F2"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M22 5.924c-.63.28-1.307.469-2.018.554a3.52 3.52 0 0 0 1.547-1.944 7.036 7.036 0 0 1-2.23.85 3.506 3.506 0 0 0-5.973 3.197A9.95 9.95 0 0 1 3.17 4.9a3.506 3.506 0 0 0 1.083 4.68 3.48 3.48 0 0 1-1.588-.439v.044a3.507 3.507 0 0 0 2.814 3.438 3.525 3.525 0 0 1-1.582.06 3.507 3.507 0 0 0 3.273 2.433A7.03 7.03 0 0 1 2 19.54a9.92 9.92 0 0 0 5.384 1.577c6.458 0 9.987-5.349 9.987-9.987 0-.152-.004-.303-.01-.453A7.133 7.133 0 0 0 22 5.924z" fill="#1DA1F2"/>
        </svg>
      );
    case 'email':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11zM4.5 6l7.5 5 7.5-5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="#E1306C" strokeWidth="1.2"/>
          <path d="M16 11.37A4 4 0 1 1 11.37 7 4 4 0 0 1 16 11.37z" stroke="#E1306C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 6.5h.01" stroke="#E1306C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'custom':
    default:
      if (s.svg) {
        return <span dangerouslySetInnerHTML={{ __html: s.svg }} aria-hidden />;
      }
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#CBD5E1" strokeWidth="1.2"/>
        </svg>
      );
  }
}
