
import React from 'react';
import { getCachedPostsPage, getAllCategories } from '../../lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';

import CategoryGrid from '../../ui/categorias/CategoryGrid';
import PaginationControls from '../../ui/categorias/PaginationControls';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';

export async function generateStaticParams() {
  const categories: Category[] = await getAllCategories();
  return categories.map(category => ({ slug: category.slug }));
}

type Props = {
  params: Promise<{ 
    slug: string; 
  }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params; // ⚠️ ahora hay que hacer await

  const currentPage = Number(searchParams?.page || '1');

  const { posts, totalPages, category } = await getCachedPostsPage(slug, currentPage);

  if (!category) {
    return notFound();
  }

  // El contenedor principal del grid
  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>
        <main className="lg:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );

  if (!posts || posts.length === 0) {
    return (
      <PageLayout>
        <div className="border-b pb-4 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Categoría
          </h1>
          <p className="text-xl text-blue-600 mt-1">
            {category.name}
          </p>
        </div>

        <p className='py-10 text-center'>
          No hay publicaciones para mostrar en esta página.
        </p>

        <PaginationControls totalPages={totalPages} currentSectionSlug={slug} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Categoría
        </h1>
        <p className="text-xl text-blue-600 mt-1">
          {category.name}
        </p>
      </div>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />
      <PaginationControls totalPages={totalPages} currentSectionSlug={slug} />
    </PageLayout>
  );
}
