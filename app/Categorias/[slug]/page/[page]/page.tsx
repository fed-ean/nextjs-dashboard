import React from 'react';
import { getCachedPostsPage } from '@/app/lib/data-fetcher';
import CategoryGrid from '@/app/ui/categorias/CategoryGrid';
import CategoryPagination from '@/app/ui/categorias/CategoryPagination';

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {

  const slug = params.slug;
  const page = Number(searchParams.page ?? 1);

  const data = await getCachedPostsPage(slug, page, 10);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {data.category?.name ?? 'Categoría'}
      </h1>

      <CategoryGrid posts={data.posts} />

      <CategoryPagination
        currentPage={page}
        totalPages={data.totalPages}
        slug={slug}
      />
    </div>
  );
}
