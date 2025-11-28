export const dynamic = "force-dynamic";

import React from "react";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";

const PER_PAGE = 9;

// NEXT 15 — params y searchParams SON PROMESAS
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CategoryPage(props: Props) {
  // ⬇️ Desempaquetamos promesas (obligatorio en Next 15)
  const { slug } = await props.params;
  const search = await props.searchParams;

  const page = Number(search?.page ?? 1);

  // Llamada correcta al fetch paginado
  const { posts, totalPages } = await getCachedPostsPage(slug, page, PER_PAGE);

  // Si no hay posts → mostrar mensaje
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">
          Todavía no se ha publicado ningún artículo en esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        {slug.replace("-", " ").toUpperCase()}
      </h1>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <div className="mt-8">
        <CategoryPagination
          basePath={`/Categorias/${slug}`}
          current={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
