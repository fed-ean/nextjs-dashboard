
import { 
    GET_ALL_CATEGORIES,
    GET_POSTS_BY_CATEGORY_SIMPLE,
    GET_ALL_POSTS_SIMPLE
} from './queries';
import type { Post, Category, PagedPosts } from './definitions';

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

async function fetchGraphQL(query: any, variables: Record<string, any> = {}): Promise<any> {
    const response = await fetch(GQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 }, // Revalidar cada 60 segundos
        body: JSON.stringify({ 
            query: query.loc.source.body, 
            variables 
        }),
    });

    if (!response.ok) {
        console.error("Network response was not ok.", await response.text());
        return null;
    }

    const json = await response.json();
    if (json.errors) {
        console.error("GraphQL query failed:", json.errors);
        return null;
    }

    return json.data;
}

const mapPostData = (p: any): Post => ({
    databaseId: p.databaseId,
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    date: p.date,
    featuredImage: { node: { sourceUrl: p.featuredImage?.node?.sourceUrl || null } },
    categories: { nodes: (p.categories?.nodes || []).map((c: any) => ({ name: c.name, slug: c.slug })) },
});

async function getCategoryDetails(slug: string): Promise<Category | null> {
    const data = await fetchGraphQL(GET_ALL_CATEGORIES, {});
    const category = data?.categories?.nodes?.find((c: any) => c.slug === slug);
    return category ? { name: category.name, slug: category.slug, count: category.count } : null;
}

export async function getAllCategories(): Promise<Category[]> {
    const data = await fetchGraphQL(GET_ALL_CATEGORIES, {});
    if (!data || !data.categories) {
        return [];
    }
    return data.categories.nodes.map((c: any) => ({
        databaseId: c.databaseId,
        name: c.name,
        slug: c.slug,
        count: c.count
    }));
}

export async function getCachedPostsPage(slug: string | null, page: number = 1, pageSize: number = 10): Promise<PagedPosts> {
    const isCategoryPage = !!slug;
    
    const query = isCategoryPage ? GET_POSTS_BY_CATEGORY_SIMPLE : GET_ALL_POSTS_SIMPLE;
    const variables = isCategoryPage
        ? { categoryName: slug, size: pageSize, offset: (page - 1) * pageSize }
        : { size: pageSize, offset: (page - 1) * pageSize };

    const data = await fetchGraphQL(query, variables);

    if (!data || !data.posts) {
        return { posts: [], totalPages: 0, category: null, total: 0 };
    }

    const category = isCategoryPage ? await getCategoryDetails(slug) : null;
    const totalPosts = data.posts.pageInfo?.offsetPagination?.total ?? 0;
    const totalPages = Math.ceil(totalPosts / pageSize);
    
    return {
        posts: data.posts.nodes.map(mapPostData),
        totalPages: totalPages,
        total: totalPosts,
        category: category ? { name: category.name, slug: category.slug } : null
    };
}
