// app/lib/data-fetcher.ts
import { GraphQLClient } from "graphql-request";
import {
  GET_ALL_CATEGORIES,
  GET_POSTS_BY_CATEGORY,
  GET_ALL_POSTS_SIMPLE,
} from "./queries";
import type {
  Category,
  RawPost,
  MappedPost,
  PagedPosts,
} from "./definitions";
import { cache } from "react";

// ======================================================================================
// CONFIG CLIENTE
// ======================================================================================
const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

const client = new GraphQLClient(GQL_ENDPOINT, {
  headers: { "Content-Type": "application/json" },
});

// ======================================================================================
// HELPERS
// ======================================================================================

export function normalizeSlug(str: string): string {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Convierte RawPost → MappedPost
function mapPost(p: RawPost): MappedPost {
  return {
    id: Number(p.databaseId),
    title: p.title ?? "",
    slug: p.slug ?? "",
    excerpt: p.excerpt ?? "",
    date: p.date ?? "",
    featuredImage:
      p.featuredImage?.node?.sourceUrl ??
      p.featuredImage?.node?.mediaItemUrl ??
      null,
  };
}

// ======================================================================================
// CATEGORÍAS
// ======================================================================================

export async function getAllCategories(): Promise<Category[]> {
  try {
    const data = await client.request(GET_ALL_CATEGORIES);

    return data?.categories?.nodes?.map((c: any) => ({
      name: c.name,
      slug: normalizeSlug(c.slug),
    }));
  } catch (err) {
    console.error("Error getAllCategories:", err);
    return [];
  }
}

// ======================================================================================
// POSTS: LISTA SIMPLE (sin paginación del servidor)
// ======================================================================================

export async function getAllPosts(): Promise<MappedPost[]> {
  try {
    const data = await client.request(GET_ALL_POSTS_SIMPLE);

    const posts: RawPost[] = data?.posts?.nodes ?? [];
    return posts.map(mapPost);
  } catch (err) {
    console.error("Error getAllPosts:", err);
    return [];
  }
}

// ======================================================================================
// POSTS POR CATEGORÍA
// ======================================================================================

export async function getPostsByCategory(
  slug: string | null
): Promise<MappedPost[]> {
  try {
    if (!slug) return getAllPosts();

    const data = await client.request(GET_POSTS_BY_CATEGORY, { slug });

    const posts: RawPost[] = data?.posts?.nodes ?? [];
    return posts.map(mapPost);
  } catch (err) {
    console.error("Error getPostsByCategory:", err);
    return [];
  }
}

// ======================================================================================
// PAGINADO FAKE (10 por página)
// ======================================================================================

const PAGE_SIZE = 10;

export async function getPostsPage(
  slug: string | null,
  page: number
): Promise<PagedPosts> {
  const list = await getPostsByCategory(slug);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const slice = list.slice(start, end);

  return {
    posts: slice,
    total,
    totalPages,
    category:
      slug && list.length > 0
        ? { name: list[0].title ?? slug, slug }
        : { name: slug ?? "Todas", slug: slug ?? "" },
  };
}

// ======================================================================================
// CACHE SERVER (NEXT 14 PRO)
// ======================================================================================

export const getCachedPostsPage = cache(
  async (slug: string | null, page: number): Promise<PagedPosts> => {
    return await getPostsPage(slug, page);
  },
  {
    tags: (slug: string | null, page: number) => [
      "category-page",
      slug ? normalizeSlug(slug) : "all",
      String(page),
    ],
  }
);

