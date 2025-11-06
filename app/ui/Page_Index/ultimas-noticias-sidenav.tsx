// app/ui/Page_Index/ultimas-noticias-sidenav.tsx
import Link from 'next/link';
import Image from 'next/image';

type Noticia = {
  id: string;
  slug?: string;
  titulo?: string;
  title?: string;
  imagenUrl?: string;
  fecha?: string;
  [k: string]: any;
};

// Función para formatear la fecha
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function UltimasNoticiasSidenav({ noticias }: { noticias: Noticia[] }) {
  if (!noticias || noticias.length === 0) {
    return <p className="p-4 text-gray-400">No hay noticias recientes.</p>;
  }

  return (
    <div className="p-4 border-t border-blue-800">
      <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">
        Últimas publicaciones
      </h3>
      <div className="space-y-3">
        {noticias.map((noticia) => {
          const title = noticia.titulo || noticia.title || 'Sin título';
          const urlNoticia = `/Categorias/Noticias/${noticia.slug || ''}`;
          const formattedDate = formatDate(noticia.fecha);

          return (
            <Link
              key={noticia.id}
              href={urlNoticia}
              className="relative group block w-full h-24 rounded-lg overflow-hidden shadow-lg"
            >
              {/* Imagen de fondo */}
              {noticia.imagenUrl ? (
                <Image
                  src={noticia.imagenUrl}
                  alt={title}
                  fill
                  sizes="150px"
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-700"></div>
              )}

              {/* Gradiente para legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Contenido de texto superpuesto */}
              <div className="absolute bottom-0 left-0 w-full p-2">
                <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-blue-300">
                  {title}
                </h4>
                {formattedDate && (
                  <time className="text-xs text-gray-300 mt-1 block">
                    {formattedDate}
                  </time>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
