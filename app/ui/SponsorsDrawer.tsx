// app/ui/SponsorsDrawer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type InputSponsor = {
  id?: string | number;
  name?: string;
  image?: string; // optional name
  src?: string; // optional src (compat)
  url?: string;
  href?: string;
};

interface Props {
  sponsors: InputSponsor[];
  position?: "bottom-right" | "bottom-left";
  persistKey?: string;
  showOnMobile?: boolean;
  maxItems?: number;
  autoSlideMs?: number;
}

export default function SponsorsDrawer({
  sponsors = [],
  position = "bottom-right",
  persistKey = "sponsors-drawer-closed",
  showOnMobile = true,
  maxItems = 16,
  autoSlideMs = 3000,
}: Props) {
  // Normalize sponsors to a consistent shape
  const normalized = (sponsors || []).map((s, i) => ({
    id: s.id ?? i,
    name: s.name ?? `Sponsor ${i + 1}`,
    image: (s as any).image ?? (s as any).src ?? "",
    url: (s as any).url ?? (s as any).href ?? "#",
  }));

  const sponsorsToShow = normalized.slice(0, maxItems);

  const [open, setOpen] = useState(false);
  const [hiddenByUser, setHiddenByUser] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoSlideRef = useRef<number | null>(null);

  // Persistencia (solo lectura en mount)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved === "true") setHiddenByUser(true);
    } catch (e) {
      /* ignore */
    }
  }, [persistKey]);

  const handleOpen = () => {
    setOpen(true);
    setHiddenByUser(false);
    try {
      localStorage.removeItem(persistKey);
    } catch (e) {}
  };

  const handleClose = () => {
    setOpen(false);
    setHiddenByUser(true);
    try {
      localStorage.setItem(persistKey, "true");
    } catch (e) {}
  };

  if (hiddenByUser) return null;

  const posClass = position === "bottom-right" ? "right-4 bottom-4" : "left-4 bottom-4";

  // AutoSlide: avanza el índice cada autoSlideMs si NO está pausado y el panel está abierto.
  useEffect(() => {
    // limpia interval previo
    if (autoSlideRef.current) {
      window.clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }

    if (!open) return;

    // si hay 0 o 1 items, no hacer nada
    if (sponsorsToShow.length <= 1) return;

    // set interval
    autoSlideRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsorsToShow.length);
    }, autoSlideMs);

    return () => {
      if (autoSlideRef.current) {
        window.clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    };
  }, [open, sponsorsToShow.length, autoSlideMs]);

  // Pausa si paused=true: limpiamos interval
  useEffect(() => {
    if (paused) {
      if (autoSlideRef.current) {
        window.clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    } else {
      // rearmar el interval si el panel está abierto
      if (open && sponsorsToShow.length > 1 && !autoSlideRef.current) {
        autoSlideRef.current = window.setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % sponsorsToShow.length);
        }, autoSlideMs);
      }
    }
    return () => {};
  }, [paused, open, sponsorsToShow.length, autoSlideMs]);

  // Cuando cambia currentIndex -> desplazamos el container al elemento correspondiente
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const target = children[currentIndex];
    if (!target) return;

    // scroll centrando el elemento en el contenedor
    const left = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }, [currentIndex]);

  // Handlers para hover / touch que pausarán el autoslide
  const onMouseEnter = () => setPaused(true);
  const onMouseLeave = () => setPaused(false);
  const onTouchStart = () => setPaused(true);
  const onTouchEnd = () => setPaused(false);

  // Prev / Next manuales
  const prev = () =>
    setCurrentIndex((prevIdx) => (prevIdx - 1 + sponsorsToShow.length) % sponsorsToShow.length);
  const next = () => setCurrentIndex((prevIdx) => (prevIdx + 1) % sponsorsToShow.length);

  return (
    <>
      {/* PESTAÑA COLAPSADA (oculta en mobile si showOnMobile=false) */}
      {!open && (
        <button
          onClick={handleOpen}
          className={`fixed ${posClass} z-50 bg-white shadow-xl px-4 py-2 rounded-full border border-gray-300 hover:shadow-2xl text-sm font-semibold flex items-center gap-2 ${
            showOnMobile ? "" : "md:block mobile-hidden"
          }`}
        >
          ⭐ Sponsors
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay clickeable (cierra) */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className={`fixed ${posClass} w-[92vw] max-w-[520px] bg-white rounded-2xl shadow-2xl z-50 p-4`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-md font-bold text-gray-800">Nuestros Sponsors</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    aria-label="Anterior sponsor"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    aria-label="Siguiente sponsor"
                  >
                    ›
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    aria-label="Cerrar"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Carousel container */}
              <div
                ref={containerRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="flex gap-4 overflow-x-auto overflow-y-hidden pb-3 scroll-smooth"
                role="list"
                aria-label="Lista de sponsors"
                style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
              >
                {sponsorsToShow.map((s, idx) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-28 md:w-32 lg:w-36 text-center"
                    role="listitem"
                    onClick={() => {
                      // tracking event hook point (puedes conectarlo)
                      // console.log('click sponsor', s.id);
                    }}
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden mx-auto shadow-md hover:shadow-xl transition">
                      {/* Next/Image lazy load */}
                      <Image
                        src={s.image}
                        alt={s.name}
                        width={300}
                        height={300}
                        className="object-contain w-full h-full"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-xs mt-2 text-gray-700">{s.name}</p>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
