"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

const LightingContext = createContext<{
  enabled: boolean;
  toggle: () => void;
} | null>(null);

const lightSurfaces = "[data-light-surface]";
const pointerLightingQuery =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function StudioLighting({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const litSurface = useRef<HTMLElement | null>(null);

  function resetLight() {
    litSurface.current?.style.removeProperty("--light-x");
    litSurface.current?.style.removeProperty("--light-y");
    litSurface.current = null;
  }

  function aimLight(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    if (!window.matchMedia(pointerLightingQuery).matches) return;
    const surface =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(lightSurfaces)
        : null;
    if (surface !== litSurface.current) resetLight();
    if (!surface) return;
    litSurface.current = surface;
    const bounds = surface.getBoundingClientRect();
    surface.style.setProperty("--light-x", `${event.clientX - bounds.left}px`);
    surface.style.setProperty("--light-y", `${event.clientY - bounds.top}px`);
  }

  function toggle() {
    resetLight();
    setEnabled((previous) => !previous);
  }

  return (
    <LightingContext.Provider value={{ enabled, toggle }}>
      <div
        data-studio-lights={enabled ? "on" : "off"}
        onPointerMove={aimLight}
        onPointerLeave={resetLight}
      >
        {children}
      </div>
    </LightingContext.Provider>
  );
}

export function StudioLightsButton() {
  const lighting = useContext(LightingContext);
  if (!lighting) return null;

  return (
    <button
      type="button"
      aria-pressed={lighting.enabled}
      onClick={lighting.toggle}
      className="min-h-11 border border-paper/50 px-4 text-sm hover:border-paper aria-pressed:bg-paper aria-pressed:text-ink focus-visible:outline-amber"
    >
      Studio lights
    </button>
  );
}
