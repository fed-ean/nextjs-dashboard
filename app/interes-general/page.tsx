import React, { Suspense } from "react";
import { getCachedPostsPage } from "../lib/data-fetcher";
import NoticiasVarias from "../ui/dashboard/noticias-varias";
import SidenavServer from '../ui/Page_Index/SidenavServer';
import { SidenavSkeleton } from '../ui/skeletons';

export const dynamic = 'force-dynamic';

// Componente para cuando no hay noticias
const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-4">No hay noticias disponibles</h1>
    <p>No se encontraron noticias para mostrar en este momento.</p>
  </div>
);

export default async function NoticiasPage() {
  const { posts } = await getCachedPostsPage(null);

  if (!posts || posts.length === 0) {
    return (
        <div className="max-w-7xl mx-auto">
            <NoPostsDisplay />
        </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row-reverse max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* --- CONTENIDO PRINCIPAL (derecha en desktop) --- */}
      <main className="w-full">
        <h1 className="text-3xl font-bold mb-8">Todas las Noticias</h1>
        <NoticiasVarias
          posts={posts}
          page={1}
          categoriaSlug=""
          categoriaNombre=""
        />
      </main>

      {/* --- BARRA LATERAL (izquierda en desktop) --- */}
      <aside className="w-full md:w-72 md:mr-8 flex-shrink-0 mt-8 md:mt-0">
        <div className="sticky top-32">
          <Suspense fallback={<SidenavSkeleton />}>
            <SidenavServer />
          </Suspense>
        </div>
      </aside>

    </div>
  );
}
