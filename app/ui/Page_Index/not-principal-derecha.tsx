'use client';

import Image from 'next/image';
import Link from 'next/link';
import "./style-not-izquierda.css";

type Noticia = {
  databaseId: string | number;
  slug?: string;
  title?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    }
  };
  categories?: {
    nodes?: {
      name: string;
      slug: string;
    }[]
  };
};

type Props = {
  noticia: Noticia;
  priority?: boolean;
};

export default function NoticiaSecundariaCard({ noticia, priority = false }: Props) {
  if (!noticia || !noticia.title) return null;

  const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;
  const tituloCorto = noticia.title.length > 80 ? noticia.title.substring(0, 80) + '...' : noticia.title;
  const imageUrl = noticia.featuredImage?.node?.sourceUrl;

  return (
    <Link href={urlNoticia} passHref>
      <div className="relative h-[250px] w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group mt-2">
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>

        <div className="absolute bottom-0 left-0 p-4 z-20 text-container">
          <h3 className="text-xl font-alegreya-extrabold leading-snug">
            {tituloCorto}
          </h3>
        </div>
      </div>
    </Link>
  );
}
