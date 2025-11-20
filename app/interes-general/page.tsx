// app/interes-general/page.tsx

import React from 'react';
import { getCachedPostsPage } from '../lib/data-fetcher';
import CategoryGrid from '../ui/categorias/CategoryGrid';
import CategoryPagination from '../ui/categorias/CategoryPagination';

const PER_PAGE = 9;

// ✅ Tipado correcto para Next 15
type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function InteresGeneralPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page ?? 1);

  const { posts, totalPages, error } = await getCachedPostsPage(null, page, PER_PAGE);

  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Error al Cargar Contenido</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Interés General</h1>

      <CategoryGrid posts={posts} currentSectionSlug="interes-general" />

      <div className="mt-8">
        <CategoryPagination
          basePath="/interes-general"
          current={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
