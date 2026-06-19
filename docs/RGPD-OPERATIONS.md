# Operacion RGPD de KLAS

Este documento complementa las medidas tecnicas. Debe mantenerse actualizado por el responsable del tratamiento y revisarse con asesoramiento juridico antes de abrir el servicio al publico.

## Antes de produccion

- Completar las variables `LEGAL_*` en Netlify.
- Configurar Site URL y Redirect URLs en Supabase Auth.
- Firmar y archivar los acuerdos de encargo con Supabase y Netlify.
- Documentar las regiones de tratamiento, transferencias internacionales y garantias aplicables.
- Configurar SMTP, proteccion anti-bot, alertas y limites de autenticacion.
- Definir un email atendido para privacidad, retirada de contenidos y seguridad.

## Registro de actividades

Mantener un registro con:

- Gestion de cuentas: identidad, email, aceptacion legal y seguridad.
- Publicacion de recursos: metadatos, archivos, autoria y moderacion.
- Actividad de usuario: favoritos, valoraciones y descargas cuando se registren.
- Soporte y ejercicio de derechos: solicitudes, verificaciones y respuestas.
- Seguridad: registros tecnicos estrictamente necesarios y con acceso limitado.

Para cada actividad deben constar finalidad, base juridica, categorias, destinatarios, transferencias, conservacion y medidas de seguridad.

## Derechos de las personas

1. Registrar la solicitud y confirmar su recepcion.
2. Verificar identidad sin pedir mas datos de los necesarios.
3. Responder dentro de un mes, salvo ampliacion justificada conforme al RGPD.
4. Ejecutar acceso, rectificacion, supresion, oposicion, limitacion o portabilidad segun corresponda.
5. Conservar evidencia minima de la gestion y de la respuesta.

La exportacion y supresion autonomas del perfil no sustituyen la atencion de solicitudes recibidas por otros canales.

## Conservacion

- Cuenta y contenido: mientras la cuenta permanezca activa.
- Cuenta eliminada: supresion inmediata de registros activos y archivos, salvo obligacion legal.
- Copias de seguridad: definir y documentar un ciclo corto de sobrescritura.
- Solicitudes legales y seguridad: conservar solo durante los plazos de responsabilidad aplicables.
- Recursos denunciados: bloquear acceso mientras se evalua y conservar unicamente lo necesario para la reclamacion.

## Brechas de seguridad

1. Contener el incidente y preservar evidencias.
2. Evaluar datos afectados, alcance, consecuencias y medidas.
3. Documentar todas las brechas, incluso las no notificadas.
4. Notificar a la AEPD en un maximo de 72 horas cuando exista riesgo para derechos y libertades.
5. Informar a las personas afectadas cuando exista alto riesgo.

## Cookies y terceros

La version actual solo permite cookies tecnicas. No incorporar analitica, pixeles, chat, video embebido o publicidad sin inventario previo, evaluacion y bloqueo hasta consentimiento cuando sea exigible.

## Contenido aportado por usuarios

- Exigir confirmacion de derechos antes de cada subida.
- Solicitar origen legal del documento: obra propia, licencia reutilizable, dominio publico o permiso del titular.
- Mantener las subidas en `pending_review` hasta completar una revision proporcionada al riesgo.
- Revisar las senales automaticas `moderation_flags` como apoyo, no como decision juridica automatica.
- Usar `blocked_file_hashes` para impedir re-subidas de archivos retirados por derechos, privacidad o seguridad.
- Facilitar un canal de retirada por propiedad intelectual, privacidad o contenido ilicito.
- Registrar decisiones de moderacion y permitir revision.
- Evitar inspeccionar o conservar documentos mas alla de lo necesario para seguridad y prestacion.
