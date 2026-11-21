---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/layout.tsx"]
---

# Surface: home (/) and site-wide shell

Scope: replacement visual world for the whole site; home is the Persuade surface, every other route inherits the world in Operate/Read register. Audience: everyone, phone first, Arabic RTL. All sections equally important. Constraints: no emoji, no people, verified text untouched, Hafs for Quran.

## Direction contract

THESIS: The site is a zellige wall from the Alhambra: every section is a glazed tile set into one mosaic, and the verse of the day sits at the heart of an eight-fold rosette. It refuses the green-and-gold card portal with blurred blobs and gradient headings.

OWN-WORLD: Cobalt glaze field (#1B3A8C family) carries the hero, header band and footer; emerald (#0E6B5A), saffron (#D99A1E) and terracotta (#B4472F) glazes are the other three tile colours, each owning sections; reading surfaces are cool lime plaster (#EEF1EC) in light, deep night glaze (#0B1330) in dark. Square Kufic display type (Reem Kufi) like tile inscription bands, Noto Kufi for UI, Hafs for verses. Components are tiles: square-shouldered, glazed edge, thin grout lines, star-and-cross pattern.

STORY: The visitor sees the verse of the day inside the rosette, knows at once this is a Quran platform, searches or taps a tile to reach any section, and returns daily.

FIRST VIEWPORT: Full-bleed cobalt field; the eight-fold rosette assembles tile by tile behind the centred verse of the day (Hafs, large), surah reference under it; the Kufic title band above; search field directly below the rosette as the primary action, with "متابعة القراءة" and "استمع" beside it; the first row of section tiles peeks at the bottom edge.

FORM: Andalusian zellige mosaic, position 7 of the ordered list; seed:9add0c5d696aff51. Signature interaction: tiles are "set" into the wall (scale and quarter-turn into place, staggered from the centre outward) on entry; pressing a tile glazes it (sheen sweep). Motion grammar: slow rosette rotation, tile-setting entrances, reduced-motion shows the finished wall.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
