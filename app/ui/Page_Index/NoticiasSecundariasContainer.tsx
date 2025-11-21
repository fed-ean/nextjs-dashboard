"use client";

import NoticiaSecundariaCard from './not-principal-derecha';
import { Noticia } from '@/app/lib/db';

interface NoticiasSecundariasProps {
  noticiasSecundarias: Noticia[];
}

export default function NoticiasSecundariasContainer({ noticiasSecundarias }: NoticiasSecundariasProps) {
  if (!noticiasSecundarias || noticiasSecundarias.length === 0) return null;

  return (
    <div className="w-full md:w-5/12 p-4 flex flex-col gap-4">
      {noticiasSecundarias.slice(0, 2).map((noticia, index) => (
        <NoticiaSecundariaCard key={noticia.databaseId || index} noticia={noticia} />
      ))}
    </div>
  );
}
