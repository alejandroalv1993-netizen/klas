"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";

type ModerationDecisionFormProps = {
  resourceId: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function ModerationDecisionForm({ resourceId, action }: ModerationDecisionFormProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);

  return (
    <form
      action={action}
      className={`mt-4 grid gap-3 border-t border-black/10 pt-4 transition-all duration-200 ${
        decision === "approve" ? "scale-[0.99] bg-mint/5" : decision === "reject" ? "scale-[0.99] bg-red-50/70" : ""
      }`}
    >
      <input type="hidden" name="resourceId" value={resourceId} />
      <textarea
        name="notes"
        maxLength={1200}
        placeholder="Notas internas de revision"
        className="min-h-24 rounded-klas border border-black/10 bg-white px-3 py-3 text-sm font-medium outline-none transition-colors focus:border-indigo/50"
      />
      <label className="flex items-start gap-2 text-xs font-bold leading-5 text-black/62">
        <input type="checkbox" name="blockHash" className="mt-1 size-4 accent-carbon" />
        Bloquear re-subida del mismo archivo si se rechaza.
      </label>
      <div className="grid grid-cols-2 gap-2">
        <DecisionButton decision="approve" activeDecision={decision} onChoose={setDecision} />
        <DecisionButton decision="reject" activeDecision={decision} onChoose={setDecision} />
      </div>
      {decision ? (
        <p className="text-xs font-black text-black/52" aria-live="polite">
          {decision === "approve" ? "Publicando recurso..." : "Rechazando recurso..."}
        </p>
      ) : null}
    </form>
  );
}

function DecisionButton({
  decision,
  activeDecision,
  onChoose
}: {
  decision: "approve" | "reject";
  activeDecision: "approve" | "reject" | null;
  onChoose: (decision: "approve" | "reject") => void;
}) {
  const { pending } = useFormStatus();
  const isActive = pending && activeDecision === decision;
  const Icon = decision === "approve" ? CheckCircle2 : XCircle;
  const label = decision === "approve" ? "Aprobar" : "Rechazar";
  const pendingLabel = decision === "approve" ? "Aprobando" : "Rechazando";
  const classes = decision === "approve"
    ? "bg-mint text-white hover:bg-mint/90"
    : "bg-carbon text-white hover:bg-red-950";

  return (
    <button
      name="decision"
      value={decision}
      disabled={pending}
      onClick={() => onChoose(decision)}
      className={`relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-klas px-4 text-sm font-black transition-all duration-200 disabled:cursor-wait disabled:opacity-80 ${classes} ${
        isActive ? "translate-y-0.5 shadow-inner" : "hover:-translate-y-0.5"
      }`}
    >
      <span className={`absolute inset-0 origin-left bg-white/18 transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0"}`} />
      {isActive ? <LoaderCircle className="relative size-4 animate-spin" /> : <Icon className="relative size-4 transition-transform duration-200 group-hover:scale-105" />}
      <span className="relative">{isActive ? pendingLabel : label}</span>
    </button>
  );
}
