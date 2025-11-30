// app/interes-general/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";
import NoticiasVarias from "@/app/ui/dashboard/noticias-varias";
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import { SidenavSkeleton } from '@/app/ui/skeletons';
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

export const dynamic = 'force-dynamic';

const NoPostsDisplay = ({ categoryName }: { categoryName: string }) => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-4">No hay noticias en {categoryName}</h1>
    <p>No se encontraron noticias para mostrar en este momento.</p>
  </div>
);

export default async function InteresGeneralPage({ searchParams }: any) {
  const page = Number(searchParams?.page) || 1;
  const slug = 'interes-general';

  const { posts, totalPages, category } = await getCachedPostsPage(slug, page);

  const categoryName = category?.name || 'Interés General';

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <NoPostsDisplay categoryName={categoryName} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row-reverse max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <main className="w-full">
        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
        
        <NoticiasVarias 
          posts={posts} 
          page={page} 
          categoriaSlug={slug} 
          categoriaNombre={categoryName} 
        />

        {/* CORRECCIÓN: Se usa 'totalPages' en lugar de 'total' */}
        <CategoryPagination
            current={page}
            totalPages={totalPages} // <--- Propiedad corregida
            basePath={`/interes-general`}
        />
      </main>

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
