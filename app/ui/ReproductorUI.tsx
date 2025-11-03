"use client";

import React, { useState, useEffect } from 'react';

const RadioPlayerUI = ({ playing, volume, onPlayPause, onVolumeChange }) => {
  const [animationTrigger, setAnimationTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger(prev => prev + 0.1); 
    }, 40); // Animación más rápida para mayor fluidez
    return () => clearInterval(interval);
  }, []);

  const totalBars = 30; 
  const totalBlocks = 8; 

  return (
    <div className="flex items-center m-auto justify-center p-8 bg-blue-100 min-h-[180px] w-3/5 mt-4">
      <div className="flex items-center space-x-12 w-full max-w-7xl">
        
        <div className="flex flex-col items-center space-y-4"> 
          <button 
            onClick={onPlayPause} 
            className="relative flex items-center justify-center w-28 h-28 rounded-full bg-red-600 transition-all duration-300 transform hover:scale-105"
          >
            <div 
              className="w-0 h-0 border-t-[22px] border-b-[22px] border-l-[36px] border-solid border-t-transparent border-b-transparent border-l-white ml-2"
              style={{ display: playing ? 'none' : 'block' }}
            ></div>
            <div 
              className="w-[22px] h-[36px] flex items-center justify-between"
              style={{ display: playing ? 'flex' : 'none' }}
            >
              <div className="w-[8px] h-full bg-white rounded-full"></div>
              <div className="w-[8px] h-full bg-white rounded-full"></div>
            </div>
          </button>
          <h2 className="text-red-600 font-bold text-5xl tracking-wide uppercase">
            EN VIVO
          </h2>
        </div>
      
        <div className="flex-grow"></div>

        <div className="flex flex-col items-center space-y-4 w-full max-w-xl">
          
          <div className="flex items-end h-24 w-full space-x-1">
            {Array.from({ length: totalBars }).map((_, barIndex) => {
              // Altura armónica y dinámica basada en una onda sinusoidal y un componente aleatorio
              const waveValue = Math.sin((barIndex / totalBars) * Math.PI + animationTrigger) * (0.5 + Math.random() * 0.5); // Componente aleatorio para picos variables
              const barHeight = Math.abs(waveValue) * totalBlocks;
              return (
                <div key={barIndex} className="flex flex-col-reverse justify-start items-center space-y-1 h-full">
                  {Array.from({ length: totalBlocks }).map((_, blockIndex) => {
                    const blockIsActive = blockIndex < barHeight;
                    const blockColor = barIndex < (totalBars / 2) ? 'bg-red-600' : 'bg-purple-600';
                    return (
                      <div
                        key={blockIndex}
                        className={`w-3 h-3 ${blockIsActive ? blockColor : 'bg-transparent'} rounded-sm`}
                      ></div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 w-full justify-center">
            <span className="text-sm font-bold text-gray-700">Volumen</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer flex-grow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayerUI;