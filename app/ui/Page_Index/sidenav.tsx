import Link from 'next/link';
import type { Category, MappedPost } from '@/app/lib/definitions';

interface SidenavProps {
  categories: Category[];
  latestPosts: MappedPost[];
}

// Componente unificado para toda la barra lateral
export default function SideNav({ categories, latestPosts }: SidenavProps) {

  return (
    <div className="flex flex-col gap-8">
      
      {/* --- SECCIÓN DE ÚLTIMAS NOTICIAS --- */}
      {latestPosts && latestPosts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Últimas Noticias</h3>
          <div className="space-y-4">
            {latestPosts.map((post) => {
                return (
                    <div key={post.databaseId} className="flex items-start gap-4">
                        <Link href={`/Categorias/Noticias/${post.slug}`} className="shrink-0">
                            <img 
                                src={post.featuredImage || '/placeholder.png'} 
                                alt={`Imagen de ${post.title}`}
                                className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <div>
                            <h4 className="font-semibold text-gray-800 hover:text-blue-600">
                                <Link href={`/Categorias/Noticias/${post.slug}`}>{post.title}</Link>
                            </h4>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>
      )}

      {/* --- SECCIÓN DE CATEGORÍAS --- */}
      {categories && categories.length > 0 && (
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
      )}
    </div>
  );
}
