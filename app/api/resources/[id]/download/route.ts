import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: resource } = await supabase
    .from("resources")
    .select("storage_path, status")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!resource?.storage_path) return NextResponse.json({ error: "Recurso no encontrado." }, { status: 404 });
  const { data, error } = await supabase.storage.from("resources").createSignedUrl(resource.storage_path, 60);
  if (error || !data) return NextResponse.json({ error: "No se pudo preparar la descarga." }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
