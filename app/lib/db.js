// app/lib/db.js
import { gql } from '@apollo/client';
// CORRECTED: Use the new server-only client
import { getServerSideClient } from './server-cliente.js';

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
 * Obtiene las noticias del endpoint GraphQL (SERVER-SIDE ONLY).
 */
export async function obtenerNoticias({ limit = 10, status = 'PUBLISH' } = {}) {
  try {
    // CORRECTED: Use the server-side client
    const client = getServerSideClient(); 
    const { data } = await client.query({
      query: GET_NOTICIAS_QUERY,
      variables: {
        first: limit,
        status,
      },
      fetchPolicy: 'no-cache',
    });

    if (!data || !data.posts) {
      console.warn('GraphQL: respuesta sin posts:', data);
      return [];
    }

    const noticias = (data.posts.nodes || []).map(node => ({
      id: node.id,
      fecha: node.post_date, // Corrected to use 'fecha' to match the Sidenav component
      slug: node.post_name,
      titulo: node.post_title,
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
 * Obtiene las noticias de una categoría específica (SERVER-SIDE ONLY).
 */
export async function obtenerNoticiasPorCategoria({ limit = 10, status = 'PUBLISH', categoryName } = {}) {
  try {
    // CORRECTED: Use the server-side client
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
      console.warn('GraphQL: respuesta sin posts para la categoría:', categoryName, data);
      return [];
    }

    const noticias = (data.posts.nodes || []).map(node => ({
      id: node.id,
      fecha: node.post_date, // Corrected to use 'fecha' to match the Sidenav component
      slug: node.post_name,
      titulo: node.post_title,
      contenidoRaw: node.post_content,
      imagenUrl: node.featuredImage?.node?.sourceUrl || null,
    }));

    return noticias;
  } catch (error) {
    console.error(`Error al obtener noticias de la categoría ${categoryName} de GraphQL:`, error);
    return [];
  }
}
