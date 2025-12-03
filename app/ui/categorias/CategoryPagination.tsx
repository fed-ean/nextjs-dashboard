// app/ui/categorias/CategoryPagination.tsx
'use client';
import React from 'react';
import Link from 'next/link';

type Props = {
  basePath: string;
  current: number;
  totalPages: number;
  maxButtons?: number;
};

export default function CategoryPagination({
  basePath,
  current,
  totalPages,
  maxButtons = 7,
}: Props) {
  const total = Math.max(1, Number(totalPages || 0));
  const page = Math.max(1, Number(current || 1));

  // No mostrar si solo hay 1 página
  if (total <= 1) return null;

  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - maxButtons + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const base = basePath.replace(/\/$/, '');
  const pageUrl = (n: number) => (n <= 1 ? base : `${base}/page/${n}`);

  return (
    <nav aria-label="Paginación" className="flex flex-col items-center gap-3 my-6">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Link href={pageUrl(1)} className={`px-3 py-1 rounded border ${page === 1 ? 'bg-gray-200 text-gray-500 pointer-events-none' : 'bg-white hover:bg-gray-100'}`}>« Primero</Link>
        <Link href={pageUrl(Math.max(1, page - 1))} className={`px-3 py-1 rounded border ${page === 1 ? 'bg-gray-200 text-gray-500 pointer-events-none' : 'bg-white hover:bg-gray-100'}`}>Anterior</Link>

        {start > 1 && <span className="px-2 text-gray-500">…</span>}
        {pages.map((p) => (
          <Link key={p} href={pageUrl(p)} aria-current={p === page ? 'page' : undefined}
            className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>
            {p}
          </Link>
        ))}
        {end < total && <span className="px-2 text-gray-500">…</span>}

        <Link href={pageUrl(Math.min(total, page + 1))} className={`px-3 py-1 rounded border ${page === total ? 'bg-gray-200 text-gray-500 pointer-events-none' : 'bg-white hover:bg-gray-100'}`}>Siguiente</Link>
        <Link href={pageUrl(total)} className={`px-3 py-1 rounded border ${page === total ? 'bg-gray-200 text-gray-500 pointer-events-none' : 'bg-white hover:bg-gray-100'}`}>Último »</Link>
      </div>
    </nav>
  );
}
