import './global.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div>
          {children}
        </div>
        </body>
    </html>
  );
}
