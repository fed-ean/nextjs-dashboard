'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getClient } from '../../lib/cliente'; // AJUSTA la ruta si tu cliente está en otra ubicación
import {
  GET_ALL_CATEGORIES,
  GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
  GET_CATEGORY_POSTS_BY_SLUG,
  GET_CATEGORY_POSTS_BY_SLUGIN,
  GET_ALL_POSTS
} from '../../lib/queries';

/* ==================== ICONOS (copiados de tu implementación) ==================== */
/* Icono de Casa */
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
  </svg>
);

/* Icono de Balanza */
const IconScale = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);

/* Icono de Gráfico/Economía */
const IconChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16v5"/>
    <path d="M16 14v7"/>
    <path d="M20 10v11"/>
    <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/>
    <path d="M4 18v3"/>
    <path d="M8 14v7"/>
  </svg>
);

/* Icono de Maletín */
const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12h.01"/>
    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <path d="M22 13a18.15 18.15 0 0 1-20 0"/>
    <rect width="20" height="14" x="2" y="6" rx="2"/>
  </svg>
);

/* Icono de Mundo */
const IconWorld = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
    <path d="M2 12h20"/>
  </svg>
);

/* ==================== ICONOS SUBMENU (pequeños) ==================== */
const IconReporteRegional = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v4H3V3z"/>
    <path d="M3 11h18v4H3v-4z"/>
    <path d="M3 19h18v2H3v-2z"/>
  </svg>
);

const IconDesayunoPYME = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
    <path d="M8 14l4-4 4 4"/>
  </svg>
);

const IconCadenaVerdeAmarrilla = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const IconVarias = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);

/* ==================== ICON MAP para slugs conocidos ==================== */
const ICON_BY_SLUG: Record<string, any> = {
  politica: IconScale,
  economia: IconChart,
  pymes: IconBriefcase,
  'interes-general': IconWorld,
};

/* Submenu programas (igual que antes) */
const programas = [
  { name: 'Reporte Regional', href: '/programas/reporte-regional', Icon: IconReporteRegional },
  { name: 'Desayuno PYME', href: '/programas/desayuno-pyme', Icon: IconDesayunoPYME },
  { name: 'Cadena VerdeAmarrilla', href: '/programas/cadena-verdeamarrilla', Icon: IconCadenaVerdeAmarrilla },
  { name: 'Varias', href: '/programas/varias', Icon: IconVarias },
];

export default function LinksNav() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // estado para categorías dinámicas
  const [links, setLinks] = useState<Array<{ name: string; href: string; Icon?: any }>>([
    { name: 'Inicio', href: '/', Icon: IconHome },
  ]);

  useEffect(() => {
    let mounted = true;
    const client = getClient();

    async function loadCategories() {
      try {
        const { data } = await client.query({ query: GET_ALL_CATEGORIES, fetchPolicy: 'network-only' });
        const cats = data?.categories?.nodes ?? [];

        // Orden deseado y filtrado (si WP tiene slugs distintos, cámbialos aquí)
        const wantedOrder = ['politica', 'economia', 'pymes', 'interes-general'];
        const mainCats = wantedOrder
          .map(slug => cats.find((c: any) => c.slug === slug))
          .filter(Boolean);

        const built = [
          { name: 'Inicio', href: '/', Icon: IconHome },
          ...mainCats.map((c: any) => ({
            name: c.name,
            href: `/Categorias/${c.slug}`,
            Icon: ICON_BY_SLUG[c.slug] ?? undefined,
          })),
        ];

        if (mounted) setLinks(built);
      } catch (err) {
        console.error('Error cargando categorías para navbar', err);
      }
    }

    loadCategories();
    return () => { mounted = false; };
  }, []);

  // función para prefetch de posts (mejora UX)
  const handlePrefetch = (href: string) => {
    const match = href.match(/\/Categorias\/(.+)$/);
    if (!match) return;
    const slug = match[1];
    const client = getClient();

    // intentamos en este orden: slug array -> slug string -> slugIn
    client.query({ query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY, variables: { slugs: [slug], first: 5, after: null } })
      .catch(() => client.query({ query: GET_CATEGORY_POSTS_BY_SLUG, variables: { slug, first: 5, after: null } }))
      .catch(() => client.query({ query: GET_CATEGORY_POSTS_BY_SLUGIN, variables: { slugIn: [slug], first: 5, after: null } }))
      .catch(()=>{});
  };

  return (
    <>
      {links.map((link) => {
        const Icon = link.Icon ?? (() => null);
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/") || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out text-xl ${
              isActive ? "bg-white text-blue-900 shadow-md" : "text-white hover:bg-blue-100 hover:text-blue-900 hover:shadow-lg"
            }`}
            onMouseEnter={() => handlePrefetch(link.href)}
          >
            <Icon />
            <span className="whitespace-nowrap">{link.name}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 ease-out group-hover:w-full"></span>
          </Link>
        );
      })}

      {/* Dropdown "Programas" - wrapper contiene botón + menú */}
      <div
        ref={wrapperRef}
        className="relative inline-block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          const related = (e as React.FocusEvent).relatedTarget as Node | null;
          if (!wrapperRef.current?.contains(related)) setOpen(false);
        }}
      >
        <button
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out text-xl ${
            pathname.startsWith("/programas") ? "bg-white text-blue-900 shadow-md" : "text-white hover:bg-blue-100 hover:text-blue-900 hover:shadow-lg"
          }`}
        >
          <span>Programas</span>
        </button>

        {open && (
          <div
            role="menu"
            aria-label="Programas"
            className="absolute left-0 top-full translate-y-1 w-56 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {programas.map((item) => {
              const Icon = item.Icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  role="menuitem"
                  tabIndex={0}
                  className="flex items-center px-4 py-2 text-base hover:bg-blue-100 hover:text-blue-900 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Icon />
                  <span className="ml-2">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
