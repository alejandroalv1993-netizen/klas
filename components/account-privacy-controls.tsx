"use client";

import { useState } from "react";
import { Download, LoaderCircle, Trash2 } from "lucide-react";

export function AccountPrivacyControls() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteAccount() {
    if (!window.confirm("Esta acción elimina tu cuenta, tus recursos y sus archivos. No se puede deshacer.")) return;
    setDeleting(true);
    setError("");
    const response = await fetch("/api/account", { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "No se pudo eliminar la cuenta.");
      setDeleting(false);
      return;
    }
    window.location.assign("/");
  }

  return (
    <section className="mt-14 border-t border-black/10 pt-8">
      <h2 className="text-2xl font-black">Privacidad y cuenta</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">Descarga una copia estructurada de tus datos o elimina permanentemente la cuenta y los archivos asociados.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href="/api/account/export" className="inline-flex h-11 items-center gap-2 border border-black/14 px-4 text-sm font-black"><Download className="size-4" /> Exportar mis datos</a>
        <button type="button" onClick={deleteAccount} disabled={deleting} className="inline-flex h-11 items-center gap-2 border border-red-300 px-4 text-sm font-black text-red-800 disabled:opacity-50">
          {deleting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Eliminar mi cuenta
        </button>
      </div>
      {error ? <p role="alert" className="mt-4 text-sm font-bold text-red-700">{error}</p> : null}
    </section>
  );
}
