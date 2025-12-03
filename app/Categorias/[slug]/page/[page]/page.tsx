// app/Categorias/[slug]/page/[page]/page.tsx
import React from "react";
import { getCachedPostsPage, getAllCategories } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

// --- generateStaticParams para SSG ---
export async function generateStaticParams() {
  const allCategories: Category[] = await getAllCategories();

  const allParams = await Promise.all(
    allCategories.map(async (category) => {
      const { totalPages } = await getCachedPostsPage(category.slug, 1, PER_PAGE);
      const pages = Array.from({ length: totalPages || 1 }, (_, i) => i + 1);
      return pages.map((page) => ({ slug: category.slug, page: page.toString() }));
    })
  );

  return allParams.flat();
}

type Props = {
  params: { slug: string; page: string };
};

export default async function CategoriaPagePaginada({ params }: Props) {
  const { slug, page } = params;
  const pageNum = Math.max(1, Number(page));

  const { posts, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{category?.name || slug}</h1>

      {posts && posts.length > 0 ? (
        <>
          <CategoryGrid posts={posts} currentSectionSlug={slug} />
          <CategoryPagination
            basePath={`/Categorias/${slug}`}
            current={pageNum}
            totalPages={totalPages || 1}
          />
        </>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-2xl font-semibold mb-3">{category?.name || slug}</h1>
          <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
