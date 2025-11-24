import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import { Noticia } from '@/app/lib/db';
import '../../fonts.css';

// --- COMPONENTE DE TARJETA MODIFICADO ---
// Se ha eliminado el texto del excerpt según lo solicitado.

export default function TarjetaNoticia({ post }: { post: Noticia }) {
  // --- Paso 1: Verificación de seguridad ---
  if (!post || !post.slug) {
    return null;
  }

  // --- Paso 2: Extracción de datos (sin el excerpt) ---
  const { title, slug, categories, sourceUrl } = post;
  const urlNoticia = `/Categorias/Noticias/${slug}`;

  const category = categories?.nodes?.[0];
  const imageUrl = sourceUrl;

  // --- Paso 3: Renderizado del componente (sin el excerpt) ---
  return (
    <article className="group flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={urlNoticia} className="no-underline flex flex-col flex-grow">

        {/* SECCIÓN DE LA IMAGEN */}
        <div className="relative">
          <div className="w-full h-56 relative bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title || 'Imagen de la noticia'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-sm">Sin Imagen</span>
              </div>
            )}
          </div>

          {/* Etiqueta de la categoría sobre la imagen */}
          {category?.name && (
            <div className="absolute bottom-3 left-3">
              <span className="text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm bg-indigo-600 bg-opacity-90">
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* SECCIÓN DEL CONTENIDO TEXTUAL (MODIFICADA) */}
        <div className="p-6 flex flex-col flex-grow">
          {/* El título ahora ocupa el espacio que antes tenía el excerpt */}
          <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors flex-grow">
            {title}
          </h2>

          {/* La <p> con el excerpt ha sido eliminada. */}

          <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span>by RadioEmpresarial</span>
            <span className="font-semibold tracking-wider text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
              LEER MÁS &rarr;
            </span>
          </div>
        </div>

      </Link>
    </article>
  );
}
