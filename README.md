# ToneOp Workspace

Staff workspace for ToneOp. Sign in once, then arrange dashboards, CRMs, landing pages, and tools on a Grafana-style canvas — with a Staging / Production toggle instead of browser bookmarks.

This is Phase 1: frontend only. Auth is a mock BFF. Catalog URLs and dashboard layouts persist in the browser. Google Workspace SSO and a real API come later.

## Tech Stack

| Concern                   | Choice                                  |
| ------------------------- | --------------------------------------- |
| Framework                 | Next.js 16 (App Router)                 |
| Language                  | TypeScript (strict)                     |
| Styling                   | Tailwind CSS 4                          |
| UI primitives             | shadcn-style Radix components           |
| Grid                      | react-grid-layout                       |
| Forms                     | React Hook Form + Zod                   |
| Client state              | Zustand                                 |
| Server/async client state | TanStack Query                          |
| HTTP                      | Axios (`src/lib/api/client.ts`)         |
| Icons                     | Lucide React                            |
| Lint / format             | ESLint + Prettier + Husky / lint-staged |
| Package manager           | npm                                     |

## Architecture Overview

Routes stay thin. Business logic lives in `src/modules/*`. Each domain owns its components, hooks, services, schemas, and types, and only exposes a public `index.ts`.

```
src/
  app/                 # routing, layouts, BFF route handlers
  modules/
    auth/              # sign-in, session, user menu
    catalog/           # app URLs, admin add/edit/remove
    dashboard/         # canvases, drag / resize / panels
    favorites/         # starred apps
  components/          # shared layout + ui primitives
  lib/api/             # shared axios instance
  lib/auth/            # cookies / session helpers
```

`app/` imports from `modules/*`. Modules never import another module's internals — only public exports, or shared code in `lib/` / `components/`.

## Prerequisites

- Node.js 20 or newer (repo developed on Node 24)
- npm 10+
- No backend or database required for Phase 1

## Getting Started

```bash
cd toneop-hub
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/login`.

Demo sign-in (frontend mock):

- Any `@toneopfit.com`, `@toneop.com`, or `@appofit.com` email
- Password at least 8 characters
- Email local part containing `admin` or `crm` sets that role
- **Continue with Google** signs in as `rahul@toneopfit.com` (engineer)
- Admins see **Manage URLs** and can add staging/production links
- After login, use **Edit** on the home canvas to drag, resize, add, or remove panels

CRM agents do not see infra / design apps (Grafana, Vercel, Figma, …).

## Environment Variables

| Key                        | Required | Example                     | Description                                                   |
| -------------------------- | -------- | --------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | yes      | `/api`                      | Axios base URL. Same-origin BFF until a Workspace API exists. |
| `NEXT_PUBLIC_ASSETS_URL`   | no       | `https://assets.toneop.net` | Public asset host.                                            |
| `NEXT_PUBLIC_APP_NAME`     | no       | `ToneOp Workspace`          | Product name in the header and document title.                |

Never commit `.env.local`. `.env.example` is safe to commit.

## Available Scripts

| Script              | What it does               |
| ------------------- | -------------------------- |
| `npm run dev`       | Next.js dev server         |
| `npm run build`     | Production build           |
| `npm run start`     | Serve the production build |
| `npm run lint`      | ESLint                     |
| `npm run format`    | Prettier write             |
| `npm run typecheck` | `tsc --noEmit`             |

## Folder Structure

```
src/
  app/
    (auth)/login/                 # sign-in page
    (workspace)/                  # home canvas
    (workspace)/dashboards/       # dashboard list + editor
    (workspace)/apps/             # app library
    (workspace)/admin/apps/       # admin URL manager
    api/auth/                     # mock BFF
  modules/
    auth/
    catalog/
    dashboard/
    favorites/
  components/ui/
  components/layout/
  lib/api/
  lib/auth/
  proxy.ts                        # cookie session gate (Next.js 16)
```

## Coding Conventions

- **Module boundary:** import other domains only through `index.ts`. Promote shared logic to `lib/` or `components/`.
- **State:** derive values when possible. Zustand for environment, catalog URLs, and dashboard layouts. React Query for session.
- **API:** modules call `fetchWithErrorHandling`. Components never import `axiosInstance`.
- **Forms:** React Hook Form + `zodResolver`. Schema is the source of truth (`z.infer`).
- **Auth token:** cookies only (`access_token`, `workspace_user`), never `localStorage`.
- Commits: `feat|fix|chore|refactor: description`.

## Deployment

Target: Vercel.

- Build command: `npm run build`
- Output: Next.js default
- Set the env vars above. For a deployed preview, point `NEXT_PUBLIC_API_BASE_URL` at that deployment's `/api` origin.
- Workspace is internal: pages send `robots: noindex`.

## Contributing

- Branch: `feat/workspace-...`, `fix/workspace-...`
- Before a PR: `npm run lint`, `npm run typecheck`, `npm run build`
- Keep components under 250 lines; split on responsibility, not line count
