# AGENTS.md

Notes for AI agents (and future humans) working in this repo. Complements `README.md` (which is
operator-facing and in French).

## Project shape

- **Nuxt 4 SPA** (`ssr: false`, `github_pages` Nitro preset), auto-deploys as a fully static site
  to GitHub Pages via `.github/workflows/autodeploy.yml`. No backend, no server runtime.
- **Stack:** Nuxt 4 with the `app/` directory, Nuxt UI v4, Pinia, valibot, rrule, Tailwind v4,
  Vitest with the Nuxt test environment (`@nuxt/test-utils`, `happy-dom`).
- **Audience:** French (fr-FR), Swiss context (CHF, `map.geo.admin.ch` embeds, LV95 coords).

## Hard constraints (project philosophy — do not violate)

From the README and the project-overview spec:

- **NEVER commit, push, amend, or create PRs unless the operator gives an explicit, per-instance
  instruction.** This is non-negotiable and applies to every repo in the project. The operator
  manages all git operations themselves.
- **No authentication, no cookies, no sessions, no credentials** — non-negotiable.
- **Static front-end stays on GitHub Pages.** Anything stateful goes in a *separate* service.
- **No secrets in the front-end** — the repo is public.
- **No regression on live pages** — the site is in production.

## Commands (gates — run before declaring a task done)

`pnpm` is **not** on the operator's PATH; invoke it via corepack:

```bash
corepack pnpm typecheck   # vue-tsc, exits 0 on success (no "success" message — silence is green)
corepack pnpm lint        # eslint, exits 0 on success
corepack pnpm test        # vitest run
corepack pnpm build       # nuxt build + prerender — verify when touching imports/data files
```

All four should pass before a slice is considered complete.

## Coding conventions

- **No `continue` statements.** Default to positive `if (...) { ... }` blocks. If a `continue`
  ever seems genuinely warranted (e.g., avoiding three levels of nesting on a hot path), make the
  readability/efficiency argument explicitly and let the operator decide. This is an operator
  preference, not a stylistic suggestion.
- **No comments** unless explicitly asked.
- **Colocate tests** as `*.test.ts` next to the module (see `app/utils/eventsLoader.test.ts`,
  `app/utils/nifffLoader.test.ts` for the style: `describe`/`it`/`expect`, minimal helpers,
  smoke-test real fixtures alongside pure-function tests).
- **Separate pure functions from impure wrappers** so the pure core is testable without mocking
  `import.meta.glob` or static imports. Pattern (from `app/utils/nifffLoader.ts`):
  - `parseEditionsFromGlob(files: Record<string, unknown>)` — pure, takes the glob output as a
    parameter.
  - `loadNifffEditions()` — impure, calls `import.meta.glob` and forwards to the pure function.
  - `buildGalleryItems(events, folderImages)` — pure, takes events + an explicit orphan list.
  - `buildYearGalleryItems(year)` — impure, globs the image folder and forwards.
- **Valibot for schema validation.** Reuse the patterns from `app/utils/eventsLoader.ts`
  (`v.optional(v.tuple([v.string(), v.string()]))` for `[label, link]` copyright tuples,
  `v.optional(v.array(...))` for optional lists, explicit per-field schemas rather than
  `v.record` for known shapes). Valibot `v.object` is non-strict by default — unknown keys pass
  through.
- **Keep function bodies flat.** Prefer early-return guards and positive `if` blocks over nested
  conditionals.

## Architecture notes worth knowing

- **`resolveImage` pins all local images to `app/assets/images/`.** It eager-globs an explicit
  array of patterns at module load — flat top-level images + one recursive pattern per known
  project prefix — and looks up the bundled URL by canonical key (path relative to
  `assets/images/`); see `app/utils/assetLinksResolver.ts`. Adding a new project with per-year
  image folders = add one pattern to the array. Co-locating images with data files (e.g., under
  `app/data/`) silently breaks resolution. Per-year image folders for NIFFF live at
  `app/assets/images/nifff/{year}/`, and paths in manifests are full (`nifff/2026/foo.jpg`) so
  every consumer calls `resolveImage` without year-awareness. `resolveImage` rejects any input
  containing a `..` path segment (`/(^|\/)\.\.(\/|$)/`) — path-traversal attempts (e.g.,
  `'nifff/../img_calendar.png'`) return `''` rather than escaping the intended scope.
