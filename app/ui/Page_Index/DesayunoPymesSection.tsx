// app/ui/Page_Index/DesayunoPymesSection.tsx

// CORRECCIÓN: Se eliminó "use client";. 
// Este componente debe ser un Server Component para poder usar async/await y obtener datos del servidor.

import CarouselNoticias from './CarouselNoticias';
import { obtenerNoticiasPorCategoriaParaCarrusel, Noticia } from '@/app/lib/db';

export default async function DesayunoPymesSection() {
  const noticiasDesayunoPymes: Noticia[] =
    await obtenerNoticiasPorCategoriaParaCarrusel({
      limit: 10,
      categoryName: "Desayuno Pymes", // El nombre de la categoría que se buscará
    });

  // Si no hay noticias, no se muestra nada. Esto evita errores si la categoría no tiene posts.
  if (!noticiasDesayunoPymes || noticiasDesayunoPymes.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 mt-10">
      <h2 className="titillium-web-semibold p-0">Desayuno Pymes</h2>
      <CarouselNoticias noticias={noticiasDesayunoPymes} slidesPerView={1} />
    </section>
  );
}
