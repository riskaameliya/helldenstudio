"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { Mesh, PerspectiveCamera } from "three";
import {
  modelNodeFloor,
  modelNodeName,
  toScenePoint,
} from "@/features/studio-anatomy/lib/model-view";
import {
  studioModelPath,
  studioModelRotation,
} from "@/features/studio-anatomy/lib/studio-model";
import { gsap, reducedMotionQuery, ScrollTrigger } from "@/lib/motion";
import { chapterProgress } from "./chapter-progress";
import { walkthroughPose } from "./walkthrough-route";
import type { WalkthroughStop } from "./walkthrough-stops";

type WalkthroughCanvasProps = {
  tour: RefObject<HTMLElement | null>;
  stops: WalkthroughStop[];
  onReady: () => void;
  onUnavailable: () => void;
};

function StudioTourScene({
  tour,
  stops,
  onReady,
  onUnavailable,
}: WalkthroughCanvasProps) {
  const { scene } = useGLTF(studioModelPath, false, false);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);
  const get = useThree((state) => state.get);
  const { width, height } = useThree((state) => state.size);

  useLayoutEffect(() => {
    const { camera } = get();
    if (!(camera instanceof PerspectiveCamera) || !height || !width) return;
    // Matches the CSS doorway width cap on narrow canvases.
    camera.zoom = Math.min(1, (width * 0.86) / (height * 0.515));
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, height, invalidate, width]);

  const model = useMemo(() => {
    const clone = scene.clone();
    clone.rotation.x = studioModelRotation;
    // Both floors share the existing model. Hide only the roof outline.
    clone.traverse((node) => {
      if (node instanceof Mesh) {
        const name = modelNodeName(node);
        node.visible = modelNodeFloor(name) !== undefined;
      }
    });
    return clone;
  }, [scene]);

  useLayoutEffect(() => {
    const element = tour.current;
    const finalChapter = element?.querySelector("[data-last-stop]");
    if (!element || !finalChapter) return;
    const motion = window.matchMedia(reducedMotionQuery);
    gsap.registerPlugin(ScrollTrigger);

    const chapters = Array.from(
      element.querySelectorAll<HTMLElement>("[data-tour-chapter]"),
    );
    let starts: number[] = [];
    let holds: number[] = [];
    const measure = () => {
      starts = chapters.map(
        (chapter) => chapter.offsetTop - chapters[0].offsetTop,
      );
      holds = chapters.map((chapter) => {
        const layout = chapter.querySelector<HTMLElement>(
          "[data-gallery-layout]",
        );
        return layout
          ? Math.max(0, chapter.offsetHeight - layout.offsetHeight)
          : 0;
      });
    };
    measure();
    const renderPose = (scroll: number) => {
      const { position, target } = walkthroughPose(
        stops,
        chapterProgress(scroll, starts, holds),
        motion.matches,
      );
      camera.position.copy(toScenePoint(position));
      camera.lookAt(toScenePoint(target));
      invalidate();
    };
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      endTrigger: finalChapter,
      end: "top top",
      onUpdate: (self) => renderPose(self.scroll() - self.start),
      onRefresh: (self) => {
        measure();
        renderPose(self.scroll() - self.start);
      },
    });
    const sync = () => renderPose(trigger.scroll() - trigger.start);
    const resize = new ResizeObserver(() => trigger.refresh());
    resize.observe(element);
    sync();
    motion.addEventListener("change", sync);
    return () => {
      resize.disconnect();
      motion.removeEventListener("change", sync);
      trigger.kill();
    };
  }, [camera, invalidate, stops, tour]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onUnavailable);
    return () => canvas.removeEventListener("webglcontextlost", onUnavailable);
  }, [gl, onUnavailable]);

  const firstFrame = useRef<number | undefined>(undefined);
  useFrame(() => {
    if (firstFrame.current === undefined) {
      // Fiber renders after frame subscribers run. Reveal on the next tick.
      firstFrame.current = requestAnimationFrame(onReady);
    }
  });
  useLayoutEffect(
    () => () => {
      if (firstFrame.current !== undefined) {
        cancelAnimationFrame(firstFrame.current);
        firstFrame.current = undefined;
      }
    },
    [],
  );

  return <primitive object={model} dispose={null} />;
}

export default function WalkthroughCanvas(props: WalkthroughCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 66, near: 0.045, far: 80 }}
      dpr={[1, 1.5]}
      frameloop="demand"
    >
      <color attach="background" args={["#1c1512"]} />
      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#ffe6cb", "#77655a", 2]} />
      <directionalLight position={[6, 7, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <StudioTourScene {...props} />
      </Suspense>
    </Canvas>
  );
}
