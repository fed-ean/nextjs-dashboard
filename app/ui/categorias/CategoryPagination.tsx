// app/ui/categorias/CategoryPagination.tsx
import Link from "next/link";

interface Props {
  current: number;
  totalPages: number;
  basePath: string; // /Categorias/politica
}

export default function CategoryPagination({ current, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center gap-2 mt-6">
      {pages.map((num) => {
        const isActive = num === current;
        return (
          <Link
            key={num}
            href={`${basePath}?page=${num}`}
            className={`px-4 py-2 rounded border text-sm ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {num}
          </Link>
        );
      })}
    </nav>
  );
}
