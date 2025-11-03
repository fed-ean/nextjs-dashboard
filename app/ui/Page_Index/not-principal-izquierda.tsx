// components/NoticiaPrincipalIzquierda.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import './style-not-izquierda.css'; // Asegúrate de que este CSS existe
import '../../fonts.css';

export default function NoticiaPrincipalIzquierda({ noticia }) {
    if (!noticia) return null;

    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;

    return (
        // Contenedor principal de la columna izquierda (ocupa 7/12 para dejar espacio a la derecha)
        // Puedes ajustar el ancho de la columna según tu diseño final.
        <div className="w-full md:w-7/12 p-4">
            <Link href={urlNoticia} passHref> {/* `passHref` y `legacyBehavior` no son necesarios con Link moderno */}
                {/* EL CONTENEDOR DE LA IMAGEN DEBE SER RELATIVO Y TENER UN ALTO FIJO/MINIMO.
                  Añadimos 'group' para efectos de hover en el Link.
                */}
                <div className="relative h-[300px] md:h-full w-full overflow-hidden rounded-lg shadow-lg cursor-pointer group">
                    
                    {/* IMAGEN OPTIMIZADA CON NEXT/IMAGE Y 'FILL' */}
                    <Image
                        src={noticia.imagenUrl}
                        alt={noticia.titulo}
                        fill // La imagen se expande para llenar el padre
                        style={{ objectFit: 'cover' }} // Para que la imagen cubra sin distorsionarse
                        className="transition-transform duration-300 group-hover:scale-105" // Efecto hover
                        priority={true} // Prioridad para la imagen principal
                    />

                    {/* OVERLAY OSCURO PARA MEJORAR LA LEGIBILIDAD DEL TEXTO */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

                    {/* CONTENIDO DE TEXTO (TITULO Y CATEGORIA) */}
                    <div className="absolute bottom-0 left-0 z-20 text-container">
                        {/* Puedes añadir la categoría si la tienes en `noticia.categoria` */}
                        {/* <span className="bg-blue-600 px-3 py-1 text-sm uppercase tracking-widest rounded mb-2 inline-block">
                            {noticia.categoria || 'SECCIONES'} 
                        </span> */}
                        <h2 className="text-3xl md:text-4xl font-bold titillium-web-regular text-white">
                            {noticia.titulo}
                        </h2>
                        {/* Opcional: Autor y Leer Más */}
                        {/* <div className="mt-2 text-sm text-gray-300">
                            by Radio Empresaria <span className="ml-4">READ MORE →</span>
                        </div> */}
                    </div>
                </div>
            </Link>
        </div>
    );
}