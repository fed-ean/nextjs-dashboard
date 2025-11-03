// lib/wpRest.ts
import { getClient } from './cliente';
import {
  GET_ALL_CATEGORIES,
  GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
  GET_CATEGORY_POSTS_BY_SLUG,
  GET_CATEGORY_POSTS_BY_SLUGIN,
} from './queries';

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://radioempresaria.com.ar';

/** Simple retry wrapper */
async function withRetries<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 300): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, baseDelayMs * (i + 1))); }
  }
  throw lastErr;
}

/** safeFetch que lanza si status != ok */
async function safeFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err: any = new Error(`HTTP ${res.status} ${res.statusText} - ${url}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res;
}

/** Obtener categoría por slug — REST primero, fallback GraphQL */
export async function getCategoryBySlugWithFallback(slug: string) {
  const restUrl = `${SITE_ORIGIN.replace(/\/$/, '')}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`;

  try {
    const res = await withRetries(() => safeFetch(restUrl), 2, 200);
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length > 0) {
      return { id: arr[0].id, name: arr[0].name, slug: arr[0].slug };
    }
    return null;
  } catch (restErr: any) {
    const body = String(restErr?.body || '').toLowerCase();
    if (restErr?.status === 401 || restErr?.status === 403 || body.includes('unauthorized') || body.includes('not allowed')) {
      try {
        const client = getClient();
        const { data } = await withRetries(() => client.query({ query: GET_ALL_CATEGORIES, fetchPolicy: 'network-only' }), 2, 300);
        const cats = data?.categories?.nodes ?? [];
        const found = cats.find((c: any) => String(c.slug) === String(slug));
        if (found) return { id: found.databaseId, name: found.name, slug: found.slug };
        return null;
      } catch (gqErr) {
        console.warn('Fallback GraphQL fallo en getCategoryBySlugWithFallback:', gqErr);
        throw restErr;
      }
    }
    throw restErr;
  }
}

/**
 * Obtiene posts por página usando REST si es posible (devuelve total y totalPages),
 * si REST falla por 401/403 hace fallback a GraphQL con single-query+slice.
 *
 * Devuelve { posts, total, totalPages }
 */
export async function getPostsByCategoryPageWithFallback(categoryIdentifier: { id?: number; slug?: string }, page = 1, perPage = 9) {
  // 1) Intentar REST si existe id
  if (categoryIdentifier?.id) {
    const restUrl = `${SITE_ORIGIN.replace(/\/$/, '')}/wp-json/wp/v2/posts?categories=${categoryIdentifier.id}&per_page=${perPage}&page=${page}&_embed`;
    try {
      const res = await withRetries(() => safeFetch(restUrl), 2, 200);
      const posts = await res.json();
      const total = parseInt(res.headers.get('x-wp-total') || '0', 10);
      const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '0', 10);

      const mapped = (posts || []).map((p: any) => {
        const featured = p._embedded?.['wp:featuredmedia']?.[0];
        const imageUrl = featured?.source_url || null;
        const terms = p._embedded?.['wp:term'] || [];
        const categoriesNodes = (terms.find((t:any)=>Array.isArray(t) && t.some((x:any)=>x.taxonomy==='category')) || []).map((c:any)=>({ name: c.name, slug: c.slug })) || [];
        const tagsNodes = (terms.find((t:any)=>Array.isArray(t) && t.some((x:any)=>x.taxonomy==='post_tag')) || []).map((t:any)=>({ name: t.name, slug: t.slug })) || [];

        return {
          databaseId: p.id,
          title: p.title?.rendered || '',
          excerpt: p.excerpt?.rendered || '',
          slug: p.slug,
          date: p.date,
          featuredImage: { node: { sourceUrl: imageUrl } },
          categories: { nodes: categoriesNodes },
          tags: { nodes: tagsNodes },
          raw: p,
        };
      });

      return { posts: mapped, total, totalPages };
    } catch (restErr: any) {
      const body = String(restErr?.body || '').toLowerCase();
      if (restErr?.status === 401 || restErr?.status === 403 || body.includes('unauthorized') || body.includes('not allowed')) {
        console.warn('REST posts returned 401/403, usando fallback GraphQL');
        // seguir al fallback
      } else {
        throw restErr;
      }
    }
  }

  // 2) FALLBACK GRAPHQL (single query + slice)
  let slug = categoryIdentifier?.slug;
  if (!slug && categoryIdentifier?.id) {
    try {
      const client = getClient();
      const { data } = await withRetries(() => client.query({ query: GET_ALL_CATEGORIES, fetchPolicy: 'network-only' }), 2, 300);
      const cats = data?.categories?.nodes ?? [];
      const found = cats.find((c: any) => String(c.databaseId) === String(categoryIdentifier.id));
      if (found) slug = found.slug;
    } catch (e) {
      throw new Error('No se pudo resolver slug para fallback GraphQL');
    }
  }

  if (!slug) throw new Error('No hay slug para fallback GraphQL');

  const client = getClient();
  const MAX_FIRST = Number(process.env.WPGRAPHQL_MAX_FIRST || '200'); // ajustable por env
  const desiredCount = perPage * page;
  const firstToRequest = Math.min(desiredCount, MAX_FIRST);

  try {
    const { data } = await withRetries(() => client.query({
      query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
      variables: { slugs: [slug], first: firstToRequest, after: null },
      fetchPolicy: 'network-only',
    }), 2, 300);

    const node = data?.categories?.nodes?.[0];
    const nodes = node?.posts?.nodes ?? [];

    if (nodes.length < (page - 1) * perPage) {
      return { posts: [], total: nodes.length, totalPages: 0 };
    }

    const startIndex = (page - 1) * perPage;
    const pageNodes = nodes.slice(startIndex, startIndex + perPage);

    const mapped = (pageNodes || []).map((p: any) => {
      const imageUrl = p?.featuredImage?.node?.sourceUrl || null;
      const categoriesNodes = (p.categories?.nodes || []).map((c:any)=>({ name: c.name, slug: c.slug }));
      const tagsNodes = (p.tags?.nodes || []).map((t:any)=>({ name: t.name, slug: t.slug }));
      return {
        databaseId: p.databaseId,
        title: p.title,
        excerpt: p.excerpt,
        slug: p.slug,
        date: p.date,
        featuredImage: { node: { sourceUrl: imageUrl } },
        categories: { nodes: categoriesNodes },
        tags: { nodes: tagsNodes },
      };
    });

    return { posts: mapped, total: nodes.length, totalPages: 0 };
  } catch (gqErr) {
    console.error('Error fallback GraphQL (single query) getPostsByCategoryPageWithFallback:', gqErr);
    throw gqErr;
  }
}

/**
 * Wrapper usado por /api/warm-cache.
 * Resuelve categoría y obtiene posts de la página solicitada.
 * Devuelve { posts, total, totalPages, source, category }.
 */
export async function getCachedPostsPage(slug: string, page = 1, perPage = 9) {
  // primero resolvemos category (podemos necesitar id para REST)
  const category = await getCategoryBySlugWithFallback(slug);
  if (!category) return { posts: [], total: 0, totalPages: 0, source: 'none' };

  // Llamamos al fetcher con id si lo tenemos (esto permite intentar REST)
  const data = await getPostsByCategoryPageWithFallback({ id: category.id, slug: category.slug }, page, perPage);

  // data ya viene mapeado; añadir source: si vino por REST detectalo por presence de totalPages>0 o por category id? 
  // Aquí inferimos: si totalPages>0 -> rest, else graphql
  const source = (typeof data.totalPages === 'number' && data.totalPages > 0) ? 'rest' : 'graphql';

  return { ...data, source, category };
}
