"use client";

import React, { useState } from "react";
import { getClient } from "../lib/cliente";
import { GET_POSTS_BY_CATEGORY, GET_ALL_POSTS } from "../lib/queries";
import Link from "next/link";

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor?: string;
  startCursor?: string;
};

type Post = {
  slug: string;
  title: string;
};

type Props = {
  categoriaSlug: string;
  initialPosts: Post[];
  initialPageInfo: PageInfo;
};

export default function CategoryPostsClient({
  categoriaSlug,
  initialPosts,
  initialPageInfo,
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const client = getClient();

  const fetchMore = async (direction: "next" | "prev") => {
    const query = categoriaSlug
      ? GET_POSTS_BY_CATEGORY
      : GET_ALL_POSTS;

    const variables =
      direction === "next"
        ? { slug: categoriaSlug, after: pageInfo.endCursor }
        : { slug: categoriaSlug, before: pageInfo.startCursor };

    const { data } = await client.query({
      query,
      variables,
      fetchPolicy: "network-only",
    });

    const edges = categoriaSlug
      ? data?.postsByCategory?.edges || []
      : data?.allPosts?.edges || [];

    const newPosts = edges.map((e: any) => ({
      slug: e.node.slug,
      title: e.node.title,
    }));

    const newPageInfo = categoriaSlug
      ? data?.postsByCategory?.pageInfo
      : data?.allPosts?.pageInfo;

    setPosts(newPosts);
    setPageInfo(newPageInfo);
  };

  return (
    <div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="border p-3 rounded">
            <Link href={`/Noticias/${post.slug}`}>
              <span className="font-semibold hover:underline">
                {post.title}
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={!pageInfo.hasPreviousPage}
          onClick={() => fetchMore("prev")}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          disabled={!pageInfo.hasNextPage}
          onClick={() => fetchMore("next")}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
