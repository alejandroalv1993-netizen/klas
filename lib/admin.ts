import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";

export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredAdmin(email?: string | null) {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

export async function requireAdmin() {
  const session = await requireUser();
  if (!isConfiguredAdmin(session.user.email)) notFound();
  return session;
}
