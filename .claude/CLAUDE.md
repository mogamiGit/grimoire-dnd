# Session Defaults

- **Caveman mode**: Always active (full). Respond terse, drop filler, fragments OK. Technical substance stays.
- **Lexis MCP**: Always use Lexis tools (`search_code`, `get_symbol`, `read_file`, `find_references`, etc.) instead of Read/Grep/Glob for code search. Lexis is ~10x more token-efficient.
- **Language**: Respond in Spanish when discussing content. English for code/commits/technical.

# Grimoire DnD — Project Context

## What Is This

Obsidian vault + Astro Starlight digital garden for a D&D 5e campaign ("Tomb of Annihilation").
Published at **dnd.mogamihub.xyz** via Vercel.
Primary language: **Spanish** (content). English (config/code).

## Stack

- **Obsidian** — local vault editor
- **Astro 7** — static site framework
- **Starlight 0.41** — documentation theme for Astro
- **starlight-obsidian 0.13** — Obsidian vault integration for Starlight
- **Tailwind CSS v4** — styling (via `@tailwindcss/vite`)
- **Node.js ≥22**, TypeScript
- **Prettier** + **Husky** — code formatting with pre-commit hook (lint-staged)
- **GitHub Actions** — CI/CD (deploy to Vercel, frontmatter validation, spell check, link check)
- **Vercel** — hosting

## Directory Structure

```
.
├── index.md                  # Site entry point (Obsidian)
├── diario/                   # Campaign session diaries (narrative logs)
│   ├── index.md
│   └── day-*.md / session-*.md
├── personajes/               # Player characters
│   ├── index.md
│   └── *.md                  # Individual character sheets
├── reglas/                   # D&D 5e rules reference
│   └── index.md
├── _templates/               # Obsidian templates (not published)
│   ├── plantilla-diario.md   # Diary entry template
│   ├── plantilla-wiki.md     # Wiki entry template
│   └── plantilla-personaje.md # Character entry template
├── _rules/                   # D&D 5e SRD markdown (git submodule, not published)
├── _docs/                    # Internal docs (not published)
├── grimoire-astro/           # Astro Starlight project
│   ├── astro.config.mjs      # Astro + Starlight + starlight-obsidian config
│   ├── src/
│   │   ├── content.config.ts  # Content schema (Zod — extended D&D fields)
│   │   ├── components/        # Custom Astro components
│   │   ├── pages/tags/        # Tag navigation pages
│   │   └── styles/global.css  # Theme: fonts, colors, Starlight overrides
│   ├── package.json
│   └── package-lock.json
├── .github/workflows/        # CI: deploy, frontmatter-check, spellcheck, link-check
├── .obsidian/                # Obsidian vault config
└── .claude/                  # Claude Code project config
```

## Content Conventions

### Frontmatter (required on all content .md files)

```yaml
---
title: "Page Title"
publish: true          # boolean — controls site visibility
tags:                  # non-empty array
  - diary
  - character/name
  - campaign/tomb-of-annihilation
date: 2025-06-08       # ISO date
description: ""        # optional
location: ""           # optional (diary)
campaign_day: 39       # optional (diary)
aliases: []            # optional (wiki)
---
```

CI enforces: `title`, `publish`, `tags`, `date` present. `publish` must be boolean. `tags` should not be empty.

### Character Frontmatter (additional fields)

```yaml
class: ""              # D&D class
race: ""                # Race
status: "vivo"          # Status: vivo/muerto/desaparecido
origin: ""              # Origin
alignment: ""           # Alignment
nickname: ""            # Optional nickname
personality:            # Personality axes (numeric scales)
  flexible_stubborn:
  cowardly_reckless:
  dull_cunning:
  clumsy_sharp:
  inept_acrobatic:
  sensible_lunatic:
ideals: ""
bonds: ""
flaws: ""
strengths: []
weaknesses: []
# Obituary fields (status: muerto)
death_date:
death_cause: ""
death_location: ""
epitaph: ""
# Missing poster fields (status: desaparecido)
disappearance_date:
disappearance_location: ""
reward: ""
last_seen_wearing: ""
```

These fields are validated in `grimoire-astro/src/content.config.ts` via Zod schema extending Starlight's `docsSchema`.

### Wikilinks

Content uses Obsidian `[[wikilinks]]` syntax. CI validates all wikilinks resolve to existing files.

### Language

All narrative content is in **Spanish**. Write new content in Spanish unless told otherwise.
Commit messages and code comments in English.

## Git Commits

- **No body/description** — subject line only
- **No Co-Authored-By** — never add co-author trailers

## Custom Components

Located in `grimoire-astro/src/components/`:

| Component | Purpose |
|---|---|
| `MarkdownContent.astro` | Starlight override — wraps content with backlinks + tag linking |
| `Backlinks.astro` | Displays backlinks (pages that link to current page) |
| `TagLinker.astro` | Converts tag badges into clickable links |
| `TagList.astro` | Tag index page component |
| `CharacterSheet.astro` | D&D character sheet display (personality axes, stats) |
| `CharacterCards.astro` | Character card grid for listings |
| `StatusBadge.astro` | Character status indicator (vivo/muerto/desaparecido) |

## Key Files

| File | Purpose |
|---|---|
| `grimoire-astro/astro.config.mjs` | Astro + Starlight config: locale, sidebar, plugins, Tailwind |
| `grimoire-astro/src/content.config.ts` | Content schema: Zod validation for D&D fields |
| `grimoire-astro/src/styles/global.css` | Theme: fonts (Cinzel, Crimson Text, Fira Code), Starlight color overrides |
| `_templates/plantilla-diario.md` | Template for new diary entries |
| `_templates/plantilla-wiki.md` | Template for new wiki entries |
| `_templates/plantilla-personaje.md` | Template for new character entries |
| `.github/workflows/deploy.yml` | Build Astro + deploy to Vercel |
| `.github/workflows/frontmatter-check.yml` | Validate frontmatter on content files |
| `.github/workflows/spellcheck.yml` | Spanish spell check with aspell |
| `.github/workflows/link-check.yml` | Validate wikilink integrity |

## Ignored by Starlight (not published)

Paths in `astro.config.mjs` starlightObsidian ignore: `_templates`, `_rules`, `_docs`, `.obsidian`, `node_modules`, `.claude`, `.github`, `.vscode`, `grimoire-astro`.

## Theme

D&D-themed design defined in `grimoire-astro/src/styles/global.css`:
- Fonts: Cinzel (headers), Crimson Text (body), Fira Code (code)
- Light mode: parchment background (#f5f0e6), gold accent (#c9a84c), dark grays
- Dark mode: dark brown (#2c1810), orange-fire accent (#ff9641/#ed5c28), inverted grays

## Development Workflow

1. Edit content in Obsidian (obsidian-git plugin for version control)
2. Push to `main` branch
3. GitHub Actions: validate frontmatter → spell check → link check → build Astro → deploy to Vercel
4. Local dev: `cd grimoire-astro && npm run dev`

## Important Notes

- **Never edit files inside `_rules/`** — it's a git submodule
- Content directories: `diario/`, `personajes/`, `reglas/` — these are the editable content areas
- `grimoire-astro/dist/` is generated output, do not edit manually
- Templates in `_templates/` define frontmatter structure for new content
- Astro project lives in `grimoire-astro/` — all code/config changes happen there
- Prettier formatting enforced on commit via Husky pre-commit hook
