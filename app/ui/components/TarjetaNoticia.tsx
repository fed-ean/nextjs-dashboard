import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import { Noticia } from '@//app/lib/db';
import '../../fonts.css';

export default function TarjetaNoticia({ post }: { post: Noticia }) {
  if (!post || !post.slug) {
    return null;
  }

  const { title, slug, categories } = post;
  const urlNoticia = `/Categorias/Noticias/${slug}`;

  // Imagen segura
  const imageUrl =
    post.featuredImage?.node?.sourceUrl || (post as any).sourceUrl;

  // Categorías seguras
  const categoryNodes = categories?.nodes ?? [];

  const getColorForName = (name: string) => {
    const colors = [
      "bg-indigo-600",
      "bg-blue-600",
      "bg-emerald-600",
      "bg-rose-600",
      "bg-purple-600",
      "bg-orange-500",
      "bg-yellow-400 text-black",
      "bg-teal-600",
      "bg-pink-500",
      "bg-red-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <article className="group flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={urlNoticia} className="no-underline flex flex-col flex-grow">

        <div className="relative">
          <div className="w-full h-56 relative bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title || 'Imagen de la noticia'}
                fill
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-sm">Sin Imagen</span>
              </div>
            )}
          </div>

          {/* Todas las categorías — seguro, no rompe SSR */}
          {categoryNodes.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 max-w-[85%]">
              {categoryNodes.map((c: any) => (
                <span
                  key={c?.databaseId ?? c?.slug ?? c?.name}
                  className={`text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm ${getColorForName(
                    c?.name ?? "categoria"
                  )}`}
                >
                  {c?.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-700 transition-colors flex-grow">
            {title}
          </h2>

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
