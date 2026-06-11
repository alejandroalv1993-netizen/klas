"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, FileUp, LoaderCircle, Upload, X } from "lucide-react";
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
      if (!response.ok) throw new Error(result.error ?? "No se pudo publicar el recurso.");
      router.push(`/recursos/${result.resource.slug}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo publicar el recurso.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 rounded-klas border border-black/8 bg-white p-6 shadow-soft">
      <div className="grid gap-6 md:grid-cols-2">
        <Field name="title" label="Título del recurso" placeholder="Ej. Introducción al Marketing Digital" minLength={5} maxLength={140} />
        <Select name="category" label="Categoría" items={categories} />
        <Select name="university" label="Universidad" items={universities} />
        <Select name="subject" label="Asignatura" items={subjects} />
      </div>
      <label className="space-y-2">
        <span className="text-sm font-black">Descripción</span>
        <textarea name="description" required minLength={20} maxLength={2000} className="min-h-32 w-full resize-y rounded-klas border border-black/10 bg-fog px-4 py-3 text-sm font-medium outline-none focus:border-indigo/50" placeholder="Resume qué contiene, para quién sirve y cómo está organizado." />
      </label>
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
            <p className="mt-2 text-sm text-black/55">Máximo 25 MB. El archivo se valida antes de publicarse.</p>
          </div>
        )}
      </label>
      {error ? <p role="alert" className="text-sm font-black text-red-700">{error}</p> : null}
      <div className="flex justify-end border-t border-black/8 pt-6">
        <button disabled={pending} className="inline-flex h-12 items-center gap-3 rounded-klas bg-carbon px-5 text-sm font-black text-white disabled:opacity-50">
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {pending ? "Publicando..." : "Publicar recurso"}
        </button>
      </div>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return <label className="space-y-2"><span className="text-sm font-black">{label}</span><input required className="h-12 w-full rounded-klas border border-black/10 bg-fog px-4 text-sm font-medium outline-none focus:border-indigo/50" {...inputProps} /></label>;
}

function Select({ name, label, items }: { name: string; label: string; items: string[] }) {
  return <label className="space-y-2"><span className="text-sm font-black">{label}</span><select name={name} required className="h-12 w-full rounded-klas border border-black/10 bg-fog px-4 text-sm font-medium outline-none focus:border-indigo/50"><option value="">Selecciona una opción</option>{items.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}
