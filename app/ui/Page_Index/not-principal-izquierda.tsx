// components/NoticiaPrincipalIzquierda.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import './style-not-izquierda.css'; // Asegúrate de que este CSS existe
import '../../fonts.css';

export default function NoticiaPrincipalIzquierda({ noticia }) {
    // Comprobación de seguridad: si no hay noticia, no se renderiza nada.
    if (!noticia) return null;

    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;
    // Se usa la estructura de datos CORRECTA: `featuredImage.node.sourceUrl`
    const imageUrl = noticia.featuredImage?.node?.sourceUrl;
    // Se usa `title` en lugar de `titulo` y se añade un fallback.
    const title = noticia.title || 'Título no disponible';

    return (
        <div className="w-full md:w-7/12 p-4">
            <Link href={urlNoticia} passHref>
                <div className="relative h-[300px] md:h-full w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group">
                    
                    {/* RENDERIZADO CONDICIONAL DE LA IMAGEN */}
                    {imageUrl ? (
                        <Image
                            src={imageUrl} // Se usa la URL correcta y verificada
                            alt={title}    // Se usa el título correcto
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-300 group-hover:scale-105"
                            priority={true}
                        />
                    ) : (
                        // Si no hay imagen, se muestra un placeholder para evitar errores.
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">Sin Imagen</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

                    <div className="absolute bottom-0 left-0 z-20 text-container">
                        <h2 className="text-3xl md:text-4xl font-alegreya-extrabold text-white">
                            {title} {/* Se usa el título correcto */}
                        </h2>
                    </div>
                </div>
            </Link>
        </div>
    );
}