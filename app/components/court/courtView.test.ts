import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { CAM_BASE, CAM_FAR, CAM_LOOK, CAM_NEAR, courtOutlinePx, fovForAspect, projectPoint } from "./courtView.ts";

const POINTS: [number, number, number][] = [
  [0, 0, 0],
  [-6.7, 0, 3.05],
  [6.7, 0, -3.05],
  [0, 1.55, 3.0],
  [2.8, 2.5, 0],
  [5, 1.05, 0],
  [-3, 1.2, 0],
  [3.3, 0.004, -2.59],
  [-6.7, 0.5, 0],
];

for (const [w, h] of [
  [1200, 500],
  [900, 480],
  [1600, 560],
  [1440, 600],
] as const) {
  test(`projectPoint는 three camera.project와 0.5px 이내로 일치 (${w}x${h})`, () => {
    const cam = new THREE.PerspectiveCamera(40, 1, CAM_NEAR, CAM_FAR);
    cam.position.set(CAM_BASE.x, CAM_BASE.y, CAM_BASE.z);
    cam.lookAt(CAM_LOOK.x, CAM_LOOK.y, CAM_LOOK.z);
    cam.aspect = w / h;
    cam.fov = fovForAspect(w / h);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    for (const [x, y, z] of POINTS) {
      const v = new THREE.Vector3(x, y, z).project(cam);
      const ex = (v.x * 0.5 + 0.5) * w;
      const ey = (-v.y * 0.5 + 0.5) * h;
      const p = projectPoint(x, y, z, w, h);
      assert.ok(p);
      assert.ok(Math.abs(p.x - ex) < 0.5, `x ${p.x} vs ${ex}`);
      assert.ok(Math.abs(p.y - ey) < 0.5, `y ${p.y} vs ${ey}`);
    }
  });
}

test("courtOutlinePx는 모든 점이 유한하다", () => {
  const o = courtOutlinePx(1200, 500);
  const all = [...o.floor, ...o.lines.flat(), ...o.net.flat(), ...o.tape, ...o.posts.flat()];
  assert.ok(all.length > 0);
  for (const p of all) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
});
