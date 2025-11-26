// app/programas/varias/page.tsx
export const dynamic = 'force-dynamic'

import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import CategoryGrid from "../../ui/categorias/CategoryGrid";

const PER_PAGE = 9;

// ✅ Tipado correcto para Next 15
type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VariasPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page ?? 1);

  // Llamada corregida: un solo objeto y casteo para asegurar el tipo esperado
  const result = (await (getCachedPostsPage as any)({
    slug: null,
    page,
    perPage: PER_PAGE,
  })) as { posts: any[]; total: number; totalPages: number };

  const { posts, total, totalPages } = result;

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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Varias</h1>

      <CategoryGrid
        posts={posts}
        currentSectionSlug="programas/varias"
      />

      <div className="mt-8">
        <CategoryPagination
          basePath="/programas/varias"
          current={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}

