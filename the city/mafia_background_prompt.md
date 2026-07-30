# MAFIA GAME — ISOMETRIC BACKGROUND ART PROMPT
### Ultra-Detailed Generation Brief (Desktop 16:9 + Mobile 9:16)
*Every element mapped directly from site code. Zero features imported from reference.*

---

## 1. CONCEPT STATEMENT

Generate an isometric 3D-rendered interior background illustration depicting a **1930s underground detective headquarters at night**, viewed from a classic isometric elevated perspective (matching the visual language of the SpatialChat reference: a clean, top-down 3D room with multiple clearly-legible zones visible simultaneously within a single frame). The room is the physical manifestation of the game's five screens — Home, Lobby, Game Desk, Reveal, and Game Over — all collapsed into one believable space. No UI chrome, buttons, or menus exist in this scene. Only the **world these UI elements live inside** is depicted.

The aesthetic is **hard-boiled 1930s noir**: dark wood, parchment paper, red rubber stamps, brass hardware, cigarette-smoke shadows, and the quiet menace of a room where secrets are decided. The mood toggles between two cinematic states that must each be illustrated as a separate variant:

- **DAY VARIANT** (`desk-day`): Warm amber desk lamp light. Muted sepia shadows. Linen and parchment tones dominant.
- **NIGHT VARIANT** (`desk-night`): Near-total darkness. Deep navy blue ambient glow. Cold white-blue moonlight cutting through venetian blind slats across the desk surface. Barely-visible objects at room edges.

---

## 2. CAMERA & PERSPECTIVE

- **Projection**: True isometric — 30° elevation from the ground plane, 45° horizontal rotation. No perspective distortion. All vertical lines remain perfectly parallel.
- **Camera angle**: Looking down and to the right at approximately 2:1 isometric ratio, identical in spirit to the SpatialChat reference screenshot.
- **Focal depth**: The center desk surface is pin-sharp. Background walls and ceiling edges receive a very slight softening (~10% blur). Foreground floor receives subtle depth-of-field softening.
- **Frame fill**: The room fills approximately 85% of the frame. A subtle dark vignette at all four corners deepens the noir atmosphere. The ceiling is not shown — only the top edges of back walls are visible.
- **Scale illusion**: The room should feel large enough to suggest multiple people could occupy it simultaneously, with the desk surface spanning roughly 40% of the horizontal frame width.

---

## 3. ROOM LAYOUT — ZONE MAP

The room is divided into **four zones**, each corresponding to a functional area of the site. Read these left-to-right, front-to-back in isometric space:

```
[ZONE A]          [ZONE B]             [ZONE C]
Notebook/Logs     Main Desk (CENTER)   Identity Card / Wall
left foreground   game surface         right mid-ground

                  [ZONE D]
                  Evidence Board
                  back wall
```

---

## 4. ZONE A — THE CASE NOTEBOOK (Left Panel / Logs)

**What it represents in the site:** The spiral-bound lined paper notebook that serves as the LOGS panel in the game screen. Players write observations here during `day_discussion`. System messages appear in red uppercase typewriter font; player messages appear in handwritten blue cursive.

**Render specifications:**

