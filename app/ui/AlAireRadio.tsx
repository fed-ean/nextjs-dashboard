'use client';
import { useState, useRef, useEffect } from 'react';
import Image from "next/image";

export default function AlAireRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al reproducir:', error);
      setIsLoading(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {/* Logo de la Flecha */}
        <div className="hidden lg:flex items-center justify-center flex-shrink-0">
          <Image
            src="/RadioAColor1.png" 
            alt='Imagen'
            width={300}
            height={100}
            priority
          />
        </div>

        {/* Texto con cartel neón solo en AL AIRE */}
        <div className="flex items-center justify-center gap-3">
          {/* RadioEmpresaria - Con neón sutil */}
          
          
          {/* AL AIRE - Con neón intenso y cartel */}
          <div className="neon-sign-compact">
            <span className="neon-text-status text-3xl font-bold tracking-wider">
              AL AIRE
            </span>
          </div>
        </div>

        {/* Reproductor compacto */}
        <div className="flex justify-center">
          <div className="reproductor-hover flex items-center gap-2 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
            {/* Botón Play/Pause - Siempre visible */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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

            {/* Control de Volumen - Se muestra al hacer hover */}
            <div className="controles-volumen flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-300 hover:text-white transition-colors flex-shrink-0"
              >
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
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider-compact w-32 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
              />

              <span className="text-white font-medium text-xs w-8 text-right flex-shrink-0">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://ohradio.cc/8310/stream"
        preload="none"
      />

      <style jsx>{`
        /* Efecto de expansión del reproductor */
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

        /* Texto con efecto neón sutil para RadioEmpresaria */
        .text-brand {
          font-family: 'Didot', 'Bodoni MT', 'Playfair Display', Georgia, serif;
          font-weight: 300;
        }

        .text-red-neon {
          color: #ff6b8a;
          text-shadow: 
            0 0 2px #ff6b8a,
            0 0 4px #ff6b8a,
            0 0 6px #ff406d;
          animation: neon-pulse-red 3s infinite alternate;
        }

        .text-blue-neon {
          color: #93c5fd;
          text-shadow: 
            0 0 2px #93c5fd,
            0 0 4px #93c5fd,
            0 0 6px #60a5fa;
          animation: neon-pulse-blue 3s infinite alternate;
        }

        @keyframes neon-pulse-red {
          0%, 100% {
            text-shadow: 
              0 0 2px #ff6b8a,
              0 0 4px #ff6b8a,
              0 0 6px #ff406d;
          }
          50% {
            text-shadow: 
              0 0 3px #ff6b8a,
              0 0 6px #ff6b8a,
              0 0 9px #ff406d;
          }
        }

        @keyframes neon-pulse-blue {
          0%, 100% {
            text-shadow: 
              0 0 2px #93c5fd,
              0 0 4px #93c5fd,
              0 0 6px #60a5fa;
          }
          50% {
            text-shadow: 
              0 0 3px #93c5fd,
              0 0 6px #93c5fd,
              0 0 9px #60a5fa;
          }
        }

        /* Cartel neón compacto solo para AL AIRE - Estilo retro con outline */
        .neon-sign-compact {
          position: relative;
          display: inline-block;
          padding: 8px 16px;
          border: 3px solid #ff4d6d;
          border-radius: 8px;
          box-shadow: 
            0 0 5px #ff4d6d,
            0 0 10px #ff4d6d,
            0 0 15px #ff4d6d,
            inset 0 0 5px #ff4d6d,
            inset 0 0 10px #ff4d6d;
          animation: neon-border-compact 4s infinite alternate;
          background: rgba(255, 77, 109, 0.03);
        }

        .neon-text-status {
          color: #ffffff;
          font-family: 'Arial Black', 'Impact', sans-serif;
          -webkit-text-stroke: 2px #ff4d6d;
          text-stroke: 2px #ff4d6d;
          font-weight: 900;
          text-shadow: 
            0 0 5px #ff4d6d,
            0 0 10px #ff4d6d,
            0 0 15px #ff4d6d,
            0 0 20px #ff0844,
            0 0 25px #ff0844;
          animation: neon-flicker-outline 4s infinite alternate;
        }

        @keyframes neon-flicker-outline {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            -webkit-text-stroke: 2px #ff4d6d;
            text-stroke: 2px #ff4d6d;
            text-shadow: 
              0 0 5px #ff4d6d,
              0 0 10px #ff4d6d,
              0 0 15px #ff4d6d,
              0 0 20px #ff0844,
              0 0 25px #ff0844;
          }
          20%, 24%, 55% {
            -webkit-text-stroke: 2px #ff6b8a;
            text-stroke: 2px #ff6b8a;
            text-shadow: 
              0 0 3px #ff4d6d,
              0 0 6px #ff4d6d,
              0 0 10px #ff4d6d;
          }
        }

        @keyframes neon-border-compact {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            box-shadow: 
              0 0 5px #ff4d6d,
              0 0 10px #ff4d6d,
              0 0 15px #ff4d6d,
              inset 0 0 5px #ff4d6d,
              inset 0 0 10px #ff4d6d;
            border-color: #ff4d6d;
          }
          20%, 24%, 55% {
            box-shadow: 
              0 0 3px #ff4d6d,
              0 0 6px #ff4d6d,
              inset 0 0 3px #ff4d6d;
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