// lib/wpRest.ts
import { getClient } from './cliente';
import {
  GET_ALL_CATEGORIES,
  GET_CATEGORY_POST_IDS, // <- Lo mantenemos para paginación > 1
  GET_ALL_POST_IDS,      // <- Lo mantenemos para paginación > 1
  GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
  GET_ALL_POSTS,
  GET_CATEGORY_DATA_COMBINED, // <- NUEVA
  GET_ALL_POST_DATA_COMBINED,   // <- NUEVA
} from './queries';

// ========= HELPERS =========
async function withRetries<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 300): Promise<T> {
    let lastErr: any;
    for (let i = 0; i < attempts; i++) {
        try { return await fn(); }
        catch (e) { lastErr = e; await new Promise(r => setTimeout(r, baseDelayMs * (i + 1))); }
    }
    throw lastErr;
}

const mapPostData = (p: any) => ({
    databaseId: p.databaseId,
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    date: p.date,
    featuredImage: { node: { sourceUrl: p?.featuredImage?.node?.sourceUrl || null } },
    categories: { nodes: (p.categories?.nodes || []).map((c:any)=>({ name: c.name, slug: c.slug })) },
    tags: { nodes: (p.tags?.nodes || []).map((t:any)=>({ name: t.name, slug: t.slug })) },
});


// ========= CATEGORIAS =========

export async function getCategoryBySlugWithFallback(slug: string) {
    const client = getClient();
    const { data } = await withRetries(() => client.query({ query: GET_ALL_CATEGORIES, fetchPolicy: 'network-only' }));
    const found = (data?.categories?.nodes ?? []).find((c: any) => String(c.slug) === String(slug));
    return found ? { id: found.databaseId, name: found.name, slug: found.slug } : null;
}

// FUNCIÓN PRINCIPAL OPTIMIZADA
export async function getPostsByCategoryPageWithFallback(
  categoryIdentifier: { slug: string }, 
  page = 1, 
  perPage = 9
) {
    const { slug } = categoryIdentifier;
    const client = getClient();

    // -- OPTIMIZACIÓN para la PRIMERA PÁGINA --
    if (page === 1) {
        const { data } = await withRetries(() => client.query({
            query: GET_CATEGORY_DATA_COMBINED,
            variables: { slugs: [slug], first: perPage, after: null },
            fetchPolicy: 'network-only',
        }));

        const categoryData = data?.categories?.nodes?.[0];
        if (!categoryData) return { posts: [], total: 0, totalPages: 0 };

        const posts = categoryData.paginatedPosts.nodes.map(mapPostData);
        const total = categoryData.allPosts.nodes.length;
        const totalPages = Math.ceil(total / perPage);
        
        return { posts, total, totalPages };
    }

    // -- LÓGICA ANTERIOR para páginas > 1 (ya es eficiente con cursores) --
    const { data: countData } = await withRetries(() => client.query({
        query: GET_CATEGORY_POST_IDS,
        variables: { slugs: [slug] },
    }));
    const total = countData?.categories?.nodes?.[0]?.posts?.nodes?.length ?? 0;
    const totalPages = Math.ceil(total / perPage);

    const offset = (page - 1) * perPage;
    const { data: cursorData } = await withRetries(() => client.query({
        query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
        variables: { slugs: [slug], first: offset, after: null },
    }));
    const afterCursor = cursorData?.categories?.nodes?.[0]?.posts?.pageInfo?.endCursor;

    const { data: pageData } = await withRetries(() => client.query({
        query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
        variables: { slugs: [slug], first: perPage, after: afterCursor },
    }));

    const posts = pageData?.categories?.nodes?.[0]?.posts?.nodes.map(mapPostData) ?? [];
    
    return { posts, total, totalPages };
}

// ========= INTERÉS GENERAL (TODOS LOS POSTS) =========

export async function getAllPostsPaginated(page = 1, perPage = 9) {
    const client = getClient();

    // -- OPTIMIZACIÓN para la PRIMERA PÁGINA --
    if (page === 1) {
        const { data } = await withRetries(() => client.query({
            query: GET_ALL_POST_DATA_COMBINED,
            variables: { first: perPage, after: null },
            fetchPolicy: 'network-only',
        }));
        if(!data) return { posts: [], total: 0, totalPages: 0 };
        
        const posts = data.paginatedPosts.nodes.map(mapPostData);
        const total = data.allPosts.nodes.length;
        const totalPages = Math.ceil(total / perPage);
        return { posts, total, totalPages };
    }

    // -- LÓGICA ANTERIOR para páginas > 1 (ya es eficiente con cursores) --
    const { data: countData } = await withRetries(() => client.query({ query: GET_ALL_POST_IDS }));
    const total = countData?.posts?.nodes?.length ?? 0;
    const totalPages = Math.ceil(total / perPage);

    const offset = (page - 1) * perPage;
    const { data: cursorData } = await withRetries(() => client.query({
        query: GET_ALL_POSTS,
        variables: { first: offset, after: null },
    }));
    const afterCursor = cursorData?.posts?.pageInfo?.endCursor;

    const { data: pageData } = await withRetries(() => client.query({
        query: GET_ALL_POSTS,
        variables: { first: perPage, after: afterCursor },
    }));

    const posts = pageData?.posts?.nodes.map(mapPostData) ?? [];
    return { posts, total, totalPages };
}


// ========= FUNCIÓN WRAPPER (la que usa la página) =========

export async function getCachedPostsPage(slug: string, page = 1, perPage = 9) {
    const category = await getCategoryBySlugWithFallback(slug);
    if (!category) return { posts: [], total: 0, totalPages: 0, source: 'none' };
    const data = await getPostsByCategoryPageWithFallback({ slug: category.slug }, page, perPage);
    return { ...data, source: 'graphql', category };
}
