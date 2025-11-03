// lib/cacheProxy.ts
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { getPostsByCategoryPageWithFallback, getCategoryBySlugWithFallback } from './wpRest';

const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'category_posts');
const DEFAULT_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 60); // ajustar si hace falta

async function ensureCacheDir() {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function cacheFilename(slug: string, page: number, perPage: number) {
  const safeSlug = String(slug).replace(/[^a-z0-9-_]/gi, '_');
  return path.join(CACHE_DIR, `${safeSlug}.p${page}.pp${perPage}.json`);
}

/**
 * Intenta leer del cache; si está caducado o no existe, llama a fetcherFn y guarda el resultado.
 * fetcherFn debe devolver JSON-serializable.
 */
export async function cachedFetchPage<T>(
  slug: string,
  page: number,
  perPage: number,
  fetcherFn: (slugOrId: any, page: number, perPage: number) => Promise<T>,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<T> {
  await ensureCacheDir();
  const fname = cacheFilename(slug, page, perPage);

  // Try read cache
  try {
    const st = await stat(fname);
    const ageSeconds = (Date.now() - st.mtimeMs) / 1000;
    if (ageSeconds <= ttlSeconds) {
      const raw = await readFile(fname, 'utf8');
      const json = JSON.parse(raw);
      return json as T;
    }
  } catch (e) {
    // file doesn't exist or other - continue to fetch
  }

  // If no valid cache -> fetch and write
  const result = await fetcherFn({ slug }, page, perPage);
  try {
    await writeFile(fname, JSON.stringify(result), 'utf8');
  } catch (e) {
    console.warn('No se pudo escribir cache en disco:', e);
  }
  return result;
}

/**
 * Helper de alto nivel que combina: resolver categoría (id/slug) + cachedFetchPage con el fetcher 'getPostsByCategoryPageWithFallback'
 */
export async function getCachedPostsPage(slug: string, page = 1, perPage = 9, ttlSeconds = DEFAULT_TTL_SECONDS) {
  // primero resolvemos categoria (podemos necesitar id para REST)
  const category = await getCategoryBySlugWithFallback(slug);
  if (!category) {
    return { posts: [], total: 0, totalPages: 0, source: 'none' };
  }

  // fetcher wrapper que llama al getPostsByCategoryPageWithFallback
  const fetcher = async (_slugOrId: any, p: number, pp: number) => {
    // getPostsByCategoryPageWithFallback acepta {id,slug}
    const res = await getPostsByCategoryPageWithFallback({ id: category.id, slug: category.slug }, p, pp);
    return res;
  };

  const data = await cachedFetchPage(slug, page, perPage, fetcher, ttlSeconds);
  // añadimos info de categoria por si la necesita la UI
  return { ...data, category };
}
