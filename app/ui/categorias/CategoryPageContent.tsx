import React from 'react';
import { getAllCategories } from '@/app/lib/data-fetcher';
import { notFound } from 'next/navigation';
import CategoryPostsListClient from '@/app/ui/categorias/CategoryPostsListClient';

type Props = {
  slug: string;
};

// Este es un React Server Component (RSC) asíncrono.
// Su única responsabilidad es obtener los datos del lado del servidor 
// para una categoría específica y renderizar el contenido principal.
export default async function CategoryPageContent({ slug }: Props) {
  // Obtenemos los datos de la categoría de forma asíncrona.
  const categories = await getAllCategories();
  const currentCategory = categories.find(cat => cat.slug === slug);

  // Si la categoría no existe, se muestra un 404.
  if (!currentCategory) {
    notFound();
  }

  const categoryName = currentCategory.name;

  // Renderiza el contenido principal de la página.
  return (
    <main className="lg:col-span-9">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
          {categoryName}
        </h1>
        <p className="text-xl text-blue-600 mt-1">Noticias de la categoría</p>
      </div>
      
      {/* Delega la carga de la lista de posts al componente de cliente */}
      <CategoryPostsListClient slug={slug} />
    </main>
  );
}
