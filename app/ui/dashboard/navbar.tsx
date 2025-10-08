"use client"
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/side-nav';
import AcmeLogo from '@/app/ui/acme-logo';
import RadioPlayer from '../Reproductor';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { IoHome } from "react-icons/io5";
import { PiXLogo } from "react-icons/pi";

// https://feathericons.dev/?search=youtube&iconset=brands&format=strict-jsx
export function Youtube(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" {...props}>
      <path clipRule="evenodd" d="M22.747 4.834c.372.375.64.84.775 1.351.502 1.885.502 5.815.502 5.815s0 3.93-.502 5.815A3.017 3.017 0 0 1 21.4 19.95c-1.876.505-9.376.505-9.376.505s-7.5 0-9.376-.505a3.016 3.016 0 0 1-2.122-2.135C.024 15.93.024 12 .024 12s0-3.93.502-5.815A3.016 3.016 0 0 1 2.648 4.05c1.876-.505 9.376-.505 9.376-.505s7.5 0 9.376.505c.51.139.974.41 1.347.784ZM15.842 12 9.57 8.431v7.138L15.842 12Z" fill="#FF0302" fillRule="evenodd" />
    </svg>
  );
}


// https://feathericons.dev/?search=linkedin&iconset=brands&format=strict-jsx
export function Linkedin(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" {...props}>
      <path d="M5.372 24H.396V7.976h4.976V24ZM2.882 5.79C1.29 5.79 0 4.474 0 2.883a2.882 2.882 0 1 1 5.763 0c0 1.59-1.29 2.909-2.881 2.909ZM23.995 24H19.03v-7.8c0-1.86-.038-4.243-2.587-4.243-2.587 0-2.984 2.02-2.984 4.109V24H8.49V7.976h4.772v2.186h.07c.664-1.259 2.287-2.587 4.708-2.587 5.035 0 5.961 3.316 5.961 7.623V24h-.005Z" fill="#0A66C2" />
    </svg>
  );
}

// https://feathericons.dev/?search=twitter&iconset=brands&format=strict-jsx
export function Twitter(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" {...props}>
      <path d="M7.548 21.501c9.056 0 14.01-7.503 14.01-14.01 0-.213 0-.425-.015-.636A10.02 10.02 0 0 0 24 4.305a9.815 9.815 0 0 1-2.828.775 4.94 4.94 0 0 0 2.165-2.723 9.865 9.865 0 0 1-3.127 1.195 4.929 4.929 0 0 0-8.391 4.491A13.98 13.98 0 0 1 1.67 2.898a4.928 4.928 0 0 0 1.525 6.573A4.88 4.88 0 0 1 .96 8.855v.063a4.926 4.926 0 0 0 3.95 4.826 4.914 4.914 0 0 1-2.223.085 4.93 4.93 0 0 0 4.6 3.42A9.88 9.88 0 0 1 0 19.288a13.941 13.941 0 0 0 7.548 2.208" fill="#1DA1F2" />
    </svg>
  );
}


