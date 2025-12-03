// components/CategoryPagination.tsx
'use client';
import React, { useCallback, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  basePath: string;     // e.g. "/Categorias/politica"
  current: number;
  totalPages: number;   // 0 => unknown
  perPage?: number;
  maxButtons?: number;
};

export default function CategoryPagination({
  basePath,
  current,
  totalPages,
  perPage = 9,
  maxButtons = 9,
}: Props) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  // DEBUG: ver props en consola
  // eslint-disable-next-line no-console
  console.log('[Pagination] props:', { basePath, current, totalPages, perPage });

  // Build page URL: page 1 => basePath, page>1 => basePath/page/n
  const pageUrl = (n: number) => (n <= 1 ? `${basePath.replace(/\/$/, '')}` : `${basePath.replace(/\/$/, '')}/page/${n}`);

  // window of pages
  let start = Math.max(1, current - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (totalPages > 0) {
    end = Math.min(totalPages, end);
    start = Math.max(1, end - maxButtons + 1);
  } else {
    end = Math.max(end, current);
  }
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  // Robust slug extraction:
  const slugFromBase = (() => {
    try {
      const p = basePath.replace(/\/+$/, ''); // quitar slashes finales
      // Formatos posibles:
      //  - /Categorias/politica
      //  - /Categorias/politica/page
      //  - /Categorias/politica/page/1
      const parts = p.split('/').filter(Boolean);
      // buscar 'categorias' (case-insensitive)
      const idx = parts.findIndex(seg => seg.toLowerCase() === 'categorias');
      if (idx >= 0 && parts.length > idx + 1) return parts[idx + 1];
      // si no hay 'categorias', devolver última parte (fallback)
      if (parts.length) return parts[parts.length - 1];
      return '';
    } catch (e) {
      return '';
    }
  })();

  // precarga cache silenciosa con reporting
  const warmCache = useCallback(async (slug: string, page: number) => {
    if (!slug) {
      // eslint-disable-next-line no-console
      console.warn('[Pagination] warmCache skipped - empty slug', { basePath, slugFromBase });
      return;
    }
    const url = `/api/warm-cache?slug=${encodeURIComponent(slug)}&page=${page}&perPage=${perPage}`;
    // eslint-disable-next-line no-console
    console.log('[Pagination] warmCache ->', url);
    try {
      const res = await fetch(url, { method: 'GET' });
      const text = await res.text();
      // eslint-disable-next-line no-console
      console.log('[Pagination] warmCache response', { url, status: res.status, body: text });
      // No throw: si hay error 4xx/5xx simplemente logueamos y seguimos
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Pagination] warmCache fetch failed', err);
    }
  }, [basePath, perPage, slugFromBase]);

  // navigation helper
  const goto = useCallback((n: number) => {
    const href = pageUrl(n);
    setNavigating(true);
    startTransition(() => {
      // eslint-disable-next-line no-console
      console.log('[Pagination] navigating to', href);
      router.push(href);
      setTimeout(() => setNavigating(false), 1500);
    });
  }, [router]);

  const disablePrev = current <= 1;
  const disableNext = totalPages > 0 ? current >= totalPages : false;

  return (
    <nav aria-label="Paginación" style={{ zIndex: 60, pointerEvents: 'auto' }} className="flex flex-col items-center gap-3">
      {navigating && <div className="mb-2 text-sm text-gray-600">Cargando…</div>}
      <div className="flex items-center gap-3">
        <button
          onMouseEnter={() => warmCache(slugFromBase, 1)}
          onClick={() => !disablePrev && goto(1)}
          disabled={disablePrev}
          className={`px-4 py-1 rounded ${disablePrev ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
        >
          « Primero
        </button>

        <button
          onMouseEnter={() => warmCache(slugFromBase, Math.max(1, current - 1))}
          onClick={() => !disablePrev && goto(Math.max(1, current - 1))}
          disabled={disablePrev}
          className={`px-4 py-1 rounded ${disablePrev ? 'text-gray-400 cursor-not-allowed' : 'bg-white border'}`}
        >
          Anterior
        </button>

        {start > 1 && <span className="px-2 text-gray-500">…</span>}

        {pages.map((p) => (
          <button
            key={p}
            onMouseEnter={() => warmCache(slugFromBase, p)}
            onClick={() => goto(p)}
            aria-current={p === current ? 'page' : undefined}
            className={`px-3 py-1 rounded ${p === current ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          >
            {p}
          </button>
        ))}

        {totalPages > 0 && end < totalPages && <span className="px-2 text-gray-500">…</span>}

        <button
          onMouseEnter={() => warmCache(slugFromBase, Math.min(totalPages || (current + 1), current + 1))}
          onClick={() => !disableNext && goto(Math.min(totalPages || (current + 1), current + 1))}
          disabled={disableNext}
          className={`px-4 py-1 rounded ${disableNext ? 'text-gray-400 cursor-not-allowed' : 'bg-white border'}`}
        >
          Siguiente
        </button>

        <button
          onMouseEnter={() => warmCache(slugFromBase, totalPages || (current + 5))}
          onClick={() => !disableNext && goto(totalPages || (current + 5))}
          disabled={totalPages > 0 ? current >= totalPages : false}
          className={`px-4 py-1 rounded ${totalPages > 0 && current >= totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
        >
          Último »
        </button>
      </div>
    </nav>
  );
}
