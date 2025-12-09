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

  const [term, setTerm] = useState<string>(() => searchParams?.get('q') ?? '');

  useEffect(() => {
    const q = searchParams?.get('q') ?? '';
    setTerm(q);
  }, [searchParams]);

  // Debounced callback: devuelve una función, la llamamos directamente
  const debouncedSearch = useDebouncedCallback((value: string) => {
    // Creamos params a partir de los entries para evitar problemas de tipos
    const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));

    if (value && value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    const queryString = params.toString();
    const base = pathname ?? '/Noticias/buscar';
    const url = queryString ? `${base}?${queryString}` : base;

    // replace para no generar historial por cada tecla
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
          // Llamamos la función debounced directamente
          debouncedSearch(e.target.value);
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
