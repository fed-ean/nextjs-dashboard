// app/interes-general/page/[page]/page.tsx
import React from 'react';
import { getCachedPostsPage } from '../../../lib/data-fetcher';
import CategoryGrid from '../../../ui/categorias/CategoryGrid';
import CategoryPagination from '../../../ui/categorias/CategoryPagination';
import SidenavServer from '../../../ui/Page_Index/SidenavServer';

const PER_PAGE = 9;

type Props = {
  params: Promise<{ page: string }>;
};

export default async function InteresGeneralPage({ params }: Props) {
  const { page } = await params;
  const pageNum = Math.max(1, Number(page));

  const { posts, totalPages } = await getCachedPostsPage(null, pageNum, PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        <main className="lg:col-span-9">
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">Interés General</h1>

          {posts && posts.length > 0 ? (
            <>
              <CategoryGrid posts={posts} currentSectionSlug="interes-general" />
              <CategoryPagination
                basePath="/interes-general"
                current={pageNum}
                totalPages={totalPages || 1}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
              <p className="text-gray-500">
                Todavía no se ha publicado ningún artículo en esta sección.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
