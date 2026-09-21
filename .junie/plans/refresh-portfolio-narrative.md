---
sessionId: session-260921-032355-l95k
---

# Requirements

### Overview & Goals

Refresh the single-page portfolio’s information architecture and copy into a balanced narrative that presents Vlad’s engineering work, open-source involvement, and personal curiosities with an authentic, concise voice.

### Scope

- Rewrite the hero, section labels, headings, body text, calls to action, and footer wording in `index.html` without adding invented credentials or projects.
- Reorganize the content into a clearer journey: introduction → professional work and approach → current/open-source work → personal interests → contact.
- Align the navigation labels and anchor targets with the new section structure.
- Preserve verified facts and destinations: Microsoft since December 2019, dynamic experience counters, LinkedIn, and Maths/Physics/Biology interests.

### Acceptance Criteria

- The page reads as one personal narrative, not as disconnected marketing blocks.
- Copy is specific, conversational, and restrained; avoid stock claims, inflated language, and generic AI phrasing.
- Every navigation link scrolls to a visible, accurately titled page section.
- The content remains readable and visually coherent on desktop and at the existing `720px` mobile breakpoint.

# Technical Design

### Current Implementation

- `index.html` contains all portfolio content and the current sequence: `.hero`, `#work.manifesto`, `#current.now`, `#interests.interests`, and `#contact.contact`.
- The navigation links to `#work`, `#current`, `#interests`, and `#contact`.
- `src/main.js` supplies dynamic values for `#microsoft-experience`, `#professional-experience`, and `#year`, and observes every non-hero `section` plus `.interest-card` for reveal animation.
- `src/style.css` provides distinct layouts for `.manifesto`, `.interest-grid`, `.now`, and `.contact`, with single-column mobile behavior beginning at `720px`.

### Proposed Changes

- Reshape the HTML into a four-part editorial flow after the hero: a work/approach section, an open-source section, the interests cards, and contact.
- Replace the abstract or promotional lines with shorter first-person copy grounded in the existing facts; retain the dynamic counter IDs and external-link security attributes.
- Update the hero CTA, section marks, navigation text, IDs, and numbering as a single set so labels accurately describe the reordered content and every destination is discoverable.
- Reuse the existing semantic elements (`section`, `article`, `h2`, and paragraphs) and existing visual vocabulary rather than introducing a framework or content system.
- Adjust `src/style.css` selectors, spacing, and responsive grid rules only where the updated section boundaries or content length require it; preserve colors, typography, animations, and reduced-motion behavior.

### Files

- Modify `index.html` for content, semantic structure, anchors, metadata if its summary needs to match the new positioning, and navigation.
- Modify `src/style.css` for section-specific layout and responsive alignment.
- Keep `src/main.js` unchanged unless a renamed section affects its existing selectors; the counter IDs and observer contract remain intact.

# Testing

### Validation Approach

- Run `vp check` and `vp build` using the project’s Vite+ toolchain.
- Inspect the rendered page at desktop and mobile widths to verify order, anchors, section numbering, external links, dynamic experience values, reveal effects, and reduced-motion fallback.

### Key Scenarios

- Header links and hero CTA reach their intended sections after the restructure.
- Work, open source, interests, and contact content appear in the planned sequence without broken styling or empty animation targets.
- The desktop grids and mobile single-column layout remain legible with the revised copy.

# Delivery Steps

### ✓ Step 1: Restructure the portfolio narrative and navigation

The page presents a coherent balanced story from introduction through work, open source, interests, and contact.

- Reorganize the sections, IDs, section marks, and anchor links in `index.html`.
- Retain the existing Microsoft experience counters, LinkedIn URL, and interests as the factual source material.
- Update hero and navigation calls to action so the visible labels match their destinations.

### ✓ Step 2: Rewrite portfolio copy in a natural personal voice

Every visible text block is concise, specific, and sounds personally authored rather than generated.

- Rewrite headings, supporting paragraphs, card descriptions, and footer text in `index.html` around the confirmed balanced narrative.
- Preserve the existing factual claims and avoid introducing unverified achievements, clients, or technologies.
- Ensure transitions explain how professional work, side projects, open source, and personal curiosity relate.

### ✓ Step 3: Align presentation and validate the refreshed page

The reorganized content remains visually balanced, responsive, and buildable.

- Update affected selectors and spacing in `src/style.css`, retaining existing color, type, animation, and reduced-motion conventions.
- Verify anchor navigation, external links, dynamic counter placeholders, section reveal behavior, and mobile layout.
- Run `vp check` and `vp build` to validate the static site with the configured Vite+ toolchain.
