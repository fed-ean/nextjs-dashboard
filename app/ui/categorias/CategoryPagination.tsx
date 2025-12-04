"use client";
import React from "react";
import Link from "next/link";

type Props = {
  basePath: string;     // ej. "/Categorias/politica"
  current: number;      // página actual
  totalPages: number;   // total de páginas
  maxButtons?: number;  // cuántos botones numerados mostrar
};

export default function CategoryPagination({
  basePath,
  current,
  totalPages,
  maxButtons = 7,
}: Props) {
  // Aseguramos mínimo 1 página
  totalPages = Math.max(totalPages, 1);
  current = Math.max(1, Math.min(current, totalPages));
  if (totalPages <= 1) return null
  // Calculamos rango de botones
  let start = Math.max(1, current - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Limpiamos basePath de slashes finales
  const base = basePath.replace(/\/$/, "");
  const pageUrl = (n: number) => (n <= 1 ? base : `${base}/page/${n}`);

  return (
    <nav aria-label="Paginación" className="flex flex-col items-center gap-3 my-6">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Primero */}
        <Link
          href={pageUrl(1)}
          className={`px-3 py-1 rounded border ${
            current === 1
              ? "bg-gray-200 text-gray-500 pointer-events-none"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          « Primero
        </Link>

        {/* Anterior */}
        <Link
          href={pageUrl(Math.max(1, current - 1))}
          className={`px-3 py-1 rounded border ${
            current === 1
              ? "bg-gray-200 text-gray-500 pointer-events-none"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Anterior
        </Link>

        {/* Números */}
        {start > 1 && <span className="px-2 text-gray-500">…</span>}

        {pages.map((p) => (
          <Link
            key={p}
            href={pageUrl(p)}
            aria-current={p === current ? "page" : undefined}
            className={`px-3 py-1 rounded border ${
              p === current
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        ))}

        {end < totalPages && <span className="px-2 text-gray-500">…</span>}

        {/* Siguiente */}
        <Link
          href={pageUrl(Math.min(totalPages, current + 1))}
          className={`px-3 py-1 rounded border ${
            current === totalPages
              ? "bg-gray-200 text-gray-500 pointer-events-none"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Siguiente
        </Link>

        {/* Último */}
        <Link
          href={pageUrl(totalPages)}
          className={`px-3 py-1 rounded border ${
            current === totalPages
              ? "bg-gray-200 text-gray-500 pointer-events-none"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Último »
        </Link>
      </div>
    </nav>
  );
}
