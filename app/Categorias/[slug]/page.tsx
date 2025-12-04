// app/Categorias/[slug]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

const PER_PAGE = 10;

type Props = { params: Promise<{ slug: string }> };

export default async function CategoriaFirstPage({ params }: Props) {
  const { slug } = await params;
  const page = 1;

  let posts = [], totalPages = 1, category = null;
  try {
    const res = await getCachedPostsPage(slug, page, PER_PAGE);
    posts = res.posts ?? [];
    totalPages = Math.max(1, Number(res.totalPages ?? 1));
    category = res.category ?? null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[CategoriaFirstPage] fetch error', { slug, err });
    return <div className="max-w-5xl mx-auto px-4 py-10 text-center">Error al generar la categoría</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-6">{category?.name ?? slug}</h1>
        <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <aside className="lg:col-span-3 space-y-8">
        <div className="sticky top-24">
          <Suspense fallback={<div className="p-4 text-sm text-gray-500">Cargando menú…</div>}>
            <SidenavServer />
          </Suspense>
        </div>
      </aside>

      <main className="lg:col-span-9">
        <h1 className="text-3xl font-bold mb-6">{category?.name ?? slug}</h1>
        <CategoryGrid posts={posts} currentSectionSlug={slug} />
        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
            <CategoryPagination basePath={`/Categorias/${slug}`} current={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
