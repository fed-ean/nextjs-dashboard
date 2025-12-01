// app/lib/data-fetcher.ts
import { POSTS_PER_PAGE, WP_API_URL } from "@/app/lib/constants";
import type { Post, Category, PagedPosts, MappedPost } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";

const API_TOKEN = process.env.WORDPRESS_API_TOKEN;

// -----------------------------
// Helper fetch genérico
// -----------------------------
async function fetchAPI(query = "", variables: Record<string, any> = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_TOKEN) headers["Authorization"] = `Bearer ${API_TOKEN}`;

  const res = await fetch(WP_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // next: { revalidate: 60 } // opcional
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.errors) {
    console.error("GraphQL Error:", json?.errors ?? res.statusText);
    return null;
  }

  return json.data;
}

// -----------------------------
// Export: mapPostData (Post -> MappedPost)
// -----------------------------
export function mapPostData(node: any): MappedPost {
  const mainCat = node?.categories?.nodes?.[0] ?? null;

  return {
    databaseId: Number(node?.databaseId ?? 0),
    title: node?.title ?? "",
    excerpt: node?.excerpt ?? "",
    slug: node?.slug ?? "",
    date: node?.date ?? "",
    featuredImage: node?.featuredImage?.node?.sourceUrl ?? null,
    categories: node?.categories?.nodes?.map((c: any) => ({
      databaseId: Number(c.databaseId ?? 0),
      name: c.name ?? "",
      slug: c.slug ?? "",
      count: Number(c.count ?? 0),
    })) ?? [],

    // Campos útiles para UI (CategoryGrid / Sidenav / etc)
    category: mainCat?.name ?? null,
    categorySlug: mainCat?.slug ?? null,
  };
}

