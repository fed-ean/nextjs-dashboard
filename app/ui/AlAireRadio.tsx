'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function AlAireRadio(): React.ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [radioError, setRadioError] = useState<boolean>(false);

  // Tipado correcto del ref para que TypeScript sepa que es un elemento audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio instanceof HTMLAudioElement) {
      // Ajustamos tanto volume como muted (mejor comportamiento)
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
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((m) => !m);
  };

  const handleAudioError = () => {
    console.error('Fallo al cargar el stream de la radio.');
    setIsPlaying(false);
    setIsLoading(false);
    setRadioError(true);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="hidden lg:flex items-center justify-center flex-shrink-0">
          <Image src="/RadioAColor1.png" alt="Imagen" width={300} height={100} priority />
        </div>

        {/* Estado y Reproductor */}
        <div className="flex items-center justify-center gap-3">
          {radioError ? (
            <div className="neon-sign-compact error-state">
              <span className="neon-text-status text-base font-bold tracking-wider">Radio no disponible</span>
            </div>
          ) : (
            <>
              <div className="neon-sign-compact">
                <span className="neon-text-status text-3xl font-bold tracking-wider">AL AIRE</span>
              </div>
              <div className="flex justify-center">
                <div className="reproductor-hover flex items-center gap-2 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
                  <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label={isPlaying ? 'Pausar radio' : 'Reproducir radio'}
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <div className="controles-volumen flex items-center gap-2">
                    <button onClick={toggleMute} className="text-gray-300 hover:text-white transition-colors flex-shrink-0" aria-label="Silenciar">
                      {isMuted || volume === 0 ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="volume-slider-compact w-32 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                      aria-label="Volumen"
                    />
                    <span className="text-white font-medium text-xs w-8 text-right flex-shrink-0">{isMuted ? 0 : volume}%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src="https://ohradio.cc/8310/stream"
        preload="none"
        onError={handleAudioError}
      />

      <style jsx>{`
        .error-state {
          border-color: #888;
          box-shadow: 0 0 5px #888, inset 0 0 5px #888;
          animation: none;
        }
        .error-state .neon-text-status {
          -webkit-text-stroke-color: #888;
          text-stroke-color: #888;
          text-shadow: 0 0 5px #888;
          animation: none;
        }
        .reproductor-hover {
          width: auto;
          max-width: 48px;
        }
        .reproductor-hover:hover {
          max-width: 320px;
        }
        .controles-volumen {
          opacity: 0;
          width: 0;
          transition: opacity 0.3s ease-in-out, width 0.3s ease-in-out;
        }
        .reproductor-hover:hover .controles-volumen {
          opacity: 1;
          width: auto;
        }
        .text-brand {
          font-family: 'Didot', 'Bodoni MT', 'Playfair Display', Georgia, serif;
          font-weight: 300;
        }
        .text-red-neon {
          color: #ff6b8a;
          text-shadow: 0 0 2px #ff6b8a, 0 0 4px #ff6b8a, 0 0 6px #ff406d;
          animation: neon-pulse-red 3s infinite alternate;
        }
        .text-blue-neon {
          color: #93c5fd;
          text-shadow: 0 0 2px #93c5fd, 0 0 4px #93c5fd, 0 0 6px #60a5fa;
          animation: neon-pulse-blue 3s infinite alternate;
        }
        @keyframes neon-pulse-red {
          50% {
            text-shadow: 0 0 3px #ff6b8a, 0 0 6px #ff6b8a, 0 0 9px #ff406d;
          }
        }
        @keyframes neon-pulse-blue {
          50% {
            text-shadow: 0 0 3px #93c5fd, 0 0 6px #93c5fd, 0 0 9px #60a5fa;
          }
        }
        .neon-sign-compact {
          position: relative;
          display: inline-block;
          padding: 8px 16px;
          border: 3px solid #ff4d6d;
          border-radius: 8px;
          box-shadow: 0 0 5px #ff4d6d, 0 0 10px #ff4d6d, 0 0 15px #ff4d6d, inset 0 0 5px #ff4d6d, inset 0 0 10px #ff4d6d;
          animation: neon-border-compact 4s infinite alternate;
          background: rgba(255, 77, 109, 0.03);
        }
        .neon-text-status {
          color: #ffffff;
          font-family: 'Arial Black', 'Impact', sans-serif;
          -webkit-text-stroke: 2px #ff4d6d;
          text-stroke: 2px #ff4d6d;
          font-weight: 900;
          text-shadow: 0 0 5px #ff4d6d, 0 0 10px #ff4d6d, 0 0 15px #ff4d6d, 0 0 20px #ff0844, 0 0 25px #ff0844;
          animation: neon-flicker-outline 4s infinite alternate;
        }
        @keyframes neon-flicker-outline {
          20%,
          24%,
          55% {
            -webkit-text-stroke-color: #ff6b8a;
            text-stroke-color: #ff6b8a;
            text-shadow: 0 0 3px #ff4d6d, 0 0 6px #ff4d6d, 0 0 10px #ff4d6d;
          }
        }
        @keyframes neon-border-compact {
          20%,
          24%,
          55% {
            box-shadow: 0 0 3px #ff4d6d, 0 0 6px #ff4d6d, inset 0 0 3px #ff4d6d;
            border-color: #ff6b8a;
          }
        }
        .volume-slider-compact::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(to bottom right, #dc2626, #991b1b);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
          transition: all 0.2s;
        }
        .volume-slider-compact::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);
        }
        .volume-slider-compact::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(to bottom right, #dc2626, #991b1b);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
          transition: all 0.2s;
        }
        .volume-slider-compact::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);
        }
      `}</style>
    </>
  );
}
