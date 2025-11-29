import React from "react";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

export const dynamic = "force-dynamic";

export default async function CategoriaPage(props: any) {
  const { params, searchParams } = props;
  const slug = params.slug;

  const page = Number(searchParams?.page) || 1;

  // Traemos los datos reales que sí existen
  const { posts, totalPages } = await getCachedPostsPage(slug, page);

  // Si tu backend NO tiene categoriaNombre, usamos slug como nombre
  const categoriaNombre = slug;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">{categoriaNombre}</h1>

      <CategoryGrid posts={posts} />

      <CategoryPagination
        current={page}
        totalPages={totalPages}
        basePath={`/Categorias/${slug}`}
      />
    </div>
  );
}
