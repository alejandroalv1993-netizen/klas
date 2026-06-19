# KLAS

Plataforma educativa para explorar, descargar y compartir recursos gratuitos sin publicidad añadida dentro de los documentos.

## Stack

- Next.js 15 App Router
- TypeScript y Tailwind CSS
- Supabase Auth, Database y Storage
- Framer Motion y Lenis
- Netlify

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
LEGAL_RESPONSIBLE_NAME=
LEGAL_TAX_ID=
LEGAL_ADDRESS=
LEGAL_CONTACT_EMAIL=
LEGAL_DPO_EMAIL=
LEGAL_LAST_UPDATED=2026-06-13
```

## Supabase

1. Ejecuta `supabase/schema.sql` para una instalación nueva.
2. Ejecuta `supabase/seed.sql` para cargar taxonomías iniciales.
3. En proyectos ya creados, ejecuta una vez `supabase/rgpd-migration.sql`.
4. Ejecuta `supabase/content-moderation-migration.sql` para activar revisión previa, reportes y bloqueo por hash.
5. En Authentication > URL Configuration configura `https://klas-apuntes.netlify.app` como Site URL.
6. Añade `http://localhost:3000/auth/callback` y `https://klas-apuntes.netlify.app/auth/callback` en Redirect URLs.

## Privacidad y seguridad

- Sesiones SSR mediante cookies técnicas de Supabase.
- Row Level Security por propietario en tablas y Storage.
- Bucket privado, validación PDF/DOCX y descargas firmadas.
- Subidas en `pending_review` por defecto, declaración de origen legal, huella SHA-256 y señales automáticas de riesgo.
- Canal de reporte de recursos por derechos de autor, privacidad, contenido ilícito, spam o calidad.
- Registro versionado de aceptación legal.
- Exportación de datos y eliminación autónoma de cuenta.
- Aviso de cookies técnicas y documentos legales accesibles globalmente.
- Cabeceras defensivas para framing, MIME, permisos y referrer.

Antes de abrir el registro al público:

- Completa las variables `LEGAL_*` con los datos reales del responsable.
- Formaliza los acuerdos de encargado del tratamiento con Supabase y Netlify.
- Configura SMTP, protección anti-bot y límites de Auth en Supabase.
- Mantén un procedimiento interno para derechos, brechas, conservación, moderación y retirada de contenidos.
