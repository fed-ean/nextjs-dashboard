'use client';
import Link from 'next/link';
import Image from 'next/image';
import LinksNav from '@/app/ui/Page_Index/nav-links';
import NavLinks from '@/app/ui/Page_Index/side-nav';
import AlAireRadio from '../AlAireRadio';
import { useState, useEffect, type ReactNode } from 'react';
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

  useEffect(() => { closeMenu(); }, [pathname]);

  return (
    <>
      <nav className="fixed top-14 lg:top-0 left-0 right-0 z-50 border-b border-transparent" >
        {/* vista móvil */}
        <div className="lg:hidden grid grid-cols-3 items-center p-3 bg-white">
          <div className="flex justify-start">
            <button onClick={toggleMenu} className="p-1 rounded">
              <BsList className="w-8 h-8" />
            </button>
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <Image src="/RadioAColor1.png" alt="Logo" width={160} height={44} />
            </Link>
          </div>
          <div className="flex justify-end items-center">
            <Link href="/Login" className="flex items-center gap-2 text-black">
              <HiOutlineMail className="h-7 w-7 text-black" />
            </Link>
          </div>
        </div>

        {/* vista escritorio: transparente, sin fondo gris */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between md:px-6 py-2" style={{ background: 'transparent' }}>
              <div className='w-1/4'></div>

              {/* reproductor (centro) */}
              <div className="flex justify-center w-2/4">
                  <AlAireRadio />
              </div>

              {/* derecha: solo icono (sin texto Suscribite) */}
              <div className="flex justify-end w-1/4">
                <Link href="/Login" className="flex items-center gap-2 text-black transition-transform duration-300 ease-in-out hover:scale-105">
                  <HiOutlineMail className="h-8 w-8 text-black" />
                </Link>
              </div>
          </div>

          {/* parte inferior del navbar (puedes mantener tu barra azul) */}
          <div className="border-t border-blue-800 bg-blue-900">
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

      {/* offcanvas mobile (igual que antes) */}
      <div id="offcanvas-menu" className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] lg:hidden w-[90%] bg-blue-900 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-[60] transition-transform duration-300`}>
        <div className="flex justify-end p-4">
          <button onClick={closeMenu} aria-label="Cerrar menú">✕</button>
        </div>
        <div className="p-4"><SearchForm placeholder="Buscar noticias..." /></div>
        <div className="flex grow flex-col justify-between">
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
