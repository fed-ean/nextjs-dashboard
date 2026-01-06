// app/Categorias/[slug]/page.tsx
import React, { Suspense } from "react";
import { getCachedPostsPage } from "../../lib/data-fetcher";
import CategoryGrid from "../../ui/categorias/CategoryGrid";
import CategoryPagination from "../../ui/categorias/CategoryPagination";
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";
import SidenavComplement from "../../ui/components/SidenavComplement"; // ajusta ruta si es otra

const PER_PAGE = 10;

type Props = { params: Promise<{ slug: string }> };

export default async function CategoriaFirstPage({ params }: Props) {
  const { slug } = await params;
  const page = 1;

  let posts = [], totalPages = 1, category = null;
  try {
    const res = await getCachedPostsPage(slug, page, PER_PAGE);
    posts = res.posts ?? [];
    totalPages = Math.max(1, Number(res.totalPages ?? 1));
    category = res.category ?? null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[CategoriaFirstPage] fetch error', { slug, err });
    return <div className="max-w-5xl mx-auto px-4 py-10 text-center">Error al generar la categoría</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-6">{category?.name ?? slug}</h1>
        <p className="text-gray-500">No hay publicaciones en esta categoría.</p>
      </div>
    );
  }

  return (
  <div className="w-full max-w-[1600px] px-1 py-8">
    <div
      className="
        grid
        grid-cols-1
        w-full
        lg:grid-cols-[330px_220px_1fr]
      "
    >
      {/* SIDENAV — IZQUIERDA */}
      <aside className="order-2 lg:order-1">
        <div className="sticky top-24">
          <Suspense fallback={<div className="p-4 text-sm text-gray-500">Cargando menú…</div>}>
            <SidenavServer />
          </Suspense>
        </div>
      </aside>

      {/* COLUMNA CENTRAL — SPONSORS */}
      <aside className="order-3 lg:order-2 hidden md:block">
        <SidenavComplement
          className="w-full"
          socialLinks={[
            { type: "facebook", href: "https://www.facebook.com", label: "Facebook" },
            { type: "twitter", href: "https://twitter.com", label: "Twitter" },
            { type: "instagram", href: "https://instagram.com", label: "Instagram" },
            { type: "email", href: "mailto:info@radioempresarial.com", label: "Email" },
          ]}
          sponsors={[
                { image: "/sponsor/argennova.jpg", alt: "Argennova", href: "#" },
                { image: "/sponsor/argennova2.jpg", alt: "Argennova2", href: "#" },
                { image: "/sponsor/argennovaoficial.jpg", alt: "Argennovaoficial", href: "#" },
                { image: "/sponsor/berisys.jpg", alt: "Berisys", href: "#" },
                { image: "/sponsor/berisys2.jpg", alt: "Berisys2", href: "#" },
                { image: "/sponsor/bethedrive.jpg", alt: "Bethedrive", href: "#" },
                { image: "/sponsor/bethedrive2.jpg", alt: "Bethedrive2", href: "#" },
                { image: "/sponsor/bisenergia.jpg", alt: "Bisenergia", href: "#" },
                { image: "/sponsor/bolsasecologicas.jpg", alt: "Bolsasecologicas", href: "#" },
                { image: "/sponsor/bolsasecologicas2.jpg", alt: "Bolsasecologicas2", href: "#" },
                { image: "/sponsor/dag.jpg", alt: "Dag", href: "#" },
                { image: "/sponsor/ecoenergia.jpg", alt: "Ecoenergia", href: "#" },
                { image: "/sponsor/ecotec.jpg", alt: "Ecotec", href: "#" },
                { image: "/sponsor/fagus.jpg", alt: "Fagus", href: "#" },
                { image: "/sponsor/gestionparque.jpg", alt: "Gestionparque", href: "#" },
                { image: "/sponsor/jlf.jpg", alt: "Jlf", href: "#" },
                { image: "/sponsor/jlf2.jpg", alt: "Jlf2", href: "#" },
                { image: "/sponsor/mccordones.jpg", alt: "Mccordones", href: "#" },
                { image: "/sponsor/metsur.jpg", alt: "Metsur", href: "#" },
                { image: "/sponsor/nittihermanos.jpg", alt: "Nittihermanos", href: "#" },
                { image: "/sponsor/palletpro.jpg", alt: "Palletpro", href: "#" },
                { image: "/sponsor/palletpro2.jpg", alt: "Palletpro2", href: "#" },
                { image: "/sponsor/rds.jpg", alt: "Rds", href: "#" },
                { image: "/sponsor/rds2.jpg", alt: "Rds2", href: "#" },
                { image: "/sponsor/rfsoluciones.jpg", alt: "Rfsoluciones", href: "#" },
                { image: "/sponsor/rfsoluciones2.jpg", alt: "Rfsoluciones2", href: "#" },
                { image: "/sponsor/santacruz.jpg", alt: "Santacruz", href: "#" },
                { image: "/sponsor/santacruz2.jpg", alt: "Santacruz2", href: "#" },
                { image: "/sponsor/selsa.jpg", alt: "Selsa", href: "#" },
                { image: "/sponsor/selsa2.jpg", alt: "Selsa2", href: "#" },
                { image: "/sponsor/selsaoficial.jpg", alt: "Selsaoficial", href: "#" },
                { image: "/sponsor/sergiogerullo.jpg", alt: "Sergiogerullo", href: "#" },
                { image: "/sponsor/shekk.jpg", alt: "Shekk", href: "#" },
                { image: "/sponsor/smartway.jpg", alt: "Smartway", href: "#" },
                { image: "/sponsor/solari.jpg", alt: "Solari", href: "#" },
                { image: "/sponsor/solari2.jpg", alt: "Solari2", href: "#" },
                { image: "/sponsor/startingpoint.jpg", alt: "Startingpoint", href: "#" },
                { image: "/sponsor/todoslossponsor.jpg", alt: "Todoslossponsor", href: "#" },
                { image: "/sponsor/torcel.jpg", alt: "Torcel", href: "#" },
                { image: "/sponsor/trabajamos.jpg", alt: "Trabajamos", href: "#" },
                { image: "/sponsor/work.jpg", alt: "Work", href: "#" },
          ]}
        />
      </aside>

      {/* NOTICIAS — DERECHA */}
      <main className="order-1 lg:order-3 w-full min-w-0 pr-0">
        <h1 className="text-3xl font-bold mb-6 px-4 lg:px-0">
          {category?.name ?? slug}
        </h1>

        <div className="p-0">
          <CategoryGrid posts={posts} currentSectionSlug={slug} />
        </div>

        <div className="mt-8">
          <Suspense fallback={<div className="text-sm text-gray-500">Cargando paginación…</div>}>
            <CategoryPagination
              basePath={`/Categorias/${slug}`}
              current={page}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </main>
    </div>
  </div>
);
}