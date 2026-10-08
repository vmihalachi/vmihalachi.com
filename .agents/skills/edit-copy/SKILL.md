---
name: edit-copy
description: Change, add, or translate visible text on vmihalachi.com (headings, paragraphs, links, labels, meta description, art captions) in English, Italian, and Romanian. Use for any copy edit, wording change, new text, or translation fix, so all three languages stay in sync and within PRODUCT.md.
---

# Edit copy

## 1. Read `PRODUCT.md` first

It sets the voice (first person, conversational, specific, and restrained) and the only
facts that may be stated about Vlad. Don't add credentials, clients, metrics, projects,
or details of his Microsoft work beyond the role and tenure. If a change needs a fact
that isn't there, ask.

## 2. Find the strings

Text lives in `src/i18n/en.json`, `it.json`, and `ro.json`, grouped by section (`hero`,
`work`, `project` for mybackhurts, `deskling`, `sunnysays`, `interests`, `contact`, and so
on). `index.html` holds only `{{ section.key }}` placeholders. Look up the placeholder in
the template to see where a string is used.

## 3. Change all three languages together

- Edit English, then write the Italian and Romanian versions so they read naturally in
  each language. Don't translate word for word. The other languages may be phrased
  differently, but they must say the same things.
- Keep the same inline HTML in each language: `<br />` line breaks, `<em>`, and the
  `<span>` around the highlighted word in titles.
- Use each language's typography: curly apostrophes (’) in English and Italian, and
  Romanian `ș` and `ț` with a comma below (not `ş`/`ţ` with a cedilla).
- New text: add a placeholder to `index.html` and the same key to all three files. The
  build fails on a missing key, an extra key, or an unused string.
- Removed text: delete the key from all three files.

## 4. Special strings

- `work.experience` contains `<span id="professional-experience">` and
  `<span id="microsoft-experience">`. `main.js` fills them in, counting from December 2019
  (professional experience is that plus 3). Keep both IDs in every language and keep the
  numbers inside current, because they're what visitors without JS see.
- `meta.description` fills the meta, Open Graph, and Twitter descriptions. Keep it under
  about 155 characters.
- Art text appears inside the drawings, so keep it short enough to fit. That covers
  `project.artExercise`, the Deskling `art*` labels, and Sunny's `line1` to `line4`.
  Sunny talks for a time proportional to the line's length, so keep its lines one short
  sentence.
- `nav.*` labels and section `mark`s are short. Section IDs and anchors stay in English
  in every language.

## 5. Check it

Run `npm run check`. It validates the i18n keys and that every language renders the same
element IDs. Then preview `/`, `/it/`, and `/ro/` for line breaks and overflow,
especially on mobile.
