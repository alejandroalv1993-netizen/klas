import { Filter, SlidersHorizontal } from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { SearchBar } from "@/components/search-bar";
import { SiteHeader } from "@/components/site-header";
import { categories, resources, subjects, universities } from "@/data/mock";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = params.q?.toLowerCase() ?? "";
  const filtered = resources.filter((resource) =>
    [resource.title, resource.description, resource.category, resource.subject, resource.university]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-klas border border-black/8 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5" />
                <h1 className="text-lg font-black">Filtros</h1>
              </div>
              <FilterGroup title="Categoría" items={categories.map((category) => category.name)} />
              <FilterGroup title="Asignatura" items={subjects.slice(0, 6)} />
              <FilterGroup title="Universidad" items={universities.slice(0, 5)} />
            </div>
          </aside>
          <section>
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo">Explorar recursos</p>
              <h2 className="mt-2 text-5xl font-black tracking-normal">Encuentra lo que necesitas.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-black/62">
                Busca por tema, universidad, asignatura o categoría. Todos los documentos son
                gratuitos y sin publicidad dentro del PDF.
              </p>
              <div className="mt-7">
                <SearchBar large />
              </div>
            </div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-bold text-black/58">{filtered.length} recursos encontrados</p>
              <button className="inline-flex items-center gap-2 rounded-klas border border-black/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
                <Filter className="size-4" />
                Más recientes
              </button>
            </div>
            {filtered.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} index={index} />
                ))}
              </div>
            ) : (
              <div className="grid min-h-80 place-items-center rounded-klas border border-dashed border-black/16 bg-white p-8 text-center">
                <div>
                  <p className="text-2xl font-black">No hay resultados todavía.</p>
                  <p className="mt-2 text-black/58">Prueba con otra búsqueda o sube el primer recurso sobre este tema.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function FilterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6 border-t border-black/8 pt-5">
      <p className="mb-3 text-sm font-black">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-black/64">
            <input type="checkbox" className="size-4 rounded border-black/20 accent-carbon" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}
