
import { NextResponse } from 'next/server';

const GQL_ENDPOINT = "/graphql";

// Las consultas GQL como cadenas de texto sin formato
const QUERY_POSTS_BY_CATEGORY = `
  query GetCategoryPosts($slug: String!, $first: Int!, $after: String, $tagSlugs: [String!]) {
    categories(where: { slug: $slug }) {
      nodes {
        posts(first: $first, after: $after, where: { tagSlugIn: $tagSlugs }) {
          nodes {
            databaseId
            title
            excerpt
            date
            slug
            featuredImage { node { sourceUrl } }
            tags { nodes { name slug } }
            categories { nodes { name slug } }
          }
          pageInfo { endCursor hasNextPage }
          totalCount
        }
      }
    }
  }
`;

const QUERY_POSTS_BY_TAGS = `
  query PostsByTagSlugs($tagSlugs: [String!]!, $first: Int!, $after: String) {
    posts(where: { tagSlugIn: $tagSlugs }, first: $first, after: $after) {
      nodes {
        databaseId
        title
        excerpt
        date
        slug
        featuredImage { node { sourceUrl } }
        tags { nodes { name slug } }
        categories { nodes { name slug } }
      }
      pageInfo { endCursor hasNextPage }
      totalCount
    }
  }
`;

// Función auxiliar para realizar la petición fetch a la API de GraphQL
async function fetchGraphQL(query: string, variables: Record<string, any>) {
    const response = await fetch(GQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`La petición GraphQL a ${GQL_ENDPOINT} falló con estado ${response.status}:`, errorBody);
        throw new Error(`La petición a la API externa falló: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
        console.error('La consulta GraphQL devolvió errores:', result.errors);
        throw new Error('La consulta GraphQL falló. Revisa los logs del servidor para más detalles.');
    }
    
    return result.data;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, tagSlugs, after = null, first = 10, mode = "byCategory" } = body;

    if (mode === "byCategory") {
        if (!slug) {
            return NextResponse.json({ ok: false, error: "Falta el slug de la categoría" }, { status: 400 });
        }
        
        const data = await fetchGraphQL(QUERY_POSTS_BY_CATEGORY, {
            slug,
            first,
            after,
            tagSlugs: tagSlugs && tagSlugs.length ? tagSlugs : null
        });
        
        const posts = data?.categories?.nodes?.[0]?.posts?.nodes || [];
        const pageInfo = data?.categories?.nodes?.[0]?.posts?.pageInfo || { endCursor: null, hasNextPage: false };
        const totalCount = data?.categories?.nodes?.[0]?.posts?.totalCount || 0;

        return NextResponse.json({ ok: true, posts, pageInfo, totalCount });

    } else if (mode === "byTags") {
        if (!tagSlugs || !Array.isArray(tagSlugs) || tagSlugs.length === 0) {
            return NextResponse.json({ ok: true, posts: [], pageInfo: { endCursor: null, hasNextPage: false }, totalCount: 0 });
        }
        
        const data = await fetchGraphQL(QUERY_POSTS_BY_TAGS, {
            tagSlugs,
            first,
            after
        });

        const posts = data?.posts?.nodes || [];
        const pageInfo = data?.posts?.pageInfo || { endCursor: null, hasNextPage: false };
        const totalCount = data?.posts?.totalCount || 0;
        
        return NextResponse.json({ ok: true, posts, pageInfo, totalCount });
    }

    return NextResponse.json({ ok: false, error: "Modo no soportado" }, { status: 400 });

  } catch (err: any) {
    console.error("Error en API /api/category-posts:", err.message);
    return NextResponse.json({ ok: false, error: "No se pudieron obtener los posts.", details: err.message }, { status: 502 });
  }
}
