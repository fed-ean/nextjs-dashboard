
import { getAllCategories, getCachedPostsPage } from '../../lib/data-fetcher';
// 1. VOLVEMOS A IMPORTAR EL SIDENAV ORIGINAL
import Sidenav from './sidenav';

// Tipos (sin cambios)
interface Post {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  [key: string]: any;
}

interface Category {
  name: string;
  slug: string;
  count: number | null;
}

// Este componente vuelve a su propósito original: obtener datos y pasarlos.
export default async function SidenavServer() {
  
  const [categoriesData, postsData] = await Promise.all([
    getAllCategories(),
    getCachedPostsPage(null) 
  ]);

  const allCategories: Category[] = categoriesData || [];
  const latestPosts: Post[] = postsData?.posts?.slice(0, 5) || [];

  // 2. RENDERIZAMOS EL SIDENAV ORIGINAL y le pasamos los datos como props.
  return <Sidenav categories={allCategories} latestPosts={latestPosts} />;
}
