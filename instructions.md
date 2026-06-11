# KLAS — MVP Web Platform

Build a modern educational resource-sharing platform called KLAS.

## Goal
Create a production-ready MVP where users can:
- Explore learning resources
- Search by topic, university, subject and category
- View resource detail pages
- Download clean PDF resources
- Upload resources after login
- Rate resources
- Save favorites

## Brand
KLAS is not just a notes platform. It is a cultural learning brand.

Core promise:
“Apuntes gratuitos. Sin publicidad dentro del documento. Para siempre.”

Tone:
Minimal, premium, youthful, community-driven.

Visual style:
- Black / white base
- Subtle indigo accent
- Clean cards
- Editorial spacing
- Premium SaaS feel
- Inspired by Linear, Notion, Raycast, modern coffee/lifestyle brands

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Supabase
- Supabase Auth
- Supabase Storage
- PostgreSQL
- Vercel-ready

## Pages
1. `/`
Landing page based on provided mockup.

2. `/dashboard`
User dashboard based on provided mockup.

3. `/explorar`
Search and filter resources.

4. `/recursos/[slug]`
Resource detail page.

5. `/subir`
Upload resource form.

6. `/perfil`
User profile with uploads, downloads, reputation.

## MVP Data Model
Tables:
- profiles
- resources
- categories
- universities
- subjects
- ratings
- downloads
- favorites

## Resource fields
- id
- title
- slug
- description
- category
- university
- subject
- author_id
- file_url
- cover_image_url
- downloads_count
- rating_average
- created_at

## Design Requirements
- Use the KLAS logo assets.
- Use the brand board colors and typography direction.
- Documents must never include ads.
- Ads can exist only in web UI sidebars or non-invasive slots.
- Mobile-first responsive design.
- Clean loading states.
- Empty states.
- SEO-friendly URLs.

## First resource
Include the existing generated resource:
“Introducción al Marketing Digital”
as seed content.

## Deliverables
- Working Next.js project
- Supabase schema SQL
- Seed data
- README with setup instructions
- Environment variable example
- Componentized UI
Do not overbuild. Prioritize a beautiful, functional MVP over advanced features.