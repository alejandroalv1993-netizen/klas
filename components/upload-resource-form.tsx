"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, FileUp, LoaderCircle, ShieldCheck, Upload, X } from "lucide-react";
import { ACCEPTED_RESOURCE_TYPES, MAX_RESOURCE_SIZE } from "@/lib/file-validation";

export function UploadResourceForm({ categories, universities, subjects }: {
  categories: string[];
  universities: string[];
  subjects: string[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [ownershipType, setOwnershipType] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!file) return setError("Selecciona un PDF o DOCX.");
    if (file.size > MAX_RESOURCE_SIZE) return setError("El archivo supera los 25 MB.");

    setPending(true);
    const body = new FormData(event.currentTarget);
    body.set("file", file);
    try {
      const response = await fetch("/api/resources", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo enviar el recurso.");
      router.push("/perfil?uploaded=pending");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo enviar el recurso.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 rounded-klas border border-black/8 bg-white p-6 shadow-soft">
      <div className="grid gap-6 md:grid-cols-2">
        <Field name="title" label="Titulo del recurso" placeholder="Ej. Introduccion al Marketing Digital" minLength={5} maxLength={140} />
        <Select name="category" label="Categoria" items={categories} />
        <Select name="university" label="Universidad" items={universities} />
        <Select name="subject" label="Asignatura" items={subjects} />
      </div>

      <label className="space-y-2">
        <span className="text-sm font-black">Descripcion</span>
        <textarea name="description" required minLength={20} maxLength={2000} className="min-h-32 w-full resize-y rounded-klas border border-black/10 bg-fog px-4 py-3 text-sm font-medium outline-none focus:border-indigo/50" placeholder="Resume que contiene, para quien sirve y como esta organizado." />
      </label>

      <div className="grid gap-6 border-y border-black/8 py-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-black">Origen legal</span>
          <select name="ownershipType" required value={ownershipType} onChange={(event) => setOwnershipType(event.target.value)} className="h-12 w-full rounded-klas border border-black/10 bg-fog px-4 text-sm font-medium outline-none focus:border-indigo/50">
            <option value="">Selecciona una opcion</option>
            <option value="own_work">Lo he creado yo</option>
            <option value="licensed">Tiene licencia reutilizable</option>
            <option value="public_domain">Dominio publico</option>
            <option value="permission">Tengo permiso del titular</option>
          </select>
        </label>
        <Field name="sourceTitle" label="Fuente o titular" placeholder="Ej. apuntes propios, licencia CC BY, autor..." required={ownershipType === "licensed" || ownershipType === "permission"} maxLength={180} />
        <Field name="licenseName" label="Licencia" placeholder="Ej. CC BY 4.0, dominio publico, permiso escrito" maxLength={120} />
        <Field name="sourceUrl" label="URL de referencia" placeholder="https://..." type="url" maxLength={300} />
      </div>

      <label className="grid min-h-64 cursor-pointer place-items-center rounded-klas border border-dashed border-black/18 bg-fog p-8 text-center transition-colors hover:border-indigo/50">
        <input ref={fileRef} type="file" accept={ACCEPTED_RESOURCE_TYPES} className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        {file ? (
          <div>
            <FileCheck2 className="mx-auto size-10 text-mint" />
            <p className="mt-4 font-black">{file.name}</p>
            <p className="mt-1 text-sm text-black/55">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button type="button" onClick={(event) => { event.preventDefault(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-red-700"><X className="size-4" /> Quitar archivo</button>
          </div>
        ) : (
          <div>
            <FileUp className="mx-auto size-10 text-indigo" />
            <p className="mt-4 text-xl font-black">Arrastra un PDF o DOCX, o haz clic para seleccionarlo</p>
            <p className="mt-2 text-sm text-black/55">Maximo 25 MB. El archivo se valida antes de enviarse a revision.</p>
          </div>
        )}
      </label>

      <div className="flex gap-3 rounded-klas border border-black/8 bg-fog p-4 text-sm leading-6 text-black/68">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-indigo" />
        <p>Los documentos pasan a revision antes de publicarse. KLAS puede bloquear contenido con indicios de infraccion, datos personales de terceros o material no autorizado.</p>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-black/68">
        <input required type="checkbox" name="rightsConfirmed" className="mt-1 size-4 accent-carbon" />
        <span>Confirmo que tengo derecho a compartir este documento y que no contiene datos personales de terceros, contenido ilicito ni material protegido sin autorizacion.</span>
      </label>
      {error ? <p role="alert" className="text-sm font-black text-red-700">{error}</p> : null}
      <div className="flex justify-end border-t border-black/8 pt-6">
        <button disabled={pending} className="inline-flex h-12 items-center gap-3 rounded-klas bg-carbon px-5 text-sm font-black text-white disabled:opacity-50">
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {pending ? "Enviando..." : "Enviar a revision"}
        </button>
      </div>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return <label className="space-y-2"><span className="text-sm font-black">{label}</span><input className="h-12 w-full rounded-klas border border-black/10 bg-fog px-4 text-sm font-medium outline-none focus:border-indigo/50" {...inputProps} /></label>;
}

function Select({ name, label, items }: { name: string; label: string; items: string[] }) {
  return <label className="space-y-2"><span className="text-sm font-black">{label}</span><select name={name} required className="h-12 w-full rounded-klas border border-black/10 bg-fog px-4 text-sm font-medium outline-none focus:border-indigo/50"><option value="">Selecciona una opcion</option>{items.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}
