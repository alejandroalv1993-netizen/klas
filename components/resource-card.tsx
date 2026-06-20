import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import { MotionArticle } from "@/components/motion";
import { Resource } from "@/data/mock";

export function ResourceCard({ resource, index = 0 }: { resource: Resource; index?: number }) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className="document-card group relative overflow-hidden rounded-klas border border-black/12 bg-white transition-all duration-500 hover:-translate-y-1"
    >
      <Link href={`/recursos/${resource.slug}`} className="block">
        <div className={`relative flex aspect-[1.18] flex-col justify-between overflow-hidden p-6 ${resource.coverImage ? "bg-carbon text-white" : `cover-${resource.coverTone}`}`}>
          {resource.coverImage ? (
            <>
              <Image
                src={resource.coverImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/62 via-black/18 to-black/72" />
            </>
          ) : null}
          <div className="absolute inset-x-0 top-0 h-1 bg-current/18" />
          <div className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-current/20 opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </div>
          <div className="editorial-label relative opacity-80">{resource.category}</div>
          <div className="relative max-w-[13rem] text-[1.35rem] font-black uppercase leading-[0.98] tracking-[-0.025em] transition-transform duration-500 group-hover:-translate-y-1">
            {resource.title}
          </div>
          <div className="relative flex items-end justify-between text-xs font-black opacity-80">
            <span>{resource.subject}</span>
            <span>{resource.pages}p</span>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-2 text-base font-extrabold leading-snug">{resource.title}</h3>
            <p className="mt-1 line-clamp-1 text-sm font-medium text-black/62">{resource.university}</p>
          </div>
          <div className="flex items-center justify-between border-t border-black/8 pt-3 text-xs font-black text-black/66">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5" />
              Vista previa beta
            </span>
            <span className="translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              Abrir
            </span>
          </div>
        </div>
      </Link>
    </MotionArticle>
  );
}
