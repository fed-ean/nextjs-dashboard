// app/Categorias/[slug]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

type Props = {
  params: Promise<{ slug: string }>;
};

const NoPostsDisplay = () => (
  <div className="max-w-5xl mx-auto px-4 py-10 text-center">
    <h1 className="text-2xl font-bold mb-2">No hay publicaciones</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo en esta sección.</p>
  </div>
);

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const page = 1;

  const { posts, totalPages, category } = await getCachedPostsPage(slug, page, PER_PAGE);

  if (!posts || posts.length === 0) return <NoPostsDisplay />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{category?.name || slug}</h1>
      <CategoryGrid posts={posts} currentSectionSlug={slug} />
      <div className="mt-8">
        <CategoryPagination basePath={`/Categorias/${slug}`} current={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
