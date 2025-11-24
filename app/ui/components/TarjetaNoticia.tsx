import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// Importamos la interfaz centralizada para garantizar la seguridad de tipos.
import { Noticia } from '@/app/lib/db';
import '../../fonts.css';

// La función auxiliar para limpiar HTML sigue siendo útil por si el excerpt contiene formato.
function stripHtml(html: string = ''): string {
  return String(html || '').replace(/<\/?[^>]+(>|$)/g, '');
}

// --- COMPONENTE DE TARJETA REFACTORIZADO ---

// Usamos la interfaz Noticia en lugar de `any` para tipar las props.
export default function TarjetaNoticia({ post }: { post: Noticia }) {
  // --- Paso 1: Verificación de seguridad ---
  if (!post || !post.slug) {
    return null;
  }

  // --- Paso 2: Extracción de datos usando la nueva estructura ---
  const { title, slug, categories, sourceUrl, excerpt } = post;
  const urlNoticia = `/Categorias/Noticias/${slug}`;

  // Se obtiene la primera categoría para mostrarla como etiqueta.
  const category = categories?.nodes?.[0];

  // La variable `imageUrl` puede ser string o undefined, según la interfaz Noticia.
  const imageUrl = sourceUrl;

  // Limpiamos el excerpt para asegurar que no se cuele HTML y lo recortamos.
  const cleanExcerpt =
    stripHtml(excerpt || '').substring(0, 120) +
    ((excerpt || '').length > 120 ? '...' : '');

  // --- Paso 3: Renderizado del componente ---
  return (
    <article className="group flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={urlNoticia} className="no-underline flex flex-col flex-grow">

        {/* SECCIÓN DE LA IMAGEN */}
        <div className="relative">
          <div className="w-full h-56 relative bg-gray-100">
            {/* CORRECCIÓN: Renderizado condicional para manejar el caso de `imageUrl` undefined. */}
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

        {/* SECCIÓN DEL CONTENIDO TEXTUAL */}
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors">
            {title}
          </h2>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {cleanExcerpt}
          </p>

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
