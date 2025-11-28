import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  slug: string;
}

export default function CategoryPagination({
  currentPage,
  totalPages,
  slug,
}: Props) {
  if (totalPages <= 1) return null;

  const createUrl = (page: number) => {
    return `/Categorias/${slug}?page=${page}`;
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {currentPage > 1 && (
        <Link
          href={createUrl(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          ← Anterior
        </Link>
      )}

      <span className="px-4 py-2 bg-gray-300 rounded">
        Página {currentPage} de {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={createUrl(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Siguiente →
        </Link>
      )}
    </div>
  );
}
