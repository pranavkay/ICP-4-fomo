# FOMO Bakery Website — High-Level Roadmap (Append-Only)

Created: 2026-03-02
Owner: Tony EA
Status: ACTIVE

---

## 0) Document Protocol (Non-Negotiable)

- This file is **append-only**.
- **Never delete** previously written items.
- If direction changes, add a new dated entry and mark old entries as superseded.
- To track completion, use status markers only:
  - `[TODO]` not started
  - `[IN PROGRESS]` active
  - `[DONE]` completed
  - `[BLOCKED]` waiting on dependency/decision
  - `[SUPERSEDED]` replaced by newer strategy

---

## 1) North Star

Launch a premium, conversion-focused **FOMO Bakery** digital storefront (Shopify backend) with custom landing pages across product categories and customer types, designed to increase:

- conversion rate
- average order value (AOV)
- repeat purchase intent
- corporate/bulk enquiry conversion

while preserving brand distinctiveness and operational reliability.

---

## 2) Strategic Constraints and Decisions

- [DONE] Decision: no explicit “transition” messaging to customers.
- [DONE] Decision: launch as fully formed FOMO Bakery experience.
- [DONE] Decision: Shopify remains backend and commerce engine.
- [IN PROGRESS] Decision: custom-first page strategy with controlled shared infrastructure.

---

## 3) High-Level Objectives

### Objective A — Brand + Positioning
- [TODO] Establish clear FOMO Bakery narrative architecture across all pages.
- [TODO] Define tone variants per audience: indulgent / health-conscious / gifting / corporate / family.
- [TODO] Standardize copy hierarchy for hero, proof, offer, and CTA blocks.

### Objective B — Information Architecture (IA)
- [TODO] Finalize sitemap for category, persona, and occasion journeys.
- [TODO] Ensure each entry page has a clear path to product and checkout.
- [TODO] Design internal link graph for discoverability and SEO.

### Objective C — Page System (Custom-First)
- [TODO] Build fully custom Tier-1 pages (highest traffic + revenue intent).
- [TODO] Build custom Tier-2 pages with shared interaction patterns.
- [TODO] Build Tier-3 long-tail landing pages with fast production workflow.

### Objective D — Shopify Commerce Integration
- [TODO] Clean collection architecture for all bakery categories.
- [TODO] Define tagging/metafield model for persona and occasion merchandising.
- [TODO] Ensure robust cart + checkout behavior across all custom pages.

### Objective E — Conversion Infrastructure
- [TODO] Deploy high-intent CTAs by audience segment.
- [TODO] Set up trust framework: shipping, freshness, ingredients, reviews, guarantees.
- [TODO] Add upsell/cross-sell logic (pairings, bundles, gifting upgrades).

### Objective F — Analytics + Learning Loops
- [TODO] Implement analytics baseline (page view, add-to-cart, begin checkout, purchase intent, enquiry submit).
- [TODO] Define launch dashboard and weekly optimization cadence.
- [TODO] Establish post-launch A/B testing queue.

### Objective G — Performance + Reliability
- [TODO] Resolve current JS/UX reliability issues before scale rollout.
- [TODO] Meet mobile performance and usability thresholds.
- [TODO] Validate functional QA across device classes and key browsers.

---

## 4) Experience Surface Map

### 4.1 Core Commerce Surfaces
- [TODO] Homepage (Bakery flagship)
- [TODO] Category pages:
  - Doughnuts
  - Bomboloni
  - Cookies
  - Salt breads
  - Cupcakes
  - Celebration cakes

### 4.2 Audience/Persona Surfaces
- [TODO] Health-conscious
- [TODO] Corporate orders
- [TODO] Occasions
- [TODO] Indulgent
- [TODO] Young adults
- [TODO] Kids

### 4.3 Occasion Surfaces
- [TODO] Birthdays
- [TODO] Team celebrations
- [TODO] Festival gifting
- [TODO] Return gifts
- [TODO] Bulk office gifting

