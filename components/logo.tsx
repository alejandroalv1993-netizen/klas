import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, invert = false }: { compact?: boolean; invert?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative block shrink-0",
        compact ? "h-14 w-12" : "h-24 w-[5.35rem]",
        invert && "brightness-0 invert"
      )}
      aria-label="KLAS"
    >
      <Image
        src="/assets/logo-transparent.png"
        width={652}
        height={730}
        alt="KLAS"
        className="block h-full w-full object-contain"
        priority
      />
    </Link>
  );
}
