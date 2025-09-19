import './global.css';
import ScrollToTopButton from './ui/scrollBoton';
import NavBar from './ui/dashboard/navbar';
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
        </body>
    </html>
  );
}
