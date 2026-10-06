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

- A single static page served from Azure Static Web Apps, deployed from `master` via GitHub Actions.
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
- mybackhurts (https://mybackhurts.app): a desktop menu-bar app that prompts a short break to stand up and move every 45 minutes. It can optionally count reps with the webcam, and all processing stays on the device. Status: launched.
- Reads open-source code and contributes when he has something useful to add.
- Interests: Maths, Physics, Biology.
- Contact & profiles: Email (hello@vmihalachi.com), LinkedIn, and GitHub (above).
- Absent: testimonials, case studies, press, a project portfolio with screenshots, and a photo. Do not fabricate them.

## Product Principles

1. True over impressive. Every claim can be checked, and understatement beats hype.
2. A person, not a pitch. The site reflects a whole person (work, making, curiosity), not only a job.
3. Built to grow. New projects and work should slot in without restructuring the page.
4. Light and fast. Stay a small static site with minimal dependencies and a tight security posture.

## Accessibility & Inclusion

Semantic, keyboard-navigable markup with reduced-motion support (already present) and WCAG AA contrast. No other product-specific needs have been confirmed.
