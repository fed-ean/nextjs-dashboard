// app/lib/data-fetcher.ts
import { 
    GET_ALL_CATEGORIES,
    GET_POSTS_BY_CATEGORY_SIMPLE,
    GET_ALL_POSTS_SIMPLE
} from './queries';

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

async function fetchGraphQL(query: any, variables: Record<string, any> = {}) {
    const response = await fetch(GQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 }, // Cache por 1 minuto mientras depuramos
        body: JSON.stringify({ 
            query: query.loc.source.body, 
            variables 
        }),
    });

    if (!response.ok) {
        console.error("Network response was not ok.", await response.text());
        return null; // Devolver null para evitar que la app crashee
    }

    const json = await response.json();
    if (json.errors) {
        console.error("GraphQL query failed:", json.errors);
        return null;
    }

    return json.data;
}

const mapPostData = (p: any) => p ? ({
    databaseId: p.databaseId,
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    date: p.date,
    featuredImage: { node: { sourceUrl: p.featuredImage?.node?.sourceUrl || null } },
    categories: { nodes: (p.categories?.nodes || []).map((c:any) => ({ name: c.name, slug: c.slug })) },
}) : null;

async function getCategoryDetails(slug: string) {
    const data = await fetchGraphQL(GET_ALL_CATEGORIES, {});
    return data?.categories?.nodes?.find((c: any) => c.slug === slug) || null;
}

// FUNCIÓN REESTRUCTURADA Y SIMPLIFICADA
export async function getCachedPostsPage(slug: string | null) {
    const isCategoryPage = !!slug;
    
    const query = isCategoryPage ? GET_POSTS_BY_CATEGORY_SIMPLE : GET_ALL_POSTS_SIMPLE;
    const variables = isCategoryPage ? { categoryName: slug } : {};

    const data = await fetchGraphQL(query, variables);

    if (!data || !data.posts) {
        return { posts: [], totalPages: 0, category: null, total: 0 };
    }

    const category = isCategoryPage ? await getCategoryDetails(slug) : null;
    
    return {
        posts: data.posts.nodes.map(mapPostData),
        totalPages: 1, // Paginación deshabilitada temporalmente
        total: data.posts.nodes.length,
        category: category ? { name: category.name, slug: category.slug } : null
    };
}
