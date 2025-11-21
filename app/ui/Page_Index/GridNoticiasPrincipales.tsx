'use client';

import { obtenerNoticias } from '@/app/lib/db';
import NoticiaPrincipalIzquierda from '@/app/ui/Page_Index/not-principal-izquierda';
import NoticiaSecundariaCard from '@/app/ui/Page_Index/not-principal-derecha';
import { Noticia } from '@/app/lib/types'; // Asegúrate de importar el tipo correcto

export default async function GridNoticiasPrincipales() {
  const noticiasRaw: Noticia[] = await obtenerNoticias({ limit: 4 });

  const noticiaPrincipal = noticiasRaw[0] || null;
  const noticiasSecundarias = noticiasRaw.slice(1, 4) || [];

  return (
    <div className="flex flex-wrap md:flex-nowrap md:min-h-[500px] 2xl:h-[820px]">
      {/* Tarjeta principal */}
      {noticiaPrincipal && <NoticiaPrincipalIzquierda noticia={noticiaPrincipal} />}

      {/* Contenedor de noticias secundarias */}
      <div className="w-full md:w-5/12 p-4 flex flex-col flex-1 gap-4">
        {noticiasSecundarias[0] && (
          <NoticiaSecundariaCard
            key={noticiasSecundarias[0].databaseId} // Usa databaseId
            noticia={noticiasSecundarias[0]}
            priority={true}
          />
        )}

        {noticiasSecundarias[2] && (
          <div className="hidden fhd:block my-auto">
            <NoticiaSecundariaCard
              key={noticiasSecundarias[2].databaseId}
              noticia={noticiasSecundarias[2]}
            />
          </div>
        )}

        {noticiasSecundarias[1] && (
          <div className="mt-auto">
            <NoticiaSecundariaCard
              key={noticiasSecundarias[1].databaseId}
              noticia={noticiasSecundarias[1]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
