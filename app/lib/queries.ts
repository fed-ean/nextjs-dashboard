// app/lib/queries.ts
import { gql } from "@apollo/client";

// Mantenemos esta consulta que es completa y correcta
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

// Mantenemos esta consulta para obtener todos los posts (ej. Interés General)
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


// El resto de queries para el dashboard se mantienen intactas
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
        featuredImage { node { sourceUrl } }
        tags { nodes { name slug } }
        categories { nodes { name slug } }
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!) {
    posts(where: { search: $search }) {
      nodes {
        databaseId
        title
        excerpt
        slug
        date
        featuredImage { node { sourceUrl } }
        categories { nodes { name slug } }
      }
    }
  }
`;

// CONSULTA PARA EL BUILD
export const GET_ALL_POST_DATA_COMBINED = gql`
  query GetAllPostDataCombined {
    posts(first: 9999) {
      nodes {
        databaseId
      }
    }
  }
`;

// NUEVA CONSULTA: Para obtener todos los slugs para generateStaticParams
export const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 10000) {
      nodes {
        slug
      }
    }
  }
`;

// Se mantiene esta última para la sección "Varios"
export const GET_VARIAS_POSTS = gql`
  query GetVariasPosts($size: Int!, $offset: Int!) {
    categories(where: { slug: "programas" }) {
      nodes {
        posts(where: {
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
        }) {
          nodes {
            databaseId
            title
            excerpt
            slug
            date
            featuredImage { node { sourceUrl } }
            categories { nodes { databaseId name slug } }
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

/*
  SE HAN ELIMINADO LAS SIGUIENTES CONSULTAS OBSOLETAS E INCOMPLETAS:
  - GET_CATEGORY_POSTS_BY_SLUG_ARRAY
  - GET_CATEGORY_POSTS_BY_SLUG
  - GET_CATEGORY_POSTS_BY_SLUGIN
  Causaban errores de tipo porque no solicitaban todos los campos requeridos.
*/
