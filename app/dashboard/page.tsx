import { Bell, ChevronDown, CheckCircle2, FileText, ShieldCheck, Upload } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { MotionDiv } from "@/components/motion";
import { ResourceCard } from "@/components/resource-card";
import { SearchBar } from "@/components/search-bar";
import { KlasButton } from "@/components/ui/button";
import { categories, resources, universities } from "@/data/mock";

const betaSteps = [
  { icon: Upload, value: "Subida", label: "PDF/DOCX desde el flujo real" },
  { icon: ShieldCheck, value: "Revision", label: "Moderacion antes de publicar" },
  { icon: CheckCircle2, value: "Beta", label: "Recursos reales en preparacion" }
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#fbfbfa]">
      <AppSidebar />
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between gap-4">
            <SearchBar />
            <div className="hidden items-center gap-5 md:flex">
              <KlasButton href="/subir" icon={<Upload className="size-4" />} className="h-11">
                Subir recurso
              </KlasButton>
              <Bell className="size-5" />
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-carbon text-sm font-black text-white">A</div>
                <span className="text-sm font-bold">Alejandro</span>
                <ChevronDown className="size-4" />
              </div>
            </div>
          </header>

          <section className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_340px]">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="relative overflow-hidden rounded-klas border border-black/8 bg-white p-8 shadow-soft"
            >
              <div className="absolute right-10 top-4 hidden text-[15rem] font-black leading-none text-black/[0.035] lg:block">
                K
              </div>
              <div className="relative max-w-2xl">
                <h1 className="text-5xl font-black leading-tight sm:text-6xl">Conocimiento sin limites.</h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-black/62">
                  La beta se centra en recursos reales, moderacion clara y documentos limpios antes de abrir volumen.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <KlasButton href="/explorar">Explorar recursos</KlasButton>
                  <KlasButton href="/subir" variant="light" icon={<Upload className="size-4" />}>
                    Subir recurso
                  </KlasButton>
                </div>
              </div>
            </MotionDiv>
            <aside className="space-y-4">
              <Panel title="Estado beta">
                {betaSteps.map((step) => (
                  <Metric key={step.label} icon={step.icon} value={step.value} label={step.label} />
                ))}
              </Panel>
            </aside>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="rounded-klas border border-black/8 bg-white p-5 shadow-sm">
                  <Icon className={`size-6 ${category.color}`} />
                  <p className="mt-3 font-black">{category.name}</p>
                  <p className="text-sm text-black/55">Coleccion inicial en preparacion</p>
                </div>
              );
            })}
          </section>

          <section className="mt-10 grid gap-8 xl:grid-cols-[1fr_340px]">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black">Recursos destacados</h2>
                <a href="/explorar" className="text-sm font-bold text-black/58 hover:text-indigo">
                  Ver todos
                </a>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {resources.slice(0, 3).map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} index={index} />
                ))}
              </div>

              <div className="mt-10">
                <h2 className="mb-5 text-2xl font-black">Explora por universidad</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {universities.slice(0, 6).map((university) => (
                    <div key={university} className="rounded-klas border border-black/8 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft">
                      <p className="font-black leading-snug">{university}</p>
                      <p className="mt-2 text-sm text-black/55">Filtro disponible para recursos revisados</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <Panel title="Tareas de lanzamiento">
                {[
                  "Subir recursos reales",
                  "Aprobarlos desde owner",
                  "Revisar rutas publicas",
                  "Pulir microinteracciones"
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-black/5 text-xs font-black text-black/48">{index + 1}</span>
                    <p className="text-sm font-black">{item}</p>
                  </div>
                ))}
              </Panel>
              <Panel title="Publicacion">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 size-5 text-indigo" />
                  <p className="text-sm font-medium leading-6 text-black/62">
                    La beta debe mostrar solo datos respaldados por recursos reales o por el estado operativo de la plataforma.
                  </p>
                </div>
              </Panel>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-klas border border-black/8 bg-white p-5 shadow-sm">
      <h2 className="mb-5 font-black">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Upload; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-klas bg-indigo/10 text-indigo">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-black">{value}</p>
        <p className="text-sm text-black/55">{label}</p>
      </div>
    </div>
  );
}
