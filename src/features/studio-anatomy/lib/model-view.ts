import { Box3, Matrix4, Quaternion, Vector3, type Object3D } from "three";
import type { FloorId, ModelPoint } from "../types/rooms";

const arrivalOffset = new Vector3(2, 4, 26);
const overviewOffset = new Vector3(13, 10, 22);
const interiorOffset = new Vector3(9, 22, 16);
const framingMargin = 1.22;
const cameraOffsets = {
  arrival: arrivalOffset,
  building: overviewOffset,
  interior: interiorOffset,
};

export function toScenePoint([x, depth, height]: ModelPoint) {
  return new Vector3(x, height, -depth);
}

export function modelNodeName(node: Object3D): string {
  return node.userData.name ?? node.name;
}

export function modelNodeFloor(name: string): FloorId | undefined {
  if (name.startsWith("roof_beam_")) return undefined;
  if (/_l2(?:_|$)|^floor2_|_z4\.25$/.test(name)) return 2;
  return 1;
}

export function frameModel(
  bounds: Box3,
  target: Vector3,
  width: number,
  height: number,
  view: keyof typeof cameraOffsets,
) {
  const position = target.clone().add(cameraOffsets[view]);
  const rotation = new Quaternion().setFromRotationMatrix(
    new Matrix4().lookAt(position, target, new Vector3(0, 1, 0)),
  );
  const inverseRotation = rotation.clone().invert();
  let halfWidth = 0;
  let halfHeight = 0;

  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const corner = new Vector3(x, y, z)
          .sub(target)
          .applyQuaternion(inverseRotation);
        halfWidth = Math.max(halfWidth, Math.abs(corner.x));
        halfHeight = Math.max(halfHeight, Math.abs(corner.y));
      }
    }
  }

  return {
    position,
    rotation,
    zoom:
      Math.min(width / (2 * halfWidth), height / (2 * halfHeight)) /
      framingMargin,
  };
}
