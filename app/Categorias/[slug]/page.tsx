// app/noticias/[slug]/page.tsx
import { getClient } from "../../lib/cliente";
import { gql } from "@apollo/client";

interface Params {
  params: { slug: string };
}

async function loadPost(slug: string) {
  const { data } = await getClient().query({
    query: gql`
      query GetPostBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          id
          title
          content
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    `,
    variables: { slug },
  });

  return data.post;
}

export default async function NoticiaPage({ params }: Params) {
  const post = await loadPost(params.id);

  if (!post) {
    return <p>No se encontró la noticia</p>; 
  }

  return (
    <div>
      {/* HERO SECTION */}
      <div
        className="relative h-[400px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${post.featuredImage?.node?.sourceUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div> {/* overlay oscuro */}
        <div className="relative z-10 max-w-3xl">
          <span className="bg-blue-600 px-3 py-1 text-sm uppercase tracking-widest rounded">
            SECCIONES
          </span>
          <h1
            className="text-4xl font-bold mt-4"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <p className="mt-2 text-gray-300">
            Publicado el {new Date(post.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-6 max-w-4xl mx-auto prose">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}