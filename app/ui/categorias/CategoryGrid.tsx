//app/ui/categorias/CategoryGrid.tsx
'use client';
import React from 'react';
import TarjetaNoticia from '../components/TarjetaNoticia';

export default function CategoryGrid({
  posts
}: {
  posts: any[];
  currentSectionSlug?: string;
}) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-12 text-gray-600">No hay noticias</div>;
  }

  return (
    <section className="container sm:px-6 lg:px-2">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {posts.map((p: any) => (
          <TarjetaNoticia
            key={p.databaseId || p.id || p.slug}
            post={p}
          />
        ))}
      </div>
    </section>
  );
}
