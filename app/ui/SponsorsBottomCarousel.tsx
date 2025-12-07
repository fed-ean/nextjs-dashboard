"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Sponsor = {
  id?: string | number;
  name?: string;
  src?: string; // ruta local (ej. '/sponsor/argennova.jpg')
  url?: string;
};

export default function SponsorsBottomCarousel({
  sponsors = [],
  autoSlideMs = 3000,
  squareSize = 300, // tamaño fuente (las imágenes son 300x300)
}: {
  sponsors?: Sponsor[];
  autoSlideMs?: number;
  squareSize?: number;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Si hay menos de 2 sponsors, evitar errores
  const count = sponsors.length || 0;
  useEffect(() => {
    if (count <= 1) return;
    if (!open) return;
    if (paused) return;

    const iv = window.setInterval(() => {
      // Avanzamos de 2 en 2 para mostrar parejas no solapadas
      setIndex((prev) => (prev + 2) % count);
    }, autoSlideMs);

    return () => clearInterval(iv);
  }, [count, autoSlideMs, open, paused]);

  // Visible: dos a la vez
  const left = sponsors[(index) % (count || 1)];
  const right = sponsors[(index + 1) % (count || 1)];
  const visible = count === 0 ? [] : count === 1 ? [left] : [left, right];

  // Touch handlers (pausa + swipe)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    if (start == null) {
      setPaused(false);
      return;
    }
    const end = e.changedTouches[0].clientX;
    const diff = start - end;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // swipe left -> next pair
        setIndex((p) => (p + 2) % (count || 1));
      } else {
        // swipe right -> prev pair
        setIndex((p) => (p - 2 + (count || 1)) % (count || 1));
      }
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 400);
  };

  // hide/show animation uses translateY
  return (
    <div className="md:hidden"> {/* wrapper visible solo en mobile */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-auto">
        {/* Tab / botón sobresaliente */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir Sponsors"
            className="absolute -top-10 left-4 flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full shadow-lg"
          >
            <span className="text-sm font-semibold">Sponsors</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div
          // container that slides down to hide
          className={`w-full bg-white shadow-2xl border-t border-gray-200 transition-transform duration-400 ease-in-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* header con botón para ocultar */}
          <div className="w-full flex justify-center pt-2">
            <button
              onClick={() => setOpen(false)}
              aria-label="Ocultar sponsors"
              className="text-gray-700 text-sm mb-1 bg-white/0 px-3 py-1 rounded-md"
            >
              <span className="mr-2">Sponsors</span>
              <svg className="inline-block w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* content: two items each taking 50% width */}
          <div className="w-full">
            <div className="flex w-full">
              {visible.length === 0 ? (
                <div className="w-full text-center py-4 text-sm text-gray-500">No hay sponsors</div>
              ) : (
                visible.map((sp, idx) => (
                  <a
                    key={sp?.id ?? idx}
                    href={sp?.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 flex items-center justify-center p-2"
                    onClick={() => {
                      /* event tracking punto de extensión */
                    }}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center overflow-hidden"
                      style={{ maxWidth: "100%", maxHeight: 96 }}
                    >
                      {/* usamos next/image para que optimice; width/height fuente 300 */}
                      {sp?.src ? (
                        <Image
                          src={sp.src}
                          alt={sp.name ?? ""}
                          width={squareSize}
                          height={squareSize}
                          style={{ objectFit: "cover" }}
                          className="block"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                          {sp?.name ?? "Sponsor"}
                        </div>
                      )}
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* optional small pager dots */}
          <div className="w-full flex justify-center items-center py-2">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(count / 2) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex((i * 2) % (count || 1))}
                  className={`w-2 h-2 rounded-full ${Math.floor(index / 2) === i ? "bg-gray-800" : "bg-gray-300"}`}
                  aria-label={`Ir a grupo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
