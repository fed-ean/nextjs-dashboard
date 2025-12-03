// app/Categorias/[slug]/page/[page]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage, getAllCategories } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

export async function generateStaticParams() {
  const allCategories: Category[] = await getAllCategories();
  const allParams = await Promise.all(
    allCategories.map(async (category) => {
      try {
        const { totalPages } = await getCachedPostsPage(category.slug, 1, PER_PAGE);
        const pages = Array.from({ length: Math.max(1, Number(totalPages || 1)) }, (_, i) => i + 1);
        return pages.map((page) => ({ slug: category.slug, page: page.toString() }));
      } catch (err) {
        // No abortar la build: al menos devolver la página 1 para esa categoría
        // eslint-disable-next-line no-console
        console.error('[generateStaticParams] error for category', category.slug, err);
        return [{ slug: category.slug, page: '1' }];
      }
    })
  );
  return allParams.flat();
}

type Props = {
  params: Promise<{ slug: string; page: string }>;
};

export default async function CategoriaPage({ params }: Props) {
  const { slug, page } = await params;
  const pageNum = Math.max(1, Number(page));

  const { posts, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <aside className="lg:col-span-3 space-y-8">
        {/* Suspense boundary para cualquier client component que use next/navigation */}
        <div className="sticky top-24">
          <Suspense fallback={<div className="p-4 text-sm text-gray-500">Cargando menú…</div>}>
            <SidenavServer />
          </Suspense>
        </div>
      </aside>

      <main className="lg:col-span-9">
        <h1 className="text-3xl font-bold mb-6">{category?.name || slug}</h1>

        {posts && posts.length > 0 ? (
          <>
            <CategoryGrid posts={posts} currentSectionSlug={slug} />
            <div className="mt-8">
              {/* Aunque CategoryPagination no use searchParams, envolverlo no hace daño */}
              <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
                <CategoryPagination
                  basePath={`/Categorias/${slug}`}
                  current={pageNum}
                  totalPages={totalPages || 1}
                />
              </Suspense>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <h1 className="text-2xl font-semibold mb-3">{category?.name || slug}</h1>
            <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
          </div>
        )}
      </main>
    </div>
  );
}
