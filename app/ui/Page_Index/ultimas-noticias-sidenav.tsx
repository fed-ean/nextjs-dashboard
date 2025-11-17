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
    <div className="p-4">
      <h3 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wider">
        Últimas publicaciones
      </h3>
      <div className="space-y-4">
        {noticias.map((noticia) => {
          const title = noticia.titulo || noticia.title || 'Sin título';
          const urlNoticia = `/Categorias/Noticias/${noticia.slug || ''}`;
          const formattedDate = formatDate(noticia.fecha);

          return (
            <Link
              key={noticia.id}
              href={urlNoticia}
              className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Imagen Miniatura */}
              <div className="flex-shrink-0">
                {noticia.imagenUrl ? (
                  <Image
                    src={noticia.imagenUrl}
                    alt={title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m-4 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>

              {/* Contenido de Texto */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-3 group-hover:text-blue-600">
                  {title}
                </h4>
                {formattedDate && (
                  <div className="flex items-center mt-1.5 text-xs text-gray-500">
                    <span className="mr-1.5">⌚</span>
                    <time>{formattedDate}</time>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
