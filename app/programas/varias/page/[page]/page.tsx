// app/programas/varias/page/[page]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";

const PER_PAGE = 9;

type Props = {
  params: Promise<{ page: string }>;
};

export default async function VariasPage({ params }: Props) {
  const { page } = await params;
  const pageNum = Math.max(1, Number(page));

  const { posts, totalPages } = await getCachedPostsPage(null, pageNum, PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Varias</h1>

      {posts && posts.length > 0 ? (
        <>
          <CategoryGrid posts={posts} currentSectionSlug="programas/varias" />
          <CategoryPagination
            basePath="/programas/varias"
            current={pageNum}
            totalPages={totalPages || 1}
          />
        </>
      ) : (
        <div className="text-center py-10">
          <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
          <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
        </div>
      )}
    </div>
  );
}
