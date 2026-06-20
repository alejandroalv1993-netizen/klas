import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, ExternalLink, FileText, Flag, Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ModerationDecisionForm } from "@/components/moderation-decision-form";
import { requireAdmin } from "@/lib/admin";
import { formatNumber } from "@/lib/utils";
import { moderateResource, resolveReport } from "./actions";

export const dynamic = "force-dynamic";

type ModerationResource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_name: string;
  university_name: string;
  subject_name: string;
  author_email: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  status: string;
  ownership_type: string | null;
  source_title: string | null;
  source_url: string | null;
  license_name: string | null;
  moderation_flags: string[] | null;
  report_count: number;
  created_at: string;
};

type ResourceReport = {
  id: string;
  resource_id: string;
  resource_title: string | null;
  reporter_email: string | null;
  reason: string;
  details: string;
  status: string;
  created_at: string;
};

const flagLabels: Record<string, string> = {
  possible_isbn: "ISBN",
  copyright_notice: "Copyright",
  exam_or_solutionary: "Examen/solucionario",
  possible_personal_data: "Datos personales",
  official_material: "Material oficial",
  possible_scan: "Escaneo",
  large_file_review: "Archivo grande"
};

const ownershipLabels: Record<string, string> = {
  own_work: "Obra propia",
  licensed: "Licencia reutilizable",
  public_domain: "Dominio publico",
  permission: "Permiso del titular"
};

