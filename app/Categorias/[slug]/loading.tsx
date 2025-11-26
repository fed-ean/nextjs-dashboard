
import { SidenavSkeleton } from '../../ui/skeletons';

// Esqueleto para un único post en la rejilla de categorías
const PostCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Este es el componente de carga que Next.js usará automáticamente
// para la ruta de categorías.
export default function Loading() {
  return (
    // 1. Replicamos el layout de Flexbox de la página real.
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-pulse">
      
      {/* --- ESQUELETO DE LA COLUMNA PRINCIPAL --- */}
      <main className="w-full md:w-3/4 md:pr-8">
        {/* Título de la categoría */}
        <div className="h-10 bg-gray-300 rounded w-1/2 mb-6"></div>
        
        {/* Rejilla de posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </main>

      {/* --- ESQUELETO DE LA BARRA LATERAL --- */}
      <aside className="w-full md:w-1/4 mt-8 md:mt-0">
        <div className="sticky top-24">
          {/* 2. Reutilizamos el SidenavSkeleton que ya creamos */}
          <SidenavSkeleton />
        </div>
      </aside>

    </div>
  );
}
