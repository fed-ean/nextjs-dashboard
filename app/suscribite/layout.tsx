// app/suscribite/layout.tsx
import React, { ReactNode } from 'react';

export const metadata = {
  title: 'Suscribite · Radio Empresarial',
  description: 'Redirigiendo al Newsletter de Radio Empresarial',
  robots: { index: false, follow: true },
};

export default function SuscribiteLayout({ children }: { children: ReactNode }) {
  // Este layout sólo provee el contenedor; la página será un overlay fijo.
  return (
    <div style={{ minHeight: '100vh', margin: 0 }}>
      {children}
    </div>
  );
}
