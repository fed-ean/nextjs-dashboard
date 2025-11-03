// app/Categorias/[slug]/page.tsx
import React from "react";
import { getCachedPostsPage } from "../../lib/wpRest";
import  CategoryPagination  from "../../ui/categorias/CategoryPagination";

const PER_PAGE = 9;

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const page = 1;

  console.time(`[CategoryPage] ${slug} page ${page}`);

  const { posts, total, totalPages, source } = await getCachedPostsPage(slug, page, PER_PAGE);

  console.timeEnd(`[CategoryPage] ${slug} page ${page}`);

  /** 
   * 🧠 Cálculo robusto de páginas totales:
   * - Si REST devuelve totalPages, lo usamos.
   * - Si REST no devuelve totalPages y total <= posts.length, probablemente sea fallback GraphQL → desconocido (0).
   * - Si total > posts.length (REST parcial sin totalPages), lo calculamos normalmente.
   */
  let computedTotalPages = 0;

  if (totalPages && totalPages > 0) {
    computedTotalPages = totalPages;
  } else if (typeof total === "number" && total > 0) {
    if (total > (posts?.length || 0)) {
      computedTotalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    } else {
      computedTotalPages = 0; // desconocido, deja que la paginación siga activa
    }
  }

  // 💡 Si no hay posts
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">
          Todavía no hay artículos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold capitalize mb-6">{slug}</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {posts.map((post: any) => (
          <article
            key={post.id || post.slug}
            className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition"
          >
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.excerpt?.replace(/<[^>]+>/g, "")}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <CategoryPagination
          basePath={`/Categorias/${slug}`}
          current={page}
          totalPages={computedTotalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
