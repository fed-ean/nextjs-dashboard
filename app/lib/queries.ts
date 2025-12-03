// app/lib/queries.ts
import { gql } from "@apollo/client";

/* -------------------------------------------------------
   1) OBTENER TODAS LAS CATEGORÍAS
------------------------------------------------------- */
export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories(first: 100) {
      nodes {
        databaseId
        name
        slug
      }
    }
  }
`;

/* -------------------------------------------------------
   2) OBTENER POSTS POR CATEGORÍA (CON PAGINACIÓN)
      - first: cantidad de posts por página
      - after: cursor (para la página siguiente)
------------------------------------------------------- */
export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($slug: String!, $first: Int!, $after: String) {
    posts(
      where: { categoryName: $slug }
      first: $first
      after: $after
    ) {
      nodes {
        databaseId
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }

    category(id: $slug, idType: SLUG) {
      name
      slug
      databaseId
    }
  }
`;

/* -------------------------------------------------------
   3) OBTENER TODOS LOS POSTS (SIN FILTRO)
      - También paginable si algún día lo necesitás
------------------------------------------------------- */
export const GET_ALL_POSTS = gql`
  query GetAllPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        databaseId
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Trae posts por categoría usando categoryName (compatible con tu WPGraphQL)
 */
export const GET_POSTS_BY_CATEGORY_SIMPLE = gql`
  query GetPostsByCategory(
    $slug: String!,
    $first: Int,
    $after: String
  ) {
    posts(
      where: { categoryName: $slug }
      first: $first
      after: $after
    ) {
      edges {
        node {
          databaseId
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }

    category(id: $slug, idType: SLUG) {
      name
      slug
      databaseId
    }
  }
`;

/**
 * Trae todos los posts simplificados
 */
export const GET_ALL_POSTS_SIMPLE = gql`
  query GetAllPostsSimple {
    posts(first: 200) {
      nodes {
        databaseId
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;