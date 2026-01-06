// app/suscribite/layout.tsx
import React, { ReactNode } from 'react';

export const metadata = {
  title: 'Suscribite · Radio Empresarial',
  description: 'Redirigiendo al Newsletter de Radio Empresarial',
  // Evitar indexación para esta ruta (opcional y recomendado)
  robots: {
    index: false,
    follow: true,
  },
};

export default function SuscribiteLayout({ children }: { children: ReactNode }) {
  return (
    // Contenedor full-viewport específico para /suscribite
    <div
      id="suscribite-layout"
      style={{
        minHeight: '100vh',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Fondo en degradé acorde al diseño oscuro de la radio
        background: 'linear-gradient(180deg,#051026 0%, #0b1626 100%)',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* children será la page interstitial */}
      {children}
    </div>
  );
}
