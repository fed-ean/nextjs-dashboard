// app/Categorias/page.tsx
import React from 'react';
import { getCachedPostsPage } from '../lib/data-fetcher'; // <-- 1. USANDO EL MÉTODO DE DATOS CORRECTO
import NoticiasVarias from '../ui/dashboard/noticias-varias'; // <-- 2. RUTA DE IMPORTACIÓN CORREGIDA

// Componente para mostrar errores de forma elegante
const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Error al Cargar Contenido</h1>
        <p className="text-red-500">{message}</p>
        <p className="mt-4">Esto puede deberse a un problema de conexión. Por favor, inténtelo más tarde.</p>
    </div>
);

// Componente para cuando no hay noticias
const NoPostsDisplay = () => (
    <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">No hay noticias disponibles</h1>
        <p>No se encontraron noticias para mostrar en este momento.</p>
    </div>
);

export default async function NoticiasPage() {
  // 3. SE LLAMA A LA FUNCIÓN ASÍNCRONA CORRECTA
  // Pasamos `null` para obtener todos los posts, no de una categoría específica.
  const { posts, error } = await getCachedPostsPage(null);

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!posts || posts.length === 0) {
      return <NoPostsDisplay />;
  }

  // 4. SE PASA EL ARRAY COMPLETO DE POSTS AL COMPONENTE
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
