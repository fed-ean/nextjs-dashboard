'use client';

import CarouselNoticias from '@/app/ui/Page_Index/CarouselNoticias';
import { Noticia, obtenerNoticiasPorCategoriaParaCarrusel } from '@/app/lib/db';

export default async function DesayunoPymesSection() {
  const noticiasDesayunoPymes: Noticia[] =
    await obtenerNoticiasPorCategoriaParaCarrusel({
      limit: 10,
      categoryName: 'Desayuno Pymes', // db.ts ya acepta categoryName
    });

  if (!noticiasDesayunoPymes || noticiasDesayunoPymes.length === 0) {
    return null; // No renderizar nada si no hay noticias
  }

  return (
    <section className="container mx-auto px-4 mt-10">
      <h2 className="titillium-web-semibold p-0">Desayuno Pymes</h2>
      <CarouselNoticias noticias={noticiasDesayunoPymes} slidesPerView={1} />
    </section>
  );
}
