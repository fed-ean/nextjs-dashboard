// app/programas/varias/page/[page]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

const PER_PAGE = 10;

type Props = { params: Promise<{ page: string }> };

export default async function VariasPage({ params }: Props) {
  const { page } = await params;
  const pageNum = Math.max(1, Number(page));

  const { posts, totalPages } = await getCachedPostsPage(null, pageNum, PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <Suspense fallback={<div className="p-4 text-sm text-gray-500">Cargando menú…</div>}>
              <SidenavServer />
            </Suspense>
          </div>
        </aside>
        <main className="lg:col-span-9">
          <h1 className="text-3xl font-bold mb-6">Varias</h1>

          {posts && posts.length > 0 ? (
            <>
              <CategoryGrid posts={posts} currentSectionSlug="programas/varias" />
              <div className="mt-8">
                <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
                  <CategoryPagination basePath="/programas/varias" current={pageNum} totalPages={totalPages || 1} />
                </Suspense>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
              <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