function InstagramIcon(props) {
  const gradientId = "instagram_gradient_" + Math.random().toString(36).substring(2, 9);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      className="main-grid-item-icon" 
      fill="none" 
      {...props}
    >
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="14.101" x2="7.087" y1="-1.272" y2="21.899">
          <stop stopColor="#515BD4" />
          <stop offset=".26" stopColor="#9510B8" />
          <stop offset=".66" stopColor="#E51804" />
          <stop offset="1" stopColor="#FFBF00" />
        </linearGradient>
      </defs>

      {/* Círculo central */}
      <path 
        clipRule="evenodd" 
        d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" 
        fill={`url(#${gradientId})`} 
        fillRule="evenodd" 
      />
      {/* Punto superior derecho */}
      <path 
        d="M18.406 7.034a1.44 1.44 0 1 0 0-2.88 1.44 1.44 0 0 0 0 2.88Z" 
        fill={`url(#${gradientId})`} 
      />
      {/* Marco exterior */}
      <path 
        clipRule="evenodd" 
        d="M12 0C8.741 0 8.332.014 7.052.072 5.775.131 4.902.333 4.14.63a5.882 5.882 0 0 0-2.125 1.384A5.882 5.882 0 0 0 .63 4.14c-.297.763-.5 1.635-.558 2.912C.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.277.261 2.15.558 2.912.307.79.717 1.459 1.384 2.126A5.882 5.882 0 0 0 4.14 23.37c.764.297 1.636.5 2.913.558C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.059 2.15-.261 2.912-.558a5.884 5.884 0 0 0 2.126-1.384 5.884 5.884 0 0 0 1.384-2.126c.297-.763.5-1.635.558-2.912.058-1.28.072-1.69.072-4.948 0-3.259-.014-3.668-.072-4.948-.059-1.277-.261-2.15-.558-2.912a5.882 5.882 0 0 0-1.384-2.126A5.883 5.883 0 0 0 19.86.63c-.763-.297-1.635-.5-2.912-.558C15.668.014 15.258 0 12 0Zm0 2.162c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.228.413.56.218.96.478 1.38.898.42.42.68.82.898 1.38.164.423.36 1.058.413 2.228.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.054 1.17-.249 1.805-.413 2.228a3.72 3.72 0 0 1-.898 1.38c-.42.42-.82.68-1.38.898-.423.164-1.058.36-2.228.413-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.169-.054-1.804-.249-2.227-.413a3.719 3.719 0 0 1-1.38-.898c-.42-.42-.68-.82-.898-1.38-.164-.423-.36-1.058-.413-2.228-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.85c.053-1.169.249-1.804.413-2.227.218-.56.478-.96.898-1.38.42-.42.82-.68 1.38-.898.423-.164 1.058-.36 2.228-.413 1.265-.058 1.645-.07 4.849-.07Z" 
        fill={`url(#${gradientId})`} 
        fillRule="evenodd" 
      />
    </svg>
  );
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-blue-900 border-b border-gray-200 shadow-md md:px-6">
      {/* Botón para abrir el menú offcanvas */}
      <button
        className="text-gray-600 rounded-sm transition duration-300 ease-in-out hover:bg-gray-800 focus:outline-none"
        onClick={toggleMenu}
        aria-controls="offcanvas-menu"
        aria-expanded={isMenuOpen}
      >
        <img src="fotos/list.svg" alt="Menu" className="w-9 h-9" />
      </button>

      {/* Menú Offcanvas - Contenido del SideNav */}
      <div
        id="offcanvas-menu"
        className={`fixed top-0 left-0 h-full lg:w-[27%] md:w-[35%] sm:w-[45%] bg-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out text-white ${
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

        {/* Encabezado del menú 
        <div className="flex h-[2.4rem] items-center justify-center rounded-md bg-blue-900 p-2 m-1">
          <div className="w-[100%] text-white">
            <p className="flex justify-center p-1 m-0 border-b text-3xl">Explorar</p>
          </div>
        </div>*/}

        {/* Enlaces de redes sociales*/}
        <div className="flex grow flex-col justify-between ">
          <div className="h-[100%] w-[100%] grow rounded-md">
            <NavLinks/>
          </div>
          <div className="flex justify-around mb-3">
            <a 
              href="https://instagram.com/mi-perfil" 
              className="flex h-[4rem] w-[4rem]  items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
            >
              <InstagramIcon  className="w-[2.5rem] h-[2.5rem]"/>
            </a>
            <a 
              href="https://instagram.com/mi-perfil" 
              className="flex h-[4rem] w-[4rem]  items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
            >
              <Linkedin  className="w-[2.6rem] h-[2.6rem]"/>
            </a>
            <a 
              href="https://instagram.com/mi-perfil" 
              className="flex h-[4rem] w-[4rem]  items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
            >
              <PiXLogo className="w-[2.6rem] h-[2.6rem] text-black"/>
            </a>
            <a 
              href="https://instagram.com/mi-perfil" 
              className="flex h-[4rem] w-[4rem]  items-center justify-center gap-2 rounded-md font-medium transition duration-300 hover:bg-gray-100"
            >
              <Youtube  className="w-[2.6rem] h-[2.6rem]"/>
            </a>
          </div>
        </div>
      </div>

      {/* Logo principal y botón de login en la barra de navegación */}
      <Link className="flex-shrink-0" href="/">
        <img src="fotos/radio blanco (1) (1).png" className="w-40 md:w-40" alt="Logo" />
      </Link>
      <a href="../Login/" className="text-white hover:text-gray-800 transition duration-300 focus:outline-none w-9 h-9 bg-black rounded-full hover:bg-gray-200">
      </a>
      


    </nav>
  );
}