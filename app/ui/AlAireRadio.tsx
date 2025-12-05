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
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((m) => !m);
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setRadioError(true);
  };

  return (
    <>
      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="w-full flex flex-col items-center justify-center gap-3">

        {/* HEADER DEL REPRODUCTOR */}
        <div className="flex items-center gap-6 bg-[#0d0d16]/70 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-xl border border-[#ff2d55]/40 neon-container">
          
          {/* LOGO */}
          <div className="hidden lg:flex items-center">
            <Image 
              src="/RadioAColor1.png" 
              alt="Radio Empresarial" 
              width={260} 
              height={100} 
              priority
            />
          </div>

          {/* SECCIÓN CENTRAL */}
          <div className="flex flex-col items-center text-center gap-2">

            {/* Cartel AL AIRE */}
            {radioError ? (
              <div className="neon-sign error">
                <span className="neon-text">Radio no disponible</span>
              </div>
            ) : (
              <div className="neon-sign">
                <span className="neon-text">AL AIRE</span>
              </div>
            )}

            {/* CONTROLES */}
            {!radioError && (
              <div className="flex items-center gap-4 mt-1">
                
                {/* BOTÓN PLAY */}
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="play-btn"
                >
                  {isLoading ? (
                    <div className="loader" />
                  ) : isPlaying ? (
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* VOLÚMEN */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="volume-icon">
                    {isMuted || volume === 0 ? (
                      <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2">
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
                    className="volume-slider"
                  />
                </div>
              </div>
            )}

          </div>

        </div>

        {/* --- CARTEL DESLIZANTE --- */}
        <div className="marquee-wrapper">
          <p className="marquee-text">
            🎧 Escuchá la Radio en vivo las 24Hs — Radio Empresarial — Música, información y más 🎶
          </p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="https://ohradio.cc/8310/stream"
        preload="none"
        onError={handleAudioError}
      />

      {/* --- ESTILOS NEÓN --- */}
      <style jsx>{`
        .neon-container {
          box-shadow: 0 0 15px #ff2d55, inset 0 0 10px #ff2d55;
        }
        .neon-sign {
          padding: 6px 16px;
          border: 3px solid #ff2d55;
          border-radius: 10px;
          background: rgba(255, 45, 85, 0.1);
          box-shadow: 0 0 10px #ff2d55, 0 0 20px #ff2d55;
          animation: borderPulse 3s infinite alternate;
        }
        .neon-text {
          color: #fff;
          font-size: 2rem;
          font-weight: 900;
          text-shadow: 0 0 6px #ff2d55, 0 0 12px #ff2d55;
          -webkit-text-stroke: 1px #ff2d55;
          animation: textFlicker 3s infinite alternate;
        }

        /* Play Button */
        .play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(145deg, #ff2d55, #c41744);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 1.3rem;
          box-shadow: 0px 0px 12px #ff2d55;
          transition: 0.2s ease;
        }
        .play-btn:hover {
          transform: scale(1.12);
        }
        .loader {
          width: 18px;
          height: 18px;
          border: 3px solid #fff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        .icon {
          width: 22px;
          height: 22px;
        }

        /* Slider */
        .volume-slider {
          width: 130px;
        }

        /* Marquee */
        .marquee-wrapper {
          overflow: hidden;
          width: 100%;
          border-top: 2px solid #ff2d55;
          border-bottom: 2px solid #ff2d55;
          background: rgba(255, 45, 85, 0.1);
          box-shadow: 0 0 12px #ff2d55;
        }
        .marquee-text {
          white-space: nowrap;
          padding: 8px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ff8fab;
          text-shadow: 0 0 6px #ff2d55;
          animation: marquee 12s linear infinite;
        }

        /* ANIMACIONES */
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes borderPulse {
          0% { box-shadow: 0 0 8px #ff2d55; }
          100% { box-shadow: 0 0 20px #ff2d55; }
        }
        @keyframes textFlicker {
          0%, 70% { opacity: 1; }
          72%, 80% { opacity: 0.4; }
          82%, 100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
