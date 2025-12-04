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
  pageSize: number = 10 // <-- default 9 to match PER_PAGE in pages
): Promise<PagedPosts> {
  try {
    const isCategoryPage = !!slug;
    const query = isCategoryPage ? GET_POSTS_BY_CATEGORY_SIMPLE : GET_ALL_POSTS_SIMPLE;
    const variables = isCategoryPage
      ? { categoryName: slug, size: pageSize, offset: (page - 1) * pageSize }
      : { size: pageSize, offset: (page - 1) * pageSize };

    // Primera petición: la página solicitada
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

    let nodes = Array.isArray(data.posts.nodes) ? data.posts.nodes : [];

    // Intentamos leer total desde la API
    const totalFromApi = Number(data.posts.pageInfo?.offsetPagination?.total ?? NaN);
    let totalPosts = Number.isFinite(totalFromApi) ? totalFromApi : NaN;

    // --- Caso frecuente: backend no respeta offset ---
    // Si pedimos página > 1 y recibimos la misma lista que la página 1,
    // entonces hacemos fallback: fetch grande y sliceamos.
    if (page > 1) {
      // pedimos la primera página para comparar (rápido)
      const varsPage1 = isCategoryPage
        ? { categoryName: slug, size: pageSize, offset: 0 }
        : { size: pageSize, offset: 0 };
      const dataPage1 = await fetchGraphQL(query, varsPage1);
      const nodesPage1 = Array.isArray(dataPage1?.posts?.nodes) ? dataPage1.posts.nodes : [];

      // Comparamos por identificador/slug de los primeros items (si existen)
      const firstIdCurrent = nodes[0]?.slug ?? nodes[0]?.databaseId ?? null;
      const firstIdPage1 = nodesPage1[0]?.slug ?? nodesPage1[0]?.databaseId ?? null;

      // Si parecen iguales (probable que offset no se aplicó), hacemos fetch grande y sliceamos
      if (firstIdCurrent && firstIdPage1 && String(firstIdCurrent) === String(firstIdPage1)) {
        // Fetch grande (N páginas) y slice
        const MAX_PAGES_FETCH = 10; // configurable: 10 * pageSize posts máximo (ej. 90)
        const maxFetchSize = Math.min(MAX_PAGES_FETCH * pageSize, 200); // tope absoluto 200
        const bigVars = isCategoryPage
          ? { categoryName: slug, size: maxFetchSize, offset: 0 }
          : { size: maxFetchSize, offset: 0 };

        const bigData = await fetchGraphQL(query, bigVars);
        const bigNodes = Array.isArray(bigData?.posts?.nodes) ? bigData.posts.nodes : [];

        // Usamos bigNodes para slicear la página correcta
        const sliceStart = (page - 1) * pageSize;
        const sliceEnd = sliceStart + pageSize;
        const sliced = bigNodes.slice(sliceStart, sliceEnd);

        // totalPosts lo calculamos a partir de bigNodes (si la API no entregó total)
        const inferredTotal = bigNodes.length;
        totalPosts = Number.isFinite(totalFromApi) ? totalFromApi : inferredTotal;

        return {
          posts: sliced.map(mapPostData),
          totalPages: Math.max(1, Math.ceil(totalPosts / pageSize)),
          total: Number.isFinite(totalPosts) ? totalPosts : inferredTotal,
          category: isCategoryPage ? await getCategoryDetails(slug!) : null,
        };
      }
    }

    // --- Si llegamos acá: comportamiento "normal" o probeo para total ---
    // Si la API no da total válido, usamos probeo (limitado) para estimarlo
    if (!Number.isFinite(totalPosts)) {
      if (nodes.length < pageSize) {
        // la página actual viene incompleta => asumimos no hay más
        totalPosts = (page - 1) * pageSize + nodes.length;
      } else {
        // nodes.length === pageSize -> puede haber más. Probeamos hasta MAX_PROBE_PAGES.
        const MAX_PROBE_PAGES = 5; // evita demasiadas llamadas en build
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
          if (probeNodes.length < pageSize) break;
          probePage += 1;
        }
        totalPosts = probed + (page - 1 - 1) * pageSize > 0 ? probed + (page - 1 - 1) * pageSize : probed;
        // (la fórmula anterior es conservadora; el objetivo es no subestimar mucho)
      }
    }

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
