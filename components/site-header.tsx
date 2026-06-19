import Link from "next/link";
import { Upload } from "lucide-react";
import { Logo } from "@/components/logo";
import { KlasButton } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { isConfiguredAdmin } from "@/lib/admin";

const links = [
  ["Explorar", "/explorar"],
  ["Asignaturas", "/explorar?filter=asignaturas"],
  ["Universidades", "/explorar?filter=universidades"],
  ["Oposiciones", "/explorar?category=oposiciones"],
  ["Subir recurso", "/subir"]
];

export async function SiteHeader() {
  let userEmail: string | undefined;
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email;
    isAdmin = isConfiguredAdmin(userEmail);
  } catch {}

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-white/86 backdrop-blur-2xl">
      <div className="mx-auto flex h-[5.75rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo compact />
        <nav className="hidden items-center gap-9 text-[0.95rem] font-black text-black/82 lg:flex">
          {links.map(([label, href]) => (
            <Link key={label} href={href} className="group relative py-2 transition-colors hover:text-black">
              <span>{label}</span>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-carbon transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              {isAdmin ? <Link href="/owner/moderacion" className="hidden text-sm font-black text-indigo sm:block">Moderacion</Link> : null}
              <Link href="/perfil" className="hidden max-w-40 truncate text-sm font-black text-black/74 sm:block">{userEmail}</Link>
              <form action={signOut}><button className="text-sm font-black text-black/52 hover:text-black">Salir</button></form>
            </>
          ) : (
            <Link href="/auth" className="hidden text-sm font-black text-black/74 transition-colors hover:text-black sm:block">Iniciar sesión</Link>
          )}
          <KlasButton href="/subir" icon={<Upload className="size-4" />} className="h-11 px-4">Subir</KlasButton>
        </div>
      </div>
    </header>
  );
}
