// app/Noticias/buscar/page.tsx
import { Suspense } from "react";
import Card from "../../components/card";
import type { AsyncSearchParams } from "@/types/next-async";
export const dynamic = 'force-dynamic'


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

async function fetchSearchResults(searchTerm: string) {
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
    return { posts: json.data?.posts?.nodes || [], error: null };
  } catch {
    return { posts: [], error: "Error al buscar" };
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

      <Suspense fallback={<div>Cargando...</div>}>
        <SearchResults searchTerm={searchTerm} />
      </Suspense>
    </div>
  );
}
