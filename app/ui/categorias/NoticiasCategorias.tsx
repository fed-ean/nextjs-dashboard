// components/NoticiasVariasEstilizada.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type Category = { name?: string; slug?: string; databaseId?: string|number };
type Tag = { name?: string; slug?: string };
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
  currentSectionSlug,
  siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://radioempresaria.com.ar'
}: { noticia: Noticia; currentSectionSlug?: string; siteOrigin?: string }) {
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

  // merge categories + tags
  const catNodes = (noticia.categories && Array.isArray((noticia.categories as any).nodes) ? (noticia.categories as any).nodes : (Array.isArray(noticia.categories) ? noticia.categories : [])) || [];
  const tagNodes = (noticia.tags && Array.isArray((noticia.tags as any).nodes) ? (noticia.tags as any).nodes : (Array.isArray(noticia.tags) ? noticia.tags : [])) || [];

  const mergedMap = new Map<string, { name: string; slug?: string }>();
  const push = (n?:string, s?:string) => { if(!n) return; const k=(s||n).toLowerCase(); if(!mergedMap.has(k)) mergedMap.set(k,{name:n,slug:s}); };
  catNodes.forEach((c:any)=>push(c.name,c.slug)); tagNodes.forEach((t:any)=>push(t.name,t.slug));
  let merged = Array.from(mergedMap.values());
  if (currentSectionSlug) {
    const idx = merged.findIndex(m => (m.slug||'').toLowerCase() === currentSectionSlug.toLowerCase());
    if (idx > 0) { const [f] = merged.splice(idx,1); merged = [f, ...merged]; }
  }

  const fecha = noticia.fecha ? new Date(noticia.fecha).toLocaleDateString('es-AR',{ day:'2-digit', month:'short', year:'numeric' }) : null;
  const excerptText = noticia.excerpt ? stripHtml(noticia.excerpt).trim() : '';

  return (
    <article className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transform-gpu hover:-translate-y-1 transition-all duration-300">
      <Link href={urlNoticia} className="block">
        {/* Imagen: ahora más alta para dar 'ancho visual' */}
        <div className="relative w-full" style={{ paddingBottom: '50%' /* ~2:1 -> imagen más ancha */ }}>
          {/* si usás next/image, descomenta y comenta el <img> */}
          {/* <Image src={imageSrcAbsolute} alt={title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover" /> */}
          <img src={imageSrcAbsolute} alt={title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='/placeholder.png'}} />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

          {/* badges: primera etiqueta grande + otras pequeñas */}
          <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
            {merged.slice(0,1).map((m,i)=>(
              <span key={i} className="inline-block bg-white/95 text-xs text-gray-900 font-semibold px-3 py-1 rounded-full shadow-sm backdrop-blur">
                {m.name}
              </span>
            ))}
            {merged.slice(1,4).map((m,i)=>(
              <span key={i} className="inline-block bg-white/80 text-[11px] text-gray-800 px-2 py-0.5 rounded-full border border-white/30">
                {m.name}
              </span>
            ))}
          </div>

          {fecha && <time className="absolute right-3 top-3 z-20 text-xs text-white/90 bg-black/40 px-2 py-1 rounded-md">{fecha}</time>}
        </div>

        <div className="p-5">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: title }} />
          {excerptText && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{excerptText}</p>}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700 hover:underline">Leer más</span>
            <div className="flex gap-2 items-center">
              {merged.slice(0,5).map((m,i)=>(
                <span key={i} className="text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm">{m.name}</span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
