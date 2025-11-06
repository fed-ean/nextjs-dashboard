import './global.css';
import './fonts.css';
import { Suspense } from 'react';
import ScrollToTopButton from './ui/scrollBoton';
import NavBar from './ui/Page_Index/navbar';
import Footer from './ui/Page_Index/footer';
import UltimasNoticiasLoader from './ui/Page_Index/ultimas-noticias-loader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Correctly define the newsComponent in the Server Component
  const newsComponent = (
    <Suspense fallback={<div className="p-4 text-gray-400">Cargando noticias...</div>}>
      <UltimasNoticiasLoader />
    </Suspense>
  );

  return (
    <html lang="es">
      <body>
        <header>
          {/* Pass the server-rendered component as a prop to the Client Component */}
          <NavBar newsComponent={newsComponent} />
        </header>
        <div className="pt-40">
          {children}
        </div>
        <ScrollToTopButton/>
        <Footer />
      </body>
    </html>
  );
}
