'use client';
import React from 'react';

type AdPlaceholderProps = {
  id?: string; // id único
  slot?: string; // valor que usarás luego como data-ad-slot
  label?: string; // texto visible
  size?: 'responsive' | 'leaderboard' | 'medium' | 'square' | 'small';
  className?: string;
  style?: React.CSSProperties;
};

const sizeMap = {
  responsive: 'w-full h-[100px] sm:h-[120px]',
  leaderboard: 'w-full h-[90px]',
  medium: 'w-full sm:w-[300px] h-[250px]',
  square: 'w-[250px] h-[250px]',
  small: 'w-[120px] h-[60px]',
};

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  id,
  slot,
  label = 'Espacio publicitario (Google Ads — reemplazar cuando esté aprobado)',
  size = 'responsive',
  className = '',
  style = {},
}) => {
  return (
    <div
      id={id}
      role="complementary"
      aria-label={label}
      data-ad-slot={slot || ''}
      className={`ad-placeholder border-2 border-dashed border-gray-300 rounded-md bg-white/80 flex items-center justify-center text-center text-xs text-gray-600 p-2 ${sizeMap[size]} ${className}`}
      style={style}
    >
      <div>
        <div className="font-medium text-sm mb-1">{label}</div>
        <div className="text-[11px] text-gray-400">
          Tamaño: <span className="font-mono">{size}</span>
        </div>
        {slot && <div className="text-[10px] mt-1 text-gray-300">slot: {slot}</div>}
      </div>
      <style jsx>{`
        .ad-placeholder {
          min-width: 120px;
          min-height: 60px;
        }
      `}</style>
    </div>
  );
};

export default AdPlaceholder;
