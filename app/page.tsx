import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { obtenerNoticias, obtenerNoticiasPorCategoria } from './lib/db';
import { getClient } from "./lib/cliente";
import { gql } from "@apollo/client";
import Link from 'next/link';
import EnVivo from './ui/Page_Index/envivo';
import RadioPlayer from './ui/Reproductor';
import Typewriter from "./ui/components/maquinaDeEscribir";
import NoticiaSecundariaCard from './ui/Page_Index/not-principal-derecha';
import NoticiaPrincipalIzquierda from './ui/Page_Index/not-principal-izquierda';
import NoticiasVarias from './ui/Page_Index/noticias-varias';
import NoticiasVariasEstilizada from "./ui/Page_Index/noticias-varias-page";
import CarouselNoticias from './ui/Page_Index/CarouselNoticias';
import './fonts.css';
import './ui/Page_Index/style-index.css';

export default async function Page() {
  const noticiasRaw = await obtenerNoticias({ limit: 15 }); 
  const noticiasDesayunoPymes = await obtenerNoticiasPorCategoria({ limit: 10, categoryName: "Desayuno Pymes" });

  const noticiaPrincipal = noticiasRaw[0] || null;
  const noticiasSecundarias = noticiasRaw.slice(1, 4) || [];
  const demasNoticias = noticiasRaw.slice(3);

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
        
        {/*
          CLAVE: Este flex ahora contiene la izquierda y el contenedor DERECHO de las secundarias.
        */}
        <div className="flex flex-wrap md:flex-nowrap md:min-h-[500px] 2xl:h-[820px]"> 
          
          {/* COLUMNA IZQUIERDA: Noticia Principal (asume ancho w-7/12) */}
          <NoticiaPrincipalIzquierda noticia={noticiaPrincipal}/>
          
          {/* COLUMNA DERECHA: Contenedor para las dos Noticias Secundarias */}
          {/* Aplicamos w-5/12 y el layout flex-col directamente aquí.
             Esto garantiza que la columna tenga ancho y se coloque al lado de la principal.
          */}
          <div className="w-full md:w-5/12 p-4 flex flex-col flex-1 gap-4">
  {/* Tarjeta 1 - arriba */}
  {noticiasSecundarias[0] && (
    <NoticiaSecundariaCard
      key={noticiasSecundarias[0].id}
      noticia={noticiasSecundarias[0]}
      priority={true}
    />
  )}

  {/* Tarjeta 3 - solo visible en FHD */}
  {noticiasSecundarias[2] && (
    <div className="hidden fhd:block my-auto">
      <NoticiaSecundariaCard
        key={noticiasSecundarias[2].id}
        noticia={noticiasSecundarias[2]}
      />
    </div>
  )}

  {/* Tarjeta 2 - abajo */}
  {noticiasSecundarias[1] && (
    <div className="mt-auto">
      <NoticiaSecundariaCard
        key={noticiasSecundarias[1].id}
        noticia={noticiasSecundarias[1]}
      />
    </div>
  )}
</div>
          
        </div>
      </main>

      <section className="container mx-auto px-4 mt-10">
        <h2 className="titillium-web-semibold p-0">Desayuno Pymes</h2>
        <CarouselNoticias noticias={noticiasDesayunoPymes} slidesPerView={1} />
      </section>
      
       <section className="container mx-auto px-4 mt-10">
        <h2 className="titillium-web-semibold">Noticias Varias</h2>
        {/* Usamos un grid para el listado de noticias varias, lo cual es más robusto que flex-wrap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 noticias-varias">
          {demasNoticias.map(noticia => (
            // Asumo que 'NoticiasVarias' es el componente 'NoticiaEstandarCard' renombrado
            <NoticiasVariasEstilizada key={noticia.id} noticia={noticia} /> 
          ))}
        </div>
      </section>
    </>
  );
}
