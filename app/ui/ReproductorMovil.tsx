"use client";

import React, { useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

export default function MobileRadioPlayer({
  streamUrl = "https://radio.streaming/source",
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
      console.error("Audio play error:", e);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={streamUrl} preload="none" />

      {/* PLAYER - aparece en MOBILE (oculto en MD+) */}
      <div className="md:hidden w-full bg-black text-white py-3 px-4 shadow-md">
        <div className="flex items-center gap-3">
          {/* Play button */}
          <button
            onClick={togglePlay}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
            className="flex-shrink-0 w-14 h-14 rounded-full bg-black border-2 border-red-500 flex items-center justify-center neon-red"
          >
            {isPlaying ? (
              <PauseIcon className="w-7 h-7 text-red-400" />
            ) : (
              <PlayIcon className="w-7 h-7 text-red-400" />
            )}
          </button>

          {/* Texto central */}
          <div className="flex-1 text-center">
            <p className="text-xs font-bold leading-tight tracking-wide text-red-400 drop-shadow-[0_0_5px_#ff1a1a]">
              🎧 Escuchá la radio en vivo las 24Hs — Radio Empresarial — Música,
              información y más 🎶
            </p>
          </div>

          {/* AL AIRE */}
          <div className="flex-shrink-0 text-right">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md shadow-[0_0_8px_#ff1a1a]">
              🔴 AL AIRE
            </span>
          </div>
        </div>
      </div>

      {/* small inline styles for neon (keeps self-contained) */}
      <style jsx>{`
        @keyframes neonPulseRed {
          0% {
            box-shadow: 0 0 4px #ff1a1a, 0 0 8px #ff1a1a;
          }
          50% {
            box-shadow: 0 0 10px #ff4d4d, 0 0 22px #ff4d4d;
          }
          100% {
            box-shadow: 0 0 4px #ff1a1a, 0 0 8px #ff1a1a;
          }
        }
        .neon-red {
          animation: neonPulseRed 1.6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
