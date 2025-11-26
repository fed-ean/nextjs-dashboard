// app/layout.tsx
import type { Metadata } from "next";
import { Alegreya_Sans } from "next/font/google";
import "./global.css";
import dynamic from "next/dynamic";

// ⛔ IMPORTANTE: los cargamos sin SSR
const NavBar = dynamic(() => import("@/app/ui/Page_Index/navbar"), { ssr: false });
const EnVivoLayout = dynamic(() => import("@/app/ui/EnVivoLayout"), { ssr: false });
const Footer = dynamic(() => import("@/app/ui/Page_Index/footer"), { ssr: false });

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
    <html lang="es" className="h-full">
      <body className={`${alegreyaSans.variable} font-sans antialiased flex flex-col h-full`}>
        <EnVivoLayout />
        <NavBar />

        <main className="flex-grow pt-28">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
