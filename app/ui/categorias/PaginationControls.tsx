
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  totalPages: number;
  currentSectionSlug: string;
}

export default function PaginationControls({ totalPages, currentSectionSlug }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/Categorias/${currentSectionSlug}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Botón Anterior */}
      <Link 
        href={createPageURL(currentPage - 1)}
        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}>
        Anterior
      </Link>

      {/* Números de Página */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link 
            key={page}
            href={createPageURL(page)}
            className={`px-3 py-1.5 text-sm rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-100'}`}>
            {page}
          </Link>
        ))}
      </div>

      {/* Botón Siguiente */}
      <Link 
        href={createPageURL(currentPage + 1)}
        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}>
        Siguiente
      </Link>
    </div>
  );
}
