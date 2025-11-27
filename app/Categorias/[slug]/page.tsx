
import React from 'react';
import { getCachedPostsPage } from '../../lib/data-fetcher';
import { notFound } from 'next/navigation';

import CategoryGrid from '../../ui/categorias/CategoryGrid';
import PaginationControls from '../../ui/categorias/PaginationControls';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';

// Tipado corregido para Next.js App Router con Server Components asíncronos
type Props = {
  params: Promise<{ 
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoriaPage({ params, searchParams: searchParamsProp }: Props) {
  // 1. Resolver las promesas de los parámetros
  const { slug } = await params;
  const searchParams = await searchParamsProp;
  const currentPage = Number(searchParams?.page || '1');

  // 2. Obtener datos de la categoría y posts paginados
  const { posts, totalPages, category } = await getCachedPostsPage(slug, currentPage);
  
  // Si no hay categoría o posts, mostrar notFound
  if (!category || !posts || posts.length === 0) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Columna Principal de Contenido */}
        <main className="lg:col-span-9">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Categoría</h1>
            <p className="text-xl text-blue-600 mt-1">{category.name}</p>
          </div>
          
          <CategoryGrid posts={posts} currentSectionSlug={slug} />

          <PaginationControls totalPages={totalPages} currentSectionSlug={slug} />
        </main>

        {/* Barra Lateral */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

      </div>
    </div>
  );
}
