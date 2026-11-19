"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";

export function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copy.current || !section.current) return;
    const element = copy.current;
    const trigger = section.current;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(element, {
        opacity: 0.78,
        y: 10,
        duration: 0.35,
        ease: "power2.out",
        scrollTrigger: { trigger, start: "top 85%", once: true },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section
      data-light-surface="paper"
      ref={section}
      aria-labelledby="manifesto-title"
      className="bg-paper text-ink"
    >
      <div
        ref={copy}
        className="site-gutter mx-auto max-w-screen-2xl py-16 md:py-24"
      >
        <h2 id="manifesto-title" className="editorial-title max-w-[16ch]">
          Make a frame of your own.
        </h2>
        <p className="mt-5 max-w-prose">
          Hellden Studio is a space to play with portraiture and
          self-photography, one room at a time.
        </p>
      </div>
    </section>
  );
}
