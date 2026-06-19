import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Download, FileText, Heart, Share2, Star, UserRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ResourceReportForm } from "@/components/resource-report-form";
import { KlasButton } from "@/components/ui/button";
import { resources as mockResources, type Resource } from "@/data/mock";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";

export const dynamicParams = true;

export function generateStaticParams() {
  return mockResources.map((resource) => ({ slug: resource.slug }));
}

type StoredResource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_name: string;
  university_name: string;
  subject_name: string;
  file_name: string;
  file_type: "pdf" | "docx";
  file_size: number;
  downloads_count: number;
  rating_average: number;
  created_at: string;
};

async function getStoredResource(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("resources").select("id,title,slug,description,category_name,university_name,subject_name,file_name,file_type,file_size,downloads_count,rating_average,created_at").eq("slug", slug).eq("status", "published").single();
    return data as StoredResource | null;
  } catch {
    return null;
  }
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stored = await getStoredResource(slug);
  const mock = mockResources.find((item) => item.slug === slug);
  if (!stored && !mock) notFound();

  const title = stored?.title ?? mock!.title;
  const description = stored?.description ?? mock!.description;
  const category = stored?.category_name ?? mock!.category;
  const university = stored?.university_name ?? mock!.university;
  const subject = stored?.subject_name ?? mock!.subject;
  const downloads = stored?.downloads_count ?? mock!.downloads;
  const rating = stored?.rating_average ?? mock!.rating;
  const createdAt = stored?.created_at ?? mock!.createdAt;
  const cover = mock?.coverImage;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <section>
            <div className={`relative mb-8 flex min-h-[430px] flex-col justify-between overflow-hidden rounded-klas p-10 ${cover ? "bg-carbon text-white" : "cover-paper"}`}>
              {cover ? <><Image src={cover} alt="" fill className="object-cover" /><div className="absolute inset-0 bg-black/55" /></> : null}
              <div className="relative inline-flex w-fit rounded-full bg-white/80 px-3 py-1 text-xs font-black text-carbon">
                {category}
              </div>
              <div className="relative max-w-2xl">
                <p className="mb-3 text-sm font-bold opacity-75">{subject}</p>
                <h1 className="editorial-heading text-balance text-5xl leading-none sm:text-7xl">{title}</h1>
              </div>
              {stored ? <ResourceReportForm resourceId={stored.id} /> : null}
            </div>
            <p className="text-xl leading-9 text-black/68">{description}</p>
            <h2 className="mt-10 text-2xl font-black">Información del recurso</h2>
            <ul className="mt-4 space-y-3 text-black/68">
              <li>Documento validado como {stored?.file_type.toUpperCase() ?? "PDF"}.</li>
              <li>Almacenado en un bucket privado.</li>
              <li>Descarga mediante enlace temporal firmado.</li>
              <li>Sin publicidad añadida por KLAS dentro del documento.</li>
            </ul>
          </section>
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-klas border border-black/8 bg-white p-6 shadow-soft">
              <KlasButton href={stored ? `/api/resources/${stored.id}/download` : "#"} icon={<Download className="size-4" />} className="w-full">
                Descargar {stored?.file_type.toUpperCase() ?? "PDF"}
              </KlasButton>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-klas border border-black/10 text-sm font-bold"><Heart className="size-4" /> Guardar</button>
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-klas border border-black/10 text-sm font-bold"><Share2 className="size-4" /> Compartir</button>
              </div>
              <div className="mt-7 space-y-4 border-t border-black/8 pt-6">
                <Info icon={Star} label="Valoración" value={`${rating}/5`} />
                <Info icon={Download} label="Descargas" value={formatNumber(downloads)} />
                <Info icon={FileText} label={stored ? "Archivo" : "Páginas"} value={stored ? `${(stored.file_size / 1024 / 1024).toFixed(1)} MB` : `${(mock as Resource).pages}`} />
                <Info icon={UserRound} label="Universidad" value={university} />
                <Info icon={Calendar} label="Publicado" value={new Date(createdAt).toLocaleDateString("es-ES")} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3 text-sm font-bold text-black/58"><Icon className="size-4" />{label}</div><p className="max-w-[12rem] text-right text-sm font-black">{value}</p></div>;
}
