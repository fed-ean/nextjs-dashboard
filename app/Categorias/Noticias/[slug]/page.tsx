// app/Categorias/Noticias/[slug]/page.tsx
import React from "react";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import "../../../fonts.css"
import "../../../ui/Page_Index/style-noticias.css";

// Endpoint de GraphQL
const GQL_ENDPOINT = "/graphql";

type PageProps = { params: { slug: string } };

const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      title
      content
      date
      featuredImage { node { sourceUrl } }
      categories { nodes { databaseId name slug } }
    }
  }
`;

// --- Componente de UI para mostrar errores ---
const ErrorDisplay = ({ message, details }: { message: string; details?: string }) => (
    <div className="text-center py-10 px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar la Noticia</h1>
        <p className="text-gray-700">{message}</p>
        {details && <p className="text-sm text-gray-500 mt-2">Detalle: {details}</p>}
        <p className="mt-6">Por favor, intenta recargar la página o vuelve más tarde.</p>
    </div>
);

// --- Función para obtener los datos del post ---
async function getPostData(slug: string) {
    try {
        const response = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: GET_POST_BY_SLUG,
                variables: { slug },
            }),
            cache: 'no-store', // No cachear para páginas de noticias individuales
        });

        if (!response.ok) {
            throw new Error(`La respuesta de la red no fue OK: ${response.statusText}`);
        }

        const json = await response.json();

        if (json.errors) {
            throw new Error(`Errores en la respuesta de GraphQL: ${json.errors.map((e: any) => e.message).join(', ')}`);
        }

        if (!json.data?.post) {
            return { post: null, error: "No se encontró la noticia solicitada." };
        }

        return { post: json.data.post, error: null };

    } catch (err: any) {
        console.error("Fallo al obtener el post:", err.message);
        return { post: null, error: err.message };
    }
}



export default async function PostPage({ params }: PageProps) {
  const { slug } = params;

  if (!slug) {
    return <ErrorDisplay message="El slug de la noticia no es válido." />;
  }

  const { post, error } = await getPostData(slug);

  if (error) {
    return <ErrorDisplay message="No se pudo cargar el contenido de la noticia." details={error} />;
  }

  if (!post) {
    return <ErrorDisplay message="La noticia que buscas no existe o ha sido eliminada." />;
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl || null;

  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.type !== 'tag') return;
      const { name, attribs, children } = domNode;
      if (name === "p") return <p className="leading-relaxed text-gray-800">{domToReact(children, parseOptions)}</p>;
      if (name === "br") return <br className="my-4" />;
      if (name === "img") return <img src={attribs.src} alt={attribs.alt || ""} loading="lazy" className="w-full h-auto rounded-md my-4" style={{ objectFit: "cover" }} />;
      if (name === "iframe") return <div className="w-full my-4 aspect-video"><iframe src={attribs.src} title={attribs.title || "Embed Responsivo"} frameBorder="0" allowFullScreen className="w-full h-full rounded-md" /></div>;
      if (name === "ul") return <ul className="list-disc pl-6 mb-4">{domToReact(children, parseOptions)}</ul>;
      if (name === "ol") return <ol className="list-decimal pl-6 mb-4">{domToReact(children, parseOptions)}</ol>;
      if (name === "blockquote") return <blockquote className="border-l-4 pl-4 italic text-gray-700 mb-4">{domToReact(children, parseOptions)}</blockquote>;
      return undefined;
    },
  };

  return (
    <div className="relative">
      {featuredUrl ? (
        <header className="hero-bleed" style={{ backgroundImage: `url(${featuredUrl})` }}>
          <div className="hero-overlay" />
          <div className="hero-inner max-w-[2200px] mx-auto px-6 py-16 md:py-28">
            <div className="flex flex-col gap-3">
                <div className="badges flex flex-wrap gap-2">
                    {post.categories?.nodes?.map((c: any) => <a key={c.databaseId} href={`/Categorias/${c.slug}`} className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md ring-1 ring-white/10">{c.name}</a>)}
                </div>
                <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight drop-shadow-lg text-shadow-lg/30" dangerouslySetInnerHTML={{ __html: post.title }} />
                <div className="m-2 text-sm text-gray-200 flex items-center gap-4 text-shadow-lg">
                    <svg className="w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Publicado el {new Date(post.date).toLocaleDateString()}
                </div>
            </div>
          </div>
        </header>
      ) : (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center"><h1 className="text-white text-3xl">{post.title}</h1></div>
      )}

      <main className="content-container">
        <article className="bg-white rounded-xl shadow-xl p-4 md:p-6 prose max-w-none titillium-web-bold">
          <div className="post-content text-gray-800">
            {parse(post.content || "", parseOptions)}
          </div>
        </article>
      </main>
    </div>
  );
}
