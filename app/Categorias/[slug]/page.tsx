// app/Categorias/[slug]/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

const PER_PAGE = 9;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoriaPage(props: Props) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page ?? 1);

  // ❗ Llamada correcta
  const result = await getCachedPostsPage(slug, page, PER_PAGE);

  const { posts, totalPages } = result;

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize mb-6">{slug}</h1>

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
