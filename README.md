# Tradeshifter — Bangladesh Export Platform

> Register as an exporter and start getting payments from international buyers.
> Bangladesh Bank FE Circular 42/43/48 compliant · Built with Next.js 14, Supabase, OpenAI.

---

## Design system

**FCS Token System** — dark-mode native, institutional, compliance-forward.

| Token | Hex | Role | WCAG on void |
|---|---|---|---|
| `fcs-void` | `#0a0a0a` | Page background, overlays | — |
| `fcs-depth` | `#1a3a5c` | Cards, navigation | — |
| `fcs-output` | `#f5f3ee` | Body text on dark | 15.5:1 AAA |
| `fcs-signal` | `#c8a84b` | CTAs, links, accents | 8.5:1 AAA |
| `fcs-signal-dark` | `#a08538` | Hover, borders | 5.4:1 AA |
| `fcs-signal-light` | `#e8c870` | Highlights, badges, focus | 11.2:1 AAA |

CSS variable fallback lives in `app/globals.css`. Tailwind config in `tailwind.config.js`.

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/your-org/tradeshifter.git
cd tradeshifter
npm install
```

### 2. Configure environment

```bash
cp env.local.template .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run the schema:

```bash
# Option A — Supabase CLI
supabase db push

# Option B — Dashboard
# Paste supabase/schema.sql into SQL Editor → Run
```

3. Auth settings (Dashboard → Authentication → URL Configuration):
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

4. Enable **Email** provider in Authentication → Providers

### 4. Run dev server

```bash
npm run dev
# → http://localhost:3000
```

### 5. Type checking and linting

```bash
npm run type-check   # tsc --noEmit
npm run lint         # next lint
npm run build        # production build check
```

---

## Project structure

```
tradeshifter/
├── app/
│   ├── page.tsx                    Landing page (FCS dark hero)
│   ├── layout.tsx                  Root layout (Inter font, metadata)
│   ├── globals.css                 FCS token system + component classes
│   ├── auth/
│   │   ├── sign-in/page.tsx        Sign in (email + magic link)
│   │   ├── sign-up/page.tsx        Sign up
│   │   └── callback/route.ts       Supabase auth callback
│   ├── dashboard/page.tsx          Exporter dashboard (readiness score)
│   ├── onboarding/page.tsx         4-step wizard (regions, profile, platforms, KYC)
│   ├── ai-interview/page.tsx       ExportGuide AI streaming chat
│   ├── report/page.tsx             Export opportunity report
│   ├── compliance/page.tsx         FE Circular reference + disclaimer
│   └── api/ai-chat/route.ts        AI streaming endpoint (Edge)
├── components/
│   ├── layout/Nav.tsx              Sticky nav + mobile hamburger
│   ├── ui/
│   │   ├── Button.tsx              btn-primary / btn-secondary / btn-ghost
│   │   ├── Card.tsx                card-depth / card-void / card-signal
│   │   ├── Badge.tsx               badge-signal / badge-depth / badge-muted
│   │   ├── Input.tsx               input-fcs + Select
│   │   └── ProgressBar.tsx         FCS signal progress bar
│   ├── compliance/
│   │   └── DisclaimerBanner.tsx
│   ├── report/
│   │   └── ReportDownloadButton.tsx
│   └── dashboard/
│       └── ReadinessGauge.tsx
├── lib/
│   ├── ai-prompts.ts               ExportGuide system prompt + regional matrix
│   ├── compliance.ts               FE Circular static content
│   ├── validators.ts               Zod schemas
│   ├── supabase.ts                 Browser + server + service clients
│   └── utils.ts                    cn(), formatBDT(), formatUSD()
├── types/index.ts                  Shared TypeScript types
├── supabase/schema.sql             PostgreSQL schema + RLS policies
├── middleware.ts                   Route protection
├── tailwind.config.js              FCS token system
├── next.config.js                  Security headers, config
└── env.local.template              Environment variable guide
```

---

## GGS (Gold Supplier) conditional logic

The Alibaba Gold Supplier CTA renders **only** when the user selects Alibaba in Step 3 of the wizard. Implementation:

```tsx
// app/onboarding/page.tsx — Step 3
const alibabaSelected = platforms.includes('alibaba')

// Renders inline beneath the Alibaba card:
{isAli && sel && (
  <div role="complementary" aria-label="Gold Supplier consultation">
    ...Book free GGS call...
  </div>
)}

// app/report/page.tsx — reads from DB
const alibabaWanted = (aiData.selected_platforms ?? []).includes('alibaba')
{alibabaWanted && <GGSCtaSection />}
```

---

## Accessibility

| Element | Implementation |
|---|---|
| Colour contrast | output/void 15.5:1 AAA · signal/void 8.5:1 AAA · output/depth 11.2:1 AAA |
| Touch targets | All buttons, inputs, checkboxes `min-height: 44px; min-width: 44px` |
| Focus rings | `box-shadow: 0 0 0 3px rgba(200,168,75,0.45)` on all interactive elements |
| Keyboard navigation | All custom controls have `tabIndex`, `onKeyDown` (Space/Enter), `role`, `aria-checked` / `aria-selected` |
| Screen readers | `aria-label`, `aria-live`, `aria-current="step"` on wizard, `role="alert"` on errors |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` kills all animations |
| Forced colours | `.btn-primary { border: 2px solid ButtonText }` in high-contrast mode |

---

## Responsive breakpoints

| Breakpoint | Width | Key changes |
|---|---|---|
| Mobile | 320px | Single-column grids, hero font 22px, full-width CTAs |
| Tablet | 640px | 2-column value cards, nav links visible |
| Desktop | 1024px+ | 3-column how-it-works, max-width 1140px |

---

## Vercel deployment

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

Update Supabase for production:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`

---

## Regulatory disclaimer

All content references Bangladesh Bank FE Circular Nos. 42, 43, and 48. Tradeshifter provides educational guidance only. Nothing on this platform constitutes legal, tax, or financial advice. Exporters must independently verify all requirements with their Authorised Dealer (AD) bank.

---

## Supabase type generation

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > types/supabase.ts
```

---

*Built for Bangladeshi exporters ready to go global.* 🇧🇩 → 🌏
