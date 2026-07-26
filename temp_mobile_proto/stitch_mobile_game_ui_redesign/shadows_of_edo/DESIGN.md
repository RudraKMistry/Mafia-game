---
name: Shadows of Edo
colors:
  surface: '#fff8f3'
  surface-dim: '#e1d9cf'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2e8'
  surface-container: '#f6ece2'
  surface-container-high: '#f0e7dd'
  surface-container-highest: '#eae1d7'
  on-surface: '#1f1b15'
  on-surface-variant: '#5a403c'
  inverse-surface: '#343029'
  inverse-on-surface: '#f9efe5'
  outline: '#8e706b'
  outline-variant: '#e3beb8'
  surface-tint: '#b52619'
  primary: '#610000'
  on-primary: '#ffffff'
  primary-container: '#8b0000'
  on-primary-container: '#ff907f'
  inverse-primary: '#ffb4a8'
  secondary: '#4c56af'
  on-secondary: '#ffffff'
  secondary-container: '#959efd'
  on-secondary-container: '#27308a'
  tertiary: '#3a281a'
  on-tertiary: '#ffffff'
  tertiary-container: '#523e2f'
  on-tertiary-container: '#c5a996'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#920703'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#343d96'
  tertiary-fixed: '#fcddc7'
  tertiary-fixed-dim: '#dec1ad'
  on-tertiary-fixed: '#28180b'
  on-tertiary-fixed-variant: '#574333'
  background: '#fff8f3'
  on-background: '#1f1b15'
  surface-variant: '#eae1d7'
  day-bg-start: '#f4f1ea'
  day-bg-end: '#d4cbb8'
  night-bg-start: '#1a243f'
  night-bg-end: '#050811'
  washi-paper: '#fdfbf7'
  sea-green: '#2e8b57'
  cinnamon: '#d2691e'
  lime-glow: '#ccff00'
  sakura-pink: '#ffb7c5'
typography:
  display-lg:
    fontFamily: Shojumaru
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: 4px
  display-lg-mobile:
    fontFamily: Shojumaru
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 2px
  headline-md:
    fontFamily: Shojumaru
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 2px
  body-lg:
    fontFamily: Noto Serif JP
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Serif JP
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  chat-log:
    fontFamily: Noto Serif JP
    fontSize: 14px
    fontWeight: '300'
    lineHeight: 20px
  label-caps:
    fontFamily: Shojumaru
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 3px
  vertical-kanji:
    fontFamily: Shojumaru
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 24px
spacing:
  base: 4px
  gutter-mobile: 16px
  gutter-desktop: 40px
  shoji-gap: 24px
  scroll-padding: 32px
  touch-target: 48px
---

## Brand & Style

The brand personality is cinematic, high-stakes, and historical, blending the elegance of the Edo period with the lethal tension of a Shinobi infiltration. The target audience seeks an immersive social deduction experience where every interaction feels weighted with consequence.

This design system utilizes a **Tactile / Skeuomorphic** style with a focus on material mimicry. Instead of modern flat UI, the interface is constructed from physical metaphors: Shoji screens, aged Makimono scrolls, and heavy dark wood frames. The emotional response is one of suspense and reverence for tradition, achieved through a dual-phase aesthetic: 
- **Day Phase:** Serene, parchment-based, and scholarly.
- **Night Phase:** Dangerous, indigo-soaked, and clandestine.

Key visual elements include ink-brush strokes (Enso circles), paper textures, and atmospheric particle effects (Sakura petals or Fireflies) that reinforce the temporal setting.

## Colors

The palette is bifurcated to reflect the game's core mechanic. 

**Day Phase** utilizes the `neutral` (Tatami Sand) as the primary canvas, supported by `washi-paper` surfaces. Primary brand accents use `dark-red` to signify the Imperial Decree and voting actions.

**Night Phase** shifts the entire UI to a deep, monochromatic indigo spectrum (`night-bg-start` to `night-bg-end`). High-contrast `lime-glow` is used sparingly for night-action feedback and "firefly" success indicators, while the `primary-red` becomes more menacing, associated with the Mafia's presence.

Status colors are role-specific:
- **Primary (Dark Red):** Mafia/Action/Violence.
- **Secondary (Indigo):** Detective/Intuition.
- **Sea Green:** Healing/Protection.
- **Cinnamon:** The Jester's chaos.

