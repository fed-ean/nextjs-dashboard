'use client';

import { useEffect, useRef, useState } from 'react';
import CarouselCard from './CarouselCard';

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
  const totalSlides = Math.ceil(noticias.length / slidesPerView);
  const grandeRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // --- Carousel Movement ---
  useEffect(() => {
    const grande = grandeRef.current;
    if (!grande) return;

    const movePercent = (100 / noticias.length) * slidesPerView;
    const operacion = currentSlide * -movePercent;
    grande.style.transform = `translateX(${operacion}%)`;
  }, [currentSlide, noticias.length, slidesPerView]);

  // --- Controlled AutoPlay ---
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

  // --- Cyclic Navigation ---
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* --- Main Carousel --- */}
      <div className="overflow-hidden">
        <div
          ref={grandeRef}
          className="flex transition-transform duration-700 ease-in-out"
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
              className="flex-shrink-0 p-4"
            >
              <CarouselCard noticia={noticia} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Navigation Buttons --- */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/50 text-black p-3 rounded-full shadow-lg hover:bg-white/80 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/50 text-black p-3 rounded-full shadow-lg hover:bg-white/80 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
        aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* --- Navigation Dots --- */}
      <ul className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <li
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === currentSlide ? 'bg-blue-600 scale-125' : 'bg-gray-400/50 hover:bg-gray-400'
            }`}
          ></li>
        ))}
      </ul>
    </div>
  );
}
