"use client";
import React, { useRef, useState } from "react";

export default function ReproductorMovil({
  streamUrl = "https://ohradio.cc/8310/stream",
}: {
  streamUrl?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (e) {
      console.error("Error al reproducir/pausar audio:", e);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={streamUrl} preload="none" />

      {/* barra fija arriba en mobile (oculta en lg+) */}
      <div className="envivo-bar lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 bg-gray-100 text-white px-3 py-2 h-14 shadow-lg">
        {/* 1) BOTÓN PLAY (izquierda) */}
        <div className="flex-shrink-0">
          <button
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
            className={`neon-play w-12 h-12 rounded-full flex items-center justify-center border-2 border-transparent shadow-inner`}
          >
            {isPlaying ? (
              // icono pausa
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              // icono play
              <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* 2) BANNER NEON (centro) */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="neon-banner px-3 py-1 rounded-md">
            <span className="neon-banner-text text-xs font-extrabold">
              🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
            </span>
          </div>
        </div>

        {/* 3) 'AL AIRE' (derecha) */}
        <div className="flex-shrink-0">
          <div className="neon-alaire px-3 py-1 rounded-md flex items-center justify-center">
            <span className="text-xs font-bold">🔴 AL AIRE</span>
          </div>
        </div>
      </div>

      {/* estilos inline específicos para móvil (self-contained) */}
      <style jsx>{`
        /* Play button neon (pulso rojo) */
        .neon-play {
          background: radial-gradient(circle at 30% 30%, rgba(255, 77, 109, 0.12), rgba(0,0,0,0.0) 40%), #000;
          box-shadow:
            0 0 6px rgba(255, 20, 60, 0.28),
            0 0 14px rgba(255, 20, 60, 0.18),
            inset 0 0 6px rgba(255, 77, 109, 0.12);
          animation: neon-pulse 1.6s ease-in-out infinite;
          border-color: rgba(255, 20, 60, 0.35);
        }

        .neon-play:active { transform: scale(0.98); }

        @keyframes neon-pulse {
          0% {
            box-shadow:
              0 0 4px rgba(255, 20, 60, 0.22),
              0 0 10px rgba(255, 20, 60, 0.16),
              inset 0 0 4px rgba(255, 77, 109, 0.1);
            transform: translateY(0);
          }
          50% {
            box-shadow:
              0 0 12px rgba(255, 20, 60, 0.4),
              0 0 28px rgba(255, 20, 60, 0.22),
              inset 0 0 8px rgba(255, 77, 109, 0.16);
            transform: translateY(-1px);
          }
          100% {
            box-shadow:
              0 0 4px rgba(255, 20, 60, 0.22),
              0 0 10px rgba(255, 20, 60, 0.16),
              inset 0 0 4px rgba(255, 77, 109, 0.1);
            transform: translateY(0);
          }
        }

        /* Banner central neon */
        .neon-banner {
          display: inline-block;
          border: 2px solid rgba(255, 77, 109, 0.9);
          background: linear-gradient(180deg, rgba(255,77,109,0.04), rgba(0,0,0,0.02));
          box-shadow:
            0 0 6px rgba(255, 77, 109, 0.08),
            0 0 12px rgba(255, 20, 60, 0.06),
            inset 0 0 6px rgba(255, 77, 109, 0.04);
          animation: neon-border 3.6s infinite alternate;
          padding-left: 8px;
          padding-right: 8px;
        }

        .neon-banner-text {
          color: #fff;
          -webkit-text-stroke: 1px rgba(255,77,109,0.9);
          text-stroke: 1px rgba(255,77,109,0.9);
          text-shadow:
            0 0 3px rgba(255,77,109,0.9),
            0 0 8px rgba(255,20,60,0.6);
          font-size: 0.75rem;
          line-height: 1rem;
        }

        @keyframes neon-border {
          0% {
            box-shadow:
              0 0 6px rgba(255, 77, 109, 0.08),
              0 0 12px rgba(255, 20, 60, 0.06);
            border-color: rgba(255,77,109,0.9);
          }
          50% {
            box-shadow:
              0 0 10px rgba(255, 77, 109, 0.16),
              0 0 22px rgba(255, 20, 60, 0.12);
            border-color: rgba(255,110,130,0.95);
          }
          100% {
            box-shadow:
              0 0 6px rgba(255, 77, 109, 0.08),
              0 0 12px rgba(255, 20, 60, 0.06);
            border-color: rgba(255,77,109,0.9);
          }
        }

        /* AL AIRE neon badge (derecha) */
        .neon-alaire {
          background: linear-gradient(180deg, rgba(255,0,40,0.95), rgba(200,20,60,0.95));
          box-shadow:
            0 0 6px rgba(255, 20, 60, 0.4),
            0 0 12px rgba(255, 20, 60, 0.25),
            inset 0 0 6px rgba(255, 77, 109, 0.18);
          animation: neon-pulse-fast 1.8s infinite alternate;
          color: #fff;
          border-radius: 8px;
        }

        @keyframes neon-pulse-fast {
          0% {
            transform: translateY(0);
            box-shadow:
              0 0 4px rgba(255, 20, 60, 0.22),
              0 0 8px rgba(255, 20, 60, 0.16);
          }
          50% {
            transform: translateY(-0.6px);
            box-shadow:
              0 0 10px rgba(255, 20, 60, 0.4),
              0 0 18px rgba(255, 20, 60, 0.28);
          }
          100% {
            transform: translateY(0);
            box-shadow:
              0 0 4px rgba(255, 20, 60, 0.22),
              0 0 8px rgba(255, 20, 60, 0.16);
          }
        }

        /* Ajustes de texto responsivo */
        @media (max-width: 380px) {
          .neon-banner-text { font-size: 0.68rem; }
        }
      `}</style>
    </>
  );
}
