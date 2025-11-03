// lib/queries.ts
import { gql } from '@apollo/client';

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

/* 1) slug como ARRAY */
export const GET_CATEGORY_POSTS_BY_SLUG_ARRAY = gql`
  query GetCategoryPostsBySlugArray($slugs: [String!]!, $first: Int!, $after: String) {
    categories(where: { slug: $slugs }) {
      nodes {
        databaseId
        name
        slug
        posts(first: $first, after: $after) {
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
          pageInfo { endCursor hasNextPage }
        }
      }
    }
  }
`;

/* 2) slug simple (String) */
export const GET_CATEGORY_POSTS_BY_SLUG = gql`
  query GetCategoryPostsBySlug($slug: String!, $first: Int!, $after: String) {
    categories(where: { slug: $slug }) {
      nodes {
        databaseId
        name
        slug
        posts(first: $first, after: $after) {
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
          pageInfo { endCursor hasNextPage }
        }
      }
    }
  }
`;

/* 3) slugIn (por compatibilidad) */
export const GET_CATEGORY_POSTS_BY_SLUGIN = gql`
  query GetCategoryPostsBySlugIn($slugIn: [String!]!, $first: Int!, $after: String) {
    categories(where: { slugIn: $slugIn }) {
      nodes {
        databaseId
        name
        slug
        posts(first: $first, after: $after) {
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
          pageInfo { endCursor hasNextPage }
        }
      }
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query AllPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
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
      pageInfo { endCursor hasNextPage }
    }
  }
`;
