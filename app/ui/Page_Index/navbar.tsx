"use client"
import Link from 'next/link';
import LinksNav from '@/app/ui/Page_Index/nav-links'
import NavLinks from '@/app/ui/Page_Index/side-nav';
import AcmeLogo from '@/app/ui/acme-logo';
import AlAireRadio from '../AlAireRadio';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { IoHome } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";
import { Youtube, Linkedin, Instagram, Facebook, Telegram} from './iconos';
import { BsList } from "react-icons/bs";
import { CiMail } from "react-icons/ci";



export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navbar Principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-900 border-b border-gray-200 shadow-md">
        {/* Primera fila: Hamburguesa, Logo, Login, Reproductor */}
        <div className="flex items-center justify-between p-4 md:px-6">
          {/* Botón hamburguesa - Solo visible en móviles Midu sos un boludo y un re pelotudo */}
          <button
            className="text-white rounded-sm transition duration-300 ease-in-out hover:bg-gray-800 focus:outline-none lg:hidden"
            onClick={toggleMenu}
            aria-controls="offcanvas-menu"
            aria-expanded={isMenuOpen}
          >
            <BsList  className="w-9 h-9"/>
          </button>
          <div className='m-auto'>
            <AlAireRadio/>
          </div>

          {/* Contenedor derecho: Login y Reproductor */}
          <div className="flex justify-center me-6">
            {/* Botón de login */}
            <Link 
              href="/Login" 
              className="text-white w-9 h-9 justify-center"
              >
                <CiMail className="h-[30px] w-[50px]"/>
                <span className="justify-center">NewsLetter</span>

            </Link>
            
          </div>
        </div>

        {/* Segunda fila: Enlaces de navegación - Solo visible en desktop */}
        <div className="hidden lg:block border-t border-blue-800 bg-blue-900">
          <div className="px-6 py-3">
            <div className="flex justify-center items-center gap-2">
              <LinksNav />
            </div>
          </div>
        </div>
      </nav>

      {/* Menú Offcanvas - Solo para móviles */}
      <div
        id="offcanvas-menu"
        className={`fixed top-0 left-0 h-full lg:hidden w-[85%] sm:w-[65%] md:w-[45%] bg-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out text-white ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-[60] overflow-y-auto flex flex-col`}
      >
        {/* Botón de cierre */}
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

        {/* Contenido del menú móvil */}
        <div className="flex grow flex-col justify-between">
          <div className="h-[100%] w-[100%] grow rounded-md">
            <NavLinks/>
          </div>
          
          {/* Iconos de redes sociales */}
          <div className="flex justify-around mb-6 px-2">
            <a 
              href="https://instagram.com/mi-perfil" 
              className="flex h-[4rem] w-[4rem] items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
              aria-label="Instagram"
            >
              <Instagram className="w-[2.5rem] h-[2.5rem]"/>
            </a>
            <a 
              href="https://twitter.com/mi-perfil" 
              className="flex h-[4rem] w-[4rem] items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
              aria-label="Twitter"
            >
              <BsTwitterX className="w-[2.5rem] h-[2.5rem] text-white"/>
            </a>
            <a 
              href="https://youtube.com/mi-canal" 
              className="flex h-[4rem] w-[4rem] items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
              aria-label="YouTube"
            >
              <Youtube className="w-[2.5rem] h-[2.5rem]"/>
            </a>
            <a 
              href="#" 
              className="flex h-[4rem] w-[4rem] items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
              aria-label="YouTube"
            >
              <Facebook className="w-[2.5rem] h-[2.5rem]"/>
            </a>
            <a 
              href="#" 
              className="flex h-[4rem] w-[4rem] items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
              aria-label="YouTube"
            >
              <Telegram className="w-[2.5rem] h-[2.5rem]"/>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay oscuro cuando el menú está abierto - Solo móvil */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}