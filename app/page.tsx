
import { Suspense } from 'react';
export const dynamic = 'force-dynamic'


// Componentes de UI y Skeletons
// YA NO SE IMPORTA NADA RELACIONADO CON SIDENAV
import { 
  GridNoticiasPrincipalesSkeleton, 
  CarouselNoticiasSkeleton, 
  ReporteNoticiasSkeleton, 
  SeccionNoticiasVariasSkeleton 
} from './ui/skeletons';

import Typewriter from "./ui/components/maquinaDeEscribir";
import GridNoticiasPrincipales from './ui/Page_Index/GridNoticiasPrincipales';
import DesayunoPymesSection from './ui/Page_Index/DesayunoPymesSection';
import ReporteInternacionalServer from './ui/Page_Index/ReporteInternacional.server'; 
import SeccionNoticiasVarias from './ui/Page_Index/SeccionNoticiasVarias';

import './fonts.css';

export default function Page() {
  return(
    // LAYOUT DE UNA SOLA COLUMNA: Eliminamos Grid y Flexbox, es un flujo simple.
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* --- CONTENIDO PRINCIPAL A ANCHO COMPLETO --- */}
      <main className="w-full">
        <header className="py-12 px-6">
          <h1 className="font-extrabold leading-tight text-xl sm:text-xl md:text-xl lg:text-3xl max-w-full">        
            <Typewriter
              phrases={["DIFUSIÓN y ANÁLISIS DE LAS PYMES", "SOMOS LA VOZ DEL SECTOR PRODUCTIVO"]}
            />
          </h1>
        </header>
        <h2 className="titullium-web-semibold uppercase text-xl">Noticias Principales</h2>
        
        <Suspense fallback={<GridNoticiasPrincipalesSkeleton />}>
          <GridNoticiasPrincipales />
        </Suspense>

        <Suspense fallback={<CarouselNoticiasSkeleton />}>
          <DesayunoPymesSection />
        </Suspense>

        <Suspense fallback={<ReporteNoticiasSkeleton />}>
          <ReporteInternacionalServer />
        </Suspense>
        
        <Suspense fallback={<SeccionNoticiasVariasSkeleton />}>
          <SeccionNoticiasVarias />
        </Suspense>
      </main>

      {/* --- NO HAY SIDENAV AQUÍ --- */}

    </div>
  );
}
