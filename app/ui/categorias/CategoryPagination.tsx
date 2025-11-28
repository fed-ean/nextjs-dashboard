"use client";

import Link from "next/link";

type Props = {
  basePath: string;        // 👈 Agregado
  current: number;
  totalPages: number;
  perPage: number;
};

export default function CategoryPagination({
  basePath,
  current,
  totalPages,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-4 justify-center mt-6">
      {/* Prev */}
      {current > 1 ? (
        <Link href={`${basePath}?page=${current - 1}`} className="px-4 py-2 bg-gray-200 rounded">
          Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded">
          Anterior
        </span>
      )}

      {/* Next */}
      {current < totalPages ? (
        <Link href={`${basePath}?page=${current + 1}`} className="px-4 py-2 bg-gray-200 rounded">
          Siguiente
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded">
          Siguiente
        </span>
      )}
    </div>
  );
}
