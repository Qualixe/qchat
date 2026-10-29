# QChat — Frontend MVP

A frontend-only prototype of an AI-powered social commerce workspace: a unified inbox for Messenger, Instagram, WhatsApp, and web chat, an AI assistant configurator, automations, contacts, products, orders, analytics, integrations, team, and settings — plus a public marketing site and auth screens.

**Everything runs in the browser on sample data.** There is no backend, database, AI model, payment provider, or messaging API. No API keys are needed.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Requires Node.js 20+.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui (Radix) · Lucide · Recharts · React Hook Form + Zod · Sonner (toasts) · next-themes.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing page (hero, features, how it works, integrations, pricing, FAQ, CTA) |
| `/about`, `/privacy`, `/terms` | Clearly-labelled placeholder pages linked from the footer |
| `/login`, `/signup`, `/forgot-password` | Mock authentication screens |
| `/dashboard` | Overview — metrics, charts, recent conversations, activity, AI usage |
| `/inbox` | Three-column unified inbox (list · thread · customer details) |
| `/ai-assistant` | AI configuration, FAQ editor, live preview, test chat |
| `/automations` | Automation list and builder |
| `/contacts` | Customer table with filters, pagination, CRUD, CSV export |
| `/products` | Catalog grid/list with CRUD and mock Shopify status |
| `/orders` | Order table with filters and a details drawer |
| `/analytics` | KPIs and charts with date and channel filters |
| `/integrations` | Simulated channel and store connections |
| `/team` | Members, roles, invites |
| `/settings` | General, business profile, notifications, appearance, subscription, security |

Deep links: `/contacts?q=name`, `/contacts?new=1`, `/products?q=…`, `/products?new=1`, `/settings?tab=subscription` (used by the command palette, `Ctrl/⌘ K`).

## Project structure

```
app/
  (marketing)/        public site — own layout (nav + footer)
  (auth)/             login / signup / forgot-password — split-screen layout
  (app)/              dashboard routes — shared AppShell (sidebar + header)
components/
  ui/                 shadcn/ui primitives (generated)
  layout/             sidebar, header, command palette, nav config
  shared/             design-system pieces: avatars, badges, stat card, empty state, confirm dialog…
  charts/             chart card (with table view), Recharts charts, bar list, filters
  inbox/ dashboard/ ai-assistant/ automations/ contacts/ products/ orders/
  analytics/ integrations/ team/ settings/ marketing/ auth/
lib/
  types/              domain types (Organization, Contact, Conversation, Message, Product, Order…)
  mock-data/          all sample datasets + fixed reference clock
  store/              client store, actions, and selector hooks
  analytics.ts        pure aggregation over the daily metrics dataset
  mock-ai.ts          keyword-matched canned replies (no AI API)
  auth/mock-auth.ts   mock sign-in/up/reset
  format.ts csv.ts storage.ts utils.ts
```

Pages under `app/` are server components that export metadata and render one client "view" component; interactivity lives in `components/*`.

## Data and state

- **Mock data** lives only in `lib/mock-data/` (14 conversations incl. Bangla/Banglish threads, 17 contacts, 14 products, 12 orders, 6 automations, 6 team members, 60 days of generated analytics).
- **One store** (`lib/store/app-store.ts`) holds all app state, built on `useSyncExternalStore`. Components read slices with `useAppStore(selector)` and change data only through exported action functions (`sendMessage`, `addContact`, `toggleAutomation`, …).
- **Persistence:** settings, AI configuration, integrations, automations, and the selected workspace are saved to `localStorage` (prefixed `qchat.`). Operational data (conversations, contacts, products) resets on reload by design. Storage access is wrapped so private mode or blocked storage falls back silently. *Settings → General → Reset demo data* restores everything.
- **Deterministic time:** sample timestamps are anchored to a fixed reference time and formatted with a fixed locale/timezone (`Asia/Dhaka`), so server and client render identical output (no hydration mismatches).

## What is simulated

| Feature | Behaviour |
| --- | --- |
| Authentication | Any email/password "signs in" and stores a display-only session object. Emails ending in `@fail.test` trigger the error state. Nothing is verified, sent, or stored server-side. Password reset sends nothing. |
| AI replies | "AI suggestion" inserts a predefined reply per topic. The assistant preview and test chat use keyword-matched canned responses (`lib/mock-ai.ts`). |
| Customer replies | After you send a message, the customer "types" and sends a canned follow-up a few seconds later. |
| Integrations | Connecting only updates UI state. No OAuth, tokens, or passwords are requested or stored. |
| Automations | Saved and toggled in state; they never run against real messages. |
| Billing / security | Plan changes, 2FA, and session management are UI previews and say so on screen. |
| Attachments / logo upload | Only file metadata is kept for attachments; the logo is stored as a data URL in this browser. |

## Connecting a real backend later

The UI depends on two seams, so a backend (e.g. Supabase) can replace the mocks incrementally:

1. **Data** — swap the initial state in `app-store.ts` for fetched data, and make each action call your API (optimistically updating the store as it does now). Types in `lib/types` mirror table shapes.
2. **Auth** — replace the four functions in `lib/auth/mock-auth.ts` with a real provider; call sites only use their signatures.

AI replies (`lib/mock-ai.ts`, `AI_SUGGESTIONS`) and integration connect/disconnect actions are the natural places to call real services.

## Design notes

- Tokens (colors, radius, chart palette) live in `app/globals.css` with light and dark values; the theme toggle is in the header, account menu, and Settings → Appearance.
- Chart series colors were run through a color-vision-deficiency and contrast validator for both light and dark surfaces. Every chart has a legend or direct labels and a "view as table" toggle.
- Accessibility: semantic landmarks, skip links, labelled icon buttons, visible focus rings, keyboard-operable dialogs/menus (Radix), `prefers-reduced-motion` support, and responsive tables that scroll horizontally instead of overflowing the page.

## Known limitations

- Data resets on reload (except the persisted preferences listed above); nothing is shared between browsers.
- Switching workspaces changes the workspace name only; both demo workspaces share the same sample data.
- The signed-in user shown in the app is always the demo owner, regardless of the email used on the mock login screen.
- Analytics are generated sample data and don't react to actions taken in the inbox.
