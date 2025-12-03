// app/programas/varias/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

export const dynamic = 'force-dynamic';

const PER_PAGE = 9;

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-2">No hay publicaciones</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
  </div>
);

export default async function VariasPage() {
  const page = 1;
  const { posts, totalPages } = await getCachedPostsPage(null, page, PER_PAGE);

  if (!posts || posts.length === 0) return <NoPostsDisplay />;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <aside className="lg:col-span-3 space-y-8">
        <div className="sticky top-24">
          <SidenavServer />
        </div>
      </aside>

      <main className="lg:col-span-9">
        <h1 className="text-3xl font-bold mb-6">Varias</h1>
        <CategoryGrid posts={posts} currentSectionSlug="programas/varias" />
        <div className="mt-8">
          <CategoryPagination basePath="/programas/varias" current={page} totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
