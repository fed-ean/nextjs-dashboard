// components/NoticiaSecundariaCard.js
'use client'; // Usamos Link y manejo de eventos/hovers, por lo que es un cliente

import Image from 'next/image';
import Link from 'next/link'; 
import "./style-not-izquierda.css";
// Asegúrate de importar tus estilos si son externos
// import "./style-noticias.css"; 

export default function NoticiaSecundariaCard({ noticia, priority = false }){
    // Añadimos una comprobación de seguridad por si la noticia o el título no existen.
    if (!noticia || !noticia.title) return null;

    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;
    
    // Usamos `noticia.title` en lugar de `noticia.titulo`.
    const tituloCorto = noticia.title.length > 80 ? noticia.title.substring(0, 80) + '...' : noticia.title;
    
    // Obtenemos la URL de la imagen del objeto `featuredImage`.
    const imageUrl = noticia.featuredImage?.node?.sourceUrl;

    return(
        <Link href={urlNoticia} passHref>
            <div className="relative h-[250px] w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group mt-2">
                
                {/* Si la URL de la imagen existe, la mostramos. Si no, mostramos un placeholder. */}
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt={noticia.title} // Usamos `noticia.title`
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
};