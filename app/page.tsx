import { Suspense } from 'react';
import Link from 'next/link';

// --- Componentes que NO necesitan carga de datos ---
import Typewriter from "./ui/components/maquinaDeEscribir";


// --- Componentes ASÍNCRONOS (cargan datos) ---
import GridNoticiasPrincipales from './ui/Page_Index/GridNoticiasPrincipales';
import DesayunoPymesSection from './ui/Page_Index/DesayunoPymesSection';
// CORRECCIÓN: Importamos el nuevo componente de SERVIDOR
import ReporteInternacionalServer from './ui/Page_Index/ReporteInternacional.server'; 
import SeccionNoticiasVarias from './ui/Page_Index/SeccionNoticiasVarias';

// --- SKELETONS para el fallback de Suspense ---
import { 
  GridNoticiasPrincipalesSkeleton, 
  CarouselNoticiasSkeleton, 
  ReporteNoticiasSkeleton, 
  SeccionNoticiasVariasSkeleton 
} from './ui/skeletons';

// --- Estilos ---
import './fonts.css';


export default function Page() {

  return(
    <>
      <main className="mx-1">
        <header className="py-12 px-6">
          <h1 className="font-extrabold leading-tight
                         text-xl sm:text-xl md:text-xl lg:text-3xl
                         max-w-full">        
            <Typewriter
              phrases={["DIFUSIÓN y ANÁLISIS DE LAS PYMES", "SOMOS LA VOZ DEL SECTOR PRODUCTIVO"]}
            />
          </h1>
        </header>
        <h2 className="titullium-web-semibold">Noticias Principales</h2>
        
        {/* --- CARGA DEL GRID DE NOTICIAS PRINCIPALES --- */}
        <Suspense fallback={<GridNoticiasPrincipalesSkeleton />}>
          <GridNoticiasPrincipales />
        </Suspense>

      </main>

      {/* --- CARGA DEL CARRUSEL DESAYUNO PYMES --- */}
      <Suspense fallback={<CarouselNoticiasSkeleton />}>
        <DesayunoPymesSection />
      </Suspense>

      {/* --- CARGA DEL REPORTE INTERNACIONAL --- */}
      <Suspense fallback={<ReporteNoticiasSkeleton />}>
        {/* CORRECCIÓN: Usamos el nuevo componente de SERVIDOR */}
        <ReporteInternacionalServer />
      </Suspense>
      
      {/* --- CARGA DE LAS NOTICIAS VARIAS --- */}
      <Suspense fallback={<SeccionNoticiasVariasSkeleton />}>
        <SeccionNoticiasVarias />
      </Suspense>
    </>
  );
}
