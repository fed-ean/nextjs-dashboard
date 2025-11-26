
// Este es un componente de esqueleto genérico para un bloque brillante.
const Shimmer = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-[shimmer_1.5s_infinite]" />
);

// Esqueleto específico para el Sidenav
export const SidenavSkeleton = () => (
  <div className="h-auto w-full bg-gray-50 border-r overflow-y-auto shadow-lg rounded-lg p-6 space-y-8">
    {/* Esqueleto para "Últimas publicaciones" */}
    <div>
      <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-4 relative overflow-hidden"><Shimmer /></div>
      <ul className="space-y-4">
        <li className="h-12 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
        <li className="h-12 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
        <li className="h-12 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
      </ul>
    </div>
    {/* Esqueleto para "Categorías" */}
    <div>
      <div className="h-6 w-1/2 bg-gray-200 rounded-md mb-4 relative overflow-hidden"><Shimmer /></div>
      <ul className="space-y-2">
        <li className="h-8 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
        <li className="h-8 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
        <li className="h-8 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
        <li className="h-8 bg-gray-200 rounded-md relative overflow-hidden"><Shimmer /></li>
      </ul>
    </div>
  </div>
);


export function GridNoticiasPrincipalesSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export function CarouselNoticiasSkeleton() {
    return (
      <div className="w-full bg-gray-200 animate-pulse rounded-lg p-6">
        <div className="h-8 w-1/3 bg-gray-300 rounded-md mx-auto mb-4"></div>
        <div className="h-48 bg-gray-300 rounded-md"></div>
      </div>
    );
  }
  
  export function ReporteNoticiasSkeleton() {
    return (
      <div className="w-full bg-blue-100 p-6 rounded-lg animate-pulse mt-6">
        <div className="h-8 bg-blue-200 w-1/4 rounded-md mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-blue-200 rounded-md"></div>
          <div className="h-4 bg-blue-200 w-5/6 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  export function SeccionNoticiasVariasSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full h-32 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  export function NoticiaIndividualSkeleton() {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        {/* Título */}
        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
  
        {/* Imagen principal */}
        <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
  
        {/* Meta info */}
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
  
        {/* Contenido */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-11/12"></div>
          <div className="h-4 bg-gray-300 rounded w-10/12"></div>
          <div className="h-4 bg-gray-300 rounded w-9/12"></div>
        </div>
      </div>
    );
  }
  