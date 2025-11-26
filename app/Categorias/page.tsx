// app/Categorias/page.tsx
import React from "react";
import { getCachedPostsPage } from "../lib/data-fetcher";
import NoticiasVarias from "../ui/dashboard/noticias-varias";
export const dynamic = 'force-dynamic'


// Componente para cuando no hay noticias
const NoPostsDisplay = () => (
  <div className="text-center py-10">
    <h1 className="text-2xl font-bold mb-4">No hay noticias disponibles</h1>
    <p>No se encontraron noticias para mostrar en este momento.</p>
  </div>
);

export default async function NoticiasPage() {
  // Llamamos correctamente a la función
  const { posts } = await getCachedPostsPage(null);

  if (!posts || posts.length === 0) {
    return <NoPostsDisplay />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Todas las Noticias</h1>

      <NoticiasVarias
        posts={posts}
        page={1}
        categoriaSlug=""
        categoriaNombre=""
      />
    </div>
  );
}
