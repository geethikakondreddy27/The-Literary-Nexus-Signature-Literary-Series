# The Literary Nexus — Signature Literary Series
### Static Landing Page | Front-End Deliverable

---

## Project Overview

A high-performance static landing page built for **The Literary Nexus**, a distinguished cultural institution in Portland, Oregon. This page serves as the digital flagship for their **Signature Literary Series** — designed to maximise audience engagement, drive RSVPs, and reflect the brand's premium identity.

---

## Lighthouse Scores (Production)

| Category       | Score |
|----------------|-------|
| Performance    | 92    |
| Accessibility  | 97    |
| Best Practices | 96    |
| SEO            | 100   |

> Audited via Google Lighthouse in Chrome Incognito — eliminating extension interference for accurate results.

---

## Tech Stack

- **HTML5** — Semantic markup throughout (`header`, `main`, `section`, `article`, `footer`)
- **CSS3** — Custom property design token system, CSS Grid, Flexbox, responsive media queries
- **Java Script**
- **Google Fonts** — Merriweather (headings) + Open Sans (body)
- **REST APIs for event and author data**


---

## File Structure

```
literary-nexus/
├── index.html              
├── README.md               
├── assets/
│   ├── css/
│   │   └── main.css        # Full design token system + all component styles
│   ├── js/
│   │   └── app.js          # Countdown, authors grid, modal, RSVP, lazy load
│   ├── images/             # Reserved for production image assets
│   └── data/               # Reserved for local JSON mocks
```

---

## Features Implemented

### Phase 1 — Brand System
- Full CSS custom property (design token) system covering colors, typography, spacing, shadows, and border radii
- Modular spacing scale using `calc()` off a single `--spacing-unit` base
- Global CSS reset with `box-sizing: border-box` and cross-browser base styles

### Phase 2 — Hero Section
- Full-viewport hero (`100vh`) with high-resolution background, dark overlay for legibility
- Fluid typography via `clamp()` — scales gracefully from mobile to 4K
- Live countdown timer fetching event date from API, with automatic fallback if API is unavailable
- CTA button with hover `transform: scale(1.05)` and smooth `transition` — scrolls to RSVP on click

### Phase 3 — Featured Authors
- Dynamic author cards fetched from REST API — zero hardcoded content
- Responsive CSS Grid: 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- Circular author photo with gold border, 3-line truncated bio
- Card hover: `translateY(-5px)` lift + photo `scale(1.08)` focal effect
- "View Full Profile" opens a focus-trapped, Escape-closable modal with full bio

### Phase 4 — Schedule & RSVP
- Chronological event schedule with distinct time marker styling
- Semantic HTML form with HTML5 validation on required fields
- RSVP confirmation alert on submission with console payload logging
- Venue details, parking information, and Google Maps deep link

### Phase 5 — Performance & Accessibility
- `IntersectionObserver`-based lazy loading with `rootMargin: 150px` pre-fetch buffer
- Native `loading="lazy"` on below-fold images as a redundant layer
- CSS deferred at `</body>` — zero render-blocking JavaScript
- WCAG 2.1 AA compliant: ARIA labels, keyboard navigation, visible focus states, semantic HTML
- `prefers-reduced-motion` media query — all animations disabled for users who prefer it
- Fully responsive across Chrome, Firefox, Safari, and Edge (latest two major versions)

---



## Deployment



---

## Future Enhancement Roadmap

The following enhancements are scoped and ready for a Phase 2 engagement:

### 1. CMS Integration
Replace the `jsonplaceholder` mock API with a headless CMS (Contentful or Sanity). Allows the client to update author bios, event dates, and schedule entries without touching code.

### 2. Real Author Photography
Integrate a curated photo library (Cloudinary or a private S3 bucket) for authentic author portraits. `srcset` and `<picture>` tags are already partially structured in the codebase for a clean handoff.

### 3. Email Marketing Integration
Wire the RSVP form to Mailchimp or ConvertKit via their REST APIs — replacing the current `httpbin.org` test endpoint. Enables automated confirmation emails, waitlist management, and post-event follow-up sequences.

### 4. Animated Page Entry
A subtle orchestrated entrance sequence (hero headline stagger, countdown fade-in) using the Web Animations API — respecting `prefers-reduced-motion` which is already implemented.

### 5. Multi-Event Support
Extend the data model to support a series of events, with a filterable archive view. The current CSS Grid and card architecture is designed to scale to this without a redesign.

### 6. Analytics
Drop-in Google Analytics 4 or Plausible (privacy-first) event tracking — specifically tracking CTA clicks, RSVP completions, and author profile views. Zero performance impact with the `defer` loading strategy already in place.

### 7. Progressive Web App (PWA)
Add a `manifest.json` and a lightweight service worker for offline support and "Add to Home Screen" capability — particularly valuable for mobile attendees wanting quick event day access.

### 8. Server-Side Rendering (SSR)
Migrate to Astro or Next.js for SSR if the client expands to a full site with multiple routes, user accounts, or dynamic ticket inventory. The current component structure maps cleanly to either framework.

---

## Notes

- The event API endpoint (`mocki.io`) may occasionally be unavailable. The countdown timer automatically falls back to the configured `fallbackEventDate` in `app.js` .
- Author photos use initial-based avatars (`ui-avatars.com`) styled in brand colors. 
- Map image is a styled placeholder. Replace with a Google Maps Static API image or an embedded `<iframe>` using the venue's confirmed address before go-live.

---

*Delivered by development consultants in fulfillment of The Literary Nexus digital transformation brief.*
*Lighthouse audit conducted: June 2026.*