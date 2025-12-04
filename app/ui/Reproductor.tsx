"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // ✅ Tipamos correctamente el ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Evita errores en algunos navegadores
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Animación de ondas
  useEffect(() => {
    const bars = document.querySelectorAll<HTMLElement>(".wave-bar");
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        bars.forEach((bar) => {
          bar.style.height = `${10 + Math.random() * 30}px`;
        });
      }, 200);
    } else {
      bars.forEach((bar) => (bar.style.height = "6px"));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <>
      {/* 🎵 Versión Móvil */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md border-b-2 border-red-600 flex items-center justify-between px-3 py-2 md:hidden z-50">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image src="/logo-removebg-preview.png" alt="Logo" width={32} height={32} />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-red-600 font-bold text-lg tracking-wide px-3 py-1 border-2 border-red-600 rounded-lg shadow-md animate-pulse">
            EN VIVO
          </span>
        </div>

        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 shadow-md"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>

      {/* 🎵 Versión Desktop */}
      <div className="hidden md:flex items-center gap-3 bg-transparent">
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="flex gap-[3px] h-6 items-end">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar w-1 bg-gradient-to-t from-red-500 to-purple-500 transition-all duration-200"
              style={{ height: "12px" }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 9v6h4l5 5V4l-5 5H5z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 accent-red-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Audio */}
      <audio
        ref={audioRef}
        src="https://ohradio.cc/8310/stream"
        preload="none"
      />
    </>
  );
}
