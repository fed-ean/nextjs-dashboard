'use client';

import Image from 'next/image';
import Link from 'next/link';

type Noticia = {
  slug?: string;
  titulo?: string;
  imagenUrl?: string;
  fechaPublicacion?: string;
  excerpt?: string;
  categories?: { nodes?: { name?: string; slug?: string }[] };
  [k: string]: any;
};

export default function CarouselCard({ noticia }: { noticia: Noticia }) {
  if (!noticia) {
    return null;
  }

  const { slug, titulo, imagenUrl, fechaPublicacion, excerpt, categories } = noticia;
  const formattedDate = fechaPublicacion
    ? new Date(fechaPublicacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Fecha no disponible';

  const getExcerpt = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const limitedExcerpt = getExcerpt(excerpt || '', 30);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto" style={{ minHeight: '400px' }}>
      {/* Columna de la Imagen */}
      <div className="md:w-1/2 relative">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={`Imagen de la noticia ${titulo}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Imagen no disponible</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {categories?.nodes?.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Columna del Contenido */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h3 className="text-3xl font-bold mb-4 text-gray-800 hover:text-blue-600 transition-colors">
          <Link href={`/Categorias/Noticias/${slug}`}>{titulo}</Link>
        </h3>
        
        <div
          className="text-gray-600 mb-6 excerpt-container"
          dangerouslySetInnerHTML={{ __html: limitedExcerpt || '' }}
        />

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            by RadioEmpresaria | <time>{formattedDate}</time>
          </span>
          <Link href={`/Categorias/Noticias/${slug}`} className="text-blue-600 hover:text-blue-800 transition-colors font-semibold">
            READ MORE →
          </Link>
        </div>
      </div>
    </div>
  );
}
