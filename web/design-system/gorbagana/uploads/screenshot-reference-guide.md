# Screenshot-reference handling

## What is actually included

All 124 rectangular character crops derived from three user-supplied screenshots, with 36 primary visual references on one overview. The original screenshots and redundant full catalog sheets are omitted from this compact edition. Most crops are 187 × 187 pixels. A few cards were clipped by the source viewport: the first column of screenshot 02 is narrower, and the first row of screenshot 03 has its upper edge clipped. Individual limitations are in `assets/manifest.json`.

The screenshots were provided in conversation as Gorbagio references. Their displayed item numbers were visually transcribed. No mint addresses, official trait names, rarity, ownership, prices or collection authenticity were independently checked. The package assembly date is not a verified screenshot capture date.

## Pixel handling

Individual crops retain their previous pixel dimensions but are recompressed as lossy JPEG at quality 80 with 4:2:0 chroma subsampling; they are not pixel-exact copies. No generative cleaning, restoration, denoising, invented detail or upscaling was performed. The primary contact sheet retains its labels outside the artwork. Historical source hashes, coordinates and item labels remain in the manifest. Original screenshots are not installed with this compact edition; inspect them only when the user separately provides them or the earlier v2 archive. See `source-provenance.md`.

Marketplace labels/prices/wallet controls below the art are cropped out. **Overlapping badges were not magically removed.** Their covered artwork is unavailable. Do not use a generative repair and then call the result a canonical original.

## Separate interface from artwork

Exclude from generated work unless the user intentionally asks for a marketplace-screen parody:

- Green clover icons in dark-green circles at the upper left of many cards.
- Blue count/arrow rectangles; gray circular plus controls; hovered wallet/connect controls.
- Prices, SOL labels, offer numbers, marketplace marks, rounded listing-card borders and instant-sell panels.

Do not indiscriminately delete all small image details: meme stickers at the bottom, background slogans and product-parody graphics may be inside the artwork itself. For a named-source reconstruction, keep visible in-art details unless asked to change them. For generic generation, treat them as optional collage devices, not default logos or affiliation claims.

## Selecting references

1. Open the 36-image overview, then use the all-item tables in `asset-index.md` to locate any other character. All 124 individual JPEG crops are bundled; full catalog images are not.
2. Read the matching index entries and inspect two or three individual crops for a generic concept, or the matching one for a named identity.
3. Choose a single main body family. Separate anatomy reference, eye/expression reference, rendering reference and scene reference.
4. Do not average all 124 images, paste a grid into a scene, or give every character every accessory.
5. Record unavailable details honestly. Crops are adequate for concept direction; request a clean source when fine-detail fidelity or exact marks become material.

## Getting pixels to an image tool

A file in `assets/` is not automatically delivered to the generator. Inspect it using available file/image tools and follow the active runtime's supported reference-image mechanism. Do not invent attachment IDs, unsupported parameters or claims about what the generator saw. For exact editing, confirm that the usable target image is actually present in the conversation; otherwise ask the user to attach it. If reference-image delivery is unavailable for a new generic scene, use a description derived from inspected examples without claiming pixel conditioning.

## Future replacements

A higher-resolution original can replace a screenshot reference only after matching the actual character. Add its source/identifier and update the manifest and index. Keep screenshot provenance separately. Add official logos to a separately labeled logo directory only when actual logo files are supplied or verified. Keep approved generated memes in a separate examples directory: they guide tone/composition, not original collection anatomy. Never claim either category exists while it is empty.
