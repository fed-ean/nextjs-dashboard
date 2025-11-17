import { PaginaCategoriaSkeleton } from '@/app/ui/skeletons';

// Este componente de carga se mostrará automáticamente en todas las páginas de categoría
// mientras los datos se están obteniendo del servidor.
export default function Loading() {
  return <PaginaCategoriaSkeleton />;
}
