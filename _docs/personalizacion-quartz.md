---
title: Personalizacion de Quartz
tags:
  - setup
  - quartz
  - theme
description: Como personalizar colores, fuentes y layout de Quartz 5
date: 2026-05-28
---

# Personalizacion de Quartz

Todo se configura en `quartz.config.yaml` salvo CSS avanzado.

## Fuentes

Seccion `theme.typography`. Acepta cualquier Google Font.

```yaml
theme:
  fontOrigin: googleFonts
  typography:
    header: Cinzel           # Titulos - estilo medieval
    body: Crimson Text       # Texto - serif de grimorio
    code: Fira Code          # Codigo - monospace con ligaduras
```

Para cambiar: busca fuentes en [Google Fonts](https://fonts.google.com/), copia el nombre exacto y reemplaza.

Alternativas que encajan con D&D:
- Headers: `MedievalSharp`, `Uncial Antiqua`, `Pirata One`
- Body: `EB Garamond`, `Libre Baskerville`, `Lora`
- Code: `JetBrains Mono`, `Source Code Pro`

## Colores

Seccion `theme.colors`. Hay dos modos: `lightMode` y `darkMode`.

```yaml
colors:
  lightMode:
    light: "#f5f0e6"         # Fondo principal (pergamino)
    lightgray: "#d4c9b0"     # Bordes, separadores
    gray: "#b8b8b8"          # Texto secundario, fechas
    darkgray: "#4a3728"      # Texto de cuerpo
    dark: "#2c1810"          # Titulos, texto importante
    secondary: "#8b2020"     # Links, acentos principales (rojo sangre)
    tertiary: "#b8860b"      # Links hover, acentos secundarios (oro)
    highlight: rgba(184, 134, 11, 0.12)  # Fondo de resaltado
    textHighlight: "#b8860b44"           # Texto resaltado
  darkMode:
    light: "#1a1510"         # Fondo principal (piedra oscura)
    lightgray: "#3a3028"     # Bordes, separadores
    gray: "#6b5d4f"          # Texto secundario
    darkgray: "#d4c9b0"      # Texto de cuerpo (pergamino)
    dark: "#f5f0e6"          # Titulos (pergamino claro)
    secondary: "#c9a84c"     # Links (oro)
    tertiary: "#8b2020"      # Links hover (rojo)
    highlight: rgba(201, 168, 76, 0.12)
    textHighlight: "#c9a84c44"
```

Cada propiedad controla:

| Propiedad | Que afecta |
|-----------|-----------|
| `light` | Color de fondo general |
| `lightgray` | Bordes, lineas, separadores |
| `gray` | Metadata, fechas, texto terciario |
| `darkgray` | Texto del cuerpo |
| `dark` | Titulos, encabezados |
| `secondary` | Links, elementos interactivos |
| `tertiary` | Hover de links, acentos secundarios |
| `highlight` | Fondo al resaltar (ej: hover en explorer) |
| `textHighlight` | Texto marcado con `==texto==` |

## CSS avanzado

Para cambios que no cubra el yaml, editar `quartz/styles/custom.scss`:

```scss
// Ejemplo: cambiar estilo de blockquotes
blockquote {
  border-left: 3px solid var(--secondary);
  background: var(--highlight);
  padding: 0.5em 1em;
}
```

Variables CSS disponibles corresponden a los colores del yaml (`--light`, `--dark`, `--secondary`, etc.).

## Layout y plugins

En `quartz.config.yaml`, seccion `plugins`. Cada plugin tiene:
- `enabled: true/false` — activar/desactivar
- `layout.position` — donde aparece (`left`, `right`, `beforeBody`, `afterBody`)
- `layout.priority` — orden dentro de la posicion (menor = mas arriba)

Plugins de layout comunes:

| Plugin | Que hace |
|--------|---------|
| `explorer` | Arbol de archivos (sidebar izq) |
| `graph` | Grafo de links (sidebar der) |
| `backlinks` | Links entrantes (sidebar der) |
| `table-of-contents` | Indice de la pagina (sidebar der) |
| `search` | Barra de busqueda |
| `darkmode` | Toggle claro/oscuro |
| `breadcrumbs` | Ruta de navegacion |
| `tag-list` | Tags de la nota |

Para mover graph a la izquierda por ejemplo:

```yaml
- source: github:quartz-community/graph
  enabled: true
  layout:
    position: left      # era "right"
    priority: 10
```

## Prueba local

Ejecutar desde la raiz del vault en terminal:

```bash
cd /Users/monicagalandelallana/Obsidian/Grimoire_DnD
```

### Opcion 1: Servidor estatico (recomendado)

El `--serve` de Quartz puede dar error `EMFILE: too many open files` en macOS por la cantidad de ficheros en `.quartz/plugins/`. La alternativa es hacer build y servir por separado:

```bash
npx quartz build -d . && npx serve public -p 8080
```

Esto hace dos cosas:
1. `npx quartz build -d .` — genera el sitio en la carpeta `public/`
2. `npx serve public -p 8080` — levanta un servidor estatico con el contenido generado

Abre `http://localhost:8080` en el navegador. Para parar: `Ctrl+C`.

> **Nota:** No tiene hot-reload. Si cambias algo, para el servidor, vuelve a ejecutar el comando.

### Opcion 2: Serve nativo de Quartz (con fix)

Si quieres hot-reload (recarga automatica al guardar), necesitas aumentar el limite de ficheros abiertos:

```bash
ulimit -n 65536 && npx quartz build -d . --serve
```

Puede seguir fallando si hay demasiados plugins. Si falla, usa la opcion 1.

### Opcion 3: Solo verificar build

Si solo quieres comprobar que no hay errores sin levantar servidor:

```bash
npx quartz build -d .
```

Genera todo en `public/` sin servir. Util para verificar antes de pushear.
