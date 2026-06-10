# MOSAIC Agent Instructions

Cursor agents working in this repo must follow the rules in `.cursor/rules/`.

## What this repo is

MOSAIC (Multi-Organization Secure AI Coordination) is an open coordination project on the OWASP Foundation GitHub. This repository holds:

- **Public website** — Hugo static site in `content/mosaic/` (markdown content, HTML layouts, CSS)
- **Project docs** — `docs/` (member orgs, roadmap notes, website editing guide)
- **Deploy automation** — GitHub Actions → Firebase Hosting; `scripts/set-hosting-retention.js` for release retention

**Not in scope here:** application backends, databases, or Python/TypeScript app code. Content edits are markdown; structure changes use Hugo layouts and shortcodes.

## Quick start

1. **Requirements gate** — If goal, success criteria, `@` file refs, or constraints are missing, stop and ask (`requirements-gate.mdc`).
2. **Plan first** — Non-trivial or multi-file work requires a plan and user approval before coding (`plan-first-workflow.mdc`, `multi-agent-workflow.mdc`).
3. **Verify** — After changes, run checks and iterate until green (`verifiable-goals.mdc`):
   - `npm run build:site` (always, for site/content/layout changes)
   - `npm run serve` (optional — manual visual check at http://localhost:3000)
4. **Review** — Substantive work needs independent judge/subagent review (`multi-agent-workflow.mdc`).
5. **Commits** — Do not commit or push unless the user explicitly asks.

## Where to edit what

| Task | Location |
|------|----------|
| Change page text | `content/mosaic/content/*.md` |
| Change navigation | `content/mosaic/data/menu.yaml` |
| Change page structure/components | `content/mosaic/layouts/shortcodes/` |
| Change site chrome (header/footer) | `content/mosaic/layouts/partials/` |
| Change styling | `content/mosaic/static/assets/styles.css` |
| Add static images | `content/mosaic/static/assets/` |
| Repo documentation | `docs/` |
| Site editing guide (read first for website work) | `docs/website.md` |

## Rule index

| Rule | Purpose |
|------|---------|
| `requirements-gate.mdc` | Clarifying questions + requirements template |
| `complete-ticket.mdc` | Ticket gate for `.md`/`.txt` files; uses `requirements-gate` template + coding standards |
| `plan-first-workflow.mdc` | Plan Mode before non-trivial edits |
| `multi-agent-workflow.mdc` | Big changes, approval gates, builder ≠ judge |
| `verifiable-goals.mdc` | Hugo build, CI — show evidence |
| `never-assume.mdc` | No guessing; complete code; minimal scope |
| `autonomous-workflow.mdc` | Execute after approval; no unsolicited commits |
| `context-management.mdc` | `/clear`, `@` refs, stale context recovery |

## MOSAIC commands

```bash
npm run build:site        # Hugo build → content/mosaic/public/
npm run serve             # Serve built site at http://localhost:3000
npm run hosting:retention # Maintainers: cap Firebase release retention (needs service account)
```

Hugo runs from `content/mosaic/` (see `package.json`). CI uses Hugo 0.147.0 extended — match that locally via `npm run build:site`.

## Website conventions

- **Content is markdown only** — no `.html` files in `content/mosaic/content/`.
- **URLs** — `uglyURLs: true` → pages are `/roadmap.html`, `/team.html`, etc. Use root-relative links in markdown.
- **Layout in shortcodes** — cards, sections, hero, news items, etc. live in `content/mosaic/layouts/shortcodes/`. See `docs/website.md` for the full shortcode reference.
- **Do not edit** `content/mosaic/public/` — it is build output (gitignored).
- **Secrets** — never commit `firebase-service-account.json` or other credentials.

## Deploy paths (CI)

Production deploy (`.github/workflows/deploy.yml`) triggers on changes under:

- `content/mosaic/**`
- `scripts/set-hosting-retention.js`
- `.github/workflows/deploy.yml`
- `package.json` / `package-lock.json`

PR previews use `.github/workflows/pr_deploy.yml`.
