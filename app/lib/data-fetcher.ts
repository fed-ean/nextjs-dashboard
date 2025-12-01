
import { POSTS_PER_PAGE, WP_API_URL } from '@/app/lib/constants';
import { Post, Category, PagedPosts, MappedPost } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const API_TOKEN = process.env.WORDPRESS_API_TOKEN;

async function fetchAPI(query = '', { variables }: Record<string, any> = {}) {
  const headers = { 'Content-Type': 'application/json' } as any;

  if (API_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${API_TOKEN}`;
  }

  const res = await fetch(WP_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    // next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

// Helper para mapear los datos del post
export function mapPostData(post: Post): MappedPost {
  return {
    databaseId: post.databaseId,
    title: post.title,
    slug: post.slug,
    featuredImage: post.featuredImage?.node.sourceUrl ?? '/placeholder.jpg',
    category: post.categories?.nodes[0]?.name ?? 'Sin categoría',
    categorySlug: post.categories?.nodes[0]?.slug ?? 'general',
  };
}


export async function getAllPosts() {
  noStore();
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          databaseId
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
    `
  );

  return (data?.posts?.nodes ?? []).map(mapPostData);
}

export async function getAllCategories(): Promise<Category[]> {
  noStore();
  const data = await fetchAPI(`
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
  `);
  return data?.categories?.nodes ?? [];
}

export async function getCachedPostsPage(
  slug: string | null = null,
  page: number = 1
): Promise<PagedPosts> {

  noStore();
  const pageSize = POSTS_PER_PAGE;
  const offset = (page - 1) * pageSize;

  // -------------------------------------
  // 🔵 1) MODO "SIN CATEGORÍA" → últimos posts
  // -------------------------------------
  if (!slug) {
    const query = `
      query GetLatestPosts($pageSize: Int, $offset: Int) {
        posts(where: { offsetPagination: { size: $pageSize, offset: $offset } }) {
          nodes {
            databaseId
            title
            slug
            featuredImage {
              node {
                sourceUrl
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
          }
          pageInfo {
            offsetPagination {
              total
            }
          }
        }
      }
    `;

    const variables = { pageSize, offset };

    const data = await fetchAPI(query, { variables });

    const postsNodes = data?.posts?.nodes ?? [];
    const totalPosts = Number(
      data?.posts?.pageInfo?.offsetPagination?.total ?? 0
    );

    return {
      posts: postsNodes.map(mapPostData),
      total: totalPosts,
      totalPages: Math.ceil(totalPosts / pageSize),
      category: null,
    };
  }

  // -------------------------------------
  // 🔵 2) MODO CATEGORÍA NORMAL
  // -------------------------------------
  const query = `
    query GetCategoryPosts($slug: [String], $pageSize: Int, $offset: Int) {
      categories(where: { slug: $slug }) {
        nodes {
          databaseId
          name
          slug
          count
          posts(where: { offsetPagination: { size: $pageSize, offset: $offset } }) {
            nodes {
              databaseId
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
            pageInfo {
              offsetPagination {
                total
              }
            }
          }
        }
      }
    }
  `;

  const variables = { slug: [slug], pageSize, offset };

  try {
    const data = await fetchAPI(query, { variables });

    const categoryNode = data?.categories?.nodes?.[0];

    if (!categoryNode) {
      return {
        posts: [],
        total: 0,
        totalPages: 0,
        category: null,
      };
    }

    const postsNodes = categoryNode.posts.nodes ?? [];
    const totalPosts = Number(
      categoryNode.posts.pageInfo.offsetPagination.total ?? 0
    );

    return {
      posts: postsNodes.map(mapPostData),
      total: totalPosts,
      totalPages: Math.ceil(totalPosts / pageSize),
      category: {
        databaseId: categoryNode.databaseId,
        name: categoryNode.name,
        slug: categoryNode.slug,
        count: categoryNode.count,
      },
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${slug}:`, error);

    return {
      posts: [],
      total: 0,
      totalPages: 0,
      category: null,
    };
  }
}


// ============================
// ✔️ FUNCIÓN NUEVA: VARIAS
// ============================
export async function getVariasPostsPage(page: number): Promise<PagedPosts> {
  noStore();
  const pageSize = POSTS_PER_PAGE;
  const offset = (page - 1) * pageSize;

  const query = `
    query GetVariasPosts($pageSize: Int, $offset: Int) {
      categories(where: { slug: "programas" }) {
        nodes {
          databaseId
          name
          slug
          count
          posts(
            where: {
              offsetPagination: { size: $pageSize, offset: $offset }
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
              slug
              featuredImage {
                node {
                  sourceUrl
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
            pageInfo {
              offsetPagination {
                total
              }
            }
          }
        }
      }
    }
  `;

  const variables = { pageSize, offset };

  try {
    const data = await fetchAPI(query, { variables });

    const categoryNode = data?.categories?.nodes?.[0];
    if (!categoryNode) {
      return {
        posts: [],
        total: 0,
        totalPages: 0,
        category: null,
      };
    }

    const postsNodes = categoryNode.posts.nodes ?? [];
    const totalPosts = Number(
      categoryNode?.posts?.pageInfo?.offsetPagination?.total ?? 0
    );

    const totalPages = Math.ceil(totalPosts / pageSize) || 0;

    return {
      posts: postsNodes.map(mapPostData),
      total: totalPosts,
      totalPages,
      category: {
        databaseId: categoryNode.databaseId,
        name: categoryNode.name,
        slug: categoryNode.slug,
        count: categoryNode.count,
      },
    };
  } catch (error) {
    console.error("Error loading VARIAS posts:", error);
    return {
      posts: [],
      total: 0,
      totalPages: 0,
      category: null,
    };
  }
}
