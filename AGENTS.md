<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Hellden Studio engineering rules

- Follow the approved [implementation plan](docs/implementation-plan.md) and the feature boundaries in [architecture](docs/architecture.md). Obtain plan approval before starting product implementation.
- Prefer composition and focused components. Keep data, rendering and content separate. Share code when multiple callers genuinely need it.
- Keep server and client boundaries explicit. Default to Server Components and keep browser rendering and GSAP in scoped client boundaries.
- Treat the supplied `room-config.json` as authoritative for conceptual coordinates. Use typed room IDs, one coordinate adapter and named configuration values. Preserve the confirmed floor arrangement and omit unverified dimensions or business claims.
- Keep selection local to the anatomy feature. Share it with Room Exploration and keep canvas state out of content and configuration.
- Reuse focused motion utilities where needed. Revert GSAP timelines and ScrollTriggers and release owned rendering resources. Maintain reduced-motion and WebGL-failure paths.
- Justify each dependency and check peer compatibility. Verify changed behavior through the relevant unit, browser and production checks in the plan.
