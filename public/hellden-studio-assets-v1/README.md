# Hellden Studio — Anatomy 3D Blockout v1

This is an **editable concept-stage GLB scene**, not a survey-accurate reconstruction.

## Layout
- Floor 1: left from entrance to back = cashier, portrait, cinema, record, express; rear left = stairs. Right = waiting room, DIY, beverage.
- Floor 2: front = self photo portrait; left = operator/cashier; right = DIY self photo.

## Contents
- [`hellden-building-blockout.glb`](../models/hellden-building-blockout.glb): named geometry nodes, colored room floors, walls and stylized furniture. Import into Blender or load in Three.js / React Three Fiber.
- `room-config.json`: room bounds and camera targets for click hotspots and scroll choreography.
- `asset-inventory.json`: node names for later editing.
- `build.py`: procedural generator.

## Important
Dimensions are approximate, and wall openings, stair placement, room dimensions, furniture and finishes must be verified against actual measurements and images. The model intentionally leaves the front open for cutaway viewing. Room labels are in JSON, not rendered in the GLB.

## Suggested next steps
1. Import GLB in Blender and inspect the scene.
2. Adjust geometry to measured dimensions and photo references.
3. Replace simple furniture blocks with detailed optimized meshes.
4. Set up GSAP camera timeline and room interactions in Next.js.
