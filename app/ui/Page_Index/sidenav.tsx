import Link from "next/link";
import type { Category, Post } from "@/app/lib/definitions";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale/es";

interface SidenavProps {
  categories: Category[];
  latestPosts: Post[];
}

export default function SideNav({ categories, latestPosts }: SidenavProps) {
  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ─── ÚLTIMAS NOTICIAS ─── */}
      {latestPosts?.length > 0 && (
        <section className="bg-white shadow-xl px-7 py-6">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-3">
            Últimas Noticias
          </h3>

          <div className="space-y-6">
            {latestPosts.map((post) => {
              const formattedDate = post.date
                ? format(parseISO(post.date), "d 'de' MMMM, yyyy", { locale: es })
                : "";

              return (
                <article
                  key={post.databaseId}
                  className="flex items-start gap-5 pb-5 border-b last:border-b-0"
                >
                  {/* Imagen */}
                  <Link href={`/Categorias/Noticias/${post.slug}`} className="shrink-0">
                    <img
                      src={post.featuredImage?.node?.sourceUrl || "/placeholder.png"}
                      alt={`Imagen de ${post.title}`}
                      className="
                        w-24 h-24 object-cover rounded-xl
                        shadow-md border border-gray-200
                        hover:opacity-90 transition
                      "
                    />
                  </Link>

                  {/* Texto */}
                  <div className="flex flex-col">
                    <Link
                      href={`/Categorias/Noticias/${post.slug}`}
                      className="
                        text-base font-semibold text-gray-800 leading-snug
                        hover:text-blue-600 transition-colors
                      "
                    >
                      {post.title.length > 90
                        ? post.title.slice(0, 90) + "…"
                        : post.title}
                    </Link>

                    <span className="text-sm text-gray-500 mt-2">
                      {formattedDate}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── CATEGORÍAS ─── */}
      {categories?.length > 0 && (
        <section className="bg-white shadow-xl px-7 py-6">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-3">
            Categorías
          </h3>

          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/Categorias/${category.slug}`}
                  className="
                    flex justify-between items-center
                    px-4 py-3 rounded-xl
                    text-gray-700 font-medium
                    hover:text-blue-600 hover:bg-gray-50
                    transition-all
                  "
                >
                  <span>{category.name}</span>

                  {category.count != null && (
                    <span className="
                      text-xs font-bold
                      bg-gray-200 text-gray-700
                      px-3 py-1 rounded-full
                    ">
                      {category.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}
