// app/Categorias/Noticias/[slug]/page.tsx
import React from "react";
import { gql } from "@apollo/client";
import { getClient } from "../../../lib/cliente";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import "../../../fonts.css"
import "../../../ui/Page_Index/style-noticias.css";

type PageProps = { params: Promise<{ slug: string }> };

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          databaseId
          name
          slug
        }
      }
    }
  }
`;

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) return <div className="m-9">Slug inválido</div>;

  const client = getClient();
  let data;
  try {
    const res = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
      fetchPolicy: "network-only",
    });
    data = res.data;
  } catch (err) {
    console.error("Error loading post:", err);
    return <div className="m-9">Error al cargar la noticia</div>;
  }

  const post = data?.post;
  if (!post) {
    return <div className="m-9">No se encontró la noticia</div>;
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl || null;

  // Opciones para html-react-parser: aquí interceptamos etiquetas y les aplicamos clases/ajustes
  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      // Solo nos interesan nodos tipo etiqueta (tag)
      if (!domNode || domNode.type !== "tag") return;

      const name = domNode.name?.toLowerCase?.();

      // Párrafos: añadir margin y line-height
      if (name === "p") {
        return (
          <p className="leading-relaxed text-gray-800">
            {domToReact(domNode.children, parseOptions)}
          </p>
        );
      }

      // <br> — convertir en salto visible (puedes ajustar el margin)
      if (name === "br") {
        return <br className="my-4" />;
      }

      // Imágenes dentro del contenido: darles responsive behavior y border-radius
      if (name === "img") {
        const attribs = domNode.attribs || {};
        // Si la imagen viene con src relativo o sin protocolo, podrías necesitar normalizar la URL
        return (
          // usamos img simple para no cambiar mucho la lógica; si querés Next/Image lo adaptamos
          <img
            src={attribs.src}
            alt={attribs.alt || ""}
            title={attribs.title || ""}
            loading={attribs.loading || "lazy"}
            className="w-full max-w-full h-auto rounded-md my-4"
            style={{ objectFit: "cover" }}
          />
        );
      }

      // Hacer que los iframes (p. ej. embeds) sean responsive
      if (name === "iframe") {
        const attribs = domNode.attribs || {};
        const src = attribs.src || "";
        return (
          <div className="w-full my-4" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={src}
              title={attribs.title || "embed"}
              frameBorder={attribs.frameborder || "0"}
              allowFullScreen
              className="w-full h-full rounded-md"
            />
          </div>
        );
      }

      // Listas: añadir spacing
      if (name === "ul") {
        return <ul className="list-disc pl-6 mb-4">{domToReact(domNode.children, parseOptions)}</ul>;
      }

      if (name === "ol") {
        return <ol className="list-decimal pl-6 mb-4">{domToReact(domNode.children, parseOptions)}</ol>;
      }

      // Blockquotes estilo
      if (name === "blockquote") {
        return <blockquote className="border-l-4 pl-4 italic text-gray-700 mb-4">{domToReact(domNode.children, parseOptions)}</blockquote>;
      }

      // Por defecto, no reemplazamos (devuelve undefined) y se renderiza tal cual.
      return undefined;
    },
  };

  return (
    <div className="relative">
      {featuredUrl ? (
        <header
          className="hero-bleed"
          style={{
            backgroundImage: `url(${featuredUrl})`,
            width: '100%',
          }}
        >
          <div className="hero-overlay" />
          <div className="hero-inner max-w-[2200px] mx-auto px-6 py-16 md:py-28">
            <div className="flex flex-col gap-3">
              <div className="badges flex flex-wrap gap-2">
                {post.categories?.nodes?.map((c: any) => (
                  <a
                    key={c.databaseId}
                    href={`/Categorias/${c.slug}`}
                    className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md ring-1 ring-white/10"
                  >
                    {c.name}
                  </a>
                ))}
              </div>

              <h1
                className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight drop-shadow-lg text-shadow-lg/30"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />

              <div className="m-2 text-sm text-gray-200 flex items-center gap-4 text-shadow-lg">
                <svg className="w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publicado el {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>
      ) : (
        <div className="w-full h-64 bg-gray-800" />
      )}

      <main className="content-container">
        <article className="bg-white rounded-xl shadow-xl p-6 md:p-10 prose max-w-none titillium-web-bold">
          {/* Aquí parseamos y renderizamos el HTML con control */}
          <div className="post-content text-gray-800">
            {parse(post.content || "", parseOptions)}
          </div>

          {post.categories?.nodes?.length > 0 && (
            <div className="mt-8">
              <strong className="block mb-2">Categorías:</strong>
              <div className="flex flex-wrap gap-2">
                {post.categories.nodes.map((c: any) => (
                  <a key={c.databaseId} href={`/Categorias/${c.slug}`} className="inline-block text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded">
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
