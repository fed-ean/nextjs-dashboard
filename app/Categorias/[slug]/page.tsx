import React from 'react';
import { getCachedPostsPage } from '@/app/lib/data-fetcher';
import CategoryGrid from '@/app/ui/categorias/CategoryGrid';
import CategoryPagination from '@/app/ui/categorias/CategoryPagination';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';

export const dynamic = 'force-dynamic';

const PER_PAGE = 9;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
    <p className="text-gray-500">
      Todavía no se ha publicado ningún artículo en esta sección.
    </p>
  </div>
);

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;

  // ❗ IMPORTANTE: la primera página siempre es 1 en esta ruta
  const page = 1;

  const { posts, totalPages, category } = await getCachedPostsPage(
    slug,
    page,
    PER_PAGE
  );

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
            {category?.name || 'Categoría'}
          </h1>

          {posts && posts.length > 0 ? (
            <>
              <CategoryGrid posts={posts} currentSectionSlug={slug} />
              <div className="mt-8">
                <CategoryPagination
                  basePath={`/Categorias/${slug}`}
                  current={page}
                  totalPages={totalPages}
                  perPage={PER_PAGE}
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
