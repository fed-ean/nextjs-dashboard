// app/lib/data-fetcher.ts
import {
  GET_ALL_CATEGORIES,
  GET_POSTS_BY_CATEGORY_SIMPLE,
  GET_ALL_POSTS_SIMPLE,
} from "./queries";

import type { Post, Category, PagedPosts } from "./definitions";
import { print } from "graphql"; // ← convierte DocumentNode → string

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

// -------------------------------------------------------
// FETCH GENÉRICO (acepta DocumentNode o string)
// -------------------------------------------------------
async function fetchGraphQL(
  query: any,
  variables: Record<string, any> = {}
) {
  const queryString = typeof query === "string" ? query : print(query);

  const response = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query: queryString,
      variables,
    }),
  });

  const json = await response.json();

  if (!response.ok || json.errors) {
    console.error("GraphQL Error:", json.errors || response.statusText);
    return null;
  }

  return json.data;
}

// -------------------------------------------------------
// NORMALIZADOR DE POSTS
// -------------------------------------------------------
const mapPostData = (p: any): Post => ({
  databaseId: Number(p.databaseId ?? 0),
  title: p.title ?? "",
  excerpt: p.excerpt ?? "",
  slug: p.slug ?? "",
  date: p.date ?? "",
  featuredImage: {
    node: {
      sourceUrl: p.featuredImage?.node?.sourceUrl ?? null,
    },
  },
  categories: {
    nodes:
      p.categories?.nodes?.map((c: any) => ({
        databaseId: Number(c.databaseId ?? 0),
        name: c.name ?? "",
        slug: c.slug ?? "",
        count: Number(c.count ?? 0),
      })) ?? [],
  },
});

// -------------------------------------------------------
// OBTENER TODAS LAS CATEGORÍAS
// -------------------------------------------------------
export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchGraphQL(GET_ALL_CATEGORIES);

  if (!data?.categories?.nodes) return [];

  return data.categories.nodes.map((c: any): Category => ({
    databaseId: Number(c.databaseId ?? 0),
    name: c.name ?? "",
    slug: c.slug ?? "",
    count: Number(c.count ?? 0),
  }));
}

// -------------------------------------------------------
// PAGINACIÓN SSR
// -------------------------------------------------------
export async function getCachedPostsPage(
  slug: string | null,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {
  const offset = (page - 1) * pageSize;

  // -----------------------------------------------------
  // SI HAY CATEGORÍA
  // -----------------------------------------------------
  if (slug) {
    const variables = { categoryName: slug, size: pageSize, offset };

    const data = await fetchGraphQL(GET_POSTS_BY_CATEGORY_SIMPLE, variables);

    const postsNodes = data?.posts?.nodes ?? [];
    const totalPosts =
      Number(data?.posts?.pageInfo?.offsetPagination?.total ?? 0);

    const totalPages = Math.ceil(totalPosts / pageSize);

    return {
      posts: postsNodes.map(mapPostData),
      total: totalPosts,
      totalPages,
      category: {
        databaseId: 0,
        name: slug,
        slug,
        count: totalPosts,
      },
    };
  }

  // -----------------------------------------------------
  // SIN CATEGORÍA → TODOS LOS POSTS
  // -----------------------------------------------------
  const variables = { size: pageSize, offset };
  const data = await fetchGraphQL(GET_ALL_POSTS_SIMPLE, variables);

  const postsNodes = data?.posts?.nodes ?? [];
  const totalPosts =
    Number(data?.posts?.pageInfo?.offsetPagination?.total ?? 0);

  const totalPages = Math.ceil(totalPosts / pageSize);

  return {
    posts: postsNodes.map(mapPostData),
    total: totalPosts,
    totalPages,
    category: null,
  };
}
