---
name: منصة القرآن الكريم
description: A Quran platform built as one Andalusian zellige wall, glazed tiles set in grout around the verse of the day.
colors:
  cobalt-glaze: "#1B3A8C"
  cobalt-deep: "#10275F"
  cobalt-light: "#2D54B8"
  cobalt-wash: "#E3E9F6"
  saffron-glaze: "#D99A1E"
  saffron-light: "#F0BE52"
  saffron-deep: "#8F5D07"
  emerald-glaze: "#0E6B5A"
  terracotta-glaze: "#B4472F"
  ink-glaze: "#0E1630"
  lime-plaster: "#EEF1EC"
  plaster-raised: "#F8FAF7"
  plaster-shade: "#E4E9E3"
  grout-line: "#CBD3CA"
  grout-soft: "#DCE3DB"
  on-glaze: "#F4F6FB"
  on-glaze-muted: "#C3CEEB"
  text-muted: "#46516A"
  text-soft: "#5F6A80"
  night-ground: "#0A1128"
  night-raised: "#111B3C"
  night-cobalt: "#7C9CF2"
typography:
  display:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "clamp(2.1rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0em"
  headline:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "ReemKufi, Noto Kufi Arabic, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  verse:
    fontFamily: "Hafs, Amiri, serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 2.05
  body:
    fontFamily: "Noto Kufi Arabic, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Noto Kufi Arabic, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  none: "0px"
  sm: "4px"
  card: "6px"
  lg: "5px"
  xl: "6px"
  2xl: "8px"
  3xl: "10px"
spacing:
  grout: "5px"
  tile: "16px"
  tile-md: "20px"
  band: "32px 24px 42px"
  band-md: "44px 40px 52px"
components:
  button-primary:
    backgroundColor: "{colors.saffron-glaze}"
    textColor: "{colors.ink-glaze}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.saffron-light}"
  button-outline:
    backgroundColor: "{colors.plaster-raised}"
    textColor: "{colors.ink-glaze}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-on-glaze:
    backgroundColor: "{colors.cobalt-deep}"
    textColor: "{colors.on-glaze}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  wall-tile:
    backgroundColor: "{colors.cobalt-glaze}"
    textColor: "{colors.on-glaze}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile}"
  plaster-tile:
    backgroundColor: "{colors.plaster-raised}"
    textColor: "{colors.ink-glaze}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile}"
  plaster-tile-hover:
    backgroundColor: "{colors.cobalt-wash}"
  card:
    backgroundColor: "{colors.plaster-raised}"
    rounded: "{rounded.card}"
  input-search:
    backgroundColor: "{colors.plaster-raised}"
    textColor: "{colors.ink-glaze}"
    rounded: "{rounded.sm}"
    padding: "16px 56px 16px 20px"
  page-band:
    backgroundColor: "{colors.cobalt-glaze}"
    textColor: "{colors.on-glaze}"
    rounded: "{rounded.sm}"
    padding: "{spacing.band}"
---

# Design System: منصة القرآن الكريم

## Overview

**Creative North Star: "The Alhambra Wall"**

The whole site is one zellige wall. Every section is a glazed tile set into a single mosaic, the grout between tiles is the page ground showing through, and the verse of the day sits on a lime-plaster medallion at the heart of an eight-fold rosette. Cobalt glaze carries the frame of the wall (header, hero, footer); emerald, saffron, terracotta and ink are the other glazes, each owning sections. Reading surfaces are cool lime plaster in light and deep night glaze in dark, so long reading happens on a calm ground while the frame stays glazed.

Geometry is the ornament. Eight-point stars, kites and lozenges are built mathematically (two overlapping squares at 22.5 degree offsets) and recur at every scale: the rosette, the star mark, the outline star inside each tile, the heading star, the star-and-cross lattice drawn as grout lines over every glazed field, and the diamond tile strip that seals each band. Tiles are square-shouldered and carry a glazed edge at rest: a lit top lip, a pooled shadow at the foot, a soft specular sweep. Motion is the act of tiling: tiles are set into the wall with a quarter turn, a sheen sweeps a tile when it is pressed, the rosette turns once every four minutes.

The world rejects the green-and-gold card portal: blurred blobs, gradient headings, rounded floating cards with icon bubbles.

