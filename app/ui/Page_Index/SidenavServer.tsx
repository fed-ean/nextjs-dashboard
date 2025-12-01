import { getAllCategories, getCachedPostsPage } from '../../lib/data-fetcher';
import Sidenav from './sidenav';
import type { Post, Category } from '@/app/lib/definitions';

// Este componente se encarga de obtener los datos del servidor
export default async function SidenavServer() {
  
  // Obtenemos categorías y posts simultáneamente
  const [categoriesData, postsData] = await Promise.all([
    getAllCategories(),
    getCachedPostsPage(1, undefined) // Página 1, sin categoría → últimos posts
  ]);

  // Aseguramos que los datos no sean nulos
  const allCategories: Category[] = categoriesData || [];
  const latestPosts: Post[] = postsData?.posts?.slice(0, 5) || [];

  // Renderizamos el componente de UI (`Sidenav`) y le pasamos los datos como props
  return <Sidenav categories={allCategories} latestPosts={latestPosts} />;
}
