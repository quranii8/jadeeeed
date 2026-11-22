---
name: منصة القرآن الكريم
description: A Quran platform built as the Rawdah, white marble arches with gilded capitals standing on a royal-green garden carpet, gold vines growing along them.
colors:
  royal-green: "#0B4A37"
  royal-green-deep: "#073326"
  garden-green: "#2C6A55"
  green-ink: "#0A2A20"
  on-gold: "#0B2A20"
  gold: "#B8893A"
  gold-leaf: "#D4AF5A"
  gold-pale: "#E9D8A6"
  gold-glint: "#E6C982"
  silver: "#9AA5A8"
  silver-light: "#D7DDDF"
  silver-ink: "#5F6E72"
  marble: "#FAFAF7"
  marble-white: "#FFFFFF"
  marble-shade: "#F3F4F0"
  ground: "#F6F7F4"
  text: "#10241C"
  on-green: "#FBFCFA"
  on-green-muted: "#C9DCD2"
  ivory-on-green: "#F7F5EC"
  night-ground: "#06140F"
  night-field: "#0A3B2C"
  kiswah-black: "#121214"
  kiswah-gold: "#C9A24B"
typography:
  display:
    fontFamily: "Amiri, serif"
    fontSize: "clamp(2rem, 6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.35
  headline:
    fontFamily: "Amiri, serif"
    fontSize: "2.1rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Amiri, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  verse:
    fontFamily: "Hafs, Amiri, serif"
    fontSize: "2.55rem"
    fontWeight: 400
    lineHeight: 2.05
  body:
    fontFamily: "Noto Kufi Arabic, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Noto Kufi Arabic, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  pill: "999px"
  card: "16px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "24px"
  arch-section: "999px 999px 16px 16px / 118px 118px 16px 16px"
  arch-hero: "999px 999px 0 0 / 230px 230px 0 0"
  arch-band: "260px 260px 16px 16px / 110px 110px 16px 16px"
spacing:
  arcade-gap: "12px"
  arcade-gap-md: "16px"
  arch-frame-inset: "8px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.on-gold}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.marble-white}"
    textColor: "{colors.royal-green}"
    rounded: "{rounded.pill}"
  section-arch:
    backgroundColor: "{colors.marble}"
    rounded: "{rounded.arch-section}"
  header:
    backgroundColor: "{colors.marble}"
    textColor: "{colors.text}"
---

# The Rawdah

The site is a garden court. White marble arches with gilded capitals stand on a royal-green carpet woven with a gold floral pattern, and gold vines climb the arches. Everything that is read sits on marble; everything that frames sits on green.

## Materials

- **Green carpet** (`royal-green`, deep `royal-green-deep`) owns the hero, page bands and footer, always with the woven gold flower pattern (`.zellige-lattice`).
- **White marble** (`marble`, `marble-white`) carries reading surfaces: the hero arch, section arches, cards, the header bar. Its sheen is soft radial light (`.zellige-lattice-ink`), never hard lines.
- **Silver** (`silver`, `silver-light`, `silver-ink`) is for hairlines, borders and muted text only.
- **Gold** (`gold`, `gold-leaf`) is for capitals, vines, leaves, the inner frame of every arch, and the one primary action per view.

## Form

- The arch is the only container shape: hero arch, section arches (`.wall-tile`) and page bands (`.page-band`) each carry a gold hairline inner frame inset 8px.
- Buttons and chips are pills.
- No grout and no tile grid; the arcade has a 12–16px gap on the marble ground.

## Type

Amiri for headings, Noto Kufi Arabic for interface text, Hafs (UthmanicHafs) for every verse.

## Motion

- On load, vines draw upward (`.vine-grow`) and leaves unfurl along them (`.leaf-unfurl`), then sway slowly (`.leaf-sway`).
- In the hero, a few gold leaves fall and specks of light drift (`.leaf-fall`, `.mote`).
- Pressing or hovering an arch unfurls a gold leaf at its apex and lifts the light inside (`.arch-leaf`, `.glaze`).
- Section arches rise in as they scroll into view (`arch-rise`).
- Reduced motion shows the vines fully grown, with no falling leaves and no drift.

## Skins

There are two skins: الروضة (default, described above) and الكسوة (black and gold). Dark mode is the night garden (`night-ground`, `night-field`).
