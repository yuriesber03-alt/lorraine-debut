# Art guide: painted look (like aninagstudio)

The reference site looks expensive because every scene is a **painted illustration**, not code.
Generate the pictures once (ChatGPT image / Midjourney / Gemini / Firefly), drop them in
`public/art/`, and the site uses them automatically. Missing files fall back to the built-in design.

Use the SAME style line in every prompt so the set matches:

> STYLE: luxury debut invitation illustration, soft blush pink, champagne gold and ivory,
> rose-gold accents, painterly watercolor + metallic gold foil details, delicate roses,
> pampas grass, butterflies, elegant, high detail, no text, no people

## Scene backgrounds (portrait 9:16, about 1080x1920, .jpg or .webp)

The CENTRE must be a clean, empty cream parchment panel in an ornate gold frame
(that is where the site puts the words). Decoration only around the edges.

Prompt:
> Vertical 9:16 invitation page background. Ornate gold arch frame with an EMPTY cream
> parchment panel in the centre (large, plain, nothing written). Blush roses, ivory flowers,
> gold leaves, butterflies and soft drapes in the corners. [STYLE]

Files:
- `panel.jpg`            used for every scene that has no file of its own (make this one first)
- `panel-top.jpg`        hero (can have a bigger empty arch for the photo)
- `panel-date.jpg`  `panel-note.jpg`  `panel-program.jpg`  `panel-moments.jpg`
- `panel-venue.jpg`  `panel-map.jpg`  `panel-details.jpg`  `panel-gifts.jpg`
- `panel-eighteens.jpg`  `panel-eighteens-2.jpg` ... (one per group, or just use `panel.jpg`)
- `panel-wish.jpg`  `panel-rsvp.jpg`  `panel-save.jpg`

## Envelope (optional, all landscape 3:2, about 1500x1000)

- `cover-bg.jpg`        full screen backdrop (portrait 1080x1920): soft blush/dark gradient, light bokeh, curtains
- `envelope-back.png`   inside of the envelope, flat, front view
- `envelope-front.png`  front of the envelope, flat, pocket with the V fold lines
- `flap.png`            the outside of the top flap only (triangle pointing down), same material
- `seal.png`            round gold wax seal, square 600x600, transparent background
- `letter.png`          cream card with painted border and empty centre, portrait-ish

Prompt (envelope):
> Flat front view of a luxury blush-pink and ivory invitation envelope, V-shaped flap folds,
> gold foil edges, soft shadow, plain background. [STYLE]

## Photos (separate, in public/photos)
`hero.jpg`, `note.jpg`, `venue.jpg`, `finale.jpg`, `gallery-1.jpg` ...
