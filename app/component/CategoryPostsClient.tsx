// app/component/CategoryPostsClient.tsx
'use client';

import React, { useState } from 'react';
import { getClient } from '../lib/cliente';
import { GET_POSTS_BY_CATEGORY_SIMPLE, GET_ALL_POSTS } from '../lib/queries';
import Link from 'next/link';

type PageInfo = {
  endCursor?: string | null;
  hasNextPage?: boolean;
};

export default function CategoryPostsClient({
  initialPosts = [],
  initialPageInfo = {},
  slug
}: any) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [loading, setLoading] = useState(false);

  const isInteresGeneral = slug === 'interes-general';

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const client = getClient();

      if (isInteresGeneral) {
        const { data }: any = await client.query({
          query: GET_ALL_POSTS,
          variables: {
            first: 10,
            after: pageInfo?.endCursor || null
          },
          fetchPolicy: 'network-only',
        });

        const newNodes = data?.posts?.nodes || [];
        const newPageInfo = data?.posts?.pageInfo || {
          endCursor: null,
          hasNextPage: false
        };

        setPosts(prev => [...prev, ...newNodes]);
        setPageInfo(newPageInfo);

      } else {
        const { data }: any = await client.query({
          query: GET_POSTS_BY_CATEGORY_SIMPLE,
          variables: { categoryName: slug },
          fetchPolicy: 'network-only',
        });

        const newNodes = data?.posts?.nodes || [];

        setPosts(prev => [...prev, ...newNodes]);
        setPageInfo({ endCursor: null, hasNextPage: false });
      }

    } catch (err) {
      console.error('Error cargando más posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((p: any) => (
          <li key={p.databaseId} style={{ marginBottom: 20 }}>
            <h3>
              <Link href={`/noticia/${p.slug}`}>{p.title}</Link>
            </h3>

            <div dangerouslySetInnerHTML={{ __html: p.excerpt || '' }} />

            <div style={{ fontSize: 12, marginTop: 6 }}>
              {p.categories?.nodes?.map((c: any) => (
                <span key={c.slug} style={{ marginRight: 8 }}>
                  {c.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {pageInfo?.hasNextPage ? (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={loadMore} disabled={loading}>
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No hay más noticias.</p>
      )}
    </section>
  );
}
