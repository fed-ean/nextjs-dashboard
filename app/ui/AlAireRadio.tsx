'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function AlAireRadio(): React.ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [radioError, setRadioError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio instanceof HTMLAudioElement) {
      audio.muted = isMuted;
      audio.volume = isMuted ? 0 : Math.min(Math.max(volume / 100, 0), 1);
    }
  }, [volume, isMuted]);

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
    } catch (error) {
      console.error('Error al reproducir:', error);
      setIsLoading(false);
      setRadioError(true);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10) || 0;
    setVolume(newVolume);
    if (isMuted && newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted((m) => !m);
  const handleAudioError = () => { setIsPlaying(false); setIsLoading(false); setRadioError(true); };

  return (
    <>
      {/* player-wrapper: hover sobre este contenedor muestra el marquee */}
      <div className="player-wrapper" >
        <div
          className="player-inner"
          role="region"
          aria-label="Reproductor Radio Empresarial"
        >
          {/* LOGO izquierdo - ocupa lo máximo posible dentro de la franja */}
          <div className="player-logo">
            <Image
              src="/RadioAColor1.png"
              alt="Radio Empresarial"
              width={420}      /* ancho "máximo" sugerido, será escalado por CSS */
              height={80}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* CENTRO: badge + controles compactos */}
          <div className="player-center">
            {/* badge compact */}
            <div className={`badge ${radioError ? 'badge-error' : ''}`} aria-hidden>
              <span className="badge-text">{radioError ? 'NO DISPONIBLE' : 'AL AIRE'}</span>
            </div>

            {/* controles */}
            <div className="controls">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
                className="btn-play"
              >
                {isLoading ? <span className="loader-small" /> :
                  isPlaying ? (
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                  ) : (
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  )
                }
              </button>

              {/* mute (oculto en XS) */}
              <button onClick={toggleMute} className="btn-mute" aria-label="Silenciar">
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>

              {/* volumen (solo md+) */}
              <div className="volume-box">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  aria-label="Volumen"
                />
                <span className="vol-percent" aria-hidden>{isMuted ? 0 : volume}%</span>
              </div>
            </div>
          </div>

          {/* ESPACIO DERECHO (iconos pequeños) */}
          <div className="player-right">
            <a href="/Login" aria-label="Suscribite" className="icon-subscribe" title="Suscribite">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 8v13h18V8H3zm9 7.5L6 9h13l-7 6.5zM12 2l5 5h-3v4h-4V7H7l5-5z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* MARQUEE: oculto por defecto, aparece al hover sobre .player-wrapper */}
        <div className="player-marquee" aria-hidden>
          <div className="player-marquee-inner">
            🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
          </div>
        </div>
      </div>

      {/* audio element */}
      <audio
        ref={audioRef}
        src="https://ohradio.cc/8310/stream"
        preload="none"
        onError={handleAudioError}
      />

      {/* estilos locales */}
      <style jsx>{`
        /* --- wrapper / layout --- */
        .player-wrapper { width: 100%; }
        .player-inner {
          display: flex;
          align-items: center;
          gap: 18px;
          height: 64px;                 /* altura compacta y consistente */
          padding: 6px 14px;
          border-radius: 10px;
          background: transparent;      /* transparente para apoyarse en el fondo blanco */
        }

        /* Logo: ocupa lo máximo dentro de la franja, manteniendo proporción */
        .player-logo { flex: 0 0 auto; display:flex; align-items:center; }
        .player-logo img { height: 48px; width: auto; }

        /* centro: badge + controles */
        .player-center { display:flex; align-items:center; gap:12px; flex:1; justify-content:center; }

        /* badge compact */
        .badge {
          border-radius: 8px;
          padding: 6px 10px;
          border: 2px solid rgba(255,45,85,0.95);
          background: linear-gradient(180deg, rgba(255,45,85,0.06), rgba(255,45,85,0.02));
          box-shadow: 0 6px 18px rgba(255,45,85,0.12), inset 0 0 8px rgba(255,45,85,0.04);
          display:flex;
          align-items:center;
          justify-content:center;
          min-width:88px;
        }
        .badge-error { border-color: rgba(120,120,120,0.7); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .badge-text {
          color: #fff;
          font-weight: 800;
          font-size: 0.92rem;
          letter-spacing: 0.06em;
          text-shadow: 0 0 6px rgba(255,45,85,0.6);
          animation: neonPulse 3s infinite ease-in-out;
        }

        /* controls compactos */
        .controls { display:flex; align-items:center; gap:10px; }
        .btn-play {
          width:44px; height:44px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background: linear-gradient(135deg, #ff2d55 0%, #c41744 100%);
          border:none; color:white; cursor:pointer;
          box-shadow: 0 8px 20px rgba(255,45,85,0.22);
        }
        .btn-play:active { transform: scale(.98); }
        .loader-small {
          width:13px; height:13px; border:2px solid rgba(255,255,255,0.95);
          border-top-color: transparent; border-radius:50%; animation: spin 0.7s linear infinite;
        }
        .btn-mute { background: transparent; border: none; color: #e6e6e6; display:flex; align-items:center; }

        /* volumen (solo md+) */
        .volume-box { display:none; align-items:center; gap:8px; }
        .volume-slider { width:160px; height:3px; background: rgba(255,255,255,0.12); border-radius:999px; -webkit-appearance:none; }
        .volume-slider::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; background: linear-gradient(180deg,#ff2d55,#c41744); border-radius:50%; box-shadow:0 4px 10px rgba(196,25,68,0.45); cursor:pointer; }
        .vol-percent { color: #cfcfcf; font-size: 0.75rem; min-width:36px; text-align:right; }

        /* right area */
        .player-right { flex:0 0 auto; display:flex; align-items:center; gap:8px; }

        /* MARQUEE (oculto por defecto) */
        .player-marquee {
          max-height: 0;
          overflow: hidden;
          transition: max-height 260ms ease, opacity 220ms ease, transform 260ms ease;
          opacity: 0;
        }
        .player-marquee-inner {
          white-space: nowrap;
          padding: 6px 12px;
          display:inline-block;
          color: #ff9fb0;
          font-weight:600;
          text-shadow: 0 0 6px rgba(255,45,85,0.35);
          animation: scrollText 14s linear infinite;
        }

        /* -- show marquee on hover of wrapper -- */
        .player-wrapper:hover .player-marquee {
          max-height: 32px;
          opacity: 1;
          transform: translateY(0);
        }

        /* responsive: mostrar volumen en md+ */
        @media (min-width: 768px) {
          .volume-box { display:flex; }
        }

        @keyframes neonPulse {
          0% { text-shadow: 0 0 4px rgba(255,45,85,0.45); }
          50% { text-shadow: 0 0 10px rgba(255,45,85,0.78); transform: translateY(-1px); }
          100% { text-shadow: 0 0 6px rgba(255,45,85,0.55); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scrollText {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </>
  );
}
