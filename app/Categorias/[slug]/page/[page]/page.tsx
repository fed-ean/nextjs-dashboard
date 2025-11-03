// app/Categorias/[slug]/page/[page]/page.tsx
import React from 'react';
import CategoryGrid from '../../../../ui/categorias/CategoryGrid';
import CategoryPagination from '../../../../ui/categorias/CategoryPagination';
import { getCachedPostsPage } from '../../../../lib/cacheProxy';

type Props = { params: { slug: string; page: string } };

export const dynamic = 'force-dynamic';

export default async function CategoryPageNumbered({ params }: Props) {
  const { slug, page } = (await params) as { slug: string; page: string };
  const pageNum = Math.max(1, Number(page || 1));
  const PER_PAGE = 9;
  // TTL en segundos: para dev test 10, en prod 60-300. Puedes pasarlo por env
  const TTL = Number(process.env.CACHE_TTL_SECONDS || 60);

  try {
    const { posts, total, totalPages, category } = await getCachedPostsPage(slug, pageNum, PER_PAGE, TTL);

    // Si no vinieron posts y totalPages = 0 => posible que GraphQL haya devuelto sin info de total
    // calculamos totalPages por fallback si es posible
    const computedTotalPages = totalPages && totalPages > 0 ? totalPages : Math.max(1, Math.ceil((total || posts.length) / PER_PAGE));

    return (
      <main className="p-6">
        <h1 className="text-2xl text-center mb-6">{category?.name?.toUpperCase() || slug.toUpperCase()}</h1>

        <CategoryGrid posts={posts} currentSectionSlug={slug} />

        <div className="mt-8">
          <CategoryPagination basePath={`/Categorias/${slug}/page`} current={pageNum} totalPages={computedTotalPages} />
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
