// app/ui/categorias/CategoryGrid.tsx
import React from "react";
import type { Post } from "@/app/lib/definitions";
import Image from "next/image";

export default function CategoryGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <article key={post.slug} className="border rounded p-4 shadow-sm">
          <a href={`/Noticias/${post.slug}`} className="block">
            <h2 className="text-lg font-semibold">{post.title}</h2>
          </a>

          {post.featuredImage?.node?.sourceUrl ? (
            // Si usás next/image, asegurate de que remotePatterns/host estén en next.config
            // uso <img> simple por compatibilidad si no querés tocar next.config
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              className="mt-2 rounded w-full h-48 object-cover"
            />
          ) : null}

          <div
            className="text-sm mt-2"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </article>
      ))}
    </div>
  );
}
