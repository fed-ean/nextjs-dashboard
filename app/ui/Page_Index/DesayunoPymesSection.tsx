// app/ui/Page_Index/DesayunoPymesSection.tsx
'use client';

import CarouselNoticias from '@/app/ui/Page_Index/CarouselNoticias';
import { obtenerNoticiasPorCategoriaParaCarrusel } from '@/app/lib/db.ts';

// Tipado de la noticia (igual que en CarouselNoticias)
type Categoria = {
  name?: string;
  slug?: string;
};

type Noticia = {
  slug?: string;
  titulo?: string;
  title?: string;
  imagenUrl?: string;
  excerpt?: string;
  fecha?: string;
  categories?: {
    nodes?: Categoria[];
  };
  [k: string]: any;
};

export default async function DesayunoPymesSection() {
  // Llamada con categoryName incluido
  const noticiasDesayunoPymes: Noticia[] =
    await obtenerNoticiasPorCategoriaParaCarrusel({
      limit: 10,
      categoryName: "Desayuno Pymes", // <-- asegurate que db.js acepte este parámetro
    });

  if (!noticiasDesayunoPymes || noticiasDesayunoPymes.length === 0) {
    return null; // No renderizar nada si no hay noticias
  }

  return (
    <section className="container mx-auto px-4 mt-10">
      <h2 className="titillium-web-semibold p-0 text-xl font-bold mb-4">
        Desayuno Pymes
      </h2>
      <CarouselNoticias noticias={noticiasDesayunoPymes} slidesPerView={1} />
    </section>
  );
}
