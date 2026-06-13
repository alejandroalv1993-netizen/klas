import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { CookieNotice } from "@/components/cookie-notice";
import { LegalFooter } from "@/components/legal-footer";

export const metadata: Metadata = {
  title: "KLAS - Apuntes gratuitos, para siempre",
  description:
    "Explora, comparte y descarga recursos educativos gratuitos sin publicidad dentro de los documentos.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <LenisProvider />
        {children}
        <LegalFooter />
        <CookieNotice />
        <div className="noise" />
      </body>
    </html>
  );
}
