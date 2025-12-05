'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function AlAireRadio(): React.ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [radioError, setRadioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Volumen FIJO: 0.7 (70%)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.7;
      audio.muted = false;
    }
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
        setRadioError(false);
      }
    } catch (err) {
      console.error('Error al reproducir:', err);
      setIsLoading(false);
      setRadioError(true);
      setIsPlaying(false);
    }
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setRadioError(true);
  };

  return (
    <>
      <div className="player-wrapper" role="region" aria-label="Reproductor Radio Empresarial">
        <div className="player-row">
          {/* LOGO - ocupa el máximo alto disponible sin romper */}
          <div className="logo-wrap" aria-hidden>
            <Image src="/RadioAColor1.png" alt="Radio Empresarial" width={420} height={64} style={{ objectFit: 'contain' }} priority />
          </div>

          {/* CENTRO: badge + separación + play + ecualizador */}
          <div className="center-wrap">
            {/* AL AIRE - neón fuerte */}
            <div className={`badge ${radioError ? 'badge-off' : ''}`} aria-hidden>
              <span className="badge-text">{radioError ? 'NO DISPONIBLE' : 'AL AIRE'}</span>
            </div>

            {/* separación visual */}
            <div className="spacer" />

            {/* Play + Equalizer */}
            <div className="controls-wrap">
              <button
                onClick={togglePlay}
                className={`play-btn ${isPlaying ? 'playing' : ''}`}
                aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner" /> : (
                  <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    {isPlaying ? <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /> : <path d="M8 5v14l11-7z" />}
                  </svg>
                )}
              </button>

              {/* small equalizer (animated) */}
              <div className="eq-wrap" aria-hidden>
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
                <span className="bar b4" />
                <span className="bar b5" />
              </div>
            </div>
          </div>

          {/* RIGHT: vacío (sin íconos) */}
          <div className="right-empty" />
        </div>

        {/* MARQUEE siempre visible debajo */}
        <div className="marquee">
          <div className="marquee-inner">
            🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="https://ohradio.cc/8310/stream"
        preload="none"
        onError={handleAudioError}
      />

      <style jsx>{`
        /* CONTAINER */
        .player-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .player-row {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          height: 72px; /* compacto */
        }

        /* Logo: lo más grande posible sin salir de la franja */
        .logo-wrap { flex: 0 0 auto; display:flex; align-items:center; }
        .logo-wrap img { height: 56px; width: auto; }

        /* CENTRO */
        .center-wrap {
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 16px;
          flex: 1 1 auto;
        }

        /* BADGE NEON */
        .badge {
          min-width: 110px;
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 6px 12px;
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(255,45,85,0.06), rgba(255,45,85,0.02));
          border: 2px solid rgba(255,45,85,0.95);
          box-shadow: 0 6px 22px rgba(255,45,85,0.12), 0 0 18px rgba(255,45,85,0.12);
        }
        .badge-off {
          border-color: rgba(120,120,120,0.4);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.02);
        }
        .badge-text {
          color: #fff;
          font-weight: 900;
          letter-spacing: 0.06em;
          font-size: 0.95rem;
          text-shadow:
            0 0 8px rgba(255,45,85,0.9),
            0 0 20px rgba(255,45,85,0.7),
            0 0 30px rgba(255,36,85,0.5);
          animation: neon-flicker 2.6s infinite;
        }

        /* Spacer to separate badge and controls */
        .spacer { width: 18px; }

        /* CONTROLS compactos */
        .controls-wrap { display:flex; align-items:center; gap:12px; }

        /* PLAY BUTTON - neon blinking */
        .play-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 0;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          background: radial-gradient(circle at 30% 30%, #ff496f, #c51745 70%);
          box-shadow:
            0 6px 18px rgba(197,23,68,0.28),
            0 0 12px rgba(255,45,85,0.35);
          transition: transform .14s ease, box-shadow .14s ease;
        }
        .play-btn:hover { transform: scale(1.06); }

        /* blinking neon while idle */
        .play-btn.playing {
          box-shadow:
            0 8px 22px rgba(197,23,68,0.36),
            0 0 26px rgba(255,45,85,0.55),
            0 0 40px rgba(255,45,85,0.30);
          animation: playPulse 1.6s infinite;
        }
        .play-icon { width:20px; height:20px; color:white; }

        .spinner {
          width:14px; height:14px; border:2px solid rgba(255,255,255,0.95); border-top-color: transparent; border-radius:50%;
          animation: spin 0.7s linear infinite;
        }

        /* small equalizer */
        .eq-wrap, .eq-wrap .bar { display:inline-block; vertical-align:middle; }
        .eq-wrap {
          display:flex;
          gap:4px;
          align-items:flex-end;
          height:28px;
          padding-bottom:2px;
          width:48px;
        }
        .bar {
          display:block;
          width:5px;
          background: linear-gradient(180deg,#ff6b8a,#ff2d55);
          border-radius: 3px;
          transform-origin: bottom center;
          animation: eqAnim 1000ms linear infinite;
          opacity: 0.95;
        }
        .b1 { animation-duration: 900ms; animation-delay: 0ms; }
        .b2 { animation-duration: 1100ms; animation-delay: 120ms; }
        .b3 { animation-duration: 800ms; animation-delay: 60ms; }
        .b4 { animation-duration: 1000ms; animation-delay: 40ms; }
        .b5 { animation-duration: 1150ms; animation-delay: 160ms; }

        /* right area (empty) */
        .right-empty { flex:0 0 28px; }

        /* MARQUEE siempre visible */
        .marquee {
          width: 100%;
          max-width: 1200px;
          margin-top: 8px;
          overflow:hidden;
          border-radius: 8px;
          background: linear-gradient(90deg, rgba(255,45,85,0.03), rgba(255,45,85,0.02));
          border: 1px solid rgba(255,45,85,0.06);
        }
        .marquee-inner {
          display:inline-block;
          white-space:nowrap;
          padding:6px 12px;
          color:#ff9fb0;
          font-weight:600;
          text-shadow: 0 0 8px rgba(255,45,85,0.25);
          animation: scrollText 16s linear infinite;
        }

        /* keyframes */
        @keyframes scrollText {
          from { transform: translateX(100%); }
          to   { transform: translateX(-100%); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes eqAnim {
          0% { transform: scaleY(0.2); opacity: 0.6; }
          25% { transform: scaleY(0.9); opacity: 1; }
          50% { transform: scaleY(0.45); opacity: 0.85; }
          75% { transform: scaleY(0.85); opacity: 1; }
          100% { transform: scaleY(0.25); opacity: 0.7; }
        }
        @keyframes neon-flicker {
          0%, 60%, 100% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,45,85,0.9)); }
          62% { opacity: 0.5; filter: drop-shadow(0 0 4px rgba(255,45,85,0.5)); }
          64% { opacity: 1; filter: drop-shadow(0 0 10px rgba(255,45,85,1)); }
        }
        @keyframes playPulse {
          0% { transform: scale(1); box-shadow: 0 8px 22px rgba(197,23,68,0.36), 0 0 20px rgba(255,45,85,0.35); }
          50% { transform: scale(1.05); box-shadow: 0 10px 30px rgba(197,23,68,0.5), 0 0 36px rgba(255,45,85,0.55); }
          100% { transform: scale(1); box-shadow: 0 8px 22px rgba(197,23,68,0.36), 0 0 20px rgba(255,45,85,0.35); }
        }

        /* responsive adjustments */
        @media (max-width: 1024px) {
          .logo-wrap img { height: 48px; }
          .player-row { height: 64px; padding:6px 10px; }
          .badge { min-width: 92px; }
        }
        @media (max-width: 640px) {
          .logo-wrap { display:none; } /* logo hidden on very small screens to save space */
          .marquee-inner { font-size: 0.95rem; }
        }
      `}</style>
    </>
  );
}
