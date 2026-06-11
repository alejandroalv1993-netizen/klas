import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Landmark,
  LineChart,
  Megaphone,
  Palette,
  Scale,
  Sigma,
  Target
} from "lucide-react";

export type Resource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  university: string;
  subject: string;
  author: string;
  coverTone: "blue" | "paper" | "dark" | "mint" | "violet" | "orange";
  coverImage?: string;
  downloads: number;
  rating: number;
  createdAt: string;
  pages: number;
};

export const categories = [
  { name: "Universidad", count: 128543, icon: Landmark, color: "text-indigo" },
  { name: "FP", count: 24892, icon: BriefcaseBusiness, color: "text-mint" },
  { name: "Oposiciones", count: 15763, icon: Target, color: "text-energy" },
  { name: "Bachillerato", count: 8192, icon: GraduationCap, color: "text-indigo" }
];

export const subjects = [
  "Marketing",
  "Derecho",
  "Historia",
  "Informática",
  "Psicología",
  "Matemáticas",
  "Economía",
  "Diseño"
];

export const universities = [
  "Universidad de Vigo",
  "Universidad de Málaga",
  "Universidad Politécnica de Madrid",
  "Universidade de Santiago de Compostela",
  "Universidad Complutense de Madrid",
  "Universidad de A Coruña"
];

export const resources: Resource[] = [
  {
    id: "marketing-digital",
    title: "Introducción al Marketing Digital",
    slug: "introduccion-al-marketing-digital",
    description:
      "Guía clara para entender canales, métricas, estrategia de contenidos y campañas desde cero.",
    category: "Marketing",
    university: "Universidad de Málaga",
    subject: "Fundamentos de Marketing",
    author: "Lucía Fernández",
    coverTone: "paper",
    coverImage: "/assets/resource-marketing.png",
    downloads: 1840,
    rating: 4.8,
    createdAt: "2026-06-01",
    pages: 42
  },
  {
    id: "derecho-constitucional",
    title: "Derecho Constitucional Temas 1-10",
    slug: "derecho-constitucional-temas-1-10",
    description:
      "Resumen completo con esquemas de derechos fundamentales, Estado y órganos constitucionales.",
    category: "Derecho",
    university: "Universidad de Vigo",
    subject: "Derecho Constitucional",
    author: "Carlos Rodríguez",
    coverTone: "blue",
    coverImage: "/assets/resource-derecho.png",
    downloads: 2400,
    rating: 4.8,
    createdAt: "2026-05-24",
    pages: 67
  },
  {
    id: "python-desde-cero",
    title: "Programación en Python Desde cero",
    slug: "programacion-en-python-desde-cero",
    description:
      "Apuntes con sintaxis, estructuras, funciones y ejercicios resueltos para empezar a programar.",
    category: "Informática",
    university: "Universidad Politécnica de Madrid",
    subject: "Programación",
    author: "María López",
    coverTone: "dark",
    coverImage: "/assets/resource-python.png",
    downloads: 3200,
    rating: 4.9,
    createdAt: "2026-05-18",
    pages: 91
  },
  {
    id: "historia-espana",
    title: "Historia de España Esquemas completos",
    slug: "historia-de-espana-esquemas-completos",
    description:
      "Líneas del tiempo, mapas conceptuales y bloques de examen organizados para repasar rápido.",
    category: "Historia",
    university: "Universidade de Santiago de Compostela",
    subject: "Historia de España",
    author: "Ana Pérez",
    coverTone: "mint",
    coverImage: "/assets/resource-historia.png",
    downloads: 1500,
    rating: 4.6,
    createdAt: "2026-05-11",
    pages: 54
  },
  {
    id: "psicologia-social",
    title: "Psicología Social Resumen completo",
    slug: "psicologia-social-resumen-completo",
    description:
      "Teorías, autores clave y modelos de influencia social con cuadros comparativos.",
    category: "Psicología",
    university: "Universidad Complutense de Madrid",
    subject: "Psicología Social",
    author: "Nerea Santos",
    coverTone: "violet",
    downloads: 2800,
    rating: 4.7,
    createdAt: "2026-05-05",
    pages: 73
  },
  {
    id: "contabilidad-financiera",
    title: "Contabilidad Financiera Teoría y ejercicios",
    slug: "contabilidad-financiera-teoria-y-ejercicios",
    description:
      "Balances, cuentas anuales, asientos y ejercicios tipo con soluciones paso a paso.",
    category: "Economía",
    university: "Universidad de A Coruña",
    subject: "Contabilidad",
    author: "Irene Castro",
    coverTone: "orange",
    downloads: 1900,
    rating: 4.7,
    createdAt: "2026-04-30",
    pages: 82
  }
];

export const navItems = [
  { label: "Inicio", href: "/dashboard", icon: BookOpen },
  { label: "Explorar", href: "/explorar", icon: Brain },
  { label: "Asignaturas", href: "/explorar?filter=asignaturas", icon: Sigma },
  { label: "Universidades", href: "/explorar?filter=universidades", icon: Landmark },
  { label: "Oposiciones", href: "/explorar?category=oposiciones", icon: Target },
  { label: "Subir recurso", href: "/subir", icon: LineChart }
];

export const essence = [
  { label: "Curiosidad", icon: Brain },
  { label: "Progreso", icon: LineChart },
  { label: "Comunidad", icon: GraduationCap },
  { label: "Impacto", icon: Megaphone },
  { label: "Sencillez", icon: Palette },
  { label: "Criterio", icon: Scale },
  { label: "Código abierto al aprendizaje", icon: Code2 }
];