## Typography

The typography system pairs the aggressive, stylized `Shojumaru` for titles and labels with the highly legible `Noto Serif JP` for narrative and body content.

- **Display & Titles:** Use `Shojumaru` with increased letter-spacing to mimic traditional signage. For mobile, display sizes are scaled down to ensure hero text remains within the viewport.
- **Narrative & Chat:** `Noto Serif JP` is used to provide a "literary" feel to the game's events. Chat logs use a lighter weight (300) to maximize space in the 50vh mobile drawer.
- **Vertical Orientation:** In specific components like Shoji screen labels or scroll margins, text should be rendered vertically using `writing-mode: vertical-rl`.

## Layout & Spacing

The layout is a **fixed-width contextual system** optimized for mobile play. The centerpiece is the "Game Board," a 12-column grid that translates to a 2-column Shoji grid on mobile devices.

- **Mobile Viewport:** Prioritize vertical stacking. The chat and action drawers are pinned to the bottom 50% and 30% of the screen respectively.
- **Safe Areas:** All interactive components (buttons, player cards) must maintain a minimum `touch-target` of 48px to accommodate mobile interaction.
- **The Shoji Grid:** Player cards are arranged in a rhythmic grid with a 24px gap. In the Night phase, this grid is enveloped in a vignette to focus attention on the player's active target.
- **Makimono Scrolls:** Modals and menus expand horizontally as scrolls. On mobile, these fill the `max-w-sm` constraint with `scroll-padding` to prevent text from touching the decorative rollers.

## Elevation & Depth

Hierarchy is established through **Physical Layering** rather than abstract tonal layers. 

- **Level 0 (Atmosphere):** Background gradients with `feTurbulence` noise textures to simulate weathered paper or dark wood.
- **Level 1 (The Environment):** "Enso" ink circles and lantern glow overlays (`rgba(180, 20, 20, 0.15)`) that sit behind the main UI.
- **Level 2 (The Interactive Surface):** Shoji screen cards and Makimono scrolls. These use **Ambient Shadows** (deep, diffused blacks) to feel as if they are resting 10-20mm above the tatami surface.
- **Level 3 (HUD & Modals):** Pinned interface elements utilize `backdrop-blur-md` to suggest a frosted paper effect, separating the active controls from the game board world.
- **State Changes:** When a player is selected, their Shoji card elevation increases significantly via an expanded shadow and a primary-red border glow.

## Shapes

The design system adopts a **Sharp (0)** roundedness philosophy to honor the architectural lines of Edo-period woodwork and Japanese carpentry. 

- **Structural Elements:** All Shoji screens, player cards, and buttons feature 90-degree corners. 
- **The Shoji Lattice:** Created via a complex linear-gradient, this creates the internal "window-pane" structure within player cards.
- **Exceptions:** 
  - **Scroll Rollers:** 4px rounding on the edges of the wooden Makimono handles.
  - **Crests & Icons:** Clan crests and role icons are strictly circular (`rounded-full`) to differentiate "Organic/Human" elements from "Architectural/Game" elements.
  - **Blade Cuts:** Dividers are styled as "Slashed Paper" using diagonal clip-paths.

## Components

### Shoji-Screen Player Cards
The primary interactive unit. A rectangle with a heavy `dark-wood` frame (`8px`). The interior is `washi-paper`. On hover or selection, the "paper" glows and the frame thickens. Use vertical text for player status (e.g., "ELIMINATED" in Kanji).

### Makimono Scroll (Modals)
A horizontal expansion component. It features `dark-wood` rollers on the left and right edges. The center content area uses `Aged Paper` gradients. Use a "roll-out" animation (width 0 to 100%) for entry.

### Ink-Brush Buttons
Primary actions are not standard boxes but "Ink Splatters" or "Brush Strokes." The background should use a CSS mask or SVG of a rough brush stroke in `primary-red`. Text is `Shojumaru` in `washi-paper` white.

### The Chat Drawer
A semi-translucent `backdrop-blur` surface that slides up from the bottom. It features a "Slashed Paper" top edge. Messages are separated by thin `dark-wood` lines.

### Role Badges
Small, circular medallions using the role's specific color. For example, the Detective badge is `Indigo Blue` with a silver-rimmed border.

### Input Fields
Stylized as a single brush stroke underline in `dark-wood`. The cursor should be a vertical "ink drip" animation.