### 4.4 Conversion Support Surfaces
- [TODO] Corporate enquiry page + form workflow
- [TODO] Policy stack (shipping/refund/terms/privacy)
- [TODO] FAQ and trust pages

---

## 5) Tiering Strategy (Execution Priority)

### Tier 1 — Must Ship First (Custom)
- [TODO] Homepage
- [TODO] Category pages (6)
- [TODO] Corporate orders landing
- [TODO] Occasions hub

### Tier 2 — Must Ship Next (Custom + shared infra)
- [TODO] Persona pages (6)
- [TODO] Product detail storytelling upgrades

### Tier 3 — Iterative Expansion
- [TODO] Occasion-specific long-tail pages
- [TODO] Seasonal campaign landers

---

## 6) Program Phases

### Phase 1 — Discovery + Stabilization
- [DONE] Audit current codebase and current UX structure.
- [TODO] Lock final sitemap + page inventory.
- [TODO] Fix known runtime issues that threaten scale.

### Phase 1.5 — Ship-Blocking Fixes (Sprint 1)
- [DONE] Fix Vite build config (24 HTML pages missing from rollup inputs).
- [DONE] Fix .gitignore (`.env` exposed, `dist/`, `.DS_Store` unignored).
- [DONE] Fix broken cart on category pages (`window._fomoBakeryCart` undefined).
- [DONE] Standardize Buy Now flow (inconsistent between script.js and product-view.js).
- [DONE] Add GA4 analytics baseline (G-39E6NXKX8R) + conversion events.
- [DONE] Add OG/Twitter social meta tags to all pages.
- [DONE] Wire corporate enquiry form to Formspree + WhatsApp add-on.
- [DONE] Add JSON-LD structured data (LocalBusiness).
- [DONE] Verify persona page script imports (already correct).
- [DONE] Fix cart CSS mobile responsiveness.
- [DONE] Rebuild dist/ — clean build, zero warnings, all 24 pages.

### Phase 2 — Core Build
- [TODO] Build Tier-1 custom pages end-to-end.
- [TODO] Integrate Shopify data paths and conversion flows.
- [TODO] Set analytics baseline.

### Phase 3 — Segment Expansion
- [TODO] Build Tier-2 persona pages.
- [TODO] Add occasion journeys and targeted merchandising.

### Phase 4 — Launch + Optimization
- [TODO] Ship full public rollout.
- [TODO] Run optimization sprints based on real data.

---

## 7) Risks and Mitigation

- [IN PROGRESS] Risk: scale complexity from many custom pages.
  - Mitigation: shared QA checklist + shared commerce logic.
- [TODO] Risk: inconsistent messaging across segments.
  - Mitigation: centralized copy rules and approval pass.
- [TODO] Risk: broken purchase flows from custom interactions.
  - Mitigation: conversion smoke tests before every release.
- [TODO] Risk: launch delays due to asset production.
  - Mitigation: asset pipeline with hard deadlines and fallback visuals.

---

## 8) Current Progress Log (Append Entries)

### 2026-03-02
- [DONE] Direction validated with stakeholders: no transition narrative.
- [DONE] Product expansion scope captured: doughnuts, bomboloni, cookies, salt breads, cupcakes, celebration cakes.
- [DONE] Current local website reviewed in depth (structure, integrations, content approach).
- [DONE] Identified absence of formal roadmap/implementation docs in active folder.
- [DONE] Established append-only roadmap standard for this project.

