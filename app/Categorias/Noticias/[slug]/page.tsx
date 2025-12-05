// app/Categorias/Noticias/[slug]/page.tsx

import { getServerSideClient } from "@/app/lib/server-cliente";
import { gql } from "@apollo/client";
import { Metadata } from "next";
import React from "react";
import parse from "html-react-parser";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";
import FooterCarousel from "@/app/ui/components/FooterCarousel";
import SidenavComplement from "@/app/ui/components/SidenavComplement";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale/es";
import "./styles.css";

export const dynamic = "force-dynamic";

/* =============================
   QUERIES
   ============================= */

const GET_LAST_POSTS = gql`
  query GetLastPosts {
    posts(first: 10) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

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

/* =============================
   TYPES
   ============================= */

type PageProps = {
  params: Promise<{ slug: string }>;
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
  author: { node: { name: string } };
  featuredImage?: { node?: { sourceUrl?: string; altText?: string } };
  categories?: { nodes: Category[] };
};

type PostData = { post: Post | null };

type LastPostsData = {
  posts: {
    nodes: Array<{
      id: string;
      slug: string;
      title: string;
      date?: string;
      featuredImage?: { node?: { sourceUrl?: string } };
    }>;
  };
};

/* =============================
   HELPERS
   ============================= */

async function getPost(slug: string): Promise<Post | null> {
  const client = getServerSideClient();
  try {
    const { data } = await client.query<PostData>({
      query: GET_POST_BY_SLUG,
      variables: { id: slug },
    });
    return data?.post ?? null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getLastPosts(): Promise<LastPostsData["posts"]["nodes"]> {
  const client = getServerSideClient();
  try {
    const { data } = await client.query<LastPostsData>({
      query: GET_LAST_POSTS,
    });

    return data?.posts?.nodes ?? [];
  } catch (err) {
    console.error("Error fetching last posts:", err);
    return [];
  }
}

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

const estimateReadingTime = (htmlContent: string) => {
  const text = htmlContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
};

/* =============================
   METADATA
   ============================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? "Post no encontrado" };
}

/* =============================
   PAGE COMPONENT
   ============================= */

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const post = await getPost(slug);
  const lastPosts = await getLastPosts();

  if (!post) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xl">
        Post no encontrado.
      </div>
    );
  }

  const featuredUrl = post.featuredImage?.node?.sourceUrl;
  const authorName = post.author?.node?.name ?? "RadioEmpresarial";

  const formattedDate = post.date
    ? format(parseISO(post.date), "d 'de' MMMM, yyyy", { locale: es })
    : "";

  const readingTime = estimateReadingTime(post.content || "");

  const categorias = post.categories?.nodes ?? [];
  const primaryCategory = categorias[0] ?? null;
  const otherCategories = categorias.slice(1);

  return (
    <div className="w-full">
      {/* HERO */}
      <header
        className="hero-bleed"
        style={{
          backgroundImage: featuredUrl
            ? `linear-gradient(rgba(10,11,13,0.45), rgba(10,11,13,0.45)), url(${featuredUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-inner container mx-auto px-6 py-16 md:py-28">
          <div className="max-w-4xl">
            {/* CATEGORÍAS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {primaryCategory && (
                <a
                  href={`/Categorias/${primaryCategory.slug}`}
                  className={`inline-flex items-center gap-2 ${getColorForCategory(
                    primaryCategory.name
                  )} text-white text-xs font-semibold uppercase px-3 py-1 rounded-md shadow`}
                >
                  {primaryCategory.name}
                </a>
              )}

              {otherCategories.map((c) => (
                <a
                  key={c.databaseId}
                  href={`/Categorias/${c.slug}`}
                  className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold uppercase px-3 py-1 rounded-md ring-1 ring-white/10"
                >
                  {c.name}
                </a>
              ))}
            </div>

            {/* TITULO */}
            <h1
              className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            {/* AUTOR */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm text-white font-semibold">
                  {authorName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">{authorName}</div>
                  <div className="text-xs text-gray-200/90">
                    {formattedDate} · {readingTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDENAV */}
          <aside className="lg:col-span-3 lg:order-first">
            <div className="sticky top-24">
              <SidenavServer />
            </div>
          </aside>

          {/* COMPONENTE NUEVO */}
          <aside className="lg:col-span-3">
  <SidenavComplement
    socialLinks={{
      facebook: "https://www.facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      email: "mailto:info@radioempresarial.com",
    }}
    sponsors={[
      { src: "/sponsor/argennova.jpg", alt: "Sponsor 1" },
      { src: "/sponsors/s2.png", alt: "Sponsor 2" },
      { src: "/sponsors/s3.png", alt: "Sponsor 3" },
      { src: "/sponsors/s4.png", alt: "Sponsor 4" },
    ]}
  />
</aside>


          {/* ARTÍCULO */}
          <article className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 prose prose-lg max-w-none text-gray-800">
              <div className="post-content">{parse(post.content || "")}</div>
            </div>
          </article>
        </div>
      </main>

      {/* FOOTER (CARRUSEL DE NOTICIAS) */}
      <FooterCarousel posts={lastPosts} />
    </div>
  );
}
