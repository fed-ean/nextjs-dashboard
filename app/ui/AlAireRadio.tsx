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

  const handleAudioError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setRadioError(true);
  };

  return (
    <>
      {/* contenedor compacto (altura fijada) */}
      <div className="w-full flex flex-col items-center">
        <div
          className="w-full max-w-screen-xl mx-auto flex items-center justify-between gap-4 px-4 py-2 h-20 rounded-lg"
          style={{
            background: 'rgba(13,13,22,0.6)',
            border: '1px solid rgba(255,45,85,0.18)',
            boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
          }}
        >
          {/* logo (ajustar tamaño para que entre en la franja) */}
          <div className="flex items-center shrink-0">
            <div className="hidden lg:block">
              <Image src="/RadioAColor1.png" alt="Radio Empresarial" width={220} height={48} priority />
            </div>
          </div>

          {/* centro: badge + controls compactos */}
          <div className="flex items-center gap-4 flex-1 justify-center">
            {/* badge AL AIRE (compacto) */}
            <div className="flex items-center px-3 py-1 rounded-md neon-badge">
              <span className="text-white font-black text-sm tracking-wider">AL AIRE</span>
            </div>

            {/* controles compactos */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
                className="w-11 h-11 rounded-full flex items-center justify-center play-compact"
                style={{ boxShadow: '0 6px 16px rgba(255,45,85,0.28)' }}
              >
                {isLoading ? (
                  <span className="loader-small" />
                ) : isPlaying ? (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* icono mute (si quieres) */}
              <button onClick={toggleMute} aria-label="Silenciar" className="hidden sm:flex items-center text-gray-200 hover:text-white">
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
              <div className="hidden md:flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-36 appearance-none h-1 rounded-full bg-gray-600"
                  aria-label="Volumen"
                />
                <span className="text-xs text-gray-200 w-8 text-right">{isMuted ? 0 : volume}%</span>
              </div>
            </div>
          </div>

          {/* espacio derecho reservado (puede usarse para iconos) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Suscribite icon (ejemplo) */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#ff9fb0]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8v13h18V8H3zm9 7.5L6 9h13l-7 6.5zM12 2l5 5h-3v4h-4V7H7l5-5z"/></svg>
              <span className="hidden lg:inline">Suscribite</span>
            </div>
          </div>
        </div>

        {/* MARQUEE/SLIDER FINO (muy compacto) */}
        <div className="w-full max-w-screen-xl mx-auto mt-2">
          <div className="h-7 overflow-hidden rounded-md marquee-compact">
            <p className="marquee-compact-text">
              🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
            </p>
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
        /* play button */
        .play-compact {
          background: linear-gradient(135deg, #ff2d55 0%, #c41744 100%);
          border: none;
          color: white;
        }
        .loader-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.9);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* neon badge compact */
        .neon-badge {
          border: 2px solid rgba(255,45,85,0.9);
          background: linear-gradient(180deg, rgba(255,45,85,0.06), rgba(255,45,85,0.02));
          box-shadow: 0 4px 18px rgba(255,45,85,0.18), inset 0 0 8px rgba(255,45,85,0.06);
          padding-left: 10px;
          padding-right: 10px;
        }

        /* compact marquee */
        .marquee-compact {
          background: linear-gradient(90deg, rgba(255,45,85,0.04), rgba(255,45,85,0.03));
          border: 1px solid rgba(255,45,85,0.08);
          box-shadow: 0 4px 12px rgba(255,45,85,0.06);
        }
        .marquee-compact-text {
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%;
          color: #ff8fab;
          font-weight: 600;
          font-size: 0.95rem;
          text-shadow: 0 0 6px rgba(255,45,85,0.35);
          animation: marquee 14s linear infinite;
          padding: 6px 0;
        }

        @keyframes marquee {
          from { transform: translateX(0%); }
          to { transform: translateX(-100%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* small responsiveness fixes */
        @media (max-width: 640px) {
          .neon-badge { padding-left: 8px; padding-right: 8px; }
          .marquee-compact-text { font-size: 0.86rem; }
        }
      `}</style>
    </>
  );
}
