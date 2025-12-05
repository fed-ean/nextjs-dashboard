import Link from 'next/link';
import type { Category, Post } from '@/app/lib/definitions';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';

interface SidenavProps {
  categories: Category[];
  latestPosts: Post[];
}

export default function SideNav({ categories, latestPosts }: SidenavProps) {
  return (
    <div className="flex flex-col">

      {/* --- ÚLTIMAS NOTICIAS --- */}
      {latestPosts?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg px-6 py-5">
          <h3 className="text-xl font-bold text-gray-900 mb-5 border-b pb-2">
            Últimas Noticias
          </h3>

          <div className="space-y-5">
            {latestPosts.map((post) => {
              const formattedDate = post.date
                ? format(parseISO(post.date), "d 'de' MMMM, yyyy", { locale: es })
                : '';

              return (
                <div
                  key={post.databaseId}
                  className="flex items-start gap-4 group pb-4 border-b last:border-b-0"
                >
                  {/* Imagen */}
                  <Link href={`/Categorias/Noticias/${post.slug}`} className="shrink-0">
                    <img
                      src={post.featuredImage?.node?.sourceUrl || '/placeholder.png'}
                      alt={`Imagen de ${post.title}`}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-200
                                 group-hover:opacity-90 transition-all duration-200"
                    />
                  </Link>

                  {/* Texto */}
                  <div className="flex flex-col">
                    <Link
                      href={`/Categorias/Noticias/${post.slug}`}
                      className="font-semibold text-gray-800 leading-snug hover:text-blue-600 transition-colors"
                    >
                      {post.title.length > 75
                        ? post.title.slice(0, 75) + '…'
                        : post.title}
                    </Link>

                    <span className="text-xs text-gray-500 mt-2">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CATEGORÍAS --- */}
      {categories?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg px-6 py-5">
          <h3 className="text-xl font-bold text-gray-900 mb-5 border-b pb-2">
            Categorías
          </h3>

          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/Categorias/${category.slug}`}
                  className="flex justify-between items-center px-3 py-2 rounded-lg
                             text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all"
                >
                  <span className="font-medium">{category.name}</span>

                  {category.count != null && (
                    <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
