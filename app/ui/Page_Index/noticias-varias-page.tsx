// ui/Page_Index/noticias-varias-estilizada.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type Category = {
  name?: string;
  slug?: string;
  databaseId?: string | number;
};

type Noticia = {
  slug?: string;
  titulo?: string; 
  title?: string;
  imagenUrl?: string;
  excerpt?: string;
  fecha?: string; // iso o texto
  categories?: { nodes?: Category[] } | Category[] | string[];
  [k: string]: any;
};

export default function NoticiasVariasEstilizada({ noticia }: { noticia: Noticia }) {
  if (!noticia) return null;

  const title = noticia.titulo || noticia.title || 'Sin título';
  const urlNoticia = `/Categorias/Noticias/${noticia.slug || ''}`;
  const categories: Category[] = (noticia.categories?.nodes as Category[]) || (noticia.categories as Category[]) || [];
  const firstCat = categories[0];
  const categoryName = firstCat?.name || (typeof firstCat === 'string' ? firstCat : null);
  const fecha = noticia.fecha ? new Date(noticia.fecha).toLocaleDateString() : null;

  return (
    <article className="group">
      <Link href={urlNoticia} className="block no-underline" aria-label={title}>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-transform transform-gpu group-hover:scale-[1.02] duration-300">
          {/* CONTENEDOR PARA IMAGEN (responsive) */}
          <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 */}
            {noticia.imagenUrl ? (
              <Image
                src={noticia.imagenUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover rounded-2xl"
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 rounded-2xl">
                Sin imagen
              </div>
            )}

            {/* OVERLAY DEGRADADO */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

            {/* BADGE DE CATEGORÍA */}
            {categoryName && (
              <span className="absolute left-3 top-3 z-10 inline-block bg-white/90 text-xs font-semibold px-3 py-1 rounded-full shadow-sm backdrop-blur">
                {categoryName}
              </span>
            )}

            {/* FECHA pequeña arriba derecha */}
            {fecha && (
              <time className="absolute right-3 top-3 z-10 text-xs text-white/90 bg-black/40 px-2 py-1 rounded-md backdrop-blur">
                {fecha}
              </time>
            )}
          </div>

          {/* CONTENIDO INFERIOR */}
          <div className="p-4 bg-white rounded-b-2xl">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>

            {noticia.excerpt && (
              <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-3">
                {noticia.excerpt}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-blue-600 font-medium underline decoration-1">Leer más</span>
              <div className="text-xs text-gray-500">
                {/* ejemplo: cantidad de comentarios o lectura estimada; opcional */}
                {noticia.readTime ? `${noticia.readTime} min` : null}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
