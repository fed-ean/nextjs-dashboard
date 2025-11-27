// app/layout.tsx
import type { Metadata } from "next";
import { Alegreya_Sans } from "next/font/google";
import "./global.css";

import NavBar from "@/app/ui/Page_Index/navbar";
import EnVivoLayout from "@/app/ui/EnVivoLayout";
import Footer from "@/app/ui/Page_Index/footer";

const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-alegreya-sans",
});

export const metadata: Metadata = {
  title: "Radio Empresarial",
  description: "La voz del empresario y el emprendedor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${alegreyaSans.variable} font-sans antialiased`}>
        {/* Contenedor para los elementos de navegación fijos */}
        <div>
          <EnVivoLayout />
          <NavBar />
        </div>

        {/* 
          SOLUCIÓN GLOBAL DEFINITIVA:
          El <main> aplica un padding-top que utiliza las variables CSS globales.
          Esto empuja todo el contenido de la página hacia abajo, resolviendo el 
          problema de superposición de forma centralizada y definitiva.
        */}
        <main className="pt-[var(--navbar-height-mobile)] lg:pt-[var(--navbar-height-desktop)]">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
