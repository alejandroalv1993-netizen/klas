import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { data: resources } = await supabase.from("resources").select("storage_path").eq("author_id", user.id);
  const paths = (resources ?? []).map((resource) => resource.storage_path).filter(Boolean);
  if (paths.length) {
    const { error: storageError } = await supabase.storage.from("resources").remove(paths);
    if (storageError) return NextResponse.json({ error: "No se pudieron eliminar todos los archivos de la cuenta." }, { status: 500 });
  }

  const { error: deleteError } = await supabase.rpc("delete_my_account");
  if (deleteError) return NextResponse.json({ error: "No se pudo eliminar la cuenta. Aplica primero la migración RGPD en Supabase." }, { status: 500 });

  await supabase.auth.signOut({ scope: "local" });
  return NextResponse.json({ deleted: true });
}
