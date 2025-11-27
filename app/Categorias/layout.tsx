import React from "react";

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  // Este layout ya no impone una estructura de Sidenav ni un contenedor con ancho máximo.
  // Permite que las páginas hijas (como la de la noticia) controlen su propio layout,
  // lo cual es necesario para el diseño de banner de ancho completo.
  return <>{children}</>;
}
