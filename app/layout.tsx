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
