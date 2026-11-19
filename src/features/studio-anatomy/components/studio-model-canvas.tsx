"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { StudioBuilding } from "./studio-building";
import type { StudioModelView } from "../types/rooms";

type StudioModelCanvasProps = StudioModelView & {
  onReady: () => void;
  onUnavailable: () => void;
};

function ContextLossListener({
  onUnavailable,
}: Pick<StudioModelCanvasProps, "onUnavailable">) {
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    canvas.addEventListener("webglcontextlost", onUnavailable);
    return () => canvas.removeEventListener("webglcontextlost", onUnavailable);
  }, [canvas, onUnavailable]);

  return null;
}

export default function StudioModelCanvas({
  onUnavailable,
  ...view
}: StudioModelCanvasProps) {
  return (
    <Canvas orthographic dpr={[1, 1.5]} frameloop="demand">
      <ContextLossListener onUnavailable={onUnavailable} />
      <ambientLight intensity={1.65} />
      <directionalLight position={[6, 12, 8]} intensity={2} />
      <Suspense fallback={null}>
        <StudioBuilding {...view} />
      </Suspense>
    </Canvas>
  );
}
