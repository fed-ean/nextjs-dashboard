// app/programas/varias/page.tsx
import React from 'react';
import { getCachedPostsPage } from '@/app/lib/data-fetcher';
import CategoryGrid from '@/app/ui/categorias/CategoryGrid';
import CategoryPagination from '@/app/ui/categorias/CategoryPagination';
import type { MappedPost } from '@/app/lib/definitions';

export const dynamic = 'force-dynamic';

type Props = { searchParams?: { page?: string } };

export default async function VariasPage({ searchParams }: Props) {
  const page = Number(searchParams?.page ?? '1') || 1;
  const res = await getCachedPostsPage('programas', page);
  const posts: MappedPost[] = res.posts ?? [];
  const totalPages = res.totalPages ?? 1;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">No hay publicaciones</h1>
        <p>Todavía no se ha publicado ningún artículo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Varias</h1>

      <CategoryGrid posts={posts} currentSectionSlug="programas/varias" />

      <div className="mt-8">
        <CategoryPagination basePath="/programas/varias" current={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
