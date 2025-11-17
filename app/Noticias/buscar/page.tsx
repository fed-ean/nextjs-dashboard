// app/Noticias/buscar/page.tsx
import { Suspense } from 'react';
import Card from '../../components/card';

const GQL_ENDPOINT = "/graphql";

const SEARCH_POSTS_QUERY = `
  query SearchPosts($search: String!) {
    posts(where: { search: $search }) {
      nodes {
        databaseId
        title
        excerpt
        slug
        date
        featuredImage { node { sourceUrl } }
        categories { nodes { name slug } }
      }
    }
  }
`;

interface Post {
  databaseId: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage: { node: { sourceUrl: string; }; };
  categories: { nodes: { name: string; slug: string; }[]; };
}

async function fetchSearchResults(searchTerm: string): Promise<{ posts: Post[]; error: string | null }> {
    try {
        const response = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: SEARCH_POSTS_QUERY,
                variables: { search: searchTerm },
            }),
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`La API devolvió un error: ${response.statusText}`);
        }

        const json = await response.json();
        if (json.errors) {
            throw new Error(json.errors.map((e: any) => e.message).join(', '));
        }

        return { posts: json.data?.posts?.nodes || [], error: null };

    } catch (err: any) {
        console.error("Error al buscar posts:", err.message);
        return { posts: [], error: "No se pudo completar la búsqueda. Por favor, inténtelo de nuevo más tarde." };
    }
}

async function SearchResults({ searchTerm }: { searchTerm: string }) {
  if (!searchTerm) {
    return <p className="text-center text-gray-500">Por favor, ingrese un término de búsqueda para comenzar.</p>;
  }

  const { posts, error } = await fetchSearchResults(searchTerm);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No se encontraron noticias para "{searchTerm}".</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.databaseId} post={post} />
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const searchTerm = searchParams?.q || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Resultados para: <span className='font-light'>{searchTerm}</span></h1>
      <Suspense fallback={<div className="text-center">Cargando resultados...</div>}>
        <SearchResults searchTerm={searchTerm} />
      </Suspense>
    </div>
  );
}
