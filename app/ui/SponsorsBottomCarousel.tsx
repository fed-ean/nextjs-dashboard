"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type SponsorInput = {
  id?: string | number;
  name?: string;
  src?: string;    // ruta (ej. '/sponsor/argennova.jpg')
  image?: string;  // alias
  url?: string;
  href?: string;
};

export default function SponsorsBottomCarousel({
  sponsors = [],
  visibleCount = 4,     // cuántos logos mostrar visualmente (ajustable)
  autoSlideMs = 3000,
  circleSize = 80,      // tamaño de los círculos en px (ajustá si querés)
}: {
  sponsors?: SponsorInput[];
  visibleCount?: number;
  autoSlideMs?: number;
  circleSize?: number;
}) {
  // normalizar
  const items = (sponsors || []).map((s, i) => ({
    id: s.id ?? i,
    name: s.name ?? `Sponsor ${i + 1}`,
    src: (s as any).src ?? (s as any).image ?? "",
    url: (s as any).url ?? (s as any).href ?? "#",
  }));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto slide (solo si hay más de visibleCount)
  useEffect(() => {
    if (items.length <= 1) return;
    if (paused) return;

    const iv = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, autoSlideMs);

    return () => window.clearInterval(iv);
  }, [items.length, paused, autoSlideMs]);

  // Scroll to current item (center it)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const target = children[index];
    if (!target) return;

    const left = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
    container.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  // touch to pause + swipe
  const touchStartX = useRef<number | null>(null);
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
      if (diff > 0) setIndex((p) => (p + 1) % items.length);
      else setIndex((p) => (p - 1 + items.length) % items.length);
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 500);
  };

  return (
    // outer wrapper should be fixed in layout; here just the carousel inner
    <div
      className="block lg:hidden w-full bg-black/95 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="w-full overflow-hidden py-3">
        <div
          ref={containerRef}
          className="flex gap-4 px-4 overflow-x-auto scroll-smooth"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((it) => (
            <a
              key={it.id}
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex flex-col items-center justify-center"
              style={{
                width: `${100 / visibleCount}%`,
                scrollSnapAlign: "center",
              }}
              onClick={() => {
                // track click si querés
              }}
            >
              <div
                className="rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md"
                style={{
                  width: circleSize,
                  height: circleSize,
                }}
              >
                {it.src ? (
                  <Image
                    src={it.src}
                    alt={it.name}
                    width={300}     // fuente 300x300, Next optimizará
                    height={300}
                    className="object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs px-2">{it.name}</div>
                )}
              </div>

              <div className="text-[10px] text-center mt-2 text-gray-200">{it.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
