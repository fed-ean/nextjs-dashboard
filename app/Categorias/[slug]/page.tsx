import React from 'react';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import { getAllCategories } from '@/app/lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import CategoryPageContent from '@/app/ui/categorias/CategoryPageContent';

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

// --- SOLUCIÓN A PRUEBA DE COMPILADOR ---
// Se declara la función primero y se exporta por separado para evitar bugs de `export default function`.
// Se usan tipos inline y un tipo de retorno explícito para no dejar nada a la inferencia del compilador.

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
