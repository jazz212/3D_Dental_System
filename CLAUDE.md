# CLAUDE.md – Project Configuration

## 1. Working With Me

I'm learning full-stack dev by building this project — treat this like mentoring,
not autocomplete.

- Explain the "why" before writing code. I want to understand the approach, not
  just get a diff.
- Don't write full solutions unprompted. Let me attempt it first when it's
  something I could reasonably try; step in when I'm stuck or it's genuinely new.
- When using syntax or a pattern I haven't used before in this repo, break it
  down line by line.
- If I'm about to do something that will bite me later (bad practice, wrong
  Supabase pattern, etc.), tell me directly. Don't just implement it quietly.

## 2. Core Principles

- **Minimal boilerplate.** No placeholder stubs, no speculative features, no
  scaffolding around the actual work.
- **Clean, modular code.** Each function, component, and file has one clear
  responsibility. Small, focused units over large monoliths — but don't split
  things just to hit a line count; split when it actually improves clarity.
- **Prefer repetitive, readable code over clever abstractions.** Don't factor
  something into a generic/DRY pattern unless asked.
- **No guessing missing variables/keys.** If an environment variable, config
  key, or value is absent, stop and ask rather than inventing a value.

## 3. Project Stack & Conventions

- **Language / Framework:** JavaScript (ES modules) with **Next.js 16** using
  the **App Router** (routes are folders under `app/` ending in `page.js`).
- **Database / Auth:** **Supabase** (PostgreSQL + Supabase Auth). Client lives
  in `lib/supabaseClient.js`. Requires `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Auth uses Supabase
  Auth linked to a `users` profile table via `auth.users.id` — not a custom
  `password_hash` column.
- **UI / Styling:** **Tailwind CSS v4** — use `@import "tailwindcss"` syntax,
  not the old `tailwind.config.js` theme-extension pattern. Brand color:
  `#00685F`. Standard input styling:
  `bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#00685F]`.
  Icons via **lucide-react** (uses `currentColor` inheritance). Calendar via
  **FullCalendar** (`@fullcalendar/react`).
- **Layout / architecture:** pages (routes) and feature components live under
  `app/`. Shared components live in `app/components/`. Keep data access in
  `lib/` utilities — component code should not reach directly into Supabase
  queries.
- **Component conventions:**
  - `"use client"` required whenever a component uses hooks or event handlers.
  - `Link` for URL navigation, `button` for same-page actions.
  - Conditional classNames use template literals with ternaries.

## 4. Terminal & Tool Usage Rules

- **Verify paths before executing builds/tests.** Confirm the working
  directory and required files exist before running any command.
- **Run lint after refactoring** any changed files.
- **Standard commands available** in `package.json`:

```sh
npm run dev     # start the development server
npm run build   # production build
npm run lint    # eslint
```

- **Note:** there is no `test` script configured. If a task involves behavior
  changes and tests would normally be expected, confirm with me whether a test
  suite exists before assuming one.

## 5. Code Formatting & Style

- Plain JavaScript — no TypeScript syntax or type annotations.
- **Explicit `try/catch` error handling** with actionable logging — the log
  must state what failed and what can be done about it.
- Explain changes as you make them; don't just report a final status with no
  narrative — see Section 1.
