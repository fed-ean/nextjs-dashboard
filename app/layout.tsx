// app/layout.tsx
import type { Metadata } from "next";
import { Alegreya_Sans } from "next/font/google";
import "./global.css";

import sponsorsList from "@/app/lib/sponsors";

import NavBar from "@/app/ui/Page_Index/navbar";
import EnVivoLayout from "@/app/ui/EnVivoLayout";
import Footer from "@/app/ui/Page_Index/footer";

import SponsorsDrawer from "@/app/ui/SponsorsDrawer";
import SponsorsFullWidthCarousel from "@/app/ui/SponsorsFullWidthCarousel";

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

        {/* REPRODUCTOR EN VIVO ARRIBA */}
        <EnVivoLayout />

        {/* NAVBAR */}
        <NavBar />

        {/* 
          PADDING BOTTOM SOLO PARA MOBILE
          Así el carrusel de sponsors no tapa nada.
        */}
        <main className="
          pt-[var(--navbar-height-mobile)] 
          lg:pt-[var(--navbar-height-desktop)]
          pb-[150px] lg:pb-0   /* SOLO mobile tiene espacio abajo */
        ">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

        {/* 
          CARRUSEL DE SPONSORS FIJO SOLO EN MOBILE 
          hidden lg:block  → eso era para desktop
          Ahora hacemos AL REVÉS:
          block lg:hidden → SOLO mobile
        */}
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-xl block lg:hidden">
          <SponsorsFullWidthCarousel
            sponsors={sponsorsList}
            height={110}
            autoSlideMs={3000}
          />
        </div>
      </body>
    </html>
  );
}
