# Gorbagana Design System

Synthwave / cyberpunk design system for the **Gorbagana** ecosystem: the Gorbagana chain (a high-performance L1 forked from Solana's codebase), its gas token **$GOR**, and the **GORBAGIO** NFT collection (4,444 discarded-object characters). The brand's own words: *serious infrastructure expressed through unserious garbage civilization.* This system is the neon-night version of that — acid graffiti on a void-purple grid, torn-paper stickers, and a furry bin citizen peeking out of the sunset.

## Sources

- `uploads/gorbanner2.png` → `assets/brand/gorbagana-banner.png` — the X banner (5:2). Primary source for palette, wordmark treatment, sticker copy and the synthwave grid/sunset staging.
- `uploads/gorpfp.png` → `assets/brand/gorbagana-pfp.png` — the profile mark (1:1).
- `uploads/contact-sheet.jpg` + 124 `gorbagio-*.jpg` crops — screenshot-derived Gorbagio references (36 curated primaries copied to `assets/gorbagios/`). Marketplace: https://magiceden.io/marketplace/gorbagio
- `uploads/*.md` — the "gorbagana-visuals" skill pack (visual canon, asset index, meme playbook, lore/fact discipline, quality checks) → copied to `guidelines/`.
- `uploads/icon.svg` — a generic pen glyph, not brand; ignored.
- Primary web sources cited by the pack (not fetched here): https://www.gorbagana.wtf/ · https://docs.gorbagana.wtf/ · https://github.com/gorbagana-dev
- No Figma, codebase, font files or vector logo were provided.

## Products represented

1. **Gorbagana web** (`ui_kits/gorbagana-web/`) — marketing landing, landfill explorer, Gorbagio gallery. Original compositions in the brand (no site code was available to recreate).
2. **Meme / poster / quote-card generation** — governed by `guidelines/meme-scenario-playbook.md` and `guidelines/gorbagio-visual-canon.md`; the tokens here (sticker cards, sunset, grid, glows) are the HTML-side vocabulary for those.

## Content fundamentals

- **Voice:** deadpan-grandiose trash civilization. Short, declarative, all-caps slogans that sound like municipal signage or graffiti: "TRASH PEOPLE, BETTER PEOPLE", "BUILT BY DEGENS FOR DREAMERS", "SAME TRASH, DIFFERENT VIBES", "GOOD TRASH ONLY", "MEME TO MOMENTUM", "THE CHAIN IS TRASH. THAT'S THE POINT.", "TRASH HAS FINALITY", "NO ROADMAP. CHECK THE DUMPSTER."
- **Casing:** headlines and stickers UPPERCASE in marker type; UI labels/buttons uppercase tracked small caps; body sentence case.
- **Person:** "we/our" for the chain and community ("…is our infrastructure"); "you" only in imperatives ("Bring your own lid"). Never corporate "users".
- **Punctuation:** full stops as beats ("BUILD. DUMP. REPEAT."). Ellipses for two-part gags ("ONE DEV'S TRASH… …IS OUR INFRASTRUCTURE."). Intentional misspelling "GORBAGE" is canon in puns.
- **Ticker:** always literal `$GOR`, set in Permanent Marker + pink glow when it's a prop, mono when it's a number.
- **Emoji:** none. The banner uses hand-drawn glyphs (smileys, crowns, hearts, lightning) as graffiti — treat those as illustration, never as emoji in UI text. Lucide icons for UI.
- **Facts vs lore:** factual copy (contract address, TPS, validator count) must be verified live per `guidelines/lore-and-facts.md`; lore copy (Trash Council, $GOR gas depot) is parody and may be invented freely. UI sample data is labelled illustrative.
- **Humor:** one dominant joke per surface. Cute-uncanny, bureaucratic, or ceremonial beats the grimy default. Self-deprecating about the chain, never about the user.

## Visual foundations

- **Palette:** background is a night-purple stack (`--void-0…5`, #07030F → #3A2263), never neutral gray. Acid green `#39FF14` is the primary (CTAs, active states, wordmark glow). Hot pink `#FF2DAA` is the secondary (outlines, eyebrows, radios, $GOR prop). Cyan `#19E6FF` = links/focus/addresses. Yellow `#F5FF3D` = crowns/warnings. Sunset red `#FF1E6B` = danger. Neutrals come from physical trash: sticker cream `#F1EADB`, cardboard `#B8894F`, galvanized bin grays, fur green `#2F6B1F`, ink `#0B0712`.
- **Type:** Permanent Marker (display, stickers, quotes — a stand-in for the hand-painted wordmark), Space Grotesk (UI + body), JetBrains Mono (addresses, amounts, slots). Google Fonts substitutes; no brand binaries supplied.
- **Backgrounds:** full-bleed void gradient, a 1px purple perspective grid (`--bg-grid`) in heroes, and a striped pink-orange sunset disc (`--gradient-sunset` + `--gradient-sunset-stripes`). Optional CRT scanlines overlay (`--bg-scanlines`) — deliberate, never default. Paint-splatter and drip texture live in the raster brand images only; do not fake them in CSS.
- **Imagery:** saturated, cool-toned neon (magenta/violet/cyan) with acid-green subjects. Character art is mixed-media: tactile fur/plastic/paper bodies with flat cartoon faces. Never marketplace chrome, never generic goblins.
- **Shadows = light:** no gray drop shadows on void surfaces. Elevation is expressed with neon glows (`--glow-*`, 6/18/28/60px spreads) and text glows. Paper elements instead get a **hard ink offset** (`--shadow-sticker` 3px, `-lg` 5px) — flat, like a sticker on a wall. Menus/dialogs use `--shadow-elevated` (deep black) plus a purple glow.
- **Borders:** 1px purple-alpha hairlines on surfaces (`--border-default`), 2px solid on controls and neon cards, 2px ink on paper. Focus = 2px cyan + cyan glow.
- **Radii:** tight. 2px stickers, 4px controls/inputs/buttons, 6px cards, 10px dialogs, 16px hero image. Pill only on chips and the switch.
- **Cards:** `default` void surface + hairline; `neon` 2px accent border with glow (one per cluster); `sticker` cream paper, ink border, hard shadow, ±2–4° tilt that straightens on hover; `cardboard` corrugated brown; `glass` blurred overlay for sticky nav.
- **Tilt:** stickers/tags/paper dialogs rotate by `--tilt-1…4` (-4°…3°). Nothing else rotates.
- **Spacing:** 4px base; components pad 12/16/20; sections 48/64/80/96. Controls 32/40/48.
- **Layout:** sticky glass top nav (64px), 1200px content container, 3–4 column grids. Sidebars sticky. Hero is asymmetric — copy left, tilted character image right.
- **Hover:** glow intensifies (`--glow-*-strong`), fill lightens one step, ghost items get `--white-6` wash, stickers un-tilt. **Press:** `scale(.97)` for neon buttons; stickers translate 2px into their hard shadow. Links: cyan, wavy underline on hover.
- **Motion:** 120/200/360ms, `--ease-out` for fades and tabs, `--ease-snap` overshoot for knobs and badge dots. A slow marquee ticker and a pulsing status dot are the only ambient motion. No parallax, no bounce-in pages, no blur-in text.
- **Transparency/blur:** glass nav (`rgba(13,6,25,.75)` + 8px blur) and dialog scrim (`--surface-overlay` + blur). Nowhere else.
- **Selection:** pink highlight, white text.

## Iconography

- **UI glyphs:** Lucide (2px stroke, round caps) via the `Icon` component, loaded from CDN `https://unpkg.com/lucide@0.475.0/dist/umd/lucide.min.js`. No brand icon font or SVG set exists in the sources — this is a substitution, flagged. Preferred set: trash-2, recycle, zap, flame, fuel, biohazard, skull, crown, sparkles, wallet, arrow-right, external-link, copy, check, x, chevron-down, search, menu, server, layout-grid, list.
- **Brand glyphs:** the banner's graffiti smileys (○ with ✕ eyes), crowns, hearts, lightning bolts and drips are hand-painted raster art. Do not redraw them as SVG; crop them from `assets/brand/gorbagana-banner.png` if a scene needs them, or use the `✕` unicode separator (as in the marquee) as the one sanctioned text glyph.
- **Emoji:** never.
- **Logo:** no vector Gorbagana/$GOR logo or Gorbagio mark was provided. The painted "GORBAGANA" wordmark exists only inside the banner raster. Wherever a mark is needed, set "GORBAGANA" in Permanent Marker, uppercase, acid green with `--text-glow-acid` on void (or ink on paper) — see `Wordmark` in the web kit. Do not extract logos from tiny in-art stickers.
- **Character art:** use the indexed Gorbagio crops in `assets/gorbagios/` as references/thumbnails; they are lossy screenshot crops with occasional clover-badge overlaps (not artwork).

## Index

- `styles.css` — entry; imports `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `tokens/` — CSS custom properties (base + semantic).
- `assets/brand/` — banner, PFP. `assets/gorbagios/` — contact sheet + 36 primary reference crops.
- `guidelines/` — 22 specimen cards (Colors, Type, Spacing, Effects, Brand) + the visual-canon, asset-index, meme-playbook, lore-and-facts and quality-checks docs.
- `components/` — React primitives (see below). `ui_kits/gorbagana-web/` — click-through web kit.
- `thumbnail.html`, `SKILL.md`, this `readme.md`.

## Components

Namespace `window.GorbaganaDesignSystem_e5ff07` (via `_ds_bundle.js`).

- `components/core/` — **Icon**, **Button**, **IconButton**
- `components/display/` — **Card**, **Badge**, **Tag**, **Tooltip**
- `components/forms/` — **Input**, **Select**, **Checkbox**, **Radio**, **Switch**
- `components/navigation/` — **Tabs**
- `components/feedback/` — **Dialog**, **Toast**

Intentional additions: `Icon` (Lucide wrapper — no brand glyph set exists). No source defined a component inventory, so this is the standard set sized to the brand.

## UI kits

- `ui_kits/gorbagana-web/index.html` — Landing (hero, marquee, pillars, sticker notices), Explorer (stats, tabbed tx table), Gallery (filters, grid/list, detail dialog, toast).

## Caveats

- Fonts are Google Fonts substitutes (Permanent Marker / Space Grotesk / JetBrains Mono). The real wordmark is hand-painted; supply brand font files to replace.
- Icons are Lucide (CDN) — substitution.
- No logo asset exists; the wordmark is type-set.
- UI kit screens are original compositions, not recreations of gorbagana.wtf (no site code provided). Sample numbers are illustrative.
