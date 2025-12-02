// app/Categorias/[slug]/page.tsx
import React from "react";
import {
  getCachedPostsPage,
  getAllCategories,
  normalizeSlug,
} from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";
import type { Category, MappedPost } from "@/app/lib/definitions";

export const dynamic = "force-dynamic";

export default async function CategoriaPage(
  props: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ page?: string }>;
  }
) {
  const { slug: rawSlug } = await props.params;
  const resolvedSearch = (props.searchParams
    ? await props.searchParams
    : {}) as { page?: string };

  const slug = normalizeSlug(rawSlug);

  const page = Number(resolvedSearch?.page ?? "1") || 1;

  // Cargar categorías
  let allCategories: Category[] = [];
  try {
    allCategories = await getAllCategories();
  } catch (err) {
    console.error("Error cargando categorías:", err);
  }

  // Obtener posts
  const result = await getCachedPostsPage(slug, page);

  const posts: MappedPost[] = result.posts ?? [];
  const totalPages = result.totalPages ?? 1;

  // Nombre visible real
  let categoryName = rawSlug;
  const found = allCategories.find((c) => c.slug === slug);
  if (found) categoryName = found.name;

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
        <div className="py-10 text-center text-gray-500">
          No se encontraron noticias en esta categoría.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <div className="mt-10">
        <CategoryPagination
          current={page}
          totalPages={totalPages}
          basePath={`/Categorias/${slug}`}
        />
      </div>
    </div>
  );
}
