// app/interes-general/page.tsx
import React from 'react';
import { getCachedPostsPage } from '../lib/data-fetcher'; // <-- 1. USANDO EL MÉTODO DE DATOS CORRECTO
import CategoryGrid from '../ui/categorias/CategoryGrid';
import CategoryPagination from '../ui/categorias/CategoryPagination';

// Componente para mostrar errores de forma elegante
const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Error al Cargar Contenido</h1>
        <p className="text-red-500">{message}</p>
        <p className="mt-4">Puede haber un problema de conexión. Por favor, inténtelo más tarde.</p>
    </div>
);

// Componente para cuando no hay publicaciones
const NoPostsDisplay = () => (
    <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
    </div>
);

export default async function InteresGeneralPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page || 1);

  // 2. SE LLAMA A LA FUNCIÓN CORRECTA PARA OBTENER TODOS LOS POSTS
  // Pasamos `null` para indicar que queremos todos los posts, no de una categoría específica.
  const { posts, totalPages, error } = await getCachedPostsPage(null);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!posts || posts.length === 0) {
    return <NoPostsDisplay />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Interés General</h1>

      {/* 3. SE RENDERIZA EL CONTENIDO OBTENIDO */}
      <CategoryGrid posts={posts} currentSectionSlug="interes-general" />

      {/* La paginación se mantiene, pero adaptada a la nueva función */}
      <div className="mt-8">
        <CategoryPagination
          basePath={`/interes-general`}
          current={page}
          totalPages={totalPages} // totalPages ahora viene de getCachedPostsPage
          perPage={9}
        />
      </div>
    </div>
  );
}
