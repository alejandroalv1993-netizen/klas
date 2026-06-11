import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "dark" | "light" | "ghost";
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
};

export function KlasButton({
  children,
  href,
  variant = "dark",
  icon,
  className,
  type = "button"
}: ButtonProps) {
  const classes = cn(
    "magnetic-sheen group inline-flex h-12 items-center justify-center gap-3 rounded-klas px-5 text-sm font-black transition-all duration-500",
    "focus:outline-none focus:ring-2 focus:ring-indigo focus:ring-offset-2",
    variant === "dark" && "bg-carbon text-white hover:-translate-y-0.5 hover:bg-black",
    variant === "light" && "border border-black/14 bg-white text-carbon hover:-translate-y-0.5 hover:border-black/30",
    variant === "ghost" && "bg-transparent text-carbon hover:bg-black/[0.035]",
    className
  );

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 grid size-5 place-items-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5">
        {icon ?? <ArrowRight className="size-4" />}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {content}
    </button>
  );
}
