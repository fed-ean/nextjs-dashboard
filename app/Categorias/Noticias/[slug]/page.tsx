// app/Categorias/Noticias/[slug]/page.tsx
import React from "react";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import { GET_ALL_POST_SLUGS } from "../../../lib/queries";
import "../../../ui/Page_Index/style-noticias.css";

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

type PostPageProps = {
  params: { slug: string };
};


export async function generateStaticParams() {
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_ALL_POST_SLUGS.loc.source.body }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch slugs: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(`GraphQL error fetching slugs: ${json.errors.map((e: any) => e.message).join(', ')}`);
    }

    const slugs = json.data.posts.nodes.map((post: { slug: string }) => ({ slug: post.slug }));
    return slugs.length > 0 ? slugs : [];

  } catch (error) {
    console.error("Could not generate static params:", error);
    return [];
  }
}

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

const ErrorDisplay = ({ message, details }: { message: string; details?: string }) => (
    <div className="text-center py-10 px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar la Noticia</h1>
        <p className="text-gray-700">{message}</p>
        {details && <p className="text-sm text-gray-500 mt-2">Detalle: {details}</p>}
    </div>
);

async function getPostData(slug: string) {
    try {
        const response = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_POST_BY_SLUG, variables: { slug } }),
            next: { revalidate: 3600 }, 
        });

        if (!response.ok) {
            throw new Error(`Network response was not OK: ${await response.text()}`)
        }

        const json = await response.json();
        if (json.errors) {
            throw new Error(json.errors.map((e: any) => e.message).join(', '));
        }

        return { post: json.data.post, error: null };

    } catch (err: any) {
        console.error(`Failed to fetch post [slug: ${slug}]:`, err.message);
        return { post: null, error: err.message };
    }
}

export default async function PostPage({ params }: PostPageProps) {

  const { slug } = params;
  const { post, error } = await getPostData(slug);

  if (error || !post) {
    return <ErrorDisplay message={error || "La noticia que buscas no existe o ha sido eliminada."} />;
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl || null;

  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.type !== 'tag') return;
      const { name, attribs, children } = domNode;
      if (name === "p") return <p className="leading-relaxed text-gray-800">{domToReact(children, parseOptions)}</p>;
      if (name === "img") return <img src={attribs.src} alt={attribs.alt || ""} loading="lazy" className="w-full h-auto rounded-md my-4" />;
      if (name === "iframe") return <div className="w-full my-4 aspect-video"><iframe src={attribs.src} title={attribs.title || "Embed"} frameBorder="0" allowFullScreen className="w-full h-full rounded-md" /></div>;
      return undefined;
    },
  };

  return (
    <div className="relative">
      {featuredUrl && (
        <header className="hero-bleed" style={{ backgroundImage: `url(${featuredUrl})` }}>
          <div className="hero-overlay" />
          <div className="hero-inner max-w-[2200px] mx-auto px-6 py-16 md:py-28">
            <div className="flex flex-col gap-3">
                <div className="badges flex flex-wrap gap-2">
                    {post.categories?.nodes?.map((c: any) => <a key={c.databaseId} href={`/Categorias/${c.slug}`} className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md">{c.name}</a>)}
                </div>
                <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold" dangerouslySetInnerHTML={{ __html: post.title }} />
            </div>
          </div>
        </header>
      )}

      <main className="content-container">
        <article className="bg-white rounded-xl shadow-xl p-4 md:p-6 prose max-w-none">
          <div className="post-content text-gray-800">
            {parse(post.content || "", parseOptions)}
          </div>
        </article>
      </main>
    </div>
  );
}
