import { obtenerNoticias } from '@/app/lib/db';
import NoticiaPrincipalIzquierda from '@/app/ui/Page_Index/not-principal-izquierda';
import NoticiaSecundariaCard from '@/app/ui/Page_Index/not-principal-derecha';

export default async function GridNoticiasPrincipales() {
  // Obtenemos las 3 noticias necesarias para la grilla.
  const noticiasRaw = await obtenerNoticias({ limit: 3 });

  const noticiaPrincipal = noticiasRaw[0] || null;
  const noticiasSecundarias = noticiasRaw.slice(1, 3) || []; // Nos aseguramos de tomar solo 2.

  return (
    // Contenedor principal que alinea la noticia principal y las secundarias.
    <div className="flex flex-col md:flex-row w-full">
      
      {/* Columna Izquierda: Noticia Principal */}
      {noticiaPrincipal && (
        <NoticiaPrincipalIzquierda noticia={noticiaPrincipal} />
      )}

      {/* 
        Columna Derecha: Noticias Secundarias.
        Este contenedor se convierte en una columna flexible que ocupa toda la altura,
        distribuyendo el espacio entre sus hijos para lograr una alineación perfecta.
      */}
      <div className="w-full md:w-5/12 p-4 flex flex-col justify-between">
        {noticiasSecundarias.map((noticia, index) => (
          <NoticiaSecundariaCard
            key={noticia.databaseId}
            noticia={noticia}
            // Damos prioridad a la primera imagen secundaria para el LCP.
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
