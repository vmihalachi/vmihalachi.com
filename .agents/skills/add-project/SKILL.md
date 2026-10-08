---
name: add-project
description: Add a new project to the Projects section of vmihalachi.com, or restructure an existing project card. Use when asked to add, feature, or showcase a project, app, library, or side project on the site. Covers the template markup, strings in every language, the project's colors and art, and the checks to run.
---

# Add a project

The Projects section (`section#projects` in `index.html`) is a stack of `.side-project`
cards: mybackhurts, Deskling, and sunnysays. A new project is one more card. The page is
meant to grow this way, so don't restructure the section to fit it.

## 1. Check the facts first

Read `PRODUCT.md`. Everything said about the project must be true and checkable: name,
URL, platforms, license, status. If the project isn't listed under "Evidence on Hand", ask
Vlad for the facts rather than inferring them from a repo or website, then add a line for
it to that list. Never invent features, numbers, or screenshots.

## 2. Add the card to the template

Copy the closest existing `.side-project` block in `index.html` and place it where the
project belongs in the stack. Use a short lowercase slug (for example `sunnysays`) for the
class, the ID, and the string keys. The card has these parts:

- `<div class="manifesto side-project tone-<slug>">`.
- `<p class="section-mark">{{ <slug>.mark }}</p>`. Only the first card carries the
  `02 /` number, because the number belongs to the section.
- `<h3 id="<slug>-title">{{ <slug>.title }}</h3>`. A `<span>` around a word in the title
  string gets the highlight animation, as in the other cards.
- The art: `<figure class="project-art <prefix>-art" aria-hidden="true">`, with a comment
  above it saying where the drawing comes from (see step 4).
- `.manifesto-copy` holds:
  - the name link (`.project-name-link` around `<span class="project-name">`) followed by
    `{{ <slug>.description }}`;
  - an optional `{{ <slug>.details }}` paragraph;
  - the `.project-link` with `<span aria-hidden="true">↗</span>`;
  - `<p class="small">{{ <slug>.status }}</p>`.
- External links use `target="_blank" rel="noopener noreferrer"`.
- The project name is a brand, so it can stay literal in the markup. Every other visible
  word is a placeholder.

## 3. Add the strings to every language

Add a top-level `<slug>` object with the same keys to `src/i18n/en.json`, `it.json`, and
`ro.json`: `mark`, `title`, `description`, `details` (if used), `link`, `status`, plus any
text the art shows (`artSomething`). Follow the `edit-copy` skill for voice and
translation. The build fails if any language is missing a key or has an extra one.

## 4. Draw the art from the project's own art

Reuse the project's real visuals: its icon, character, or UI, redrawn in SVG/HTML from
its repo or site, as the others are (the chair squat from the mybackhurts landing page,
Deskling's mark, Sunny from the sunnysays character sheet). Never a made-up screenshot.

- Self-host any asset in `public/`. Loading from another origin needs a CSP change in
  `public/staticwebapp.config.json`, which is a deliberate trade-off, so ask first.
- The default CSS is the still pose. That's what no-JS and reduced-motion visitors see,
  so it should read well on its own.
- Put motion under `.js .<prefix>-art.is-visible`. `main.js` adds `.is-visible` when the
  art scrolls into view and removes it once the art is fully off screen, so CSS-only art
  (like Deskling's) replays on its own.
- If the art needs JS (like counting reps or switching lines), add a function to `plays`
  in `src/main.js`, keyed by the art's class. It starts the animation and returns a reset
  function that restores the still pose. It isn't called under reduced motion.
- Check the art at the `720px` breakpoint at the end of `src/style.css`.

## 5. Give it the project's colors

Add a `.side-project.tone-<slug>` rule next to the others in `src/style.css` and set
`--tone` (the page tint while the card is read), `--accent`, `--accent-text`, `--chip`,
and `--muted`, taken from the project's own site or app. Add a one-line comment naming
the source, as the others do. `--accent-text` and `--muted` must meet WCAG AA contrast on
`--tone`.

## 6. Check it

1. `npm run check` (format, lint, types, CSP hash, i18n) and `npm run build`.
2. Preview `/`, `/it/`, and `/ro/`. Check the reveal, the art playing and resetting, the
   page tint, mobile width, and reduced motion.
3. Update the "Architecture" notes in `AGENTS.md` if the card adds something new,
   such as a new kind of JS animation.
