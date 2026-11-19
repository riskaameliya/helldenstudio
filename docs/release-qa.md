# Phase 6 release QA

The production build passed local QA. Public release still requires content approval and verification on a representative physical phone.

## Browser coverage

- Playwright 1.65.1 ran 25 tests against the production server on macOS 15.0.1 arm64. Chromium covered the full suite. Firefox and WebKit covered navigation, room selection, no-JavaScript content, focus, headings, and viewport layout.
- Layout and keyboard checks passed at widths of 360, 768, and 1440 CSS pixels. The skip link transfers keyboard focus to the main landmark. The visual review caught missing hero styles in production. The Tailwind loader now targets the global stylesheet, and the suite checks the hero typography at all three widths.
- Chromium also covered frame changes through both floors and a room, desktop forward and reverse scroll, manual camera takeover, reduced motion, GLB request failure, unavailable WebGL, and a forced WebGL context loss. Room controls remain available after all three rendering failures.
- For the checked palette pairs, the contrast ratios were 15.41:1 for paper on ink, 9.51:1 for muted text on ink, 10.07:1 for amber on ink, and 6.72:1 for paper on oxblood. The hero link uses paper text across the ink and oxblood portions of the artwork. Full screen-reader sign-off remains open.

## Local performance sample

Chromium 159.0.8154.6, headless on the same macOS host, with a 390 × 844 CSS-pixel touch-emulated viewport at DPR 2 and loopback networking. Figures are from a single sample.

| Check                 | Observation                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Initial transfer      | 271,354 bytes from resource and navigation timing                                                      |
| Model loading         | Zero initial GLB requests, then one after selecting a floor                                            |
| Renderer loading      | No initial JavaScript response contained the Three.js `WebGLRenderer` marker                           |
| Initial layout shifts | No non-input layout shift entries in the observation window                                            |
| Camera timing         | 51 requestAnimationFrame intervals in the 850 ms sample spanning the floor change, with p95 of 16.8 ms |
| Settled canvas        | Zero WebGL draw calls during the subsequent 500 ms observation window                                  |

The headless run returned no usable LCP sample. Field LCP, INP, CLS and GPU behavior on physical phones remain unverified.

## Release items still open

- Approve studio imagery, credits, room copy, and public-facing brand copy.
- Provide and verify a booking destination and any public business details against the [asset inventory](asset-inventory.md).
- Run screen-reader and touch checks on representative devices and collect performance measurements under release conditions.

For local reproduction, install the Playwright browsers with `npx playwright install chromium firefox webkit`, run `npm run build`, then run `npm run test:e2e`.
