// app/Categorias/[slug]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher"; // <-- CAMBIO AQUÍ
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import CategoryGrid from "../../ui/categorias/CategoryGrid";

export default async function CategoryPage(
  props: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
) {
  const { params, searchParams } = props;

  const slug = params.slug;
  const page = Number(searchParams?.page || 1);

  const { posts, total, totalPages, category } = await getCachedPostsPage(
    slug,
    page,
    PER_PAGE
  );

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">
          Todavía no hay artículos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize mb-6">
        {category?.name || slug}
      </h1>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <div className="mt-8">
        <CategoryPagination
          basePath={`/Categorias/${slug}`}
          current={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
