import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeFileName, scanResourceSignals, slugify, validateResourceFile } from "@/lib/file-validation";

export const runtime = "nodejs";

const ownershipTypes = new Set(["own_work", "licensed", "public_domain", "permission"]);

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function supabaseErrorPayload(prefix: string, error: {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}) {
  return {
    error: `${prefix}: ${error.message ?? "Error desconocido"}`,
    code: error.code,
    details: error.details,
    hint: error.hint
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Debes iniciar sesion." }, { status: 401 });

    const formData = await request.formData();
    const title = field(formData, "title");
    const description = field(formData, "description");
    const category = field(formData, "category");
    const university = field(formData, "university");
    const subject = field(formData, "subject");
    const ownershipType = field(formData, "ownershipType");
    const sourceTitle = field(formData, "sourceTitle");
    const sourceUrl = field(formData, "sourceUrl");
    const licenseName = field(formData, "licenseName");
    const rightsConfirmed = formData.get("rightsConfirmed") === "on";
    const file = formData.get("file");

    if (title.length < 5 || title.length > 140) return NextResponse.json({ error: "El titulo debe tener entre 5 y 140 caracteres." }, { status: 400 });
    if (description.length < 20 || description.length > 2000) return NextResponse.json({ error: "La descripcion debe tener entre 20 y 2000 caracteres." }, { status: 400 });
    if (!category || !university || !subject) return NextResponse.json({ error: "Completa categoria, universidad y asignatura." }, { status: 400 });
    if (!ownershipTypes.has(ownershipType)) return NextResponse.json({ error: "Indica el origen legal del documento." }, { status: 400 });
    if ((ownershipType === "licensed" || ownershipType === "permission") && !sourceTitle) {
      return NextResponse.json({ error: "Indica la fuente o titular de la licencia/autorizacion." }, { status: 400 });
    }
    if (!rightsConfirmed) {
      return NextResponse.json({ error: "Debes confirmar que puedes compartir el documento y que no contiene datos personales de terceros sin autorizacion." }, { status: 400 });
    }
    if (!(file instanceof File)) return NextResponse.json({ error: "Selecciona un archivo." }, { status: 400 });

    const validated = await validateResourceFile(file);
    const contentHash = createHash("sha256").update(validated.bytes).digest("hex");
    const { data: blocked } = await supabase.rpc("is_file_hash_blocked", { candidate_hash: contentHash });

    if (blocked) return NextResponse.json({ error: "Este archivo no puede subirse porque fue bloqueado previamente." }, { status: 409 });

    const moderation = scanResourceSignals({ title, description, fileName: file.name, bytes: validated.bytes });
    const id = randomUUID();
    const storagePath = `${user.id}/${id}/${safeFileName(file.name)}`;
    const slug = `${slugify(title)}-${id.slice(0, 8)}`;

    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(storagePath, validated.bytes, {
        contentType: validated.contentType,
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.error("Resource upload failed", uploadError);
      return NextResponse.json(supabaseErrorPayload("No se pudo guardar el archivo", uploadError), { status: 500 });
    }

    const { data: resource, error: insertError } = await supabase
      .from("resources")
      .insert({
        id,
        title,
        slug,
        description,
        category_name: category,
        university_name: university,
        subject_name: subject,
        author_id: user.id,
        file_url: storagePath,
        storage_path: storagePath,
        file_name: file.name.slice(0, 180),
        file_type: validated.extension,
        file_size: file.size,
        content_hash: contentHash,
        ownership_type: ownershipType,
        source_title: sourceTitle || null,
        source_url: sourceUrl || null,
        license_name: licenseName || null,
        rights_confirmed_at: new Date().toISOString(),
        moderation_flags: moderation.flags,
        status: "pending_review"
      })
      .select("id, slug, status")
      .single();

    if (insertError) {
      console.error("Resource insert failed", insertError);
      await supabase.storage.from("resources").remove([storagePath]);
      return NextResponse.json(supabaseErrorPayload("No se pudo enviar el recurso a revision", insertError), { status: 500 });
    }

    return NextResponse.json({ resource, moderation: { flags: moderation.flags } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo procesar el archivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
