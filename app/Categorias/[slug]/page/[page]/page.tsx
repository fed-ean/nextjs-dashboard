// app/Categorias/[slug]/page/[page]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

type Props = {
  params: { slug: string; page: string };
};

export default async function CategoriaPagePaginada({ params }: Props) {
  const { slug, page } = params;
  const pageNum = Number(page) || 1;

  const { posts, totalPages, category } = await getCachedPostsPage(
    slug,
    pageNum,
    PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{category?.name ?? slug}</h1>

      {posts.length > 0 ? (
        <>
          <CategoryGrid posts={posts} currentSectionSlug={slug} />
          <div className="mt-8">
            <CategoryPagination
              basePath={`/Categorias/${slug}`}
              current={pageNum}
              totalPages={totalPages}
              maxButtons={7}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-2xl font-semibold mb-3">{category?.name ?? slug}</h1>
          <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
