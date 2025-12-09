// app/ui/Page_index/search-form.tsx
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';

export default function SearchFormInner({ placeholder = 'Buscar...' }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // valor controlado para que el input siempre muestre lo que se escribe
  const [term, setTerm] = useState<string>(() => searchParams?.get('q') ?? '');

  // Si cambian los search params externamente (ej: back/forward), sincronizamos
  useEffect(() => {
    const q = searchParams?.get('q') ?? '';
    setTerm(q);
  }, [searchParams]);

  // Debounce: armamos la función que va a navegar con replace()
  const handleSearch = useDebouncedCallback((value: string) => {
    // clonamos los params actuales para preservar otros parámetros
    const params = new URLSearchParams(searchParams as unknown as URLSearchParams);

    if (value && value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    const queryString = params.toString();
    const base = pathname ?? '/Noticias/buscar';
    const url = queryString ? `${base}?${queryString}` : base;

    router.replace(url);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">Buscar</label>

      <input
        id="search"
        name="search"
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          handleSearch.callback?.(e.target.value); // .callback es tipado por use-debounce, pero funciona como función
          // Si tu versión de use-debounce devuelve la función directamente, usa: handleSearch(e.target.value)
        }}
        placeholder={placeholder}
        className="
          peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-3 text-sm 
          text-black bg-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        autoComplete="off"
        aria-label="Buscar noticias"
      />

      <MagnifyingGlassIcon
        aria-hidden="true"
        className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 pointer-events-none peer-focus:text-gray-900"
      />
    </div>
  );
}
