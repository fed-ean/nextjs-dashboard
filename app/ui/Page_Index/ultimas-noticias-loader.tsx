// app/ui/Page_Index/ultimas-noticias-loader.tsx
import { obtenerNoticias } from '@/app/lib/db';
import UltimasNoticiasSidenav from './ultimas-noticias-sidenav';

type Noticia = {
  id: string;
  slug?: string;
  titulo?: string;
  title?: string;
  imagenUrl?: string;
  fecha?: string;
  [k: string]: any;
};

// This is now a pure Server Component
export default async function UltimasNoticiasLoader() {
  const ultimasNoticias: Noticia[] = await obtenerNoticias({ limit: 5 });

  // It just fetches and renders the data presentation component
  return <UltimasNoticiasSidenav noticias={ultimasNoticias} />;
}
