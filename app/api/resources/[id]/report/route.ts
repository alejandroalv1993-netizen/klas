import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const reportReasons = new Set([
  "copyright",
  "privacy",
  "illegal",
  "spam",
  "quality",
  "other"
]);

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const formData = await request.formData();
  const reason = field(formData, "reason");
  const details = field(formData, "details");
  const reporterEmail = field(formData, "reporterEmail");

  if (!reportReasons.has(reason)) return NextResponse.json({ error: "Selecciona un motivo valido." }, { status: 400 });
  if (details.length < 20 || details.length > 2000) return NextResponse.json({ error: "Describe el problema con entre 20 y 2000 caracteres." }, { status: 400 });
  if (!user && !reporterEmail) return NextResponse.json({ error: "Indica un email de contacto o inicia sesion." }, { status: 400 });

  const { error } = await supabase.from("resource_reports").insert({
    resource_id: id,
    reporter_id: user?.id ?? null,
    reporter_email: reporterEmail || user?.email || null,
    reason,
    details
  });

  if (error) return NextResponse.json({ error: "No se pudo registrar el reporte. Aplica la migracion de moderacion si aun no lo has hecho." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
