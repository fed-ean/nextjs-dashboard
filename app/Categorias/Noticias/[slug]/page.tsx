// app/Categorias/Noticias/[slug]/page.tsx
import React from "react";
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from "html-react-parser";
import "@/app/ui/Page_Index/style-noticias.css";

// --- TIPOS DE DATOS DE TYPESCRIPT ---
// Definimos la estructura de los datos para evitar errores y usar `any`.

interface Category {
  databaseId: number;
  name: string;
  slug: string;
}

interface FeaturedImage {
  node: {
    sourceUrl: string;
  };
}

interface Post {
  databaseId: number;
  title: string;
  content: string;
  date: string;
  featuredImage: FeaturedImage | null;
  categories: {
    nodes: Category[];
  };
}

interface AllSlugsData {
  posts: {
    nodes: { slug: string }[];
  };
}

interface PostData {
  post: Post | null;
}

// --- CONSTANTES Y QUERIES DE GRAPHQL ---

const GQL_ENDPOINT = "https://radioempresaria.com.ar/graphql";

// Query para `generateStaticParams`. Se define como string para evitar errores de compilación.
const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs {
    posts(first: 10000) {
      nodes {
        slug
      }
    }
  }
`;

// Query para obtener el contenido de un post por su slug.
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

// --- GENERACIÓN DE PÁGINAS ESTÁTICAS ---

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_ALL_POST_SLUGS }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch slugs: ${response.statusText}`);
    }

    const { data, errors } = await response.json() as { data?: AllSlugsData, errors?: any[] };

    if (errors) {
      throw new Error(`GraphQL error fetching slugs: ${errors.map((e) => e.message).join(', ')}`);
    }

    if (!data || !data.posts || !data.posts.nodes) {
        return [];
    }

    return data.posts.nodes.map((post) => ({ slug: post.slug }));

  } catch (error) {
    console.error("Could not generate static params:", error);
    return []; // Devolver un array vacío en caso de error para no romper el build.
  }
}

// --- COMPONENTE DE ERROR ---

const ErrorDisplay = ({ message, details }: { message: string; details?: string }) => (
    <div className="text-center py-10 px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar la Noticia</h1>
        <p className="text-gray-700">{message}</p>
        {details && <p className="text-sm text-gray-500 mt-2">Detalle: {details}</p>}
    </div>
);

// --- FUNCIÓN PARA OBTENER LOS DATOS DEL POST ---

async function getPostData(slug: string): Promise<{ post: Post | null; error: string | null }> {
    try {
        const response = await fetch(GQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_POST_BY_SLUG, variables: { slug } }),
            next: { revalidate: 3600 }, 
        });

        if (!response.ok) {
            throw new Error(`Network response was not OK: ${await response.text()}`);
        }

        const { data, errors } = await response.json() as { data?: PostData, errors?: any[] };

        if (errors) {
            throw new Error(errors.map((e) => e.message).join(', '));
        }

        if (!data?.post) {
            return { post: null, error: "La noticia solicitada no fue encontrada." };
        }

        return { post: data.post, error: null };

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
        console.error(`Failed to fetch post [slug: ${slug}]:`, errorMessage);
        return { post: null, error: errorMessage };
    }
}

// --- COMPONENTE DE LA PÁGINA ---

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { post, error } = await getPostData(slug);

  if (error || !post) {
    return <ErrorDisplay message={error || "La noticia que buscas no existe o ha sido eliminada."} />;
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl || null;

  // Opciones para el parser de HTML, con tipado correcto.
  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.attribs) {
          const { name, attribs, children } = domNode;
          if (name === "p") {
              return <p className="leading-relaxed text-gray-800 my-4">{domToReact(children as DOMNode[], parseOptions)}</p>;
          }
          if (name === "img") {
              return <img src={attribs.src} alt={attribs.alt || ""} loading="lazy" className="w-full h-auto rounded-md my-4" />;
          }
          if (name === "iframe") {
              return (
                  <div className="w-full my-4 aspect-video">
                      <iframe 
                          src={attribs.src} 
                          title={attribs.title || "Embed"} 
                          frameBorder="0" 
                          allowFullScreen 
                          className="w-full h-full rounded-md" 
                      />
                  </div>
              );
          }
      }
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
                    {post.categories?.nodes?.map((category) => (
                      <a 
                        key={category.databaseId} 
                        href={`/Categorias/${category.slug}`} 
                        className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md"
                      >
                        {category.name}
                      </a>
                    ))}
                </div>
                <h1 
                  className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold" 
                  dangerouslySetInnerHTML={{ __html: post.title }} 
                />
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
