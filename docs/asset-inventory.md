# Hellden asset inventory

This audit covers the supplied files and GLB metadata. Browser rendering and comparison with the physical studio remain implementation checks.

| Input                                                                     | Audit and intended use                                                                                                                                                                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Runtime GLB](../public/models/hellden-building-blockout.glb)             | GLB 2.0, 83,732 bytes, SHA-256 `17e2e9295f1d5d8fd71081019420d04e7c135429f1bb1f1939eda915e053f147`. The supplied blockout moved to `public/models/` for runtime use. Its companion files remain in the source pack.             |
| [Room configuration](../public/hellden-studio-assets-v1/room-config.json) | Canonical model-space room IDs, floor, planar bounds, center, camera target, and material hints. Twelve entries across two floors. Coordinates are conceptual.                                                                 |
| [Node inventory](../public/hellden-studio-assets-v1/asset-inventory.json) | All 117 names are present in the GLB. The GLB also has a `world` root. Use names to assign scene ownership and verify the binding in tests.                                                                                    |
| [Generator](../public/hellden-studio-assets-v1/build.py)                  | Python with Trimesh and NumPy. It uses a hard-coded `/mnt/data/hellden-assets` output path and writes the GLB and companion files. Read for provenance. A regeneration would require a portable output path and parity checks. |
| [Packaged README](../public/hellden-studio-assets-v1/README.md)           | Confirms open front, conceptual geometry, labels in JSON, and unverified features such as wall openings, stairs, and finishes.                                                                                                 |

The GLB has 117 meshes and 3,016 indexed triangles, with no embedded images, material definitions, animations, cameras, or declared extensions. Color is stored on geometry. The first floor slab spans the source XY plane, the upper slab is elevated on source Z, and the cashier slab agrees with its JSON XY bounds within float precision.

## Content to obtain

| Input                                                                                               | Needed for                                   | Interim treatment                                                                                                                                |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Licensed or studio-owned hero and gallery photography, credits, crop permissions, room associations | Hero, gallery, room details, social metadata | Use geometry-derived stills for the anatomy and a type-led hero for internal review. Keep the public gallery gated until approved photos arrive. |
| Wordmark, brand references, type licenses, copy language and tone                                   | Identity, reading hierarchy, metadata        | Treat the proposed design tokens and English headline as review material.                                                                        |
| Approved room descriptions, customer access, session offerings, terminology                         | Room exploration                             | Surface configured room names and floor only. Confirm public descriptions and the distinction between customer spaces and operational spaces.    |
| Verified booking destination, contact details, location, hours, social links                        | Booking and footer                           | Keep unverified links and claims out of the public page. A complete release requires a working booking destination.                              |
| Reference photos or approved measurements for future geometry changes                               | Photorealism or layout revisions             | Preserve the supplied conceptual v1 arrangement.                                                                                                 |
| Deployment target and representative mobile device                                                  | Build verification and performance sign-off  | Use local production builds and emulated viewports first.                                                                                        |

See [architecture](architecture.md) for coordinate conversion and [implementation plan](implementation-plan.md) for release gates.
