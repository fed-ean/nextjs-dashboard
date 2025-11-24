// app/Categorias/Noticias/[slug]/page.tsx
import React from "react";
import type { AsyncParams } from "@/types/next-async";
import { gql } from '@apollo/client';
import { getServerSideClient } from '../../../lib/server-cliente';

// --- TIPOS ---
type Post = {
  title?: string;
  content?: string;
};

type QueryResult = {
  post: Post | null;
};

// --- CONSULTA GRAPHQL ---
const GET_POST_BY_SLUG_QUERY = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      title
      content
    }
  }
`;

// --- FUNCIÓN DE OBTENCIÓN DE DATOS ---
async function getPostData(slug: string): Promise<{ post: Post | null; error: string | null }> {
  try {
    const client = getServerSideClient();
    const { data, error, errors } = await client.query<QueryResult>({
      query: GET_POST_BY_SLUG_QUERY,
      variables: { id: slug },
    });

    if (error) {
      console.error('Apollo Client Error:', error);
      return { post: null, error: `GraphQL Error: ${error.message}` };
    }

    if (errors && errors.length > 0) {
        console.error('GraphQL Query Errors:', errors);
        return { post: null, error: `GraphQL Query Error: ${errors.map(e => e.message).join(', ')}` };
    }

    if (!data || !data.post) {
      return { post: null, error: "Post no encontrado." };
    }

    return { post: data.post, error: null };

  } catch (err: any) {
    console.error('Error fetching post data:', err);
    return { post: null, error: err.message || "Error desconocido al intentar obtener el post." };
  }
}

// --- COMPONENTE DE PÁGINA ---
export default async function Page({ params }: { params: AsyncParams<{ slug: string }> }) {
  const { slug } = await params;
  const { post, error } = await getPostData(slug);

  if (error) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Error al cargar el post</h2>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold">Post no encontrado</h2>
      </div>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: post.title || '' }} />
      <article
        className="prose lg:prose-xl max-w-full"
        dangerouslySetInnerHTML={{
          __html: post.content || "Contenido no disponible.",
        }}
      />
    </main>
  );
}
