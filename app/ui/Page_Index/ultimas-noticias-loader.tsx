// app/ui/Page_Index/ultimas-noticias-loader.tsx
import NoticiasVarias from "../dashboard/noticias-varias";

const GQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT_URL || '';

const GET_LATEST_POSTS_QUERY = `
  query GetLatestPosts {
    posts(first: 3) {
      nodes {
        databaseId
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl } }
        categories(first: 1) {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

interface Post {
  databaseId: number;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage: { node: { sourceUrl: string } };
  categories: {
    nodes: {
      name: string;
      slug: string; // ✅ AGREGADO
    }[];
  };
}

async function fetchLatestPosts(): Promise<{ posts: Post[]; error: string | null }> {
  if (!GQL_ENDPOINT) {
    console.error("GRAPHQL_ENDPOINT_URL no está configurada.");
    return { posts: [], error: "El servidor no está configurado correctamente." };
  }

  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_LATEST_POSTS_QUERY }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de red: ${response.status} ${errorText}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors.map((e: any) => e.message).join(', '));
    }

    return { posts: json.data?.posts?.nodes || [], error: null };

  } catch (err: any) {
    console.error("Error al obtener posts:", err.message);
    return { posts: [], error: "No se pudieron cargar las últimas noticias." };
  }
}

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-center py-8 px-4 bg-red-50 rounded-lg border border-red-200">
    <h3 className="font-bold text-red-700">Error de Carga</h3>
    <p className="text-red-600">{message}</p>
    <p className="text-sm text-gray-500 mt-2">Intentá más tarde.</p>
  </div>
);

export default async function UltimasNoticiasLoader() {
  const { posts, error } = await fetchLatestPosts();

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <NoticiasVarias
      posts={posts}
      page={1}
      categoriaSlug=""
      categoriaNombre=""
    />
  );
}
