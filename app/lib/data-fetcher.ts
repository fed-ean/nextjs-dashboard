import {
  GET_ALL_CATEGORIES,
  GET_POSTS_BY_CATEGORY_SIMPLE,
  GET_ALL_POSTS_SIMPLE
} from './queries';
import type { Post, Category, PagedPosts } from './definitions';

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

async function fetchGraphQL(query: any, variables: Record<string, any> = {}): Promise<any | null> {
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
      body: JSON.stringify({
        query: query?.loc?.source?.body ?? (typeof query === 'string' ? query : ''),
        variables
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      // eslint-disable-next-line no-console
      console.error("GraphQL Network Error:", response.status, response.statusText, text);
      return null;
    }

    const json = await response.json().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("GraphQL JSON parse error:", err);
      return null;
    });

    if (!json) return null;

    if (json.errors) {
      // eslint-disable-next-line no-console
      console.error("GraphQL query failed:", json.errors);
      return null;
    }

    return json.data ?? null;
  } catch (err) {
    // network/other unexpected error
    // eslint-disable-next-line no-console
    console.error("[fetchGraphQL] unexpected error", err, { query, variables });
    return null;
  }
}

// ✅ Normaliza los posts para que coincidan SIEMPRE con definitions.ts
const mapPostData = (p: any): Post => {
  const safe = p ?? {};
  return {
    databaseId: Number(safe.databaseId ?? 0),
    title: safe.title ?? '',
    excerpt: safe.excerpt ?? '',
    slug: safe.slug ?? '',
    date: safe.date ?? '',

    featuredImage: {
      node: {
        sourceUrl: safe.featuredImage?.node?.sourceUrl ?? null
      }
    },

    categories: {
      nodes: (safe.categories?.nodes || []).map((c: any) => ({
        databaseId: Number(c?.databaseId ?? 0),
        name: c?.name ?? '',
        slug: c?.slug ?? '',
        count: Number(c?.count ?? 0),
      }))
    }
  };
};

async function getCategoryDetails(slug: string): Promise<Category | null> {
  try {
    const data = await fetchGraphQL(GET_ALL_CATEGORIES);
    const nodes = data?.categories?.nodes;
    if (!Array.isArray(nodes)) return null;
    const category = nodes.find((c: any) => c?.slug === slug);
    if (!category) return null;

    return {
      databaseId: Number(category.databaseId ?? 0),
      name: category.name ?? '',
      slug: category.slug ?? '',
      count: Number(category.count ?? 0)
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getCategoryDetails] error', { slug, err });
    return null;
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const data = await fetchGraphQL(GET_ALL_CATEGORIES);
    const nodes = data?.categories?.nodes;
    if (!Array.isArray(nodes)) return [];

    return nodes.map((c: any): Category => ({
      databaseId: Number(c.databaseId ?? 0),
      name: c.name ?? '',
      slug: c.slug ?? '',
      count: Number(c.count ?? 0)
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getAllCategories] error', err);
    return [];
  }
}

export async function getCachedPostsPage(
  slug: string | null,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedPosts> {
  try {
    const isCategoryPage = !!slug;

    const query = isCategoryPage
      ? GET_POSTS_BY_CATEGORY_SIMPLE
      : GET_ALL_POSTS_SIMPLE;

    const variables = isCategoryPage
      ? { categoryName: slug, size: pageSize, offset: (page - 1) * pageSize }
      : { size: pageSize, offset: (page - 1) * pageSize };

    const data = await fetchGraphQL(query, variables);

    // fallback seguro si falla el fetch
    if (!data || !data.posts) {
      return {
        posts: [],
        totalPages: 1,
        total: 0,
        category: isCategoryPage ? await getCategoryDetails(slug!) : null
      };
    }

    const nodes = Array.isArray(data.posts.nodes) ? data.posts.nodes : [];

    // intentamos obtener total desde la API
    const totalFromApiRaw = data.posts.pageInfo?.offsetPagination?.total;
    const totalFromApi = Number.isFinite(Number(totalFromApiRaw)) ? Number(totalFromApiRaw) : NaN;

    let totalPosts: number;

    if (Number.isFinite(totalFromApi) && totalFromApi > 0) {
      // API nos dio un total válido
      totalPosts = totalFromApi;
    } else {
      // API no devolvió total. Inferimos:
      if (nodes.length < pageSize) {
        // si la página actual viene incompleta, asumimos que ese es el total
        totalPosts = (page - 1) * pageSize + nodes.length;
      } else {
        // página actual completa -> puede haber más. Probeamos algunas páginas siguientes.
        const MAX_PROBE_PAGES = 5; // <-- ajusta según tolerancia de build (5 es razonable)
        let probedTotal = (page - 1) * pageSize + nodes.length;
        let probePage = page + 1;

        while (probePage <= page + MAX_PROBE_PAGES) {
          const probeOffset = (probePage - 1) * pageSize;
          const probeVars = isCategoryPage
            ? { categoryName: slug, size: pageSize, offset: probeOffset }
            : { size: pageSize, offset: probeOffset };

          const probeData = await fetchGraphQL(query, probeVars);
          if (!probeData || !probeData.posts) break;

          const probeNodes = Array.isArray(probeData.posts.nodes) ? probeData.posts.nodes : [];
          probedTotal += probeNodes.length;

          // si encontramos una página incompleta, terminamos probeo
          if (probeNodes.length < pageSize) break;

          probePage += 1;
        }

        totalPosts = probedTotal;
      }
    }

    const totalPagesCalc = Math.max(1, Math.ceil(totalPosts / pageSize));
    const categoryInfo = isCategoryPage ? await getCategoryDetails(slug!) : null;

    return {
      posts: nodes.map(mapPostData),
      totalPages: totalPagesCalc,
      total: totalPosts,
      category: categoryInfo
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getCachedPostsPage] unexpected error', { slug, page, pageSize, err });
    return {
      posts: [],
      totalPages: 1,
      total: 0,
      category: null
    };
  }
}
