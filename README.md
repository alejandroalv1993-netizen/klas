# KLAS MVP

KLAS es una plataforma educativa para explorar, descargar y compartir recursos gratuitos sin publicidad dentro de los documentos.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis smooth scroll
- Supabase Auth, Database y Storage
- Vercel-ready

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/schema.sql` en el SQL editor.
3. Ejecuta `supabase/seed.sql` para cargar categorías, universidades y asignaturas.
4. En Authentication > URL Configuration añade `http://localhost:3000/auth/callback` como URL de redirección local.
5. El script crea el bucket privado `resources`, su límite de 25 MB y las políticas RLS necesarias.

El registro requiere confirmación por email. Las subidas solo aceptan PDF y DOCX, validan extensión, MIME y firma binaria, y se almacenan bajo la carpeta privada del usuario. Las descargas publicadas usan enlaces firmados de 60 segundos.

## Rutas

- `/` Landing editorial KLAS
- `/dashboard` Dashboard de usuario
- `/explorar` Búsqueda y filtros
- `/recursos/[slug]` Detalle del recurso
- `/auth` Registro e inicio de sesión
- `/subir` Formulario de subida protegido
- `/perfil` Perfil de usuario
- `/favoritos` Recursos guardados

## Seguridad

- Las sesiones se mantienen en cookies SSR y se refrescan desde middleware.
- `/subir` y `/perfil` requieren un usuario autenticado.
- La base de datos y Storage aplican Row Level Security por propietario.
- Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` al navegador. El flujo actual no necesita esa clave.
- Configura límites de Auth, protección anti-bot y SMTP propio en Supabase antes de producción.
