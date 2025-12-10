'use client';
import Link from 'next/link';
import Image from 'next/image';
import LinksNav from '@/app/ui/Page_Index/nav-links';
import NavLinks from '@/app/ui/Page_Index/side-nav';
import AlAireRadio from '../AlAireRadio';
import { useState, useEffect, type ReactNode, useRef, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { BsTwitterX } from "react-icons/bs";
import { Youtube, Instagram, Facebook, Telegram } from './iconos';
import { BsList } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import SearchForm from './search-form';

export default function NavBar({ newsComponent }: { newsComponent?: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // ---------- Tooltip logic (for "Contacto") ----------
  const [showDesktopTooltip, setShowDesktopTooltip] = useState(false);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const contactBtnRef = useRef<HTMLAnchorElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  // Show desktop tooltip immediately on page load (for desktop widths)
  // Show tooltip only once (desktop)
useEffect(() => {
  if (typeof window === 'undefined') return;

  const alreadySeen = localStorage.getItem("tooltip_contacto_seen");

  // DESKTOP: show only if not seen before
  if (window.innerWidth >= 1024 && !alreadySeen) {
    setShowDesktopTooltip(true);

    // mark as seen instantly
    localStorage.setItem("tooltip_contacto_seen", "true");

    // auto-hide after 5s
    const t = window.setTimeout(() => setShowDesktopTooltip(false), 5000);
    timeoutsRef.current.push(t);
  }

  // Click outside closes tooltip
  const onDocClick = () => {
    setShowDesktopTooltip(false);
    setShowMobileTooltip(false);
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  document.addEventListener('click', onDocClick);

  return () => {
    document.removeEventListener('click', onDocClick);
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };
}, []);

  // When mobile menu opens: show mobile tooltip (auto) and hide after 5s
  useEffect(() => {
  if (typeof window === 'undefined') return;
  if (!isMenuOpen) return;

  const alreadySeen = localStorage.getItem("tooltip_contacto_seen");

  // MOBILE: show only once as well
  if (!alreadySeen) {
    setShowMobileTooltip(true);
    localStorage.setItem("tooltip_contacto_seen", "true");

    const t = window.setTimeout(() => setShowMobileTooltip(false), 5000);
    timeoutsRef.current.push(t);

    return () => window.clearTimeout(t);
  }
}, [isMenuOpen]);


  // Position arrow to point to contact button (runs when tooltip shown)
  useEffect(() => {
    if (!showDesktopTooltip) return;
    if (!tooltipRef.current || !contactBtnRef.current || !arrowRef.current) return;

    const tooltipEl = tooltipRef.current;
    const btnEl = contactBtnRef.current;
    const arrowEl = arrowRef.current;

    // compute positions after a tick (allow layout to settle)
    const compute = () => {
      const tooltipRect = tooltipEl.getBoundingClientRect();
      const btnRect = btnEl.getBoundingClientRect();

      // button center X in viewport
      const btnCenterX = btnRect.left + btnRect.width / 2;
      // compute left offset of arrow relative to tooltip
      const arrowLeft = Math.max(8, Math.min(tooltipRect.width - 16, btnCenterX - tooltipRect.left - 8)); // keep inside tooltip
      arrowEl.style.left = `${arrowLeft}px`;
    };

    // compute immediately and also after a short delay (for safety)
    compute();
    const id = window.setTimeout(compute, 120);
    timeoutsRef.current.push(id);

    // recompute on resize
    const onResize = () => compute();
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', onResize);
    };
  }, [showDesktopTooltip]);

  // ---------- End tooltip logic ----------

  return (
    <>
      {/* Contenedor principal con texto oscuro por defecto */}
      <nav className="fixed top-14 lg:top-0 left-0 right-0 z-50 text-gray-800 border-b border-gray-200 shadow-md">
        
        {/* --- VISTA MÓVIL (Fondo blanco) --- */}
        <div className="lg:hidden grid grid-cols-3 items-center p-4 bg-white">
          <div className="flex justify-start">
            <button
              className="text-gray-800 rounded-sm transition duration-300 ease-in-out hover:bg-gray-200 focus:outline-none"
              onClick={toggleMenu}
              aria-controls="offcanvas-menu"
              aria-expanded={isMenuOpen}
            >
              <BsList className="w-9 h-9" />
            </button>
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/RadioAColor1.png"
                alt="Logo Radio A Color"
                width={180} 
                height={50}
                className="object-contain"
                priority
              />
            </Link>
          </div>
          <div className="flex justify-end items-center">
            <Link href="/Login" className="flex items-center gap-2 text-gray-800">
              <HiOutlineMail className="h-8 w-8" />
            </Link>
          </div>
        </div>

        {/* --- VISTA ESCRITORIO --- */}
        <div className="hidden lg:block">
          {/* --- Parte superior (Con fondo de rombos) --- */}
          <div className="flex items-center justify-between md:px-6 bg-fondo-svg bg-hexagon-pattern" style={{ minHeight: 88 }}>
            
            {/* IZQUIERDA: Conocé al Staff y Contacto */}
            <div className="w-1/4 flex flex-col items-start justify-center pl-6 space-y-2">
              
              {/* Conocé al Staff (simple button below) */}
              <Link
                href="/Equipo"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition font-semibold text-sm"
                aria-label="Conocé al Staff - Radio Empresarial"
              >
                👥 Conocé al Staff
              </Link>

              {/* Contacto button (we keep a ref to compute arrow) */}
              <div className="relative">
                <Link
                  href="/Contacto"
                  ref={contactBtnRef as any}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-700 rounded-lg shadow-sm hover:bg-blue-50 transition font-semibold text-sm focus:outline-none"
                  aria-label="Contacto - Radio Empresarial"
                >
                  📞 Contacto
                </Link>
              </div>
            </div>

            {/* CENTRO: AlAire + logo */}
            <div className="flex justify-center">
                <AlAireRadio />
            </div>

            {/* DERECHA: Suscribite */}
            <div className="flex justify-end w-1/4">
              <Link href="/Login" className="flex items-center gap-2 text-gray-800 transition-transform duration-300 ease-in-out hover:scale-105">
                <HiOutlineMail className="h-8 w-8" />
                <span className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-rose-500 text-transparent bg-clip-text">
                  Suscribite
                </span>
              </Link>
            </div>

            {/* TOOLTIP (desktop) - centered on screen, arrow positioned to point to Contact button */}
            {showDesktopTooltip && (
              <div
                ref={tooltipRef as any}
                className="hidden lg:block fixed left-1/2 top-[18vh] -translate-x-1/2 w-96 bg-white text-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200 z-[70] pointer-events-none"
                style={{ transform: 'translate(-50%, 0)' }} // center horizontally
              >
                <div className="text-sm leading-tight">
                  <strong>Radio Empresaria</strong> es un proyecto creado por empresarios pymes.
                  <br /><br />
                  Nuestro objetivo es que nos difundamos entre nosotros.
                  <br />
                  <a href="/Equipo" className="font-semibold text-blue-700 underline">
                    Conocé más de nosotros aquí.
                  </a>
                </div>

                {/* Arrow (absolute inside tooltip) */}
                <div
                  ref={arrowRef as any}
                  className="absolute -bottom-3 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-200"
                  style={{ left: '50%' }} // replaced dynamically in effect
                />
              </div>
            )}
          </div>

          {/* --- Parte inferior (Vuelve a ser azul con texto blanco) --- */}
          <div className="border-t border-blue-800 bg-blue-900 text-white">
            <div className="px-6 py-1">
              <div className="flex justify-center items-center gap-4">
                <LinksNav />
                <div className="w-1/4">
                  <Suspense fallback={null}>
                    <SearchForm placeholder="Buscar noticias..." />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MENÚ LATERAL (Offcanvas) --- */}
      <div
        id="offcanvas-menu"
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] lg:hidden w-[90%] sm:w-[70%] md:w-[50%] bg-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out text-white ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-[60] overflow-y-auto flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end p-4">
          <button onClick={closeMenu} className="text-gray-400 hover:text-white" aria-label="Cerrar menú">
             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Mobile tooltip: appears at top of offcanvas when menu opens (points down towards Contact button) */}
        {showMobileTooltip && (
          <div className="relative px-6">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[88%] bg-white text-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 z-50">
              <p className="text-sm leading-tight">
                <strong>Radio Empresaria</strong> es un proyecto creado por empresarios pymes.
                <br /><br />
                Nuestro objetivo es que nos difundamos entre nosotros.
                <br />
                <a href="/Equipo" className="font-semibold text-blue-700 underline">
                  Conocé más de nosotros aquí.
                </a>
              </p>
              {/* Flecha apuntando hacia abajo */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-200" />
            </div>
            {/* spacer to keep layout from shifting */}
            <div className="h-24" />
          </div>
        )}

        <div className="p-4">
          <Suspense fallback={null}>
            <SearchForm placeholder="Buscar noticias..." />
          </Suspense>
        </div>

        {/* Botón Contacto (mobile) */}
        <div className="px-4 mb-2">
          <Link
            href="/Contacto"
            onClick={closeMenu}
            className="w-full inline-flex items-center gap-2 px-4 py-3 bg-white text-blue-700 border border-blue-700 rounded-lg shadow-sm hover:bg-blue-50 transition font-semibold text-base justify-center"
          >
            📞 Contacto
          </Link>
        </div>

        {/* Botón Conocé al Staff (mobile) */}
        <div className="px-4 mb-2">
          <Link
            href="/Equipo"
            onClick={closeMenu}
            className="w-full inline-flex items-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition font-semibold text-base justify-center"
          >
            👥 Conocé al Staff
          </Link>
        </div>

        <div className="flex grow flex-col justify-between overflow-y-auto">
            <NavLinks onLinkClick={closeMenu} />
            <div className="flex-grow">{newsComponent}</div>
            <div className="flex justify-around mt-auto mb-6 px-2">
               <a href="#" aria-label="Instagram"><Instagram className="w-8 h-8"/></a>
               <a href="#" aria-label="Twitter"><BsTwitterX className="w-8 h-8 text-white"/></a>
               <a href="#" aria-label="YouTube"><Youtube className="w-8 h-8"/></a>
               <a href="#" aria-label="Facebook"><Facebook className="w-8 h-8"/></a>
               <a href="#" aria-label="Telegram"><Telegram className="w-8 h-8"/></a>
            </div>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden" onClick={closeMenu} />}
    </>
  );
}
