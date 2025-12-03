// app/programas/varias/page/[page]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";

export const dynamic = 'force-dynamic';

const PER_PAGE = 9;

type Props = {
  params: { page: string };
};

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
    <p className="text-gray-500">
      Todavía no se ha publicado ningún artículo.
    </p>
  </div>
);

export default async function VariasPagePaginada({ params }: Props) {
  const pageNum = Number(params.page) || 1;

  const { posts, totalPages } = await getCachedPostsPage(null, pageNum, PER_PAGE);

  if (!posts || posts.length === 0) return <NoPostsDisplay />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Varias</h1>

      <CategoryGrid posts={posts} currentSectionSlug="programas/varias" />

      <div className="mt-8">
        <CategoryPagination
          basePath="/programas/varias"
          current={pageNum}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
