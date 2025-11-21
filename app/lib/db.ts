// app/lib/db.ts
import { gql } from '@apollo/client';
import { getServerSideClient } from './server-cliente';

// --- TIPOS ---
export interface Categoria {
  name?: string;
  slug?: string;
}

export interface Noticia {
  databaseId: string | number;
  slug?: string;
  title?: string;
  content?: string;
  excerpt?: string;
  imagenUrl?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  categories?: { nodes?: Categoria[] };
  fechaPublicacion?: string;
  date?: string;
  titulo?: string; // usado para carrusel
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
const mapPostNode = (node: any): Noticia => ({
  databaseId: node.databaseId,
  slug: node.slug,
  title: node.title,
  content: node.content,
  excerpt: node.excerpt,
  imagenUrl: node.featuredImage?.node?.sourceUrl || undefined,
  featuredImage: node.featuredImage,
  categories: node.categories || { nodes: [] },
  fechaPublicacion: node.post_date,
  date: node.post_date,
});

const mapPostNodeForCarousel = (node: any): Noticia => ({
  ...mapPostNode(node),
  titulo: node.title,
});

// --- FUNCIONES DE OBTENCIÓN ---
export async function obtenerNoticias({ limit = 10, offset = 0, status = 'PUBLISH' } = {}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query<{ posts: { nodes: any[] } }>({
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

export async function obtenerNoticiasPorCategoria({ limit = 10, status = 'PUBLISH', categoryName }: { limit?: number; status?: string; categoryName: string }): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query<{ posts: { nodes: any[] } }>({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];
    return data.posts.nodes.map(mapPostNode);
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName}:`, error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoriaParaCarrusel({ limit = 10, status = 'PUBLISH', categoryName }: { limit?: number; status?: string; categoryName: string }): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query<{ posts: { nodes: any[] } }>({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];
    return data.posts.nodes.map(mapPostNodeForCarousel);
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName} para el carrusel:`, error);
    return [];
  }
}
