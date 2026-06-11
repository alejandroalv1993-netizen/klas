"use client";

import { Command, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ large = false }: { large?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/explorar${value ? `?q=${encodeURIComponent(value)}` : ""}`);
      }}
      className={`group flex items-center gap-3 rounded-klas border border-black/10 bg-white/82 px-4 shadow-sm backdrop-blur-xl transition-all duration-300 focus-within:border-indigo/40 focus-within:shadow-soft ${
        large ? "h-14 w-full" : "h-12 w-full max-w-2xl"
      }`}
    >
      <Search className="size-5 text-black/55 transition-colors group-focus-within:text-indigo" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar apuntes, asignaturas, temas..."
        className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-black/38"
      />
      <div className="hidden items-center gap-1 rounded-md border border-black/10 bg-fog px-2 py-1 text-xs font-bold text-black/45 sm:flex">
        <Command className="size-3" />
        K
      </div>
    </form>
  );
}
