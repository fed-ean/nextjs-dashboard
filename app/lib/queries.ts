// app/lib/queries.ts
import { gql } from "@apollo/client";

//
// -------------------------------------------------------------
// POSTS POR CATEGORÍA (COMPLETA)
// -------------------------------------------------------------
export const GET_POSTS_BY_CATEGORY_SIMPLE = gql`
  query GetPostsByCategory($slug: String!, $size: Int!, $offset: Int!) {
    categories(where: { slug: $slug }) {
      nodes {
        databaseId
        name
        slug
        count
        posts(where: { offsetPagination: { size: $size, offset: $offset } }) {
          nodes {
            databaseId
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            categories {
              nodes {
                databaseId
                name
                slug
                count
              }
            }
          }
          pageInfo {
            offsetPagination {
              total
            }
          }
        }
      }
    }
  }
`;

//
// -------------------------------------------------------------
// TODOS LOS POSTS SIMPLE (ej: página Interés General)
// -------------------------------------------------------------
export const GET_ALL_POSTS_SIMPLE = gql`
  query GetAllPosts($size: Int!, $offset: Int!) {
    posts(where: { offsetPagination: { size: $size, offset: $offset } }) {
      nodes {
        databaseId
        title
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            databaseId
            name
            slug
            count
          }
        }
      }
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;

//
// -------------------------------------------------------------
// TODAS LAS CATEGORÍAS
// -------------------------------------------------------------
export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories(first: 100) {
      nodes {
        databaseId
        name
        slug
        count
      }
    }
  }
`;

//
// -------------------------------------------------------------
// ÚLTIMOS POSTS (Página principal)
// -------------------------------------------------------------
export const GET_LATEST_POSTS_QUERY = gql`
  query GetLatestPosts {
    posts(first: 12) {
      nodes {
        databaseId
        title
        excerpt
        slug
        date
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

//
// -------------------------------------------------------------
// POSTS POR CATEGORÍA CON PAGINACIÓN (USADO EN CATEGORY PAGE)
// -------------------------------------------------------------
export const GET_CATEGORY_POSTS_QUERY = gql`
  query GetCategoryPosts($slug: [String], $pageSize: Int!, $offset: Int!) {
    categories(where: { slug: $slug }) {
      nodes {
        databaseId
        name
        slug
        count
        posts(where: { offsetPagination: { size: $pageSize, offset: $offset } }) {
          nodes {
            databaseId
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            categories {
              nodes {
                databaseId
                name
                slug
              }
            }
          }
          pageInfo {
            offsetPagination {
              total
            }
          }
        }
      }
    }
  }
`;

//
// -------------------------------------------------------------
// BACKOFFICE: TODOS LOS POSTS
// -------------------------------------------------------------
export const GET_ALL_POSTS = gql`
  query AllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        databaseId
        title
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        tags {
          nodes {
            name
            slug
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

//
// -------------------------------------------------------------
// BUSCADOR
// -------------------------------------------------------------
export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!) {
    posts(where: { search: $search }) {
      nodes {
        databaseId
        title
        excerpt
        slug
        date
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

//
// -------------------------------------------------------------
// PARA EL BUILD (STATIC PARAMS)
// -------------------------------------------------------------
export const GET_ALL_POST_DATA_COMBINED = gql`
  query GetAllPostDataCombined {
    posts(first: 9999) {
      nodes {
        databaseId
      }
    }
  }
`;

export const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 10000) {
      nodes {
        slug
      }
    }
  }
`;

//
// -------------------------------------------------------------
// SECCIÓN "VARIOS" (Programas excepto ciertas categorías)
// -------------------------------------------------------------
export const GET_VARIAS_POSTS = gql`
  query GetVariasPosts($size: Int!, $offset: Int!) {
    categories(where: { slug: "programas" }) {
      nodes {
        posts(
          where: {
            offsetPagination: { size: $size, offset: $offset }
            taxQuery: {
              taxArray: [
                {
                  taxonomy: CATEGORY
                  field: SLUG
                  terms: ["locales", "desayuno-pymes", "cadena-verdeamarilla"]
                  operator: NOT_IN
                }
              ]
            }
          }
        ) {
          nodes {
            databaseId
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            categories {
              nodes {
                databaseId
                name
                slug
              }
            }
          }
          pageInfo {
            offsetPagination {
              total
            }
          }
        }
      }
    }
  }
`;
