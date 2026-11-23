# منصة القرآن الكريم

Next.js 14 app router, Tailwind, framer-motion, deployed on Vercel. Read `PRODUCT.md` (users, brand rules) and `DESIGN.md` (design system, including the default Fajr world) before any design work.

## Brand rules that override every design skill

- No depiction of people, prophets or companions. No stock photos of people, even when a skill asks for "real photographs".
- No emoji, no music, no invented content: Quran text and hadith stay byte-exact, with sources shown.
- Arabic first, RTL, mobile first, respect `prefers-reduced-motion`.

## Design skills in this project (`.claude/skills/`)

Use them together, each for its own job:

| Job | Skill |
|---|---|
| Build or redesign a page or section from a strong reference, with real media | `motionsites-web-builder` |
| Build or review a page to a high bar: one system, copy, layout, motion, finish gate in a real browser | `design-taste-frontend` (Taste) |
| Critique, audit, polish or animate UI; keep `DESIGN.md` in sync | `impeccable` (installed as an account plugin: `impeccable:impeccable`, with its design hook and review agents) |
| Match a known brand's tokens on request ("like Linear", "Stripe feel") | `awesome-design` (84 brand `DESIGN.md` files bundled in `library/`) |
| Drive the running site in a browser: click, fill, screenshot, check console | `playwright-cli` |

A typical flow is: plan with the reference skill (motionsites or Taste), build in the app's stack, run `impeccable` to critique and polish, then verify with `playwright-cli` against `npm run dev` at desktop and phone widths.

## Environment notes

- Chrome for the skills' scripts: `CHROME_PATH` points to `.claude/tools/chrome`, which finds a local Chrome/Chromium and adds `--no-sandbox` only when running as root (cloud containers).
- `playwright-cli` is the npm package `@playwright/cli` (global install: `npm i -g @playwright/cli`). Its working files go to `.playwright-cli/` (git-ignored).
- Taste writes `.taste-skill/` when its finish gate is armed for a static page build; it is a build artefact, not project source.
