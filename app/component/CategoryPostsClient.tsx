// components/CategoryPostsListClient.tsx
'use client';
import React, { useState } from 'react';
import { getClient } from '../lib/cliente';
import { GET_CATEGORY_POSTS_BY_SLUG, GET_ALL_POSTS } from '../lib/queries';
import Link from 'next/link';

export default function CategoryPostsListClient({ initialPosts = [], initialPageInfo = {}, slug }: any) {
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);

  const isInteresGeneral = slug === 'interes-general';

  const loadMore = async () => {
    if (!pageInfo?.hasNextPage) return;
    setLoading(true);
    try {
      const client = getClient();
      if (isInteresGeneral) {
        const { data } = await client.query({
          query: GET_ALL_POSTS,
          variables: { first: 10, after: pageInfo.endCursor },
          fetchPolicy: 'network-only',
        });
        const newNodes = data?.posts?.nodes ?? [];
        setPosts(prev => [...prev, ...newNodes]);
        setPageInfo(data?.posts?.pageInfo ?? { endCursor: null, hasNextPage: false });
      } else {
        const { data } = await client.query({
          query: GET_CATEGORY_POSTS_BY_SLUG,
          variables: { slug, first: 10, after: pageInfo.endCursor }, // <-- slug como String
          fetchPolicy: 'network-only',
        });
        const newNodes = data?.categories?.nodes?.[0]?.posts?.nodes ?? [];
        const newPageInfo = data?.categories?.nodes?.[0]?.posts?.pageInfo ?? { endCursor: null, hasNextPage: false };
        setPosts(prev => [...prev, ...newNodes]);
        setPageInfo(newPageInfo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((p: any) => (
          <li key={p.databaseId} style={{ marginBottom: 20 }}>
            <h3><Link href={`/noticia/${p.slug}`}>{p.title}</Link></h3>
            <div dangerouslySetInnerHTML={{ __html: p.excerpt || '' }} />
            <div style={{ fontSize: 12, marginTop: 6 }}>
              {p.categories?.nodes?.map((c: any) => (<span key={c.slug} style={{ marginRight: 8 }}>{c.name}</span>))}
            </div>
          </li>
        ))}
      </ul>

      {pageInfo?.hasNextPage ? (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={loadMore} disabled={loading}>{loading ? 'Cargando...' : 'Cargar más'}</button>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No hay más noticias.</p>
      )}
    </section>
  );
}
