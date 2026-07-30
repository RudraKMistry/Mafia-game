# City UI Ideas

## General Concepts
- Isometric aesthetic for the city map and layout.

## 3D Models and Characters
- **Style:** Low-poly stylized characters (not realistic) for fast rendering, matching the isometric look.
- **Model Design:** Single-color base human models (similar to Among Us or Skribbl.io). Instead of loading multiple models, use one base model and dynamically change the material color for each player.
- **Placement:** Each player's avatar is a small 3D figure placed on a platform.
- **UI Overlays:** Floating name tag and role icon above each character's head.
- **Interaction:** Drag and drop mechanism enabled. Players or action tokens can be dragged and dropped (using 3D raycasting).

## Phase Lighting
- **Day Phase:** Brighten the scene with warm lighting.
- **Night Phase:** Dim the scene, shift ambient color to dark blue/purple, and add red/green glow effects (small point lights attached to characters).

## Player States
- **Dead Players:** Automatically swap the 3D model to a tombstone marker, or show them as fallen/greyed-out models.
