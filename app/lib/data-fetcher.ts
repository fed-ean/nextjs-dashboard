// app/lib/data-fetcher.ts
import {
  GET_ALL_CATEGORIES,
  GET_POSTS_BY_CATEGORY_SIMPLE,
  GET_ALL_POSTS_SIMPLE
} from './queries';

import type { Post, Category, PagedPosts } from './definitions';

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

async function fetchGraphQL(query: any, variables: Record<string, any> = {}) {
  const response = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query: query.loc.source.body,
      variables
    }),
  });

  const json = await response.json();

  if (!response.ok || json.errors) {
    console.error("GraphQL Error:", json.errors || response.statusText);
    return null;
  }

  return json.data;
}

// NORMALIZADOR
const mapPostData = (p: any): Post => ({
  databaseId: Number(p.databaseId),
  title: p.title ?? '',
  excerpt: p.excerpt ?? '',
  slug: p.slug ?? '',
  date: p.date ?? '',

  featuredImage: {
    node: {
      sourceUrl: p.featuredImage?.node?.sourceUrl ?? null
    }
  },

  categories: {
    nodes: p.categories?.nodes?.map((c: any) => ({
      databaseId: Number(c.databaseId),
      name: c.name,
      slug: c.slug,
      count: Number(c.count ?? 0)
    })) ?? []
  }
});

// Todas las categorías
export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchGraphQL(GET_ALL_CATEGORIES);

  if (!data?.categories?.nodes) return [];

  return data.categories.nodes.map((c: any): Category => ({
    databaseId: Number(c.databaseId),
    name: c.name ?? '',
    slug: c.slug ?? '',
    count: Number(c.count ?? 0)
  }));
}

// Paginación real SSR
export async function getCachedPostsPage(
  slug: string | null,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {

  const isCategory = !!slug;
  const query = isCategory ? GET_POSTS_BY_CATEGORY_SIMPLE : GET_ALL_POSTS_SIMPLE;

  const offset = (page - 1) * pageSize;

  const variables = isCategory
    ? { categoryName: slug, size: pageSize, offset }
    : { size: pageSize, offset };

  const data = await fetchGraphQL(query, variables);

  if (!data?.posts?.nodes) {
    return {
      posts: [],
      totalPages: 0,
      total: 0,
      category: null
    };
  }

  const totalPosts = Number(data.posts.pageInfo?.offsetPagination?.total ?? 0);
  const totalPages = Math.ceil(totalPosts / pageSize);

  return {
    posts: data.posts.nodes.map(mapPostData),
    totalPages,
    total: totalPosts,
    category: null
  };
}
