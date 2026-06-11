import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Download, FileText, Heart, Search, Sparkles, Star, Upload, Users } from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/motion";
import { ResourceCard } from "@/components/resource-card";
import { SearchBar } from "@/components/search-bar";
import { SiteHeader } from "@/components/site-header";
import { KlasButton } from "@/components/ui/button";
import { categories, resources } from "@/data/mock";
import { formatNumber } from "@/lib/utils";

const stats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "75.000+", label: "Estudiantes activos", icon: Users },
  { value: "250.000+", label: "Recursos compartidos", icon: FileText },
  { value: "1.2M", label: "Descargas este mes", icon: Download },
  { value: "4.8/5", label: "Valoracion media", icon: Star }
];

const benefits: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "PDFs sin anuncios", text: "El documento se mantiene limpio para estudiar sin ruido.", icon: FileText },
  { title: "Acceso abierto", text: "Recursos gratis, compartidos por estudiantes y revisados por senales de comunidad.", icon: Heart },
  { title: "Busqueda con criterio", text: "Tema, universidad, asignatura y categoria trabajan juntos desde el primer filtro.", icon: Search },
  { title: "Reputacion util", text: "Valoraciones, descargas y favoritos ayudan a elegir rapido.", icon: Star }
];

const marqueeItems = [
  "Marketing",
  "Derecho",
  "Historia",
  "Python",
  "Psicologia",
  "Universidades",
  "Oposiciones",
  "Contabilidad"
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative min-h-[calc(100svh-5.75rem)] bg-white">
          <div className="absolute inset-0 grid-paper" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
          <div className="relative mx-auto grid min-h-[calc(100svh-5.75rem)] max-w-7xl items-center gap-8 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.02fr_0.98fr]">
            <MotionDiv
              className="relative z-10 max-w-3xl"
            >
              <div className="mb-7 h-px w-36 bg-black/18" />
              <h1 className="hero-title text-balance leading-[0.88]">
                Conocimiento
                <br />
                sin l&iacute;mites.
              </h1>
              <svg
                className="mt-5 h-8 w-[min(31rem,80vw)] overflow-visible"
                viewBox="0 0 520 48"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="ink-line"
                  d="M8 26 C 78 16, 143 27, 207 21 S 337 12, 514 24"
                  stroke="#4F46E5"
                  strokeWidth="9"
                />
              </svg>
              <p className="text-pretty mt-6 max-w-[34rem] text-xl font-medium leading-9 text-black/72">
                KLAS convierte apuntes universitarios en una biblioteca cultural: recursos claros,
                descargables y sin publicidad dentro del documento.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <KlasButton href="/explorar">Explorar recursos</KlasButton>
                <KlasButton href="/subir" variant="light" icon={<Upload className="size-4" />}>
                  Subir recurso
                </KlasButton>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {["LF", "MR", "AC", "NP", "IV"].map((avatar) => (
                    <div
                      key={avatar}
                      className="grid size-10 place-items-center rounded-full border-2 border-white bg-carbon text-[10px] font-black text-white transition-transform duration-500 hover:-translate-y-1"
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-black text-energy">5 estrellas · 4.8/5</div>
                  <div className="font-medium text-black/58">De mas de 70.000 estudiantes</div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              className="relative flex min-h-[440px] items-center justify-center lg:justify-end"
            >
              <div className="hero-image-frame w-[min(31rem,88vw)]">
                <div className="hero-study-shape relative aspect-[1.06] overflow-hidden bg-fog">
                  <Image
                    src="/assets/hero-study-editorial.png"
                    alt="Materiales de estudio KLAS"
                    fill
                    priority
                    sizes="(min-width: 1024px) 31rem, 88vw"
                    className="object-cover object-[52%_48%] transition-transform duration-[1200ms] ease-out hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-indigo/10" />
                </div>
              </div>
            </MotionDiv>
          </div>
        </section>

        <section className="border-y border-black/10 bg-carbon py-4 text-white">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`} className="text-3xl font-black tracking-[-0.035em] text-white/92">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <h2 className="editorial-heading max-w-md text-4xl leading-[1.02]">
                Una plataforma para estudiar sin fricci&oacute;n.
              </h2>
              <p className="mt-5 max-w-sm text-base font-medium leading-7 text-black/62">
                La interfaz acompana el gesto principal: encontrar un recurso bueno y descargarlo sin perder tiempo.
              </p>
            </div>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {benefits.map(({ title, text, icon: Icon }, index) => (
                <MotionDiv
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group border-t border-black/12 pt-5"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-indigo transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                    <h3 className="text-lg font-black">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-7 text-black/62">{text}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-carbon px-5 py-10 text-white sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }, index) => (
              <MotionDiv
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.045 }}
                className="border-t border-white/18 pt-5"
              >
                <Icon className="mb-6 size-6 opacity-80" />
                <div className="editorial-heading text-5xl">{value}</div>
                <div className="mt-2 text-sm font-bold text-white/62">{label}</div>
              </MotionDiv>
            ))}
          </div>
        </section>

        <MotionSection
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid items-end gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <h2 className="editorial-heading text-5xl leading-[0.98]">
                  Busca como piensas.
                </h2>
                <p className="mt-5 max-w-md text-base font-medium leading-7 text-black/62">
                  Empieza por una palabra y deja que tema, universidad y asignatura organicen el resto.
                </p>
              </div>
              <SearchBar large />
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.name} className="group rounded-klas border border-black/12 bg-white p-5 transition-colors duration-500 hover:bg-carbon hover:text-white">
                    <Icon className={`size-7 ${category.color} transition-transform duration-500 group-hover:-translate-y-1`} />
                    <p className="mt-5 font-black">{category.name}</p>
                    <p className="text-sm font-medium opacity-62">{formatNumber(category.count)} recursos</p>
                  </div>
                );
              })}
            </div>
          </div>
        </MotionSection>

        <section className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="editorial-heading text-5xl">Biblioteca viva.</h2>
                <p className="mt-3 max-w-lg font-medium leading-7 text-black/62">
                  Recursos que parecen apuntes cuidados, no archivos olvidados en una carpeta.
                </p>
              </div>
              <KlasButton href="/explorar" variant="ghost" icon={<ArrowUpRight className="size-4" />}>
                Ver recursos
              </KlasButton>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {resources.slice(0, 4).map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-carbon px-5 py-24 text-white sm:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <h2 className="editorial-heading text-5xl leading-[1]">
                Aprender tambien puede sentirse cuidado.
              </h2>
              <p className="mt-6 max-w-md text-lg font-medium leading-8 text-white/68">
                Recursos limpios, comunidad real y una experiencia pensada para que estudiar no
                parezca navegar entre archivos abandonados.
              </p>
              <p className="mt-8 text-sm font-black text-white/86">
                Lucia Fernandez · Estudiante de Derecho
              </p>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <MotionDiv
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="relative col-span-12 aspect-[1.7] overflow-hidden rounded-klas md:col-span-8"
              >
                <Image
                  src="/assets/section-community.png"
                  alt="Estudiantes compartiendo apuntes"
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-xs text-lg font-black leading-tight">
                  Comunidad que comparte antes de competir.
                </p>
              </MotionDiv>
              <MotionDiv
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="relative col-span-12 aspect-[0.86] overflow-hidden rounded-klas md:col-span-4"
              >
                <Image
                  src="/assets/section-campus.png"
                  alt="Materiales de estudio en campus"
                  fill
                  sizes="(min-width: 1024px) 26vw, 100vw"
                  className="object-cover"
                />
              </MotionDiv>
              <MotionDiv
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="relative col-span-12 aspect-[1.55] overflow-hidden rounded-klas md:col-span-7 md:-mt-24"
              >
                <Image
                  src="/assets/section-clean-pdf.png"
                  alt="Documento de estudio limpio"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/12 to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-xs text-lg font-black leading-tight">
                  PDFs limpios para leer, guardar y volver.
                </p>
              </MotionDiv>
            </div>
          </div>
        </section>

        <section className="relative px-5 py-24 text-center sm:px-8">
          <Sparkles className="mx-auto size-8 text-indigo" />
          <h2 className="editorial-heading mx-auto mt-4 max-w-3xl text-5xl leading-[1]">
            El conocimiento se comparte. El futuro se construye.
          </h2>
          <div className="mt-8">
            <KlasButton href="/explorar">Explorar recursos</KlasButton>
          </div>
        </section>
      </main>
    </>
  );
}
