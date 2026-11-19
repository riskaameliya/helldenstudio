import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { Box3, Mesh, MeshBasicMaterial } from "three";
import { modelNodeFloor, modelNodeName, toScenePoint } from "../lib/model-view";
import { studioModelPath, studioModelRotation } from "../lib/studio-model";
import type { FloorId, StudioModelView } from "../types/rooms";
import { StudioCamera } from "./studio-camera";

function isolateFloor(meshes: Map<string, Mesh>, floor?: FloorId) {
  for (const [name, mesh] of meshes) {
    mesh.visible = !floor || modelNodeFloor(name) === floor;
  }
}

function highlightRoom(mesh: Mesh) {
  const original = mesh.material;
  const highlight = new MeshBasicMaterial({ color: "#ffad63" });
  mesh.material = highlight;
  return () => {
    mesh.material = original;
    highlight.dispose();
  };
}

export function StudioBuilding({
  manual,
  rooms,
  activeFloor,
  activeRoom,
  onSelect,
  onReady,
}: StudioModelView & { onReady: () => void }) {
  const { scene } = useGLTF(studioModelPath, false, false);
  const invalidate = useThree((state) => state.invalidate);

  const { building, meshes } = useMemo(() => {
    const building = scene.clone();
    building.rotation.x = studioModelRotation;
    building.updateMatrixWorld(true);
    const meshes = new Map<string, Mesh>();
    building.traverse((node) => {
      if (node instanceof Mesh) meshes.set(modelNodeName(node), node);
    });
    for (const room of rooms) {
      if (!meshes.has(`${room.id}_floor`))
        throw new Error(`Missing floor mesh: ${room.id}`);
    }
    return { building, meshes };
  }, [rooms, scene]);

  const { bounds, target } = useMemo(() => {
    const bounds = new Box3();
    const roomMesh = activeRoom && meshes.get(`${activeRoom.id}_floor`);
    if (activeRoom && roomMesh) {
      const target = toScenePoint(activeRoom.cameraTarget);
      bounds.setFromObject(roomMesh).expandByPoint(target);
      return { bounds, target };
    }
    for (const [name, mesh] of meshes) {
      if (!activeFloor || modelNodeFloor(name) === activeFloor)
        bounds.union(new Box3().setFromObject(mesh));
    }
    return { bounds, target: bounds.getCenter(toScenePoint([0, 0, 0])) };
  }, [activeFloor, activeRoom, meshes]);

  useLayoutEffect(() => {
    isolateFloor(meshes, activeFloor);
    invalidate();
  }, [activeFloor, invalidate, meshes]);

  useLayoutEffect(() => {
    const mesh = activeRoom && meshes.get(`${activeRoom.id}_floor`);
    if (!mesh) return;
    const restore = highlightRoom(mesh);
    invalidate();
    return () => {
      restore();
      invalidate();
    };
  }, [activeRoom, invalidate, meshes]);

  useEffect(onReady, [onReady]);

  return (
    <>
      <primitive
        object={building}
        dispose={null}
        onClick={(
          event: import("@react-three/fiber").ThreeEvent<MouseEvent>,
        ) => {
          const visibleHit = event.intersections.find(
            ({ object }) => object.visible,
          );
          if (!visibleHit) return;
          const room = rooms.find(
            ({ id }) => `${id}_floor` === modelNodeName(visibleHit.object),
          );
          if (room) {
            event.stopPropagation();
            onSelect(room);
          }
        }}
      />
      <StudioCamera
        bounds={bounds}
        target={target}
        overview={!activeFloor}
        manual={manual}
      />
    </>
  );
}
