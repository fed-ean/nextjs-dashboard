
import { Suspense } from 'react';
import SidenavServer from '../ui/Page_Index/SidenavServer';
import { SidenavSkeleton } from '../ui/skeletons';

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    // SOLUCIÓN DEFINITIVA:
    // 1. En móvil es `flex-col` (orden natural: main, luego aside).
    // 2. En desktop es `flex-row-reverse`, que invierte el orden visual (aside a la izquierda, main a la derecha).
    <div className="flex flex-col md:flex-row-reverse max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* --- CONTENIDO PRINCIPAL (derecha en desktop, arriba en móvil) --- */}
      {/* Es el primero en el DOM para el orden en móvil */}
      <main className="w-full">
        {children}
      </main>

      {/* --- BARRA LATERAL (izquierda en desktop, abajo en móvil) --- */}
      {/* Es el segundo en el DOM, pero `flex-row-reverse` lo pone a la izquierda en desktop */}
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
