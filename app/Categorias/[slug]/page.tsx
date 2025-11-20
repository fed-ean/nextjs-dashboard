import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";

export const revalidate = 60;

// ✅ Tipado compatible con Next 15 (params viene como Promise)
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoriaPage({ params }: Props) {
  // ✅ Esperamos el Promise
  const { slug } = await params;

  const { posts, category } = await getCachedPostsPage(slug);

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

      <CategoryGrid
        posts={posts}
        currentSectionSlug={slug}
        showCategory={false}
      />
    </div>
  );
}
