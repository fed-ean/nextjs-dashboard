import React from 'react';
import { getCachedPostsPage } from '@/app/lib/data-fetcher';
import CategoryGrid from '@/app/ui/categorias/CategoryGrid';
import CategoryPagination from '@/app/ui/categorias/CategoryPagination';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';

export const dynamic = 'force-dynamic';

const PER_PAGE = 9;

type PageProps = {
  params: Promise<{ slug: string; page: string }>;
};

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
    <p className="text-gray-500">
      Todavía no se ha publicado ningún artículo en esta sección.
    </p>
  </div>
);

export default async function CategoriaPagePaginated({ params }: PageProps) {
  const { slug, page } = await params;

  const currentPage = Number(page);

  if (isNaN(currentPage) || currentPage < 1) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold">Página inválida</h1>
      </div>
    );
  }

  // Fetch con slug + page real
  const { posts, totalPages, category } = await getCachedPostsPage(
    slug,
    currentPage,
    PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* SIDENAV */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="lg:col-span-9">
          <h1 className="text-3xl font-bold mb-6 border-b pb-4">
            {category?.name || 'Categoría'}
          </h1>

          {posts && posts.length > 0 ? (
            <>
              {/* GRID DE NOTICIAS */}
              <CategoryGrid posts={posts} currentSectionSlug={slug} />

              {/* PAGINACIÓN */}
              <div className="mt-8">
                <CategoryPagination
                  basePath={`/Categorias/${slug}`}
                  current={currentPage}
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
