// lib/queries.ts
import { gql } from '@apollo/client';

// ==============================================================================
// QUERIES
// ==============================================================================

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

export const GET_CATEGORY_POST_IDS = gql`
  query GetCategoryPostIds($slugs: [String!]!) {
    categories(where: { slug: $slugs }) {
      nodes {
        posts(first: 9999) {
          nodes {
            databaseId
          }
        }
      }
    }
  }
`;

export const GET_ALL_POST_IDS = gql`
  query AllPostIds {
    posts(first: 9999) {
      nodes {
        databaseId
      }
    }
  }
`;

export const GET_CATEGORY_POSTS_BY_SLUG_ARRAY = gql`
  query GetCategoryPostsBySlugArray($slugs: [String!]!, $first: Int!, $after: String) {
    categories(where: { slug: $slugs }) {
      nodes {
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
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query AllPosts($first: Int!, $after: String) {
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

// ==============================================================================
// OPTIMIZED COMBINED QUERIES (New)
// ==============================================================================

export const GET_CATEGORY_DATA_COMBINED = gql`
  query GetCategoryDataCombined($slugs: [String!]!, $first: Int!, $after: String) {
    categories(where: { slug: $slugs }) {
      nodes {
        databaseId
        name
        slug
        # Get all post IDs for total count
        allPosts: posts(first: 9999) {
          nodes {
            databaseId
          }
        }
        # Get the first page of posts
        paginatedPosts: posts(first: $first, after: $after) {
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
    }
  }
`;

export const GET_ALL_POST_DATA_COMBINED = gql`
  query GetAllPostDataCombined($first: Int!, $after: String) {
    # Get all post IDs for total count
    allPosts: posts(first: 9999) {
      nodes {
        databaseId
      }
    }
    # Get the first page of posts
    paginatedPosts: posts(first: $first, after: $after) {
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