- **Vite gotcha: `new URL('../dir/${var}', import.meta.url)` does NOT recurse into subdirectories.**
  Vite's static analysis of this pattern only matches direct children of `../dir/`, so nested
  paths (`nifff/2026/foo.jpg`) silently fail to bundle and 404 at runtime. Use an explicit array
  of `import.meta.glob` patterns (one per known project prefix) for recursive asset discovery —
  do **not** use unbounded `**/*` over the whole `assets/images/` tree; keep the recursion scoped
  and opt-in per project. This is why `resolveImage` was rewritten off the `new URL` form.
- **Per-project navigation + theming.** `app/stores/appStore.ts` holds `standardNavigation`,
  `presqueNavigation` (static arrays), and `buildNifffNav()` — a **data-aware** builder that
  includes "Le Programme" only when `loadNifffLatest().length > 0` and "Galerie" only when
  `loadNifffEditions().length > 0`. `changeProject(name)` dispatches to the right nav. The data
  awareness ensures the nav never offers a dead link. `app/themes.ts` holds the palettes. Project
  detection runs in page setup (`index.vue`, `nifff/index.vue`, `presque/index.vue`).
- **`import.meta.glob` is build-time only.** Vite requires statically analyzable patterns; runtime
  globbing per user-selected value isn't possible. For per-year discovery, glob `**/*` once at
  module load and filter by year at call time. Keys are available without awaiting the imports —
  for orphan detection we only need `Object.keys(glob)`, no image bytes loaded.
- **Existing event engine.** `app/utils/eventsLoader.ts` materializes `rrule` recurrences via
  `mergeEvents` and merges `one-off.json` overrides. `CalendarEvent = datedEvent & { cancelled?,
  cancelReason? }`. The NIFFF programme (`app/pages/nifff/programme.vue`) and the events page both
  feed `EventSlideOver` from this pipeline. The `image_copyright: [label, link]` tuple on
  `baseEvent` (`app/types/navigation.ts:22`) is the existing artist-credit pattern, rendered as a
  brush-icon `UButton` in `eventSlideOver.vue:84-90`.

## TypeScript gotchas worth knowing

- **Valibot `v.InferOutput` on schemas with `v.union` can trigger `TS2589 Type instantiation is
  excessively deep`.** Symptom: error reported at a *call site* of a function whose body calls
  `v.parse` on the heavy schema, even if the inferred type is named. Fix: declare explicit
  `interface`s for the exported types and cast the `v.parse` result with `as { ... }` rather than
  relying on `v.InferOutput<typeof schema>`. See `app/utils/nifffLoader.ts` for the pattern.
- **`vue/multi-word-component-names` is enforced.** Single-word component filenames (e.g.
  `Gallery.vue`) lint-error. Use multi-word (`ImageGallery.vue`, matching `StarRating`,
  `AppHeader`, `eventSlideOver`).
- **Don't combine `: NavigationMenuItem[]` array-literal annotations with `Ref<NavigationMenuItem[]>`.**
  Annotating the array literal AS `NavigationMenuItem[]` and then wrapping it in `ref()` causes
  `TS2589` from validating the heavy Nuxt UI type twice. Let TS infer the array literal's type
  from the literal; only annotate the `Ref<NavigationMenuItem[]>`.
- **`@click="x = y"` returns the assigned value**, not `void`. Vue's click handler type expects
  `void | Promise<void>`. Extract a named method (`@click="selectFn(y)"`) or use a block
  (`@click="() => { x = y }"`).
- **UModal's default `content` slot ships with `max-w-lg` (~512px).** If you put a `max-w-[90vw]`
  image (or any wide content) inside, the panel — not the image — is the constraint, and the
  image's max-width is silently ineffective. Override via `:ui="{ content: 'max-w-[90vw]' }"`
  (or whatever size you need). See `app/components/ImageGallery.vue`.
- **UModal teleports its content to `document.body`.** Tests inspecting modal DOM can't use
  `wrapper.find(...)` (only sees the component tree) — use `document.body.querySelector(...)`.
  Add `afterEach(() => { document.body.innerHTML = '' })` so teleported content doesn't leak
  between tests.

## Spec location

Active specs live **outside** the repo at `~/dev/spec/abordajeux.github.io/`:

- `NOTICKET-project-overview.md` — top-level roadmap + Phase 0/1/2 plan.
- `NOTICKET-project-overview/nifff-archives-gallery.md` — the NIFFF archives + reusable Gallery
  feature (per-year JSON archives, flat-ordered `Gallery.vue`, layered copyright model, orphan
  image detection, dedicated `/nifff/galerie` page). Read this before touching NIFFF code.
