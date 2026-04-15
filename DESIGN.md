# Design Brief: youCallIT

## Direction
youCallIT — Premium luxury dark restaurant brand featuring Michelin-star fine dining aesthetic with warm gold accents and immersive 3D animated experiences.

## Tone
Sophisticated and invitation-only. Every interaction feels deliberate and refined—like a carefully orchestrated fine dining experience with premium exclusivity.

## Differentiation
Warm gold-accented dark luxury aesthetic with floating 3D animated food elements, refined micro-interactions, and elevated shadows creating exclusive premium atmosphere.

## Color Palette

| Token        | OKLCH             | Role                                  |
| ------------ | ----------------- | ------------------------------------- |
| background   | 0.12 0.018 50     | Very dark charcoal base               |
| foreground   | 0.92 0.02 65      | Warm cream/ivory text (AA+)           |
| card         | 0.16 0.02 50      | Slightly elevated surface              |
| primary      | 0.68 0.18 65      | Gold/amber luxury accent              |
| accent       | 0.92 0.02 65      | Warm text highlights                  |
| muted        | 0.2 0.022 50      | Subtle secondary surfaces             |
| border       | 0.24 0.02 50      | Refined dividers                      |
| destructive  | 0.55 0.22 25      | Alert red                             |

## Typography

- Display: Instrument Serif Italic — elegant serif for hero text, section headers, restaurant name
- Body: Satoshi — clean, modern, readable for menus, descriptions, UI labels
- Mono: JetBrains Mono — precise UI and code elements
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Soft elevated shadows (`shadow-luxury`, `shadow-luxury-sm`) suggest layered surfaces. Refined `shadow-gold-glow` for interactive elements and primary CTAs. No harsh shadows or glows—premium restraint.

## Structural Zones

| Zone    | Background          | Border          | Notes                                |
| ------- | ------------------- | --------------- | ------------------------------------ |
| Header  | card with divider   | gold accent 2px | Navigation, tagline, premium feel   |
| Hero    | fade-dark gradient  | —               | 3D animated food, hero text, CTA    |
| Content | alternating bg/card | —               | Menu sections, about, testimonials  |
| Footer  | card with divider   | gold accent 2px | Links, contact, privacy             |

## Spacing & Rhythm

Generous vertical spacing (8rem between sections) for breathing room. Horizontal padding `px-6 md:px-12` for content. Card padding `p-8`. Section alternation: `bg-background` then `bg-card/50` for visual rhythm without harshness.

## Component Patterns

- Buttons: gold primary (`bg-primary text-primary-foreground`), rounded-sm (6px), `shadow-luxury-sm` on hover
- Cards: rounded-sm, `bg-card/80 backdrop-blur-sm`, `shadow-luxury-sm`, border-border/40
- Badges: small rounded-full, `bg-primary/20 text-primary`
- Links: `text-primary hover:underline transition-smooth`

## Motion

- Entrance: fade-in-up (0.6s ease-out) on page load, staggered for sections
- Hover: 3D rotation subtle (`scale-105`), smooth gold glow pulse on primary elements
- Decorative: floating dishes (3s infinite float), gentle-spin on 3D elements (6s), pulse-gold on accent text

## Constraints

- Never use harsh bright colors or high-contrast overlays—premium means refined
- Gold accent used sparingly: primary CTA, hero headline, section accents only
- 3D animations are core: hero floating elements, menu cards with rotation, smooth parallax
- Motion timing: 0.3s smooth transitions, 3–6s for decorative loops
- No generic default shadows—use only luxury/luxury-sm/gold-glow utilities

## Signature Detail

Gold accent line (2px border-top) on header and footer, unified with section reveals using fade-in-up staggered animations creating orchestrated entrance choreography.
