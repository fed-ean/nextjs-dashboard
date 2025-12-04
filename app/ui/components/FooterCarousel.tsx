"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

export default function FooterCarousel({ posts }: { posts: Post[] }) {
  const [index, setIndex] = useState(0);

  // Auto slide cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % posts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [posts.length]);

  // Calcula qué posts mostrar (4 visibles)
  const visible = posts.slice(index, index + 4);
  const falta = 4 - visible.length;
  const completos = falta > 0 ? [...visible, ...posts.slice(0, falta)] : visible;

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-10 p-4 overflow-hidden">
      <div className="grid grid-cols-4 gap-4">
        {completos.map((post, i) => (
          <motion.div
            key={`${post.id}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow p-3 cursor-pointer hover:shadow-lg transition"
          >
            <Link href={`/Categorias/Noticias/${post.slug}`}>
              <div>
                {post.featuredImage?.node?.sourceUrl && (
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full h-32"
                  />
                )}
                <h3 className="text-sm font-semibold mt-2 line-clamp-2">{post.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
