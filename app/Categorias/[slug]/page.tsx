import React from 'react';
import { getAllCategories, getCachedPostsPage } from '../../lib/data-fetcher';
import { notFound } from 'next/navigation';

import SideNav from '../../ui/Page_Index/sidenav'; 
import CategoryGrid from '../../ui/categorias/CategoryGrid';
import PaginationControls from '../../ui/categorias/PaginationControls';
import UltimasNoticiasSidenav from '../../ui/Page_Index/ultimas-noticias-sidenav';

type Props = {
  params: { 
    slug: string;
    page?: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = params;
  const currentPage = Number(searchParams?.page || '1');

  // 1. Obtener datos de la categoría y posts paginados
  const { posts, totalPages, category } = await getCachedPostsPage(slug, currentPage);
  
  // 2. Obtener todas las categorías para el SideNav
  const allCategories = await getAllCategories();

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
          <SideNav categories={allCategories} />
          <UltimasNoticiasSidenav />
        </aside>

      </div>
    </div>
  );
}
