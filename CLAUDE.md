# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A static, single-page personal business card deployed as a GitHub Pages **user site** (`argrig.github.io`, remote `git@github.com:argrig/argrig.github.io.git`). The root of `main` is served directly — there is no build step, bundler, package manager, linter, or test suite. Everything must work as plain files opened over HTTP.

## Commands

```bash
# Serve locally (any static server works; file:// also works but hash routing is easier to test over http)
python3 -m http.server 8000     # then open http://localhost:8000/#/priest/ru

# Deploy = push to main
git push origin main
```

There is nothing to build or test; verify changes by loading the page in a browser at the various `#/…` routes and across viewport sizes.

## Architecture

Everything is plain files loaded by `index.html` in this order: Bootstrap CSS → `styles.css`; Bootstrap JS → `i18n.js` → `publications.js` → `app.js` (classic scripts, no modules, so `file://` works too). Own CSS/JS are linked with a `?v=N` query (currently `v=7`) — GitHub Pages sends `Cache-Control: max-age=600`, and phones kept serving the old empty `styles.css` from cache; **bump `N` in all four `<link>`/`<script>` tags whenever these files change**.

- `index.html` — the only page. A sticky `header.controls` (persona toggle + language toggle, plain `<a href="#/…">` links) and `main.scene > #card.card3d` holding two `section.card-face`s: `#face-priest` (front; the original Bootstrap 3-column row cross/text/photo plus a `#priest-pubs` list) and `#face-math` (back; same shape as the front — free `.hero` over the background: `fractal.webp` left, name/degree/affiliation/contacts centre, cartoon right — the same Bootstrap columns and image classes as the front face, then a `.panel` starting at «Научные интересы» with chips, profile links and `#math-pubs`). Static text carries `data-i18n="key"` (or `data-i18n-alt`/`data-i18n-aria`) with the Russian text inline as no-JS fallback. `index.html.old` is an obsolete early variant — ignore it.
- `app.js` — hash router + renderer (IIFE). Routes `#/(priest|math)/(ru|en)`; anything else → `location.replace('#/priest/ru')`. `render()` sets `<html lang>`, `<title>`, fills `data-i18n` nodes, rebuilds the publication lists on language change, rewrites control hrefs/`aria-current`, and flips via `.card3d.is-flipped`. Both faces stay in the same grid cell during the turn; after `transitionend` (or a 1 s fallback) the inactive face gets `.is-hidden` (absolute + invisible) so the card height follows the visible face. First render and reduced-motion flip without animation.
- `i18n.js` — `window.I18N = {ru, en}`; flat keys (`ctl.*`, `title.*`, `p.*` priest, `m.*` math, `ix.*` index-badge labels/tooltips). `m.interests` is an array.
- `publications.js` — `window.PUBLICATIONS = { math: [], priest: [] }`. Both lists are single chronological lists, newest first (undated last), numbered continuously by the `<ol>`; add new works at the top of the array. Math entries: title/venue kept in the original language on both sides, optional `titleEn` (English title shown only on the EN side, for Russian-only papers), optional `translation` (English edition), `links[]`, `indexed[]` with codes `scopus|wos|rsci|mathnet|zbmath|mathscinet` (only claim an index that was verified — see the file header). Priest entries have `{ru,en}` title/venue and `group` = `reports|articles|interviews`, shown as a small type tag. An empty math array renders a placeholder line.
- `styles.css` — all custom CSS: controls, 3D flip (`perspective`, `preserve-3d`, `backface-visibility`), fluid typography via `clamp()`, the math panel, publication lists and `.ix--*` badge colours, `prefers-reduced-motion`. Both faces share the same building blocks: `.hero` (identity + `.card-contacts`, transparent, over the Ararat background) followed by `.panel` (translucent rounded box holding the details); on phones and landscape phones it gets `min-height: calc(100svh - var(--bar-h) - …)` so the essentials fill the first screen and details begin below the fold. The landscape-phone media query lives **at the end of the file** — it overrides section rules of equal specificity, so keep it last.
- `bootstrap5.2.3/` — vendored Bootstrap 5.2.3 (grid/utilities on the priest side). Loaded locally, no CDN; keep it that way.
- Images live flat in the root. Used: `cross.png` and `fractal.webp` (the side symbols, class `.hero__symbol`), `me-real.webp` and `me_cartoon_transparent.png` (the portraits, class `.hero__portrait`), `ararat_new25.png` (body background, set in CSS), `tg24.png`/`phone24.png`/`email24.png`/`youtube24.png`. `*.xcf` are GIMP sources; `card*.png`, `me.png`, `me_cartoon*.png`, `ararat*.png` are renders/alternates not referenced.

