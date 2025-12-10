'use client';
import Link from 'next/link';
import Image from 'next/image';
import LinksNav from '@/app/ui/Page_Index/nav-links';
import NavLinks from '@/app/ui/Page_Index/side-nav';
import AlAireRadio from '../AlAireRadio';
import { useState, useEffect, type ReactNode, useRef } from 'react';
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
  const [showDesktopTooltipAuto, setShowDesktopTooltipAuto] = useState(false);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    // On mount: if not shown before and on desktop, show desktop tooltip once automatically
    if (typeof window === 'undefined') return;
    const alreadyShown = localStorage.getItem('tooltipShown');

    if (!alreadyShown && window.innerWidth >= 1024) {
      setShowDesktopTooltipAuto(true);
      localStorage.setItem('tooltipShown', 'true');

      // auto-hide after 10s
      const t = window.setTimeout(() => setShowDesktopTooltipAuto(false), 10000);
      timeoutsRef.current.push(t);
    }

    return () => {
      // cleanup on unmount
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  // When mobile menu opens: show mobile tooltip once if not shown before
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isMenuOpen) return;

    const alreadyShown = localStorage.getItem('tooltipShown');
    if (!alreadyShown) {
      // show mobile tooltip and mark as shown
      setShowMobileTooltip(true);
      localStorage.setItem('tooltipShown', 'true');

      const t = window.setTimeout(() => setShowMobileTooltip(false), 10000);
      timeoutsRef.current.push(t);
    }
    // if already shown previously, do nothing
  }, [isMenuOpen]);

  // clear timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

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
          <div className="flex items-center justify-between md:px-6 bg-fondo-svg bg-hexagon-pattern">
            
            {/* IZQUIERDA: Contacto (con tooltip desktop) arriba y Conocé al Staff abajo */}
            <div className="w-1/4 flex flex-col items-start justify-center pl-6 space-y-2">
              
              {/* Conocé al Staff (simple button below) */}
              <Link
                href="/Equipo"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition font-semibold text-sm"
                aria-label="Conocé al Staff - Radio Empresarial"
              >
                👥 Conocé al Staff
              </Link>

              {/* Contacto button with tooltip wrapper */}
              <div className="relative group w-fit">
                {/* CONTACTO BUTTON (keyboard focus works via group-focus-within) */}
                <Link
                  href="/Contacto"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-700 rounded-lg shadow-sm hover:bg-blue-50 transition font-semibold text-sm focus:outline-none"
                  aria-label="Contacto - Radio Empresarial"
                  aria-describedby="tooltip-contacto"
                >
                  📞 Contacto
                </Link>

                {/* Tooltip box (always in DOM but visibility controlled by state and group hover/focus) */}
                <div
                  id="tooltip-contacto"
                  role="tooltip"
                  aria-hidden={!showDesktopTooltipAuto}
                  className={`
                    hidden lg:block absolute left-1/2 -translate-x-1/2 -top-28 w-72 bg-white text-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 z-50 transition-all duration-500
                    ${showDesktopTooltipAuto ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
                    group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0
                  `}
                >
                  <p className="text-sm leading-tight">
                    <strong>Radio Empresaria</strong> es un proyecto creado por empresarios pymes.
                    <br /><br />
                    Nuestro objetivo es que nos difundamos entre nosotros.
                    <br />
                    <a href="/Equipo" className="font-semibold text-blue-700 underline">
                      Conocé más de nosotros aquí.
                    </a>
                  </p>

                  {/* FLECHITA */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-200" />
                </div>
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

          </div>

          {/* --- Parte inferior (Vuelve a ser azul con texto blanco) --- */}
          <div className="border-t border-blue-800 bg-blue-900 text-white">
            <div className="px-6 py-1">
              <div className="flex justify-center items-center gap-4">
                <LinksNav />
                <div className="w-1/4">
                  <SearchForm placeholder="Buscar noticias..." />
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

        <div className="p-4"><SearchForm placeholder="Buscar noticias..." /></div>

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
