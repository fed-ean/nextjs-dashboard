// app/Categorias/[slug]/page.tsx

import CategoryPagination from "@/app/ui/categorias/CategoryPagination";
import { getCachedPostsPage } from "@/app/lib/data-fetcher";

const PER_PAGE = 9;

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
};

export default async function CategoriaPage({ params, searchParams }: Props) {
  const slug = params.slug;
  const page = Number(searchParams.page ?? 1);

  const { posts, totalPages } = await getCachedPostsPage(slug, page, PER_PAGE);

  return (
    <div className="container">
      {posts.length === 0 ? (
        <p>No hay publicaciones</p>
      ) : (
        <div>
          {/* LISTADO */}
          {posts.map((p) => (
            <div key={p.slug}>{p.title}</div>
          ))}
        </div>
      )}

      <CategoryPagination
        basePath={`/Categorias/${slug}`}
        current={page}
        totalPages={totalPages}
      />
    </div>
  );
}
