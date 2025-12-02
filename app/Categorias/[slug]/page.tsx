// app/Categorias/[slug]/page.tsx
import React from "react";
import { getCachedPostsPage, getAllCategories } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";
import type { Category, MappedPost } from "@/app/lib/definitions";

export const dynamic = "force-dynamic";

// Normaliza slugs localmente
function normalizeSlug(str: string) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const rawSlug = params.slug ?? "";
  const slug = normalizeSlug(rawSlug);

  const page = Number(searchParams?.page ?? "1") || 1;

  // Cargar categorías
  let allCategories: Category[] = [];
  try {
    allCategories = await getAllCategories();
  } catch (error) {
    console.error("Error cargando categorías:", error);
  }

  // Obtener posts de la categoría
  let result;
  try {
    result = await getCachedPostsPage(slug, page);
  } catch (error) {
    console.error("Error ejecutando getCachedPostsPage:", error);
    result = { posts: [], totalPages: 1 };
  }

  const posts: MappedPost[] = Array.isArray(result.posts) ? result.posts : [];
  const totalPages = Number(result.totalPages ?? 1);

  // Buscar el nombre real de la categoría
  let categoryName = rawSlug;
  const matchedCat = allCategories.find(
    (c) => normalizeSlug(c.slug) === slug
  );
  if (matchedCat) categoryName = matchedCat.name;

  // Si no hay noticias
  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
        <div className="py-10 text-center text-gray-500">
          No se encontraron noticias en esta categoría.
        </div>
      </div>
    );
  }

  // Render normal
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
