// app/lib/data-fetcher.ts
import fs from "fs";
import path from "path";
import { POSTS_PER_PAGE, WP_API_URL } from "@/app/lib/constants";
import type { Post, Category, PagedPosts, MappedPost } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";

const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutos
const CACHE_DIR = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), ".next", "cache");

// helper: ensure cache dir exists
function ensureCacheDir() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    // ignore; fallback will be in-memory or fresh fetches
    console.warn("No se pudo crear cache dir:", CACHE_DIR, e);
  }
}

async function doFetchGraphQL(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(WP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error("GraphQL error:", json.errors ?? res.statusText);
    return null;
  }
  return json.data;
}

// ---------------- mapPostData (simple, compatible)
export function mapPostData(node: any): MappedPost {
  const mainCat = node?.categories?.nodes?.[0] ?? null;
  return {
    databaseId: Number(node.databaseId ?? 0),
    title: node.title ?? "",
    excerpt: node.excerpt ?? "",
    slug: node.slug ?? "",
    date: node.date ?? "",
    featuredImage: node.featuredImage?.node?.sourceUrl ?? null,
    categories: (node.categories?.nodes ?? []).map((c: any) => ({
      databaseId: Number(c.databaseId ?? 0),
      name: c.name ?? "",
      slug: c.slug ?? "",
      count: Number(c.count ?? 0),
    })),
    category: mainCat?.name ?? null,
    categorySlug: mainCat?.slug ?? null,
  };
}

// ---------------- Cache helpers (file)
function cacheFileForSlug(slug: string) {
  ensureCacheDir();
  // sanitize slug for filename
  const safe = slug.replace(/[^a-z0-9-_]/gi, "_");
  return path.join(CACHE_DIR, `category-cursors-${safe}.json`);
}

function writeCacheFile(slug: string, obj: any) {
  try {
    const file = cacheFileForSlug(slug);
    fs.writeFileSync(file, JSON.stringify({ ts: Date.now(), data: obj }), "utf-8");
  } catch (e) {
    console.warn("Error escribiendo cache:", e);
  }
}

function readCacheFile(slug: string) {
  try {
    const file = cacheFileForSlug(slug);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.ts ?? 0) > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch (e) {
    return null;
  }
}

