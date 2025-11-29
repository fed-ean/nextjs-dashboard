// app/lib/data-fetcher.ts
import {
  GET_ALL_CATEGORIES,
  GET_POSTS_BY_CATEGORY_SIMPLE,
  GET_ALL_POSTS_SIMPLE,
} from "./queries";

import type { Post, Category, PagedPosts } from "./definitions";

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

import { DocumentNode } from "graphql";

async function fetchGraphQL(
  query: string | DocumentNode,
  variables: Record<string, any> = {}
) {
  const response = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query: typeof query === "string" ? query : query.loc?.source.body,
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


// --- Normalizador de posts ---
const mapPostData = (p: any): Post => {
  return {
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
  };
};

// --- Obtener todas las categorías ---
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

// --- Paginación corregida y optimizada ---
export async function getCachedPostsPage(
  slug: string | null,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {
  const offset = (page - 1) * pageSize;

  if (slug) {
    // Si buscamos por categoría: usamos la query de categorías -> posts
    const variables = { slug, size: pageSize, offset };
    const data = await fetchGraphQL(GET_POSTS_BY_CATEGORY_SIMPLE, variables);

    // Si no vino data o la categoría no existe
    const categoryNode = data?.categories?.nodes?.[0];
    if (!categoryNode?.posts?.nodes) {
      return { posts: [], totalPages: 0, total: 0, category: slug };
    }

    const postsRaw = categoryNode.posts.nodes;
    const totalPosts = Number(
      categoryNode.posts.pageInfo?.offsetPagination?.total ?? 0
    );
    const totalPages = Math.ceil(totalPosts / pageSize);

    return {
      posts: postsRaw.map(mapPostData),
      totalPages,
      total: totalPosts,
      category: {
        databaseId: Number(categoryNode.databaseId ?? 0),
        name: categoryNode.name ?? "",
        slug: categoryNode.slug ?? "",
        count: 0,
      } as unknown as string, // Mantengo compatibilidad con tu tipo PagedPosts; ajusta si tu definición espera Category type
    };
  } else {
    // Si buscamos todos los posts (sin categoría)
    const variables = { size: pageSize, offset };
    const data = await fetchGraphQL(GET_ALL_POSTS_SIMPLE, variables);

    if (!data?.posts?.nodes) {
      return { posts: [], totalPages: 0, total: 0, category: null };
    }

    const postsRaw = data.posts.nodes;
    const totalPosts = Number(
      data.posts.pageInfo?.offsetPagination?.total ?? 0
    );
    const totalPages = Math.ceil(totalPosts / pageSize);

    return {
      posts: postsRaw.map(mapPostData),
      totalPages,
      total: totalPosts,
      category: null,
    };
  }
}
