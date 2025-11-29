export const dynamic = "force-dynamic";

import React from "react";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

const PER_PAGE = 9;

// ❌ NO USAR PageProps
// ❌ NO USAR tipos estrictos
// ✔ Next recomienda dejarlo flexible

export default async function CategoriaPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: any;
}) {
  const slug = params.slug;
  const page = Number(searchParams?.page ?? 1);

  const { posts, totalPages } = await getCachedPostsPage(
    slug,
    page,
    PER_PAGE
  );

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
      <h1 className="text-3xl font-bold mb-6">{slug.toUpperCase()}</h1>

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
