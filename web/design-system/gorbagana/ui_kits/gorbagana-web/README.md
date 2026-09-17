# Gorbagana web — UI kit

Click-through recreation of the Gorbagana ecosystem web surface in the synthwave/cyberpunk direction. **No production site code or Figma was provided**; these screens are original compositions that apply the design system to the surfaces the ecosystem implies (marketing landing, block explorer, Gorbagio gallery). Treat them as a starting reference, not a pixel recreation.

- `index.html` — shell with sticky glass `TopNav`, screen router (Home / Explorer / Gorbagios), footer. Remembers the last screen.
- `kit-nav.jsx` — `Wordmark` (type-set fallback for the painted logo), `TopNav`, `Footer`.
- `kit-landing.jsx` — `Hero` (sunset + perspective grid + PFP), `Marquee` (slogan ticker), `Pillars`, `Notice` (sticker + cardboard cards).
- `kit-explorer.jsx` — stats row, tabbed transactions table with badges, search + network select.
- `kit-gallery.jsx` — filter sidebar (tags, checkbox, switch), grid/list toggle, detail `Dialog`, `Toast`.

All numbers are illustrative sample data. Per `guidelines/lore-and-facts.md`, verify network stats before publishing.
