// app/programas/varias/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import CategoryGrid from "../../ui/categorias/CategoryGrid";

const PER_PAGE = 9;

export default async function VariasPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page || 1);

  // Use the corrected function and pass null to fetch all posts
  const { posts, total, totalPages } = await getCachedPostsPage(
    null,
    page,
    PER_PAGE
  );

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">
          Todavía no se ha publicado ningún artículo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Varias</h1>

      <CategoryGrid
        posts={posts}
        currentSectionSlug="programas/varias"
        showCategory={true}
      />

      <div className="mt-8">
        <CategoryPagination
          basePath={`/programas/varias`}
          current={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}