import React from 'react'; // Importación explícita de React
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

// --- CORRECCIÓN FINAL Y EXPLÍCITA ---
// Se define un tipo completo para las props que Next.js pasa a una página.

type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Se tipa de forma explícita tanto los props de entrada (`PageProps`) 
// como el valor de retorno de la función async (`Promise<React.JSX.Element>`).
// Esto elimina toda ambigüedad para el compilador de TypeScript.

export default async function CategoriaPage({ params }: PageProps): Promise<React.JSX.Element> {
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
