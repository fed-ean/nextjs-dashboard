'use client'
import Link from 'next/link';
import LinksNav from '@/app/ui/Page_Index/nav-links';
import NavLinks from '@/app/ui/Page_Index/side-nav';
import AlAireRadio from '../AlAireRadio';
import { useState } from 'react';
import { BsTwitterX } from "react-icons/bs";
import { Youtube, Instagram, Facebook, Telegram} from './iconos';
import { BsList } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import SearchForm from './search-form';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Navbar Principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-900 border-b border-gray-200 shadow-md">
        {/* Primera fila */}
        <div className="flex items-center justify-between p-4 md:px-6">
          <button
            className="text-white rounded-sm transition duration-300 ease-in-out hover:bg-gray-800 focus:outline-none lg:hidden"
            onClick={toggleMenu}
            aria-controls="offcanvas-menu"
            aria-expanded={isMenuOpen}
          >
            <BsList className="w-9 h-9" />
          </button>
          <div className='m-auto'>
            <AlAireRadio />
          </div>
          <div className="flex justify-center me-6">
            <Link href="/Login" className="text-white w-9 h-9 justify-center">
              <CiMail className="h-[30px] w-[50px]" />
              <span className="justify-center">NewsLetter</span>
            </Link>
          </div>
        </div>

        {/* Segunda fila: Navegación y Búsqueda (Desktop) */}
        <div className="hidden lg:block border-t border-blue-800 bg-blue-900">
          <div className="px-6 py-3">
            <div className="flex justify-center items-center gap-4">
              <LinksNav />
              <div className="w-1/4">
                <SearchForm placeholder="Buscar noticias..." />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú Offcanvas (Móvil) */}
      <div
        id="offcanvas-menu"
        className={`fixed top-0 left-0 h-full lg:hidden w-[85%] sm:w-[65%] md:w-[45%] bg-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out text-white ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-[60] overflow-y-auto flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {/* Encabezado con botón de cierre */}
        <div className="flex justify-end p-4">
          <button
            onClick={closeMenu}
            className="text-gray-400 transition duration-300 ease-in-out hover:text-white focus:outline-none"
            aria-label="Cerrar menú"
          >
             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Búsqueda en menú móvil */}
        <div className="p-4">
          <SearchForm placeholder="Buscar noticias..." />
        </div>

        {/* Contenido del menú */}
        <div className="flex grow flex-col justify-between">
          {/* Pasamos la función `closeMenu` al componente de enlaces */}
          <NavLinks onLinkClick={closeMenu} />
          
          {/* Iconos de redes sociales */}
          <div className="flex justify-around mb-6 px-2">
             <a href="https://instagram.com/mi-perfil" aria-label="Instagram" className="p-2"><Instagram className="w-8 h-8"/></a>
             <a href="https://twitter.com/mi-perfil" aria-label="Twitter" className="p-2"><BsTwitterX className="w-8 h-8 text-white"/></a>
             <a href="https://youtube.com/mi-canal" aria-label="YouTube" className="p-2"><Youtube className="w-8 h-8"/></a>
             <a href="#" aria-label="Facebook" className="p-2"><Facebook className="w-8 h-8"/></a>
             <a href="#" aria-label="Telegram" className="p-2"><Telegram className="w-8 h-8"/></a>
          </div>
        </div>
      </div>

      {/* Overlay oscuro */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
