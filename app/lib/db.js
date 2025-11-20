// app/lib/db.js
import { gql } from '@apollo/client';
import { getServerSideClient } from './server-cliente.js';

/**
 * @typedef {Object} Categoria
 * @property {string} [name]
 * @property {string} [slug]
 */

/**
 * @typedef {Object} Noticia
 * @property {number} [databaseId]
 * @property {string} [slug]
 * @property {string} [title]
 * @property {string} [titulo]
 * @property {string} [content]
 * @property {string} [excerpt]
 * @property {string|null} [imagenUrl]
 * @property {any} [featuredImage]
 * @property {{ nodes?: Categoria[] }} [categories]
 * @property {string} [fechaPublicacion]
 * @property {string} [date]
 */

/**
 * @typedef {Object} ObtenerNoticiasParams
 * @property {number} [limit]
 * @property {number} [offset]
 * @property {string} [status]
 * @property {string} [categoryName]
 */

// --- CONSULTAS ---
const GET_NOTICIAS_QUERY = gql`
  query GetNoticias($first: Int, $status: PostStatusEnum) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC }, status: $status }) {
      nodes {
        databaseId
        post_date: date
        content
        title
        excerpt
        status
        slug
        featuredImage { node { sourceUrl } }
        categories { nodes { name slug } }
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
        featuredImage { node { sourceUrl } }
        categories { nodes { name slug } }
      }
    }
  }
`;

// --- Mappers ---
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
  date: node.post_date,
});

const mapPostNodeForCarousel = (node) => ({
  ...mapPostNode(node),
  titulo: node.title,
});

// --- Funciones ---
export async function obtenerNoticias({ limit = 10, offset = 0, status = 'PUBLISH' } = {}) {
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

export async function obtenerNoticiasPorCategoria({ limit = 10, status = 'PUBLISH', categoryName } = {}) {
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

export async function obtenerNoticiasPorCategoriaParaCarrusel({ limit = 10, status = 'PUBLISH', categoryName } = {}) {
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
