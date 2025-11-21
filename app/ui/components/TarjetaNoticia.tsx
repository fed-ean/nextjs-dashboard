import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import '../../fonts.css';

// --- FUNCIONES DE AYUDA ---

// Limpia las etiquetas HTML de un string para mostrar texto plano.
function stripHtml(html: string = ''): string {
  return String(html || '').replace(/<\/?[^>]+(>|$)/g, '');
}

// Extrae la primera URL de imagen del contenido HTML si no hay imagen destacada.
function extractImageUrl(content?: string): string | null {
  if (!content) return null;
  const match = content.match(/<img.*?src=['"](.*?)['"]/);
  return match ? match[1] : null;
}

// --- COMPONENTE DE TARJETA ---

export default function TarjetaNoticia({ post }: { post: any }) {
  // --- Paso 1: Verificación de seguridad ---
  if (!post || !post.slug) {
    return null; // No renderizar nada si el post no es válido.
  }

  // --- Paso 2: Extracción y limpieza de datos ---
  const title = post.title || 'Sin título';
  const urlNoticia = `/Categorias/Noticias/${post.slug}`;

  // Se obtiene la primera categoría para mostrarla como etiqueta.
  const category = post.categories?.nodes?.[0];

  // Se busca la imagen destacada; si no existe, se busca en el contenido del post.
  const imageUrl =
    post.featuredImage?.node?.sourceUrl ||
    extractImageUrl(post.content);

  // Se limpia el 'excerpt' de HTML y se recorta para una vista previa.
  const cleanExcerpt =
    stripHtml(post.excerpt || '').substring(0, 120) +
    (post.excerpt?.length > 120 ? '...' : '');

  // --- Paso 3: Renderizado del componente ---
  return (
    <article className="group flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={urlNoticia} className="no-underline flex flex-col flex-grow">

        {/* SECCIÓN DE LA IMAGEN */}
        <div className="relative">
          <div className="w-full h-56 relative bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">Sin Imagen</span>
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
          {/* Título de la noticia */}
          <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors">
            {title}
          </h2>

          {/* Extracto limpio y recortado */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {cleanExcerpt}
          </p>

          {/* Pie de la tarjeta */}
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
