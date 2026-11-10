# MANDATORY DESIGN SKILLS WORKFLOW & UI/UX RULES

This document defines the permanent, mandatory workflow and quality standards for all UI/UX-related work in this project.
Every future task that touches the visual presentation, user interface, or user experience must automatically follow these procedures.

---

## 1. MANDATORY DESIGN SKILLS PROCEDURE BEFORE EVERY UI TASK

Before and during any task that modifies:
- Layouts, grids, containers, and section hierarchy.
- Typography, font scaling, line heights, and letter spacing.
- Colors, palettes, gradients, and design tokens.
- Navigation components (desktop & mobile).
- Buttons, chips, tabs, form inputs, and interactive components.
- Cards, modals, drawers, accordions, and overlays.
- Animations, transitions, micro-interactions, and Framer Motion logic.
- Responsive layouts across mobile, tablet, and desktop viewports.
- Overall visual authenticity, eliminating AI tropes.

### The 7-Step Mandatory Protocol:
1. **Inspect Available Project Skills**: Check `.agents/skills/` for the installed skills:
   - `ui-ux-pro-max`: Design systems, layout quality, responsive design, visual hierarchy, touch targets, and accessibility.
   - `impeccable`: Typography craft, spacing scales, interface refinement, and production-grade polish.
   - `design-mode`: Visual design fidelity and browser-session inspection.
   - `unslop`: Identifying and eliminating generic AI-generated website aesthetics (unnecessary cards, arbitrary gradients, mechanical animations).
   - `Framer Motion`: Sophisticated spring/tween motion, scroll parallax, and micro-interactions with reduced-motion compliance.
2. **Read the Relevant Skill's `SKILL.md` Instructions**: Never guess or improvise rules when a skill defines authoritative guidance.
3. **Execute Skill-Driven Analysis**: Apply the skill's specific heuristics, token architecture, and craft floor.
4. **Implement UI Modifications**: Modify existing components with clean, maintainable, modular TypeScript. Never wipe the codebase or rebuild from an arbitrary template.
5. **Verify Real Renders in Google Chrome**: Inspect the live application in Chrome across all target viewports:
   - Mobile: 390×844 (iPhone standard)
   - Mobile: 430×932 (iPhone Max)
   - iPad Portrait: 768×1024
   - iPad Landscape: 1024×768
   - Desktop: 1440×900
6. **Zero-Console-Error & Build Rigor**: Confirm zero console errors, zero layout shifts, zero unhandled errors, and clean `npm run build` validation.
7. **Refine Based on Rendered Results**: Iterate until visual craft meets high-fidelity design standards.

---

## 2. APPROVED DESIGN SYSTEM & COLOR TOKENS (JJ NUTRITION)

Under no circumstances should warm tones (peach, orange, beige, cream, brown) be introduced or reintroduced into UI elements.

### Color Tokens
- **Primary Background**: `#FFFFFF` (Pure White dominant)
- **Secondary Background**: `#F3F9FD` (Soft sky tint for alternating sections & cards)
- **Light Blue Surface**: `#E8F5FC` (Badge fills, card hover states, active pills)
- **Light Blue Decorative**: `#D9EFFB` (Subtle decorative accents & pill outlines)
- **Primary Accent**: `#42A9E5` (Sky Blue for CTAs, active indicators, and DNA accents)
- **Strong Accent**: `#0789D2` (High-contrast hover, focus rings, emphasis)
- **Primary Typography**: `#10243D` (Deep Navy for headings, high-contrast dark sections, and crisp text)
- **Secondary Typography**: `#60748A` (Slate for body copy, descriptions, captions)
- **Borders & Dividers**: `#DCE8F1` (Delicate pale blue-grey)

### Photography & Graphic Integrity
- Never apply artificial blue CSS color filters over authentic lifestyle photography. Photos remain natural.
- The blue & white brand is established through the UI design system, typography, backgrounds, glassmorphism, buttons, badges, and vector assets.
- Vector and decorative assets (such as the DNA elements and icons) must use the approved sky-blue palette.

---

## 3. FLOATING GLASS NAVBAR RULES

- **Glassmorphism Specifications**:
  - `background`: `rgba(255, 255, 255, 0.65)` (unscrolled) / `rgba(255, 255, 255, 0.78)` (scrolled)
  - `backdrop-filter`: `blur(20px) saturate(160%)`
  - `-webkit-backdrop-filter`: `blur(20px) saturate(160%)`
  - `border`: `1px solid rgba(255, 255, 255, 0.75)`
  - `box-shadow`: Soft elevation with top-edge glass highlight (`inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)`)
  - Form: Floating pill container (`rounded-full`), clearly detached from top viewport edge.

- **Mobile Navbar Constraints**:
  - Contains strictly **two visual elements**:
    1. **Centered Brand Group**: JJ Nutrition logo icon + brand name, strictly centered relative to the mobile viewport.
    2. **Right-Aligned Hamburger**: Menu trigger button aligned to the right.
  - Zero black boxes or square containers behind the logo. Logo artwork must be transparent and tinted to match its surface (deep navy on glass/light, pure white on dark navy).

---

## 4. MOBILE HERO ORDER
- On mobile viewports (`< lg`), the hero layout order is strictly:
  1. Floating Navigation Bar
  2. Main Hero Image (prominent, arched top, refined aspect ratio)
  3. Eyebrow badge / label
  4. Hero Headline
  5. Supporting paragraph
  6. Primary & secondary CTA buttons
  7. Decorative floating DNA element
- On desktop viewports (`lg+`), the 2-column editorial split is maintained.

