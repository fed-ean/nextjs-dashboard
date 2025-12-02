// app/ui/Page_Index/Sidenav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import type { Category, MappedPost } from '@/app/lib/definitions';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface Props {
  categories: Category[];
  latestPosts: MappedPost[]; // MappedPost según definitions.ts
}

export default function Sidenav({ categories, latestPosts }: Props) {
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h4 className="font-semibold mb-3">Últimas noticias</h4>
        <div className="space-y-3">
          {latestPosts.map((p) => (
            <div key={p.slug} className="flex gap-3">
              <Link href={`/Noticias/${p.slug}`} className="shrink-0">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-16 h-12 object-cover rounded" />
                ) : (
                  <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Sin imagen</div>
                )}
              </Link>
              <div>
                <Link href={`/Categorias/Noticias/${p.slug}`} className="font-medium line-clamp-2">
                  {p.title}
                </Link>
                {/* Si hay fecha */}
                {p.date && (
                  <div className="text-xs text-gray-500 mt-1">
                    {format(parseISO(p.date), "d 'de' MMMM, yyyy", { locale: es })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h4 className="font-semibold mb-3">Categorías</h4>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/Categorias/${c.slug}`} className="block py-2 px-2 rounded hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span>{c.name}</span>
                  {typeof c.count !== 'undefined' && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{c.count}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
