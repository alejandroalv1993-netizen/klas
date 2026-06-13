import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const [profile, resources, favorites, ratings, downloads] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("resources").select("id,title,slug,description,category_name,university_name,subject_name,file_name,file_type,file_size,status,downloads_count,rating_average,created_at,updated_at").eq("author_id", user.id),
    supabase.from("favorites").select("resource_id,created_at").eq("user_id", user.id),
    supabase.from("ratings").select("resource_id,value,created_at").eq("user_id", user.id),
    supabase.from("downloads").select("resource_id,created_at").eq("user_id", user.id)
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email, created_at: user.created_at, last_sign_in_at: user.last_sign_in_at },
    profile: profile.data,
    resources: resources.data ?? [],
    favorites: favorites.data ?? [],
    ratings: ratings.data ?? [],
    downloads: downloads.data ?? []
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="klas-data-${user.id}.json"`,
      "cache-control": "no-store"
    }
  });
}
