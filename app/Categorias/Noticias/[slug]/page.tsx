import React from "react";
import type { AsyncParams } from "@/types/next-async";

type Props = {
  params: AsyncParams<{ slug: string }>;
};

async function getPostData(slug: string) {
  try {
    const res = await fetch(
      `https://radioempresarial.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return { post: null, error: `HTTP error: ${res.status}` };
    }

    const data = await res.json();
    return { post: data?.[0] ?? null, error: null };
  } catch (err: any) {
    return { post: null, error: err.message };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { post, error } = await getPostData(slug);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  if (!post) {
    return <div className="p-4">Post no encontrado</div>;
  }

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">
        {post.title?.rendered}
      </h1>
      <article
        className="prose"
        dangerouslySetInnerHTML={{
          __html: post.content?.rendered ?? "",
        }}
      />
    </main>
  );
}
