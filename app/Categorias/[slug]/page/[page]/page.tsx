// app/Categorias/[slug]/page/[page]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../../../lib/data-fetcher";
import CategoryGrid from "../../../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

const PER_PAGE = 9;

type Props = {
  params: Promise<{ slug: string; page: string }>;
};

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-2">No hay publicaciones</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
  </div>
);

export default async function CategoriaPagePaginada({ params }: Props) {
  const { slug, page } = await params;
  const pageNum = Number(page) || 1;

  const { posts, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE);

  if (!posts || posts.length === 0) return <NoPostsDisplay />;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <aside className="lg:col-span-3 space-y-8">
        <div className="sticky top-24">
          <SidenavServer />
        </div>
      </aside>

      <main className="lg:col-span-9">
        <h1 className="text-3xl font-bold mb-6">{category?.name || slug}</h1>
        <CategoryGrid posts={posts} currentSectionSlug={slug} />
        <div className="mt-8">
          <CategoryPagination basePath={`/Categorias/${slug}`} current={pageNum} totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
