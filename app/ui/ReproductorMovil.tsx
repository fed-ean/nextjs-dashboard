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
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  // ensure audio pauses when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
      }
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={streamUrl} preload="none" />

      {/* fixed bar on top for mobile only */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="envivo-bar-mobile flex items-center justify-between gap-3 px-3 py-2 h-14">
          {/* PLAY (left) */}
          <button
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
            className={`play-btn`}
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* MARQUEE CENTER (middle) */}
          <div className="marquee-wrap" role="region" aria-label="Escuchá la radio en vivo">
            <div className="marquee">
              <div className="marquee-track" aria-hidden="true">
                <span className="marquee-item">
                  🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
                </span>
                <span className="marquee-item">
                  🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
                </span>
              </div>
            </div>
          </div>

          {/* AL AIRE (right) */}
          <div className="alaire-wrap" aria-hidden>
            <div className="alaire-badge">🔴 AL AIRE</div>
          </div>
        </div>
      </div>

      {/* screen reader live text */}
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "Reproduciendo — Radio Empresarial" : "Radio pausada"}
      </div>

      <style jsx>{`
        /* container */
        .envivo-bar-mobile {
          background: linear-gradient(180deg, rgba(6,6,6,0.92), rgba(10,10,10,0.86));
          color: white;
          border-bottom: 1px solid rgba(255, 20, 60, 0.06);
          backdrop-filter: blur(6px);
        }

        /* ===== PLAY BUTTON: rojo neón intenso y parpadeo fuerte ===== */
        .play-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 35% 30%, rgba(255, 77, 109, 0.20), rgba(0,0,0,0.0) 40%), #0b0b0b;
          border: 1px solid rgba(255, 20, 60, 0.35);
          cursor: pointer;
          transition: transform 120ms ease;
          box-shadow:
            0 0 8px rgba(255, 20, 60, 0.45),
            0 0 20px rgba(255, 20, 60, 0.28),
            0 0 40px rgba(255, 30, 70, 0.18),
            inset 0 0 8px rgba(255, 77, 109, 0.12);
          animation: neon-blink-very-strong 0.9s linear infinite, neon-glow 1.6s ease-in-out infinite;
        }
        .play-btn:active { transform: scale(0.96); }

        .play-btn .icon { width: 28px; height: 28px; color: white; }

        @keyframes neon-blink-very-strong {
          0% {
            box-shadow:
              0 0 6px rgba(255,20,60,0.5),
              0 0 18px rgba(255,20,60,0.36);
            transform: translateY(0);
          }
          30% {
            box-shadow:
              0 0 30px rgba(255,60,90,1),
              0 0 60px rgba(255,30,70,0.8);
            transform: translateY(-1.8px);
          }
          60% {
            box-shadow:
              0 0 44px rgba(255,80,110,1),
              0 0 110px rgba(255,40,80,0.95);
            transform: translateY(-3px);
          }
          100% {
            box-shadow:
              0 0 6px rgba(255,20,60,0.5),
              0 0 18px rgba(255,20,60,0.36);
            transform: translateY(0);
          }
        }
        @keyframes neon-glow {
          0% { filter: drop-shadow(0 0 4px rgba(255,20,60,0.4)); }
          50% { filter: drop-shadow(0 0 28px rgba(255,20,60,0.9)); }
          100% { filter: drop-shadow(0 0 4px rgba(255,20,60,0.4)); }
        }

        /* ===== MARQUEE (texto que se mueve) ===== */
        .marquee-wrap {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-width: 0; /* important for truncation in flex */
        }
        .marquee { width: 100%; overflow: hidden; }
        .marquee-track {
          display: inline-flex;
          gap: 2.2rem;
          white-space: nowrap;
          align-items: center;
          animation: marquee-scroll 10s linear infinite;
        }
        .marquee:hover .marquee-track { animation-play-state: paused; }

        .marquee-item {
          display: inline-block;
          padding: 6px 10px;
          font-weight: 800;
          font-size: 0.78rem;
          color: #fff;
          -webkit-text-stroke: 0.8px rgba(255,77,109,0.96);
          text-stroke: 0.8px rgba(255,77,109,0.96);
          text-shadow:
            0 0 6px rgba(255,80,110,0.95),
            0 0 14px rgba(255,30,70,0.9),
            0 0 28px rgba(255,20,60,0.6);
          border: 1px solid rgba(255,70,100,0.5);
          background: linear-gradient(180deg, rgba(255,77,109,0.03), rgba(0,0,0,0.02));
          border-radius: 6px;
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); } /* duplicated content scroll */
        }

        /* ===== 'AL AIRE' badge (derecha) ===== */
        .alaire-wrap { flex-shrink: 0; margin-left: 6px; }
        .alaire-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          color: #fff;
          font-weight: 800;
          font-size: 0.72rem;
          background: linear-gradient(180deg, rgba(255,10,10,0.98), rgba(200,20,60,0.98));
          box-shadow:
            0 0 12px rgba(255,20,60,0.9),
            0 0 28px rgba(255,30,70,0.7),
            inset 0 0 8px rgba(255,77,109,0.3);
          border: 1px solid rgba(255,140,140,0.9);
          animation: alaire-flicker 1.2s linear infinite;
        }
        @keyframes alaire-flicker {
          0% {
            opacity: 1;
            transform: translateY(0);
            box-shadow: 0 0 8px rgba(255,20,60,0.6);
          }
          40% {
            opacity: 0.92;
            transform: translateY(-0.6px);
            box-shadow: 0 0 28px rgba(255,60,100,1);
          }
          80% {
            opacity: 0.98;
            transform: translateY(-1px);
            box-shadow: 0 0 36px rgba(255,60,120,1);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            box-shadow: 0 0 8px rgba(255,20,60,0.6);
          }
        }

        /* responsive tweaks */
        @media (max-width: 380px) {
          .play-btn { width: 48px; height: 48px; }
          .marquee-item { font-size: 0.64rem; gap: 1rem; padding: 4px 8px; }
          .alaire-badge { padding: 5px 10px; font-size: 0.7rem; }
        }
      `}</style>
    </>
  );
}
