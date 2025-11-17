// app/lib/db.js
import { gql } from '@apollo/client';
import { getServerSideClient } from './server-cliente.js';

// --- CONSULTA GENERAL DE NOTICIAS ---
const GET_NOTICIAS_QUERY = gql`
  query GetNoticias($first: Int, $status: PostStatusEnum) {
    posts(
      first: $first, 
      where: {
        orderby: { field: DATE, order: DESC },
        status: $status
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

// --- CONSULTA DE NOTICIAS POR CATEGORÍA ---
const GET_NOTICIAS_POR_CATEGORIA_QUERY = gql`
  query GetNoticiasPorCategoria($first: Int, $status: PostStatusEnum, $categoryName: String) {
    posts(
      first: $first, 
      where: {
        orderby: { field: DATE, order: DESC },
        status: $status,
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

/**
 * Procesa y mapea los datos de un nodo de post para la mayoría de los componentes.
 */
const mapPostNode = (node) => ({
    databaseId: node.databaseId,
    slug: node.slug,
    title: node.title,
    content: node.content,
    excerpt: node.excerpt,
    imagenUrl: node.featuredImage?.node?.sourceUrl || null,
    featuredImage: node.featuredImage,
    categories: node.categories || { nodes: [] },
    fechaPublicacion: node.post_date,
    date: node.post_date 
});

/**
 * Procesa y mapea los datos de un nodo de post específicamente para el carrusel,
 * asegurando que la propiedad 'titulo' esté presente.
 */
const mapPostNodeForCarousel = (node) => ({
    ...mapPostNode(node),
    titulo: node.title,
});

/**
 * Obtiene las noticias del endpoint GraphQL (SERVER-SIDE ONLY).
 */
export async function obtenerNoticias({ limit = 10, offset = 0, status = 'PUBLISH' } = {}) {
  try {
    const client = getServerSideClient();
    const totalToFetch = limit + offset;
    const { data } = await client.query({
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
    console.error('Error al obtener noticias de GraphQL:', error);
    return [];
  }
}

/**
 * Obtiene las noticias de una categoría específica (SERVER-SIDE ONLY).
 */
export async function obtenerNoticiasPorCategoria({ limit = 10, status = 'PUBLISH', categoryName } = {}) {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
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
    console.error(`Error al obtener noticias de la categoría ${categoryName} de GraphQL:`, error);
    return [];
  }
}

/**
 * Obtiene las noticias de una categoría específica para el carrusel (SERVER-SIDE ONLY).
 */
export async function obtenerNoticiasPorCategoriaParaCarrusel({ limit = 10, status = 'PUBLISH', categoryName } = {}) {
  try {
    const client = getServerSideClient();
    const { data } = await client.query({
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
    console.error(`Error al obtener noticias de la categoría ${categoryName} para el carrusel de GraphQL:`, error);
    return [];
  }
}
