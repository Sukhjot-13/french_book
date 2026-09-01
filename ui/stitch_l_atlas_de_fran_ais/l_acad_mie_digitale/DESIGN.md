---
name: L'Académie Digitale
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#180500'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d1500'
  on-tertiary-container: '#b97958'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6c391d'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  example-text:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-ui:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '450'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
  sidebar-width: 280px
---

## Brand & Style

The design system is built on a foundation of **Academic Modernism**. It prioritizes information density, clarity, and intellectual rigor, avoiding all forms of gamification or visual clutter. The personality is authoritative yet accessible—resembling high-end technical documentation or a premium research repository.

The aesthetic combines **Minimalism** with a **Structured Systematic** approach. It utilizes a high-contrast layout, generous whitespace for focus, and precise alignment to facilitate deep work and memorization. The visual language conveys a sense of permanence and reliability, catering to serious students and linguists who value efficiency over entertainment.

## Colors

The palette is anchored by **Oxford Blue**, serving as the primary brand color for navigation, headers, and key actions. The overall color strategy is "Sober & Semantic"—colors are used purposefully to categorize knowledge domains rather than for decoration.

- **Primary (Oxford Blue):** Foundation, navigation, and core identity.
- **Secondary (Slate):** Metadata, borders, and secondary text.
- **Semantic Accents:**
  - **Grammar (Emerald):** Structural rules and syntax.
  - **Verbs (Indigo):** Conjugation tables and temporal logic.
  - **Expressions (Amber):** Idiomatic nuances and edge cases.
  - **Vocabulary (Slate/Steel):** Lexical lists.
  - **Examples (Teal):** Contextual usage blocks and sample sentences.

In **Dark Mode**, the background shifts to a deep "Midnight Ink" (#0B0F1A) to reduce eye strain during late-night study sessions, with primary colors adjusted for high accessibility (WCAG AA minimum).

## Typography

This design system utilizes a dual-font strategy to distinguish between the learning interface and the French language content.

1.  **UI & Navigation:** **Hanken Grotesk** is used for all functional elements. Its sharp, contemporary geometry provides a professional and efficient feel, similar to modern SaaS platforms.
2.  **French Content & Examples:** **Source Serif 4** is used exclusively for French linguistic examples. This serif face provides a traditional, literary contrast that signals "the object of study," making it easier for the brain to switch between instructional English and example French.
3.  **Technical Data:** **JetBrains Mono** is used for phonetics, IPA notations, and pattern structures to ensure character clarity.

All large headlines (32px+) should scale down by 20% on mobile devices to maintain readability without excessive wrapping.

## Layout & Spacing

The layout is built on a **12-column fixed grid** for desktop and a **fluid single-column** for mobile. It mimics the structure of a modern IDE or knowledge base like Linear, with a persistent left-hand navigation sidebar for high-level categories (Grammar, Verbs, etc.).

- **Information Density:** Use a compact 4px baseline grid. Elements should feel snug but organized, allowing users to see significant amounts of data (like conjugation tables) without excessive scrolling.
- **Content Hierarchy:** A "Center-Focus" model is used for documentation. The main reading column is limited to a max-width of 800px to maintain optimal line length for reading, with an optional right-hand "On This Page" table of contents.
- **Breakpoints:**
  - Mobile: < 768px (Sidebar becomes a bottom sheet or hamburger menu).
  - Tablet: 768px - 1024px (Sidebar collapses to icons).
  - Desktop: > 1024px (Full sidebar + dual-pane capabilities).

## Elevation & Depth

This design system avoids heavy shadows, instead using **Tonal Layers** and **Low-contrast outlines** to create hierarchy. 

- **Surface 0 (Background):** The base canvas.
- **Surface 1 (Card/Container):** Uses a subtle 1px border (#E2E8F0 in light / #1E293B in dark) to define content areas. No shadow.
- **Surface 2 (Popovers/Modals):** Uses a soft, extra-diffused shadow (Blur 12px, Opacity 5%) with a crisp border to separate it from the main UI.
- **The "Glass" Effect:** Used sparingly for sticky headers to maintain context of the content being scrolled beneath them, utilizing a 12px backdrop-blur.

## Shapes

To maintain a professional and "technical documentation" feel, the design system uses a **Soft (0.25rem)** roundedness level. 

- **Standard Elements:** Inputs, buttons, and small cards use 4px (0.25rem).
- **Interactive Containers:** Sidebars and larger content blocks use 8px (0.5rem).
- **Selection States:** Highlighting a menu item uses a 4px radius.

Avoid pill-shapes or high-radius corners, as they translate as "casual" or "mobile-first consumer," which conflicts with the premium academic narrative.

## Components

### Buttons & Inputs
- **Primary Button:** Oxford Blue background, white text, 4px radius. High-contrast, no gradient.
- **Ghost Input:** Minimalist fields with only a bottom border that transforms into a full 1px outline on focus.

### Knowledge Cards & Tables
- **Conjugation Tables:** No cell borders. Use alternating row stripes (Zebra striping) in very faint Slate-50. Headers use the `label-caps` typography style.
- **Pattern Displays:** Use a "Code Block" style for grammar patterns (e.g., `Subject + [Avoir] + Past Participle`). Background should be a subtle neutral-100 with monospaced text.

### Badges & Metadata
- **Importance Tags:** Compact, uppercase tags. High Importance = Deep Red text on pale Red background. Common Frequency = Oxford Blue text on pale Blue background.
- **Breadcrumbs:** Use chevron separators (`/`) with `label-caps` styling to ensure the user always knows their location within the knowledge hierarchy.

### Callouts
- **Rule Callouts:** A vertical 4px bar on the left using the semantic category color. The background is a 5% opacity tint of that same color. This draws attention to key rules without breaking the reading flow.