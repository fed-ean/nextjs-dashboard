// app/lib/db.ts
import { gql } from '@apollo/client';
import { getServerSideClient } from './server-cliente';

export type Categoria = {
  name: string;
  slug: string;
};

export type FeaturedImage = {
  node?: {
    sourceUrl: string;
  };
};

export type Noticia = {
  databaseId: string | number;
  slug?: string;
  title?: string;
  titulo?: string; // para carrusel
  content?: string;
  excerpt?: string;
  featuredImage?: FeaturedImage;
  imagenUrl?: string; // nunca null, puede ser undefined
  categories?: { nodes?: Categoria[] };
  fechaPublicacion?: string;
  date?: string;
};

// --- CONSULTAS GraphQL ---
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
  query GetNoticiasPorCategoria(
    $first: Int
    $status: PostStatusEnum
    $categoryName: String
  ) {
    posts(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
        status: $status
        categoryName: $categoryName
      }
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

// --- Mappers ---
const mapPostNode = (node: any): Noticia => ({
  databaseId: node.databaseId ?? 0, // nunca undefined
  slug: node.slug,
  title: node.title,
  content: node.content,
  excerpt: node.excerpt,
  featuredImage: node.featuredImage,
  imagenUrl: node.featuredImage?.node?.sourceUrl || undefined,
  categories: node.categories || { nodes: [] },
  fechaPublicacion: node.post_date,
  date: node.post_date,
});

const mapPostNodeForCarousel = (node: any): Noticia => ({
  ...mapPostNode(node),
  titulo: node.title, // para carrusel
});

// --- Funciones ---
export async function obtenerNoticias({
  limit = 10,
  offset = 0,
  status = 'PUBLISH',
}: {
  limit?: number;
  offset?: number;
  status?: string;
} = {}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_QUERY,
      variables: { first: limit + offset, status },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];

    return (data.posts.nodes as any[])
      .slice(offset)
      .map(mapPostNode);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoria({
  limit = 10,
  status = 'PUBLISH',
  categoryName,
}: {
  limit?: number;
  status?: string;
  categoryName?: string;
}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];

    return (data.posts.nodes as any[]).map(mapPostNode);
  } catch (error) {
    console.error(`Error al obtener noticias de categoría ${categoryName}:`, error);
    return [];
  }
}

export async function obtenerNoticiasPorCategoriaParaCarrusel({
  limit = 10,
  status = 'PUBLISH',
  categoryName,
}: {
  limit?: number;
  status?: string;
  categoryName?: string;
}): Promise<Noticia[]> {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_POR_CATEGORIA_QUERY,
      variables: { first: limit, status, categoryName },
      fetchPolicy: 'no-cache',
    });

    if (!data?.posts?.nodes) return [];

    return (data.posts.nodes as any[]).map(mapPostNodeForCarousel);
  } catch (error) {
    console.error(
      `Error al obtener noticias para carrusel de categoría ${categoryName}:`,
      error
    );
    return [];
  }
}
