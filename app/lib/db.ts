// app/lib/db.ts
import { gql } from '@apollo/client';
import { getServerSideClient } from './server-cliente';

// --- TIPOS ---

/**
 * Representa la estructura de un nodo de "post" tal como viene
 * directamente de la consulta GraphQL. Usar esto evita el uso de `any`.
 */
interface PostNodeFromQuery {
  databaseId: string | number;
  post_date: string;
  content: string | null;
  title: string;
  excerpt: string | null;
  status: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    } | null;
  } | null;
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}

/**
 * Representa la estructura de una categoría.
 */
export interface Categoria {
  name?: string;
  slug?: string;
}

/**
 * Representa la estructura de una noticia normalizada y limpia,
 * lista para ser usada en los componentes de la aplicación.
 */
export interface Noticia {
  databaseId: number;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;

  // ✅ AGREGAR ESTO
  content?: string;

  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    };
  };

  categories?: {
    nodes?: {
      name: string;
      slug: string;
    }[];
  };

  sourceUrl?: string;
}



// --- CONSULTAS ---
const GET_NOTICIAS_QUERY = gql`
  query GetNoticias($first: Int, $status: PostStatusEnum) {
    posts(
      first: $first
      where: { orderby: { field: DATE, order: DESC }, status: $status }
    ) {
      nodes {
        databaseId
        post_date: date
        content
        title
        excerpt
        status
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

const GET_NOTICIAS_POR_CATEGORIA_QUERY = gql`
  query GetNoticiasPorCategoria($first: Int, $status: PostStatusEnum, $categoryName: String) {
    posts(
      first: $first
      where: { orderby: { field: DATE, order: DESC }, status: $status, categoryName: $categoryName }
    ) {
      nodes {
        databaseId
        post_date: date
        content
        title
        excerpt
        status
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// --- FUNCIONES DE MAPEO ---

/**
 * Transforma un nodo de la API a la estructura limpia `Noticia`.
 * Ahora recibe un tipo específico `PostNodeFromQuery`, no `any`.
 */
const mapPostNode = (node: PostNodeFromQuery): Noticia => ({
  databaseId: Number(node.databaseId), // ✅ conversión segura
  slug: node.slug,
  title: node.title,
  content: node.content || undefined,
  excerpt: node.excerpt || undefined,
  sourceUrl: node.featuredImage?.node?.sourceUrl,
  categories: node.categories || { nodes: [] },
  date: node.post_date,
});


// --- FUNCIONES DE OBTENCIÓN ---

// Define el tipo esperado de la respuesta de la query para reutilizarlo.
type GraphQLPostsResponse = { posts: { nodes: PostNodeFromQuery[] } };

export async function obtenerNoticias({ limit = 10, offset = 0, status = 'PUBLISH' } = {}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    // Usamos el tipo `GraphQLPostsResponse` para una query con tipado seguro.
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_NOTICIAS_QUERY,
      variables: { first: limit + offset, status },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];

    const nodesAfterOffset = data.posts.nodes.slice(offset);
    return nodesAfterOffset.map(mapPostNode);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoria({
  limit = 10,
  offset = 0,
  status = 'PUBLISH',
  categoryName
}: {
  limit?: number;
  offset?: number;
  status?: string;
  categoryName: string;
}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: {
        first: limit + offset,
        status,
        categoryName
      },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];

    const nodesAfterOffset = data.posts.nodes.slice(offset);
    return nodesAfterOffset.map(mapPostNode);
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName}:`, error);
    return [];
  }
}


// Ya no es necesaria una función de mapeo separada para el carrusel,
// la estructura de `Noticia` es ahora consistente.
export async function obtenerNoticiasPorCategoriaParaCarrusel({ limit = 10, status = 'PUBLISH', categoryName }: { limit?: number; status?: string; categoryName: string }): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];
    // Usamos la misma función de mapeo estándar
    return data.posts.nodes.map(mapPostNode);
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName} para el carrusel:`, error);
    return [];
  }
}
