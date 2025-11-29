import React from "react";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

export const dynamic = "force-dynamic";

export default async function CategoriaPage(props: any) {
  const { params, searchParams } = props;
  const slug = params.slug;

  // Página actual desde searchParams
  const page = Number(searchParams?.page) || 1;

  // Fetch de noticias por categoría
  const { posts, totalPages, categoriaNombre } = await getCachedPostsPage(slug, page);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">
        {categoriaNombre || slug}
      </h1>

      {/* GRID DE NOTICIAS */}
      <CategoryGrid posts={posts} />

      {/* PAGINACIÓN */}
      <CategoryPagination
        current={page}
        totalPages={totalPages}
        basePath={`/Categorias/${slug}`}
      />
    </div>
  );
}
