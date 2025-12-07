'use client';
import { useState, useRef } from 'react';

export default function ReproductorMovil() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Se añade la clase 'envivo-bar' para referenciarla en global.css */}
      <div className="envivo-bar lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-100 text-white p-2 h-14 shadow-lg">
        {/* 1. Botón de Reproducción a la Izquierda */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center flex-shrink-0"
          aria-label="Reproducir o pausar la radio"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* 2. Cartel de Neón en el Medio */}
        <div className="neon-sign-compact-mobile">
          <span className="neon-text-status-mobile">AL AIRE</span>
        </div>

        {/* 3. Espaciador Invisible para centrar el cartel */}
        <div className="w-10 h-10 flex-shrink-0" aria-hidden="true"></div>

        <audio ref={audioRef} src="https://ohradio.cc/8310/stream" preload="none" />
      </div>

      <style jsx>{`
        .neon-sign-compact-mobile {
          position: relative;
          display: inline-block;
          padding: 4px 12px; /* Reducido para móvil */
          border: 2px solid #ff4d6d;
          border-radius: 6px;
          box-shadow: 
            0 0 3px #ff4d6d,
            0 0 6px #ff4d6d,
            0 0 9px #ff4d6d,
            inset 0 0 3px #ff4d6d,
            inset 0 0 6px #ff4d6d;
          animation: neon-border-compact 4s infinite alternate;
          background: rgba(255, 77, 109, 0.03);
        }

        .neon-text-status-mobile {
          color: #ffffff;
          font-family: 'Arial Black', 'Impact', sans-serif;
          font-size: 1rem; /* Reducido para móvil */
          -webkit-text-stroke: 1.5px #ff4d6d;
          text-stroke: 1.5px #ff4d6d;
          font-weight: 900;
          text-shadow: 
            0 0 3px #ff4d6d,
            0 0 6px #ff4d6d,
            0 0 9px #ff4d6d,
            0 0 12px #ff0844;
          animation: neon-flicker-outline 4s infinite alternate;
        }

        @keyframes neon-flicker-outline {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            -webkit-text-stroke: 1.5px #ff4d6d;
            text-stroke: 1.5px #ff4d6d;
            text-shadow: 
              0 0 3px #ff4d6d,
              0 0 6px #ff4d6d,
              0 0 9px #ff4d6d,
              0 0 12px #ff0844;
          }
          20%, 24%, 55% {
            -webkit-text-stroke: 1.5px #ff6b8a;
            text-stroke: 1.5px #ff6b8a;
            text-shadow: 
              0 0 2px #ff4d6d,
              0 0 4px #ff4d6d,
              0 0 6px #ff4d6d;
          }
        }

        @keyframes neon-border-compact {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            box-shadow: 
              0 0 3px #ff4d6d,
              0 0 6px #ff4d6d,
              inset 0 0 3px #ff4d6d;
            border-color: #ff4d6d;
          }
          20%, 24%, 55% {
            box-shadow: 
              0 0 2px #ff4d6d,
              0 0 4px #ff4d6d,
              inset 0 0 2px #ff4d6d;
            border-color: #ff6b8a;
          }
        }
      `}</style>
    </>
  );
}
