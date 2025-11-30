// app/ui/categorias/CategoryGrid.tsx
import React from "react";
// Importamos el tipo MappedPost en lugar de Post
import type { MappedPost } from "@/app/lib/definitions";

interface CategoryGridProps {
  // La prop posts ahora espera un array de MappedPost
  posts: MappedPost[];
  currentSectionSlug?: string; // opcional
}

export default function CategoryGrid({ posts, currentSectionSlug }: CategoryGridProps) {
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

            {/* Se ajusta la ruta a la imagen para que coincida con la estructura de MappedPost */}
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="mt-2 rounded w-full h-48 object-cover"
              />
            )}

            {/* 
              El campo 'excerpt' no existe en MappedPost, por lo que se elimina temporalmente.
              Esto es necesario para solucionar el error de tipos.
            */}
          </article>
        );
      })}
    </div>
  );
}
