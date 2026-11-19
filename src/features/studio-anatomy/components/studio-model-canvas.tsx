"use client";

import { Bounds, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { studioModelPath, studioModelRotation } from "../lib/studio-model";

type StudioModelCanvasProps = {
  onReady: () => void;
  onUnavailable: () => void;
};

function StudioModel({ onReady }: Pick<StudioModelCanvasProps, "onReady">) {
  const { scene } = useGLTF(studioModelPath, false, false);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <group rotation-x={studioModelRotation}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

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

const snapToFit = () => 1;

export default function StudioModelCanvas({
  onReady,
  onUnavailable,
}: StudioModelCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [16, 13, 20] }}
      dpr={[1, 1.5]}
      frameloop="demand"
    >
      <ContextLossListener onUnavailable={onUnavailable} />
      <ambientLight intensity={1.65} />
      <directionalLight position={[6, 12, 8]} intensity={2} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2} interpolateFunc={snapToFit}>
          <StudioModel onReady={onReady} />
        </Bounds>
      </Suspense>
    </Canvas>
  );
}
