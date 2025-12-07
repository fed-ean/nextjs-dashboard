"use client";

import React, { useState, useRef } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

export default function MobileRadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src="https://radio.streaming/source" // <-- tu URL real
      ></audio>

      {/* PLAYER MOBILE */}
      <div className="w-full fixed bottom-0 left-0 bg-black text-white py-3 px-4 shadow-xl z-50 md:hidden">

        <div className="flex items-center justify-between gap-3">

          {/* PLAY BUTTON */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center
                       border-2 border-red-500 neon-red"
          >
            {isPlaying ? (
              <PauseIcon className="w-8 h-8 text-red-400" />
            ) : (
              <PlayIcon className="w-8 h-8 text-red-400 pl-1" />
            )}
          </button>

          {/* CARTEL NEÓN CENTRO */}
          <div className="flex-1 text-center">
            <p className="text-xs font-bold leading-tight tracking-wide text-red-400 
                          drop-shadow-[0_0_5px_#ff1a1a]">
              🎧 Escuchá la radio en vivo las 24Hs <br />
              — Radio Empresarial — <br />
              Música, información y más 🎶
            </p>
          </div>

          {/* “AL AIRE” DERECHA */}
          <div className="text-right">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md 
                             shadow-[0_0_10px_#ff1a1a] animate-pulse">
              🔴 AL AIRE
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
