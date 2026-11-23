---
name: منصة القرآن الكريم
description: A Quran platform set under the Fajr sky, night turning to dawn over misty hills, with the verse of the day rising out of the mist.
colors:
  night-sky: "#070B1E"
  night-raised: "#0E1430"
  night-well: "#0B1128"
  night-pane: "rgba(20,27,64,.62)"
  night-blue: "#1C2A6E"
  night-deep: "#0B1233"
  night-periwinkle: "#A9B6F2"
  twilight-indigo: "#3A4BA0"
  dawn-gold: "#E2B35A"
  first-light: "#F3CD7E"
  night-gold: "#F0C46E"
  gold-ink: "#8A6016"
  horizon-gold: "#C9962F"
  saffron-ink: "#1A1204"
  twilight-violet: "#4A2F6B"
  violet-glow: "#6A4A92"
  deep-teal: "#123F4A"
  teal-glow: "#1E6F7C"
  mist-lilac: "#B497CC"
  starlight: "#F2EFE8"
  on-sky: "#F7F3EA"
  on-sky-muted: "#B9B6D3"
  night-text-muted: "#BBB9D2"
  night-text-soft: "#8F8DAE"
  dawn-ground: "#F3EFE7"
  dawn-paper: "#FBF9F4"
  dawn-well: "#EAE4D8"
  dawn-rule: "#DDD5C6"
  dawn-rule-soft: "#E8E1D4"
  dawn-wash: "#E9E6F3"
  dawn-ink: "#12142A"
  dawn-heading: "#16183A"
  dawn-text-muted: "#4A4C66"
  dawn-text-soft: "#67697F"
typography:
  verse-hero:
    fontFamily: "Hafs, Amiri, serif"
    fontSize: "5rem"
    fontWeight: 400
    lineHeight: 2.05
  verse:
    fontFamily: "Hafs, Amiri, serif"
    fontSize: "1.7rem"
    fontWeight: 400
    lineHeight: 2.6
  display:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0em"
  display-band:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Noto Kufi Arabic, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Noto Kufi Arabic, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  control: "4px"
  chip: "12px"
  pane: "14px"
  pill: "999px"
spacing:
  pane-gap: "12px"
  pane: "16px"
  pane-md: "20px"
  band: "44px 24px 58px"
  band-md: "64px 40px 76px"
  hero: "56px 0 72px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.dawn-gold}"
    textColor: "{colors.saffron-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-primary-night:
    backgroundColor: "{colors.night-gold}"
    textColor: "{colors.saffron-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.first-light}"
  button-outline:
    backgroundColor: "{colors.dawn-paper}"
    textColor: "{colors.dawn-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  icon-button:
    textColor: "{colors.night-text-muted}"
    rounded: "{rounded.control}"
    size: "{spacing.touch}"
  sky-pane:
    backgroundColor: "{colors.night-blue}"
    textColor: "{colors.on-sky}"
    rounded: "{rounded.pane}"
    padding: "{spacing.pane}"
  dawn-pane:
    backgroundColor: "{colors.dawn-wash}"
    textColor: "{colors.dawn-heading}"
    rounded: "{rounded.pane}"
    padding: "{spacing.pane}"
  card-night:
    backgroundColor: "{colors.night-pane}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.pane}"
  card-dawn:
    backgroundColor: "{colors.dawn-paper}"
    textColor: "{colors.dawn-ink}"
    rounded: "{rounded.pane}"
  page-band:
    backgroundColor: "{colors.night-sky}"
    textColor: "{colors.on-sky}"
    rounded: "{rounded.pane}"
    padding: "{spacing.band}"
  header:
    backgroundColor: "{colors.night-sky}"
    textColor: "{colors.on-sky}"
  input-search:
    backgroundColor: "{colors.dawn-paper}"
    textColor: "{colors.dawn-ink}"
    rounded: "{rounded.control}"
    padding: "16px 56px 16px 20px"
  menu-chip:
    backgroundColor: "{colors.dawn-well}"
    textColor: "{colors.dawn-ink}"
    rounded: "{rounded.chip}"
    height: "{spacing.touch}"
---

# Design System: منصة القرآن الكريم

## Overview

**Creative North Star: "The Hour Before Fajr"**

