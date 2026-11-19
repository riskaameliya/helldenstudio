import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { OrthographicCamera, type Vector3, type Box3 } from "three";
import { frameModel } from "../lib/model-view";

export function StudioCamera({
  bounds,
  target,
  overview,
}: {
  bounds: Box3;
  target: Vector3;
  overview: boolean;
}) {
  const { get, invalidate, size } = useThree();
  const initialized = useRef(false);
  const { width, height } = size;

  useLayoutEffect(() => {
    const { camera } = get();
    if (
      !(camera instanceof OrthographicCamera) ||
      !width ||
      !height ||
      bounds.isEmpty()
    )
      return;

    const frame = frameModel(bounds, target, width, height, overview);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = camera.position.clone();
    const startRotation = camera.quaternion.clone();
    const startZoom = camera.zoom;
    const progress = { value: 0 };
    const apply = (value: number) => {
      camera.position.lerpVectors(start, frame.position, value);
      camera.quaternion.slerpQuaternions(startRotation, frame.rotation, value);
      camera.zoom = startZoom + (frame.zoom - startZoom) * value;
      camera.updateProjectionMatrix();
      invalidate();
    };

    if (!initialized.current || reducedMotion.matches) {
      initialized.current = true;
      apply(1);
      return;
    }

    const tween = gsap.to(progress, {
      value: 1,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => apply(progress.value),
    });

    const respectMotionPreference = () => {
      if (!reducedMotion.matches) return;
      tween.kill();
      apply(1);
    };
    reducedMotion.addEventListener("change", respectMotionPreference);
    return () => {
      tween.kill();
      reducedMotion.removeEventListener("change", respectMotionPreference);
    };
  }, [bounds, get, height, invalidate, overview, target, width]);

  return null;
}
