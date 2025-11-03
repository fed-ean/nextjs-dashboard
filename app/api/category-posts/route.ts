// app/api/category-posts/route.ts
import { NextResponse } from "next/server";
import { getClient } from "../../lib/cliente"; // AJUSTA según tu estructura
import { gql } from "@apollo/client";

const QUERY_POSTS_BY_CATEGORY = gql`
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

// Para casos donde queremos pedir posts solo por tags (ej: interes-general special handling)
const QUERY_POSTS_BY_TAGS = gql`
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, tagSlugs, after = null, first = 10, mode = "byCategory" } = body;

    const client = getClient();

    if (!slug && mode === "byCategory") {
      return NextResponse.json({ ok: false, error: "Missing category slug" }, { status: 400 });
    }

    if (mode === "byCategory") {
      const res = await client.query({
        query: QUERY_POSTS_BY_CATEGORY,
        variables: { slug, first, after, tagSlugs: tagSlugs && tagSlugs.length ? tagSlugs : null },
        fetchPolicy: "network-only",
      });

      const posts = res.data?.categories?.nodes?.[0]?.posts?.nodes || [];
      const pageInfo = res.data?.categories?.nodes?.[0]?.posts?.pageInfo || { endCursor: null, hasNextPage: false };
      const totalCount = res.data?.categories?.nodes?.[0]?.posts?.totalCount || 0;

      return NextResponse.json({ ok: true, posts, pageInfo, totalCount });
    } else if (mode === "byTags") {
      if (!tagSlugs || !Array.isArray(tagSlugs) || tagSlugs.length === 0) {
        return NextResponse.json({ ok: true, posts: [], pageInfo: { endCursor: null, hasNextPage: false }, totalCount: 0 });
      }
      const res = await client.query({
        query: QUERY_POSTS_BY_TAGS,
        variables: { tagSlugs, first, after },
        fetchPolicy: "network-only",
      });

      const posts = res.data?.posts?.nodes || [];
      const pageInfo = res.data?.posts?.pageInfo || { endCursor: null, hasNextPage: false };
      const totalCount = res.data?.posts?.totalCount || 0;

      return NextResponse.json({ ok: true, posts, pageInfo, totalCount });
    }

    return NextResponse.json({ ok: false, error: "Unsupported mode" }, { status: 400 });
  } catch (err) {
    console.error("API category-posts error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
