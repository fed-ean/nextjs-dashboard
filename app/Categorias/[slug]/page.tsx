// app/Categorias/[slug]/page.tsx
import React from "react";
import { getCachedPostsPage, getAllCategories } from "@/app/lib/data-fetcher";
import CategoryGrid from "@/app/ui/categorias/CategoryGrid";
import CategoryPagination from "@/app/ui/categorias/CategoryPagination";

export const dynamic = "force-dynamic";

export default async function CategoriaPage(props: any) {
  const { params, searchParams } = props;
  const slug = params.slug;
  const page = Number(searchParams?.page) || 1;

  const categories = await getAllCategories();
  const { posts, totalPages, category } = await getCachedPostsPage(slug, page);

  const categoryName = category?.name ?? slug;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

      <CategoryGrid posts={posts} />

      <CategoryPagination
        current={page}
        totalPages={totalPages}
        basePath={`/Categorias/${slug}`}
      />
    </div>
  );
}
