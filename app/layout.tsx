// app/layout.tsx
import type { Metadata } from "next";
import { Alegreya_Sans } from "next/font/google";
import "./global.css";

// Importamos la fuente con los pesos y subconjuntos que necesitamos
const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"], // Añadimos todos los grosores que podríamos necesitar
  variable: "--font-alegreya-sans", // La definimos como una variable CSS
});

export const metadata: Metadata = {
  title: "Radio Empresaria",
  description: "La voz del empresario y el emprendedor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* 
        Aplicamos la clase de la variable de la fuente al body.
        Esto, junto con la configuración de tailwind.config.ts, 
        hará que 'Alegreya Sans' sea la fuente por defecto en toda la web.
      */}
      <body className={`${alegreyaSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
