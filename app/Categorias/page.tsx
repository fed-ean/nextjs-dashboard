// app/Categorias/page.tsx
import { obtenerNoticias } from '../lib/db';
import NoticiasVarias from '../ui/Page_Index/noticias-varias';

export default async function NoticiasPage() {
  let noticias = [];
  let error = null;

  try {
    // Se asume que obtenerNoticias es la forma principal de obtener noticias y que puede fallar.
    noticias = await obtenerNoticias({ limit: 21 });
  } catch (e: any) {
    console.error("No se pudo obtener las noticias para la página de Categorías:", e);
    // Establece un mensaje de error amigable para el usuario
    error = "No se pudieron cargar las noticias en este momento. Por favor, inténtelo de nuevo más tarde.";
  }

  if (error) {
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4">Error al Cargar Contenido</h1>
            <p className="text-red-500">{error}</p>
            <p className="mt-4">Esto puede deberse a un problema de conexión con nuestros servidores. El equipo técnico ya ha sido notificado.</p>
        </div>
    );
  }

  if (noticias.length === 0) {
      return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4">No hay noticias disponibles</h1>
            <p>No se encontraron noticias para mostrar en este momento.</p>
        </div>
      )
  }

  // Se mantiene la lógica original de cortar el array
  const demasNoticias = noticias.slice(3);

  return (
    <>
        <h1 className="mb-5">Noticias</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 px-4">
            {demasNoticias.map(noticia => (
              <NoticiasVarias key={noticia.id} noticia={noticia} />
            ))}
          </div>
      </>
  );
}
