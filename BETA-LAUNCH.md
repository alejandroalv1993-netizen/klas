# KLAS Beta Launch Checklist

Lista operativa para dejar KLAS lista para beta publica.

## Supabase

- Aplicar completa la migracion `supabase/content-moderation-migration.sql`.
- Verificar que existen las funciones:
  - `public.is_moderator()`
  - `public.moderation_queue()`
  - `public.open_resource_reports()`
  - `public.moderate_resource(...)`
  - `public.resolve_resource_report(...)`
- Insertar el email owner en `public.moderator_emails`.
- Confirmar `ADMIN_EMAILS` en Netlify con el mismo email de login.
- Probar `/owner/moderacion` con sesion owner.

## Recursos Reales

- Crear PDFs/DOCX reales de muestra para beta. Hecho: primer pack en `output/pdf/`.
- Subirlos desde el flujo real de `/subir`.
- Aprobarlos desde `/owner/moderacion`.
- Crear rutas publicas funcionales para cada recurso real.
- Sustituir o reducir mocks en zonas publicas donde puedan parecer contenido real.

## Contenido Y Confianza

- Quitar badges de confianza que aun no esten respaldadas por datos reales.
- Revisar cualquier claim tipo estudiantes, descargas, ratings o recursos disponibles.
- Mantener solo mensajes verificables para fase beta.

## Interacciones

- Añadir microinteracciones al boton de Guardar.
- Revisar estados hover, active, disabled y loading en acciones principales.
- Dar feedback visible cuando se guarda, reporta, descarga o falla una accion.
- Pulir pequeños detalles de motion sin ralentizar tareas.

## Beta

- Revisar registro/login en produccion.
- Revisar subida completa: upload, pendiente, moderacion, publicacion, descarga.
- Revisar aviso legal, privacidad, cookies y terminos con datos reales del responsable.
- Probar responsive basico en movil y desktop.
- Lanzar como beta cuando no haya rutas rotas ni claims ficticios.
