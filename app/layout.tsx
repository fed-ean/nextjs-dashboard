// app/layout.tsx
import type { Metadata } from "next";
import { Alegreya_Sans } from "next/font/google";
import "./global.css";
import NavBar from "@/app/ui/Page_Index/navbar";
import EnVivoLayout from "@/app/ui/EnVivoLayout";
import Footer from "@/app/ui/Page_Index/footer"; // Importamos el Footer

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
    <html lang="es" className="h-full">
      <body className={`${alegreyaSans.variable} font-sans antialiased flex flex-col h-full`}>
        <EnVivoLayout />
        <NavBar />
        {/* SOLUCIÓN: Añadimos padding-top para compensar la altura del Navbar pegajoso */}
        <main className="flex-grow pt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
