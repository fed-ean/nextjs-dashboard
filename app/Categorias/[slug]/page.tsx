import React from 'react';
import { getCachedPostsPage } from '../../lib/data-fetcher';
import CategoryGrid from '../../ui/categorias/CategoryGrid';

type Props = {
  params: Promise<{ slug: string }>;
};

// Esta página ahora solo se preocupa por mostrar el contenido de SU categoría.
export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  // Solo obtenemos los datos necesarios para esta página.
  const { posts, category } = await getCachedPostsPage(slug);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-2">{category?.name ?? slug}</h1>
        <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 border-b pb-2">
        Categoría: <span className="text-blue-600">{category?.name ?? slug}</span>
      </h1>
      <CategoryGrid posts={posts} currentSectionSlug={slug} />
    </div>
  );
}
