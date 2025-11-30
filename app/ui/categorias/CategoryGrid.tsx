// app/ui/categorias/CategoryGrid.tsx
import React from "react";
import type { Post } from "@/app/lib/definitions";

interface CategoryGridProps {
  posts: Post[];
  currentSectionSlug?: string; // opcional
}

export default function CategoryGrid({ posts, currentSectionSlug }: CategoryGridProps) {
  // Si querés resaltar posts que coincidan con la sección actual
  // por ejemplo, podrías agregar una clase especial
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => {
        const isCurrentSection = currentSectionSlug && post.slug.includes(currentSectionSlug);
        return (
          <article
            key={post.slug}
            className={`border rounded p-4 shadow-sm transition hover:shadow-md ${
              isCurrentSection ? "bg-yellow-50 border-yellow-400" : ""
            }`}
          >
            <a href={`/Noticias/${post.slug}`} className="block">
              <h2 className="text-lg font-semibold">{post.title}</h2>
            </a>

            {post.featuredImage?.node?.sourceUrl && (
              <img
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                className="mt-2 rounded w-full h-48 object-cover"
              />
            )}

            <div
              className="text-sm mt-2"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </article>
        );
      })}
    </div>
  );
}
