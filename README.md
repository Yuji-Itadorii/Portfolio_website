# Portfolio — Abhay Rawat

Personal site for Abhay Rawat, backend and AI engineer. Static, no runtime framework.

**Live:** https://abhay-rawat.onrender.com

|           |                                                                           |
| --------- | ------------------------------------------------------------------------- |
| Framework | [Astro 7](https://astro.build) — zero JS by default, per-island hydration |
| Language  | TypeScript 6 (strict, `noUncheckedIndexedAccess`)                         |
| Styles    | Tailwind v4 `@theme` tokens + scoped component CSS                        |
| Motion    | [`motion`](https://motion.dev) v13 vanilla API, dynamically imported      |
| Icons     | `astro-icon` + local Iconify packages, inlined as SVG at build            |
| Fonts     | Self-hosted variable fonts (Sora, Inter, JetBrains Mono)                  |
| Hosting   | Render **Static Site** (`render.yaml`)                                    |
| Forms     | [Web3Forms](https://web3forms.com) — no backend                           |

Lighthouse **100 / 100 / 100 / 100** desktop, **98 / 100 / 100 / 100** mobile.
LCP 0.5 s desktop, 2.3 s on throttled mobile. CLS 0. ~24 KB of JS ships, none of it on the critical path.

> Measure against `npm run serve`, not `astro preview` — the former compresses like Render does. Auditing uncompressed reports ~75 % more bytes and costs about 10 mobile perf points that production never actually pays.

---

## Getting started

```bash
npm ci
cp .env.example .env.local   # optional, see "Contact form"
npm run dev                  # http://localhost:4321
```

Requires Node ≥ 22.12 (see `.nvmrc`).

## Scripts

| Script             | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | Dev server with HMR                                  |
| `npm run build`    | Static build to `dist/`                              |
| `npm run preview`  | Serve `dist/` — **verify against this, never `dev`** |
| `npm run check`    | `astro check` (typechecks `.astro` and `.ts`)        |
| `npm run lint`     | ESLint, zero-warning policy                          |
| `npm run format`   | Prettier write                                       |
| `npm run verify`   | check + lint + format:check + build — the CI gate    |
| `npm run test:e2e` | Playwright smoke suite (builds first)                |
| `npm run lhci`     | Lighthouse CI against asserted budgets               |
| `npm run images`   | Regenerate hero art — one-shot, see below            |
| `npm run brand`    | Regenerate favicons + `og.png` — one-shot            |

## Editing content

**All content lives in `src/content/` as typed TypeScript.** No markup editing needed, and `astro check` catches a typo'd icon name or broken cross-reference at build time.

| File                                                          | Holds                                                                             |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `profile.ts`                                                  | Name, rotating roles, tagline, bio, contact details                               |
| `experience.ts`                                               | Work history. `highlights[].metric` pulls a figure out as a large mono number     |
| `projects.ts`                                                 | Projects. `featured: true` gets a full card; the rest a compact grid              |
| `skills.ts`                                                   | Six grouped categories                                                            |
| `education.ts`, `achievements.ts`, `socials.ts`, `metrics.ts` | Self-explanatory                                                                  |
| `seo.ts`                                                      | Meta description, OG config, JSON-LD `Person` schema                              |
| `index.ts`                                                    | Also defines `sections` — the one source of truth for nav, scroll-spy and palette |

Icon names are Iconify identifiers (`devicon:java`, `simple-icons:redis`, `lucide:workflow`). Anything with no brand mark uses `{ kind: "text" }` and renders as a monospace pill instead of a placeholder logo.

## Adding your resume

Drop the PDF at `public/Abhay_Rawat_Resume.pdf`.

Until it exists, `src/lib/resume.ts` emits a build warning and every resume CTA degrades to an email link — the site never ships a download that 404s. `render.yaml` rewrites `/resume` to the PDF.

## Contact form

Web3Forms, so there is no server.

1. Get a free access key at https://web3forms.com.
2. Add it to `.env.local` as `PUBLIC_WEB3FORMS_KEY=...`, and to the Render dashboard for production.
3. **Set the domain allowlist in the Web3Forms dashboard** to the live host.

The key is `PUBLIC_` because it ships in the client bundle. That's how Web3Forms works and is not a leak — the real spam protections are the honeypot field and that domain allowlist.

**With no key configured the form is replaced by a mailto fallback**, so forks and local builds degrade cleanly instead of rendering a form that silently fails.

To test without emailing yourself, see `tests/smoke.spec.ts`: invalid submissions never reach the network, and both the success and error branches are driven by `page.route` mocks.

## The hero parallax

Twelve layers of forest art, carried over from v1 but rebuilt:

- **`src/components/hero/layers.ts`** — one table of per-layer `dx`/`dy`/`scale`/`overscan`, replacing v1's twelve-case `switch`. v1 also had the parallax inverted, with background layers moving fastest; the depth ordering is corrected here.
- **`parallax.ts`** — twelve WAAPI animations on a _single_ scroll timeline via Motion's `scroll()`, which compiles to a native `ScrollTimeline` off the main thread where supported. v1 registered twelve unthrottled `scroll` listeners, each writing `style.left` and forcing layout.
- **Dynamically imported, deferred to idle.** Motion is ~69 KB and cost 823 ms of main-thread parse on a throttled phone when loaded eagerly. The hero is fully painted and readable before it runs.
- **`prefers-reduced-motion`** — the module is never fetched at all. Base transforms are identity, so the static state is a complete illustration rather than a half-shifted one.
- **Mobile** — v1 downloaded 453 KB of PNG then `display: none`'d most of it. Now: AVIF/WebP at three widths, two layers genuinely dropped (`display:none` **and** `loading="lazy"`, so they're never fetched), motion damped to 45 %, and the landscape art laid out as a bottom band instead of cropped to a sliver of ground.

The driver is asset-agnostic: swapping in different artwork is a file replacement, not a code change.

### Regenerating the art

Sources live in `src/assets/hero-src/`, outside `public/`, so originals never ship.

```bash
npm run images   # -> public/hero/{id}-{640,1024,1920}.{avif,webp,png}
```

Commit the output. This is deliberately **not** part of the Render build — the inputs never change, so re-encoding on every deploy would waste build minutes producing identical files.

## Deploying to Render

`render.yaml` is a Blueprint for a **Static Site**.

> [!IMPORTANT]
> **Render service types are immutable.** The v1 deployment is a _Web Service_ (it ran `node app.js`, which no longer exists). There is no in-place conversion, and Render will not let a new service claim a subdomain another service still holds.

To migrate while keeping `abhay-rawat.onrender.com`:

1. Create a **new Static Site** under a temporary name (e.g. `abhay-rawat-v2`) pointed at this branch. Build `npm ci && npm run build`, publish `./dist`.
2. Verify it on its own preview URL — Lighthouse, contact form, parallax on a real phone.
3. Delete the old Web Service, then **immediately** rename the new Static Site to `abhay-rawat` to reclaim the subdomain. Do it in one sitting; there is a short window where the name is unclaimed.
4. Point the Static Site's branch at `main` and merge.

Sanity-check before pushing:

```bash
rm -rf node_modules dist
npm ci && npm run build
npx serve dist          # if a plain static file server works, Render will
```

A custom domain removes this problem permanently, and Render keeps the `onrender.com` subdomain alongside one.

## What changed from v1

v1 was a single 322-line `index.html`, a 478-line stylesheet with no variables, 81 lines of JS registering twelve unthrottled scroll listeners, and an Express server whose only job — a Mailchimp contact form — was broken: malformed `auth`, missing `Content-Type`, a server-side `alert()` call, and `const port = 3000 || process.env.PORT` written backwards so `PORT` was never read.

Beyond the rewrite:

- **Added an Experience section.** v1 had none, and still described its author as a final-year student.
- 21 skill icons with `alt=""` → grouped, labelled, and described.
- No page `<h1>` plus four competing section `<h1>`s → one `<h1>`, correct heading order.
- No focus styles anywhere → visible `:focus-visible` rings, a skip link, and a keyboard-driven command palette (<kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>).
- No meta description, OG tags, sitemap or robots.txt → all present, plus JSON-LD `Person` and a generated `og:image`.
- Hotlinked third-party emoji favicon → a generated icon set served from origin.
- Brand orange `#ff6f00` / `#ff760d` failed WCAG AA as text at ~2.8:1. The hue survives as `--accent-graphic` for non-text use; readable text resolves to `#C2410C` (light, 4.92:1) and `#FB923C` (dark, 8.36:1).
- `<input type="number">` for a phone number → `type="tel"`.
- Dark mode, with no flash of the wrong theme on load.

`git tag v1-legacy` marks the final commit of the old site.
