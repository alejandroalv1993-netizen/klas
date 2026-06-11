import { AuthForm } from "@/app/auth/auth-form";
import { Logo } from "@/components/logo";

export default async function AuthPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col justify-between p-6 sm:p-10">
        <Logo compact />
        <div className="mx-auto my-16 w-full max-w-md">
          <p className="mb-3 text-sm font-black text-indigo">Tu biblioteca, siempre contigo.</p>
          <h1 className="editorial-heading text-5xl leading-none">Accede a KLAS.</h1>
          <p className="mt-5 font-medium leading-7 text-black/60">
            Guarda recursos, comparte documentos y construye tu reputación dentro de la comunidad.
          </p>
          <div className="mt-10"><AuthForm next={next} /></div>
        </div>
        <p className="text-xs font-medium text-black/42">Al continuar aceptas los términos y la política de privacidad.</p>
      </section>
      <section className="relative hidden overflow-hidden bg-carbon lg:block">
        <div className="absolute inset-0 bg-[url('/assets/section-community.png')] bg-cover bg-center opacity-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <p className="editorial-heading absolute bottom-12 left-12 max-w-xl text-5xl leading-none text-white">
          Apuntes creados por estudiantes que ya recorrieron el camino.
        </p>
      </section>
    </main>
  );
}
