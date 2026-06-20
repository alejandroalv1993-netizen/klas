from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"

CARBON = colors.HexColor("#0D0D0D")
INDIGO = colors.HexColor("#4F46E5")
FOG = colors.HexColor("#F5F5F5")
MUTED = colors.HexColor("#5F5F5F")


RESOURCES = [
    {
        "filename": "klas-marketing-digital-desde-cero.pdf",
        "title": "Marketing digital desde cero",
        "subtitle": "Mapa practico para entender canales, objetivos y medicion",
        "category": "Marketing",
        "university": "Universidad de Malaga",
        "subject": "Fundamentos de Marketing",
        "description": "Guia introductoria original sobre estrategia, embudo, canales digitales, metricas y plan de 30 dias para estudiar marketing digital.",
        "sections": [
            (
                "1. Para que sirve el marketing digital",
                [
                    "El marketing digital no consiste en publicar mas, sino en reducir la distancia entre una necesidad real y una propuesta concreta. La pregunta central no es que red social usar, sino que problema entiende mejor la marca y como facilita una decision.",
                    "Un buen plan empieza con tres capas: publico, oferta y momento. El publico define para quien se comunica. La oferta define que cambio promete. El momento identifica por que esa persona deberia actuar ahora y no dentro de seis meses.",
                ],
            ),
            (
                "2. Embudo basico de decision",
                [
                    "Descubrimiento: la persona detecta que existe una alternativa. Aqui funcionan contenidos educativos, comparativas simples y piezas que nombran un problema cotidiano.",
                    "Consideracion: la persona compara opciones. Aqui importan pruebas, casos, demos, reseñas verificables y explicaciones claras de precio, alcance y condiciones.",
                    "Conversion: la persona actua. La pagina debe eliminar dudas: llamada a la accion visible, formulario breve, confianza real y ausencia de fricciones tecnicas.",
                    "Retencion: la relacion continua despues de la compra o registro. Emails utiles, soporte rapido y mejoras visibles suelen valer mas que campañas agresivas.",
                ],
            ),
            (
                "3. Canales y funcion",
                [
                    "SEO captura demanda existente. Social crea descubrimiento y familiaridad. Email mantiene relacion directa. Ads acelera aprendizaje cuando hay presupuesto y una oferta clara. Comunidad aporta feedback, lenguaje real y prueba social cuando existe de verdad.",
                    "La mezcla adecuada depende del ciclo de decision. Un curso barato puede venderse desde social y email. Una decision universitaria, legal o profesional necesita mas contenido explicativo y comparativas.",
                ],
            ),
            (
                "4. Metricas que importan",
                [
                    "Alcance indica cuanta gente vio una pieza, pero no confirma interes. CTR mide atraccion del mensaje. Conversion mide si la propuesta convence. Retencion muestra si el valor prometido se sostiene.",
                    "Una metrica aislada engaña. Una publicacion con pocas visitas y mucha conversion puede ser mejor que una pieza viral sin accion. La lectura correcta siempre cruza volumen, calidad y coste.",
                ],
            ),
            (
                "5. Plantilla de plan de 30 dias",
                [
                    "Semana 1: define publico, problema, promesa y tres objeciones. Semana 2: publica contenidos que respondan esas objeciones. Semana 3: prueba una landing simple y mide formularios o clics. Semana 4: revisa datos, elimina lo que no aporta y duplica lo que genera conversaciones reales.",
                    "El objetivo del primer mes no es escalar, sino aprender con honestidad. Un plan pequeño y medible supera a un calendario enorme lleno de piezas intercambiables.",
                ],
            ),
        ],
        "checklist": [
            "Define un publico concreto en una frase.",
            "Escribe una promesa que no dependa de adjetivos.",
            "Relaciona cada canal con una funcion del embudo.",
            "Mide conversiones antes de celebrar alcance.",
        ],
    },
    {
        "filename": "klas-derecho-constitucional-esquema-base.pdf",
        "title": "Derecho constitucional: esquema base",
        "subtitle": "Resumen original para ordenar conceptos antes de estudiar en profundidad",
        "category": "Derecho",
        "university": "Universidad de Vigo",
        "subject": "Derecho Constitucional",
        "description": "Esquema introductorio original sobre Constitucion, Estado social y democratico de Derecho, derechos fundamentales, poderes del Estado y control constitucional.",
        "sections": [
            (
                "1. Idea general de Constitucion",
                [
                    "Una Constitucion organiza el poder y reconoce limites frente a ese poder. No es solo un texto simbolico: fija reglas de produccion normativa, estructura instituciones y protege espacios de libertad.",
                    "En el estudio conviene separar tres planos: valores y principios, organizacion institucional y derechos. Mezclarlos demasiado pronto suele generar apuntes confusos.",
                ],
            ),
            (
                "2. Estado social y democratico de Derecho",
                [
                    "Estado de Derecho significa sometimiento de poderes publicos a normas, control judicial y seguridad juridica. Estado democratico implica legitimidad popular, participacion y pluralismo. Estado social introduce una funcion activa de garantia de condiciones materiales basicas.",
                    "Estos rasgos no actuan como compartimentos cerrados. Muchas decisiones publicas exigen equilibrar libertad, igualdad, participacion, seguridad y recursos disponibles.",
                ],
            ),
            (
                "3. Derechos fundamentales",
                [
                    "Los derechos fundamentales delimitan esferas de proteccion especialmente intensas. Su estudio debe incluir titularidad, contenido esencial, limites, garantias y vias de tutela.",
                    "Una forma util de repasar es convertir cada derecho en cinco preguntas: quien lo tiene, que protege, que limites admite, que autoridad puede afectarlo y que recurso existe ante una vulneracion.",
                ],
            ),
            (
                "4. Division de poderes",
                [
                    "El poder legislativo produce leyes y controla politicamente al Gobierno. El poder ejecutivo dirige la accion politica y administrativa. El poder judicial resuelve conflictos aplicando el Derecho con independencia.",
                    "La separacion moderna no significa aislamiento absoluto. El sistema constitucional combina separacion, colaboracion y mecanismos de control reciproco.",
                ],
            ),
            (
                "5. Control de constitucionalidad",
                [
                    "El control constitucional revisa la compatibilidad de normas y actuaciones con la Constitucion. Su funcion es proteger la supremacia constitucional y evitar que mayorias coyunturales desborden los limites del sistema.",
                    "Para estudiar esta materia conviene distinguir control abstracto, control concreto, recursos de amparo y conflictos competenciales.",
                ],
            ),
        ],
        "checklist": [
            "Diferencia principio, derecho, garantia e institucion.",
            "Resume cada derecho con titularidad, contenido, limites y tutela.",
            "No memorices organos sin entender su funcion de control.",
            "Relaciona cada concepto con un ejemplo propio.",
        ],
    },
    {
        "filename": "klas-python-fundamentos-practicos.pdf",
        "title": "Python: fundamentos practicos",
        "subtitle": "Sintaxis, estructuras y ejercicios para empezar con criterio",
        "category": "Informatica",
        "university": "Universidad Politecnica de Madrid",
        "subject": "Programacion",
        "description": "Apuntes originales de introduccion a Python con variables, control de flujo, funciones, colecciones, errores y ejercicios breves.",
        "sections": [
            (
                "1. Pensar antes de escribir codigo",
                [
                    "Programar no es memorizar sintaxis, sino convertir una idea en pasos verificables. Antes de abrir el editor, escribe entrada, proceso y salida esperada. Si no puedes explicarlo en lenguaje natural, el codigo saldra fragil.",
                    "Python ayuda porque su sintaxis es legible, pero la legibilidad no sustituye al diseño. Nombres claros, funciones pequeñas y pruebas manuales sencillas evitan la mayor parte de errores iniciales.",
                ],
            ),
            (
                "2. Variables y tipos",
                [
                    "Una variable nombra un valor. Los tipos habituales al empezar son numeros, cadenas, booleanos, listas y diccionarios. El tipo importa porque determina que operaciones tienen sentido.",
                    "Ejemplo: precio = 12.5, nombre = 'Ana', activo = True. El buen nombre de variable reduce comentarios innecesarios.",
                ],
            ),
            (
                "3. Condiciones y bucles",
                [
                    "Una condicion decide caminos. Un bucle repite una operacion. La trampa habitual es mezclar demasiadas condiciones dentro de un bucle largo. Si un bloque crece mucho, extrae una funcion.",
                    "Ejercicio: recorre una lista de notas, calcula la media y devuelve tambien cuantas superan 5. Primero hazlo sin funcion, despues encapsulalo.",
                ],
            ),
            (
                "4. Funciones",
                [
                    "Una funcion debe tener una responsabilidad clara. Recibe datos, realiza una operacion y devuelve un resultado. Si una funcion imprime, guarda, calcula y valida a la vez, sera dificil de probar.",
                    "Ejemplo conceptual: calcular_media(notas) debe devolver un numero. Otra funcion podria encargarse de formatear el resultado para pantalla.",
                ],
            ),
            (
                "5. Errores comunes",
                [
                    "IndexError suele indicar acceso fuera de rango. KeyError aparece al pedir una clave inexistente en un diccionario. TypeError avisa de una operacion incompatible. Leer el error completo ahorra tiempo.",
                    "Depurar no es adivinar: reproduce el fallo, reduce el caso, imprime valores intermedios y cambia una cosa cada vez.",
                ],
            ),
        ],
        "checklist": [
            "Escribe entrada, proceso y salida antes del codigo.",
            "Usa nombres de variables que expliquen el dominio.",
            "Separa calculo, validacion y presentacion.",
            "Lee el traceback desde la ultima linea relevante.",
        ],
    },
    {
        "filename": "klas-tecnicas-estudio-universidad.pdf",
        "title": "Tecnicas de estudio para universidad",
        "subtitle": "Metodo practico para organizar apuntes, repasos y examenes",
        "category": "Universidad",
        "university": "Universidad Complutense de Madrid",
        "subject": "Metodologia de estudio",
        "description": "Guia original con sistema de estudio semanal, lectura activa, recuperacion espaciada, mapas de conceptos y preparacion de examenes.",
        "sections": [
            (
                "1. El problema no suele ser la memoria",
                [
                    "Muchos estudiantes creen que fallan por mala memoria cuando en realidad fallan por estudiar sin sistema. Leer varias veces da sensacion de dominio, pero no siempre produce recuperacion real.",
                    "La prueba clave es sencilla: cierra el apunte y explica el tema sin mirar. Lo que no puedas reconstruir necesita otro tipo de trabajo.",
                ],
            ),
            (
                "2. Lectura activa",
                [
                    "Antes de subrayar, identifica preguntas. Que problema resuelve este apartado, que concepto introduce, que ejemplo lo demuestra y que diferencia tiene con el tema anterior.",
                    "Subrayar demasiado convierte todo en importante. Una buena regla inicial es marcar definiciones, relaciones causa-efecto y excepciones, no parrafos enteros.",
                ],
            ),
            (
                "3. Recuperacion espaciada",
                [
                    "Repasar funciona mejor cuando obliga a recordar. Un calendario simple: primer repaso al dia siguiente, segundo a los tres dias, tercero a la semana y cuarto antes del examen.",
                    "Cada repaso debe tener una tarea concreta: explicar, resolver, comparar o aplicar. Mirar apuntes en silencio cuenta como apoyo, no como prueba.",
                ],
            ),
            (
                "4. Mapas y esquemas",
                [
                    "Un esquema bueno no es bonito por si mismo: reduce un tema a relaciones. Usa flechas solo cuando haya relacion real: causa, consecuencia, excepcion, jerarquia o contraste.",
                    "Si un mapa tiene mas texto que el apunte original, no esta sintetizando. Divide el tema en bloques y crea un mapa por bloque.",
                ],
            ),
            (
                "5. Semana previa al examen",
                [
                    "La ultima semana no deberia ser descubrimiento, sino consolidacion. Alterna simulacros, revision de errores y repasos cortos. El objetivo es llegar con patrones reconocibles.",
                    "Despues de cada simulacro, clasifica errores: desconocimiento, confusion entre conceptos, fallo de tiempo o mala lectura del enunciado. Cada tipo pide una solucion distinta.",
                ],
            ),
        ],
        "checklist": [
            "Convierte cada tema en preguntas antes de subrayar.",
            "Repasa cerrando el apunte y explicando en voz alta.",
            "Programa repasos antes de sentir que los necesitas.",
            "Analiza errores por tipo, no solo por nota.",
        ],
    },
]


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "KlasTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=31,
            leading=34,
            textColor=CARBON,
            alignment=TA_LEFT,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "KlasSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=13,
            leading=18,
            textColor=MUTED,
            spaceAfter=26,
        ),
        "h2": ParagraphStyle(
            "KlasH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=21,
            textColor=CARBON,
            spaceBefore=14,
            spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "KlasBody",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=16,
            textColor=colors.HexColor("#262626"),
            spaceAfter=8,
        ),
        "small": ParagraphStyle(
            "KlasSmall",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=MUTED,
        ),
        "label": ParagraphStyle(
            "KlasLabel",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=INDIGO,
        ),
    }