// ---------------- Fetch cursors (collect minimal metadata)
// Se trae edges { cursor } y total count (pageInfo.totalCount or length)
async function fetchCategoryCursors(slug: string) {
  // Vamos a paginar internamente por bloques de 100 para no pedir todo a la vez
  const perBatch = 100;
  let after: string | null = null;
  const cursors: string[] = [];
  let total = 0;
  while (true) {
    const q = `
      query CategoryCursors($slug: String!, $first: Int!, $after: String) {
        posts(
          where: { categoryName: $slug }
          first: $first
          after: $after
        ) {
          edges {
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;
    const variables: any = { slug, first: perBatch };
    if (after) variables.after = after;

    const data = await doFetchGraphQL(q, variables);
    if (!data || !data.posts) break;

    const edges = data.posts.edges ?? [];
    for (const e of edges) {
      if (e?.cursor) cursors.push(e.cursor);
    }

    total = cursors.length;

    const pageInfo = data.posts.pageInfo ?? {};
    if (!pageInfo.hasNextPage) break;
    after = pageInfo.endCursor;
    // small safety: if no endCursor break
    if (!after) break;
  }

  return { cursors, total };
}

// ---------------- Cached wrapper
export async function getCategoryCursorsCached(slug: string) {
  // try cache
  const cached = readCacheFile(slug);
  if (cached && Array.isArray(cached.cursors)) {
    return cached;
  }

  // fetch fresh
  const fresh = await fetchCategoryCursors(slug);
  writeCacheFile(slug, fresh);
  return fresh;
}

// ---------------- Build page by cursor (page numbered, pageSize)
export async function getCategoryPageByCursor(
  slug: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {
  noStore();
  // get cursors (cached)
  const { cursors, total } = await getCategoryCursorsCached(slug);

  // compute after cursor for requested page
  // page 1 -> after = null
  // page N -> after = cursor at index (pageStartIndex - 1)
  const pageStartIndex = (page - 1) * pageSize; // 0-based index of first item in this page
  let after: string | null = null;
  if (pageStartIndex > 0) {
    const prevIndex = pageStartIndex - 1;
    after = cursors[prevIndex] ?? null;
    if (!after) {
      // requested page beyond available items
      return { posts: [], totalPages: Math.ceil(total / pageSize), total, category: { databaseId: 0, name: slug, slug, count: total } };
    }
  }

  const q = `
    query CategoryPage($slug: String!, $first: Int!, $after: String) {
      posts(
        where: { categoryName: $slug }
        first: $first
        after: $after
      ) {
        nodes {
          databaseId
          title
          excerpt
          slug
          date
          featuredImage { node { sourceUrl } }
          categories { nodes { databaseId name slug count } }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  const variables: any = { slug, first: pageSize };
  if (after) variables.after = after;

  const data = await doFetchGraphQL(q, variables);
  const nodes = data?.posts?.nodes ?? [];

  const posts = nodes.map(mapPostData);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / pageSize),
    category: { databaseId: 0, name: slug, slug, count: total },
  };
}

// ---------------- Public primary function: getCachedPostsPage compatible
// If slug === null => return latest posts using cursor-based global listing
export async function getCachedPostsPage(
  slug: string | null = null,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {
  noStore();

  if (!slug) {
    // fetch latest posts (global) using cursor-based simple fetch (no precomputed cursors)
    const q = `
      query LatestPage($first: Int!, $after: String) {
        posts(first: $first, after: $after) {
          nodes {
            databaseId
            title
            excerpt
            slug
            date
            featuredImage { node { sourceUrl } }
            categories { nodes { databaseId name slug count } }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;
    // For simplicity, treat page 1 as after=null and page>1 use an optimization:
    // We'll precompute cursors for "all posts" if page > 1 (similar to category),
    // but simpler: fetch (page * pageSize) items and slice — acceptable for moderate pages.
    const itemsToFetch = page === 1 ? pageSize : page * pageSize;
    const variables = { first: itemsToFetch };
    const data = await doFetchGraphQL(q, variables);
    const nodes = data?.posts?.nodes ?? [];
    const totalFetched = nodes.length;
    const start = (page - 1) * pageSize;
    const pageNodes = nodes.slice(start, start + pageSize);
    return {
      posts: pageNodes.map(mapPostData),
      total: totalFetched,
      totalPages: Math.ceil(totalFetched / pageSize),
      category: null,
    };
  }

  // If slug provided -> use cursor approach with cached cursors
  return getCategoryPageByCursor(slug, page, pageSize);
}

// ---------------- Optional: getVariasPostsPage (ejemplo usando category 'programas' and NOT_IN)
// You can adapt this to use cursor logic as well, omitted for brevity
export async function getVariasPostsPage(page: number = 1, pageSize: number = 10): Promise<PagedPosts> {
  // Simple approach: call getCachedPostsPage with slug = 'programas' and then filter on categories server-side
  // But the best is to create a custom GraphQL query with taxQuery (cursor-based)
  // For now, fetch page of programas and filter server-side:
  const res = await getCachedPostsPage("programas", page, pageSize);
  // Filter out posts that belong to excluded categories (locales, desayuno-pymes, cadena-verdeamarilla)
  const excluded = ["locales", "desayuno-pymes", "cadena-verdeamarilla"];
  const filtered = res.posts.filter(p => !(p.categories?.nodes ?? []).some(c => excluded.includes(c.slug)));
  // Note: total/totalPages become approximate; for perfect counts you'd need cursor collection with taxQuery
  return {
    posts: filtered,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / pageSize),
    category: res.category,
  };
}
