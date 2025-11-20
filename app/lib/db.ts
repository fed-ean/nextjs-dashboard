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
  imagenUrl?: string | null;
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

// --- CONSULTAS ---
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
  databaseId: node.databaseId,
  slug: node.slug,
  title: node.title,
  content: node.content,
  excerpt: node.excerpt,
  imagenUrl: node.featuredImage?.node?.sourceUrl || null,
  featuredImage: node.featuredImage,
  categories: node.categories || { nodes: [] },
  fechaPublicacion: node.post_date,
  date: node.post_date,
});

const mapPostNodeForCarousel = (node: any): Noticia => ({
  ...mapPostNode(node),
  titulo: node.title,
});

// --- Funciones ---
export async function obtenerNoticias({ limit = 10, offset = 0, status = 'PUBLISH' }: ObtenerNoticiasParams = {}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_QUERY,
      variables: { first: limit + offset, status },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) return [];
    const nodesAfterOffset = (data.posts.nodes || []).slice(offset);
    return nodesAfterOffset.map(mapPostNode);
  } catch (error) {
    console.error('Error al obtener noticias de GraphQL:', error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoria({ limit = 10, status = 'PUBLISH', categoryName }: ObtenerNoticiasParams = {}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) return [];
    return (data.posts.nodes || []).map(mapPostNode);
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName} de GraphQL:`, error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoriaParaCarrusel({ limit = 10, status = 'PUBLISH', categoryName }: ObtenerNoticiasParams = {}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) return [];
    return (data.posts.nodes || []).map(mapPostNodeForCarousel);
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName} para el carrusel de GraphQL:`, error);
    return [];
  }
}
