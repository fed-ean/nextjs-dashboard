// app/ui/categorias/CategoryGrid.tsx
'use client';

import React from "react";
import Link from "next/link";
import type { MappedPost } from "@/app/lib/definitions";

interface CategoryGridProps {
  posts: MappedPost[];
  currentSectionSlug?: string;
}

export default function CategoryGrid({ posts, currentSectionSlug }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => {
        const isCurrentSection = !!currentSectionSlug && post.slug.includes(currentSectionSlug);
        return (
          <article
            key={post.slug}
            className={`border rounded p-4 shadow-sm transition hover:shadow-md overflow-hidden ${
              isCurrentSection ? "bg-yellow-50 border-yellow-400" : "bg-white"
            }`}
          >
            <Link href={`/Noticias/${post.slug}`} className="block">
              <h2 className="text-lg font-semibold line-clamp-2">{post.title}</h2>
            </Link>

            { /* imagen: usamos `post.image` según definitions.ts */ }
            {post.featuredImage ? (
  <div className="mt-3">
    <img
      src={post.featuredImage}
      alt={post.title}
      className="w-full h-auto rounded"
    />
  </div>
) : null}


            { /* Si en el futuro quieres mostrar excerpt, añadilo al MappedPost y mostrar aquí */ }
          </article>
        );
      })}
    </div>
  );
}
