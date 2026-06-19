"use client";

import { useState } from "react";
import { Flag, LoaderCircle } from "lucide-react";

export function ResourceReportForm({ resourceId }: { resourceId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const body = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/resources/${resourceId}/report`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo enviar el reporte.");
      setMessage("Reporte recibido. Lo revisaremos cuanto antes.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar el reporte.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-5 border-t border-black/8 pt-5">
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 text-sm font-black text-black/58 transition-colors hover:text-carbon">
        <Flag className="size-4" />
        Reportar contenido
      </button>
      {open ? (
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <select name="reason" required className="h-11 rounded-klas border border-black/10 bg-fog px-3 text-sm font-bold outline-none focus:border-indigo/50">
            <option value="">Motivo</option>
            <option value="copyright">Derechos de autor</option>
            <option value="privacy">Datos personales</option>
            <option value="illegal">Contenido ilicito</option>
            <option value="spam">Spam o abuso</option>
            <option value="quality">Calidad o categoria incorrecta</option>
            <option value="other">Otro</option>
          </select>
          <input name="reporterEmail" type="email" placeholder="Email de contacto" className="h-11 rounded-klas border border-black/10 bg-fog px-3 text-sm font-bold outline-none focus:border-indigo/50" />
          <textarea name="details" required minLength={20} maxLength={2000} placeholder="Explica que ocurre y, si aplica, quien es el titular afectado." className="min-h-28 rounded-klas border border-black/10 bg-fog px-3 py-3 text-sm font-medium outline-none focus:border-indigo/50" />
          <button disabled={pending} className="inline-flex h-11 items-center justify-center gap-2 rounded-klas bg-carbon px-4 text-sm font-black text-white disabled:opacity-50">
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Flag className="size-4" />}
            Enviar reporte
          </button>
          {message ? <p className="text-sm font-bold text-black/62">{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
