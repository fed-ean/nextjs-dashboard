// app/ui/categorias/CategoryPagination.tsx
'use client';

import Link from 'next/link';
import React from 'react';

interface Props {
  current: number;
  totalPages: number;
  basePath: string; // ej: /Categorias/politica
}

export default function CategoryPagination({ current, totalPages, basePath }: Props) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center gap-2 mt-6" aria-label="Paginación">
      {pages.map((num) => {
        const isActive = num === current;
        return (
          <Link
            key={num}
            href={`${basePath}?page=${num}`}
            className={`px-3 py-1 rounded-md text-sm border ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {num}
          </Link>
        );
      })}
    </nav>
  );
}
