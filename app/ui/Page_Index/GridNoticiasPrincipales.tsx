import { obtenerNoticias } from '@/app/lib/db.ts';
import NoticiaPrincipalIzquierda from '@/app/ui/Page_Index/not-principal-izquierda';
import NoticiaSecundariaCard from '@/app/ui/Page_Index/not-principal-derecha';

export default async function GridNoticiasPrincipales() {
  const noticiasRaw = await obtenerNoticias({ limit: 4 });

  const noticiaPrincipal = noticiasRaw[0] || null;
  const noticiasSecundarias = noticiasRaw.slice(1, 4) || [];

  return (
    <div className="flex flex-wrap md:flex-nowrap md:min-h-[500px] 2xl:h-[820px]"> 
      <NoticiaPrincipalIzquierda noticia={noticiaPrincipal}/>
      
      <div className="w-full md:w-5/12 p-4 flex flex-col flex-1 gap-4">
        {noticiasSecundarias[0] && (
          <NoticiaSecundariaCard
            key={noticiasSecundarias[0].id}
            noticia={noticiasSecundarias[0]}
            priority={true}
          />
        )}
        {noticiasSecundarias[2] && (
          <div className="hidden fhd:block my-auto">
            <NoticiaSecundariaCard
              key={noticiasSecundarias[2].id}
              noticia={noticiasSecundarias[2]}
            />
          </div>
        )}
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
  );
}
