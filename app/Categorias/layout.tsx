import SideNav from "../ui/dashboard/sidenav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Layout de Flexbox simple: dos columnas en desktop, una en móvil.
    // Toda la página se desplaza de forma natural con el scroll del navegador.
    <div className="flex flex-col md:flex-row">
      {/* Barra lateral con ancho definido */}
      <div className="w-full flex-none md:w-96">
        <SideNav />
      </div>

      {/* Contenido principal que ocupa el espacio restante */}
      <div className="flex-grow p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
