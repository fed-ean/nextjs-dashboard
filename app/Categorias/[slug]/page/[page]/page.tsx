// app/Categorias/[slug]/page/[page]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage, getAllCategories } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";
import type { Category } from "@/app/lib/definitions";

const PER_PAGE = 9;

// --- GENERATE STATIC PARAMS: SOLO generar páginas > 1 ---
export async function generateStaticParams() {
  const allCategories: Category[] = await getAllCategories();
  const allParams = await Promise.all(
    allCategories.map(async (category) => {
      try {
        const { totalPages } = await getCachedPostsPage(category.slug, 1, PER_PAGE);
        const tp = Number(totalPages || 0);
        if (!tp || tp <= 1) return []; // NO generar páginas si solo hay 1 o 0
        return Array.from({ length: tp }, (_, i) => i + 1)
          .filter(n => n > 1) // solo páginas > 1
          .map(n => ({ slug: category.slug, page: n.toString() }));
      } catch (err) {
        // si algo falla, no abortamos la build: no generamos páginas extra para esa categoría
        // eslint-disable-next-line no-console
        console.error('[generateStaticParams] error for category', category.slug, err);
        return [];
      }
    })
  );

  return allParams.flat();
}

type Props = {
  params: Promise<{ slug: string; page: string }>;
};

const NoPostsDisplay = ({ title }: { title: string }) => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">{title}</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo en esta sección.</p>
  </div>
);

export default async function CategoriaPaged({ params }: Props) {
  const { slug, page } = await params; // Next 15: params puede ser Promise
  const pageNum = Math.max(1, Number(page || 1));

  // TRY/CATCH para que la build no falle si la API devuelve algo raro en /page/X
  let posts = [];
  let totalPages = 1;
  let category = null;
  try {
    const res = await getCachedPostsPage(slug, pageNum, PER_PAGE);
    posts = res.posts ?? [];
    totalPages = Math.max(1, Number(res.totalPages ?? 1));
    category = res.category ?? null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[CategoriaPaged] fetch error', { slug, pageNum, err });
    // fallback: mostrar mensaje y no abortar build
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">{slug}</h1>
        <p className="text-gray-500">No se pudo cargar esta página en el build — revisá la consola.</p>
      </div>
    );
  }

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
            <CategoryPagination basePath={`/Categorias/${slug}`} current={pageNum} totalPages={totalPages} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
