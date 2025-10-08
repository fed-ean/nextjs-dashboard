// app/noticias/page.tsx
import { getClient } from "../lib/cliente";
import { gql } from "@apollo/client";
import Link from "next/link";

async function loadData() {
  const { data } = await getClient().query({
    query: gql`
      query GetLatestPosts {
        posts(first: 20, where: { status: PUBLISH }) {
          nodes {
            id
            title
            slug
            excerpt
          }
        }
      }
    `,
  });

  return data.posts.nodes;
}

export default async function NoticiasPage() {
  const posts = await loadData();

  return (
    <div className="m-9">
      <h1>Noticias</h1>
      {posts.map((post: any) => (
        <div key={post.id} className="border p-4 my-4">
          <h2 dangerouslySetInnerHTML={{ __html: post.title }} />
          <div
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
          <Link href={`/Categorias/${post.slug}`}>
            <button className="bg-blue-500 text-white px-4 py-2 mt-2">
              Leer más
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}