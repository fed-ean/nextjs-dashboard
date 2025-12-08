"use client";
import React, { useRef, useState, useEffect } from "react";

export default function ReproductorMovil({
  streamUrl = "https://ohradio.cc/8310/stream",
}: {
  streamUrl?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying((s) => !s);
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  // small accessibility live region for screen readers
  useEffect(() => {
    // noop, left for possible future enhancements
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} src={streamUrl} preload="none" />

      {/* Barra fija superior en mobile */}
      <div className="envivo-bar lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 bg-black/80 text-white px-3 py-2 h-14 backdrop-blur-sm">
        {/* 1) PLAY neon fuerte */}
        <div className="flex-shrink-0">
          <button
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
            className={`play-neon w-14 h-14 rounded-full flex items-center justify-center focus:outline-none`}
          >
            {isPlaying ? (
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* 2) BANNER NEON MARQUEE (centro) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          <div className="marquee-viewport w-full">
            <div
              className="marquee-track"
              role="presentation"
              aria-hidden="true"
              // allow pause on hover by CSS :hover
            >
              <span className="marquee-item">
                🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música,
                información y más 🎶
              </span>
              <span className="marquee-item">
                🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música,
                información y más 🎶
              </span>
            </div>
          </div>
        </div>

        {/* 3) AL AIRE neon (derecha) */}
        <div className="flex-shrink-0">
          <div className="alaire-neon px-3 py-1 rounded-md flex items-center justify-center">
            <span className="text-xs font-extrabold">🔴 AL AIRE</span>
          </div>
        </div>
      </div>

      {/* visually-hidden live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "Reproduciendo — Radio Empresarial" : "Radio pausada"}
      </div>

      <style jsx>{`
        /* ===== PLAY NEON - mucho más intenso ===== */
        .play-neon {
          background: radial-gradient(circle at 35% 30%, rgba(255, 77, 109, 0.18), rgba(0, 0, 0, 0.0) 40%), #1a0a0a;
          border: 1px solid rgba(255, 20, 60, 0.4);
          box-shadow:
            0 0 10px rgba(255, 20, 60, 0.46),
            0 0 30px rgba(255, 20, 60, 0.28),
            0 0 60px rgba(255, 20, 60, 0.16),
            inset 0 0 12px rgba(255, 77, 109, 0.12);
          animation: neon-blink-strong 1s linear infinite, neon-glow 1.6s ease-in-out infinite;
          transform-origin: center;
          transition: transform 120ms ease;
        }
        .play-neon:active { transform: scale(0.96); }

        @keyframes neon-blink-strong {
          0% { box-shadow: 0 0 6px rgba(255,20,60,0.4), 0 0 20px rgba(255,20,60,0.22); }
          30% { box-shadow: 0 0 20px rgba(255,60,90,0.9), 0 0 50px rgba(255,30,70,0.6); transform: translateY(-1px); }
          60% { box-shadow: 0 0 40px rgba(255,60,90,1), 0 0 90px rgba(255,30,70,0.8); transform: translateY(-2px); }
          100% { box-shadow: 0 0 6px rgba(255,20,60,0.4), 0 0 20px rgba(255,20,60,0.22); transform: translateY(0); }
        }

        @keyframes neon-glow {
          0% { filter: drop-shadow(0 0 4px rgba(255,20,60,0.4)); }
          50% { filter: drop-shadow(0 0 24px rgba(255,20,60,0.75)); }
          100% { filter: drop-shadow(0 0 4px rgba(255,20,60,0.4)); }
        }

        /* ===== MARQUEE NEON ===== */
        .marquee-viewport { overflow: hidden; width: 100%; }
        .marquee-track {
          display: inline-flex;
          gap: 3rem;
          white-space: nowrap;
          align-items: center;
          animation: marquee-scroll 12s linear infinite;
        }
        .marquee-viewport:hover .marquee-track { animation-play-state: paused; }

        .marquee-item {
          display: inline-block;
          font-weight: 800;
          font-size: 0.82rem;
          padding: 4px 12px;
          border-radius: 8px;
          color: #fff;
          -webkit-text-stroke: 0.9px rgba(255,77,109,0.95);
          text-stroke: 0.9px rgba(255,77,109,0.95);
          text-shadow:
            0 0 4px rgba(255,77,109,0.95),
            0 0 10px rgba(255,30,70,0.9),
            0 0 22px rgba(255,20,60,0.6);
          background: linear-gradient(180deg, rgba(255,77,109,0.06), rgba(0,0,0,0.02));
          border: 1px solid rgba(255,77,109,0.6);
          transform: translateZ(0); /* helps with smoothing on some devices */
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); } /* track repeats by having duplicate content */
        }

        /* ===== AL AIRE neon intenso RHS ===== */
        .alaire-neon {
          background: linear-gradient(180deg, rgba(255,0,40,0.98), rgba(200,20,60,0.98));
          box-shadow:
            0 0 12px rgba(255, 20, 60, 0.8),
            0 0 28px rgba(255, 30, 70, 0.6),
            inset 0 0 8px rgba(255, 77, 109, 0.35);
          border: 1px solid rgba(255,140,140,0.9);
          animation: alaire-flicker 1.2s linear infinite;
          color: #fff;
        }

        @keyframes alaire-flicker {
          0% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(255,20,60,0.6), 0 0 18px rgba(255,30,70,0.45);
            transform: translateY(0);
          }
          30% {
            opacity: 0.92;
            box-shadow: 0 0 22px rgba(255,60,100,1), 0 0 40px rgba(255,30,70,0.6);
            transform: translateY(-0.6px);
          }
          60% {
            opacity: 0.98;
            box-shadow: 0 0 28px rgba(255,60,120,1), 0 0 60px rgba(255,40,80,0.75);
            transform: translateY(-1px);
          }
          100% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(255,20,60,0.6), 0 0 18px rgba(255,30,70,0.45);
            transform: translateY(0);
          }
        }

        /* small screens tweak */
        @media (max-width: 380px) {
          .marquee-item { font-size: 0.66rem; gap: 1rem; }
          .play-neon { width: 44px; height: 44px; }
        }
      `}</style>
    </>
  );
}
