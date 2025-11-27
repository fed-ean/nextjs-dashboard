'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Noticia } from '@/app/lib/db';
import "./style-not-izquierda.css";

type Props = {
  noticia: Noticia;
  priority?: boolean;
};

export default function NoticiaSecundariaCard({ noticia, priority = false }: Props) {
  if (!noticia || !noticia.title) return null;

  const urlNoticia = `/Categorias/Noticias/${noticia.slug || ''}`;
  const tituloCorto = noticia.title.length > 80 ? noticia.title.substring(0, 80) + '...' : noticia.title;
  const imageUrl: string | undefined = noticia.sourceUrl;

  return (
    // El componente Link ahora es un elemento flex que crecerá para llenar el espacio.
    <Link href={urlNoticia} passHref className="flex-1 w-full">
      {/* 
        Contenedor de la tarjeta: Se eliminó la altura fija.
        Ahora tiene `h-full` para ocupar todo el espacio que le da el componente Link.
      */}
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group">
        {/* Imagen de fondo optimizada */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={noticia.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Sin Imagen</span>
          </div>
        )}

        {/* Degradado inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>

        {/* Contenedor del texto */}
        <div className="absolute bottom-0 left-0 p-4 z-20">
          <h3 className="text-xl font-alegreya-extrabold leading-snug text-white uppercase text-shadow-md">
            {tituloCorto}
          </h3>
        </div>
      </div>
    </Link>
  );
}
