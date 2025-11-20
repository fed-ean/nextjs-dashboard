import React from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../ui/categorias/CategoryPagination";

const PER_PAGE = 9;

type PageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = params;
  const page = Number(searchParams?.page || 1);

  // ✅ CORRECTO: solo 1 argumento
  const { posts, totalPages, category, error } =
    await getCachedPostsPage(slug);

  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Error al cargar</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">
          Todavía no se ha publicado ningún artículo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        {category?.name ?? slug}
      </h1>

      <CategoryGrid
        posts={posts}
        currentSectionSlug={slug}
        showCategory={false}
      />

      <div className="mt-8">
        <CategoryPagination
          basePath={`/Categorias/${slug}`}
          current={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
        />
      </div>
    </div>
  );
}
