import './global.css';
import ScrollToTopButton from './ui/scrollBoton';
import NavBar from './ui/dashboard/navbar';
import RadioPlayer from './ui/Reproductor';
import Footer from './ui/dashboard/footer';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <NavBar/>
        <div>
          {children}
        </div>
        <ScrollToTopButton/>
        <div></div>
        <Footer />
        </body>
    </html>
  );
}
