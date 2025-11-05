// components/NoticiasVariasEstilizada.tsx
'use client';
import Link from 'next/link';
import React from 'react';

type Category = { name?: string; slug?: string; databaseId?: string|number };
type Noticia = any;

function stripHtml(html = '') { return String(html||'').replace(/<\/?[^>]+(>|$)/g,''); }
function toAbsoluteUrl(url: string|undefined, siteOrigin = 'https://radioempresaria.com.ar') {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `${siteOrigin.replace(/\/$/,'')}/${url.replace(/^\//,'')}`;
}

export default function NoticiasVariasEstilizada({
  noticia,
  showCategory = false,
  siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://radioempresaria.com.ar',
}: {
  noticia: Noticia;
  showCategory?: boolean;
  siteOrigin?: string;
}) {
  if (!noticia) return null;
  const title = noticia.titulo || noticia.title || 'Sin título';
  const urlNoticia = `/noticia/${noticia.slug || ''}`;

  const rawImage =
    noticia.imagenUrl ||
    noticia.featuredImage?.node?.sourceUrl ||
    noticia.featuredImage?.sourceUrl ||
    noticia.image?.src ||
    null;
  const imageSrcAbsolute = toAbsoluteUrl(rawImage||undefined, siteOrigin) || '/placeholder.png';

  const catNodes: Category[] = (noticia.categories && Array.isArray((noticia.categories as any).nodes) ? (noticia.categories as any).nodes : (Array.isArray(noticia.categories) ? noticia.categories : [])) || [];

  const fecha = noticia.fecha ? new Date(noticia.fecha).toLocaleDateString('es-AR',{ day:'2-digit', month:'short', year:'numeric' }) : (noticia.date ? new Date(noticia.date).toLocaleDateString('es-ar', { day: '2-digit', month: 'short', year: 'numeric'}) : null);
  const excerptText = noticia.excerpt ? stripHtml(noticia.excerpt).trim() : '';

  return (
    <article className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transform-gpu hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link href={urlNoticia} className="block flex flex-col flex-grow">
        {/* Imagen */}
        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
          <img src={imageSrcAbsolute} alt={title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='/placeholder.png'}} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
          {fecha && <time className="absolute right-3 top-3 z-20 text-xs text-white/90 bg-black/40 px-2 py-1 rounded-md">{fecha}</time>}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {showCategory && catNodes[0]?.name && (
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 block">
              {catNodes[0].name}
            </span>
          )}
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: title }} />
          {excerptText && <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{excerptText}</p>}
          
          <div className="mt-auto pt-4">
            <span className="text-sm font-medium text-blue-700 hover:underline">Leer más</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
