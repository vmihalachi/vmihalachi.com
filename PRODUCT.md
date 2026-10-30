# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone curious about Vlad Mihalachi: fellow engineers, open-source contributors, people who found mybackhurts, colleagues, and recruiters. They usually arrive from a link (LinkedIn, GitHub, the app) and want to know quickly who Vlad is, what he works on, and how to reach him.

## Product Purpose

vmihalachi.com is Vlad's personal home base on the web. It has no single conversion goal. It works when a visitor leaves with an accurate, human picture of him (engineer, maker, curious person) and knows where to follow up.

## Positioning

A first-person site written by one engineer about his own work and curiosity. It describes a real person with real, checkable facts, not a résumé template or a personal-brand pitch.

## Operating Context

- A single static page served as Cloudflare Workers static assets, deployed from `master` via GitHub Actions.
- Visitors mostly land from outbound profiles (LinkedIn, GitHub) or from mybackhurts.app.
- Visitors can follow up via email (hello@vmihalachi.com), LinkedIn (https://www.linkedin.com/in/vmihalachi/), and GitHub (https://github.com/vmihalachi).

## Capabilities and Constraints

- Plain HTML/CSS/JS built with Vite+ (`vp`). No framework or CMS.
- A strict Content-Security-Policy. Every new external origin (fonts, images, scripts) is a deliberate trade-off.
- The site must be able to grow: more projects and work will be added over time. It should not be locked into a single side-project slot.
- Open decision: whether to add a writing/blog section later.

## Brand Commitments

- Name: Vlad Mihalachi. Wordmark "VM."
- Voice: first person, conversational, specific, and restrained. No inflated or stock claims and no generic AI phrasing.
- Never invent credentials, clients, metrics, or projects.
- Do not describe internal Microsoft work beyond the role and tenure.

## Evidence on Hand

- Senior Software Engineer at Microsoft since December 2019.
- About 3 years of professional software work before Microsoft. The page's experience counters depend on this figure.
- mybackhurts (https://mybackhurts.app): an app that prompts a short break to stand up and move every 45 minutes, from the menu bar or tray on a desktop. It can optionally count reps with the webcam, and all processing stays on the device. macOS, Windows, iPhone, iPad and Android; the iPhone, iPad and Android apps shipped on 2026-10-25. Status: launched.
- Laching (https://vmihalachi.github.io/laching/): the open-source (MIT) menu bar and tray plumbing that mybackhurts, sunnysays and Mister Pagliacci run on. Swift on macOS and iOS, .NET on Windows, Kotlin on Android. Shown first in the open-source card with Blazor.Untranslated, not as its own project card.
- sunnysays (https://sunnysays.app): a desk toy, a sunflower named Sunny that lives in the menu bar or tray and says a short line about once an hour. Quiet during calls without camera or microphone access, no network. macOS and Windows; same business model as mybackhurts. Status: in development, but the site presents it as available, by Vlad's choice.
- Mister Pagliacci (https://pagliacci.app): a desk companion, a clown who lives in the menu bar or tray and tells a short joke about once an hour, sometimes in two parts (setup, a beat, the punchline). Funny and a little sad. Quiet during calls without camera or microphone access, no network. Jokes recorded in his own voice in English and Italian. Built on Laching. Status: in development, macOS and Windows. His look on the site (harlequin grays, one red nose, the menu bar glyph) was picked for the card; the painted clown comes later. Signature line: _…ma chi fa ridere Mister Pagliacci?_
- Blazor.Untranslated (https://vmihalachi.github.io/blazor-untranslated/): an open-source (MIT) Roslyn analyzer for .NET 8+ that fails the build when a Blazor component renders literal text instead of a localized resource. Shown as a small tool, not a headline project.
- Reads open-source code and contributes when he has something useful to add.
- Interests: Maths, Physics, Biology.
- Contact & profiles: Email (hello@vmihalachi.com), LinkedIn, and GitHub (above).
- Absent: testimonials, case studies, press, and a photo. Do not fabricate them. Project visuals reuse each project's own art from its repo, never invented screenshots.

## Product Principles

1. True over impressive. Every claim can be checked, and understatement beats hype.
2. A person, not a pitch. The site reflects a whole person (work, making, curiosity), not only a job.
3. Built to grow. New projects and work should slot in without restructuring the page.
4. Light and fast. Stay a small static site with minimal dependencies and a tight security posture.

## Accessibility & Inclusion

Semantic, keyboard-navigable markup with reduced-motion support (already present) and WCAG AA contrast. No other product-specific needs have been confirmed.