def decorate(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(CARBON)
    canvas.rect(0, height - 1.15 * cm, width, 1.15 * cm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(1.6 * cm, height - 0.72 * cm, "KLAS")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(width - 1.6 * cm, height - 0.72 * cm, "Aprende. Comparte. Crece.")
    canvas.setStrokeColor(colors.HexColor("#D9D9D9"))
    canvas.line(1.6 * cm, 1.45 * cm, width - 1.6 * cm, 1.45 * cm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(1.6 * cm, 0.95 * cm, "Recurso original KLAS para beta. Uso educativo.")
    canvas.drawRightString(width - 1.6 * cm, 0.95 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def make_table(items, style_map):
    rows = [[Paragraph(f"{index + 1}.", style_map["label"]), Paragraph(item, style_map["body"])] for index, item in enumerate(items)]
    table = Table(rows, colWidths=[0.8 * cm, 14.2 * cm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), FOG),
        ("BOX", (0, 0), (-1, -1), 0.25, colors.HexColor("#E3E3E3")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#E8E8E8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def cover_blocks(resource, style_map):
    includes = [
        f"Mapa de conceptos: {', '.join(title.split('. ', 1)[-1] for title, _ in resource['sections'][:3])}.",
        "Checklist final para repasar sin releer todo el documento.",
        "Contenido original preparado para la beta de KLAS.",
    ]
    use = [
        "Lee primero los apartados completos sin subrayar.",
        "Despues convierte cada bloque en dos preguntas de examen.",
        "Usa el checklist final para comprobar dominio real.",
    ]

    def box(title, items):
        content = [Paragraph(title, style_map["label"])]
        content.extend(Paragraph(f"- {item}", style_map["small"]) for item in items)
        return content

    table = Table(
        [[box("Que incluye", includes), box("Como usarlo", use)]],
        colWidths=[7.2 * cm, 7.2 * cm],
        hAlign="LEFT",
    )
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), FOG),
        ("BOX", (0, 0), (-1, -1), 0.25, colors.HexColor("#DADADA")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#E4E4E4")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def build_pdf(resource):
    style_map = styles()
    path = OUT / resource["filename"]
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=1.6 * cm,
        rightMargin=1.6 * cm,
        topMargin=2.1 * cm,
        bottomMargin=1.9 * cm,
        title=resource["title"],
        author="KLAS",
        subject=resource["description"],
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="KLAS", frames=[frame], onPage=decorate)])

    story = []
    story.append(Spacer(1, 0.55 * cm))
    story.append(Paragraph("RECURSO ORIGINAL KLAS", style_map["label"]))
    story.append(Paragraph(resource["title"], style_map["title"]))
    story.append(Paragraph(resource["subtitle"], style_map["subtitle"]))
    meta = [
        ["Categoria", resource["category"]],
        ["Universidad", resource["university"]],
        ["Asignatura", resource["subject"]],
        ["Origen legal", "Contenido original creado para KLAS. No reproduce materiales de terceros."],
    ]
    table = Table(meta, colWidths=[3.2 * cm, 11.8 * cm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), CARBON),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
        ("BACKGROUND", (1, 0), (1, -1), FOG),
        ("BOX", (0, 0), (-1, -1), 0.25, colors.HexColor("#DADADA")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#E6E6E6")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("LEADING", (0, 0), (-1, -1), 12),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(table)
    story.append(Spacer(1, 0.45 * cm))
    story.append(cover_blocks(resource, style_map))
    story.append(PageBreak())

    story.append(Paragraph("Guia de estudio", style_map["label"]))
    for title, paragraphs in resource["sections"]:
        story.append(Paragraph(title, style_map["h2"]))
        for paragraph in paragraphs:
            story.append(Paragraph(paragraph, style_map["body"]))

    story.append(Spacer(1, 0.35 * cm))
    story.append(Paragraph("Checklist de repaso", style_map["h2"]))
    story.append(make_table(resource["checklist"], style_map))
    story.append(Spacer(1, 0.35 * cm))
    story.append(Paragraph("Nota de uso", style_map["h2"]))
    story.append(Paragraph(
        "Este documento es un recurso educativo introductorio. Puede servir como punto de partida, pero no sustituye bibliografia oficial, clases, normativa vigente ni criterio docente.",
        style_map["body"],
    ))

    doc.build(story)
    return path


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for resource in RESOURCES:
        path = build_pdf(resource)
        manifest.append({
            "file": str(path.relative_to(ROOT)).replace("\\", "/"),
            "title": resource["title"],
            "description": resource["description"],
            "category": resource["category"],
            "university": resource["university"],
            "subject": resource["subject"],
            "ownershipType": "own_work",
            "sourceTitle": "Contenido original KLAS",
            "licenseName": "Uso educativo en KLAS beta",
        })

    manifest_path = OUT / "resources-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Created {len(manifest)} PDFs in {OUT}")
    print(manifest_path)


if __name__ == "__main__":
    main()
