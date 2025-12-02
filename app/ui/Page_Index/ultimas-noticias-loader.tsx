// app/ui/Page_Index/ultimas-noticias-loader.tsx
import NoticiasVarias from "../dashboard/noticias-varias";
import type { MappedPost } from "@/app/lib/definitions";
import { getAllPosts } from "@/app/lib/data-fetcher";

export default async function UltimasNoticiasLoader() {
  try {
    const posts = await getAllPosts(); // devuelve MappedPost[]
    const latest = posts.slice(0, 3);
    if (!latest || latest.length === 0) return null;

    return <NoticiasVarias posts={latest} page={1} categoriaSlug="" categoriaNombre="Últimas" />;
  } catch (err) {
    console.error('Error UltimasNoticiasLoader', err);
    return null;
  }
}
