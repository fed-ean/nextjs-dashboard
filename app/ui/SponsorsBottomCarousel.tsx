"use client";

import { useEffect, useState } from "react";

interface Sponsor {
  name: string;
  image: string;
  url?: string;
}

export default function SponsorsBottomCarousel({
  sponsors,
  autoSlideMs = 3000,
  size = 90,
}: {
  sponsors: Sponsor[];
  autoSlideMs?: number;
  size?: number;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true); // 🔥 Por defecto visible

  // --- AutoSlide ---
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 2) % sponsors.length);
    }, autoSlideMs);

    return () => clearInterval(interval);
  }, [sponsors.length, autoSlideMs]);

  // --- 2 sponsors visibles ---
  const visibleSponsors = [
    sponsors[index],
    sponsors[(index + 1) % sponsors.length],
  ];

  return (
    <div className="w-full fixed bottom-0 left-0 z-50 lg:hidden">
      
      {/* 🔥 BOTÓN PARA MOSTRAR CUANDO ESTÁ OCULTO */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            absolute 
            -top-10 
            left-1/2 
            -translate-x-1/2 
            bg-white 
            shadow-lg 
            rounded-full 
            px-4 py-1 
            text-sm 
            font-semibold
          "
        >
          ▲ Sponsors
        </button>
      )}

      {/* 🔥 CONTENEDOR DEL CARRUSEL */}
      <div
        className={`
          w-full bg-white shadow-2xl border-t border-gray-200 px-4 py-2
          transition-transform duration-500
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* FLECHA PARA OCULTAR */}
        <div className="w-full flex justify-center">
          <button
            onClick={() => setOpen(false)}
            className="text-gray-700 text-sm mb-1"
          >
            ▼ Ocultar
          </button>
        </div>

        {/* SPONSORS */}
        <div className="flex justify-center items-center gap-4">
          {visibleSponsors.map((sp, i) => (
            <a
              key={i}
              href={sp.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <img
                src={sp.image}
                alt={sp.name}
                style={{
                  width: size,
                  height: size,
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
                className="shadow-md"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
