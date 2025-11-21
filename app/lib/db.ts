// app/lib/db.ts
import { gql } from '@apollo/client';
import { getServerSideClient } from './server-cliente.js';

// --- Tipos ---
export type Categoria = {
  name?: string;
  slug?: string;
};

export type Noticia = {
  databaseId?: number;
  slug?: string;
  title?: string;
  titulo?: string;
  content?: string;
  excerpt?: string;
  imagenUrl?: string; // <- unificado: string | undefined
  featuredImage?: any;
  categories?: { nodes?: Categoria[] };
  fechaPublicacion?: string;
  date?: string;
  [k: string]: any;
};

export type ObtenerNoticiasParams = {
  limit?: number;
  offset?: number;
  status?: string;
  categoryName?: string;
};

// --- GraphQL queries ---
const GET_NOTICIAS_QUERY = gql`
  query GetNoticias($first: Int, $status: PostStatusEnum) {
    posts(
      first: $first,
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
          node { sourceUrl }
        }
        categories {
          nodes { name slug }
        }
      }
    }
  }
`;

const GET_NOTICIAS_POR_CATEGORIA_QUERY = gql`
  query GetNoticiasPorCategoria($first: Int, $status: PostStatusEnum, $categoryName: String) {
    posts(
      first: $first,
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
          node { sourceUrl }
        }
        categories {
          nodes { name slug }
        }
      }
    }
  }
`;

// --- Mappers ---
const mapPostNode = (node: any): Noticia => ({
  databaseId: node?.databaseId,
  slug: node?.slug,
  title: node?.title,
  content: node?.content,
  excerpt: node?.excerpt,
  imagenUrl: node?.featuredImage?.node?.sourceUrl ?? undefined, // <- string | undefined
  featuredImage: node?.featuredImage,
  categories: node?.categories ?? { nodes: [] },
  fechaPublicacion: node?.post_date,
  date: node?.post_date,
});

const mapPostNodeForCarousel = (node: any): Noticia => ({
  ...mapPostNode(node),
  titulo: node?.title,
});

// --- Helper type for query result ---
type PostsQueryResult = {
  posts?: {
    nodes?: any[];
  };
};

// --- Functions ---
export async function obtenerNoticias(
  { limit = 10, offset = 0, status = 'PUBLISH' }: ObtenerNoticiasParams = {}
): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const totalToFetch = limit + offset;

    const { data } = await client.query<PostsQueryResult>({
      query: GET_NOTICIAS_QUERY,
      variables: {
        first: totalToFetch,
        status,
      },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) {
      return [];
    }

    const nodesAfterOffset = (data.posts.nodes || []).slice(offset);
    return nodesAfterOffset.map(mapPostNode);
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoria(
  { limit = 10, status = 'PUBLISH', categoryName }: ObtenerNoticiasParams = {}
): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();

    const { data } = await client.query<PostsQueryResult>({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: {
        first: limit,
        status,
        categoryName,
      },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) {
      return [];
    }

    return (data.posts.nodes || []).map(mapPostNode);
  } catch (error) {
    console.error(`Error fetching noticias for category "${categoryName}":`, error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoriaParaCarrusel(
  { limit = 10, status = 'PUBLISH', categoryName }: ObtenerNoticiasParams = {}
): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();

    const { data } = await client.query<PostsQueryResult>({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: {
        first: limit,
        status,
        categoryName,
      },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) {
      return [];
    }

    return (data.posts.nodes || []).map(mapPostNodeForCarousel);
  } catch (error) {
    console.error(`Error fetching carousel noticias for category "${categoryName}":`, error);
    return [];
  }
}
