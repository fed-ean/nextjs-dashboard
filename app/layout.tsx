// app/layout.tsx
import type { Metadata } from "next";
import { Alegreya_Sans } from "next/font/google";
import "./global.css";

import sponsorsList from "@/app/lib/sponsors";

import NavBar from "@/app/ui/Page_Index/navbar";
import EnVivoLayout from "@/app/ui/EnVivoLayout";
import Footer from "@/app/ui/Page_Index/footer";

import SponsorsBottomCarousel from "@/app/ui/SponsorsBottomCarousel";

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
        <EnVivoLayout />

        {/* -------------------------
            3) Navbar
           ------------------------- */}
        <NavBar />

        {/* -------------------------
            4) Main content
            - Añadimos padding-bottom SOLO en mobile para que el fixed bottom
              sponsor carousel no tape el contenido.
           ------------------------- */}
        <main
          className="
            pt-[var(--navbar-height-mobile)]
            lg:pt-[var(--navbar-height-desktop)]
            pb-[140px] lg:pb-0
          "
        >
          {children}
        </main>

        {/* -------------------------
            5) Footer
           ------------------------- */}
        <Footer />

        {/* -------------------------
            6) Sponsors carousel FIJO ABAJO — SOLO MOBILE
               - block lg:hidden => visible solo en pantallas pequeñas
               - pointer-events-auto permite interacción
           ------------------------- */}
        <div className="fixed bottom-0 left-0 w-full z-50 block lg:hidden pointer-events-auto">
          <SponsorsBottomCarousel
            sponsors={sponsorsList}
            visibleCount={4}
            autoSlideMs={3000}
            circleSize={80}
          />
        </div>
      </body>
    </html>
  );
}
