"use client";

import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  slug: string;
};

export default function CategoryPagination({
  currentPage,
  totalPages,
  slug,
}: Props) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Prev */}
      {prevPage ? (
        <Link
          href={`/Categorias/${slug}?page=${prevPage}`}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-400">← Anterior</span>
      )}

      {/* Page indicator */}
      <span className="px-4 py-2 font-semibold">
        Página {currentPage} de {totalPages}
      </span>

      {/* Next */}
      {nextPage ? (
        <Link
          href={`/Categorias/${slug}?page=${nextPage}`}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Siguiente →
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-400">Siguiente →</span>
      )}
    </div>
  );
}
