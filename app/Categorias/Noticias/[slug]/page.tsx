import { getServerSideClient } from '@/app/lib/server-cliente';
import { gql } from '@apollo/client';
import { Metadata } from 'next';
import React from 'react';
import parse from 'html-react-parser';
import './styles.css';

/* ✅ Forzamos rendering dinámico para evitar errores en build */
export const dynamic = 'force-dynamic';

/* =======================
   GraphQL Query
======================= */
const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      title
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          databaseId
          slug
          name
        }
      }
    }
  }
`;

/* =======================
   Types
======================= */
type PageProps = {
  params: {
    slug: string;
  };
};

type Category = {
  databaseId: number;
  slug: string;
  name: string;
};

type Post = {
  title: string;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
    };
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  categories?: {
    nodes: Category[];
  };
};

type PostData = {
  post: Post | null;
};

/* =======================
   Fetch Post
======================= */
async function getPost(slug: string): Promise<Post | null> {
  const client = getServerSideClient();

  try {
    const { data } = await client.query<PostData>({
      query: GET_POST_BY_SLUG,
      variables: { id: slug },
    });

    return data?.post ?? null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

/* =======================
   SEO Metadata
======================= */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);

  return {
    title: post?.title ?? 'Post no encontrado',
  };
}

/* =======================
   Page Component
======================= */
export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xl">
        Post no encontrado.
      </div>
    );
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl;

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
              
              {/* Categorías */}
              <div className="badges flex flex-wrap gap-2">
                {post.categories?.nodes?.map((c) => (
                  <a
                    key={c.databaseId}
                    href={`/Categorias/${c.slug}`}
                    className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md ring-1 ring-white/10"
                  >
                    {c.name}
                  </a>
                ))}
              </div>

              {/* Título */}
              <h1
                className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight drop-shadow-lg text-shadow-lg/30"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />

              {/* Fecha */}
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

      {/* Contenido */}
      <main className="content-container">
        <article className="bg-white rounded-xl shadow-xl p-6 md:p-10 prose max-w-none titillium-web-bold">

          <div className="post-content text-gray-800">
            {parse(post.content || '')}
          </div>

          {/* Categorías abajo */}
          {post.categories?.nodes?.length ? (
            <div className="mt-8">
              <strong className="block mb-2">Categorías:</strong>
              <div className="flex flex-wrap gap-2">
                {post.categories.nodes.map((c) => (
                  <a
                    key={c.databaseId}
                    href={`/Categorias/${c.slug}`}
                    className="inline-block text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      </main>
    </div>
  );
}
