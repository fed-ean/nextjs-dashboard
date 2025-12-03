import { gql } from "@apollo/client";

/* -------------------------------------------------------
   0) GET_ALL_POSTS_SIMPLE (ya lo agregamos)
------------------------------------------------------- */
export const GET_ALL_POSTS_SIMPLE = gql`
  query GetAllPostsSimple($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          slug
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;


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
   2) OBTENER POSTS POR CATEGORÍA (PAGINACIÓN)
      🔥 Convertido a "edges" para que coincida
------------------------------------------------------- */
export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($slug: String!, $first: Int, $after: String) {
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

/* -------------------------------------------------------
   3) OBTENER TODO (SIN FILTRO)
      🔥 Convertido a "edges" también
------------------------------------------------------- */
export const GET_ALL_POSTS = gql`
  query GetAllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
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
  }
`;
