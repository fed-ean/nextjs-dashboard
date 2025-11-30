
import React from 'react';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import CategoryPostsListClient from '@/app/ui/categorias/CategoryPostsListClient';
import { getAllCategories } from '@/app/lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';

// Genera las rutas estáticas para cada categoría en tiempo de build, 
// mejorando el rendimiento y el SEO.
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

// Definiendo los props con los tipos correctos para Next.js 14+
// params es un objeto, no una Promise en este contexto de generateStaticParams
type Props = {
  params: {
    slug: string;
  };
};

// El componente de página es un React Server Component (RSC) por defecto.
// Su función es estructural y de carga de datos iniciales no interactivos.
export default async function CategoriaPage({ params }: Props) {
  const { slug } = params;

  // Obtenemos todas las categorías para encontrar el nombre de la actual.
  // Esto es muy rápido porque Next.js cachea la llamada de `getAllCategories`.
  const categories = await getAllCategories();
  const currentCategory = categories.find(cat => cat.slug === slug);

  // Si la categoría no existe (p.ej. URL manipulada), mostramos un 404.
  if (!currentCategory) {
    notFound();
  }

  const categoryName = currentCategory.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Columna Izquierda: Barra lateral (Componente de Servidor) */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        {/* Columna Derecha: Contenido principal */}
        <main className="lg:col-span-9">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
              {/* Usamos el nombre real de la categoría para el título */}
              {categoryName}
            </h1>
            <p className="text-xl text-blue-600 mt-1">Noticias de la categoría</p>
          </div>

          {
            /* 
              DELEGACIÓN DE RESPONSABILIDAD:
              Aquí insertamos el Componente de Cliente. Este componente se encargará 
              de forma autónoma de buscar los posts, manejar la paginación ("Cargar más"),
              y gestionar los estados de carga y error.
            */
          }
          <CategoryPostsListClient slug={slug} />

        </main>

      </div>
    </div>
  );
}
