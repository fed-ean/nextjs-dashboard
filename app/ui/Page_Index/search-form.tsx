// app/ui/Page_Index/search-form.tsx
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SearchFormInner({ placeholder = 'Buscar...' }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // valor controlado
  const [term, setTerm] = useState<string>(() => searchParams?.get('q') ?? '');

  // sincronizar si cambian los params por back/forward u otra navegación
  useEffect(() => {
    const q = searchParams?.get('q') ?? '';
    setTerm(q);
  }, [searchParams]);

  // debounce simple con setTimeout
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 300;

  const navigateWithParams = (value: string) => {
    // siempre vamos a /Noticias/buscar (no usamos pathname para evitar confusiones)
    const params = new URLSearchParams();

    if (value && value.trim()) {
      params.set('q', value.trim());
    }
    const qs = params.toString();
    const url = qs ? `/Noticias/buscar?${qs}` : `/Noticias/buscar`;

    // Usamos replace para no llenar el historial con cada tecla
    router.replace(url);
  };

  const scheduleNavigate = (value: string) => {
    // limpiar si hay timeout pendiente
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      navigateWithParams(value);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
  };

  // llamada inmediata (por ejemplo al presionar Enter)
  const navigateNow = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    navigateWithParams(value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigateNow(term);
      }}
      className="relative flex flex-1 flex-shrink-0 w-full max-w-md"
      role="search"
    >
      <label htmlFor="search" className="sr-only">Buscar</label>

      <input
        id="search"
        name="search"
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          scheduleNavigate(e.target.value);
        }}
        placeholder={placeholder}
        className="
          peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm 
          text-black bg-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        autoComplete="off"
        aria-label="Buscar noticias"
      />

      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md"
      >
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="h-5 w-5 text-gray-600"
        />
      </button>
    </form>
  );
}
