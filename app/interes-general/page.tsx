// app/interes-general/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import { getCachedPostsPage } from "../lib/data-fetcher";
import CategoryGrid from "../ui/categorias/CategoryGrid";
import CategoryPagination from "../ui/categorias/CategoryPagination";

const PER_PAGE = 9;

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function InteresGeneralPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page ?? 1);

  // ❗ Llamada correcta
  const result = await getCachedPostsPage(null, page, PER_PAGE);

  const { posts, totalPages } = result;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">
          Todavía no se ha publicado ningún artículo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Interés General</h1>

      <CategoryGrid posts={posts} currentSectionSlug="interes-general" />

      <div className="mt-8">
        <CategoryPagination
          basePath="/interes-general"
          current={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
