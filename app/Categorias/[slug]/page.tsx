import React from 'react';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import { getAllCategories } from '@/app/lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import CategoryPageContent from '@/app/ui/categorias/CategoryPageContent'; // Importamos el nuevo componente

// generateStaticParams se mantiene, ya que es la forma correcta de generar las páginas estáticas.
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

// El tipo de props necesario para la página.
type PageProps = {
  params: { slug: string };
};

// --- ARQUITECTURA FINAL ---
// El componente de página ahora es SÍNCRONO y "tonto".
// Su única responsabilidad es definir la estructura de la página.
export default function CategoriaPage({ params }: PageProps) {
  const { slug } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Columna Izquierda: La barra lateral no cambia. */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        {/* 
          Columna Derecha: 
          Aquí insertamos el nuevo componente de servidor ASÍNCRONO.
          Él se encargará de toda la lógica de obtención de datos y renderizado del contenido.
          Esto resuelve el conflicto de tipos al aislar la asincronía del componente de página principal.
        */}
        <CategoryPageContent slug={slug} />

      </div>
    </div>
  );
}
