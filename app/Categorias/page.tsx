// app/Categorias/page.tsx
import React, { Suspense } from "react";
import { getAllPosts } from "@/app/lib/data-fetcher";
import NoticiasVarias from "@/app/ui/dashboard/noticias-varias";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";
import { SidenavSkeleton } from "@/app/ui/skeletons";
import type { MappedPost } from "@/app/lib/definitions";

export const dynamic = "force-dynamic";

export default async function CategoriasHomePage() {
  let posts: MappedPost[] = [];

  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("Error obteniendo posts:", error);
    posts = [];
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Todas las noticias</h1>
        <div className="text-center py-10 text-gray-600">
          No hay noticias para mostrar en este momento.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row-reverse max-w-7xl mx-auto p-4 gap-8">

      {/* Contenido principal */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-8">Todas las Noticias</h1>

        <NoticiasVarias
          posts={posts}
          page={1}
          categoriaSlug=""
          categoriaNombre="Todas"
        />
      </main>

      {/* Sidebar */}
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="sticky top-24">
          <Suspense fallback={<SidenavSkeleton />}>
            <SidenavServer />
          </Suspense>
        </div>
      </aside>

    </div>
  );
}