- A **spiral-bound paper notebook** sits open on a side surface or low table to the left of the main desk, slightly angled (~15° off horizontal), as if someone just set it down.
- The spiral binding runs along the **top edge** of the notebook, consisting of **12 evenly-spaced metal coil rings** (brass or dark nickel), each ring approximately 8mm in diameter, casting small circular shadow spots on the page below.
- The **pages are cream-white parchment** (#f4ebd8 equivalent), and faint **horizontal blue guide lines** run across both open pages — spaced evenly, reminiscent of ruled paper. These lines are light sky-blue (#93c5fd equivalent), thin (0.5pt weight), and spaced approximately 6-7mm apart.
- The **left page** shows several lines of **handwritten cursive text in deep navy blue ink** — illegible but clearly stylized, with varying pressure strokes suggesting a fountain pen or ink pen. These represent player discussion entries. One or two lines appear in **bold red uppercase typewriter font** (system log entries like "THE GAME HAS BEGUN" or "NIGHT FALLS OVER THE DISTRICT").
- The **right page** is partially empty, with only the top 30% filled with similar handwriting, as if the game is mid-session.
- A **fountain pen** with a dark barrel rests diagonally across the gutter between the two open pages.
- A small **brass paperclip** is clipped to the top-right corner of the right page.
- The notebook rests on a shallow **wooden side shelf** that is slightly lower in elevation than the main desk, integrated into the isometric scene naturally.

---

## 5. ZONE B — THE MAIN DETECTIVE DESK (Center / Primary Game Surface)

**What it represents in the site:** The entire game screen (`renderGameDesk`), the home screen's manila folder, and the lobby's two-flap folder combined — all collapsed into a single richly detailed desk surface.

**Desk structure:**
- A large **dark mahogany writing desk**, approximately rectangular, with beveled edges and subtle carved detailing along the apron. The desktop surface has visible **wood grain texture** — dark stained, with lighter grain streaks running parallel to the longer axis.
- The desk has **heavy turned legs** visible at the front-left and front-right corners in isometric perspective.
- A **green banker's lamp** (or dark brass desk lamp with amber glass shade) sits at the **back-right corner** of the desk, switched ON in the DAY variant, casting a tight cone of warm amber-gold light across the central desk surface. The lampshade is visible from above at an isometric angle — showing the circular top of the shade opening.

**Papers and folders on the desk surface:**

1. **Central Manila Folder (open, two flaps visible):**
   - A large **manila file folder** is open and spread flat across the center-left of the desk.
   - The folder is the color of aged parchment/manila (#f4ebd8, slightly browned at edges).
   - The **left flap** of the folder has a large **red rubber stamp impression** reading "PRE-OP PLANNING" in a 1930s bold serif stamp font, applied at approximately -8° rotation, partially faded as if re-stamped.
   - The **right flap** has a **room code tag** tucked into the top-right corner — a small folded slip of paper with "ROOM CODE" printed in tiny uppercase typewriter font above a large bold 6-character alphanumeric code (render as "• • • • • •" or "XXXXXX"). This slip is held at its top with a small **transparent yellow strip** (like old tape) applied at -3° rotation.
   - A decorative **brass paper clip** hooks over the top edge of the folder at the 1/3 left position.
   - Along the folder spine (the center fold), a **dark brown vertical strip** simulates the folder's back binding.
   - A second **smaller manila folder** is partially visible, tucked beneath the open folder, with its tab peeking out at the top edge.

2. **Polaroid Player Cards (the suspect dossier / player tokens):**
   - **6–8 Polaroid-format photograph cards** are scattered across the right 60% of the desk surface in a loose fan arrangement, each at a unique slight rotation:
     - Card 1: +3°, front-center of desk
     - Card 2: -5°, slightly overlapping Card 1 on the left edge
     - Card 3: +7°, top-right of the fan group
     - Card 4: -2°, partially tucked beneath Card 3
     - Card 5: +1°, lower right, fully visible
     - Card 6: -9°, far right, slightly hanging off the desk edge
     - (Additional cards can be added in a second row behind)
   - Each Polaroid consists of:
     - A **white cardstock outer border**, approximately 3–4mm thick on the sides and top, and **8–10mm thick on the bottom** (classic Polaroid proportions).
     - A **gray photographic area** occupying the interior — showing a **silhouetted bust figure** (anonymous gender-neutral human silhouette, mostly torso-up) against a lighter gray gradient background. The silhouette is rendered in flat dark gray (#1c1c1c) against a lighter field (#c8c8c8), evoking a 1930s mugshot.
     - A horizontal **scan-line texture** overlaid on the photo area at 15% opacity — thin parallel horizontal lines, evenly spaced, simulating film grain or mugshot paper texture.
     - On the white bottom strip: a **handwritten name** in deep navy blue cursive (illegible but legible in style), centered.
     - One card — the one representing "YOU" (the current player's card) — has a tiny **"YOU"** label printed in a black box in the top-left corner of the photo area.
     - **Two Polaroids in the group** have a large red ink **"DECEASED"** stamp impression diagonally across their photo area at approximately +15° rotation. These cards appear slightly more grayscale/desaturated and sit with their corners sagging slightly (suggesting paper warp).
     - **One Polaroid** has a **dark red thumbtack** pinning it to the desk at the top-center edge of the card.

3. **Instruction Note Card:**
   - A **single sheet of parchment-colored paper** (~A5 size in isometric scale) sits slightly separate from the polaroid group, positioned center-stage or slightly above center.
   - The paper has **slightly curled corners** (especially the bottom-right), suggesting it was rolled before being laid flat.
   - It is pinned through its **top-center** with a **small red circle thumbtack/pushpin** (~4mm diameter, slightly domed, casting a tiny shadow below it).
   - The paper surface has a **barely visible repeating watermark pattern** of "CLASSIFIED" in light gray at 8% opacity.
   - The paper is rotated **-1°** from true horizontal.
   - Typewritten text (illegible but styled) occupies 3 lines near the top half of the card, in a **monospaced typewriter font**, dark charcoal ink.

4. **Typewriter (desk corner):**
   - A **1930s Underwood-style manual typewriter** sits in the **back-left corner** of the desk, occupying approximately 15% of the desk footprint.
   - It is shown at isometric angle — the carriage and platen roller are visible from above, with keys arranged in their characteristic curved rows.
   - A sheet of **paper is loaded** into the platen, with 3–4 lines of typed text already on it, partially rolled upward.
   - The typewriter body is dark charcoal-gray with brass key rings.
   - A **small stack of blank parchment paper** sits next to the typewriter on the left.

5. **Magnifying glass:**
   - A **brass-handled magnifying glass** rests diagonally across the top edge of the central manila folder.
   - The glass element catches a subtle highlight from the desk lamp.

6. **Ink stamp and stamp pad:**
   - A **dark wood-handled rubber stamp** (used to apply the "CLASSIFIED", "DECEASED", "TOP SECRET" impressions) sits in the upper-right area of the desk.
   - Next to it, a **red ink stamp pad** (open lid, red-soaked pad visible from above).
   - A **dried ink mark** of the stamp impression is visible on the desk surface itself (light, as if it bled through paper).

7. **Scattered document details:**
   - Several **loose document sheets** partially visible under the polaroids and folder:
     - One sheet has a bold heading reading "OPERATION: OMERTÀ" in all-caps typewriter font.
     - One sheet shows a **2-column grid** of names and redacted "[REDACTED]" entries beside them (the suspect roster from the dossier screen).
     - One document shows a **role distribution table** with role names (MAFIA, VILLAGER, DOCTOR, DETECTIVE, JESTER) in a columnar format with numbers.
   - Document edges are **slightly yellowed and dog-eared**.

---

## 6. ZONE C — THE IDENTITY CARD SURFACE (Right Corner)

**What it represents in the site:** The floating "Your Identity" card that appears bottom-right in the game screen — a small parchment slip showing the player's role (Mafia, Doctor, Detective, Villager, or Jester) with a circular icon badge and description. It has a yellow tape strip at its top and is rotated +2°.

**Render specifications:**

- A **small folded parchment card** (~business card size in isometric scale) sits on the **right side of the desk**, near the front-right corner, at **+2° rotation**, propped slightly against the lamp base or lying flat.
- A **transparent yellow-amber tape strip** is applied horizontally across its top edge, rotated -3° — as if stuck on by hand.
- Below the tape: the label "**YOUR IDENTITY**" in tiny uppercase typewriter font, followed by a thick ruled black border.
- Below the border: a **circular badge** (~12mm diameter in isometric scale) with a thick colored border. Inside the circle: a simple flat icon representing a role (a flame outline for Mafia, an eye outline for Villager, a heart outline for Doctor, a magnifying glass outline for Detective, or a venetian mask outline for Jester). The border color varies:
  - Mafia: deep crimson (#8b0000)
  - Villager: charcoal (#3f3f46)
  - Doctor: navy blue (#1e3a8a)
  - Detective: dark zinc (#52525b)
  - Jester: dark purple (#581c87)
- To the right of the badge: a **large role name** in a heavy display serif font (the "font-heading" equivalent), rendered in the matching role color.
- Below the role name: a **short italic description** in smaller typewriter font.
- The card has a subtle drop shadow: **4px offset right, 4px offset down** in near-black.

---

## 7. ZONE D — THE EVIDENCE BOARD (Back Wall)

**What it represents in the site:** The visual metaphor behind the entire suspect/player system — the polaroid mugshots, their connections, their status stamps. This is ambient world-building rather than direct UI replication.

**Render specifications:**

- Mounted on the **back wall** of the room (visible in isometric perspective as the "upper" wall), a large **cork bulletin board** occupies approximately 50% of the back wall width, centered.
- The corkboard surface is **warm honey-amber cork texture** with visible grain, slightly worn at the edges.
- **8–10 Polaroid photographs** are pinned to the board in a roughly circular arrangement, each attached by a **red thumbtack** at the top-center edge.
- **Red string** connects the thumbtacks in a web pattern — suggesting suspect connections. The string runs between 6–7 points, crossing in the center of the board.
- Between the polaroids: **small handwritten label strips** of paper pinned to the board (showing role-related annotations like "Mafia? Alibis weak" or "TOWN — CONFIRMED").
- **Two polaroids** have a large red "DECEASED" stamp across them and are slightly gray.
- **One polaroid** is circled in red marker.
- Below the evidence board: a **wooden shelf** holding a few dark-spined books and a **glass inkwell**.

---

## 8. FLOOR AND WALLS

**Floor:**
- **Dark hardwood planks** running diagonally in isometric space. Deep espresso brown (#1a0f08) with subtle grain texture.
- A **small area rug** beneath the main desk — deep charcoal-navy with a simple geometric border pattern in dark red (#4a0000) — approximately the footprint of the desk.
- The desk lamp's amber ellipse of light is projected onto the floor through gaps in the desk, creating a soft warm puddle on the rug.

**Walls:**
- The two visible walls (left and back in isometric space) are **dark wood-paneled** — vertical dark walnut planks with subtle horizontal shadow lines suggesting individual panel seams.
- Wall color: deep charcoal (#1a1a1a) with slightly lighter panel faces (#222222).
- The **back-left corner** of the room has a **single narrow window with venetian blinds** partially drawn — in the NIGHT variant, thin horizontal stripes of cold blue-white light from a streetlamp outside cut through the blind slats and fall diagonally across the back desk area and back wall. In the DAY variant, the blinds are more open with diffused warm natural light (no stripes, just ambient warmth).
- Along the **left wall**: a **tall dark bookcase** (approximately 60% of wall height), filled with dark-spined reference books, a few file binders, and a small framed photograph (too small to read at this scale, ambiguous content).
- On the **back wall** flanking the evidence board: two **framed documents** — one is a formal certificate with embossed border, one appears to be a city map fragment.

---

## 9. LIGHTING — TWO VARIANTS

### DAY VARIANT (`desk-day`)
- Primary light: **Desk lamp (warm amber, #c8841a)** — a tight cone cast from the back-right corner of the desk. The light falls as an ellipse of warm amber-gold across the central desk surface, illuminating the polaroids and the instruction note card most brightly.
- Secondary: Diffuse natural light from the window (left wall or back wall), warm and directional from the upper-left. This creates soft shadows from the typewriter and lamp base falling toward the lower-right.
- Shadows: **Warm sepia-toned**, medium softness. Clear but not harsh.
- Ambient: **Deep warm tan** atmosphere throughout. Even unlit areas have a warm undertone (#3a2a1a darkened).
- The parchment documents glow warmly under the lamp — their cream color saturates slightly to a more golden ivory (#e8d5a0) under direct light.

### NIGHT VARIANT (`desk-night`)
- Primary light: **Desk lamp is OFF.** No amber cone.
- Secondary: **Venetian blind moonlight** — thin, cold horizontal stripes of blue-white light (#b8d4f0) cutting at a steep diagonal across the desk surface and the evidence board. These stripes are sharp-edged, approximately 8px equivalent in width with equal dark gaps.
- The polaroid photographs on the desk are caught in these light stripes — each card is partially lit and partially in shadow, the bright stripe crossing their photo areas.
- Ambient: **Near-total darkness** everywhere outside the light stripes. Background walls are barely visible — only the faintest shape outlines suggested. Deep navy-black (#07051a, matching `game-wrapper.night-phase`).
- On the floor: the light stripes also fall, creating a zebra pattern in cold blue-white and pitch black.
- The evidence board on the back wall is mostly in darkness — only the red thumbtacks and string catch occasional ambient glints.
- Atmosphere: A faint wisp of **cigarette smoke** or fog near the ceiling, partially catching the cold light.

---

## 10. EXACT COLOR PALETTE

```
STRUCTURE
Dark mahogany desk:          #2b1a0e
Desk surface stain:          #3a2010
Dark wood walls:             #1a1a1a / #222222
Hardwood floor:              #1a0f08
Area rug (base):             #0f1520
Area rug (border):           #4a0000

PAPERS & DOCUMENTS
Manila folder / parchment:   #f4ebd8
Aged cream paper:            #e5d5c5
Document text (typewritten): #1a1a1a
Notebook ruled lines (blue): #93c5fd
Handwriting ink:             #1e3a8a

STAMPS & ACCENTS
Red stamp ink:               #8b0000
Black stamp ink:             #0a0a0a
Stamp impression (faded):    #c41e1e at 60% opacity
Red thumbtack:               #cc0000

LIGHTING — DAY
Lamp cone ellipse:           #c8841a
Lamp ambient warm:           #e8d5a0 (paper under lamp)
Shadow warm:                 #2a1a0a

LIGHTING — NIGHT
Moonlight stripe:            #b8d4f0
Night ambient:               #07051a
Night shadow:                #030208

ROLE BADGE COLORS
Mafia border + icon:         #8b0000
Villager border + icon:      #3f3f46
Doctor border + icon:        #1e3a8a
Detective border + icon:     #52525b
Jester border + icon:        #581c87

HARDWARE / BRASS
Lamp shade / clip / rings:   #8b7355 (burnished brass)
Highlight on brass:          #d4af6a
```

---

## 11. TEXTURE AND MATERIAL SPECIFICATIONS

| Surface | Texture Detail | Finish |
|---|---|---|
| Desk surface | Visible wood grain, dark stain, subtle knot at far-left corner | Satin — some specular from lamp |
| Parchment/manila paper | Fine linen tooth, very slight translucency at edges | Matte |
| Polaroid borders | Smooth coated cardstock, very slight yellowing | Semi-gloss |
| Polaroid photo area | Flat matte gray, scan-line overlay at 15% opacity | Matte |
| Cork board | Coarse honeycomb cork grain, warm amber | Matte |
| Spiral rings | Coiled metal, circular cross-section | Brass, semi-polished |
| Lamp shade | Glass or frosted metal, slight inner glow | Frosted, warm emissive |
| Walls | Flat wood-panel grain, horizontal seam lines | Matte with subtle sheen |
| Rug | Woven fabric, geometric border, slight pile depth | Matte, slightly raised |
| Hardwood floor | Long diagonal planks, grain visible | Satin |
| Thumbtacks | Smooth dome, hard plastic or metal | Specular highlight at top |
| Red stamp impressions | Slight ink bleed at letter edges, inconsistent coverage | Flat matte |

---

## 12. ART STYLE DIRECTION

- **Primary style**: Clean 3D isometric digital illustration. Not photorealistic. Not flat. The depth level sits between flat vector and full 3D — similar to high-quality 3D game environments in titles like Monument Valley, Alto's Odyssey, or the type of isometric illustration used in premium product explainer videos.
- **Shading model**: Cel-shaded with 2–3 light levels per surface (ambient, mid-lit, direct-lit). No gradients except where lamp light blends into shadow — those transitions use a short radial gradient.
- **Outline treatment**: Subtle 1–2px dark outlines on foreground objects (desk, notebook, lamp). Background objects (walls, bookcase) have no outlines — only form is implied by contrast.
- **Film grain**: A subtle film grain noise overlay at 5–8% opacity across the entire illustration, especially visible in the dark shadow areas of the NIGHT variant.
- **Vignette**: Circular dark vignette at all four frame corners, approximately 15% of frame width inward, darkness peaking at 60% opacity black.
- **Period accuracy**: All objects are period-accurate to 1930s America. No digital screens, no plastic, no LED lights. Every object should be something that could exist in 1932.
- **Atmosphere**: The overall feeling should evoke a **Film Noir / Hard-Boiled Detective movie still** — moody, deliberate, heavy with tension. The SpatialChat reference gives the compositional approach (isometric room, multiple legible zones); the specific visual content, palette, and props come entirely from the mafia game.

---

## 13. STRICT EXCLUSION LIST

The following are present in the SpatialChat reference screenshot but **must NOT appear** in any variant of this background. Their absence is intentional and non-negotiable:

| SpatialChat Element | Reason for Exclusion |
|---|---|
| Sofas or lounge furniture | Not in mafia game UI |
| Coffee tables | Not in mafia game UI |
| Indoor plants / ferns | Not in mafia game UI |
| Video camera or microphone icons | Not in mafia game UI |
| Participant avatar dot/circle avatars | Mafia game uses polaroid cards, not floating circles |
| Stage or elevated platform sections | Not in mafia game UI |
| Participant count badge | Not in mafia game UI |
| Broadcast control panel | Not in mafia game UI |
| Upgrade button / subscription UI | Not in mafia game UI |
| Modern tech furniture | Period violation |
| Ambient purple/magenta wall lighting | Not in mafia game color system |
| Multiple room tiles side by side | Mafia game is one cohesive room, not a tileable space |
| Any digital screen or monitor | Not period-accurate, not in mafia game |
| Navigation bar or menu icons | No UI chrome in the background |

---

## 14. SCREEN-SPECIFIC VARIANT NOTES

The same base room can be adapted with minor prop swaps to represent each major screen:

### HOME SCREEN VARIANT
- Main desk is **clear except for the open manila folder** with:
  - "TOP SECRET" red stamp at -12° in the upper area of the folder left flap
  - Five role badge cards (small cardstock squares, each with the circular colored border and icon for Mafia / Villager / Doctor / Detective / Jester) arranged in a 2+2+1 grid on the right half of the folder
  - Three buttons rendered as **three physical objects on the desk** (not UI elements): a plain black metal card ("HOST GAME"), a dark red embossed card ("JOIN GAME"), a dark zinc card ("PLAY BOTS") — each approximately 60×30mm in isometric scale, arranged in a row below the folder
- No polaroids on desk for this variant — the desk surface outside the folder is clean

### LOBBY SCREEN VARIANT
- The **open manila folder is LARGER**, spanning nearly the full desk, with a visible **center spine divider** (slightly raised ridge in the folder center, represented as a dark brown strip).
- **Left flap**: Contains the suspect list — a lined paper inserted into the folder pocket, with 4–6 small oval avatar tokens (each a small circle with an initial letter printed inside in typewriter font) arranged in a vertical list with name strips.
- **Right flap**: Contains the settings paper — a separate parchment insert with a **2-column table** of settings (role distribution numbers, time settings in typewriter font).
- The **room code tag** is tucked into the top-right corner of the right flap with yellow tape.
- An additional **"Commence Operation"** dark red button card sits at the folder's bottom edge.

### GAME SCREEN VARIANT (Day Discussion)
- Full polaroid spread on the desk.
- Notebook is OPEN with handwriting on the left page.
- The instruction note card is pinned with red thumbtack, center-stage, with "DISCUSS FINDINGS IN THE NOTEBOOK" rendered in tiny typewritten caps.
- HUD box is represented as a **small folded placard** in the upper-right area of the desk — dark background card with "DAY DISCUSSION | 3:00" printed in white typewriter font.

### GAME SCREEN VARIANT (Night Phase)
- Use NIGHT LIGHTING variant.
- All polaroids on desk still visible (caught in moonlight stripes).
- The instruction note card reads "MARK A TARGET FOR ELIMINATION" in red typewriter font.
- HUD placard reads "NIGHT | 0:30".
- Notebook pages are in darkness — barely visible.

### GAME OVER / CASE CLOSED VARIANT
- An overlay of a large **"CASE CLOSED"** black rubber stamp impression at +12° rotation, centered across the entire desk surface — as if stamped across the full scene. The stamp text is thick, heavy serif, dark charcoal-black, at about 40% opacity so the underlying desk elements remain partially visible.
- The evidence board on the back wall is fully visible — all polaroids stamped with "DECEASED".

---

## 15. TECHNICAL PARAMETERS

```
DESKTOP VERSION
Aspect ratio:        16:9 (widescreen)
Safe zone:           UI content will overlay the center 50% of the frame. 
                     Left 25% and right 25% can be rich in detail.
                     Top 8% and bottom 8% are edge zones.
Resolution target:   3840×2160 (4K) for crisp rendering at all scales
                     Deliver at minimum 1920×1080

MOBILE VERSION
Aspect ratio:        9:16 (portrait)
Recompose for:       Vertical format — desk visible in upper 60% of frame.
                     Bottom 40% is clear/dark for overlaid UI elements.
                     The notebook should be more centered and prominent.
Safe zone:           Center 80% width, top 55% height — keep key desk 
                     elements within this safe zone.

BOTH VERSIONS
File format:         PNG with transparency layer for background separation
Color space:         sRGB
Vignette:            Applied as part of the illustration, not separate layer
Film grain:          Baked into the export at 6% opacity
Compression:         Lossless PNG or high-quality JPEG (95+)
```

---

## 16. PROMPT STRING (Midjourney / DALL-E / Flux Format)

```
isometric 3D illustration of a 1930s noir detective headquarters interior, 
top-down isometric camera at 30-degree elevation and 45-degree rotation, 
dark mahogany writing desk covered with scattered polaroid mugshot photographs 
at varied slight rotations, open manila folder with "TOP SECRET" red rubber 
stamp impression, spiral-bound lined paper notebook open to handwritten 
blue ink entries with red typewritten system messages, 1930s Underwood 
typewriter in corner, brass desk lamp casting warm amber cone of light, 
small parchment instruction card pinned with red thumbtack, cork evidence 
board on back wall with red string connecting suspect photographs, 
dark hardwood floor with noir area rug, venetian blind moonlight stripes 
in night variant, deep charcoal and mahogany walls with vertical wood 
paneling, each polaroid with gray mugshot silhouette and white border, 
some polaroids stamped DECEASED in red, brass magnifying glass on folder, 
red ink stamp pad and rubber stamp on desk surface, role identity card 
with circular colored badge, yellow tape strip detail, "CASE CLOSED" stamp 
variant option, film noir hard-boiled detective aesthetic, 1930s America 
period accurate, cel-shaded clean 3D isometric digital illustration, 
subtle film grain overlay, dark vignette at corners, matte finish, 
no modern technology, no plants, no sofas, no digital screens, 
color palette #f4ebd8 parchment #8b0000 dark crimson #2b1a0e mahogany 
#1e3a8a ink blue #07051a night black #c8841a amber lamp, 
ultra-detailed, 4K resolution, game background art --ar 16:9 --style raw
```

*For NIGHT variant, append:*
```
--night, venetian blind moonlight stripes, cold blue-white #b8d4f0 light, 
near-total darkness, fog wisps near ceiling, desk lamp OFF, 
deep navy-black atmosphere #07051a
```

*For MOBILE variant, append:*
```
--ar 9:16, portrait recompose, desk in upper 60% of frame, 
lower 40% dark and clear for UI overlay
```

---

*Document generated from full source-code analysis of mafia-game-no8t.onrender.com —  
DesktopHome.tsx, DesktopLobby.tsx, GameDesktop.tsx, GameMobile.tsx, MobileGame.tsx, 
Game.css, Reveal.tsx, and routing files. Zero features from reference were imported 
that do not exist in the site's own component tree.*
