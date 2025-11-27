'use client';

import Image from 'next/image';
import Link from 'next/link';
import './style-not-izquierda.css';
// Se importa el CSS que contiene las variables de altura para el Hero.
import './style-noticias.css'; 
import '../../fonts.css';
import { Noticia } from '@/app/lib/db';

// Componente rediseñado para la noticia principal, ahora con altura responsiva.
export default function NoticiaPrincipalIzquierda({ noticia }: { noticia: Noticia | null }) {
    if (!noticia) return null;

    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;
    const imageUrl = noticia.sourceUrl;
    const title = noticia.title || 'Título no disponible';
    const authorName = 'RadioEmpresaria';

    return (
        <div className="w-full md:w-7/12">
            <Link href={urlNoticia} passHref>
                {/* 
                  CORRECCIÓN: Se reemplaza la altura fija en píxeles (h-[450px] md:h-[550px]) 
                  por las variables CSS responsivas del proyecto (vh), asegurando 
                  que el componente se adapte correctamente a diferentes tamaños de pantalla.
                */}
                <div className="relative h-[var(--hero-height-mobile)] md:h-[var(--hero-height-tablet)] lg:h-[var(--hero-height-desktop)] w-full overflow-hidden rounded-lg shadow-2xl cursor-pointer group">
                    
                    {/* Imagen de Fondo Optimizada */}
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
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <span className="text-gray-500">Sin Imagen Disponible</span>
                        </div>
                    )}

                    {/* Overlay de degradado inferior */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>

                    {/* Contenido de texto superpuesto */}
                    <div className="absolute bottom-0 left-0 z-20 p-5 md:p-8 text-white w-full">
                        
                        {/* Badges de Categorías */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {noticia.categories?.nodes?.map((category) => (
                                <span 
                                    key={category.slug} 
                                    className="bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1 rounded-sm shadow-md"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>

                        {/* Título de Alto Impacto */}
                        <h2 
                            className="text-3xl md:text-4xl lg:text-5xl font-alegreya-extrabold text-white text-shadow-lg leading-tight"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />

                        {/* Metadatos y Call-to-Action */}
                        <div className="mt-4 text-sm font-semibold tracking-wider uppercase flex items-center">
                            <span>Por {authorName}</span>
                            <span className="mx-3">|</span>
                            <span className="font-bold text-orange-400 group-hover:translate-x-1 transition-transform duration-200">
                                LEER MÁS →
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
