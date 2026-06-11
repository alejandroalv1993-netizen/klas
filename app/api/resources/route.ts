import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeFileName, slugify, validateResourceFile } from "@/lib/file-validation";

export const runtime = "nodejs";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });

    const formData = await request.formData();
    const title = field(formData, "title");
    const description = field(formData, "description");
    const category = field(formData, "category");
    const university = field(formData, "university");
    const subject = field(formData, "subject");
    const file = formData.get("file");

    if (title.length < 5 || title.length > 140) return NextResponse.json({ error: "El título debe tener entre 5 y 140 caracteres." }, { status: 400 });
    if (description.length < 20 || description.length > 2000) return NextResponse.json({ error: "La descripción debe tener entre 20 y 2000 caracteres." }, { status: 400 });
    if (!category || !university || !subject) return NextResponse.json({ error: "Completa categoría, universidad y asignatura." }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: "Selecciona un archivo." }, { status: 400 });

    const validated = await validateResourceFile(file);
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

    if (uploadError) return NextResponse.json({ error: "No se pudo guardar el archivo." }, { status: 500 });

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
        status: "published"
      })
      .select("id, slug")
      .single();

    if (insertError) {
      await supabase.storage.from("resources").remove([storagePath]);
      return NextResponse.json({ error: "No se pudo publicar el recurso." }, { status: 500 });
    }

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo procesar el archivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
