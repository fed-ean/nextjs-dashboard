'use client';

import Link from 'next/link';

export default function CategoryPagination({
  currentPage,
  totalPages,
  slug
}: {
  currentPage: number;
  totalPages: number;
  slug: string;
}) {

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8 gap-2">
      {pages.map((num) => (
        <Link
          key={num}
          href={`/categorias/${slug}?page=${num}`}
          className={`px-4 py-2 border rounded ${
            num === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {num}
        </Link>
      ))}
    </div>
  );
}
