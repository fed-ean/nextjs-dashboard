
import Link from 'next/link';
import UltimasNoticiasSidenav from './ultimas-noticias-sidenav';
import type { Category, Post } from '@/app/lib/definitions';

interface SidenavProps {
  categories: Category[];
  latestPosts?: Post[]; // Hacemos latestPosts opcional para no romper otras partes
}

export default function SideNav({ categories, latestPosts = [] }: SidenavProps) {
  return (
    <div className="flex flex-col gap-8">
      
      {/* SECCIÓN DE CATEGORÍAS */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Categorías</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/Categorias/${category.slug}`}>
                <div className="flex justify-between items-center text-gray-700 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <span>{category.name}</span>
                  {category.count != null && (
                    <span className="text-sm font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* SECCIÓN DE ÚLTIMAS NOTICIAS (AHORA RECIBE DATOS) */}
      {latestPosts.length > 0 && (
        <UltimasNoticiasSidenav noticias={latestPosts} />
      )}

    </div>
  );
}
