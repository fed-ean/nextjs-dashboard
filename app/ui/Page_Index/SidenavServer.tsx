import { getAllCategories, getCachedPostsPage } from '../../lib/data-fetcher';
import Sidenav from './sidenav';
import type { Category, MappedPost } from '@/app/lib/definitions';

export default async function SidenavServer() {

  const [categoriesData, postsData] = await Promise.all([
    getAllCategories(),
    getCachedPostsPage(null)
  ]);

  const allCategories: Category[] = categoriesData || [];

  // ⬅️ ARREGLO: usar MappedPost en lugar de Post
  const latestPosts: MappedPost[] = postsData?.posts?.slice(0, 5) || [];

  return <Sidenav categories={allCategories} latestPosts={latestPosts} />;
}
