"use client";

import Link from "next/link";

interface Props {
  basePath: string;       // Ej: "/categorias/politica"
  current: number;        // Página actual
  totalPages: number;     // Total de páginas
  perPage?: number;       // No es estrictamente necesario pero lo dejamos por si lo usas
}

export default function CategoryPagination({
  basePath,
  current,
  totalPages,
}: Props) {
  const prevPage = current > 1 ? current - 1 : null;
  const nextPage = current < totalPages ? current + 1 : null;

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {/* Página anterior */}
      {prevPage ? (
        <Link
          href={`${basePath}?page=${prevPage}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-400">← Anterior</span>
      )}

      {/* Indicador */}
      <span className="font-semibold">
        Página {current} de {totalPages}
      </span>

      {/* Página siguiente */}
      {nextPage ? (
        <Link
          href={`${basePath}?page=${nextPage}`}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Siguiente →
        </Link>
      ) : (
        <span className="px-4 py-2 text-gray-400">Siguiente →</span>
      )}
    </div>
  );
}
