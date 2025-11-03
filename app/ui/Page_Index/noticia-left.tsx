'use client';

import Image from 'next/image';
import Link from 'next/link';
import './style-not-izquierda.css';
import '../../fonts.css';

type Noticia = {
  slug?: string;
  titulo?: string;
  title?: string;
  content?: string;
  imagenUrl?: string;
  excerpt?: string;
  fecha?: string; // iso o texto
  categories?: { nodes?: Category[] } | Category[] | string[];
  [k: string]: any;
};

export default function NoticiaLeft({ noticia }: { noticia: Noticia }) {

    const urlNoticia = `/Categorias/Noticias/${noticia.slug}`;

    return (
        <div className="w-full md:w-9/12 border rounded-lg mt-3 mx-auto">
    <Link href={urlNoticia}>
        <div className="flex flex-col md:flex-row items-start gap-6 cursor-pointer rounded-lg shadow-lg overflow-hidden group p-0">
            
            {/* Imagen a la izquierda */}
            <div className="relative w-full md:w-1/2 h-[300px]">
                <Image
                    src={noticia.imagenUrl}
                    alt={noticia.titulo}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                />
            </div>

            {/* Texto a la derecha (centrado) */}
            <div className="flex-1 flex flex-col text-start h-[300px]">
    <h2 className="text-1xl md:text-2xl font-bold titillium-web-regular leading-tight text-gray-900 pt-6 pe-4 group-hover:text-blue-700 hover:underline transition-colors duration-300 m-0 overflow-hidden text-ellipsis">
        {noticia.titulo}
    </h2>
    <p className="text-1xl md:text-2xl font-bold titillium-web-regular pe-4 pt-2 m-0 leading-tight text-red-600 group-hover:text-blue-700 hover:underline transition-colors duration-300 overflow-hidden text-ellipsis line-clamp-3">
        {/* {noticia.content} */}
    </p>
</div>

        </div>
    </Link>
</div>
    );
}