**Key Characteristics:**
- One mosaic: sections are tiles in a 5px grout grid, not separate cards.
- Five glazes (cobalt, emerald, saffron, terracotta, ink) on a lime-plaster ground.
- Square Kufic display type (Reem Kufi) as tile inscription bands; Hafs for every verse.
- Eight-fold star geometry at every scale, drawn as tiles or as grout lines.
- Square shoulders: tiles have no radius; interactive controls stop at 4px.
- Motion grammar: tile-set entrance, glaze sheen on press, slow rosette turn; reduced motion shows the finished wall.

## Colors

Hand-glazed tile colours, saturated and slightly uneven, set against cool lime plaster.

### Primary
- **Cobalt Glaze** (cobalt-glaze): the field of the wall. Header, hero, footer, default page band, the primary text-link colour on plaster, scrollbar thumb and form accent. In dark mode the field drops to #12245C and the link colour lifts to night-cobalt.
- **Deep Cobalt** (cobalt-deep): the inscription band behind the home title, the secondary button on the field, the foot of the field and the tile strip ground.
- **Cobalt Light** (cobalt-light): alternate lozenges in the rosette; never a surface.
- **Cobalt Wash** (cobalt-wash): hover ground for plaster tiles, icon buttons and menu rows.

### Secondary
- **Saffron Glaze** (saffron-glaze): the one call to action (primary button), focus ring, text selection, the heart of the rosette and the star mark, heading stars, the rule either side of a verse reference, the active-nav underline.
- **Saffron Light** (saffron-light): primary button hover, footer column headings on the field.
- **Deep Saffron** (saffron-deep): saffron on plaster when it must carry text (group labels, verse-end marks), the `saffron-deep` page band, and the tint of the primary button's shadow.

### Tertiary
- **Emerald Glaze** (emerald-glaze): a section glaze (reciters, Asma Allah, Quranic sciences) and a page-band colour; petals and large stars in the rosette.
- **Terracotta Glaze** (terracotta-glaze): a section glaze (prophets, prayer times), the full-bleed prophets band, a page-band colour; the dusk at the foot of the arch window.
- **Ink Glaze** (ink-glaze): body text on plaster, text on saffron, and a dark section glaze (hadith, qibla) and page band.

### Neutral
- **Lime Plaster** (lime-plaster): the page ground in light mode, the verse medallion, and the plaster colour inside the tile strip and rosette.
- **Raised Plaster** (plaster-raised): surface of plaster tiles, cards, inputs, menus.
- **Plaster Shade** (plaster-shade): soft wells such as mobile nav rows and the scrollbar track.
- **Grout Line** (grout-line): the grout behind the tile wall and the default border. **Grout Soft** (grout-soft) is the hairline on cards and dividers.
- **On Glaze** (on-glaze) / **On Glaze Muted** (on-glaze-muted): text and secondary text on cobalt.
- **Text Muted** (text-muted) / **Text Soft** (text-soft): secondary text and placeholders on plaster.
- **Night Ground** (night-ground) / **Night Raised** (night-raised): the dark-mode page and surface. Dark mode is night glaze, not grey.

