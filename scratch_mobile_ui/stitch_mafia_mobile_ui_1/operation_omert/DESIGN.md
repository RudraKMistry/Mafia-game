---
name: 'Operation: Omertà'
colors:
  surface: '#fff8f6'
  surface-dim: '#efd4d0'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e6'
  surface-container-high: '#fee2dd'
  surface-container-highest: '#f8dcd8'
  on-surface: '#261816'
  on-surface-variant: '#5a403c'
  inverse-surface: '#3d2c2a'
  inverse-on-surface: '#ffedea'
  outline: '#8e706b'
  outline-variant: '#e3beb8'
  surface-tint: '#b52619'
  primary: '#610000'
  on-primary: '#ffffff'
  primary-container: '#8b0000'
  on-primary-container: '#ff907f'
  inverse-primary: '#ffb4a8'
  secondary: '#5f5b75'
  on-secondary: '#ffffff'
  secondary-container: '#e2dcfb'
  on-secondary-container: '#63607a'
  tertiary: '#00178d'
  on-tertiary: '#ffffff'
  tertiary-container: '#0025c8'
  on-tertiary-container: '#9ea9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#920703'
  secondary-fixed: '#e4dffe'
  secondary-fixed-dim: '#c8c3e1'
  on-secondary-fixed: '#1b192f'
  on-secondary-fixed-variant: '#47445d'
  tertiary-fixed: '#dfe0ff'
  tertiary-fixed-dim: '#bcc3ff'
  on-tertiary-fixed: '#000d60'
  on-tertiary-fixed-variant: '#0d2ccc'
  background: '#fff8f6'
  on-background: '#261816'
  surface-variant: '#f8dcd8'
  manila-paper: '#E8D9C5'
  ink-blue: '#1E3A8A'
  stamp-red: '#991B1B'
  folder-accent: '#D97706'
  tape-yellow: '#FACC15'
  mafia-role: '#8B0000'
  doctor-role: '#1E40AF'
  detective-role: '#3F3F46'
  jester-role: '#581C87'
  villager-role: '#27272A'
typography:
  display-xl:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 48px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: 0.02em
  typewriter-md:
    fontFamily: Courier Prime
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.05em
  typewriter-sm:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.2em
  handwritten-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.1em
  body-standard:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter-mobile: 16px
  margin-dossier: 24px
  row-gap: 12px
  stamp-offset: -12deg
---

## Brand & Style

The design system is rooted in the **Tactile Noir / Procedural** aesthetic, transforming the mobile interface into a physical detective's desk. The brand personality is authoritative, gritty, and high-stakes, evoking the tension of a 1950s police precinct. 

The visual style is a hybrid of **Skeuomorphism and Neo-Brutalism**. It utilizes the metaphors of physical stationery—manila folders, polaroids, and rubber stamps—while maintaining the digital clarity of heavy black borders, hard shadows, and high-contrast typography. The UI should feel like a "top secret dossier" that has been physically handled, with elements slightly rotated to break the rigid digital grid.

**Design Principles:**
- **Physicality:** Every element should look like it can be touched. Buttons should depress into their shadows, and paper should have visible texture.
- **Classification:** Use "stamps" and "ink" markers to denote status and roles, moving away from standard digital badges.
- **Atmospheric Transition:** The UI must dramatically shift between "Day" (bright, sunlit desk) and "Night" (dimly lit, high-contrast shadows) to reflect the game's core loop.

## Colors

The palette is driven by the contrast between organic "paper" tones and harsh "ink" pigments. 

- **Surfaces:** Use `manila-paper` for the primary folder background and a lighter, grainier texture for internal "paper" elements.
- **Ink & Status:** Primary actions and "Classified" information use `stamp-red`. User-generated data (player names, notes) should use `ink-blue` to simulate a ballpoint pen.
- **Role Semantic Colors:** Each role is assigned a specific ink hue used for icons and borders. These must maintain a high contrast against the manila background for accessibility.
- **Color Modes:** 
  - **Day Mode:** High visibility, warm paper tones, soft environmental shadows.
  - **Night Mode:** The background shifts to `secondary_color_hex` (Deep Navy), with surfaces appearing as illuminated "pools" of light under a desk lamp. Use `opacity: 0.8` on folder surfaces to blend with the dark background.

