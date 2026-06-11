import Link from "next/link";
import { Heart, Moon, UserRound } from "lucide-react";
import { Logo } from "@/components/logo";
import { navItems } from "@/data/mock";

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-r border-black/8 bg-white/78 p-6 backdrop-blur-2xl lg:sticky lg:top-0 lg:block">
      <Logo compact />
      <nav className="mt-9 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = index === 0;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`flex h-12 items-center gap-3 rounded-klas px-4 text-sm font-bold transition-all ${
                active ? "bg-carbon text-white shadow-soft" : "text-black/78 hover:bg-black/[0.04]"
              }`}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/favoritos"
          className="flex h-12 items-center gap-3 rounded-klas px-4 text-sm font-bold text-black/78 hover:bg-black/[0.04]"
        >
          <Heart className="size-5" />
          Favoritos
        </Link>
        <Link
          href="/perfil"
          className="flex h-12 items-center gap-3 rounded-klas px-4 text-sm font-bold text-black/78 hover:bg-black/[0.04]"
        >
          <UserRound className="size-5" />
          Mi perfil
        </Link>
      </nav>
      <div className="mt-10 rounded-klas border border-black/10 bg-fog p-5">
        <p className="text-sm font-extrabold">Apoya a KLAS</p>
        <p className="mt-2 text-sm leading-relaxed text-black/58">
          Desactiva tu bloqueador de anuncios para mantener KLAS gratis para todos.
        </p>
        <p className="mt-6 text-sm font-bold text-indigo">Gracias por formar parte de la comunidad.</p>
      </div>
      <button className="absolute bottom-6 left-6 flex items-center gap-3 text-sm font-bold text-black/72">
        <Moon className="size-4" />
        Tema claro
      </button>
    </aside>
  );
}
