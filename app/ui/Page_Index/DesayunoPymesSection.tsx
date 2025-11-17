import { obtenerNoticiasPorCategoriaParaCarrusel } from '@/app/lib/db.js';
import CarouselNoticias from '@/app/ui/Page_Index/CarouselNoticias';

export default async function DesayunoPymesSection() {
  const noticiasDesayunoPymes = await obtenerNoticiasPorCategoriaParaCarrusel({ limit: 10, categoryName: "Desayuno Pymes" });

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
