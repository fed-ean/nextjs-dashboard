import { NoticiaIndividualSkeleton } from '@/app/ui/skeletons';

// Este componente de carga se mostrará automáticamente en todas las páginas de noticias individuales
// mientras los datos se están obteniendo del servidor.
export default function Loading() {
  return <NoticiaIndividualSkeleton />;
}
