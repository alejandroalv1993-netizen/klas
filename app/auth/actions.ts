"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LEGAL_VERSION, legalConfigComplete } from "@/lib/legal";

export type AuthState = { error?: string; success?: string };

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeNextPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard";
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!legalConfigComplete) return { error: "El registro está temporalmente cerrado hasta completar la identificación legal del responsable." };
  const fullName = value(formData, "fullName");
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const website = value(formData, "website");
  const legalConsent = formData.get("legalConsent") === "on";

  if (website) return { success: "Revisa tu correo para continuar." };
  if (fullName.length < 2 || fullName.length > 80) return { error: "Introduce un nombre válido." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Introduce un email válido." };
  if (password.length < 10) return { error: "La contraseña debe tener al menos 10 caracteres." };
  if (!legalConsent) return { error: "Debes aceptar los términos y la política de privacidad." };

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? headerStore.get("origin") ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        legal_accepted_at: new Date().toISOString(),
        terms_version: LEGAL_VERSION,
        privacy_version: LEGAL_VERSION
      }
    }
  });

  if (error) {
    console.error("Supabase sign-up failed", { code: error.code, status: error.status });
    return { error: error.code === "over_email_send_rate_limit" ? "Se han solicitado demasiados correos. Espera unos minutos." : "No se pudo crear la cuenta. Revisa la configuración de Auth o prueba más tarde." };
  }
  return { success: "Cuenta creada. Revisa tu correo para confirmar el acceso." };
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const next = value(formData, "next");

  if (!email || !password) return { error: "Completa el email y la contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Supabase sign-in failed", { code: error.code, status: error.status });
    return { error: error.code === "email_not_confirmed" ? "Confirma tu email antes de iniciar sesión." : "Email o contraseña incorrectos." };
  }

  redirect(safeNextPath(next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
