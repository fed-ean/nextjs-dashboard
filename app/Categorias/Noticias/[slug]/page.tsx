// app/Categorias/Noticias/[slug]/page.tsx   (REEMPLAZAR con este)
import { getServerSideClient } from '@/app/lib/server-cliente';
import { gql } from '@apollo/client';
import { Metadata } from 'next';
import React from 'react';
import parse from 'html-react-parser';
import SidenavServer from '@/app/ui/Page_Index/SidenavServer';
import './styles.css';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';

export const dynamic = 'force-dynamic';

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

type PageProps = {
  params: Promise<{ slug: string; }>;
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
  author: { node: { name: string; }; };
  featuredImage?: { node?: { sourceUrl?: string; altText?: string; }; };
  categories?: { nodes: Category[]; };
};

type PostData = { post: Post | null; };

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? 'Post no encontrado' };
}

/* ============================
   Utilidades de diseño
   ============================ */

// Generador de color estable por nombre de categoría
const getColorForCategory = (name: string) => {
  const colors = [
    "bg-indigo-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-purple-600",
    "bg-orange-500",
    "bg-yellow-400 text-black",
    "bg-teal-600",
    "bg-pink-500",
    "bg-red-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Cálculo de tiempo de lectura (estimación simple: 200 palabras/minuto)
const estimateReadingTime = (htmlContent: string) => {
  const text = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

/* ============================
   Página del Post
   ============================ */

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xl">
        Post no encontrado.
      </div>
    );
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl;
  const authorName = post.author?.node?.name ?? 'RadioEmpresarial';
  const formattedDate = post.date
    ? format(parseISO(post.date), "d 'de' MMMM, yyyy", { locale: es })
    : '';
  const readingTime = estimateReadingTime(post.content || '');

  // Ordeno categorías: la "principal" será la primera (si existe)
  const categorias = post.categories?.nodes ?? [];
  const primaryCategory = categorias[0] ?? null;
  const otherCategories = categorias.slice(1);

  return (
    <div className="w-full">

      {/* =======================
          HERO / BANNER PRINCIPAL
         ======================= */}
      <header
        className="hero-bleed"
        style={{
          backgroundImage: featuredUrl ? `linear-gradient(rgba(10,11,13,0.45), rgba(10,11,13,0.45)), url(${featuredUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay sutil adicional */}
        <div className="hero-inner container mx-auto px-6 py-16 md:py-28">
          <div className="max-w-4xl">
            {/* Categorías en chips (la principal más destacada) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {primaryCategory && (
                <a
                  href={`/Categorias/${primaryCategory.slug}`}
                  className={`inline-flex items-center gap-2 ${getColorForCategory(primaryCategory.name)} text-white text-xs font-semibold uppercase px-3 py-1 rounded-md shadow`}
                  aria-label={`Categoría principal: ${primaryCategory.name}`}
                >
                  {primaryCategory.name}
                </a>
              )}

              {otherCategories.map((c) => (
                <a
                  key={c.databaseId}
                  href={`/Categorias/${c.slug}`}
                  className={`inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md ring-1 ring-white/10`}
                >
                  {c.name}
                </a>
              ))}
            </div>

            <h1
              className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-3">
                {/* author avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm text-white font-semibold">
                  {authorName.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">{authorName}</div>
                  <div className="text-xs text-gray-200/90">{formattedDate} · {readingTime}</div>
                </div>
              </div>

              <div className="ml-auto hidden sm:flex items-center gap-2 text-gray-200 text-xs">
                <svg className="w-5 h-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Publicado el {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =======================
          CONTENIDO PRINCIPAL + SIDENAV
         ======================= */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ARTÍCULO */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 prose prose-lg max-w-none titillium-web-bold text-gray-800">
              {/* Contenido del post */}
              <div className="post-content">
                {parse(post.content || '')}
              </div>

              {/* Metadatos finales: autor + fecha + tiempo */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700">
                    {authorName.split(' ').map(n => n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{authorName}</div>
                    <div className="text-sm text-gray-500">{formattedDate} · {readingTime}</div>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Compartir (placeholder) */}
                  <button className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50 transition">
                    Compartir
                  </button>
                  <a href="#categorias" className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition">
                    Ver categorías
                  </a>
                </div>
              </div>

              {/* BLOQUE DE CATEGORÍAS AL FINAL (mejorado) */}
              {categorias.length > 0 && (
                <div id="categorias" className="mt-8 border-t pt-6">
                  <strong className="block mb-4 text-lg font-semibold">Categorías</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categorias.map((c) => (
                      <a
                        key={c.databaseId}
                        href={`/Categorias/${c.slug}`}
                        className={`flex items-center gap-4 p-3 rounded-lg border hover:shadow-md transition bg-white`}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-md text-white ${getColorForCategory(c.name)}`}>
                          <span className="text-sm font-semibold">{c.name[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{c.name}</div>
                          <div className="text-xs text-gray-500">Ver noticias en {c.name}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* SIDENAV */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <SidenavServer />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
