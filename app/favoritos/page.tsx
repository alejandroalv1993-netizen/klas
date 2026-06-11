import { Heart } from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { SiteHeader } from "@/components/site-header";
import { resources } from "@/data/mock";

export default function FavoritesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-8">
        <div className="mb-8">
          <Heart className="size-8 text-indigo" />
          <h1 className="mt-4 text-5xl font-black">Favoritos</h1>
          <p className="mt-3 text-lg text-black/58">Recursos guardados para volver a estudiar cuando los necesites.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {resources.slice(1, 5).map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>
      </main>
    </>
  );
}
