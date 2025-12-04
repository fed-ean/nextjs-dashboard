// app/Categorias/[slug]/page/[page]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage, getAllCategories } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

// GENERATE STATIC PARAMS: solo generamos páginas > 1
export async function generateStaticParams() {
  const categories = await getAllCategories();
  const params: { slug: string; page: string }[] = [];

  for (const cat of categories) {
    const { totalPages } = await getCachedPostsPage(cat.slug, 1, 10);

    // Sólo generar páginas que realmente existan
    for (let p = 1; p <= totalPages; p++) {
      params.push({
        slug: cat.slug,
        page: String(p)
      });
    }
  }

  return params;
}



type Props = {
  params: Promise<{ slug: string; page: string }>; // <-- CORRECCIÓN: Promise
};

const NoPostsDisplay = ({ title }: { title: string }) => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">{title}</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo en esta sección.</p>
  </div>
);

export default async function CategoriaPaged({ params }: Props) {
  // Resolvemos la promesa de params (obligatorio en Next 15.5.6)
  const { slug, page } = await params;
  const pageNum = Math.max(1, Number(page));

  const { posts, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE);

  const title = category?.name ?? slug;

  if (!posts || posts.length === 0) return <NoPostsDisplay title={title} />;

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
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <CategoryGrid posts={posts} currentSectionSlug={slug} />

        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
            <CategoryPagination basePath={`/Categorias/${slug}`} current={pageNum} totalPages={totalPages || 1} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
