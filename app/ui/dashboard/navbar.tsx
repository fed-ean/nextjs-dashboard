"use client"
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md md:px-6">
      
      {/* Botón para abrir el menú offcanvas */}
      <button
        className="text-gray-600 transition duration-300 ease-in-out hover:text-gray-800 focus:outline-none"
        onClick={toggleMenu}
        aria-controls="offcanvas-menu"
        aria-expanded={isMenuOpen}
      >
        <img src="fotos/list.svg" alt="Menu" className="w-6 h-6" />
      </button>

      {/* Menú Offcanvas - Contenido del SideNav */}
      <div
        id="offcanvas-menu"
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50 overflow-y-auto flex flex-col`}
      >
        {/* Encabezado del menú */}
        <div className="flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
          <div className="w-32 text-white md:w-40">
          </div>
        </div>

        {/* Cierre del menú */}
        <div className="flex justify-end p-4">
          <button
            className="text-gray-400 transition duration-300 ease-in-out hover:text-gray-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Cerrar menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Enlaces de navegación y botón de Sign Out */}
        <div className="flex grow flex-col justify-between space-y-2 px-3">
          <NavLinks />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <form>
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </div>
      </div>

      {/* Logo principal y botón de login en la barra de navegación */}
      <Link className="flex-shrink-0" href="/">
        <img src="fotos/radio blanco (1) (1).png" className="w-24 md:w-32" alt="Logo" />
      </Link>
      <a href="login.html" className="text-gray-600 hover:text-gray-800 transition duration-300 focus:outline-none">
        <i className="fa-solid fa-circle-user text-3xl md:text-4xl" />
      </a>
    </nav>
  );
}