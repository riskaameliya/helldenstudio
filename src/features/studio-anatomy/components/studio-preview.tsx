"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useState, type ReactNode } from "react";

const StudioModelCanvas = dynamic(() => import("./studio-model-canvas"), {
  ssr: false,
});

class PreviewErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("Studio preview failed to load", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function StudioPreview() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "unavailable"
  >("idle");
  const markReady = useCallback(() => setStatus("ready"), []);
  const markUnavailable = useCallback(() => setStatus("unavailable"), []);
  const showCanvas = status === "loading" || status === "ready";

  return (
    <div className="mt-8">
      <div className="relative grid aspect-[4/3] max-h-[32rem] place-items-center border border-paper/25 bg-black/20 sm:aspect-video">
        {status === "idle" && (
          <button
            type="button"
            className="min-h-11 bg-amber px-5 font-semibold text-ink focus-visible:outline-amber"
            onClick={() => setStatus("loading")}
          >
            Load 3D preview
          </button>
        )}
        {showCanvas && (
          <div className="absolute inset-0" aria-hidden="true">
            <PreviewErrorBoundary onError={markUnavailable}>
              <StudioModelCanvas
                onReady={markReady}
                onUnavailable={markUnavailable}
              />
            </PreviewErrorBoundary>
          </div>
        )}
        <p
          role="status"
          className={
            status === "ready"
              ? "sr-only"
              : "pointer-events-none relative px-4 text-center text-muted empty:hidden"
          }
        >
          {status === "loading" && "Loading studio model…"}
          {status === "ready" && "Studio model loaded."}
          {status === "unavailable" && "The 3D preview is unavailable."}
        </p>
      </div>
    </div>
  );
}
