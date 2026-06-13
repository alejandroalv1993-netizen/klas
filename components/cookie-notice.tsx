"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const NOTICE_KEY = "klas_cookie_notice_v1";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(NOTICE_KEY) !== "dismissed");
  }, []);

  if (!visible) return null;

  function dismiss() {
    window.localStorage.setItem(NOTICE_KEY, "dismissed");
    setVisible(false);
  }

  return (
    <aside aria-label="Aviso de cookies" className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl overflow-hidden border border-black/12 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:flex sm:items-center sm:gap-5 sm:p-5">
      <div className="min-w-0 flex-1">
        <p className="font-black">Cookies técnicas</p>
        <p className="mt-1 text-sm leading-6 text-black/68">KLAS utiliza únicamente cookies necesarias para iniciar sesión, mantener la seguridad y prestar el servicio. No usamos cookies publicitarias ni analíticas.</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-0 sm:flex-nowrap">
        <Link href="/legal/cookies" className="text-sm font-bold underline underline-offset-4">Más información</Link>
        <button type="button" onClick={dismiss} className="inline-flex size-10 items-center justify-center bg-carbon text-white" aria-label="Cerrar aviso de cookies">
          <X className="size-4" />
        </button>
      </div>
    </aside>
  );
}
