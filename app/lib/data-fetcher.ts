// app/lib/data-fetcher.ts
import {
  GET_ALL_CATEGORIES,
  GET_POSTS_BY_CATEGORY_SIMPLE,
  GET_ALL_POSTS_SIMPLE,
} from "./queries";
import type { Post, Category, PagedPosts } from "./definitions";
import { print } from "graphql";
import type { DocumentNode } from "graphql";

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

// convierte DocumentNode -> string si es necesario
function toQueryString(q: string | DocumentNode) {
  return typeof q === "string" ? q : print(q);
}

async function fetchGraphQL(
  query: string | DocumentNode,
  variables: Record<string, any> = {}
) {
  const queryString = toQueryString(query);

  const response = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // revalidate corto mientras debuggeamos
    next: { revalidate: 60 },
    body: JSON.stringify({ query: queryString, variables }),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || json?.errors) {
    console.error("GraphQL Error:", json?.errors || response?.statusText || json);
    return null;
  }

  return json.data;
}

// normalizador
const mapPostData = (p: any): Post => ({
  databaseId: Number(p.databaseId ?? 0),
  title: p.title ?? "",
  excerpt: p.excerpt ?? "",
  slug: p.slug ?? "",
  date: p.date ?? "",
  featuredImage: { node: { sourceUrl: p.featuredImage?.node?.sourceUrl ?? null } },
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

export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchGraphQL(GET_ALL_CATEGORIES);
  if (!data?.categories?.nodes) return [];
  return data.categories.nodes.map((c: any) => ({
    databaseId: Number(c.databaseId ?? 0),
    name: c.name ?? "",
    slug: c.slug ?? "",
    count: Number(c.count ?? 0),
  }));
}

export async function getCachedPostsPage(
  slug: string | null,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {
  const offset = (page - 1) * pageSize;

  if (slug) {
    // usamos query por categoria (categories -> posts)
    const variables = { slug, size: pageSize, offset };
    const data = await fetchGraphQL(GET_POSTS_BY_CATEGORY_SIMPLE, variables);

    // Extraemos la categoría (si existe)
    const categoryNode = data?.categories?.nodes?.[0] ?? null;
    const postsNodes = categoryNode?.posts?.nodes ?? [];
    const totalPosts = Number(categoryNode?.posts?.pageInfo?.offsetPagination?.total ?? 0);
    const totalPages = Math.ceil(totalPosts / pageSize) || 0;

    return {
      posts: postsNodes.map(mapPostData),
      total: totalPosts,
      totalPages,
      category: categoryNode
        ? {
            databaseId: Number(categoryNode.databaseId ?? 0),
            name: categoryNode.name ?? slug,
            slug: categoryNode.slug ?? slug,
            count: Number(categoryNode.count ?? totalPosts),
          }
        : null,
    };
  }

  // todos los posts
  const variables = { size: pageSize, offset };
  const data = await fetchGraphQL(GET_ALL_POSTS_SIMPLE, variables);

  const postsNodes = data?.posts?.nodes ?? [];
  const totalPosts = Number(data?.posts?.pageInfo?.offsetPagination?.total ?? 0);
  const totalPages = Math.ceil(totalPosts / pageSize) || 0;

  return {
    posts: postsNodes.map(mapPostData),
    total: totalPosts,
    totalPages,
    category: null,
  };
}
