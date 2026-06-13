import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Logo } from "@/components/logo";
import { legalConfig, legalConfigComplete } from "@/lib/legal";

export const dynamicParams = false;

export function generateStaticParams() {
  return ["aviso-legal", "privacidad", "cookies", "terminos"].map((document) => ({ document }));
}

const documents = {
  "aviso-legal": {
    title: "Aviso legal",
    intro: "Información general del prestador y condiciones de acceso a KLAS.",
    sections: [
      ["Titular del servicio", `Responsable: ${legalConfig.responsibleName}. NIF/CIF: ${legalConfig.taxId}. Domicilio: ${legalConfig.address}. Contacto: ${legalConfig.contactEmail}.`],
      ["Objeto", "KLAS permite consultar, publicar y descargar recursos educativos aportados por su comunidad. El acceso a determinadas funciones requiere una cuenta."],
      ["Propiedad intelectual", "La marca, el diseño y el software de KLAS están protegidos por la normativa aplicable. Los documentos pertenecen a sus autores o titulares y se ofrecen bajo las condiciones declaradas al publicarlos."],
      ["Responsabilidad", "KLAS aplica controles técnicos y puede retirar contenidos que infrinjan derechos, la ley o estos términos. No garantiza la exactitud académica de materiales aportados por terceros."],
      ["Normativa aplicable", "Este servicio se rige por la legislación española. Cuando resulte aplicable, cualquier controversia se someterá a los juzgados determinados por la normativa de consumidores y usuarios."]
    ]
  },
  privacidad: {
    title: "Política de privacidad",
    intro: "Cómo tratamos los datos personales de usuarios y visitantes.",
    sections: [
      ["Responsable", `${legalConfig.responsibleName}, con domicilio en ${legalConfig.address}. Contacto para privacidad: ${legalConfig.contactEmail}. Delegado de protección de datos: ${legalConfig.dpoEmail}.`],
      ["Datos tratados", "Datos de cuenta (nombre, email y registros de aceptación), información de los recursos publicados, favoritos y valoraciones, registros técnicos de seguridad y comunicaciones que envíes al responsable."],
      ["Finalidades y bases jurídicas", "Gestionamos la cuenta, las publicaciones y las descargas para ejecutar los términos del servicio. Protegemos la plataforma frente a fraude y abuso por interés legítimo. Conservamos la información exigida para cumplir obligaciones legales. Las finalidades opcionales futuras requerirán consentimiento separado."],
      ["Destinatarios y encargados", "Supabase presta autenticación, base de datos y almacenamiento. Netlify presta alojamiento y distribución web. También podrán comunicarse datos a autoridades cuando exista obligación legal. Deben formalizarse los acuerdos de encargo y revisarse las regiones y garantías de transferencia contratadas con cada proveedor."],
      ["Conservación", "Los datos de cuenta se conservan mientras mantengas la cuenta y durante los plazos necesarios para atender responsabilidades legales. Al eliminarla se borran la cuenta, sus relaciones y los archivos publicados, salvo copias de seguridad temporales o datos que deban conservarse por obligación legal."],
      ["Derechos", "Puedes acceder y exportar tus datos desde el perfil, rectificarlos mediante solicitud, eliminar la cuenta y ejercer oposición, limitación o portabilidad escribiendo al contacto de privacidad. También puedes reclamar ante la Agencia Española de Protección de Datos."],
      ["Menores", "KLAS no está dirigido a menores de 14 años. Las personas menores de 18 años deben contar con autorización suficiente para publicar contenidos y aceptar las condiciones aplicables."],
      ["Seguridad", "Aplicamos sesiones seguras, Row Level Security, almacenamiento privado, enlaces temporales de descarga, validación de archivos y limitación de acceso por usuario. Ningún sistema puede garantizar seguridad absoluta."]
    ]
  },
  cookies: {
    title: "Política de cookies",
    intro: "Tecnologías necesarias para prestar el servicio.",
    sections: [
      ["Cookies utilizadas", "KLAS utiliza cookies técnicas de Supabase para crear y mantener sesiones autenticadas, renovar credenciales y proteger las rutas privadas. También guarda localmente la preferencia de cierre de este aviso."],
      ["Finalidad", "Estas tecnologías permiten identificar la sesión, mantener su seguridad y recordar una preferencia solicitada. Son necesarias para las funciones expresamente utilizadas por el usuario."],
      ["Cookies opcionales", "Actualmente no usamos cookies de analítica, personalización publicitaria ni seguimiento. Si se incorporan, permanecerán bloqueadas hasta obtener una elección previa, informada y revocable."],
      ["Gestión", "Puedes borrar las cookies y el almacenamiento local desde la configuración del navegador. Al bloquear cookies técnicas, el registro, el inicio de sesión o las áreas privadas pueden dejar de funcionar."],
      ["Actualizaciones", `Última actualización: ${legalConfig.updatedAt}. Revisaremos esta política cuando cambien las tecnologías o finalidades utilizadas.`]
    ]
  },
  terminos: {
    title: "Términos de uso",
    intro: "Reglas para utilizar KLAS y compartir recursos educativos.",
    sections: [
      ["Cuenta", "Debes facilitar información correcta, proteger tus credenciales y comunicar cualquier uso no autorizado. No se permite suplantar identidades ni crear cuentas para eludir medidas de seguridad."],
      ["Publicación de recursos", "Solo puedes subir documentos que hayas creado, que sean de dominio público o para los que dispongas de autorización suficiente. No publiques datos personales de terceros, exámenes obtenidos ilícitamente, malware ni contenidos que vulneren derechos."],
      ["Licencia de alojamiento", "Al publicar concedes a KLAS una licencia no exclusiva y gratuita, limitada a almacenar, reproducir técnicamente y distribuir el recurso dentro del servicio hasta que lo retires o elimines la cuenta."],
      ["Moderación", "KLAS puede bloquear o retirar recursos y suspender cuentas ante indicios razonables de infracción, riesgo de seguridad o incumplimiento. El usuario podrá contactar con el responsable para solicitar revisión."],
      ["Disponibilidad", "El servicio se ofrece en su estado actual. Pueden existir interrupciones por mantenimiento, incidencias de proveedores o cambios necesarios para proteger la plataforma."],
      ["Cambios", "Los cambios relevantes se comunicarán antes de aplicarse cuando afecten a usuarios registrados. La versión aceptada se registra al crear la cuenta."],
      ["Contacto", `Para incidencias legales, retirada de contenidos o consultas sobre estos términos: ${legalConfig.contactEmail}.`]
    ]
  }
} as const;

