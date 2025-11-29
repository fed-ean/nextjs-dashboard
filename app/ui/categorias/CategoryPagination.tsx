'use client';

import Link from 'next/link';
import React from 'react';

type Props = {
  basePath: string;     // ej: "/Categorias/politica"
  current: number;      // pagina actual
  totalPages: number;   // total de paginas
};

export default function CategoryPagination({ basePath, current, totalPages }: Props) {
  if (!totalPages || totalPages <= 1) return null;

  const normalize = (p: string) => p.replace(/\/+$/, '');

  const prevPage = current > 1 ? current - 1 : null;
  const nextPage = current < totalPages ? current + 1 : null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">

      {prevPage ? (
        <Link
          href={`${normalize(basePath)}?page=${prevPage}`}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
        >
          Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
          Anterior
        </span>
      )}

      <span className="text-lg font-semibold">
        Página {current} de {totalPages}
      </span>

      {nextPage ? (
        <Link
          href={`${normalize(basePath)}?page=${nextPage}`}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
        >
          Siguiente
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
          Siguiente
        </span>
      )}
    </div>
  );
}
