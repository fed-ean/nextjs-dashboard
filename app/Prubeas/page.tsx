import NoticiaLeft from '../ui/Page_Index/noticia-left'
// Importa el nuevo componente de carrusel
import CarouselNoticias from '../ui/Page_Index/CarouselNoticias'; 
import { obtenerNoticias } from '../lib/db';

export default async function PagePrueba() {
 const noticiasRaw = await obtenerNoticias({ limit: 11 }); 

 // Noticia principal y secundarias
 const noticiaPrincipal = noticiasRaw[0] || null;
 const noticiasSecundarias = noticiasRaw.slice(1, 3) || [];
 
 // Las demás noticias que irán en el carrusel
 const noticiasParaCarrusel = noticiasRaw.slice(3); // Las noticias de la 3 en adelante

 return(
 <>
 {/* Usa el nuevo componente de carrusel y le pasa las noticias */}
 <CarouselNoticias 
            noticias={noticiasParaCarrusel} 
            slidesPerView={1} // Puedes ajustar cuántas noticias se ven a la vez (ej: 1, 2, 3)
      />
 </>
 );
}