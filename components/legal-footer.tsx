import Link from "next/link";

const links = [
  ["Aviso legal", "/legal/aviso-legal"],
  ["Privacidad", "/legal/privacidad"],
  ["Cookies", "/legal/cookies"],
  ["Términos", "/legal/terminos"]
];

export function LegalFooter() {
  return (
    <footer className="border-t border-black/10 bg-white px-5 py-7 text-sm sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-black/58">© {new Date().getFullYear()} KLAS</p>
        <nav aria-label="Información legal" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map(([label, href]) => <Link key={href} href={href} className="font-bold text-black/62 transition-colors hover:text-black">{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
