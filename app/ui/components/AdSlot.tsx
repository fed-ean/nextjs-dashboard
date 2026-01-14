// app/ui/components/AdSlot.tsx
'use client';

import React, { useEffect, useState } from 'react';
import AdPlaceholder from './AdPlaceholder';

type AdSlotProps = {
  id?: string;
  slot?: string;
  label?: string;
  // permitir elegir tipo si querés en el futuro
  variant?: 'leaderboard' | 'responsive' | 'medium';
};

export default function AdSlot({
  id,
  slot,
  label = 'Espacio publicitario — placeholder (Google Ads)',
  variant = 'leaderboard',
}: AdSlotProps) {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    // Lógica para controlar si mostrar placeholders:
    // 1) Variable de entorno NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS (build-time, visible en cliente)
    // 2) Override temporal por localStorage para pruebas: localStorage.setItem('showAds','true')
    const envFlag = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS : undefined;
    const local = typeof window !== 'undefined' ? window.localStorage.getItem('showAds') : null;

    const enabled = envFlag === 'true' || local === 'true';
    setShow(enabled);
  }, []);

  if (!show) return null;

  // Estilos para simular un leaderboard ancho y centrado (máx 970px)
  return (
    <div id={id} className="w-full flex justify-center my-4 px-4">
      <div className="w-full max-w-[970px]">
        <AdPlaceholder
          id={id ? `${id}-placeholder` : undefined}
          slot={slot}
          label={label}
          size={variant === 'medium' ? 'medium' : variant === 'responsive' ? 'responsive' : 'leaderboard'}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