The site is the sky in the last hour of night. Every page sits under a deep indigo night strewn with faint stars; the horizon at the foot of each band glows with first light; misty hills stand between. The verse of the day is the dawn itself: on the home page it rises out of the mist word by word, the only large thing on the screen. Fajr is the default world (`data-skin="fajr"` on `<html>`), and night is the default theme. Light mode is the same world after first light: the sky turns pale lilac and peach, reading surfaces become warm paper, and the ink is deep night blue. The home hero keeps its night scene in both themes, because it is the moment before dawn.

Depth comes from light, not ornament. Section tiles are panes of night lit from below, glass at night and dawn-tinted paper by day, set 12px apart with 14px corners. One gold line of first light, fading out at both ends, replaces every border strip and seals each band, the hero and the footer. Motion is the sky moving: mist drifts across the hills, panes rise into place as they scroll in, the hero scene sinks as it scrolls away, the verse rises word by word. Nothing in the world depicts a person; the prophets appear only as light.

Two alternate skins remain selectable from the skin switch and the phone menu's المظهر row: **Andalus** (the original zellige wall: cobalt, saffron, emerald and terracotta glaze tiles in grout, eight-point star geometry, square shoulders) and **Kiswah** (black and gold). Both are complete worlds in `globals.css`; this document describes Fajr, the primary system.