// -----------------------------
// getAllCategories
// -----------------------------
export async function getAllCategories(): Promise<Category[]> {
  noStore();
  const query = `
    query GetAllCategories {
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

  const data = await fetchAPI(query);
  return data?.categories?.nodes?.map((c: any) => ({
    databaseId: Number(c.databaseId ?? 0),
    name: c.name ?? "",
    slug: c.slug ?? "",
    count: Number(c.count ?? 0),
  })) ?? [];
}

// -----------------------------
// getCachedPostsPage(slug | null, page, pageSize)
// - si slug === null => trae últimos posts (modo "All")
// - si slug provided => posts de la categoría
// -----------------------------
export async function getCachedPostsPage(
  slug: string | null = null,
  page: number = 1,
  pageSize: number = POSTS_PER_PAGE
): Promise<PagedPosts> {
  noStore();
  const offset = (page - 1) * pageSize;

  // -------------------------
  // Sin categoría -> últimos posts
  // -------------------------
  if (!slug) {
    const query = `
      query GetLatestPosts($size: Int!, $offset: Int!) {
        posts(where: { offsetPagination: { size: $size, offset: $offset } }) {
          nodes {
            databaseId
            title
            excerpt
            slug
            date
            featuredImage { node { sourceUrl } }
            categories { nodes { databaseId name slug count } }
          }
          pageInfo { offsetPagination { total } }
        }
      }
    `;
    console.log("📌 Buscando categoría con slug:", slug);

    const data = await fetchAPI(query, { size: pageSize, offset });
    const postsNodes = data?.posts?.nodes ?? [];
    const total = Number(data?.posts?.pageInfo?.offsetPagination?.total ?? 0);

    console.log("📌 Resultado categorías:", JSON.stringify(data?.categories?.nodes, null, 2));

    return {
      posts: postsNodes.map(mapPostData),
      total,
      totalPages: Math.ceil(total / pageSize) || 0,
      category: null,
    };
  }

  // -------------------------
  // Con categoría -> posts de category
  // -------------------------
  const query = `
    query GetCategoryPosts($slug: [String], $size: Int!, $offset: Int!) {
      categories(where: { slug: $slug }) {
        nodes {
          databaseId
          name
          slug
          count
          posts(where: { offsetPagination: { size: $size, offset: $offset } }) {
            nodes {
              databaseId
              title
              excerpt
              slug
              date
              featuredImage { node { sourceUrl } }
              categories { nodes { databaseId name slug count } }
            }
            pageInfo { offsetPagination { total } }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, { slug: [slug], size: pageSize, offset });

  try {
    const categoryNode = data?.categories?.nodes?.[0] ?? null;
    if (!categoryNode) {
      return { posts: [], total: 0, totalPages: 0, category: null };
    }

    const postsNodes = categoryNode?.posts?.nodes ?? [];
    const total = Number(categoryNode?.posts?.pageInfo?.offsetPagination?.total ?? 0);

    return {
      posts: postsNodes.map(mapPostData),
      total,
      totalPages: Math.ceil(total / pageSize) || 0,
      category: {
        databaseId: Number(categoryNode.databaseId ?? 0),
        name: categoryNode.name ?? "",
        slug: categoryNode.slug ?? "",
        count: Number(categoryNode.count ?? 0),
      },
    };
  } catch (err) {
    console.error("Error parsing category posts:", err);
    return { posts: [], total: 0, totalPages: 0, category: null };
  }
}

// -----------------------------
// getVariasPostsPage(page) -> posts en programas EXCLUYENDO slugs dados
// -----------------------------
export async function getVariasPostsPage(
  page: number = 1,
  pageSize: number = POSTS_PER_PAGE
): Promise<PagedPosts> {
  noStore();
  const offset = (page - 1) * pageSize;

  const query = `
    query GetVariasPosts($size: Int!, $offset: Int!) {
      categories(where: { slug: "programas" }) {
        nodes {
          databaseId
          name
          slug
          count
          posts(
            where: {
              offsetPagination: { size: $size, offset: $offset }
              taxQuery: {
                taxArray: [
                  {
                    taxonomy: CATEGORY
                    field: SLUG
                    terms: ["locales", "desayuno-pymes", "cadena-verdeamarilla"]
                    operator: NOT_IN
                  }
                ]
              }
            }
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
            pageInfo { offsetPagination { total } }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, { size: pageSize, offset });

  const categoryNode = data?.categories?.nodes?.[0] ?? null;
  if (!categoryNode) {
    return { posts: [], total: 0, totalPages: 0, category: null };
  }

  const postsNodes = categoryNode.posts?.nodes ?? [];
  const total = Number(categoryNode.posts?.pageInfo?.offsetPagination?.total ?? 0);

  return {
    posts: postsNodes.map(mapPostData),
    total,
    totalPages: Math.ceil(total / pageSize) || 0,
    category: {
      databaseId: Number(categoryNode.databaseId ?? 0),
      name: categoryNode.name ?? "",
      slug: categoryNode.slug ?? "",
      count: Number(categoryNode.count ?? 0),
    },
  };
}

// -----------------------------
// getAllPosts (raw, mapped)
// -----------------------------
export async function getAllPostsMapped(): Promise<MappedPost[]> {
  noStore();
  const query = `
    query AllPosts($first: Int) {
      posts(first: $first) {
        nodes {
          databaseId
          title
          excerpt
          slug
          date
          featuredImage { node { sourceUrl } }
          categories { nodes { databaseId name slug count } }
        }
      }
    }
  `;

  const data = await fetchAPI(query, { first: 50 });
  const nodes = data?.posts?.nodes ?? [];
  return nodes.map(mapPostData);
}
// ✔ Agregar en data-fetcher.ts
import { print } from "graphql";
import { GET_ALL_POSTS_SIMPLE } from "./queries";

export async function getAllPosts(pageSize: number = 50, offset: number = 0) {
  noStore();

  try {
    const queryString = print(GET_ALL_POSTS_SIMPLE);

    const data = await fetchAPI(queryString, {
      variables: {
        size: pageSize,
        offset,
      },
    });

    const nodes = data?.posts?.nodes ?? [];
    return nodes.map(mapPostData);

  } catch (error) {
    console.error("Error en getAllPosts():", error);
    return [];
  }
}
