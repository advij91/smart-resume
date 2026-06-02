# Smart Resume - Project Manifest & Developer Guide

## 1. Project Overview & Architecture
This is a lightweight, zero-maintenance, AI-powered interactive resume and job-fitment analyzer. It operates on an "infra-light" serverless footprint.
- **Frontend/Backend:** Next.js (App Router), deployed to Vercel.
- **RAG Pipeline:** Edge-native retrieval using Vercel AI SDK (`ai`) and `@upstash/vector`.
- **Database:** Upstash Vector (REST/HTTP-based serverless vector database).
- **Embedding Model:** `text-embedding-3-small` (1536 dimensions).
- **LLM Router:** `gpt-4o-mini` (High speed, streaming enabled via Edge runtime).

---

## 2. Developer Commands
Use these commands to build, test, and run the project:
- **Start Development Server**: `npm run dev`
- **Build Production Bundle**: `npm run build`
- **Run Linter**: `npm run lint`
- **Ingest/Vectorize Resume Data**: `npm run ingest`

---

## 3. Tech Stack & Library Constraints
When generating or modifying code for this repository, strictly adhere to these dependencies:
- **UI & Styling**: Tailwind CSS, Lucide React (for icons). Follow the light-theme design system.
- **Streaming & AI**: Use the unified Vercel AI SDK (`import { streamText } from "ai"` and `import { openai } from "@ai-sdk/openai"`).
- **Vector Operations**: Always use the lightweight `@upstash/vector` SDK over HTTP. Avoid heavy, stateful connection pools (like standard gRPC clients).
- **Runtime**: All AI API routes *must* export `export const runtime = 'edge';` to ensure near-zero cold starts.

---

## 4. Design & Custom Theme System
The application is styled with the **Calm Seas Sunset** light theme:
- **Primary Background**: Azure Mist (`#edf7f6`, defined as Tailwind class `bg-azure`)
- **Primary Text**: Baltic Blue (`#2660a4`, defined as Tailwind class `text-baltic`) or Slate-900 (`#0f172a`, `text-slate-900`)
- **Accents**: Sandy Brown (`#f19953`, Tailwind class `sandy`) and Copper (`#c47335`, Tailwind class `copper`)
- **Layouts**: Custom semi-translucent white cards (`bg-white/70`, `bg-white/80`) with thin borders (`border-slate-200/80`) and custom ambient glows (`glow-baltic`, `glow-sandy`).

---

## 5. Knowledge Base Structure (`/data`)
The RAG source data is stored as static Markdown chunks in `/data`. Every chunk must maintain this strict metadata header structure for optimal embedding matching:
```markdown
# ID: [unique_snake_case_id]
# Core Tech: [Comma-separated tech keywords]
# Category: [Domain designation]
```