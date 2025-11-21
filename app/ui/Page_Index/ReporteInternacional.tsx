// app/ui/Page_Index/ReporteInternacional.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { obtenerNoticiasPorCategoria, Noticia } from '@/app/lib/db';

// --- TARJETA PRINCIPAL ---
function NoticiaPrincipalCard({ noticia }: { noticia: Noticia }) {
  const imageUrl = noticia.imagenUrl;
  const title = noticia.title || 'Título no disponible';

  return (
    <Link href={`/Categorias/Noticias/${noticia.slug}`} className="block group">
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl bg-gray-800">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/10 p-6 flex flex-col justify-between text-white">
          <div>
            {noticia.categories?.nodes && (
              <div className="flex flex-col items-start gap-2">
                {noticia.categories.nodes.map(cat => (
                  <span key={cat.slug} className="bg-indigo-500 text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-xl border border-white/20">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h3 className="text-4xl font-black leading-tight line-clamp-3 [text-shadow:_3px_3px_6px_rgba(0,0,0,0.8)]">{title}</h3>
        </div>
      </div>
    </Link>
  );
}

// --- TARJETA SECUNDARIA ---
function NoticiaSecundariaCard({ noticia }: { noticia: Noticia }) {
  const imageUrl = noticia.imagenUrl;
  const title = noticia.title || 'Título no disponible';

  return (
    <Link href={`/Categorias/Noticias/${noticia.slug}`} className="block group">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 opacity-70 group-hover:opacity-90"
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-between">
          {noticia.categories?.nodes && (
            <div className="flex flex-col items-start gap-1.5">
              {noticia.categories.nodes.map(cat => (
                <span key={cat.slug} className="bg-indigo-500/95 text-white text-xs font-bold px-2 py-1 rounded shadow-lg border border-white/10">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          <h4 className="text-white font-bold text-base leading-tight line-clamp-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.9)]">{title}</h4>
        </div>
      </div>
    </Link>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default async function ReporteInternacional() {
  const noticias: Noticia[] = await obtenerNoticiasPorCategoria({
    limit: 4,
    categoryName: "Internacional",
  });

  if (!noticias || noticias.length < 4) return null;

  const noticiaPrincipal = noticias[0];
  const noticiasSecundarias = noticias.slice(1, 4);

  return (
    <div className="bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold uppercase tracking-wider text-white mb-6">INTERNACIONAL</h2>

        <div className="flex flex-col gap-6">
          <NoticiaPrincipalCard noticia={noticiaPrincipal} />
          <div className="flex justify-center">
            <div className="grid w-full max-w-3xl grid-cols-1 md:grid-cols-3 gap-6">
              {noticiasSecundarias.map(noticia => (
                <NoticiaSecundariaCard key={noticia.databaseId} noticia={noticia} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
