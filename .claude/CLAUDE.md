# Session Defaults

- **Caveman mode**: Always active (full). Respond terse, drop filler, fragments OK. Technical substance stays.
- **Lexis MCP**: Always use Lexis tools (`search_code`, `get_symbol`, `read_file`, `find_references`, etc.) instead of Read/Grep/Glob for code search. Lexis is ~10x more token-efficient.
- **Language**: Respond in Spanish when discussing content. English for code/commits/technical.

# Grimoire DnD — Project Context

## What Is This

Obsidian vault + Quartz v5 digital garden for a D&D 5e campaign ("Tomb of Annihilation").
Published at **dnd.mogamihub.xyz** via GitHub Pages.
Primary language: **Spanish** (content). English (config/code).

## Stack

- **Obsidian** — local vault editor
- **Quartz v5.0.0** — static site generator (digital garden)
- **Node.js ≥22**, npm ≥10.9.2, TypeScript 5.9
- **GitHub Actions** — CI/CD (deploy, frontmatter validation, spell check, link check)
- **GitHub Pages** — hosting

## Directory Structure

```
.
├── index.md                  # Site entry point
├── diario/                   # Campaign session diaries (narrative logs)
│   ├── index.md
│   └── day-*.md / session-*.md
├── wiki/                     # Campaign world encyclopedia
│   ├── index.md
│   ├── personajes/           # Characters
│   ├── lugares/              # Locations
│   ├── facciones/            # Factions
│   ├── objetos/              # Items/Objects
│   └── sesiones/             # Session cross-references
├── reglas/                   # D&D 5e rules reference
│   └── index.md
├── _templates/               # Obsidian templates (not published)
│   ├── plantilla-diario.md   # Diary entry template
│   └── plantilla-wiki.md    # Wiki entry template
├── _rules/                   # D&D 5e SRD markdown (git submodule, not published)
├── _docs/                    # Internal docs (not published)
├── quartz/                   # Quartz framework (git submodule)
├── .quartz/plugins/          # Custom Quartz plugins
├── .github/workflows/        # CI: deploy, frontmatter-check, spellcheck, link-check
├── .obsidian/                # Obsidian vault config
├── quartz.config.yaml        # Quartz site config (locale, theme, plugins)
├── package.json              # Node dependencies
└── public/                   # Generated static output (gitignored)
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

### Wikilinks

Content uses Obsidian `[[wikilinks]]` syntax. CI validates all wikilinks resolve to existing files.

### Language

All narrative content is in **Spanish**. Write new content in Spanish unless told otherwise.
Commit messages and code comments in English.

## Git Commits

- **No body/description** — subject line only
- **No Co-Authored-By** — never add co-author trailers

## Key Files

| File | Purpose |
|---|---|
| `quartz.config.yaml` | Site config: locale (es-ES), theme colors, fonts, plugins, ignored paths |
| `_templates/plantilla-diario.md` | Template for new diary entries |
| `_templates/plantilla-wiki.md` | Template for new wiki entries |
| `.github/workflows/deploy.yml` | Build Quartz + deploy to GitHub Pages |
| `.github/workflows/frontmatter-check.yml` | Validate frontmatter on content files |
| `.github/workflows/spellcheck.yml` | Spanish spell check with aspell |
| `.github/workflows/link-check.yml` | Validate wikilink integrity |

## Ignored by Quartz (not published)

Paths in `quartz.config.yaml` ignorePatterns: `private`, `_templates`, `_rules`, `_docs`, `.obsidian`, `quartz`, `node_modules`.

## Theme

D&D-themed design:
- Fonts: Cinzel (headers), Crimson Text (body), Fira Code (code)
- Light: parchment background (#f5f0e6), dark red (#8b2020), gold (#b8860b)
- Dark: dark brown (#1a1510), gold (#c9a84c), red (#8b2020)

## Development Workflow

1. Edit content in Obsidian (obsidian-git plugin for version control)
2. Push to `main` branch
3. GitHub Actions: validate frontmatter → spell check → link check → build Quartz → deploy
4. Local dev: `npx quartz build --serve -d .`

## Important Notes

- **Never edit files inside `quartz/`** — it's a git submodule
- **Never edit files inside `_rules/`** — it's a git submodule
- Content directories: `diario/`, `wiki/`, `reglas/` — these are the editable content areas
- `public/` is generated output, do not edit manually
- Templates in `_templates/` define frontmatter structure for new content
