"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type InputSponsor = {
  id?: string | number;
  name?: string;
  image?: string; // or `src`
  src?: string;
  url?: string;   // or `href`
  href?: string;
};

export default function SponsorsFullWidthCarousel({
  sponsors = [],
  height = 140,            // altura en px del carrusel (ajustala)
  autoSlideMs = 3000,      // autoplay interval
  maxItems = 16,
}: {
  sponsors?: InputSponsor[];
  height?: number;
  autoSlideMs?: number;
  maxItems?: number;
}) {
  // normalize
  const items = (sponsors || [])
    .slice(0, maxItems)
    .map((s, i) => ({
      id: s.id ?? i,
      name: s.name ?? (s as any).alt ?? `Sponsor ${i + 1}`,
      src: (s as any).image ?? (s as any).src ?? "",
      url: (s as any).url ?? (s as any).href ?? "#",
    }));

  // responsive: itemsPerView
  const getItemsPerView = () => {
    if (typeof window === "undefined") return 5;
    const w = window.innerWidth;
    if (w < 640) return 1;     // mobile: 1 per view
    if (w < 1024) return 3;    // tablet: 3
    return 6;                  // desktop: 6 (ajustá si querés)
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // update itemsPerView on resize
  useEffect(() => {
    const onResize = () => setItemsPerView(getItemsPerView());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // autoslide when more than itemsPerView and not paused
  useEffect(() => {
    if (items.length <= itemsPerView) return;
    if (paused) return;
    const iv = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % (items.length));
    }, autoSlideMs);
    return () => window.clearInterval(iv);
  }, [items.length, itemsPerView, paused, autoSlideMs]);

  // ensure index stays within range
  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  // scroll transform
  const computeTranslate = () => {
    // Each item width = 100 / itemsPerView %
    const step = 100 / itemsPerView;
    // center effect: translate by index * step
    return `translateX(-${index * step}%)`;
  };

  // handle swipe on mobile
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
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe left -> next
        setIndex((prev) => (prev + 1) % items.length);
      } else {
        // swipe right -> prev
        setIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    }
    touchStartX.current = null;
    // Unpause shortly after touch
    setTimeout(() => setPaused(false), 600);
  };

  // pause on hover for desktop
  const onMouseEnter = () => setPaused(true);
  const onMouseLeave = () => setPaused(false);

  // style values
  const containerHeight = `${height}px`;
  const itemWidthPercent = 100 / itemsPerView;

  return (
    <section
      className="w-full bg-transparent overflow-hidden"
      style={{ height: containerHeight }}
      aria-label="Sponsors carousel"
    >
      <div
        className="relative h-full w-full flex items-center"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="h-full will-change-transform transition-transform duration-500 ease-out"
          style={{
            display: "flex",
            width: `${(items.length * 100) / itemsPerView}%`, // entire track width
            transform: computeTranslate(),
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              className="flex flex-col items-center justify-center"
              style={{
                flex: `0 0 ${itemWidthPercent}%`,
                height: "100%",
              }}
            >
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
                aria-label={it.name}
              >
                <div
                  className="rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
                  style={{
                    width: Math.max(64, height - 24),
                    height: Math.max(64, height - 24),
                  }}
                >
                  {/* use next/image if path local - fallback to img tag if empty */}
                  {it.src ? (
                    <Image
                      src={it.src}
                      alt={it.name}
                      width={Math.max(64, height - 24)}
                      height={Math.max(64, height - 24)}
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-xs px-2">{it.name}</div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
