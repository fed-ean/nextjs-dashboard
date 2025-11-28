"use client";

import Link from "next/link";

type Props = {
  basePath: string;
  current: number;
  totalPages: number;
};

export default function CategoryPagination({ basePath, current, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const prevPage = current > 1 ? current - 1 : null;
  const nextPage = current < totalPages ? current + 1 : null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      
      {prevPage ? (
        <Link
          href={`${basePath}?page=${prevPage}`}
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
          href={`${basePath}?page=${nextPage}`}
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
