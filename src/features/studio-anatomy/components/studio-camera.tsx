import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { OrthographicCamera, type Vector3, type Box3 } from "three";
import {
  gsap,
  reducedMotionQuery,
  ScrollTrigger,
  studioRevealQuery,
} from "@/lib/motion";
import { frameModel } from "../lib/model-view";

export function StudioCamera({
  bounds,
  target,
  overview,
  manual,
}: {
  bounds: Box3;
  target: Vector3;
  overview: boolean;
  manual: boolean;
}) {
  const { get, invalidate, size } = useThree();
  const initialized = useRef(false);
  const { width, height } = size;

  useLayoutEffect(() => {
    const { camera, gl } = get();
    if (
      !(camera instanceof OrthographicCamera) ||
      !width ||
      !height ||
      bounds.isEmpty()
    )
      return;

    const frame = frameModel(
      bounds,
      target,
      width,
      height,
      overview ? "building" : "interior",
    );
    const firstFrame = !initialized.current;
    initialized.current = true;

    function applyPose(from: typeof frame, progress: number) {
      if (!(camera instanceof OrthographicCamera)) return;
      camera.position.lerpVectors(from.position, frame.position, progress);
      camera.quaternion.slerpQuaternions(
        from.rotation,
        frame.rotation,
        progress,
      );
      camera.zoom = from.zoom + (frame.zoom - from.zoom) * progress;
      camera.updateProjectionMatrix();
      invalidate();
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      { all: "all", reduced: reducedMotionQuery, reveal: studioRevealQuery },
      (context) => {
        if (!manual && context.conditions?.reveal) {
          const arrival = frameModel(bounds, target, width, height, "arrival");
          const trigger = ScrollTrigger.create({
            trigger: gl.domElement,
            start: "top 94%",
            end: "top 38%",
            onUpdate: ({ progress }) => applyPose(arrival, progress),
            onRefresh: ({ progress }) => applyPose(arrival, progress),
          });
          applyPose(arrival, trigger.progress);
          let active = true;
          void document.fonts.ready.then(() => {
            if (active) trigger.refresh();
          });
          return () => {
            active = false;
            trigger.kill();
          };
        }

        if (firstFrame || !manual || context.conditions?.reduced) {
          applyPose(frame, 1);
          return;
        }

        const start = {
          position: camera.position.clone(),
          rotation: camera.quaternion.clone(),
          zoom: camera.zoom,
        };
        const progress = { value: 0 };
        gsap.to(progress, {
          value: 1,
          duration: 0.55,
          ease: "power2.out",
          onUpdate: () => applyPose(start, progress.value),
        });
      },
    );

    return () => media.revert();
  }, [bounds, get, height, invalidate, manual, overview, target, width]);

  return null;
}
