// app/lib/queries.ts
import { gql } from '@apollo/client';

export const GET_POSTS_BY_CATEGORY_SIMPLE = gql`
  query GetPostsByCategorySimple($categoryName: String!) {
    posts(first: 9, where: { categoryName: $categoryName }) {
      nodes {
        databaseId
        title
        excerpt
        date
        slug
        featuredImage { node { sourceUrl } }
        categories { nodes { name slug } }
      }
    }
  }
`;

export const GET_ALL_POSTS_SIMPLE = gql`
  query GetAllPostsSimple {
    posts(first: 9) {
      nodes {
        databaseId
        title
        excerpt
        date
        slug
        featuredImage { node { sourceUrl } }
        categories { nodes { name slug } }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query AllCategories {
    categories(first: 100) {
      nodes {
        databaseId
        name
        slug
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
