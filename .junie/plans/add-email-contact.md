---
sessionId: session-261004-082239-jqyz
---

# Requirements

### Overview & Goals

Provide visitors with a direct, low-friction communication channel by adding the email address `hello@vmihalachi.com` to the contact section and structured metadata on `vmihalachi.com`. Ensure the contact layout maximizes visual clarity, utility, and accessibility across all device sizes.

### Scope

- **In Scope**:
  - Adding `hello@vmihalachi.com` (`mailto:hello@vmihalachi.com`) as a primary contact action in `index.html`.
  - Adding the `email` property to the JSON-LD `Person` metadata in `index.html`.
  - Refining the layout in `src/style.css` using a dedicated container (`.contact-links`) to ensure clean spacing, consistent touch targets, and responsive vertical alignment.
  - Updating `PRODUCT.md` to reflect the email channel.
  - Running format, lint, and CSP validation checks (`npm run check`, `npm run build`).
- **Out of Scope**:
  - Backend contact forms, external mailing services, or spam-protection captchas.
  - Changes to other sections (Hero, Work, Side Project, Interests).

### User Stories

- As a visitor (collaborator, recruiter, or fellow engineer), I want to see an email address directly on the site so that I can reach out with minimal friction.
- As a mobile or keyboard user, I want well-spaced, accessible links so that I can easily activate the desired communication channel.

### Functional Requirements

- The contact section (`#contact`) must include a clickable `mailto:hello@vmihalachi.com` link.
- The link text must clearly display `hello@vmihalachi.com` accompanied by the directional indicator arrow (`<span>↗</span>`).
- The layout must maintain clean alignment and comfortable tap targets without awkward horizontal collision or wrapping on smaller viewports.
- The JSON-LD schema must include `"email": "mailto:hello@vmihalachi.com"`.

# Technical Design

### Current Implementation

In `index.html` (lines 140–161), `<section class="contact" id="contact">` contains two direct child `<a>` tags for LinkedIn and GitHub. In `src/style.css` (lines 378–393), `.contact-link` is set to `display: inline-flex` with `margin-top: 1.5rem`. Adding a third link without a dedicated layout container causes inline elements to wrap awkwardly or rely on implicit HTML whitespace for horizontal separation.

### Key Decisions

- **Contact Layout Structure**: Group contact links in a `<div class="contact-links">` wrapper with `display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem;`.
  - _Rationale_: Stacking links as a vertical list maximizes visual scanning efficiency, avoids cramped horizontal wrapping on narrow viewports, and ensures touch targets remain easily reachable and accessible.
- **Link Ordering**: Place Email first, followed by LinkedIn and GitHub.
  - _Rationale_: Email is the most direct, universally accessible method of contact for any visitor, followed by platform-specific profile links.
- **Structured Data Integration**: Add `"email": "mailto:hello@vmihalachi.com"` to the `application/ld+json` schema.
  - _Rationale_: Maximizes semantic discoverability by search engines and agentic indexers at zero runtime cost.

### Proposed Changes

#### 1. Markup Update (`index.html`)

Wrap contact links in `.contact-links` and include the email action:

```html
<section class="contact" id="contact" aria-labelledby="contact-title">
  <p class="section-mark">04 / SAY HELLO</p>
  <h2 id="contact-title">Want to talk?</h2>
  <p>I’m happy to talk about software, open source, or anything we still don’t fully understand.</p>
  <div class="contact-links">
    <a class="contact-link" href="mailto:hello@vmihalachi.com"
      >hello@vmihalachi.com <span aria-hidden="true">↗</span></a
    >
    <a
      class="contact-link"
      href="https://www.linkedin.com/in/vmihalachi/"
      target="_blank"
      rel="noopener noreferrer"
      >Let’s connect on LinkedIn <span aria-hidden="true">↗</span></a
    >
    <a
      class="contact-link"
      href="https://github.com/vmihalachi"
      target="_blank"
      rel="noopener noreferrer"
      >Find me on GitHub <span aria-hidden="true">↗</span></a
    >
  </div>
</section>
```

Update JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Vlad Mihalachi",
  "url": "https://vmihalachi.com/",
  "jobTitle": "Senior Software Engineer",
  "worksFor": { "@type": "Organization", "name": "Microsoft" },
  "sameAs": ["https://www.linkedin.com/in/vmihalachi/", "https://github.com/vmihalachi"],
  "email": "mailto:hello@vmihalachi.com"
}
```

#### 2. Styling Update (`src/style.css`)

```css
.contact-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 2rem;
}
.contact-link {
  display: inline-flex;
  gap: 1rem;
  align-items: center;
  font:
    500 1.1rem "DM Mono",
    monospace;
  border-bottom: 2px solid var(--coral);
  padding-bottom: 0.45rem;
}
```

#### 3. Documentation Update (`PRODUCT.md`)

Add email to Operating Context and Evidence sections to keep documentation in sync with codebase facts.

### File Structure

- `index.html`: Contact markup, link elements, JSON-LD metadata.
- `src/style.css`: `.contact-links` flex styling and `.contact-link` rules.
- `PRODUCT.md`: Documented contact channels.

# Testing

### Validation Approach

Automated validation via the project toolchain to confirm type safety, style formatting, and CSP compliance, followed by structural inspection of DOM hierarchy and responsive CSS rules.

### Key Scenarios

1. **Email Link Activation**: Verify `href="mailto:hello@vmihalachi.com"` is well-formed and opens the default email client.
2. **Layout & Responsiveness**:
   - Desktop (>720px): Links stack cleanly in `.contact-links` with consistent `1.5rem` spacing and aligned bottom borders.
   - Mobile (<=720px): Links fit comfortably within mobile viewport bounds without horizontal overflow or overlapping tap targets.
3. **Structured Data Validation**: Confirm the JSON-LD block in `index.html` parses cleanly and includes the valid `email` property.
4. **Toolchain & CSP Checks**: Run `npm run check` and `npm run build` to confirm code style, linting, and CSP hashes pass without errors.

# Delivery Steps

### ✓ Step 1: Add email contact link and update structured data in index.html

The email contact link `hello@vmihalachi.com` is integrated into the contact section and JSON-LD schema metadata.

- Add an email action link with `href="mailto:hello@vmihalachi.com"` in `index.html` within `<section class="contact" id="contact">`.
- Group contact channels within a dedicated `.contact-links` container for structured DOM hierarchy.
- Add `"email": "mailto:hello@vmihalachi.com"` to the `Person` JSON-LD schema block in `index.html` to enhance structured data discoverability.

### ✓ Step 2: Refine contact links layout and styling in style.css

The contact options display in a clear, accessible, and responsive layout across mobile and desktop screens.

- Add `.contact-links` flex styling in `src/style.css` (`display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: 2rem;`) to eliminate awkward inline wrapping and ensure clear visual separation.
- Update `.contact-link` rules to delegate vertical rhythm to the parent container.
- Verify focus indicators (`:focus-visible`) and hover animations (`translate(3px, -3px)`) work consistently across all contact links.

### ✓ Step 3: Update documentation and run validation checks

Documentation reflects the new email contact channel and the site passes all lint, format, and CSP checks.

- Update `PRODUCT.md` under Operating Context and Evidence to document `hello@vmihalachi.com` alongside LinkedIn and GitHub.
- Run `npm run check` (`vp check` and `scripts/check-csp.mjs`) to verify linting, formatting, and CSP integrity.
- Run `npm run build` to verify production bundle generation.
