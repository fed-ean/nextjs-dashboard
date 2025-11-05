import { gql } from '@apollo/client';
import { getClient } from './cliente'; // <- AJUSTA la ruta si tu estructura es diferente

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
        id
        post_date: date
        post_content: content
        post_title: title
        post_status: status
        post_name: slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        # opcional: categories { nodes { databaseId name slug } }
      }
    }
  }
`;

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
        id
        post_date: date
        post_content: content
        post_title: title
        post_status: status
        post_name: slug
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

/**
 * Obtiene las noticias del endpoint GraphQL.
 * @param {object} options - { limit = 10, status = 'PUBLISH' }
 * @returns {Array} noticias
 */
export async function obtenerNoticias({ limit = 10, status = 'PUBLISH' } = {}) {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: GET_NOTICIAS_QUERY,
      variables: {
        first: limit,
        status,
      },
      fetchPolicy: 'no-cache', // si querés, cambialo a 'network-only' o quitálo
    });

    if (!data || !data.posts) {
      console.warn('GraphQL: respuesta sin posts:', data);
      return [];
    }

    const noticias = (data.posts.nodes || []).map(node => ({
      id: node.id,
      fechaPublicacion: node.post_date,
      slug: node.post_name, // tu alias en la query ya lo dejó como 'post_name: slug'
      titulo: node.post_title,
      extracto: node.post_content,
      contenidoRaw: node.post_content,
      imagenUrl: node.featuredImage?.node?.sourceUrl || null,
    }));

    return noticias;
  } catch (error) {
    console.error('Error al obtener noticias de GraphQL:', error);
    return [];
  }
}

/**
 * Obtiene las noticias de una categoría específica del endpoint GraphQL.
 * @param {object} options - { limit = 10, status = 'PUBLISH', categoryName }
 * @returns {Array} noticias
 */
export async function obtenerNoticiasPorCategoria({ limit = 10, status = 'PUBLISH', categoryName } = {}) {
  try {
    const client = getClient();
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
      console.warn('GraphQL: respuesta sin posts para la categoría:', categoryName, data);
      return [];
    }

    const noticias = (data.posts.nodes || []).map(node => ({
      id: node.id,
      fechaPublicacion: node.post_date,
      slug: node.post_name,
      titulo: node.post_title,
      extracto: node.post_content,
      contenidoRaw: node.post_content,
      imagenUrl: node.featuredImage?.node?.sourceUrl || null,
    }));

    return noticias;
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName} de GraphQL:`, error);
    return [];
  }
}
""