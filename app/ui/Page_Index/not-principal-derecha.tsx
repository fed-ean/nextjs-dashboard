// components/NoticiaSecundariaCard.js
'use client'; // Usamos Link y manejo de eventos/hovers, por lo que es un cliente

import Image from 'next/image';
import Link from 'next/link'; 
import "./style-not-izquierda.css";
// Asegúrate de importar tus estilos si son externos
// import "./style-noticias.css"; 

export default function NoticiaSecundariaCard({ noticia }){
    if (!noticia) return null;

    // Se asume que la noticia tiene slug, id e imagenUrl.
    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`; 
    // Truncamos el título para que quepa bien en el espacio pequeño.
    const tituloCorto = noticia.titulo.length > 80 ? noticia.titulo.substring(0, 80) + '...' : noticia.titulo;

    return(
        // El Link envuelve toda la card para hacerla clickeable
        <Link href={urlNoticia} passHref>
            {/* CONTENEDOR DE LA CARD:
              - relative: Requerido para que Image fill funcione.
              - h-[200px]: VITAL para darle una altura visible y fija a la tarjeta.
              - w-full: Ocupa todo el ancho del contenedor padre (w-5/12 en page.js).
            */}
            <div className="relative h-[250px] w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group mt-2">
                
                {/* IMAGEN OPTIMIZADA */}
                <Image 
                    src={noticia.imagenUrl} 
                    alt={noticia.titulo} 
                    fill // Se estira para llenar el contenedor padre (200px de alto)
                    style={{ objectFit: 'cover' }} // Asegura que no se distorsione
                    className="transition-transform duration-300 group-hover:scale-105" // Efecto de zoom
                    priority={false} // No es de máxima prioridad
                />
                
                {/* OVERLAY OSCURO (z-10) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>

                {/* CONTENIDO DE TEXTO (z-20) */}
                <div className="absolute bottom-0 left-0 p-4 z-20 text-container">
                    <h3 className="text-xl font-bold titillium-web-regular leading-snug">
                        {tituloCorto}
                    </h3>
                </div>
            </div>
        </Link>
    );
};