export default async function LegalDocumentPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const content = documents[document as keyof typeof documents];
  if (!content) notFound();

  return (
    <main className="min-h-screen bg-white px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex min-w-0 items-center justify-between gap-4 border-b border-black/10 pb-6">
          <Logo compact />
          <Link href="/" className="shrink-0 text-sm font-black"><span className="sm:hidden">Volver</span><span className="hidden sm:inline">Volver a KLAS</span></Link>
        </div>
        <article className="min-w-0 py-12 sm:py-16">
          <p className="text-sm font-black text-indigo">Información legal</p>
          <h1 className="editorial-heading mt-3 text-5xl sm:text-6xl">{content.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/62">{content.intro}</p>
          {!legalConfigComplete ? (
            <div className="mt-8 flex gap-3 border border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" />
              <p><strong>Documento pendiente de completar.</strong> Antes de operar públicamente deben configurarse la identidad, NIF/CIF, domicilio y email del responsable.</p>
            </div>
          ) : null}
          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {content.sections.map(([title, body]) => (
              <section key={title} className="grid gap-4 py-7 sm:grid-cols-[15rem_1fr] sm:gap-8">
                <h2 className="text-lg font-black">{title}</h2>
                <p className="max-w-[70ch] break-words leading-7 text-black/68">{body}</p>
              </section>
            ))}
          </div>
          {document === "privacidad" ? <p className="mt-8 text-sm leading-6 text-black/60">Consulta la <a className="font-bold underline" href="https://www.aepd.es" target="_blank" rel="noreferrer">Agencia Española de Protección de Datos</a> para obtener información adicional o presentar una reclamación.</p> : null}
        </article>
      </div>
    </main>
  );
}
