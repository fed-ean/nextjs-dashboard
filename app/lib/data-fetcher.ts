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
  pageSize: number = 9 // <-- default 9 to match PER_PAGE in pages
): Promise<PagedPosts> {
  try {
    const isCategoryPage = !!slug;

    const query = isCategoryPage ? GET_POSTS_BY_CATEGORY_SIMPLE : GET_ALL_POSTS_SIMPLE;

    const variables = isCategoryPage
      ? { categoryName: slug, size: pageSize, offset: (page - 1) * pageSize }
      : { size: pageSize, offset: (page - 1) * pageSize };

    const data = await fetchGraphQL(query, variables);

    // fallback si no hay data
    if (!data || !data.posts) {
      return {
        posts: [],
        totalPages: 1,
        total: 0,
        category: isCategoryPage ? await getCategoryDetails(slug!) : null,
      };
    }

    const nodes = Array.isArray(data.posts.nodes) ? data.posts.nodes : [];

    // Intentamos leer total desde la API
    const totalFromApi = Number(data.posts.pageInfo?.offsetPagination?.total ?? NaN);
    let totalPosts = Number.isFinite(totalFromApi) ? totalFromApi : NaN;

    // Si la API no da total válido, hacemos probeo (solo si la página actual está completa)
    if (!Number.isFinite(totalPosts)) {
      if (nodes.length < pageSize) {
        // la primera (o la solicitada) viene incompleta => asumimos no hay más
        totalPosts = nodes.length;
      } else {
        // probable que haya más: probeamos páginas siguientes hasta tope
        const MAX_PROBE_PAGES = 5; // ajustable (evita llamar muchas veces en build)
        let probed = nodes.length;
        let probePage = 2;
        while (probePage <= MAX_PROBE_PAGES) {
          const probeOffset = (probePage - 1) * pageSize;
          const probeVars = isCategoryPage
            ? { categoryName: slug, size: pageSize, offset: probeOffset }
            : { size: pageSize, offset: probeOffset };

          const probeData = await fetchGraphQL(query, probeVars);
          if (!probeData || !probeData.posts) break;

          const probeNodes = Array.isArray(probeData.posts.nodes) ? probeData.posts.nodes : [];
          probed += probeNodes.length;

          // si la página probeada no viene completa, terminamos
          if (probeNodes.length < pageSize) break;

          // si probeNodes.length == pageSize, puede haber más — seguimos
          probePage += 1;
        }
        totalPosts = probed;
      }
    }

    // Calculamos totalPages de forma segura
    const totalPagesCalc = Number.isFinite(totalPosts) ? Math.max(1, Math.ceil(totalPosts / pageSize)) : 1;
    const categoryInfo = isCategoryPage ? await getCategoryDetails(slug!) : null;

    return {
      posts: nodes.map(mapPostData),
      totalPages: totalPagesCalc,
      total: Number.isFinite(totalPosts) ? totalPosts : 0,
      category: categoryInfo,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getCachedPostsPage] unexpected error', { slug, page, pageSize, err });
    return {
      posts: [],
      totalPages: 1,
      total: 0,
      category: null,
    };
  }
}
