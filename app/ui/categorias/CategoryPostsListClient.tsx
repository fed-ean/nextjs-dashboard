'use client';
import React, { useState, useMemo } from 'react';
import { getClient } from '../../lib/cliente';
import {
  GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
  GET_CATEGORY_POSTS_BY_SLUG,
  GET_CATEGORY_POSTS_BY_SLUGIN
} from '../../lib/queries';
import CategoryGrid from './CategoryGrid';

const PAGE_SIZE = 9; // 3 por columna -> 3 filas por pagina -> 9 por página
const MAX_FETCH_ALL = 1000; // límite al traer todas las noticias en paginado (ajusta si necesario)

export default function CategoryPostsListClient({ initialPosts = [], initialPageInfo = {}, slug }: any) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState<any>(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [usePagedMode, setUsePagedMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const client = getClient();

  // visible posts para paginado numerado o modo continuo
  const totalPages = useMemo(() => Math.max(1, Math.ceil(posts.length / PAGE_SIZE)), [posts.length]);
  const visible = useMemo(() => {
    if (!usePagedMode) return posts;
    const start = (currentPage - 1) * PAGE_SIZE;
    return posts.slice(start, start + PAGE_SIZE);
  }, [posts, usePagedMode, currentPage]);

  // Load more con cursor (intenta slug_array luego slug luego slugIn)
  const loadMore = async () => {
    if (!pageInfo?.hasNextPage) return;
    setLoading(true);
    try {
      // 1) slug_array
      try {
        const { data } = await client.query({
          query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
          variables: { slugs: [slug], first: PAGE_SIZE, after: pageInfo.endCursor },
          fetchPolicy: 'network-only'
        });
        const new = data?.categories?.nodes?.[0]?.posts?.nodes ?? [];
        const newPI = data?.categories?.nodes?.[0]?.posts?.pageInfo ?? { endCursor: null, hasNextPage: false };
        if (new.length) { setPosts(prev=>[...prev,...new]); setPageInfo(newPI); return; }
      } catch (e) {}

      // 2) slug string
      try {
        const { data } = await client.query({
          query: GET_CATEGORY_POSTS_BY_SLUG,
          variables: { slug, first: PAGE_SIZE, after: pageInfo.endCursor },
          fetchPolicy: 'network-only'
        });
        const new = data?.categories?.nodes?.[0]?.posts?.nodes ?? [];
        const newPI = data?.categories?.nodes?.[0]?.posts?.pageInfo ?? { endCursor: null, hasNextPage: false };
        if (new.length) { setPosts(prev=>[...prev,...new]); setPageInfo(newPI); return; }
      } catch (e) {}

      // 3) slugIn
      try {
        const { data } = await client.query({
          query: GET_CATEGORY_POSTS_BY_SLUGIN,
          variables: { slugIn: [slug], first: PAGE_SIZE, after: pageInfo.endCursor },
          fetchPolicy: 'network-only'
        });
        const new = data?.categories?.nodes?.[0]?.posts?.nodes ?? [];
        const newPI = data?.categories?.nodes?.[0]?.posts?.pageInfo ?? { endCursor: null, hasNextPage: false };
        if (new.length) { setPosts(prev=>[...prev,...new]); setPageInfo(newPI); return; }
      } catch (e) {}

    } catch(err) {
      console.error('Error loadMore', err);
    } finally { setLoading(false); }
  };

  // traer TODO (loop con cursor) y activar paginado numerado
  const fetchAllAndEnablePaged = async () => {
    setLoading(true);
    try {
      let all = [...posts];
      let cursor = pageInfo?.endCursor ?? null;
      let hasNext = pageInfo?.hasNextPage ?? false;

      // si no hay ningún pageInfo (caso inicial), pedimos primero
      if (!all.length && (!cursor && !hasNext)) {
        try {
          const r = await client.query({
            query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY,
            variables: { slugs: [slug], first: PAGE_SIZE, after: null },
            fetchPolicy: 'network-only'
          });
          const nodes = r?.data?.categories?.nodes?.[0]?.posts?.nodes ?? [];
          const pi = r?.data?.categories?.nodes?.[0]?.posts?.pageInfo ?? { endCursor:null, hasNextPage:false };
          all = [...all, ...nodes];
          cursor = pi.endCursor; hasNext = pi.hasNextPage;
        } catch(e){}
      }

      // loop hasta agotar o llegar a MAX_FETCH_ALL
      let safety = 0;
      while (hasNext && all.length < MAX_FETCH_ALL && safety < 200) {
        safety++;
        // try slug_array then fallbacks for this page
        let r:any = null;
        try {
          r = await client.query({ query: GET_CATEGORY_POSTS_BY_SLUG_ARRAY, variables: { slugs: [slug], first: 50, after: cursor }, fetchPolicy: 'network-only' });
        } catch(e) {
          try { r = await client.query({ query: GET_CATEGORY_POSTS_BY_SLUG, variables: { slug, first: 50, after: cursor }, fetchPolicy: 'network-only' }); } catch(e2) {
            try { r = await client.query({ query: GET_CATEGORY_POSTS_BY_SLUGIN, variables: { slugIn: [slug], first: 50, after: cursor }, fetchPolicy: 'network-only' }); } catch(e3) { r = null; }
          }
        }
        if (!r) break;
        const nodes = r?.data?.categories?.nodes?.[0]?.posts?.nodes ?? [];
        const pi = r?.data?.categories?.nodes?.[0]?.posts?.pageInfo ?? { endCursor:null, hasNextPage:false };
        if (nodes.length) all = [...all, ...nodes];
        cursor = pi.endCursor; hasNext = pi.hasNextPage;
        hasNext = pi.hasNextPage;
        if (!hasNext) break;
      }

      // dedupe by slug
      const unique = Array.from(new Map(all.map((p:any)=>[p.slug||p.databaseId,p])).values());
      setPosts(unique);
      setUsePagedMode(true);
      setCurrentPage(1);
    } catch(err) {
      console.error('Error fetchAllAndEnablePaged', err);
    } finally { setLoading(false); }
  };

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <button onClick={() => { setUsePagedMode(false); setCurrentPage(1); }} className="px-3 py-1 rounded-lg bg-white border text-sm">Modo continuo</button>
          <button onClick={fetchAllAndEnablePaged} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm">{usePagedMode ? 'Paginado activo' : 'Activar paginado'}</button>
        </div>
        <div className="text-sm text-gray-600">{posts.length} noticias</div>
      </div>

      {/* Render del grid con posts visibles */}
      <CategoryGrid posts={visible} currentSectionSlug={slug} />

      {/* Controls */}
      <div className="mt-8 flex justify-center items-center gap-3">
        {!usePagedMode && pageInfo?.hasNextPage && (
          <button onClick={loadMore} disabled={loading} className="px-5 py-2 rounded-md bg-blue-600 text-white">{loading ? 'Cargando...' : 'Cargar más'}</button>
        )}

        {usePagedMode && (
          <nav className="flex items-center gap-2">
            <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="px-3 py-1 border rounded">Anterior</button>
            {Array.from({length: Math.min(totalPages, 12)}).map((_,i) => {
              const num = i+1;
              return (
                <button key={num} onClick={()=>setCurrentPage(num)} className={`px-3 py-1 rounded ${currentPage===num ? 'bg-blue-600 text-white' : 'bg-white'}`}>{num}</button>
              );
            })}
            <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage>=totalPages} className="px-3 py-1 border rounded">Siguiente</button>
          </nav>
        )}
      </div>
    </section>
  );
}
