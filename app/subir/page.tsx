import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { UploadResourceForm } from "@/components/upload-resource-form";
import { categories, subjects, universities } from "@/data/mock";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const { user } = await requireUser();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-5xl px-5 py-12 sm:px-8">
        <div className="mb-10">
          <p className="text-sm font-black text-indigo">Subir recurso</p>
          <h1 className="editorial-heading mt-2 text-5xl">Comparte tu conocimiento.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-black/62">
            Publica documentos útiles en PDF o DOCX. Los archivos se guardan de forma privada y
            solo se entregan mediante enlaces temporales.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-black/52">
            <ShieldCheck className="size-4 text-mint" /> Sesión verificada: {user.email}
          </p>
        </div>
        <UploadResourceForm
          categories={categories.map((category) => category.name)}
          universities={universities}
          subjects={subjects}
        />
      </main>
    </>
  );
}
