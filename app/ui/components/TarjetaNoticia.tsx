// app/ui/components/TarjetaNoticias.tsx
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import { Noticia } from '@/app/lib/db';
import '../../fonts.css';

export default function TarjetaNoticia({ post }: { post: Noticia }) {
  if (!post || !post.slug) {
    return null;
  }

  const { title, slug, categories } = post;
  const urlNoticia = `/Categorias/Noticias/${slug}`;

  const imageUrl =
    post.featuredImage?.node?.sourceUrl || (post as any).sourceUrl;

  // 🎨 GENERADOR DE COLORES POR CATEGORÍA
  const getColorForCategory = (name: string) => {
    const colors = [
      "bg-indigo-600",
      "bg-blue-600",
      "bg-emerald-600",
      "bg-rose-600",
      "bg-purple-600",
      "bg-orange-600",
      "bg-yellow-600 text-black",
      "bg-teal-600",
      "bg-pink-600",
      "bg-red-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <article className="group flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={urlNoticia} className="no-underline flex flex-col flex-grow">

        {/* IMAGEN */}
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

          {/* ⭐ TODAS LAS CATEGORÍAS (COLORES AUTOMÁTICOS) */}
          {categories?.nodes && categories.nodes.length > 0 && (
            <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
              {categories.nodes.map((cat: any) => (
                <span
                  key={cat.id || cat.slug}
                  className={`text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm bg-opacity-90 ${getColorForCategory(cat.name)}`}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors flex-grow">
            {title}
          </h2>

          {/* FOOTER */}
          <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span>by RadioEmpresarial</span>
            <span className="font-semibold tracking-wider text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
              LEER MÁS →
            </span>
          </div>
        </div>

      </Link>
    </article>
  );
}
