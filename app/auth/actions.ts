"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; success?: string };

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeNextPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = value(formData, "fullName");
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const website = value(formData, "website");

  if (website) return { success: "Revisa tu correo para continuar." };
  if (fullName.length < 2 || fullName.length > 80) return { error: "Introduce un nombre válido." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Introduce un email válido." };
  if (password.length < 10) return { error: "La contraseña debe tener al menos 10 caracteres." };

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? headerStore.get("origin") ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { full_name: fullName }
    }
  });

  if (error) return { error: "No se pudo crear la cuenta. Prueba de nuevo en unos minutos." };
  return { success: "Cuenta creada. Revisa tu correo para confirmar el acceso." };
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const next = value(formData, "next");

  if (!email || !password) return { error: "Completa el email y la contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email o contraseña incorrectos." };

  redirect(safeNextPath(next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
