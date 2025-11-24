// app/ui/Page_Index/ReporteInternacional.server.tsx

import { obtenerNoticiasPorCategoria, Noticia } from '@/app/lib/db';
import ReporteInternacional from './ReporteInternacional'; // Importamos el componente cliente

/**
 * Este es un Componente de Servidor de React.
 * Su única responsabilidad es obtener los datos (data-fetching) y
 * pasarle esos datos al componente cliente para su renderización.
 */
export default async function ReporteInternacionalServer() {
  const noticias: Noticia[] = await obtenerNoticiasPorCategoria({
    limit: 4,
    categoryName: "Internacional",
  });

  // Si no hay suficientes noticias, no renderizamos la sección.
  if (!noticias || noticias.length < 4) {
    return null;
  }

  // Le pasamos las noticias obtenidas al componente cliente, que se encargará de la UI.
  return <ReporteInternacional noticias={noticias} />;
}
