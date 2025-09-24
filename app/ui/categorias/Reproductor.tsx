"use client";
import { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

export default function ReproductorRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  // El título siempre será "Radio en Vivo"
  const [songTitle, setSongTitle] = useState("Radio en Vivo"); 
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const streamUrl = "https://ohradio.cc/8310/stream";
  const bars = Array.from({ length: 15 }, (_, i) => i);
  const [barHeights, setBarHeights] = useState(() => bars.map(() => 4));

  useEffect(() => {
    if (isPlaying) {
      const animateBars = () => {
        const newHeights = bars.map(() => Math.floor(Math.random() * (40 - 5 + 1)) + 5);
        setBarHeights(newHeights);
        animationFrameRef.current = requestAnimationFrame(animateBars);
      };
      animationFrameRef.current = requestAnimationFrame(animateBars);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setBarHeights(bars.map(() => 4));
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, bars]);

  // Se eliminó la funcionalidad de la API
  // El texto "Radio en Vivo" será fijo.

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsLoading(false);
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al reproducir el audio:", error);
        setIsLoading(false);
      }
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = lastVolume;
      setVolume(lastVolume);
    } else {
      setLastVolume(volume);
      audioRef.current.volume = 0;
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
      <button
        onClick={togglePlay}
        className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg text-white transform transition-transform duration-300 hover:scale-105 relative"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        ) : isPlaying ? (
          <PauseIcon className="w-8" />
        ) : (
          <PlayIcon className="w-8" />
        )}
      </button>

      <div className="flex items-end space-x-1 h-12 w-full justify-center">
        {bars.map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-pink-500 transition-all duration-75 ease-out`}
            style={{ height: `${barHeights[i]}px` }}
          ></div>
        ))}
      </div>

      <div className="text-center w-full mt-4">
        <h3 className="text-lg font-semibold text-gray-800 animate-pulse">{songTitle}</h3>
      </div>
      
      <div className="flex items-center w-full mt-4">
        <button onClick={toggleMute} className="text-gray-600 mr-2">
          {isMuted ? <SpeakerXMarkIcon className="w-6" /> : <SpeakerWaveIcon className="w-6" />}
        </button>

        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolume}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300"
        />
      </div>
      <audio ref={audioRef} src={streamUrl} />
    </div>
  );
}