export default async function ModerationPage({ searchParams }: { searchParams?: Promise<{ error?: string; updated?: string }> }) {
  const { supabase } = await requireAdmin();
  const params = searchParams ? await searchParams : {};

  const [queueResult, reportsResult] = await Promise.all([
    supabase.rpc("moderation_queue"),
    supabase.rpc("open_resource_reports")
  ]);

  const resources = (queueResult.data ?? []) as ModerationResource[];
  const reports = (reportsResult.data ?? []) as ResourceReport[];
  const signedUrls = new Map<string, string>();

  await Promise.all(resources.map(async (resource) => {
    if (!resource.storage_path) return;
    const { data } = await supabase.storage.from("resources").createSignedUrl(resource.storage_path, 300);
    if (data?.signedUrl) signedUrls.set(resource.id, data.signedUrl);
  }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 sm:px-8">
        <header className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-indigo">
              <Lock className="size-4" />
              Owner dashboard
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.02em]">Moderacion de contenidos</h1>
            <p className="mt-2 max-w-2xl text-pretty leading-7 text-black/62">
              Revisa recursos pendientes, señales de riesgo y reportes antes de que un documento quede visible para estudiantes.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Pendientes" value={resources.filter((resource) => resource.status === "pending_review").length} />
            <Metric label="Reportes" value={reports.length} />
            <Metric label="Señales" value={resources.reduce((total, resource) => total + (resource.moderation_flags?.length ?? 0), 0)} />
          </div>
        </header>

        {params.error ? (
          <div className="mt-6 flex gap-3 rounded-klas border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-900">
            <AlertTriangle className="size-5 shrink-0" />
            <p>{decodeURIComponent(params.error)}</p>
          </div>
        ) : null}
        {params.updated ? (
          <div className="mt-6 flex gap-3 rounded-klas border border-mint/25 bg-mint/10 p-4 text-sm font-bold text-carbon">
            <CheckCircle2 className="size-5 shrink-0 text-mint" />
            <p>Moderacion actualizada.</p>
          </div>
        ) : null}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">Cola de revision</h2>
            <p className="text-sm font-bold text-black/52">{resources.length} recursos</p>
          </div>
          {queueResult.error ? (
            <SetupNotice message={queueResult.error.message} />
          ) : resources.length ? (
            <div className="grid gap-4">
              {resources.map((resource) => (
                <article key={resource.id} className="rounded-klas border border-black/10 bg-white">
                  <div className="grid gap-6 p-5 lg:grid-cols-[1fr_20rem]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Status status={resource.status} />
                        <span className="text-xs font-black text-black/42">{new Date(resource.created_at).toLocaleString("es-ES")}</span>
                      </div>
                      <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.02em]">{resource.title}</h3>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/62">{resource.description}</p>
                      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                        <Fact label="Categoria" value={resource.category_name} />
                        <Fact label="Asignatura" value={resource.subject_name} />
                        <Fact label="Universidad" value={resource.university_name} />
                        <Fact label="Autor" value={resource.author_email ?? "Sin email"} />
                        <Fact label="Origen" value={ownershipLabels[resource.ownership_type ?? ""] ?? "No declarado"} />
                        <Fact label="Fuente" value={resource.source_title ?? "No indicada"} />
                        <Fact label="Licencia" value={resource.license_name ?? "No indicada"} />
                        <Fact label="Archivo" value={`${resource.file_type.toUpperCase()} · ${(resource.file_size / 1024 / 1024).toFixed(1)} MB`} />
                      </dl>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {(resource.moderation_flags ?? []).length ? resource.moderation_flags?.map((flag) => (
                          <span key={flag} className="inline-flex items-center gap-1.5 rounded-full border border-energy/25 bg-energy/10 px-3 py-1 text-xs font-black text-carbon">
                            <AlertTriangle className="size-3.5 text-energy" />
                            {flagLabels[flag] ?? flag}
                          </span>
                        )) : <span className="rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-black text-carbon">Sin señales automaticas</span>}
                        {resource.report_count ? <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-900">{resource.report_count} reportes</span> : null}
                      </div>
                    </div>

                    <div className="rounded-klas bg-fog p-4">
                      <div className="grid gap-2">
                        {signedUrls.get(resource.id) ? (
                          <a href={signedUrls.get(resource.id)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-klas bg-carbon px-4 text-sm font-black text-white">
                            <FileText className="size-4" />
                            Revisar archivo
                          </a>
                        ) : (
                          <p className="rounded-klas border border-amber-300 bg-amber-50 p-3 text-sm font-bold text-amber-950">No se pudo generar enlace firmado. Revisa la politica de Storage de moderadores.</p>
                        )}
                        {resource.source_url ? (
                          <a href={resource.source_url} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-klas border border-black/10 bg-white px-4 text-sm font-black">
                            <ExternalLink className="size-4" />
                            Ver fuente
                          </a>
                        ) : null}
                      </div>
                      <ModerationDecisionForm resourceId={resource.id} action={moderateResource} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Sin recursos pendientes" body="Cuando alguien suba un documento, aparecera aqui antes de publicarse." />
          )}
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">Reportes abiertos</h2>
            <p className="text-sm font-bold text-black/52">{reports.length} reportes</p>
          </div>
          {reportsResult.error ? (
            <SetupNotice message={reportsResult.error.message} />
          ) : reports.length ? (
            <div className="divide-y divide-black/8 rounded-klas border border-black/10 bg-white">
              {reports.map((report) => (
                <article key={report.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_18rem]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-black text-black/48">
                      <Flag className="size-4 text-energy" />
                      <span>{report.reason}</span>
                      <span>{new Date(report.created_at).toLocaleString("es-ES")}</span>
                    </div>
                    <h3 className="mt-2 font-black">{report.resource_title ?? report.resource_id}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-black/62">{report.details}</p>
                    <p className="mt-2 text-xs font-bold text-black/48">Contacto: {report.reporter_email ?? "No indicado"}</p>
                  </div>
                  <form action={resolveReport} className="grid gap-2">
                    <input type="hidden" name="reportId" value={report.id} />
                    <textarea name="notes" maxLength={1000} placeholder="Resolucion interna" className="min-h-20 rounded-klas border border-black/10 bg-fog px-3 py-3 text-sm font-medium outline-none focus:border-indigo/50" />
                    <div className="grid grid-cols-2 gap-2">
                      <button name="status" value="resolved" className="h-10 rounded-klas bg-carbon px-3 text-sm font-black text-white">Resolver</button>
                      <button name="status" value="rejected" className="h-10 rounded-klas border border-black/10 bg-white px-3 text-sm font-black">Descartar</button>
                    </div>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Sin reportes abiertos" body="Los avisos de copyright, privacidad o contenido ilicito apareceran aqui." />
          )}
        </section>
      </main>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-24 rounded-klas border border-black/10 bg-white px-4 py-3">
      <p className="text-2xl font-black">{formatNumber(value)}</p>
      <p className="text-xs font-bold text-black/52">{label}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black text-black/42">{label}</dt>
      <dd className="mt-1 truncate font-bold text-black/76">{value}</dd>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const isPending = status === "pending_review";
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${isPending ? "bg-indigo/10 text-indigo" : "bg-black/8 text-carbon"}`}>{isPending ? "Pendiente" : status}</span>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-klas border border-dashed border-black/16 bg-white px-5 py-12 text-center">
      <p className="font-black">{title}</p>
      <p className="mt-2 text-sm font-medium text-black/55">{body}</p>
    </div>
  );
}

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="rounded-klas border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-black">Falta aplicar la migracion de moderacion en Supabase.</p>
          <p className="mt-1 font-medium">{message}</p>
          <Link href="/legal/terminos" className="mt-3 inline-flex items-center gap-2 font-black underline">
            Revisar terminos
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