### Named Rules
**The Five Glazes Rule.** A tile takes one of the five glazes, solid. Each glaze has a fixed text pair (cobalt, emerald, terracotta and ink take near-white text; saffron takes dark ink #1A1204). Never mix two glazes on one tile, and never gradient one into another.

**The Saffron Is the Call Rule.** Saffron fills only the primary action, the focus ring and geometric marks. A screen has one saffron button group.

**The Plaster Holds the Text Rule.** Long reading sits on lime plaster or night glaze, never on a patterned glaze field. When a verse appears on the cobalt field it sits on a solid plaster medallion.

## Typography

**Display Font:** Reem Kufi (with Noto Kufi Arabic, sans-serif), self-hosted at 400/500/700.
**Body Font:** Noto Kufi Arabic (with system-ui).
**Verse Font:** KFGQPC Uthmanic Hafs (with Amiri), for every Quran text.

**Character:** Square Kufic display reads like an inscription band cut into the tile wall; Noto Kufi is its plainer working cousin for UI; Hafs is reserved for the Mushaf text and is never used for anything else.

### Hierarchy
- **Display** (700, 2.1rem on phones rising to 3.75rem, line-height 1.3): the site name in the hero inscription band; the prophets band title reaches the same size at line-height 1.15.
- **Headline** (700, 1.875rem rising to 2.25rem): section headings on the home wall and page-band titles.
- **Title** (700, 1.25rem rising to 1.5rem; wide tiles 1.5rem rising to 1.875rem, line-height tight): the name on each wall tile, footer column heads at 1rem.
- **Verse** (400, 1.6rem rising to 2.5rem; long verses 1.3rem rising to 2rem; line-height 2.05): the Quran text.
- **Body** (400, 1rem, line-height 1.75, tabular numerals): running text; tile descriptions at 0.75 to 0.875rem relaxed.
- **Label** (600, 11 to 12px): tile counts in a hairline box, button text at 0.875rem semibold.

### Named Rules
**The Inscription Rule.** Reem Kufi is for headings only (h1 to h3 and tile names). Body, labels and controls stay in Noto Kufi.

**The Hafs Only Rule.** Verses are set in Hafs and nothing else is.

## Layout

Phone first, right to left. Content sits in centred containers (max-width 72rem for the wall and bands, 80rem for the header, 38rem for the verse medallion, 42rem for search). The home page reads top to bottom as one wall: full-bleed cobalt hero, the section wall, the full-bleed terracotta prophets band, the reciters tile run, the cobalt footer. Inner pages open with a page band in their section's glaze, then content on plaster.

The tile wall is a 2-column grid on phones and 4 columns from 768px, with 5px gaps and 5px padding on a grout-coloured ground, so the grout reads continuous around every tile. Tiles may span two columns (wide) or two rows (tall); dense auto-flow packs them. Wall tiles have a minimum height of 9.5rem (11rem from 768px) and pad 16px (20px from 768px). Bands pad 32px 24px 42px, rising to 44px 40px 52px from 768px. Vertical rhythm between home sections is 40 to 80px.

**The Grout Gap Rule.** Tiles in a run are separated by exactly 5px of grout, never by whitespace margins. Gaps wider than grout turn the wall back into a card grid.

## Elevation & Depth

Depth is glaze, not lift. Tiles sit flush in the wall and get their depth from inset light: a 1.5px lit lip at the top, a 3px pooled shadow at the foot, a faint specular gradient at 155 degrees. Drop shadows exist but are reserved for things that sit in front of the wall: the sticky header, page bands, the verse medallion and inscription band in the hero, search, dropdowns, and the saffron button.

### Shadow Vocabulary
- **Glazed edge, glaze tile** (`box-shadow: inset 0 1.5px 0 rgba(255,255,255,.28), inset 0 -3px 0 rgba(0,0,0,.16), inset 0 0 0 1px rgba(0,0,0,.06)`): every wall tile at rest.
- **Glazed edge, plaster tile** (`box-shadow: inset 0 1.5px 0 rgba(255,255,255,.6), inset 0 -3px 0 rgba(14,22,48,.07)`): reading-side tiles.
- **Small** (`0 1px 2px rgba(14,22,48,.08)`): cards.
- **Standard** (`0 6px 18px -6px rgba(14,22,48,.18), 0 2px 4px rgba(14,22,48,.06)`): page bands, search field.
- **Large** (`0 18px 40px -12px rgba(14,22,48,.28)`): dropdowns and menus.
- **Saffron cast** (`0 6px 16px -6px rgba(143,93,7,.55)`): the primary button only.

### Named Rules
**The Flush Tile Rule.** A tile never floats. No drop shadow and no hover translate on a wall or plaster tile; its response is the glaze sheen and, on plaster, the cobalt wash.

## Shapes

Square shoulders throughout. Wall and plaster tiles have no radius; buttons, inputs, icon buttons and page bands stop at 4px; cards at 6px; the Tailwind scale is tightened to 5/6/8/10px so nothing reaches pill or bubble softness. Circles appear only where the subject is round (reciter portraits, spinners).

The recurring silhouettes are geometric: the eight-point star (two squares overlapped at 22.5 degrees), the kite, the lozenge, the octagon (the verse medallion is clipped to an octagon with 9% chamfers), the 45 degree diamond of the tile strip, and the horseshoe arch of the prophets window. Glazed fields carry the 56px star-and-cross lattice as white grout lines at 14 to 16% opacity; plaster surfaces carry it in cobalt at 8%. Every glazed band is sealed at its foot by a tile strip: saffron, emerald, terracotta and cobalt diamonds on plaster, repeating.

## Components

### Buttons
Tactile and few.
- **Shape:** square-shouldered (4px), 1.5px border, 12px 20px padding, semibold 0.875rem, icon gap 8px.
- **Primary:** saffron glaze with ink text and a saffron-tinted cast shadow; hover lifts to saffron light with a deeper cast.
- **On glaze:** deep cobalt fill with a plaster border and near-white text, used beside the primary on the cobalt field; on terracotta the same role is a translucent fill with a half-opacity light border.
- **Outline:** raised plaster with grout border; hover turns border and text cobalt.
- **Press:** scale to 0.97. Disabled at 50% opacity.

### Wall Tile (signature)
The unit of the whole site. A solid glaze with the lattice over it at 60 to 70% opacity, an outline eight-point star in the glaze's line colour bleeding off the lower corner (it turns 45 degrees on hover over 1.4s), the section icon top-right, a count in a 1px hairline box, the Kufic title and a muted description at the foot. Glazed edge at rest; where scroll timelines exist the tile is pressed into the wall as it enters (scale 0.86 and a 6 degree turn, desaturated, settling to rest). Pressing sweeps a white sheen across it (0.9s). The reciters run uses the same tile at a 5.5rem minimum height with portrait and name.

### Plaster Tile
The reading-side tile for index lists (surahs, Asma Allah): raised plaster in the same grout grid, plaster glazed edge, cobalt wash on hover, the glaze sheen on press, a cobalt outline star holding the number.

### Page Band
The opening of every inner page: a glaze field (cobalt, emerald, terracotta, ink or deep saffron by section) with the lattice overlaid, a 12px tile strip at its foot, 4px corners, standard shadow, Kufic h1 at 700.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** raised plaster, grout-soft 1px border, small shadow.
- Used for utility content (continue reading, dashboard). Tiles are preferred wherever content is a set of peers.

### Inputs / Fields
- **Search:** raised plaster, 2px grout border, 4px corners, standard shadow, 16px vertical padding, search glyph inset on the right. Focus turns the border saffron. Results drop in a plaster panel with grout hairlines between rows and cobalt wash on hover.

### Navigation
The header is the cobalt field, sticky, sealed by an 8px tile strip. Star mark plus Kufic site name on the right; links in on-glaze-muted with a transparent 2px underline that turns saffron (text to white) on hover and for the current page. Dropdowns are plaster panels with a 3px saffron top edge and large shadow. Icon buttons are 40px squares at 4px. On phones a plaster drawer lists sections in two columns under deep-saffron group labels.

### Rosette and Marks
The hero rosette is seven rings of glazed polygons (star heart, petals, small stars, lozenges, large axis stars, kites, a 32-lozenge crown) in grout stroke, each tile with its own lightness jitter of up to 4% and a sheen gradient. Tiles are set ring by ring from the centre outward (140ms per ring, 14ms per tile), then the whole rosette turns once every 240s. The star mark (saffron star, cobalt heart, plaster eye) is the logo; the heading star (saffron with a ground-coloured heart, 22px) marks section headings on plaster pages.

### Motion
Ease-out `cubic-bezier(.16, 1, .3, 1)` for every entrance and state change. Tile-set (0.9s scale 0.55 and a -45 degree turn into place), rise-in (0.8s from 14px below with a light blur), glaze sheen (0.9s), rosette turn (240s linear), orb breathe (6s). Under reduced motion every animation and the sheen are off and the finished wall is shown.

## Do's and Don'ts

### Do:
- **Do** build any set of peer destinations as a tile run: 5px grout gaps on a grout-line ground, one solid glaze per tile, the glazed edge at rest.
- **Do** open every inner page with a page band in its section's glaze, sealed by the tile strip.
- **Do** draw ornament from the eight-point star geometry in Rosette.tsx (star, kite, lozenge) rather than importing motifs.
- **Do** set verses in Hafs on plaster, with the surah reference in cobalt between short saffron rules.
- **Do** keep tiles at 0 radius and controls at 4px.
- **Do** pair saffron tiles with dark ink text (#1A1204) and every other glaze with near-white text.

### Don't:
- **Don't** use gradient headings, blurred colour blobs, or glaze-to-glaze gradients on surfaces.
- **Don't** float tiles: no drop shadows or hover lift on wall or plaster tiles.
- **Don't** set body or UI text in Reem Kufi, or any non-Quran text in Hafs.
- **Don't** put long reading text directly on a lattice-patterned glaze field.
- **Don't** use more than one saffron button group on a screen.
- **Don't** round anything into pills or bubbles; the largest radius in the scale is 10px.
