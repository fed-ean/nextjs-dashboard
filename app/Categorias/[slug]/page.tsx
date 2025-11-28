import React from 'react';
import { getCachedPostsPage, getAllCategories } from '../../lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';

import CategoryGrid from '../../ui/categorias/CategoryGrid';
import PaginationControls from '../../ui/categorias/PaginationControls';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';

// --- FUNCIÓN generateStaticParams AÑADIDA ---
export async function generateStaticParams() {
  const categories: Category[] = await getAllCategories();
  
  // Mapear categorías al formato requerido por Next.js
  return categories.map(category => ({
    slug: category.slug,
  }));
}

// Props adaptadas a Next 15 (params y searchParams vienen como Promise)
type Props = {
  params: Promise<{ 
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoriaPage({ params, searchParams }: Props) {
  // En Next 15 los params vienen como Promise -> await
  const { slug } = await params;

  // searchParams también puede venir como Promise -> await si existe
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  // Normalizamos page (si viene como array tomamos el primer valor)
  const pageParam = resolvedSearchParams?.page;
  const pageStr = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const currentPage = Number(pageStr || '1');

  const { posts, totalPages, category } = await getCachedPostsPage(slug, currentPage);
  
  // Si la categoría en sí no existe, mostramos un 404
  if (!category) {
    return notFound();
  }

  // Si no hay posts, aún mostramos la página con un mensaje
  if (!posts || posts.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <main className="lg:col-span-9">
                    <div className="border-b pb-4 mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Categoría</h1>
                        <p className="text-xl text-blue-600 mt-1">{category.name}</p>
                    </div>
                    <p className='py-10 text-center'>No hay publicaciones para mostrar en esta página.</p>
                    <PaginationControls totalPages={totalPages} currentSectionSlug={slug} />
                </main>
                <aside className="lg:col-span-3 space-y-8">
                    <div className="sticky top-24">
                        <SidenavServer />
                    </div>
                </aside>
            </div>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        <main className="lg:col-span-9">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Categoría</h1>
            <p className="text-xl text-blue-600 mt-1">{category.name}</p>
          </div>
          
          <CategoryGrid posts={posts} currentSectionSlug={slug} />

          <PaginationControls totalPages={totalPages} currentSectionSlug={slug} />
        </main>

        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

      </div>
    </div>
  );
}
