"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/Noticias/buscar?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar noticias..."
        className="
          w-full px-4 py-2 rounded-lg border 
          border-gray-300 text-black 
          placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          bg-white
        "
      />
    </form>
  );
}
