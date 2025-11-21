'use client';
import React from 'react';
import TarjetaNoticia from '../components/TarjetaNoticia';

export default function CategoryGrid({
  posts,
  currentSectionSlug
}: {
  posts: any[];
  currentSectionSlug?: string;
}) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-12 text-gray-600">No hay noticias</div>;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {posts.map((p: any) => (
          <TarjetaNoticia
            key={p.databaseId || p.id || p.slug}
            post={p}
            currentCategorySlug={currentSectionSlug}
          />
        ))}
      </div>
    </section>
  );
}
