// app/Categorias/[slug]/page/[page]/page.tsx
import React from 'react';
import type { Metadata } from "next";
import CategoryGrid from '../../../../ui/categorias/CategoryGrid';
import CategoryPagination from '../../../../ui/categorias/CategoryPagination';
import { getCachedPostsPage } from '../../../../lib/data-fetcher';
export const dynamic = 'force-dynamic';

export default async function CategoryPageNumbered({
  params,
}: {
  params: Promise<{
    slug: string;
    page: string;
  }>;
}) {
  // await params para cumplir el tipo y resolver el valor
  const { slug, page } = await params;
  const pageNum = Math.max(1, Number(page || 1));
  const PER_PAGE = 9;

  try {
    const { posts, total, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE);

    const computedTotalPages = totalPages && totalPages > 0 ? totalPages : Math.max(1, Math.ceil((total || posts.length) / PER_PAGE));

    return (
      <main className="p-6">
        <h1 className="text-2xl text-center mb-6">{category?.name?.toUpperCase() || slug.toUpperCase()}</h1>

        <CategoryGrid posts={posts} currentSectionSlug={slug} />

        <div className="mt-8">
          <CategoryPagination basePath={`/Categorias/${slug}`} current={pageNum} totalPages={computedTotalPages} />
        </div>
      </main>
    );
  } catch (err: any) {
    console.error('Error render category page paginada:', err);
    return (
      <main className="p-6">
        <h1 className="text-2xl text-center">Error cargando noticias</h1>
        <p className="text-center text-sm text-gray-600">{String(err?.message || err)}</p>
      </main>
    );
  }
}
