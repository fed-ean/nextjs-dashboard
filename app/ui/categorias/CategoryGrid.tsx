// components/CategoryGrid.tsx
'use client';
import React from 'react';
import NoticiasVariasEstilizada from './NoticiasCategorias';

export default function CategoryGrid({ posts, currentSectionSlug }: { posts: any[]; currentSectionSlug?: string }) {
  if (!posts || posts.length === 0) return <div className="text-center py-12 text-gray-600">No hay noticias</div>;
  return (
    <section className="container mx-auto px-6">
      {/* grid: 1 / 2 / 3 columnas, cards más grandes (gap mayor) */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {posts.map((p:any) => (
          <NoticiasVariasEstilizada key={p.databaseId || p.id || p.slug} noticia={p} currentSectionSlug={currentSectionSlug} />
        ))}
      </div>
    </section>
  );
}