### 2026-03-15 — Phase 1 Discovery Audit Complete
- [DONE] Deep technical audit of all 30+ pages, JS modules, Shopify integration, build config, SEO, analytics, security.
- [DONE] Identified 24 HTML pages missing from Vite build config (categories, personas, pages, policies, shop).
- [DONE] Identified `.env` not gitignored — Storefront API token exposed in git history.
- [DONE] Identified critical cart bug: `window._fomoBakeryCart` undefined on all category pages (cart non-functional).
- [DONE] Identified Buy Now inconsistency: script.js does direct checkout, product-view.js adds to cart then opens drawer.
- [DONE] Confirmed zero analytics (no GA4, no Meta Pixel, no event tracking anywhere).
- [DONE] Confirmed zero social meta (no OG tags, no Twitter cards, no canonical URLs, no JSON-LD).
- [DONE] Confirmed corporate enquiry form submits to WhatsApp redirect only (placeholder number), no data capture backend.
- [DONE] Confirmed Storefront API cannot create draft orders — Admin API required for future upgrade.
- [DONE] Identified persona pages missing script imports, cart.css missing mobile breakpoint.
- [DONE] Identified nav.js and cart-drawer.js components built in Sprint 0 but never wired into pages (all pages have hardcoded HTML).
- [DONE] Sprint 1 (Ship-Blocking Fixes) defined — 12 tasks covering build, security, cart, analytics, SEO, forms, mobile.

---

## 9) Change Log (Append-Only)

### 2026-03-02 — v1 created
- Initial strategic roadmap drafted.
- Program phases, objectives, and risk register initialized.

### 2026-03-02 — Pod Activation Update
- [DONE] FOMO pod lanes activated for PM, Growth, Creative, and Tech support.
- [DONE] PM lane confirmed active phase: **Phase 1 — Discovery + Stabilization**.
- [DONE] Growth lane delivered weekly operating cadence and KPI execution loop.
- [DONE] Creative lane delivered Tier-1 creative SOP (stock + Gemini hybrid pipeline).
- [DONE] Tech lane delivered technical stabilization/build checklist.
- [IN PROGRESS] Sprint 0 kickoff: JS stabilization + IA lock + owner sequencing.

### 2026-03-02 — Founder Checkpoint Protocol Added
- [DONE] Founder input protocol adopted:
  - Auto-execute reversible operational tasks.
  - Ask founder at high-leverage decision checkpoints.
  - Escalation format: Need from pk → options (A/B/C) → recommendation → timeline impact.

### 2026-03-15 — Phase 1 Discovery Complete + Sprint 1 Defined
- [DONE] Phase 1 Discovery audit executed — comprehensive codebase, SEO, analytics, security, and build review.
- [DONE] Phase 1.5 (Ship-Blocking Fixes) added to program phases with 12-task sprint.
- [DONE] Founder decisions captured:
  - GA4 Measurement ID confirmed: `G-39E6NXKX8R`.
  - WhatsApp number: deferred to pre-launch.
- [DONE] Sprint 1 execution complete — all 12 tasks done.

### 2026-03-15 — Sprint 1 Complete + Branch Strategy
- [DONE] Sprint 1 (Phase 1.5) fully executed. Clean build, zero warnings, 24 pages.
- [DONE] [SUPERSEDED] Form backend: ~~Formspree~~ replaced with Shopify's built-in contact form (`/contact` endpoint via hidden iframe). Data stays in Shopify ecosystem.
- [DONE] Branch strategy established:
  - `rebuild/v2` — all Sprint 1 work, for client demo.
  - `main` — old live site, untouched. GitHub Pages deploys from main only.
  - Merge `rebuild/v2` → `main` on client sign-off to go live.

### 2026-03-15 — Vercel Deploy + Merge to Main
- [DONE] Vercel connected to repo — live at https://icp-4-fomo.vercel.app/
- [DONE] Vercel deploys from `main` only (no branch preview available in current plan).
- [DONE] Merged `rebuild/v2` → `main` (fast-forward) so Vercel serves Sprint 1 build.
- [DONE] [SUPERSEDED] Branch strategy updated: ~~main untouched until client sign-off~~ → main now has Sprint 1 code, deployed on both Vercel and GitHub Pages.