**Key Characteristics:**
- Night sky by default (#070B1E with a star field), dawn paper in light mode (#FBF9F4 on #F3EFE7).
- One accent: dawn gold (#E2B35A, #F0C46E at night) on pill primary buttons, the horizon line, focus and selection.
- Panes, cards and bands at 14px corners; buttons are pills.
- Glass at night (14px backdrop blur on cards, 18px on the header), paper at dawn.
- A single 1px gold horizon line in place of zellige tile strips.
- Reem Kufi for headings, Noto Kufi for UI, Hafs only for Quran text.
- Motion: word-rise, mist-drift, fajr-rise view timeline, hero parallax; all off under reduced motion.

## Colors

A night sky of indigo, violet and deep teal, warmed only by gold at the horizon; at dawn the same hues thin out to lilac, peach and warm paper.

### Primary
- **Night Sky** (night-sky): the page ground at night, the header glass (at 78% with blur), the footer and the top of every page band. Never grey.
- **Night Blue** (night-blue): the default sky-pane colour and the "cobalt" band glow; the indigo middle of the night sky.
- **Night Periwinkle** (night-periwinkle): links, active controls and the primary role at night; text on it is night-deep (`--on-primary: #0B1233`).
- **Twilight Indigo** (twilight-indigo): the primary role at dawn (links, selected segments, spinner, scrollbar); white text on it (`--on-primary: #FFFFFF`).

### Secondary
- **Dawn Gold** (dawn-gold): the one accent. Primary button fill at dawn, focus ring, text selection (on dawn-ink), the hero's flanking rules, saffron sky panes.
- **First Light** (first-light): the horizon line at night, the hero site name and verse citation, active-nav underline at night, primary button hover, and the gold edge on a hovered pane.
- **Night Gold** (night-gold): the gold role at night (primary button fill, gold text on night ground).
- **Gold Ink** (gold-ink): gold that must carry text on dawn paper (group labels in the phone menu, verse-end numbers) and the tint of the primary button's cast at dawn.
- **Horizon Gold** (horizon-gold): the horizon line and active-nav underline at dawn.

### Tertiary
- **Twilight Violet** (twilight-violet) / **Violet Glow** (violet-glow): the violet panes and band glow (prophets, hifz, prayer times); the prophets band warms from night to violet.
- **Deep Teal** (deep-teal) / **Teal Glow** (teal-glow): the teal panes and band glow (reciters, sciences, Asma Allah).
- **Mist Lilac** (mist-lilac): the dawn haze in the painted hero and the body's top wash; the colour of mist, never a surface.

### Neutral
- **Starlight** (starlight): body text at night. **Night Text Muted** (night-text-muted) and **Night Text Soft** (night-text-soft): secondary text and placeholders at night.
- **On Sky** (on-sky) / **On Sky Muted** (on-sky-muted): text and nav links on the header, bands and footer at night.
- **Night Raised** (night-raised) / **Night Well** (night-well) / **Night Pane** (night-pane): raised panels, wells, and the translucent card glass at night; borders are `rgba(185,182,211,.18)` and `.1`.
- **Dawn Ground** (dawn-ground), **Dawn Paper** (dawn-paper), **Dawn Well** (dawn-well): page ground, cards and inputs, and soft wells at dawn.
- **Dawn Rule** (dawn-rule) / **Dawn Rule Soft** (dawn-rule-soft): borders and hairlines at dawn.
- **Dawn Ink** (dawn-ink), **Dawn Heading** (dawn-heading), **Dawn Text Muted**, **Dawn Text Soft**: text at dawn. **Dawn Wash** (dawn-wash): hover and selected ground for menu rows and icon buttons.

### Named Rules
**The One Gold Rule.** Gold is the only warm accent. It fills the primary button, draws the horizon line, rings focus and marks selection. A screen has one primary button group.

**The Sky Holds the Colour Rule.** Hue lives in the sky (bands, header, footer, hero, panes). Long reading sits on night glass or dawn paper with plain ink, never on a gradient sky.

## Typography

**Display Font:** Reem Kufi (with Noto Kufi Arabic, sans-serif), self-hosted at 400/500/700.
**Body Font:** Noto Kufi Arabic (with system-ui), tabular numerals.
**Verse Font:** KFGQPC Uthmanic Hafs (with Amiri), for every Quran text and nothing else.

**Character:** Square Kufic headings carry the inscription voice; Noto Kufi is the quiet working face for UI; Hafs is the Mushaf and stays untouched.

### Hierarchy
- **Verse, hero** (400, 2.5rem on phones, 3.4rem from 640px, 5rem from 768px; long verses 1.7 / 2.2 / 3rem; line-height 2.05): the verse of the day, near-white #FBFAF4 with a soft night text-shadow, balanced wrap.
- **Verse, reader** (400, 1.7rem by default, user-adjustable 1.2 to 2.6rem, line-height 2.6): the surah reader.
- **Display** (700, clamp(2rem, 5vw, 3.25rem), line-height 1.25): page-band titles.
- **Display, band** (700, 2.25rem rising to 3.75rem, line-height 1.15): the prophets band title.
- **Headline** (700, 1.875rem): section headings on the home page.
- **Title** (700, 1.25rem rising to 1.5rem, tight): the name on each section pane; footer column heads at 1rem in first light.
- **Body** (400, 1rem, line-height 1.75): running text; pane descriptions 0.75 to 0.875rem relaxed.
- **Label** (600, 0.875rem): button text; pane counts at 0.75rem; group titles (القرآن, المحتوى, إسلاميات) 1 to 1.125rem bold in muted text with a hairline running to the edge.

### Named Rules
**The Hafs Only Rule.** Verses are set in Hafs and nothing else is. Verified text is rendered byte-exact, never restyled into display type.

**The Inscription Rule.** Reem Kufi is for headings and pane names only; body, labels and controls stay in Noto Kufi.

## Layout

Phone first, right to left. Content sits in centred containers: 72rem for the section wall and bands, 80rem for the header, 64rem for the hero, 56rem for the hero verse, 48rem for search and the phone menu.

The home page reads top to bottom as one night: the full-viewport hero (min-height `calc(100svh - 68px)`, padding 56px 0 72px) with the verse of the day, search and two actions; the section wall in three labelled groups (القرآن / المحتوى / إسلاميات, the same groups as the site menu); the full-bleed prophets band; the reciters run; the night-sky footer. Inner pages open with a page band in their section's sky, then content on glass or paper.

The section wall is a 2-column grid on phones and 6 columns from 768px, with 12px gaps and no grout ground. Groups of six fill two rows of three; groups of five fill a row of three and a row of two, and on phones the fifth pane spans both columns, so no row is ragged. Panes have a minimum height of 9rem (10.5rem from 768px) and pad 16px (20px from 768px). Page bands pad 44px 24px 58px, rising to 64px 40px 76px from 768px. Every interactive target is at least 44px.

On phones the surah reader's controls collapse to one row (listen to the surah, verse by verse, settings) that scrolls away with the page; the settings expand below on demand. From 768px the full control card stays pinned under the header.

## Elevation & Depth

Depth is light and glass. At night, surfaces are translucent over the star field and blur what passes behind them; at dawn they are paper with soft, cool shadows. Panes are lit from below by a radial glow and carry a 1px hairline instead of the zellige glazed lip.

### Shadow Vocabulary
- **Pane at night** (`box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), 0 18px 40px -22px rgba(0,0,0,.7)`): section panes at rest.
- **Pane lifted** (`inset 0 0 0 1px rgba(243,205,126,.35), 0 28px 50px -22px rgba(0,0,0,.8), 0 0 40px -10px rgba(243,205,126,.25)`): pane hover at night, with a 4px rise.
- **Pane at dawn** (`inset 0 0 0 1px rgba(22,24,58,.07), 0 14px 30px -22px rgba(22,24,58,.35)`); hover swaps the hairline to `rgba(201,150,47,.55)`.
- **Card glass** (`inset 0 1px 0 rgba(255,255,255,.05), 0 10px 30px -12px rgba(0,0,0,.7)` with `backdrop-filter: blur(14px)`): cards and reading tiles at night.
- **Header glass** (`backdrop-filter: saturate(1.4) blur(18px)`; `0 1px 0 rgba(226,179,90,.28), 0 12px 32px -18px rgba(0,0,0,.8)`): the sticky header; at dawn the hairline is `rgba(138,96,22,.28)`.
- **Band** (`inset 0 0 0 1px rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.6)`): page bands.
- **Gold cast** (`0 8px 28px -8px rgba(243,205,126,.55)`, hover `0 12px 36px -8px rgba(243,205,126,.7)`; at dawn `0 8px 22px -10px rgba(138,96,22,.55)`): the primary button only.
- **Horizon glow** (`0 0 18px 2px rgba(243,205,126,.25)`): the horizon line at night.

### Named Rules
**The Lit From Below Rule.** Panes take their light from the horizon: a radial glow at the foot and a 1px hairline. No glazed top lip, no 3px foot shadow.

## Shapes

Soft, cinematic corners. Section panes, cards, page bands and the hadith frame round to 14px (`--radius-cine`); buttons are full pills (999px); the phone menu's chips round to 12px. Icon buttons, the search field, the skin switch and plaster reading tiles outside the hadith frame still carry the Andalus base shapes (4px or square), which Fajr has not yet overridden. Circles appear only where the subject is round (reciter portraits, skin swatches, spinners).

The recurring silhouettes are the horizon and the hills: two or three layered hill curves at the foot of the hero and of each page band, mist bands drifting between them, and the 1px horizon line. The prophets band frames its night in a horseshoe arch window. Under Fajr the zellige ornament (tile stars, the star-and-cross lattice on panes, ornament patterns) is hidden; the lattice class on sky fields draws the 180px star field instead.

## Components

### Buttons
Soft and few.
- **Shape:** full pill (999px), 1.5px border, 12px 20px padding, semibold 0.875rem, 8px icon gap; 44px minimum height in the reader.
- **Primary:** dawn gold (night gold after dark) with saffron-ink text and a first-light cast; hover lifts to first light with a wider cast.
- **Outline:** dawn paper with a dawn-rule border at dawn, `rgba(255,255,255,.04)` glass at night; hover turns border and text to the primary role.
- **On sky:** a translucent fill with a half-opacity light border beside the primary on the prophets band.
- **Press:** scale to 0.97. Disabled at 50% opacity.

### Icon Buttons
44px square targets (`.icon-btn`), muted text; hover fills with the primary wash and turns the glyph to the primary role. On the header they sit on the night glass with an 8% white hover.

### Sky Pane (signature)
The unit of the section wall. A pane in one of the five sky hues (night blue, deep teal, dawn gold, twilight violet, night) at night, or their dawn tints (#DDE1F6, #D3EBEA, #F5DDA6, #E9DEF4, #E4E1EE with #16183A text) by day, lit by a radial glow from below, 14px corners, a 1px hairline. The line icon sits top-right, a count in a 1px hairline box, the Kufic name and a muted description at the foot. Hover rises 4px with a gold edge over 0.5s. Where view timelines exist the pane rises into place (fajr-rise: from 18px below at 20% opacity, finished by 70% of entry).

### Page Band
The opening of every inner page: its own patch of sky. Night at the top, warming toward the band's hue at the horizon (`--band`: #2E3F9E, #1E6F7C, #6A4A92, #1C2A6E or #9A6A1C at night; #B9C1EC, #A9D8D6, #D3BEEA, #C8C3DE or #F0CE8C at dawn), the star field above, a 46px hill silhouette at the foot sealed by a gold hairline, 14px corners. The h1 is near-white with a soft shadow at night and dawn-heading ink by day.

### Home Hero
The night scene: a painted dawn (CSS gradients, six stars and a three-layer SVG hill range with two drifting mist bands) is always present, so first paint, slow links, Save-Data and reduced motion still get the scene; a looping misty-dawn video fades in over it (1.6s) only once it is actually playing. A scrim keeps the sky deep above the verse and settles into night at the foot. The site name sits small in first light between two short gold rules; the verse rises word by word; the citation links to the verse; search and two actions follow; the horizon line seals the foot. While the hero scrolls away the stage sinks and scales up and the content lifts and fades.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** night pane glass with a 14px backdrop blur at night; dawn paper by day.
- **Border:** 1px `rgba(185,182,211,.1)` at night, dawn-rule-soft by day.
- **Shadow:** card glass at night (see Elevation), the small shadow by day.

### Inputs / Fields
- **Search:** dawn paper by day and night-pane glass after dark (`--surface`), 2px border in the rule colour, 4px corners, 16px vertical padding, glyph inset on the right. Focus turns the border gold. Results drop in a panel with hairlines between rows and the primary wash on hover.

### Navigation
The header is night glass: 78% night over an 18px backdrop blur, one gold hairline at its foot, no tile strip. Kufic site name on the right; links in on-sky-muted with a transparent 2px underline that turns first light (white text) on hover and for the current page, marked with `aria-current="page"`; groups open dropdown panels. At dawn the header is 82% dawn paper with horizon-gold underlines. On phones a drawer lists the sections in the same three groups under gold-ink labels, in 44px chips at 12px corners, ending with a labelled المظهر row: a full-width day/night toggle and one chip per skin with its swatch and `aria-pressed`.

### Prophets Band
A full-bleed night that warms toward a violet horizon, with a gold glow behind a horseshoe-arch window of stars and a breathing orb: no people, only light. Kufic title, a short sourced paragraph, the primary pill and an on-sky pill; the horizon line seals it.

### Footer
A patch of night sky (dawn sky by day) under the horizon line, the star field over it, Kufic site name, four link columns headed in light gold (`--gold-light`).

### Motion
Ease-out `cubic-bezier(.16, 1, .3, 1)` throughout. Word-rise (1.1s, from 0.4em below with a 10px blur, 90ms per word after 300ms), cine-in (0.9s from 10px, staggered), mist-drift (18s and 26s, alternating, 4% each way), fajr-rise (scroll-driven view timeline on panes), hero parallax (`--p` from scroll), pane hover rise (0.5s), video fade (1.6s), orb breathe (6s). Under `prefers-reduced-motion` the words, entrances, mist, pane rise and parallax are all off, the content is fully visible, and the video is never loaded.

## Do's and Don'ts

### Do:
- **Do** round panes, cards and page bands to 14px (`--radius-cine`) and make buttons full pills (999px).
- **Do** make reading surfaces glass at night (night pane with a 14px backdrop blur) and warm paper at dawn (#FBF9F4 on #F3EFE7).
- **Do** seal the hero, every band and the footer with the single 1px gold horizon line (#F3CD7E at night, #C9962F at dawn), fading out at both ends.
- **Do** keep gold as the only warm accent: the primary pill, the horizon, focus and selection.
- **Do** open every inner page with a page band in its section's sky, with stars above and hills at the foot.
- **Do** group peer destinations the way the menu groups them (القرآن / المحتوى / إسلاميات) as sky panes 12px apart.
- **Do** keep a painted CSS/SVG fallback under any hero video, and skip the video under reduced motion and Save-Data.
- **Do** make every touch target at least 44px, and mark the current page with `aria-current="page"`.
- **Do** set every verse in Hafs, byte-exact from the verified text.

### Don't:
- **Don't** use zellige ornament under Fajr: no tile stars, star-and-cross lattice on panes, diamond tile strips or glazed top lips.
- **Don't** set long reading text on a gradient sky; it belongs on glass or paper.
- **Don't** use a second warm accent or more than one primary button group on a screen.
- **Don't** depict people, prophets or faces in any image, film or illustration; prophets appear only as light.
- **Don't** use emoji anywhere.
- **Don't** set body or UI text in Reem Kufi, or any non-Quran text in Hafs.
- **Don't** paraphrase a verse as a quotation or restyle verified text.
