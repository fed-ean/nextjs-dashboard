import './global.css';
import './fonts.css';
import ScrollToTopButton from './ui/scrollBoton';
import NavBar from './ui/Page_Index/navbar';
import RadioPlayer from './ui/Reproductor';
import AlAireRadio from './ui/AlAireRadio';
import Footer from './ui/Page_Index/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header>
          <NavBar/>
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
