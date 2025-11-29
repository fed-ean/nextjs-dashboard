import React from "react";
import { getCachedPostsPage, getAllCategories } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

export default async function CategoriaPage(props: any) {
  const { params, searchParams } = props;

  const slug = params.slug;
  const page = Number(searchParams?.page ?? 1);

  const categories = await getAllCategories();
  const { posts, totalPages } = await getCachedPostsPage(slug, page);

  const category = categories.find((c) => c.slug === slug);

  return (
    <div className="container mx-auto py-8 grid grid-cols-12 gap-6">

      {/* SIDEBAR (dejamos el tuyo intacto si ya existe) */}
      <aside className="col-span-12 md:col-span-3">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <ul className="space-y-1">
          {categories.map(cat => (
            <li key={cat.slug}>
              <a
                href={`/Categorias/${cat.slug}`}
                className={`hover:underline ${
                  cat.slug === slug ? "font-bold text-blue-700" : "text-blue-600"
                }`}
              >
                {cat.name} ({cat.count})
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENIDO */}
      <main className="col-span-12 md:col-span-9">
        <h1 className="text-2xl font-bold mb-6">
          {category?.name ?? "Categoría"}
        </h1>

        <CategoryGrid posts={posts} />

        <CategoryPagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/Categorias/${slug}`}
        />
      </main>
    </div>
  );
}
