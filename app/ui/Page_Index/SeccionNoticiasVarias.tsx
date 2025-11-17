import { obtenerNoticias } from '@/app/lib/db.js';
// Se importa el nuevo componente unificado desde su nueva ubicación
import TarjetaNoticia from '@/app/ui/components/TarjetaNoticia.tsx';

export default async function SeccionNoticiasVarias() {
  // Se obtienen las noticias de la misma forma
  const noticias = await obtenerNoticias({ limit: 6, offset: 4 });

  // El bloque que maneja el caso de que no haya noticias permanece igual
  if (!noticias || noticias.length === 0) {
    return (
      <section className="py-12 bg-transparent px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 font-alegreya-extrabold">Más Noticias</h2>
        <p className="text-center text-gray-500 py-10">No hay noticias para mostrar.</p>
      </section>
    );
  }

  // Se renderiza la sección, ahora utilizando el componente unificado
  return (
    <section className="py-12 bg-transparent px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 font-alegreya-extrabold">Más Noticias</h2>
      
      {/* Se crea la cuadrícula que contendrá las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Se itera sobre las noticias y por cada una se renderiza el componente TarjetaNoticia */}
        {/* Nota: El componente unificado espera una prop llamada `post` */}
        {noticias.map((noticia) => (
          <TarjetaNoticia key={noticia.databaseId || noticia.slug} post={noticia} />
        ))}
      </div>

    </section>
  );
}
