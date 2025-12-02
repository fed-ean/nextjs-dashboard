// app/ui/categorias/CategoryPostsListClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import type { MappedPost } from '@/app/lib/definitions';
import CategoryGrid from './CategoryGrid';

interface Props {
  slug: string;
}

interface PageApiResponse {
  posts: MappedPost[];
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
  total?: number;
}

export default function CategoryPostsListClient({ slug }: Props) {
  const [posts, setPosts] = useState<MappedPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    // load first page via API route (/api/category-posts) si lo tienes
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/category-posts', {
          method: 'POST',
          body: JSON.stringify({ slug, page: 1 }),
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Error en API');
        const json: PageApiResponse = await res.json();
        setPosts(json.posts || []);
        setHasMore(Boolean((json.pageInfo as any)?.hasNextPage));
      } catch (err) {
        console.error('Error cargando posts client:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading && posts.length === 0) return <div className="p-6 text-center">Cargando...</div>;
  if (!posts || posts.length === 0) return <div className="p-6 text-center">No hay noticias.</div>;

  return (
    <section>
      <CategoryGrid posts={posts} currentSectionSlug={slug} />
      {/* Si implementás load more */}
    </section>
  );
}
