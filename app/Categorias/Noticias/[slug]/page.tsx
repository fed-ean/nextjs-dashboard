import React from "react";

type Props = { params: { slug: string; page: string } };

async function getPostData(slug: string) {
  try {
    const res = await fetch(`https://radioempresarial.com/wp-json/wp/v2/posts?slug=${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { post: null, error: `HTTP error: ${res.status}` };
    }

    const json = await res.json();

    if (!json || json.length === 0) {
      return { post: null, error: "Post no encontrado" };
    }

    return { post: json[0], error: null };
  } catch (err: any) {
    return { post: null, error: err.message || "Error desconocido" };
  }
}

export default async function Page({ params }: Props) {
  const { slug, page } = (await params) as { slug: string; page: string };

  const { post, error } = await getPostData(slug);

  if (error) {
    return (
      <div className="p-4">
        <h2>Error al cargar el post</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4">
        <h2>Post no encontrado</h2>
      </div>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title?.rendered}</h1>
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
      />
    </main>
  );
}
