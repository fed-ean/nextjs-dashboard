// app/noticias/page.tsx
import { getClient } from "../lib/cliente";
import { gql } from "@apollo/client";
import NoticiasVarias from '../ui/Page_Index/noticias-varias';
import { obtenerNoticias } from '../lib/db';
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
  const noticiasRaw = await obtenerNoticias({ limit: 21 });
    const demasNoticias = noticiasRaw.slice(3);
  const posts = await loadData();

  return (
    <>
        <h1 className="mb-5">Noticias</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 px-4">
            {demasNoticias.map(noticia => (
              <NoticiasVarias key={noticia.id} noticia={noticia} />
            ))}
          </div>
      </>
  );
}
