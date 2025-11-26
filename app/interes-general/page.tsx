// app/interes-general/page.tsx
import React from 'react';
import { getCachedPostsPage } from '../lib/data-fetcher';
import CategoryGrid from '../ui/categorias/CategoryGrid';
import CategoryPagination from '../ui/categorias/CategoryPagination';
export const dynamic = 'force-dynamic';


const PER_PAGE = 9;

type SearchParamsShape = { [key: string]: string | string[] | undefined };

// Tipado compatible con Next 15: searchParams es Promise<...>
type Props = {
  searchParams?: Promise<SearchParamsShape>;
};

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-4">Error al Cargar Contenido</h1>
    <p className="text-red-500">{message}</p>
    <p className="mt-4">Puede haber un problema de conexión. Por favor, inténtelo más tarde.</p>
  </div>
);

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
  </div>
);

export default async function InteresGeneralPage({ searchParams }: Props) {
  // Si no viene searchParams, await a Promise.resolve({})
  const resolvedSearchParams: SearchParamsShape = await (searchParams ?? Promise.resolve({}));

  const page = Math.max(1, Number(resolvedSearchParams?.page ?? 1));

  // Tu data-fetcher actual acepta solo 1 argumento (slug | null)
  const { posts, totalPages } = await getCachedPostsPage(null);

  if (!posts || posts.length === 0) {
    return <NoPostsDisplay />;
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
