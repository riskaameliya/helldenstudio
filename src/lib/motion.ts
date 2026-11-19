import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
export const studioRevealQuery =
  "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger };
