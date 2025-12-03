// app/Categorias/[slug]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

const PER_PAGE = 9;

type Props = {
  params: Promise<{ slug: string }>;
};

const NoPostsDisplay = ({ title }: { title: string }) => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">{title}</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo en esta sección.</p>
  </div>
);

export default async function CategoriaFirstPage({ params }: Props) {
  const { slug } = await params;
  const page = 1;

  // fetch con manejo mínimo de errores (getCachedPostsPage ya es defensivo)
  const { posts, totalPages, category } = await getCachedPostsPage(slug, page, PER_PAGE);

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
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">{title}</h1>

        <CategoryGrid posts={posts} currentSectionSlug={slug} />

        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
            <CategoryPagination basePath={`/Categorias/${slug}`} current={page} totalPages={totalPages || 1} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