Data provenance: the 15 "earlier works" come from the old site `argrig.narod.ru` (publications_ru.html); indexing/links were verified against Math-Net.Ru (person 34113), zbMATH Open API, Crossref, MathSciNet (MR Author ID 641320) and the ИСТИНА МГУ profile (worker 178258660). Priest reports are from rnsa.armeparchy.org/ideology — no printed proceedings were found, so they are cited "as is" with forum dates.

## Constraints that follow from the deployment target

- Vanilla HTML/CSS/JS only, no modules that require a build, no external CDNs. Anything added must work when `index.html` is fetched straight from GitHub Pages.
- Routing must be hash-based (`/#/priest/ru` etc.) — GitHub Pages user sites cannot rewrite paths, so path-based routes would 404.
- Keep `index.html` as the entry point; update it in place rather than adding a new page.

---

## Project task specification

Modify the existing code of the single-page business card (index.html, styles, scripts). The current repository contains a priest's business card. You need to transform it into a two-sided flip card using CSS 3D transforms by adding a second persona — a mathematician's business card. You also need to implement localization (i18n) and routing.

Architecture & Routing:
1. Implement hash-routing:
   - /#/priest/ru
   - /#/priest/en
   - /#/math/ru
   - /#/math/en
2. Default state: redirect to /#/priest/ru on an empty hash or invalid URI.
3. Changing the URL must trigger the CSS card flip animation and language switch.

Localization (i18n):
1. Extract all text constants into a JSON or JS object dictionary.
2. For the priest's side (currently only in Russian), generate an accurate English translation for all existing strings.
3. For the mathematician's side, use the following data: "Doctor of Mathematics", "Russian-Armenian State University", "Research interests: commutative algebra, categories theory, differential equations, algebraic coding theory, fractals", plus a list of publications. Implement both RU and EN versions.

UI/UX & Responsiveness:
1. Intuitive Controls: Implement highly visible, obvious, and intuitive UI controls for flipping the card (Priest/Mathematician) and switching the language (RU/EN). The user must instantly understand how to perform these actions without guessing.
2. Responsive Design: The layout must guarantee easy, intuitive readability and proper scaling on devices with ANY screen aspect ratio (mobile phones in portrait/landscape, tablets, desktop monitors). Avoid rigid dimensions that break on extreme aspect ratios; ensure text and elements adapt gracefully.
3. State Management: Clicking a control changes the URL. The router should then handle the UI state (e.g., flipping the card by toggling the .is-flipped CSS class).

Card Structure:
1. Front side (.card-front): use the current layout of the priest's business card (preserve the existing flex/grid structure with the cross, text, and photo).
2. Back side (.card-back): the mathematician's business card. The design must be modern, clean, and academic.
3. In the mathematician's layout, implement a scalable list structure for the old publications (from the old narod.ru site) and a section placeholder for adding new, recent publications.

Tech Stack & Constraints:
Vanilla JS, HTML5, CSS3. Wrap the current container in a 3D context (perspective, transform-style: preserve-3d, backface-visibility: hidden). The code must run directly on GitHub Pages without any bundlers or build steps. Update index.html in place.
