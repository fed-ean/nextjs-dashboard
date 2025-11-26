
import Link from 'next/link';

// Tipos (sin cambios)
interface Category {
  databaseId?: number;
  name: string;
  slug: string;
  count?: number | null;
}

interface Post {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
}

interface SideNavProps {
  categories: Category[];
  latestPosts?: Post[];
}

export default function SideNav({ categories, latestPosts = [] }: SideNavProps) {

  return (
    <aside className="h-auto w-full bg-gray-50 border-r overflow-y-auto shadow-lg rounded-lg">
      <div className="p-6 space-y-8">
        
        {/* 1. SECCIÓN DE ÚLTIMAS PUBLICACIONES (se mantiene igual) */}
        {latestPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Últimas publicaciones</h2>
            <ul className="space-y-4">
              {latestPosts.map((post) => (
                <li key={post.databaseId}>
                  <Link href={`/Categorias/Noticias/${post.slug}`} className="block p-2 rounded-md hover:bg-gray-200 transition-colors duration-200">
                    <p className="text-sm font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: post.title }} />
                    <span className="text-xs text-gray-600">
                      {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 2. SECCIÓN DE CATEGORÍAS (CON EL NUEVO DISEÑO) */}
        {categories.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Categorías</h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((category) => (
                <Link 
                  key={category.slug}
                  href={`/Categorias/${category.slug}`}
                  className="block px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 bg-gray-200 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm"
                >
                  {category.name} 
                  {category.count != null && <span className="text-xs opacity-75 ml-1">({category.count})</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje de fallback */}
        {latestPosts.length === 0 && categories.length === 0 && (
            <div className='p-4 text-center text-gray-500'>No hay contenido para mostrar.</div>
        )}
      </div>
    </aside>
  );
}
