// app/ui/Page_Index/ultimas-noticias-loader.tsx
import { fetchLatestInvoices } from '@/app/lib/data';
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
  // Fetch the data using the correct function
  const latestInvoices = await fetchLatestInvoices();

  // Adapt the fetched data to the Noticia type
  const ultimasNoticias: Noticia[] = latestInvoices.map(invoice => ({
    id: invoice.id,
    titulo: invoice.name, // Map name to titulo
    imagenUrl: invoice.image_url, // Map image_url to imagenUrl
    // You can add other fields here if needed, like a formatted date
  }));

  // It just fetches and renders the data presentation component
  return <UltimasNoticiasSidenav noticias={ultimasNoticias} />;
}
