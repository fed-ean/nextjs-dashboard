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
          {/* LOGO */}
          <div className="logo-wrap" aria-hidden>
            <Image
              src="/RadioAColor1.png"
              alt="Radio Empresarial"
              width={420}
              height={64}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* CENTRO */}
          <div className="center-wrap">
            <div className={`badge ${radioError ? 'badge-off' : ''}`} aria-hidden>
              <span className="badge-text">{radioError ? 'NO DISPONIBLE' : 'AL AIRE'}</span>
            </div>

            <div className="spacer" />

            <div className="controls-wrap">
              {/* contenedor relativo: el eq-mini quedará posicionado respecto a este contenedor */}
              <div className="play-eq-wrapper">
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

                {/* ecualizador pequeño posicionado abajo del botón (no aumenta la caja) */}
                <div className="eq-mini" aria-hidden>
                  <span className="eq-bar e1" />
                  <span className="eq-bar e2" />
                  <span className="eq-bar e3" />
                </div>
              </div>
            </div>
          </div>

          <div className="right-empty" />
        </div>

        {/* MARQUEE siempre visible */}
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
        /* layout compacto (sin cambiar altura) */
        .player-wrapper { width: 100%; display:flex; flex-direction:column; align-items:center; }
        .player-row {
          width: 100%;
          max-width: 1200px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:6px 12px;
          height:72px; /* mantiene la altura */
          overflow: visible; /* permite que eq-mini se vea sin ampliar caja */
        }

        .logo-wrap { flex:0 0 auto; display:flex; align-items:center; }
        .logo-wrap img { height:56px; width:auto; }

        .center-wrap { display:flex; align-items:center; gap:12px; flex:1 1 auto; justify-content:center; }

        .badge {
          min-width:110px;
          display:flex; align-items:center; justify-content:center;
          padding:6px 12px; border-radius:10px;
          background: linear-gradient(180deg, rgba(255,45,85,0.06), rgba(255,45,85,0.02));
          border: 2px solid rgba(255,45,85,0.95);
          box-shadow: 0 6px 22px rgba(255,45,85,0.12), 0 0 18px rgba(255,45,85,0.06);
        }
        .badge-off { border-color: rgba(120,120,120,0.4); box-shadow: 0 4px 10px rgba(0,0,0,0.06); background: rgba(255,255,255,0.02); }
        .badge-text {
          color: #fff; font-weight:900; letter-spacing:0.06em; font-size:0.95rem;
          text-shadow: 0 0 8px rgba(255,45,85,0.95), 0 0 16px rgba(255,45,85,0.7);
          animation: neon-flicker 2.6s infinite;
        }

        .spacer { width:18px; }

        .controls-wrap { display:flex; align-items:center; gap:12px; }

        /* wrapper relativo para play + eq */
        .play-eq-wrapper { position: relative; width: 48px; height: 48px; display:flex; align-items:center; justify-content:center; }

        .play-btn {
          width:48px; height:48px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background: radial-gradient(circle at 30% 30%, #ff496f, #c51745 70%);
          border:0; color:white; cursor:pointer;
          box-shadow: 0 6px 18px rgba(197,23,68,0.28), 0 0 12px rgba(255,45,85,0.35);
          transition: transform .14s ease, box-shadow .14s ease;
          z-index: 2;
        }
        .play-btn:hover { transform: scale(1.06); }
        .play-btn.playing { animation: playPulse 1.6s infinite; }

        .play-icon { width:20px; height:20px; color:white; }
        .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.95); border-top-color:transparent; border-radius:50%; animation: spin 0.7s linear infinite; }

        /* EQ MINI: pequeño, debajo del botón, no cambia layout (position absolute) */
        .eq-mini {
          position: absolute;
          left: 50%;
          top: calc(100% + 4px); /* justo debajo del botón */
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          align-items: flex-end;
          width: 36px;
          height: 18px;
          z-index: 1;
          pointer-events: none; /* no roba clicks */
        }
        .eq-bar {
          width: 6px;
          background: linear-gradient(180deg,#ff8aa2,#ff2d55);
          border-radius: 3px;
          transform-origin: bottom center;
          animation: eqSmall 900ms linear infinite;
          box-shadow: 0 0 8px rgba(255,45,85,0.45);
        }
        .e1 { animation-delay: 0ms; }
        .e2 { animation-delay: 120ms; height: 12px; }
        .e3 { animation-delay: 240ms; height: 16px; }

        /* Small equalizer animation (scaleY) */
        @keyframes eqSmall {
          0% { transform: scaleY(0.25); opacity: 0.6; }
          30% { transform: scaleY(1.0); opacity: 1; }
          60% { transform: scaleY(0.45); opacity: 0.8; }
          100% { transform: scaleY(0.3); opacity: 0.65; }
        }

        .right-empty { flex:0 0 28px; }

        .marquee { width:100%; max-width:1200px; margin-top:8px; overflow:hidden; border-radius:8px; background: linear-gradient(90deg, rgba(255,45,85,0.03), rgba(255,45,85,0.02)); border:1px solid rgba(255,45,85,0.06); }
        .marquee-inner { display:inline-block; white-space:nowrap; padding:6px 12px; color:#ff9fb0; font-weight:600; text-shadow:0 0 8px rgba(255,45,85,0.25); animation: scrollText 16s linear infinite; }

        @keyframes scrollText { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes neon-flicker {
          0%, 60%, 100% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,45,85,0.95)); }
          62% { opacity: 0.45; filter: drop-shadow(0 0 4px rgba(255,45,85,0.5)); }
          64% { opacity: 1; filter: drop-shadow(0 0 12px rgba(255,45,85,1)); }
        }
        @keyframes playPulse {
          0% { transform: scale(1); box-shadow: 0 8px 22px rgba(197,23,68,0.36), 0 0 20px rgba(255,45,85,0.35); }
          50% { transform: scale(1.05); box-shadow: 0 10px 30px rgba(197,23,68,0.5), 0 0 36px rgba(255,45,85,0.55); }
          100% { transform: scale(1); box-shadow: 0 8px 22px rgba(197,23,68,0.36), 0 0 20px rgba(255,45,85,0.35); }
        }

        /* responsive tweaks */
        @media (max-width: 1024px) {
          .logo-wrap img { height:48px; }
          .player-row { height:64px; padding:6px 10px; }
          .badge { min-width:92px; }
        }
        @media (max-width: 640px) {
          .logo-wrap { display:none; }
          .marquee-inner { font-size:0.95rem; }
        }
      `}</style>
    </>
  );
}
