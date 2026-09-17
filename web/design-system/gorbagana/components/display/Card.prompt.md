Content container — void-purple by default, neon-bordered for emphasis, paper sticker for lore/quotes.

```jsx
<Card header="Network">…</Card>
<Card variant="neon" accent="pink" interactive>…</Card>
<Card variant="sticker" tilt={-2} header="Trash Council notice">…</Card>
```

Never stack glows on glows: one neon card per cluster, rest default. Paper cards use dashed dividers and marker type.
