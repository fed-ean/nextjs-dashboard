'use client';

import Image from 'next/image';
import Link from 'next/link';
import './style-not-izquierda.css';
import '../../fonts.css';
import { Noticia } from '@/app/lib/db'; // Importa el tipo Noticia

// Se tipa explícitamente el prop `noticia`
export default function NoticiaPrincipalIzquierda({ noticia }: { noticia: Noticia | null }) {
    if (!noticia) return null;

    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;
    const imageUrl = noticia.featuredImage?.node?.sourceUrl;
    const title = noticia.title || 'Título no disponible';

    return (
        <div className="w-full md:w-7/12 p-4">
            <Link href={urlNoticia} passHref>
                <div className="relative h-[300px] md:h-full w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group">
                    
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-300 group-hover:scale-105"
                            priority={true}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">Sin Imagen</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

                    <div className="absolute bottom-0 left-0 z-20 text-container">
                        <h2 className="text-3xl md:text-4xl font-alegreya-extrabold text-white">
                            {title}
                        </h2>
                    </div>
                </div>
            </Link>
        </div>
    );
}
