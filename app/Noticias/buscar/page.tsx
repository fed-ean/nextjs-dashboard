
import { getClient } from '../../lib/cliente';
import { SEARCH_POSTS } from '../../lib/queries';
import Card from '../../components/card'; // Asegúrate que la ruta sea correcta
import { Suspense } from 'react';

// Define la interfaz para los datos de cada noticia
interface Post {
  databaseId: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}

// El componente de la página de búsqueda
export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const searchTerm = searchParams?.q || '';

  // No realizar la búsqueda si no hay término de búsqueda
  if (!searchTerm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Resultados de Búsqueda</h1>
        <p>Por favor, ingrese un término de búsqueda para comenzar.</p>
      </div>
    );
  }

  // Obtener el cliente de Apollo
  const client = getClient();

  try {
    // Realizar la búsqueda con el término proporcionado
    const { data } = await client.query({
      query: SEARCH_POSTS,
      variables: { search: searchTerm },
    });

    const posts: Post[] = data.posts.nodes;

    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Resultados para "{searchTerm}"</h1>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.databaseId} post={post} />
              ))}
            </div>
          ) : (
            <p>No se encontraron noticias que coincidan con su búsqueda.</p>
          )}
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>Hubo un problema al realizar la búsqueda. Por favor, intente de nuevo más tarde.</p>
      </div>
    );
  }
}
