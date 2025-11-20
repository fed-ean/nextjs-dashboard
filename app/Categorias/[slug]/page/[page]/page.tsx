// app/Categorias/[slug]/page/[page]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";

const PER_PAGE = 9;

type Props = {
  params: Promise<{
    slug: string;
    page: string;
  }>;
};

export default async function CategoriaPagePaginada({ params }: Props) {
  const { slug, page } = await params;
  const pageNum = Number(page) || 1;

  const { posts, totalPages, category } = await getCachedPostsPage(slug);

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {category?.name ?? slug}
        </h1>
        <p className="text-gray-500">
          No hay publicaciones en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        {category?.name ?? slug}
      </h1>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <div className="mt-8">
        <CategoryPagination
          basePath={`/Categorias/${slug}`}
          current={pageNum}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
