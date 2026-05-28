---
title: "Setup: Quartz 5 + GitHub Pages"
tags:
  - setup
  - quartz
  - github
description: "Guia paso a paso de como se instalo Quartz 5 en este vault de Obsidian y se conecto con GitHub Actions para publicar automaticamente"
date: "2026-05-28"
---

# Setup: Quartz 5 + GitHub Pages

Guia de como se configuro este vault de Obsidian para publicar notas selectivamente en una web estatica usando Quartz 5 y GitHub Actions.

## Arquitectura

```
Obsidian Vault (local)
    |
    v
git push → GitHub repo (publico)
    |
    v
GitHub Actions → Quartz 5 build
    |
    v
GitHub Pages → dnd.mogamihub.xyz
```

Solo las notas con `publish: true` en su frontmatter aparecen en la web. El resto existe en el repo pero Quartz las ignora al generar el sitio.

## Paso 1: Crear el repositorio

1. Crear repo en GitHub: `mogamiGit/grimoire-dnd`
2. Configurar remoto local:
```bash
git remote add origin git@github.com:mogamiGit/grimoire-dnd.git
git push -u origin main
```

## Paso 2: Instalar Quartz 5 en el vault

Quartz se instala directamente en la raiz del vault. No necesita repo separado.

```bash
# Clonar Quartz en carpeta temporal
cd /tmp
git clone https://github.com/jackyzha0/quartz.git quartz-temp

# Copiar scaffolding al vault (NO el contenido de content/)
cp package.json package-lock.json tsconfig.json /ruta/al/vault/
cp quartz.config.default.yaml /ruta/al/vault/quartz.config.yaml
cp globals.d.ts index.d.ts quartz.ts /ruta/al/vault/
cp -r quartz/ /ruta/al/vault/quartz/

# Instalar dependencias
cd /ruta/al/vault
npm ci

# Instalar plugins de Quartz
npx quartz plugin install

# Limpiar
rm -rf /tmp/quartz-temp
```

## Paso 3: Configurar quartz.config.yaml

Cambios clave respecto al default:

```yaml
configuration:
  pageTitle: Grimoire DnD
  locale: es-ES
  baseUrl: dnd.mogamihub.xyz
  analytics:
    provider: "null"
  ignorePatterns:
    - private
    - _templates
    - _rules
    - _docs
    - .obsidian
    - quartz
    - node_modules
```

### Habilitar publicacion selectiva

En la seccion de plugins, cambiar estos dos:

```yaml
# Desactivar remove-draft (viene activado por defecto)
- source: github:quartz-community/remove-draft
  enabled: false

# Activar explicit-publish (viene desactivado por defecto)
- source: github:quartz-community/explicit-publish
  enabled: true
```

Con esto, **solo** notas con `publish: true` en frontmatter se publican.

## Paso 4: Estructura de carpetas

```
vault/
├── wiki/           # Notas de enciclopedia
├── diario/         # Entradas de diario de campana
├── reglas/         # Notas curadas de reglas
├── _templates/     # Plantillas (nunca se publican)
├── _rules/         # Submodulo SRD (nunca se publica)
├── _docs/          # Documentacion interna (nunca se publica)
├── quartz/         # Codigo fuente de Quartz
├── index.md        # Landing page
└── quartz.config.yaml
```

Carpetas con prefijo `_` estan en `ignorePatterns` y nunca se publican.

## Paso 5: Frontmatter

Cada nota necesita frontmatter YAML al inicio. Ejemplo:

```yaml
---
title: "Nombre de la nota"
publish: true
tags:
  - wiki
description: "Descripcion breve"
date: "2026-05-28"
---
```

- `publish: false` (o sin frontmatter) → no aparece en la web
- `publish: true` → se publica

Las plantillas en `_templates/` tienen `publish: false` por defecto para evitar publicaciones accidentales.

## Paso 6: GitHub Actions

Archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy Grimoire to GitHub Pages

on:
  push:
    branches:
      - main
    paths-ignore:
      - '.obsidian/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          submodules: true

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Install Quartz plugins
        run: npx quartz plugin install

      - name: Build Quartz
        run: npx quartz build -d .

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Puntos clave:
- Se triggerea con cada push a `main` (excepto cambios en `.obsidian/`)
- `submodules: true` descarga el SRD automaticamente
- `npx quartz build -d .` usa la raiz del repo como directorio de contenido

## Paso 7: Configurar GitHub Pages

1. Repo Settings → Pages → Source: **GitHub Actions**
2. Custom domain: `dnd.mogamihub.xyz`

## Paso 8: DNS en Cloudflare

Anadir record en Cloudflare DNS:
- Type: `CNAME`
- Name: `dnd`
- Target: `mogamigit.github.io`
- Proxy: DNS only (nube gris)
- TTL: Auto

## Paso 9: .gitignore

```gitignore
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/cache/
.obsidian/plugins/obsidian-git/
node_modules/
public/
.quartz/
.DS_Store
```

## Paso 10: Build local (test)

Para probar antes de pushear:

```bash
npx quartz build -d . --serve
```

Abre `localhost:8080` para previsualizar el sitio.

## Flujo de trabajo diario

1. Crear nota en Obsidian usando plantilla
2. Escribir contenido
3. Cuando este lista para publicar: cambiar `publish: false` → `publish: true`
4. El plugin obsidian-git hace commit y push automatico
5. GitHub Actions build y despliega
6. Nota visible en `dnd.mogamihub.xyz`

## Submodulo SRD

Las reglas del SRD 5e estan como submodulo git en `_rules/dnd-5e-srd-markdown/`. Disponibles localmente en Obsidian para consulta pero no se publican. Para actualizar:

```bash
cd _rules/dnd-5e-srd-markdown
git pull origin master
cd ../..
git add _rules/dnd-5e-srd-markdown
git commit -m "Update SRD submodule"
```
