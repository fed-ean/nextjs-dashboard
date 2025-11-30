
import React from 'react';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import CategoryPostsListClient from '@/app/ui/categorias/CategoryPostsListClient';
import { getAllCategories } from '@/app/lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const categories: Category[] = await getAllCategories();
    return categories.map(category => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Error al generar los static params para categorías:", error);
    return [];
  }
}

// --- CORRECCIÓN DEFINITIVA ---
// El tipo de props para una página de Next.js debe incluir tanto `params` como `searchParams`
// para satisfacer la restricción de tipo `PageProps` del framework.
// Aunque no usemos searchParams en este componente de servidor, debe estar en la firma de tipo.
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CategoriaPage({ params }: Props) {
  const { slug } = params;

  const categories = await getAllCategories();
  const currentCategory = categories.find(cat => cat.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const categoryName = currentCategory.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        <main className="lg:col-span-9">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
              {categoryName}
            </h1>
            <p className="text-xl text-blue-600 mt-1">Noticias de la categoría</p>
          </div>

          <CategoryPostsListClient slug={slug} />

        </main>

      </div>
    </div>
  );
}
