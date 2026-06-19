import Link from "next/link";
import { Download, FileText, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { requireUser } from "@/lib/auth";
import { formatNumber } from "@/lib/utils";
import { AccountPrivacyControls } from "@/components/account-privacy-controls";

export const dynamic = "force-dynamic";

type UserResource = {
  id: string;
  title: string;
  slug: string;
  file_type: string;
  downloads_count: number;
  rating_average: number;
  status: string;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  pending_review: "En revision",
  published: "Publicado",
  rejected: "Rechazado"
};

export default async function ProfilePage({ searchParams }: { searchParams?: Promise<{ uploaded?: string }> }) {
  const { user, supabase } = await requireUser();
  const params = searchParams ? await searchParams : {};
  const [{ data: profile }, { data }] = await Promise.all([
    supabase.from("profiles").select("full_name, created_at").eq("id", user.id).single(),
    supabase
      .from("resources")
      .select("id,title,slug,file_type,downloads_count,rating_average,status,created_at")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
  ]);
  const resources = (data ?? []) as UserResource[];
  const totalDownloads = resources.reduce((total, resource) => total + resource.downloads_count, 0);
  const rated = resources.filter((resource) => resource.rating_average > 0);
  const averageRating = rated.length
    ? rated.reduce((total, resource) => total + Number(resource.rating_average), 0) / rated.length
    : 0;
  const name = profile?.full_name || user.email?.split("@")[0] || "Estudiante";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-8">
        <section className="border-b border-black/10 pb-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="flex items-center gap-5">
              <div className="grid size-20 place-items-center rounded-full bg-carbon text-2xl font-black text-white">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="editorial-heading text-5xl">{name}</h1>
                <p className="mt-1 text-black/58">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={FileText} value={String(resources.length)} label="Subidas" />
              <Stat icon={Download} value={formatNumber(totalDownloads)} label="Descargas" />
              <Stat icon={Star} value={averageRating ? averageRating.toFixed(1) : "-"} label="Rating" />
            </div>
          </div>
        </section>

        {params.uploaded === "pending" ? (
          <div className="mt-8 rounded-klas border border-indigo/20 bg-indigo/5 p-4 text-sm font-bold text-carbon">
            Recurso recibido. Lo revisaremos antes de publicarlo para reducir riesgos de derechos de autor, privacidad y abuso.
          </div>
        ) : null}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Tus recursos</h2>
            <Link href="/subir" className="text-sm font-black text-indigo">Subir uno nuevo</Link>
          </div>
          {resources.length ? (
            <div className="divide-y divide-black/8 border-y border-black/8">
              {resources.map((resource) => <ResourceRow key={resource.id} resource={resource} />)}
            </div>
          ) : (
            <div className="border-y border-black/8 py-16 text-center">
              <p className="text-lg font-black">Aun no has publicado recursos.</p>
              <Link href="/subir" className="mt-3 inline-block text-sm font-black text-indigo">Publicar el primero</Link>
            </div>
          )}
        </section>
        <AccountPrivacyControls />
      </main>
    </>
  );
}

function ResourceRow({ resource }: { resource: UserResource }) {
  const content = (
    <>
      <div>
        <p className="font-black">{resource.title}</p>
        <p className="mt-1 text-sm text-black/48">{resource.file_type.toUpperCase()} · {statusLabels[resource.status] ?? resource.status}</p>
      </div>
      <p className="text-sm font-bold text-black/55">{formatNumber(resource.downloads_count)} descargas</p>
      <p className="text-sm font-bold text-black/55">{Number(resource.rating_average).toFixed(1)}/5</p>
    </>
  );

  if (resource.status !== "published") {
    return <div className="grid gap-3 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">{content}</div>;
  }

  return <Link href={`/recursos/${resource.slug}`} className="grid gap-3 py-5 transition-opacity hover:opacity-60 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">{content}</Link>;
}

function Stat({ icon: Icon, value, label }: { icon: typeof FileText; value: string; label: string }) {
  return (
    <div className="min-w-24 border-l border-black/10 px-4">
      <Icon className="size-4 text-indigo" />
      <p className="mt-3 text-xl font-black">{value}</p>
      <p className="text-xs font-bold text-black/50">{label}</p>
    </div>
  );
}
