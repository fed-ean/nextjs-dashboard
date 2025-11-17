import './global.css';
import './fonts.css';
import { Suspense } from 'react';
import ScrollToTopButton from './ui/scrollBoton';
import NavBar from './ui/Page_Index/navbar';
import Footer from './ui/Page_Index/footer';
import UltimasNoticiasLoader from './ui/Page_Index/ultimas-noticias-loader';
import ReproductorMovil from './ui/ReproductorMovil';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newsComponent = (
    <Suspense fallback={<div className="p-4 text-gray-400">Cargando noticias...</div>}>
      <UltimasNoticiasLoader />
    </Suspense>
  );

  return (
    <html lang="es">
      <body>
        <ReproductorMovil />
        <header>
          <NavBar newsComponent={newsComponent} />
        </header>
        <div className="pt-32 lg:pt-52">
          {children}
        </div>
        <ScrollToTopButton/>
        <Footer />
      </body>
    </html>
  );
}
