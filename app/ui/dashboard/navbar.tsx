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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-blue-900 border-b border-gray-200 shadow-md md:px-6">
      
      {/* Botón para abrir el menú offcanvas */}
      <button
        className="text-gray-600 transition duration-300 ease-in-out hover:text-gray-800 focus:outline-none"
        onClick={toggleMenu}
        aria-controls="offcanvas-menu"
        aria-expanded={isMenuOpen}
      >
        <img src="fotos/list.svg" alt="Menu" className="w-9 h-9" />
      </button>

      {/* Menú Offcanvas - Contenido del SideNav */}
      <div
        id="offcanvas-menu"
        className={`fixed top-0 left-0 h-full w-[27%] bg-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out text-white ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50 overflow-y-auto flex flex-col`}
      >

        {/* Cierre del menú */}
        <div className="flex justify-end p-4">
          <button
            className="text-gray-400 transition duration-300 ease-in-out hover:text-white focus:outline-none"
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

        {/* Encabezado del menú */}
        <div className="flex h-[3rem] items-center justify-center rounded-md bg-blue-900 p-0 ">
          <div className="w-[100%] text-white">
            <p className="flex justify-center m-0 border-b">Explorar</p>
          </div>
        </div>

        {/* Enlaces de navegación y botón de Sign Out */}
        <div className="flex grow flex-col justify-between space-y-2 ">
          <div className="hidden h-auto w-[100%] grow rounded-md md:block">
            <a href="#" className="flex h-[17%] grow items-center border-b-black transition duration-300 justify-center gap-1 p-4 text-base font-medium hover:bg-blue-100 hover:text-black md:flex-none md:justify-start md:p-2 md:px-3 text-white">
              Inicio
            </a>
            <a href="#" className="flex h-[17%] grow items-center border-b-black transition duration-300 justify-center gap-1 p-4 text-base font-medium hover:bg-blue-100 hover:text-black md:flex-none md:justify-start md:p-2 md:px-3 text-white">
              Politica
            </a>
            <a href="#" className="flex h-[17%] grow items-center border-b-black transition duration-300 justify-center gap-1 p-4 text-base font-medium hover:bg-blue-100 hover:text-black md:flex-none md:justify-start md:p-2 md:px-3 text-white">
              Economia
            </a>
            <a href="#" className="flex h-[17%] grow items-center border-b-black transition duration-300 justify-center gap-1 p-4 text-base font-medium hover:bg-blue-100 hover:text-black md:flex-none md:justify-start md:p-2 md:px-3 text-white">
              PYMES
            </a>
            <a href="#" className="flex h-[17%] grow items-center border-b-black transition duration-300 justify-center gap-1 p-4 text-base font-medium hover:bg-blue-100 hover:text-black md:flex-none md:justify-start md:p-2 md:px-3 text-white">
              Interes general
            </a>
          </div>
          <div className="flex justify-around mb-3">
            <button className="flex h-[4rem] w-[4rem] mb-1 grow items-center justify-center gap-2 rounded-md bg-blue-200 p-3 text-sm font-medium hover:bg-blue-50 md:flex-none md:justify-start md:p-2 md:px-3">
               
            </button>
            <button className="flex h-[4rem] w-[4rem] mb-1 grow items-center justify-center gap-2 rounded-md bg-blue-200 p-3 text-sm font-medium hover:bg-blue-50 md:flex-none md:justify-start md:p-2 md:px-3">
               
            </button>
            <button className="flex h-[4rem] w-[4rem] mb-1 grow items-center justify-center gap-2 rounded-md bg-blue-200 p-3 text-sm font-medium hover:bg-sky-100 md:flex-none md:justify-start md:p-2 md:px-3">
               
            </button>
            <button className="flex h-[4rem] w-[4rem] mb-1 grow items-center justify-center gap-2 rounded-md bg-blue-200 p-3 text-sm font-medium hover:bg-sky-100 md:flex-none md:justify-start md:p-2 md:px-3">
               
            </button>
          </div>
        </div>
      </div>

      {/* Logo principal y botón de login en la barra de navegación */}
      <Link className="flex-shrink-0" href="/">
        <img src="fotos/radio blanco (1) (1).png" className="w-40 md:w-40" alt="Logo" />
      </Link>
      <a href="login.html" className="text-gray-600 hover:text-gray-800 transition duration-300 focus:outline-none">
        <i className="fa-solid fa-circle-user text-3xl md:text-4xl text" />
      </a>
    </nav>
  );
}