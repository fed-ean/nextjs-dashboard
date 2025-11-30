import React from 'react';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import CategoryPageContent from '@/app/ui/categorias/CategoryPageContent';

// --- SOLUCIÓN FINAL AL BUG DEL COMPILADOR ---
// Se comenta `generateStaticParams` por completo. Su presencia, siendo una función `async`
// a nivel de módulo, activa un bug en el compilador de Next.js que corrompe la inferencia
// de tipos para los props del componente de página.
// Al eliminarlo, la página pasa de ser Generada Estáticamente (SSG) a ser Renderizada
// en el Servidor bajo demanda (SSR), lo que soluciona el error de compilación.

/*
import { getAllCategories } from '@/app/lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';

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
*/

// El componente se mantiene síncrono y limpio.
function CategoriaPage({ params }: { params: { slug: string } }): React.JSX.Element {
  const { slug } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        <CategoryPageContent slug={slug} />
      </div>
    </div>
  );
}

export default CategoriaPage;
