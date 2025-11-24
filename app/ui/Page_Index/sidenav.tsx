import Link from 'next/link';

// CORRECCIÓN: Usar la variable de entorno para el endpoint de GraphQL.
const GQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || '';

// Las consultas GraphQL como cadenas de texto
const GET_ALL_CATEGORIES_QUERY = `
  query AllCategories {
    categories(first: 100) {
      nodes { databaseId name slug }
    }
  }
`;

const GET_LATEST_POSTS_QUERY = `
  query AllPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      nodes { databaseId title slug date }
    }
  }
`;

// Interfaces para la tipificación de los datos
interface Category {
  databaseId: number;
  name: string;
  slug: string;
}

interface Post {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
}

// Función auxiliar para realizar una única petición GraphQL
async function fetchGraphQL(query: string, variables?: Record<string, any>) {
    // Si la variable de entorno no está, no podemos continuar.
    if (!GQL_ENDPOINT) {
        console.error("Error Crítico: La variable de entorno GRAPHQL_ENDPOINT_URL no está configurada.");
        return null;
    }

    try {
        const response = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            next: { revalidate: 3600 }, // Revalidar cada hora
        });

        if (!response.ok) {
            console.error(`Error en la petición a GraphQL: ${response.statusText}`);
            return null;
        }

        const json = await response.json();
        if (json.errors) {
            console.error(`Error en la respuesta de GraphQL:`, json.errors);
            return null;
        }

        return json.data;
    } catch (error) {
        console.error("Fallo en la petición fetch a GraphQL:", error);
        return null; // Devuelve null si hay un error de red o de parseo
    }
}

// El componente SideNav que obtiene y muestra los datos
export default async function SideNav() {
  // Realiza las peticiones en paralelo
  const [categoriesResult, postsResult] = await Promise.all([
    fetchGraphQL(GET_ALL_CATEGORIES_QUERY),
    fetchGraphQL(GET_LATEST_POSTS_QUERY, { first: 5, after: null }),
  ]);

  // Extrae los datos de forma segura, con fallback a un array vacío
  const categories: Category[] = categoriesResult?.categories?.nodes || [];
  const latestPosts: Post[] = postsResult?.posts?.nodes || [];

  return (
    <aside className="h-auto w-full bg-white border-r overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Sección de Últimas Publicaciones */}
        {latestPosts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 mt-10">Últimas publicaciones</h2>
            <ul className="space-y-3">
              {latestPosts.map((post) => (
                <li key={post.databaseId}>
                  <Link href={`/Categorias/Noticias/${post.slug}`} className="hover:underline">
                    <p className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: post.title }} />
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sección de Categorías */}
        {categories.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Categorías</h2>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.databaseId}>
                  <Link href={`/Categorias/${category.slug}`} className="hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Placeholder si no se carga ninguna sección */}
        {latestPosts.length === 0 && categories.length === 0 && (
            <div className='p-4 text-center text-gray-500'>No se pudo cargar el contenido de la barra lateral.</div>
        )}
      </div>
    </aside>
  );
}
