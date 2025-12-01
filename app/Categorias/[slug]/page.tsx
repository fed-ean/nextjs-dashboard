// app/Categorias/[slug]/page.tsx
import React from "react";
import {
  getCachedPostsPage,
  getAllCategories,
} from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";
import type { Category, MappedPost } from "@/app/lib/definitions";

export const dynamic = "force-dynamic";

// Normaliza slugs: quita tildes y pone en minúsculas para evitar mismatch con WP
function normalizeSlug(str: string) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function CategoriaPage({ params, searchParams }: any) {
  const rawSlug = params?.slug ?? "";
  const slug = normalizeSlug(rawSlug);
  const page = Number(searchParams?.page ?? 1) || 1;

  // Traemos todas las categorías (opcional, útil si querés mostrar listado o buscar nombre "real")
  let allCategories: Category[] = [];
  try {
    allCategories = await getAllCategories();
  } catch (err) {
    console.error("Error cargando categorías:", err);
    allCategories = [];
  }

  // Intentamos obtener posts de la categoría (o últimos si slug vacío)
  let posts: MappedPost[] = [];
  let totalPages = 0;
  let categoryName = rawSlug;

  try {
    const result = await getCachedPostsPage(slug || null, page);

    // Protecciones si la función devolvió null o estructura inesperada
    if (!result || !Array.isArray(result.posts)) {
      posts = [];
      totalPages = 0;
    } else {
      posts = result.posts as MappedPost[];
      // Preferimos totalPages si lo devuelve la función; si no, intentamos calcularlo desde total
      totalPages =
        Number(result.totalPages ?? 0) ||
        Math.ceil((Number(result.total ?? 0) || posts.length) / (posts.length || 1));
    }

    // Si result.category tiene nombre preferimos ese
    if (result?.category?.name) categoryName = result.category.name;
    else {
      const matched = allCategories.find((c) => normalizeSlug(c.slug) === slug);
      if (matched) categoryName = matched.name;
    }
  } catch (err) {
    console.error("Error en getCachedPostsPage:", err);
    posts = [];
    totalPages = 0;
  }

  // Si no hay posts, mostramos un mensaje amigable en vez de romper
  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

        <div className="text-center py-10 text-gray-600">
          No se encontraron noticias en esta categoría.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <div className="mt-8">
        <CategoryPagination
          current={page}
          totalPages={totalPages}
          basePath={`/Categorias/${slug}`}
        />
      </div>
    </div>
  );
}
