'use client';

import NoticiaSecundariaCard from './not-principal-derecha';
import { Noticia } from '@/app/lib/db';

type Props = {
  noticiasSecundarias: Noticia[];
};

export default function NoticiasSecundariasContainer({ noticiasSecundarias }: Props) {
  // Si no hay datos, retorna null
  if (!noticiasSecundarias || noticiasSecundarias.length === 0) return null;

  return (
    <div className="w-full md:w-5/12 p-4 flex flex-col gap-4">
      {noticiasSecundarias.slice(0, 2).map((noticia, index) => (
        <NoticiaSecundariaCard
          key={noticia.databaseId || index}
          noticia={noticia}
        />
      ))}
    </div>
  );
}
