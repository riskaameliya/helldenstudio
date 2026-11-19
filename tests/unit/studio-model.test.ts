import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Box3, Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { describe, expect, it } from "vitest";
import {
  modelNodeFloor,
  modelNodeName,
  toScenePoint,
} from "../../src/features/studio-anatomy/lib/model-view";
import roomConfig from "../../public/hellden-studio-assets-v1/room-config.json";
import { readStudioRooms } from "../../src/features/studio-anatomy/lib/room-data";
import inventory from "../../public/hellden-studio-assets-v1/asset-inventory.json";
import {
  studioModelPath,
  studioModelRotation,
} from "../../src/features/studio-anatomy/lib/studio-model";

describe("studio blockout", () => {
  it("parses the served GLB and contains every inventoried mesh", async () => {
    const bytes = await readFile(resolve("public", `.${studioModelPath}`));
    const { scene } = await new GLTFLoader().parseAsync(
      Uint8Array.from(bytes).buffer,
      "",
    );
    const meshNames: string[] = [];

    scene.traverse((node) => {
      if (node instanceof Mesh) {
        // GLTFLoader sanitizes Object3D names and preserves the source name here.
        meshNames.push(modelNodeName(node));
      }
    });

    expect(meshNames.sort()).toEqual([...inventory.nodes].sort());

    scene.rotation.x = studioModelRotation;
    scene.updateMatrixWorld(true);
    const lowerFloor = scene.getObjectByName("floor1_base")!;
    const upperFloor = scene.getObjectByName("floor2_base")!;
    const lowerBounds = new Box3().setFromObject(lowerFloor);
    const upperBounds = new Box3().setFromObject(upperFloor);

    expect(upperBounds.min.y).toBeGreaterThan(lowerBounds.max.y);
    expect(lowerBounds.min.z).toBeCloseTo(-16);

    for (const room of readStudioRooms(roomConfig)) {
      const name = `${room.id}_floor`;
      const mesh = scene.getObjectByName(name);
      expect(mesh, name).toBeDefined();
      expect(modelNodeFloor(name)).toBe(room.floor);
      const bounds = new Box3().setFromObject(mesh!);
      const target = toScenePoint(room.cameraTarget);
      expect(
        bounds.containsPoint(
          target.clone().setY(bounds.getCenter(target.clone()).y),
        ),
        name,
      ).toBe(true);
      expect(target.y, name).toBeGreaterThan(bounds.max.y);
      expect(target.y - bounds.max.y, name).toBeLessThan(1.3);
    }

    expect(modelNodeFloor("right_wall_z4.25")).toBe(2);
    expect(modelNodeFloor("stair_step_11")).toBe(1);
    expect(modelNodeFloor("roof_beam_8")).toBeUndefined();
  });
});
