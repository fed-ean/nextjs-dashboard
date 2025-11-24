'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Noticia } from '@/app/lib/db'; // Usa la interfaz centralizada

/**
 * Componente interno para renderizar cada tarjeta del carrusel.
 * MODIFICADO: Se ha eliminado la sección del excerpt para un diseño más limpio.
 */
function CarouselCard({ noticia }: { noticia: Noticia }) {
  const urlNoticia = `/Categorias/Noticias/${noticia.slug || ''}`;

  return (
    <Link href={urlNoticia} passHref>
      <div className="border rounded-lg overflow-hidden shadow-md group h-full flex flex-col">
        <div className="relative w-full h-40">
          {noticia.sourceUrl ? (
            <Image
              src={noticia.sourceUrl}
              alt={noticia.title || 'Imagen de la noticia'}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-sm">Sin Imagen</span>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-bold text-md leading-tight mb-2 flex-grow">{noticia.title}</h3>
          {/* El excerpt ha sido eliminado según lo solicitado */}
          
          {/* Las etiquetas de categoría se mantienen */}
          {noticia.categories?.nodes && noticia.categories.nodes.length > 0 && (
            <div className="flex gap-2 mt-auto pt-2 border-t border-gray-200">
              {noticia.categories.nodes.map((cat, i) => (
                <span key={i} className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// --- Componente principal del carrusel (sin cambios) ---
export default function CarouselNoticias({
  noticias,
  slidesPerView = 1,
  autoPlay = true,
  autoPlayInterval = 5000,
}: {
  noticias: Noticia[]; 
  slidesPerView?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}) {
  const totalSlides = Math.ceil(noticias.length / slidesPerView);
  const grandeRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const grande = grandeRef.current;
    if (!grande) return;

    const movePercent = (100 / noticias.length) * slidesPerView;
    const operacion = currentSlide * -movePercent;
    grande.style.transform = `translateX(${operacion}%)`;
  }, [currentSlide, noticias.length, slidesPerView]);

  useEffect(() => {
    if (!autoPlay || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isPaused, totalSlides]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (noticias.length === 0) return null;

  return (
    <div
      className="relative w-full max-w-7xl mx-auto group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          ref={grandeRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ width: `${(noticias.length / slidesPerView) * 100}%` }}
        >
          {noticias.map((noticia, index) => (
            <div
              key={noticia.databaseId || index}
              style={{ width: `${100 / noticias.length}%` }}
              className="flex-shrink-0 p-2 md:p-4"
            >
              <CarouselCard noticia={noticia} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Botones de Navegación --- */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white/60 text-black p-3 rounded-full shadow-lg hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none z-10"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white/60 text-black p-3 rounded-full shadow-lg hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus:outline-none z-10"
        aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* --- Puntos de Navegación --- */}
      <ul className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <li
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
          ></li>
        ))}
      </ul>
    </div>
  );
}
