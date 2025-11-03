'use client';

import { useEffect, useRef, useState } from 'react';
import NoticiaLeft from './noticia-left';

type Noticia = {
  slug?: string;
  titulo?: string;
  title?: string;
  imagenUrl?: string;
  excerpt?: string;
  fecha?: string;
  categories?: { nodes?: any[] } | any[] | string[];
  [k: string]: any;
};

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
  const totalPuntos = Math.ceil(noticias.length / slidesPerView);

  const grandeRef = useRef<HTMLDivElement | null>(null);
  const puntosRef = useRef<NodeListOf<HTMLLIElement> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // --- Puntos de navegación ---
  useEffect(() => {
    const puntos = document.querySelectorAll('.punto');
    puntosRef.current = puntos as NodeListOf<HTMLLIElement>;
    const handlers: Array<() => void> = [];

    puntos.forEach((cadaPunto, i) => {
      const clickHandler = () => setCurrentSlide(i);
      cadaPunto.addEventListener('click', clickHandler);
      handlers.push(() => cadaPunto.removeEventListener('click', clickHandler));
    });

    return () => handlers.forEach((remove) => remove());
  }, [totalPuntos]);

  // --- Movimiento del carrusel ---
  useEffect(() => {
    const grande = grandeRef.current;
    const puntos = puntosRef.current;

    if (!grande || !puntos) return;

    const movePercent = (100 / noticias.length) * slidesPerView;
    const operacion = currentSlide * -movePercent;
    grande.style.transform = `translateX(${operacion}%)`;

    puntos.forEach((p, i) => p.classList.toggle('activo', i === currentSlide));
  }, [currentSlide, noticias.length, slidesPerView]);

  // --- AutoPlay controlado ---
  useEffect(() => {
    if (!autoPlay) return;

    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalPuntos);
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, paused, totalPuntos]);

  // --- Handlers para botones ---
  const handleNext = () => {
    if (currentSlide < totalPuntos - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div
      className="carrousel w-full mx-auto my-8 relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* --- Contenedor grande --- */}
      <div className="grande overflow-hidden">
        <div
          ref={grandeRef}
          className="grande-img flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${(noticias.length / slidesPerView) * 100}%`,
          }}
        >
          {noticias.map((noticia, index) => (
            <div
              key={noticia.slug || index}
              style={{
                width: `${100 / noticias.length}%`,
              }}
              className="flex-shrink-0 p-2"
            >
              <NoticiaLeft noticia={noticia} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Botones de navegación --- */}
      <button
        onClick={handlePrev}
        disabled={currentSlide === 0}
        className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 text-black p-3 rounded-full shadow-md hover:bg-white transition ${
          currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Anterior"
      >
        ←
      </button>

      <button
        onClick={handleNext}
        disabled={currentSlide === totalPuntos - 1}
        className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 text-black p-3 rounded-full shadow-md hover:bg-white transition ${
          currentSlide === totalPuntos - 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Siguiente"
      >
        →
      </button>

      {/* --- Puntos de navegación --- */}
      <ul className="puntos flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPuntos }).map((_, i) => (
          <li
            key={i}
            className={`punto w-3 h-3 rounded-full bg-gray-400 cursor-pointer transition-colors ${
              i === currentSlide ? 'activo bg-blue-600' : ''
            }`}
          ></li>
        ))}
      </ul>
    </div>
  );
}
