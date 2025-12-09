// app/Noticias/buscar/page.tsx
import { Suspense } from "react";
import Card from "../../components/card";
import type { AsyncSearchParams } from "@/types/next-async";
export const dynamic = "force-dynamic";

const GQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
  "https://radioempresaria.com.ar/graphql";

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

async function fetchSearchResults(searchTerm: string) {
  if (!searchTerm || !searchTerm.trim()) {
    return { posts: [], error: null };
  }

  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: SEARCH_POSTS_QUERY,
        variables: { search: searchTerm },
      }),
      cache: "no-store",
    });

    const json = await response.json();

    // Si GraphQL devolvió errores, devuelvo el primer mensaje para depuración
    if (!response.ok || json?.errors?.length) {
      const errMsg =
        json?.errors?.[0]?.message ??
        `GraphQL error (status ${response.status})`;
      console.error("GraphQL error:", json?.errors ?? json);
      return { posts: [], error: `Error al buscar: ${errMsg}` };
    }

    return { posts: json.data?.posts?.nodes || [], error: null };
  } catch (err: any) {
    console.error("Fetch search error:", err);
    return { posts: [], error: "Error al buscar (network)." };
  }
}

async function SearchResults({ searchTerm }: { searchTerm: string }) {
  const { posts, error } = await fetchSearchResults(searchTerm);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!posts.length)
    return <p className="text-center">Sin resultados</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post: any) => (
        <Card key={post.databaseId} post={post} />
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: AsyncSearchParams;
}) {
  const resolved = searchParams ? await searchParams : {};
  const searchTerm = (resolved.q as string) || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Resultados para: <span className="font-light">{searchTerm}</span>
      </h1>

      { !searchTerm.trim() ? (
        <div className="text-center text-gray-600">Escribe algo para buscar</div>
      ) : (
        <Suspense fallback={<div>Cargando...</div>}>
          <SearchResults searchTerm={searchTerm} />
        </Suspense>
      )}
    </div>
  );
}
