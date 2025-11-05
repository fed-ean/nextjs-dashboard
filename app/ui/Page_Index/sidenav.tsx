import Link from 'next/link';
import { graphQLFetch } from '@/app/lib/graphQLFetch';
import { GET_ALL_CATEGORIES, GET_ALL_POSTS } from '@/app/lib/queries';

// Define interfaces for the data we're fetching
interface Category {
  databaseId: number;
  name: string;
  slug: string;
}

interface Post {
  databaseId: number;
  title: string;
  slug: string;
  date: string;
}

interface AllCategoriesData {
  categories: {
    nodes: Category[];
  };
}

interface AllPostsData {
  posts: {
    nodes: Post[];
  };
}

export default async function SideNav() {
  // Fetch categories and latest posts in parallel
  const [categoriesData, postsData] = await Promise.all([
    graphQLFetch<AllCategoriesData>({
      query: GET_ALL_CATEGORIES,
      revalidate: 60 * 60, // Revalidate every hour
    }),
    graphQLFetch<AllPostsData>({
      query: GET_ALL_POSTS,
      variables: { first: 5, after: null }, // Fetch 5 latest posts
      revalidate: 5 * 60, // Revalidate every 5 minutes
    }),
  ]);

  const categories = categoriesData?.categories?.nodes || [];
  const latestPosts = postsData?.posts?.nodes || [];

  return (
    <aside className="h-auto w-full bg-white border-r overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 mt-10">Últimas publicaciones</h2>
            <ul className="space-y-3">
              {latestPosts.map((post) => (
                <li key={post.databaseId}>
                  <Link href={`/Categorias/Noticias/${post.slug}`} className="hover:underline">
                    <p className="text-sm font-medium">{post.title}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Categorías</h2>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.databaseId}>
                  <Link href={`/Categorias/${category.slug}`} className="hover:underline">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
