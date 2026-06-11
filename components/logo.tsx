import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, invert = false }: { compact?: boolean; invert?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative block",
        compact ? "h-8 w-[132px]" : "h-12 w-40",
        invert && "brightness-0 invert"
      )}
      aria-label="KLAS"
    >
      {/* SVG is used for the navbar to avoid the white matte baked into the source PNG. */}
      <Image
        src={compact ? "/assets/logo-navbar.svg" : "/assets/logo-transparent.png"}
        width={compact ? 132 : 160}
        height={compact ? 34 : 120}
        alt="KLAS"
        className="block h-full w-full object-contain"
        priority
      />
    </Link>
  );
}
