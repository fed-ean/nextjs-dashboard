// app/ui/Page_Index/ultimas-noticias-sidenav.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/app/lib/definitions'; // 1. IMPORTAR TIPO CENTRALIZADO

// 2. ELIMINAR TIPO LOCAL `Noticia`

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

// 3. USAR `Post[]` EN LAS PROPS
export default function UltimasNoticiasSidenav({ noticias }: { noticias: Post[] }) {
  if (!noticias || noticias.length === 0) {
    return <p className="p-4 text-gray-400">No hay noticias recientes.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
        Últimas publicaciones
      </h3>
      <div className="space-y-4">
        {noticias.map((noticia) => {
          // 4. USAR LAS PROPIEDADES DEL TIPO `Post`
          const title = noticia.title || 'Sin título';
          const imageUrl = noticia.featuredImage?.node?.sourceUrl;
          const urlNoticia = `/Categorias/Noticias/${noticia.slug || ''}`;
          const formattedDate = formatDate(noticia.date);

          return (
            <Link
              key={noticia.databaseId} // USAR `databaseId`
              href={urlNoticia}
              className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Imagen Miniatura */}
              <div className="flex-shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl} // USAR `imageUrl`
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
                     <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m3 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z"></path></svg>
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
