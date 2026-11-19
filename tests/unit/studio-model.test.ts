import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Box3, Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { describe, expect, it } from "vitest";
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
        meshNames.push(node.userData.name);
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
  });
});
