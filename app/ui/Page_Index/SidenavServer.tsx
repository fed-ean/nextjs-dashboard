// app/ui/Page_Index/SidenavServer.tsx
import React from 'react';
import { getAllCategories, getCachedPostsPage } from '@/app/lib/data-fetcher';
import type { Category } from '@/app/lib/definitions';
import Sidenav from './sidenav';

export default async function SidenavServer() {
  // Cargar categorías y últimas noticias (1ª página)
  let categories: Category[] = [];
  let posts: any[] = [];

  try {
    categories = await getAllCategories();
  } catch (err) {
    console.error('Error getAllCategories', err);
    categories = [];
  }

  try {
    const res = await getCachedPostsPage(null, 1); // últimos posts
    posts = res.posts ?? [];
  } catch (err) {
    console.error('Error getCachedPostsPage', err);
    posts = [];
  }

  return <Sidenav categories={categories} latestPosts={posts} />;
}
