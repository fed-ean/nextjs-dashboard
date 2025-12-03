// app/interes-general/page.tsx
import React from 'react';
import { getCachedPostsPage } from '../lib/data-fetcher';
import CategoryGrid from '../ui/categorias/CategoryGrid';
import CategoryPagination from '../ui/categorias/CategoryPagination';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';

export const dynamic = 'force-dynamic';

const PER_PAGE = 9;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
    <p className="text-gray-500">
      Todavía no se ha publicado ningún artículo en esta sección.
    </p>
  </div>
);

export default async function InteresGeneralPage() {
  const page = 1; // Siempre página 1 para /interes-general

  const { posts, totalPages } = await getCachedPostsPage(null, page, PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        <main className="lg:col-span-9">
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">
            Interés General
          </h1>

          {posts && posts.length > 0 ? (
            <>
              <CategoryGrid posts={posts} currentSectionSlug="interes-general" />
              <div className="mt-8">
                <CategoryPagination
                  basePath="/interes-general"
                  current={page}
                  totalPages={totalPages}
                />
              </div>
            </>
          ) : (
            <NoPostsDisplay />
          )}
        </main>

      </div>
    </div>
  );
}
