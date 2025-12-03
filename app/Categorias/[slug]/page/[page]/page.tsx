// app/Categorias/[slug]/page/[page]/page.tsx
import React from "react";
import { getAllCategories, getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

// --- generateStaticParams ---
export async function generateStaticParams() {
  const allCategories: Category[] = await getAllCategories();

  const allParams = await Promise.all(
    allCategories.map(async (category) => {
      const { totalPages } = await getCachedPostsPage(category.slug, 1, PER_PAGE);

      // Generamos los objetos { slug, page }
      return Array.from({ length: totalPages }, (_, i) => ({
        slug: category.slug,
        page: (i + 1).toString(),
      }));
    })
  );

  return allParams.flat();
}

// Props compatibles con Next 15
type Props = {
  params: Promise<{
    slug: string;
    page: string;
  }>;
};

export default async function CategoriaPagePaginada({ params }: Props) {
  const { slug, page } = await params;
  const pageNum = Number(page) || 1;

  const { posts, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE);

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {category?.name ?? slug}
        </h1>
        <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{category?.name ?? slug}</h1>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <CategoryPagination
        basePath={`/Categorias/${slug}`}
        current={pageNum}
        totalPages={totalPages}
      />
    </div>
  );
}
