import { gql } from '@apollo/client';

export const GET_POSTS_BY_CATEGORY_SIMPLE = gql`
  query GetPostsByCategorySimple($categorySlug: String!, $size: Int!, $offset: Int!) {
    posts(
      where: {
        categorySlug: $categorySlug
        offsetPagination: { size: $size, offset: $offset }
      }
    ) {
      pageInfo {
        offsetPagination {
          total
        }
      }
      nodes {
        databaseId
        title
        excerpt
        slug
        date
        featuredImage {
          node { sourceUrl }
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
    }
  }
`;

export const GET_ALL_POSTS_SIMPLE = gql`
  query GetAllPostsSimple($size: Int!, $offset: Int!) {
    posts(
      where: {
        offsetPagination: { size: $size, offset: $offset }
      }
    ) {
      pageInfo {
        offsetPagination {
          total
        }
      }
      nodes {
        databaseId
        title
        excerpt
        date
        slug
        featuredImage { node { sourceUrl } }
        categories { nodes { databaseId name slug count } }
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
        count
      }
    }
  }
`;

/* Mantén el resto de tus queries si los usas */
