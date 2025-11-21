"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id?: string | number;
  slug: string;
  name: string;
};

interface NavbarProps {
  categories?: Category[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    return pathname?.includes(`/categorias/${slug}`);
  };

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link href="/">Mi Sitio</Link>
      </div>

      {/* Links */}
      <div className="flex gap-6 items-center">
        <Link
          href="/"
          className={`hover:text-yellow-400 transition ${
            pathname === "/" ? "text-yellow-400" : ""
          }`}
        >
          Inicio
        </Link>

        <Link
          href="/noticias"
          className={`hover:text-yellow-400 transition ${
            pathname?.includes("/noticias") ? "text-yellow-400" : ""
          }`}
        >
          Noticias
        </Link>

        {/* Categorías dinámicas */}
        {categories.map((cat) => (
          <Link
            key={cat.id || cat.slug}
            href={`/categorias/${cat.slug}`}
            className={`hover:text-yellow-400 transition ${
              isActive(cat.slug) ? "text-yellow-400 font-semibold" : ""
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
