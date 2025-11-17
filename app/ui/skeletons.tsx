const shimmer = `before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent`;

// --- Skeleton para la tarjeta de noticia principal del GRID SUPERIOR ---
function NoticiaPrincipalGridSkeleton() {
  return (
    <div className={`${shimmer} relative w-full md:w-7/12 p-4`}>
      <div className="h-full rounded-lg bg-gray-800"></div>
    </div>
  );
}

// --- Skeleton para la tarjeta de noticia secundaria del GRID SUPERIOR ---
function NoticiaSecundariaGridSkeleton() {
  return (
    <div className={`${shimmer} relative bg-gray-800 rounded-lg h-48`}>
    </div>
  );
}

// --- Skeleton para el GRID COMPLETO de noticias principales ---
export function GridNoticiasPrincipalesSkeleton() {
  return (
    <div className="flex flex-wrap md:flex-nowrap md:min-h-[500px] 2xl:h-[820px]">
      <NoticiaPrincipalGridSkeleton />
      <div className="w-full md:w-5/12 p-4 flex flex-col flex-1 gap-4">
        <NoticiaSecundariaGridSkeleton />
        <NoticiaSecundariaGridSkeleton />
      </div>
    </div>
  );
}


// --- Skeleton para la tarjeta de noticias varias ---
function NoticiaVariasSkeleton() {
  return (
      <div className={`${shimmer} relative aspect-video bg-gray-800 rounded-lg`}></div>
  );
}

// --- Skeleton para la SECCIÓN COMPLETA de noticias varias ---
export function SeccionNoticiasVariasSkeleton() {
  return (
    <section className="container mx-auto px-4 mt-10">
      <div className="h-8 w-48 bg-gray-700 rounded-md mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
      </div>
    </section>
  )
}


// --- Skeleton para el carrusel principal ---
export function CarouselNoticiasSkeleton() {
  return (
    <section className="container mx-auto px-4 mt-10">
      <div className="h-8 w-48 bg-gray-700 rounded-md mb-4"></div>
      <div className={`${shimmer} relative w-full h-[300px] bg-gray-800 overflow-hidden rounded-lg`}>
      </div>
    </section>
  )
}

// --- Skeleton COMPLETO para una sección de noticias (Reporte Internacional) ---
export function ReporteNoticiasSkeleton() {
    // Re-usamos los skeletons del grid superior ya que son muy similares
  return (
    <section className="container mx-auto px-4 mt-10">
      <div className="h-9 w-64 bg-gray-700 rounded-md mb-6"></div>
      <div className={`${shimmer} relative h-80 rounded-2xl overflow-hidden shadow-2xl bg-gray-800 mb-6`}></div>
      <div className="flex justify-center">
        <div className="grid w-full max-w-3xl grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${shimmer} relative aspect-square rounded-xl bg-gray-800`}></div>
          <div className={`${shimmer} relative aspect-square rounded-xl bg-gray-800`}></div>
          <div className={`${shimmer} relative aspect-square rounded-xl bg-gray-800`}></div>
        </div>
      </div>
    </section>
  );
}

// --- Skeleton para una PÁGINA DE CATEGORÍA COMPLETA ---
export function PaginaCategoriaSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Placeholder para el título de la categoría */}
      <div className={`h-10 w-1/3 bg-gray-700 rounded-md mb-8 ${shimmer} overflow-hidden`}></div>

      {/* Grid de noticias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
        <NoticiaVariasSkeleton />
      </div>

      {/* Placeholder para la paginación */}
      <div className="flex justify-center mt-12">
        <div className={`flex items-center gap-4 ${shimmer} overflow-hidden`}>
            <div className="h-10 w-24 bg-gray-700 rounded-md"></div>
            <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

// --- Skeleton para una PÁGINA DE NOTICIA INDIVIDUAL ---
export function NoticiaIndividualSkeleton() {
  return (
    <div>
      {/* Hero Section Skeleton */}
      <div className={`${shimmer} relative overflow-hidden w-full h-80 md:h-96 bg-gray-800`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-end max-w-5xl mx-auto p-6 md:p-10">
          <div className="w-full space-y-4">
            <div className="h-5 w-1/4 bg-gray-700 rounded-lg" />
            <div className="h-10 w-3/4 bg-gray-700 rounded-lg" />
            <div className="h-10 w-1/2 bg-gray-700 rounded-lg" />
            <div className="h-5 w-1/3 bg-gray-700 rounded-lg mt-2" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="content-container">
        <article className="bg-white rounded-xl shadow-xl p-6 md:p-10 prose max-w-none">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-full`} />
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-11/12`} />
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-full`} />
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-5/6`} />
            </div>
            <div className={`${shimmer} relative h-72 bg-gray-200 rounded-lg overflow-hidden`} />
            <div className="space-y-3">
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-full`} />
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-5/6`} />
              <div className={`${shimmer} relative h-4 bg-gray-200 rounded overflow-hidden w-full`} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
