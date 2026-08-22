# Tomorrow People — Website Redesign

A redesign concept for the Aotearoa reggae band **Tomorrow People**: a dark,
single-page site built around the band's tribal lion emblem and a red / gold /
green reggae palette.

## Contents

| Path | What it is |
|------|------------|
| `redesign/` | The source site — `index.html`, `css/`, `js/`, self-hosted `fonts/`, and `img/` |
| `tomorrow-people.html` | The whole site inlined into **one self-contained file** (fonts + images as `data:` URIs). Double-click to open in any browser — no server, no internet |
| `build-standalone.mjs` | Regenerates `tomorrow-people.html` from `redesign/` |

## Running it

Open `tomorrow-people.html` directly, **or** serve the `redesign/` folder:

```bash
npx serve redesign
```

Rebuild the standalone file after editing anything in `redesign/`:

```bash
node build-standalone.mjs
```

## Tech

- Hand-written HTML/CSS/JS — no framework, no build step for the source
- Type: **Anton** (display), **Archivo** (text/UI), **Caveat** (script) — all self-hosted
- The lion emblem is a single logo PNG re-coloured live via CSS `mask-image`,
  so it appears in the reggae gradient everywhere at any size
- Responsive, keyboard-navigable, honours `prefers-reduced-motion`

## Status — work in progress

This is a design concept. Before any public launch, the following placeholders
need real data:

- **Show dates** are sample/placeholder listings
- **Video highlights** are drawn placeholder tiles (no real thumbnails/links)
- **Merch** items are drawn placeholders with no prices
- **Newsletter** signup has no backend connected
- **Contact** has no booking email wired up

Image assets (single covers, logo, favicon) are the band's own, reused from the
existing tomorrowpeople.co.nz media library.
