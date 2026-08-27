# MOSAIC website — editing guide

This guide explains how the MOSAIC public website is built, where every file lives, and exactly how to change content, navigation, layout, and styling.

**Golden rule:** if you want to change *what the site says*, edit a `.md` file under `website/content/`. You should not need to touch HTML templates for routine content updates.

---

## Table of contents

1. [How the site works](#how-the-site-works)
2. [Directory map](#directory-map)
3. [Build and preview locally](#build-and-preview-locally)
4. [Editing page content (markdown)](#editing-page-content-markdown)
5. [Page front matter reference](#page-front-matter-reference)
6. [Shortcodes — layout building blocks](#shortcodes--layout-building-blocks)
7. [Editing the navigation menu](#editing-the-navigation-menu)
8. [Adding a new page](#adding-a-new-page)
9. [Editing page-specific content patterns](#editing-page-specific-content-patterns)
10. [Editing Hugo templates (HTML)](#editing-hugo-templates-html)
11. [Editing CSS and static assets](#editing-css-and-static-assets)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## How the site works

The site is a [Hugo](https://gohugo.io/) static site rooted at `website/`.

| Step | What happens |
|------|----------------|
| 1 | You edit markdown (`.md`) files in `website/content/` |
| 2 | Hugo merges each page's markdown with HTML **layouts** and **shortcodes** |
| 3 | Hugo writes plain HTML to `website/public/` |
| 4 | GitHub Actions deploys `public/` to Firebase Hosting |

Every page shares the same chrome (header, footer, fonts, CSS) via `layouts/_default/baseof.html`. Page bodies come from markdown.

**URLs** use `uglyURLs: true` in `hugo.yaml`, so pages are served as `/roadmap.html`, `/team.html`, etc. (not `/roadmap/`). Keep internal links in that form: `/roadmap.html`.

---

## Directory map

```
website/                  ← Hugo site root (run `hugo` from here)
├── hugo.yaml                    ← Site config (title, base URL, params)
├── content/                     ← ★ PAGE CONTENT — edit these .md files
│   ├── _index.md                ← Home page
│   ├── roadmap.md
│   ├── team.md
│   ├── news.md
│   ├── collab.md                ← "Ecosystem" in the nav
│   └── privacy.md
├── data/
│   └── menu.yaml                ← ★ NAVIGATION — header + footer links
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          ← HTML shell (head, header, footer, scripts)
│   │   └── single.html          ← Default page wrapper (page-head + content)
│   ├── index.html               ← Home page wrapper (content only, no page-head)
│   ├── partials/
│   │   ├── head.html            ← <title>, meta description, CSS link
│   │   ├── header.html          ← Top nav (reads menu.yaml)
│   │   ├── footer.html          ← Footer links (reads menu.yaml)
│   │   ├── page-head.html       ← Breadcrumb + H1 + subtitle (from front matter)
│   │   └── icons/               ← SVG icons used by shortcodes
│   └── shortcodes/              ← Reusable components invoked from markdown
├── static/
│   └── assets/
│       ├── styles.css           ← ★ All site styling
│       ├── gh-stars.js          ← GitHub star count in header
│       ├── logo.png             ← Logo (add if missing locally)
│       ├── team.jpg
│       └── roadmap.png
├── public/                      ← Build output (gitignored, do not edit)
├── scripts/                     ← Maintainer scripts (set-hosting-retention.js); ignored by Hugo
├── package.json                 ← npm project root (npx wrappers + deps); ignored by Hugo
├── package-lock.json
└── firebase.json                ← Firebase Hosting config

docs/website.md                  ← This guide
.github/workflows/deploy.yml     ← Production deploy on push to main
```

**Not part of the website build:** `docs/` (repo documentation) and root `README.md`. Inside the Hugo root, `website/scripts/`, `website/package.json`, `website/package-lock.json`, and `node_modules/` are ignored by Hugo and never leak into `public/`.

---

## Build and preview locally

From `website/` (the npm project root — `package.json` lives here):

```bash
cd website
npm run build:site    # builds to website/public/
npm run serve         # serves public/ at http://localhost:3000
```

Or invoke Hugo directly, also from `website/`:

```bash
npx hugo-extended@0.147.0 --gc --minify
npx serve public -p 3000
```

After every content change, rebuild and refresh the browser. There is no hot-reload configured.

---

## Editing page content (markdown)

### Which file to open

| Page | File |
|------|------|
| Home | `website/content/_index.md` |
| Roadmap | `website/content/roadmap.md` |
| Team | `website/content/team.md` |
| News | `website/content/news.md` |
| Ecosystem | `website/content/collab.md` |
| Privacy | `website/content/privacy.md` |

### Structure of a markdown page

Every page file has two parts:

```markdown
---
title: "Page title — MOSAIC"       # Browser tab + SEO
description: "Short summary..."      # Meta description for search/social
heading: "Visible H1"                # Optional — enables the page header band
subtitle: "One line under the H1"    # Optional
breadcrumb: "Label in breadcrumb"    # Optional — shown as "Home / Label"
---

Your page body starts here.
Use markdown headings, paragraphs, links, and shortcodes.
```

- **Home** (`_index.md`) does not use `heading` / `subtitle` / `breadcrumb` — it starts with a `{{< hero >}}` block instead.
- **Inner pages** (roadmap, team, news, etc.) set `heading`, `subtitle`, and `breadcrumb` to render the grey page-head band automatically.

### Plain markdown you can use anywhere

Inside `{{< prose >}}`, `{{< news-item >}}`, `{{< stage >}}`, and similar shortcodes that process markdown:

```markdown
## Section heading

Regular paragraph with **bold** and [a link](/team.html).

- Bullet one
- Bullet two
```

Use root-relative asset paths for images: `![Alt text](/assets/team.jpg)`.

Use root-relative links for internal pages: `[Team](/team.html)`.

---

## Page front matter reference

| Field | Required | Used on | Purpose |
|-------|----------|---------|---------|
| `title` | Yes | All | `<title>` tag |
| `description` | Yes | All | `<meta name="description">` |
| `heading` | Inner pages | Roadmap, Team, News, Ecosystem, Privacy | Large H1 in page-head |
| `subtitle` | Optional | Inner pages | Subtitle under H1 |
| `breadcrumb` | Optional | Inner pages | Breadcrumb label after "Home /" |

Example — editing the Roadmap intro line only:

```yaml
subtitle: "Your new subtitle here."
```

Rebuild to preview. No template change needed.

---

## Shortcodes — layout building blocks

Shortcodes are Hugo's way to insert styled HTML components from markdown without writing raw HTML. Syntax:

```markdown
{{< shortcode-name param="value" >}}
Content here
{{< /shortcode-name >}}
```

Self-closing (no inner content):

```markdown
{{< section-head eyebrow="Label" title="Title" >}}
```

### Layout wrappers

| Shortcode | Purpose | Example |
|-----------|---------|---------|
| `hero` | Full-width home hero | `{{< hero >}}...{{< /hero >}}` |
| `section` | Standard content section with `.wrap` | `{{< section >}}` or `{{< section soft >}}` for grey background |
| `section-wide` | Section without inner `.wrap` (you add layout inside) | `{{< section-wide soft >}}` |
| `grid` | 2- or 3-column grid | `{{< grid cols="3" >}}` |
| `prose` | Typography block for long text | `{{< prose >}}` markdown `{{< /prose >}}` |
| `narrow` | Centered narrow column | `{{< narrow width="840" >}}` |
| `wrap` | Standalone `.wrap` container | `{{< wrap style="margin-top:32px;" >}}` |

### Page chrome components

| Shortcode | Purpose |
|-----------|---------|
| `section-head` | Eyebrow label + H3 title + optional subtitle. Params: `eyebrow`, `title`, `subtitle` |
| `eyebrow` | Small caps label line |
| `accent` | Teal accent span inside a heading |
| `framed` | Bordered image frame |
| `btn` | Button. Params: `href`, `primary`, `secondary`, `external`, `github`, `arrow` |
| `btn-row` | Horizontal button group |
| `badge` / `badges` | Home page status pills. Badge colors: `green`, `teal`, `navy`, `blue` |
| `checklist` | Green-tick bullet list (one item per line, no `-` prefix) |
| `org-chips` | Row of organization name chips (one name per line) |
| `people` | Team roster list. Format: `Name \| ORG` per line (omit `\| ORG` if none) |

### Content-type components

| Shortcode | Purpose |
|-----------|---------|
| `card` | Bordered card. Param: `title` |
| `icon-card` | Card with icon. Params: `icon` (`warning`, `grid`, `chart`), `title` |
| `stage` | Roadmap timeline block. Params: `when`, `now`, `mid` |
| `news-item` | News article block. Param: `source` |
| `read-link` | External "read more" link with icon. Param: `href` |
| `eco-card` | Ecosystem grid card. Params: `status`, `title`, `icon`, `live` |
| `cta-card` | Horizontal call-to-action card (Ecosystem page) |
| `team-hero` | Team photo + caption block |
| `people-block` | Team people section wrapper |

### Docs-style layout (Roadmap)

| Shortcode | Purpose |
|-----------|---------|
| `docs` | Outer docs layout wrapper |
| `docs-aside` | Left "On this page" nav. Format: `id\|Label` one per line |
| `docs-main` | Main docs content column (processes markdown) |

### Examples

**Change a button label on the home page** — edit `_index.md`:

```markdown
{{< btn href="/roadmap.html" secondary="true" arrow="true" >}}Read the roadmap{{< /btn >}}
```

**Add a founding organization chip on the home page** — edit `_index.md`, inside `{{< org-chips >}}`:

```markdown
{{< org-chips >}}
BIML
Center for Internet Security (CIS)
Your New Organization Name
{{< /org-chips >}}
```

**Add a news article** — edit `news.md`:

```markdown
{{< news-item source="Publisher · Date" >}}
## Headline here

First paragraph.

Second paragraph.

{{< read-link href="https://example.com/article" >}}Read the full article{{< /read-link >}}
{{< /news-item >}}
```

**Add a person to the team page** — edit `team.md`, inside `{{< people >}}`:

```markdown
Jane Doe | NIST
```

Use `Name only` (no `|`) when there is no org abbreviation.

**Checklist** (roadmap, privacy, cards):

```markdown
{{< checklist >}}
First item (supports **bold** markdown)
Second item
{{< /checklist >}}
```

---

## Editing the navigation menu

Navigation is **not** in the markdown pages. It lives in one data file:

**File:** `website/data/menu.yaml`

### Header menu

```yaml
main:
  - label: Home              # Visible text
    url: /index.html         # Link target
    match: home              # Used for "active" highlight (see below)
  - label: Roadmap
    url: /roadmap.html
    match: roadmap           # Must match the page filename without .md
```

The `match` field controls which nav item gets the `active` class:

| `match` value | Active when |
|---------------|-------------|
| `home` | On the home page |
| `roadmap` | On `roadmap.md` |
| `team` | On `team.md` |
| `news` | On `news.md` |
| `collab` | On `collab.md` |

`match` must equal the markdown filename (without extension). The Ecosystem page file is `collab.md`, so `match: collab`.

### Footer menu

```yaml
footer:
  - label: News
    url: /news.html
  - label: Privacy
    url: /privacy.html
```

### Social links (footer icons)

```yaml
social:
  - label: GitHub
    url: https://github.com/OWASP/MOSAIC/#mosaic
    icon: github
  - label: LinkedIn
    url: https://www.linkedin.com/company/mosaic-standards/about/
    icon: linkedin
```

Supported `icon` values: `github`, `linkedin` (see `layouts/partials/icons/`).

### Reorder or rename a menu item

1. Edit `label` and/or reorder entries in `menu.yaml`.
2. Rebuild. No template edit needed unless you add a page that needs a new `match` value.

---

## Adding a new page

Example: add a **"Resources"** page at `/resources.html`.

### Step 1 — Create the markdown file

Create `website/content/resources.md`:

```markdown
---
title: "Resources — MOSAIC"
description: "Curated resources from MOSAIC participants."
heading: "Resources"
subtitle: "Guides, templates, and reference material."
breadcrumb: "Resources"
---

{{< section >}}
{{< prose >}}
## Getting started

Your content here. Write in markdown.

- Resource one
- Resource two
{{< /prose >}}
{{< /section >}}
```

### Step 2 — Add to the navigation

Edit `website/data/menu.yaml`:

```yaml
main:
  # ... existing items ...
  - label: Resources
    url: /resources.html
    match: resources
```

Insert where you want it in the menu order.

### Step 3 — (Optional) Add to the footer

```yaml
footer:
  - label: Resources
    url: /resources.html
```

### Step 4 — Build and verify

```bash
cd website
npm run build:site
npm run serve
```

Open http://localhost:3000/resources.html

### Step 5 — Link to the page from other content

In any markdown file:

```markdown
[Resources](/resources.html)
```

### Choosing a layout pattern for the new page

| Page style | Pattern to copy |
|------------|-----------------|
| Simple text page | `privacy.md` — `section` + `prose` |
| Page with sidebar TOC | `roadmap.md` — `docs` + `docs-aside` + `docs-main` |
| List of articles | `news.md` — `news-item` shortcodes |
| Card grid | `collab.md` — `grid` + `eco-card` or `icon-card` |

---

## Editing page-specific content patterns

### Home (`_index.md`)

The home page is the longest file. It is organized into `{{< section >}}` blocks:

1. **Hero** — headline, lede paragraph, buttons, badges
2. **Team teaser** — photo + link to team page
3. **What is MOSAIC** — prose
4. **The problem** — three `icon-card` columns
5. **How MOSAIC began** — two cards + checklist
6. **Founding participants** — org chips

To change the hero headline, edit the `<h2>` inside `{{< hero >}}`:

```markdown
<h2>Collective coordination on {{< accent >}}AI security standardization.{{< /accent >}}</h2>
```

To change badge text, edit inside `{{< badges >}}`.

### Roadmap (`roadmap.md`)

Uses the docs layout with a sidebar. To add a sidebar section:

1. Add a line to `{{< docs-aside >}}`:
   ```
   new-section|Label in sidebar
   ```
2. Add a heading in `{{< docs-main >}}` with a matching ID:
   ```markdown
   ## New section title {#new-section}
   ```

To add a roadmap milestone, copy an existing `{{< stage >}}` block and edit.

### Team (`team.md`)

- **Org chips** — `{{< org-chips >}}` block at the top
- **People in photo** — `{{< people >}}` with `Name | ORG` lines
- **Not pictured** — second `{{< people >}}` block

### News (`news.md`)

Each announcement is one `{{< news-item >}}` block. Add new blocks above or below existing ones.

### Ecosystem (`collab.md`)

GitHub CTA at top (`{{< cta-card >}}`), then a 3-column `{{< eco-card >}}` grid.

Eco card icons: `slack`, `roadmap`, `changelog`, `integrations`, `members`, `github`.

### Privacy (`privacy.md`)

Straightforward markdown inside `{{< prose >}}`. Update the "Last updated" line at the top when you revise the notice.

---

## Editing Hugo templates (HTML)

**Only edit templates when you need to change site-wide structure, not page text.**

### When to edit which template

| Goal | File |
|------|------|
| Change `<title>` / meta / fonts | `layouts/partials/head.html` |
| Change header logo, nav structure | `layouts/partials/header.html` |
| Change footer text or layout | `layouts/partials/footer.html` |
| Change page-head (breadcrumb area) | `layouts/partials/page-head.html` |
| Add site-wide scripts | `layouts/_default/baseof.html` |
| Change how inner pages render | `layouts/_default/single.html` |
| Change home page wrapper | `layouts/index.html` |
| Add/modify a shortcode | `layouts/shortcodes/<name>.html` |
| Add an SVG icon | `layouts/partials/icons/<name>.html` |

### Template hierarchy

```
baseof.html
  ├── partial "head.html"
  ├── partial "header.html"
  ├── block "main"  ← filled by index.html or single.html
  └── partial "footer.html"
```

`single.html` (inner pages):

```html
{{ define "main" }}
{{ partial "page-head.html" . }}
{{ .Content }}
{{ end }}
```

`.Content` is the rendered markdown body.

### Adding a new shortcode

1. Create `website/layouts/shortcodes/my-component.html`
2. Use it in markdown: `{{< my-component >}}...{{< /my-component >}}`
3. Document it in this file
4. Rebuild

Shortcode templates can access:

- `.Get "param"` — named parameter
- `.Inner` — content between opening/closing tags
- `.Page.RenderString` — process markdown inside a string
- `partial "icons/github.html" .` — include an icon partial

### Site config

**File:** `website/hugo.yaml`

| Key | Purpose |
|-----|---------|
| `baseURL` | Canonical site URL |
| `uglyURLs` | Keep `true` — produces `.html` URLs |
| `params.githubRepo` | Used by `gh-stars.js` for star count |

---

## Editing CSS and static assets

### Stylesheet

**File:** `website/static/assets/styles.css`

All visual design lives here: colors, typography, grids, cards, header, footer, responsive rules. CSS variables at the top (`:root`) define the brand palette.

After CSS changes, rebuild — Hugo copies `static/` files into `public/` unchanged.

### Images

Place images in `website/static/assets/`:

| File | Used on |
|------|---------|
| `logo.png` | Header, footer, favicon |
| `team.jpg` | Home teaser, Team page |
| `roadmap.png` | Roadmap page |

Reference in markdown as `/assets/filename.jpg` (leading slash, from site root).

### JavaScript

`static/assets/gh-stars.js` fetches the GitHub star count for the header. Loaded from `baseof.html`.

### Analytics

GoatCounter snippet is in `layouts/_default/baseof.html`. See [CONTRIBUTING.md — Analytics](../CONTRIBUTING.md#analytics).

---

## Deployment

- **Production:** pushing changes under `website/` to `main` triggers `.github/workflows/deploy.yml`
- **PR previews:** `.github/workflows/pr_deploy.yml` posts a temporary Firebase preview URL
- **Live site:** https://mozaic-56ca8.web.app

You do not deploy manually for normal content edits — merge to `main`.

---

## Troubleshooting

### Build fails with a shortcode error

- Check that every `{{< foo >}}` has a matching `{{< /foo >}}` (unless self-closing).
- Parameter syntax: `{{< btn href="/team.html" secondary="true" >}}` — quotes around values.

### Page renders but looks wrong

- Rebuild: `npm run build:site`
- Hard-refresh the browser
- Compare with another page that uses the same shortcode pattern

### Sidebar link jumps to wrong section

- The `docs-aside` `id` must match the heading ID: `## Title {#my-id}`
- Hugo auto-generates IDs from headings if you omit `{#id}` — those won't match custom aside IDs

### New page returns 404 locally

- Filename must be `pagename.md` → served as `/pagename.html`
- Rebuild after creating the file

### Menu item not highlighted

- `match` in `menu.yaml` must equal the markdown filename (without `.md`)

### `checklist` shows wrong formatting

- Use the `{{< checklist >}}` shortcode — one item per line, no leading `-`

---

## Quick reference — common tasks

| Task | Where to edit |
|------|----------------|
| Change a paragraph | The relevant `.md` file in `content/` |
| Change nav label or order | `data/menu.yaml` |
| Add a page | New `content/*.md` + `menu.yaml` entry |
| Add a news post | `content/news.md` |
| Add a team member | `content/team.md` → `{{< people >}}` |
| Change button / card / section layout | Same `.md` file, adjust shortcodes |
| Change colors / fonts / spacing | `static/assets/styles.css` |
| Change header/footer structure | `layouts/partials/header.html` or `footer.html` |
| Change site-wide `<head>` | `layouts/partials/head.html` |
