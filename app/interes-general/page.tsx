import React from 'react';
import { getCachedPostsPage } from '../lib/data-fetcher';
import CategoryGrid from '../ui/categorias/CategoryGrid';
import CategoryPagination from '../ui/categorias/CategoryPagination';

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-4">Error al cargar</h1>
    <p className="text-red-500">{message}</p>
  </div>
);

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold">No hay publicaciones</h1>
  </div>
);

export default async function InteresGeneralPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page || 1);

  const { posts, totalPages, error } = await getCachedPostsPage(null);

  if (error) return <ErrorDisplay message={error} />;
  if (!posts?.length) return <NoPostsDisplay />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Interés General</h1>

      <CategoryGrid posts={posts} currentSectionSlug="interes-general" />

      <div className="mt-8">
        <CategoryPagination
          basePath="/interes-general"
          current={page}
          totalPages={totalPages}
          perPage={9}
        />
      </div>
    </div>
  );
}
