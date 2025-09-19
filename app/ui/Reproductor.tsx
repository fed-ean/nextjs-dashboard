"use client";

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import RadioPlayerUI from './ReproductorUI';

const RadioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const streamUrl = 'https://ohradio.cc/8310/stream';
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  return (
    <>
      <RadioPlayerUI
        playing={playing}
        volume={volume}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
      />

      <ReactPlayer
        ref={playerRef}
        src={streamUrl}
        playing={playing}
        width="0"
        height="0"
        volume={volume}
      />
    </>
  );
};

export default RadioPlayer;