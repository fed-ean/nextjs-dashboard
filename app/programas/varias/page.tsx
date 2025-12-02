// app/programas/varias/page.tsx
import React from "react";
import type { MappedPost } from "@/app/lib/definitions";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

export const dynamic = "force-dynamic";

interface Props {
  // Next.js 15+ pasa params y searchParams como Promises
  params: Promise<Record<string, string>>;
  searchParams?: Promise<{ page?: string }>;
}

export default async function VariasPage(props: Props) {
  // resolvemos searchParams conforme al nuevo contrato de Next
  const resolvedSearch = props.searchParams ? await props.searchParams : {};
  const page = Number(resolvedSearch.page ?? "1") || 1;

  // Pedimos la "sección programas" excluyendo las subcategorías (según tu lógica en data-fetcher)
  // Aquí llamamos getCachedPostsPage('programas', page) — tu data-fetcher debe devolver totalPages y posts mapeados.
  let result;
  try {
    result = await getCachedPostsPage("programas", page);
  } catch (err) {
    console.error("Error getCachedPostsPage(programas):", err);
    result = { posts: [], totalPages: 1, total: 0, category: null } as unknown as {
      posts: MappedPost[];
      totalPages: number;
      total: number;
      category: any;
    };
  }

  const posts: MappedPost[] = Array.isArray(result.posts) ? result.posts : [];
  const totalPages = Number(result.totalPages ?? 1);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold mb-3">No hay publicaciones</h1>
        <p className="text-gray-500">Todavía no se ha publicado ningún artículo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Varias</h1>

      <CategoryGrid posts={posts} currentSectionSlug="programas/varias" />

      <div className="mt-8">
        <CategoryPagination basePath="/programas/varias" current={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
