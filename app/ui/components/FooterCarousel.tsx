"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

export default function FooterCarousel({ posts }: { posts: Post[] }) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Define cuántos items se muestran por tamaño
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 4; // desktop
  };

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // === AUTOSLIDE SOLO DESKTOP ===
  useEffect(() => {
    if (visibleCount === 4) {
      // solo desktop
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % posts.length);
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [visibleCount, posts.length]);

  // Flechas
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  // Swipe táctil
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;

    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) nextSlide(); // swipe left
    else if (diff < -50) prevSlide(); // swipe right
  };

  const visible = posts.slice(index, index + visibleCount);
  const falta = visibleCount - visible.length;
  const completos =
    falta > 0 ? [...visible, ...posts.slice(0, falta)] : visible;

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-10 p-4 relative overflow-hidden">
      {/* Flecha izquierda */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
      >
        ⬅
      </button>

      {/* Flecha derecha */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
      >
        ➡
      </button>

      {/* Grid con SWIPE */}
      <div
        className="grid gap-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
        }}
      >
        {completos.map((post, i) => (
          <motion.div
            key={`${post.id}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition"
          >
            <Link href={`/Categorias/Noticias/${post.slug}`}>
              {post.featuredImage?.node?.sourceUrl && (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-40"
                />
              )}

              <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                {post.title}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
