// app/interes-general/page.tsx
import React from "react";
import { fetchAllPostsPaginated } from "../lib/data-fetcher"; // <-- CAMBIO DE IMPORTACIÓN
import CategoryPagination from "../ui/categorias/CategoryPagination";
import CategoryGrid from "../ui/categorias/CategoryGrid";

const PER_PAGE = 9;

export default async function InteresGeneralPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page || 1);

  // La llamada a la función ahora usa el nuevo nombre
  const { posts, total, totalPages } = await fetchAllPostsPaginated(
    page,
    PER_PAGE
  );

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
          basePath={`/interes-general`}
          current={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
