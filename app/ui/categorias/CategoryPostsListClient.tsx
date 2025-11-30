'use client';
import React, { useState, useEffect } from 'react';
import CategoryGrid from './CategoryGrid';
// 1. IMPORTAR EL TIPO POST OFICIAL
import type { Post } from '@/app/lib/definitions'; 

const PAGE_SIZE = 9;

// 2. ELIMINAR LA INTERFAZ LOCAL Y ERRÓNEA DE POST

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

interface CategoryPostsListClientProps {
  slug: string;
}

// La función ahora espera recibir el tipo Post oficial
async function fetchPosts(slug: string, after: string | null): Promise<{ posts: Post[]; pageInfo: PageInfo; totalCount: number }> {
    const response = await fetch('/api/category-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            slug,
            first: PAGE_SIZE,
            after,
            mode: 'byCategory'
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "No se pudieron cargar los posts.");
    }

    // Asumimos que la API ahora devuelve el tipo Post completo
    const { posts, pageInfo, totalCount } = await response.json();
    return { posts, pageInfo, totalCount };
}

export default function CategoryPostsListClient({ slug }: CategoryPostsListClientProps) {
  // 3. USAR EL TIPO POST OFICIAL EN EL ESTADO
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { posts: initialPosts, pageInfo: initialPageInfo } = await fetchPosts(slug, null);
        setPosts(initialPosts);
        setPageInfo(initialPageInfo);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, [slug]);

  const handleLoadMore = async () => {
    if (!pageInfo?.hasNextPage || loading) return;

    setLoading(true);
    try {
      const { posts: newPosts, pageInfo: newPageInfo } = await fetchPosts(slug, pageInfo.endCursor);
      
      const existingIds = new Set(posts.map(p => p.databaseId));
      const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.databaseId));
      
      setPosts(prev => [...prev, ...uniqueNewPosts]);
      setPageInfo(newPageInfo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return <div className="text-center p-8">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (posts.length === 0) {
      return <div className="text-center p-8">No hay noticias en esta categoría.</div>;
  }

  return (
    <section className="p-6">
      {/* Ahora el `posts` que se pasa aquí tiene el tipo correcto y el error de compilación debería desaparecer */}
      <CategoryGrid posts={posts} currentSectionSlug={slug} />

      <div className="mt-8 flex justify-center">
        {pageInfo?.hasNextPage && (
          <button onClick={handleLoadMore} disabled={loading} className="px-6 py-2 rounded-md bg-blue-600 text-white disabled:bg-blue-300">
            {loading ? 'Cargando...' : 'Cargar más noticias'}
          </button>
        )}
      </div>
    </section>
  );
}
