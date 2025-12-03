// app/interes-general/page/[page]/page.tsx
import React from 'react';
import { getCachedPostsPage } from '../../../lib/data-fetcher';
import CategoryGrid from '../../../ui/categorias/CategoryGrid';
import CategoryPagination from '../../../ui/categorias/CategoryPagination';

export const dynamic = 'force-dynamic';

const PER_PAGE = 9;

type Props = {
  params: Promise<{ page: string }>;
};

const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
    <p className="text-gray-500">Todavía no se ha publicado ningún artículo en esta sección.</p>
  </div>
);

export default async function InteresGeneralPagePaginada({ params }: Props) {
  const { page } = await params;
  const pageNum = Number(page) || 1;

  const { posts, totalPages } = await getCachedPostsPage(null, pageNum, PER_PAGE);

  if (!posts || posts.length === 0) return <NoPostsDisplay />;

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryGrid posts={posts} currentSectionSlug="interes-general" />
      <div className="mt-8">
        <CategoryPagination basePath="/interes-general" current={pageNum} totalPages={totalPages} />
      </div>
    </div>
  );
}
