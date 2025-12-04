// app/Categorias/[slug]/page/[page]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGridServer from "../../../../ui/categorias/CategoryGridServer";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

const PER_PAGE = 12;

// ❌ Eliminamos generateStaticParams: esto evita errores en build
// Next ahora renderiza bajo demanda sin romper nada.

type Props = {
  params: Promise<{ slug: string; page: string }>;
};

export default async function CategoriaPaged({ params }: Props) {
  const { slug, page } = await params;
  const pageNum = Math.max(1, Number(page || 1));

  let posts = [];
  let totalPages = 1;
  let category = null;

  try {
    const res = await getCachedPostsPage(slug, pageNum, PER_PAGE);

    posts = res?.posts ?? [];
    totalPages = Math.max(1, Number(res?.totalPages ?? 1));
    category = res?.category ?? null;

  } catch (err) {
    console.error("[CategoriaPaged] ERROR:", err);

    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">{slug}</h1>
        <p className="text-gray-500">No se pudo cargar esta página.</p>
      </div>
    );
  }

  const title = category?.name ?? slug;

  if (!posts.length) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">{title}</h1>
        <p className="text-gray-500">
          Todavía no se ha publicado ningún artículo en esta sección.
        </p>
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
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <CategoryGridServer posts={posts} />

        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
            <CategoryPagination
              basePath={`/Categorias/${slug}`}
              current={pageNum}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