## Typography

The system uses three distinct type voices to establish the "dossier" hierarchy:

1.  **The Authority (Anybody):** Used for massive, high-impact titles. It feels like a newspaper headline or a heavy ink stamp.
2.  **The System (Courier Prime):** Represents the "typewritten" data of the dossier. Used for descriptions, labels, and system logs.
3.  **The Player (Bricolage Grotesque):** A characterful, slightly quirky font used for player names and user inputs to simulate handwriting in the "Suspect List."
4.  **The UI (Space Grotesk):** Provides modern legibility for secondary data and functional labels where the typewriter style might be too wide.

**Mobile Scaling:** Headlines above 32px should scale down aggressively on mobile (e.g., `display-xl` to 36px) while maintaining the `tracking-tighter` attribute to keep the "stamped" look.

## Layout & Spacing

This design system uses a **Fixed-Width "Physical" Grid**. The main content is contained within a vertical "Folder" that maintains a consistent width on mobile, centered within the "Desk" viewport.

- **Rhythm:** A 4px base unit governs all spacing. Vertical rhythm is tight within "paper" sections to mimic forms but generous between major dossier components (e.g., 32px between the Header and the Suspect List).
- **Chaos Factor:** Interactive elements (cards, notes, stamps) should have a random rotation between `-2deg` and `2deg` to prevent the layout from looking too "digital."
- **Mobile Reflow:** On small screens, the dossier should occupy 95% of the screen width with a fixed 16px internal padding. Long lists (Suspects) switch from a 2-column grid to a single vertical scroll.

## Elevation & Depth

Hierarchy is achieved through **Stacking and Hard Shadows** rather than soft blurs.

- **Stacking Logic:** The desk is the base. The Manila Folder sits on top with a deep, diffused shadow (`0 20px 50px -10px rgba(0,0,0,0.5)`). Paper slips and Polaroid photos sit on top of the folder with a hard 4px black shadow.
- **The "Sticker" Effect:** Interactive buttons and input fields use a Neo-Brutalist shadow: `4px 4px 0px #000000`. 
- **Tonal Depth:** Use `shadow-inner` on paper surfaces to create a recessed look for text fields, making it feel like the paper has been pressed or carved.
- **Glassmorphism:** Reserved exclusively for "Day/Night" transitions and modal overlays to provide a lens-like focus on the current task.

## Shapes

The shape language is primarily **Sharp and Brutalist**, mimicking hand-cut paper and official documents.

- **Folders & Buttons:** Use `rounded-sm` (4px) or sharp corners to maintain the "cut cardstock" look.
- **Avatars & Role Seals:** Use `rounded-full` to simulate rubber stamps or metal binder clips.
- **Dividers:** Use heavy, 4px bottom borders instead of thin lines to separate major dossier sections.
- **Clipping:** Utilize `clip-path` on the top of the dossier to create the "folder tab" silhouette.

## Components

- **Primary Buttons:** High-contrast `stamp-red` background, black 3px border, and a 4px hard shadow. On click, the button should translate 4px down and 4px right to "fill" its shadow.
- **Suspect Cards:** Styled as "Mugshots." A rectangular container with a `paper-texture` background, featuring a silhouette avatar and the player's name in `handwritten-lg`.
- **Role Stamps:** Circular status indicators that appear "stamped" over content. They should have a slightly irregular border and 80% opacity to let the paper texture show through.
- **The Detective's Log:** A list component with a blue-lined notebook background. Items are separated by a 1px `ink-blue` dashed line.
- **Identity Card:** A sticky-note style component "taped" to the corner of the UI using a semi-transparent `tape-yellow` rectangle at the top.
- **Input Fields:** Recessed paper areas with a `typewriter-md` font and a thick 3px bottom border.