// lib/helpers/fetchCategoryPostsFlexible.ts
import {
  GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
  GET_CATEGORY_POSTS_BY_SLUG,
  GET_CATEGORY_POSTS_BY_SLUGIN,
} from '../lib/queries'; // ajustar si tu alias es distinto

/**
 * Intenta 3 variantes para obtener posts de una categoría por slug:
 *  - slug_array (where: { slug: [..] })
 *  - slug (where: { slug: "..." })
 *  - slugIn (where: { slugIn: [...] })
 *
 * Devuelve { node, used, errors }.
 */
export async function fetchCategoryPostsFlexible(client: any, slug: string, first = 10) {
  const errors: any[] = [];

  // 1) slug array
  try {
    const resp = await client.query({
      query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
      variables: { slugs: [slug], first, after: null },
      fetchPolicy: 'network-only',
    });
    const node = resp?.data?.categories?.nodes?.[0] ?? null;
    if (node) return { node, used: 'slug_array' };
  } catch (err: any) {
    errors.push({ method: 'slug_array', message: err?.message || err, error: err });
  }

  // 2) slug simple
  try {
    const resp = await client.query({
      query: GET_CATEGORY_POSTS_BY_SLUG,
      variables: { slug, first, after: null },
      fetchPolicy: 'network-only',
    });
    const node = resp?.data?.categories?.nodes?.[0] ?? null;
    if (node) return { node, used: 'slug' };
  } catch (err: any) {
    errors.push({ method: 'slug', message: err?.message || err, error: err });
  }

  // 3) slugIn (compatibilidad)
  try {
    const resp = await client.query({
      query: GET_CATEGORY_POSTS_BY_SLUGIN,
      variables: { slugIn: [slug], first, after: null },
      fetchPolicy: 'network-only',
    });
    const node = resp?.data?.categories?.nodes?.[0] ?? null;
    if (node) return { node, used: 'slugIn' };
  } catch (err: any) {
    errors.push({ method: 'slugIn', message: err?.message || err, error: err });
  }

  return { node: null, used: null, errors };
}
