import * as THREE from "three";
import { NET_TOP, ZONES, type ZoneId } from "./physics";

/**
 * 홈 배드민턴 히어로의 three.js 장면. CourtHero가 import("./scene")로만 불러온다 —
 * 다른 파일에서 이 모듈이나 three를 정적 import하면 three가 홈 First Load JS에 섞인다.
 * 원본: docs/superpowers/prototypes/proto-b-threejs.html (r170 → 0.186 이식).
 */

export type Theme = "light" | "dark";

export interface RenderView {
  shuttle: { x: number; y: number; ang: number; spin: number; speed: number };
  racket: { x: number; y: number; vx: number; visible: boolean };
  dt: number; // 프레임 dt(s)
  time: number; // performance.now()/1000
}

export interface SceneHandle {
  render(view: RenderView): void;
  burst(x: number, y: number, dirx: number, diry: number, speed: number): void;
  shake(amount: number): void;
  pulseZone(id: ZoneId): void;
  popRacket(): void;
  /** 캔버스 기준 CSS px → z=0 평면 월드 좌표. 교차 없으면 null */
  screenToWorld(px: number, py: number): { x: number; y: number } | null;
  /** 월드 → 캔버스 기준 CSS px */
  worldToScreen(x: number, y: number): { x: number; y: number };
  resize(width: number, height: number): void;
  setTheme(theme: Theme): void;
  dispose(): void;
}

const CAM_DIST = 11;
const WORLD_HALF_W = 7.2;
const TRAIL_N = 36;
const MAX_PARTICLES = 240;
const COURT_L = 13.4;
const COURT_W = 6.1;

const THEMES = {
  light: { bg: 0xf5f5f4, court: 0xe9d6b4, line: 0xfafaf9, net: 0x57534e, accent: 0xd97706, hemi: 1.6, dir: 2.2, shadow: 0.28 },
  dark: { bg: 0x111827, court: 0x25344a, line: 0xe5e7eb, net: 0xd6d3d1, accent: 0xf59e0b, hemi: 1.1, dir: 1.7, shadow: 0.55 },
} as const;

export function createScene(canvas: HTMLCanvasElement, theme: Theme): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const background = new THREE.Color(THEMES[theme].bg);
  scene.background = background;
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  const camBase = new THREE.Vector3(0.4, 3.3, CAM_DIST);
  const camLook = new THREE.Vector3(0, 1.9, 0);
  camera.position.copy(camBase);
  camera.lookAt(camLook);
  let width = 1;
  let height = 1;

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight(0xfff7ea, 0xd9b98a, 1.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.2);
  sun.position.set(-4, 9, 5);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 8, bottom: -8, near: 1, far: 30 });
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  // ---------- court ----------
  const courtMat = new THREE.MeshStandardMaterial({ color: 0xe9d6b4, roughness: 0.85 });
  const court = new THREE.Mesh(new THREE.PlaneGeometry(COURT_L + 1.6, COURT_W + 1.6).rotateX(-Math.PI / 2), courtMat);
  court.receiveShadow = true;
  scene.add(court);

  // 코트 밖 그림자만 보이게 하는 큰 투명 바닥
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80).rotateX(-Math.PI / 2), groundMat);
  ground.position.y = -0.002;
  ground.receiveShadow = true;
  scene.add(ground);

  const lineMat = new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  function courtLine(x1: number, z1: number, x2: number, z2: number) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.04).rotateX(-Math.PI / 2), lineMat);
    m.position.set((x1 + x2) / 2, 0.004, (z1 + z2) / 2);
    m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    m.receiveShadow = true;
    scene.add(m);
  }
  const hl = COURT_L / 2;
  const hw = COURT_W / 2;
  const sw = 5.18 / 2;
  courtLine(-hl, -hw, hl, -hw);
  courtLine(-hl, hw, hl, hw);
  courtLine(-hl, -hw, -hl, hw);
  courtLine(hl, -hw, hl, hw);
  courtLine(-hl, -sw, hl, -sw);
  courtLine(-hl, sw, hl, sw);
  for (const sgn of [-1, 1]) {
    courtLine(sgn * 1.98, -hw, sgn * 1.98, hw);
    courtLine(sgn * 5.94, -hw, sgn * 5.94, hw);
    courtLine(sgn * 1.98, 0, sgn * hl, 0);
  }

  // ---------- net + posts ----------
  const netMat = new THREE.LineBasicMaterial({ color: 0x57534e, transparent: true, opacity: 0.75 });
  {
    const pts: number[] = [];
    const y0 = 0.76;
    const y1 = NET_TOP;
    const cell = 0.1;
    for (let z = -hw; z <= hw + 1e-6; z += cell) pts.push(0, y0, z, 0, y1, z);
    for (let y = y0; y <= y1 + 1e-6; y += cell) pts.push(0, y, -hw, 0, y, hw);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    scene.add(new THREE.LineSegments(g, netMat));
  }
  const postMat = new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.5, metalness: 0.4 });
  for (const z of [-hw - 0.08, hw + 0.08]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, NET_TOP + 0.05, 12), postMat);
    post.position.set(0, (NET_TOP + 0.05) / 2, z);
    post.castShadow = true;
    scene.add(post);
  }
  const tape = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.075, COURT_W + 0.16),
    new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.6 })
  );
  tape.position.set(0, NET_TOP - 0.035, 0);
  tape.castShadow = true;
  scene.add(tape);

  // ---------- target zones ----------
  const zones = ZONES.map((d) => {
    const boxGeo = new THREE.BoxGeometry(d.w, d.h, 1.4);
    const mat = new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.16, depthWrite: false });
    const mesh = new THREE.Mesh(boxGeo, mat);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xd97706 });
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), edgeMat));
    mesh.position.set(d.cx, d.cy, 0);
    scene.add(mesh);
    return { id: d.id, cx: d.cx, cy: d.cy, mesh, mat, edgeMat, pulse: 0 };
  });

  // ---------- shuttle mesh ----------
  const shuttleGroup = new THREE.Group(); // position + z-rotation (비행 방향)
  const shuttleRoll = new THREE.Group(); // x-rotation (자기 축 회전)
  shuttleGroup.add(shuttleRoll);
  {
    // 로컬 +X가 앞(코르크), 스커트는 -X 방향
    const rc = 0.036;
    const x0 = -0.022;
    const x1 = -0.2;
    const r0 = 0.03;
    const r1 = 0.098;
    const corkMat = new THREE.MeshStandardMaterial({ color: 0xe9d6a8, roughness: 0.62 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(rc, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-Math.PI / 2), corkMat);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(rc, rc * 0.95, 0.022, 20).rotateZ(Math.PI / 2), corkMat);
    collar.position.x = -0.011;
    shuttleRoll.add(dome, collar);

    // 깃털 16장: 살짝 비틀고 번갈아 음영을 줘 회전이 보이게 한다
    const N = 16;
    const step = (Math.PI * 2) / N;
    const hwAng = step * 0.46;
    const twist = 0.12;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * step;
      const shade = i % 2 ? 0.8 : 1.0;
      const v = [
        [x0, r0, a - hwAng * 0.55],
        [x0, r0, a + hwAng * 0.55],
        [x1, r1, a + twist + hwAng],
        [x1, r1, a + twist - hwAng],
      ];
      const b = pos.length / 3;
      v.forEach(([x, r, ang], k) => {
        pos.push(x, r * Math.cos(ang), r * Math.sin(ang));
        const c = shade * (k < 2 ? 0.9 : 1.0);
        col.push(c, c * 0.985, c * 0.95);
      });
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    fg.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    fg.setIndex(idx);
    fg.computeVertexNormals();
    const feathers = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide }));
    shuttleRoll.add(feathers);

    const ringTop = new THREE.Mesh(
      new THREE.TorusGeometry(r1, 0.0045, 6, 40).rotateY(Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
    );
    ringTop.position.x = x1;
    const rm = 0.55;
    const ringMid = new THREE.Mesh(
      new THREE.TorusGeometry(r0 + (r1 - r0) * rm, 0.0025, 6, 40).rotateY(Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xcdb98e, roughness: 0.7 })
    );
    ringMid.position.x = x0 + (x1 - x0) * rm;
    shuttleRoll.add(ringTop, ringMid);
    shuttleGroup.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
  }
  scene.add(shuttleGroup);

  // ---------- trail ribbon ----------
  const trailPts = Array.from({ length: TRAIL_N }, () => ({ x: 5.6, y: 1.4, sp: 0 }));
  const trailPos = new Float32Array(TRAIL_N * 2 * 3);
  const trailAlpha = new Float32Array(TRAIL_N * 2);
  const trailIdx: number[] = [];
  for (let i = 0; i < TRAIL_N - 1; i++) {
    const a = i * 2;
    trailIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute("aAlpha", new THREE.BufferAttribute(trailAlpha, 1));
  trailGeo.setIndex(trailIdx);
  const trailMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(0xd97706) } },
    vertexShader: `attribute float aAlpha; varying float vA;
      void main(){ vA = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uColor; varying float vA;
      void main(){ gl_FragColor = vec4(uColor, vA);
#include <colorspace_fragment>
      }`,
  });
  const trail = new THREE.Mesh(trailGeo, trailMat);
  trail.frustumCulled = false;
  trail.position.z = -0.03;
  trail.renderOrder = 2;
  scene.add(trail);

  function updateTrail(x: number, y: number, sp: number) {
    for (let i = 0; i < TRAIL_N - 1; i++) {
      trailPts[i].x = trailPts[i + 1].x;
      trailPts[i].y = trailPts[i + 1].y;
      trailPts[i].sp = trailPts[i + 1].sp;
    }
    const last = trailPts[TRAIL_N - 1];
    last.x = x;
    last.y = y;
    last.sp = sp;
    for (let i = 0; i < TRAIL_N; i++) {
      const p = trailPts[i];
      const a = trailPts[Math.max(0, i - 1)];
      const b = trailPts[Math.min(TRAIL_N - 1, i + 1)];
      let tx = b.x - a.x;
      let ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const f = i / (TRAIL_N - 1);
      const w = 0.045 * f * Math.min(1, p.sp / 8);
      trailPos.set([p.x - ty * w, p.y + tx * w, 0, p.x + ty * w, p.y - tx * w, 0], i * 6);
      const al = Math.pow(f, 1.6) * 0.75 * Math.min(1, p.sp / 6);
      trailAlpha[i * 2] = trailAlpha[i * 2 + 1] = al;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.aAlpha.needsUpdate = true;
  }

  // ---------- particles ----------
  const pPos = new Float32Array(MAX_PARTICLES * 3);
  const pSize = new Float32Array(MAX_PARTICLES);
  const pAlpha = new Float32Array(MAX_PARTICLES);
  const pVel = new Float32Array(MAX_PARTICLES * 3);
  const pLife = new Float32Array(MAX_PARTICLES); // 남은 시간(s)
  const pMax = new Float32Array(MAX_PARTICLES);
  let pCursor = 0;
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
  pGeo.setAttribute("aAlpha", new THREE.BufferAttribute(pAlpha, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(0xd97706) }, uScale: { value: 500 } },
    vertexShader: `attribute float aSize; attribute float aAlpha; uniform float uScale; varying float vA;
      void main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, vA * smoothstep(0.5, 0.12, d));
#include <colorspace_fragment>
      }`,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  points.renderOrder = 3;
  scene.add(points);

  function burst(x: number, y: number, dirx: number, diry: number, speed: number) {
    const n = Math.min(70, 22 + Math.floor(speed * 1.2));
    const dl = Math.hypot(dirx, diry) || 1;
    dirx /= dl;
    diry /= dl;
    for (let k = 0; k < n; k++) {
      const i = pCursor;
      pCursor = (pCursor + 1) % MAX_PARTICLES;
      const a = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * (2 + speed * 0.12);
      const along = Math.random() < 0.55 ? 0.6 + Math.random() * 0.8 : 0; // 타구 방향으로 튀는 일부
      pPos[i * 3] = x;
      pPos[i * 3 + 1] = y;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      pVel[i * 3] = Math.cos(a) * spd + dirx * speed * 0.15 * along;
      pVel[i * 3 + 1] = Math.sin(a) * spd + diry * speed * 0.15 * along;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * spd;
      pMax[i] = pLife[i] = 0.35 + Math.random() * 0.45;
      pSize[i] = 0.04 + Math.random() * 0.06;
    }
  }
  function updateParticles(dt: number) {
    const drag = Math.exp(-dt * 3);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (pLife[i] <= 0) {
        pAlpha[i] = 0;
        continue;
      }
      pLife[i] -= dt;
      pVel[i * 3] *= drag;
      pVel[i * 3 + 1] = pVel[i * 3 + 1] * drag - 4 * dt;
      pVel[i * 3 + 2] *= drag;
      pPos[i * 3] += pVel[i * 3] * dt;
      pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt;
      pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      pAlpha[i] = Math.max(0, pLife[i] / pMax[i]);
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.aAlpha.needsUpdate = true;
    pGeo.attributes.aSize.needsUpdate = true;
  }

  // ---------- racket ----------
  const racketGroup = new THREE.Group(); // 원점 = 스트링 면 중심
  const racketPivot = new THREE.Group(); // 이동 방향으로 기울임
  racketGroup.add(racketPivot);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.32, metalness: 0.15 });
  {
    const rx = 0.16;
    const ry = 0.205;
    const head = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 10, 56), frameMat);
    head.scale.set(rx, ry, rx);
    head.castShadow = true;
    racketPivot.add(head);
    const pts: number[] = [];
    for (let u = -rx + 0.03; u < rx - 0.01; u += 0.03) {
      const h = ry * Math.sqrt(1 - (u / rx) ** 2);
      pts.push(u, -h, 0, u, h, 0);
    }
    for (let v = -ry + 0.03; v < ry - 0.01; v += 0.03) {
      const w = rx * Math.sqrt(1 - (v / ry) ** 2);
      pts.push(-w, v, 0, w, v, 0);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    racketPivot.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 })));
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.3, 8), frameMat);
    shaft.position.y = -ry - 0.15 + 0.03;
    shaft.castShadow = true;
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.2, 10), new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 }));
    grip.position.y = -ry - 0.3 - 0.07;
    grip.castShadow = true;
    const throat = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.07, 3).rotateX(Math.PI), frameMat);
    throat.position.y = -ry - 0.005;
    throat.scale.z = 0.4;
    racketPivot.add(shaft, grip, throat);
  }
  racketPivot.rotation.y = -0.45; // 3D 형태가 읽히도록 살짝 요(yaw)
  racketGroup.position.set(-3, 1.2, 0);
  scene.add(racketGroup);

  let shake = 0;
  let tilt = 0;
  let racketPop = 0;
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  function setTheme(t: Theme) {
    const c = THEMES[t];
    background.setHex(c.bg);
    courtMat.color.setHex(c.court);
    lineMat.color.setHex(c.line);
    netMat.color.setHex(c.net);
    groundMat.opacity = c.shadow;
    hemi.intensity = c.hemi;
    sun.intensity = c.dir;
    trailMat.uniforms.uColor.value.setHex(c.accent);
    pMat.uniforms.uColor.value.setHex(c.accent);
    for (const z of zones) {
      z.mat.color.setHex(c.accent);
      z.edgeMat.color.setHex(c.accent);
    }
    frameMat.color.setHex(c.accent);
  }

  function resize(w: number, h: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.fov = Math.max(40, (2 * Math.atan(WORLD_HALF_W / aspect / CAM_DIST) * 180) / Math.PI);
    camera.updateProjectionMatrix();
    pMat.uniforms.uScale.value = (height * renderer.getPixelRatio()) / (2 * Math.tan((camera.fov * Math.PI) / 360));
  }

  function render(v: RenderView) {
    // 셔틀
    shuttleGroup.position.set(v.shuttle.x, v.shuttle.y, 0);
    shuttleGroup.rotation.z = v.shuttle.ang;
    shuttleRoll.rotation.x = v.shuttle.spin;
    updateTrail(v.shuttle.x, v.shuttle.y, v.shuttle.speed);
    updateParticles(v.dt);
    // 라켓
    racketGroup.visible = v.racket.visible;
    racketGroup.position.set(v.racket.x, v.racket.y, 0);
    const target = Math.max(-0.9, Math.min(0.9, -v.racket.vx * 0.05));
    tilt += (target - tilt) * (1 - Math.exp(-v.dt * 14));
    racketPivot.rotation.z = tilt + 0.25;
    racketPop = Math.max(0, racketPop - v.dt * 6);
    racketGroup.scale.setScalar(1 + racketPop * 0.25);
    // 영역
    for (const z of zones) {
      z.pulse = Math.max(0, z.pulse - v.dt * 1.8);
      z.mat.opacity = 0.14 + 0.05 * Math.sin(v.time * 2 + z.cx) + z.pulse * 0.5;
      z.mesh.scale.setScalar(1 + z.pulse * 0.14);
    }
    // 카메라 흔들림
    shake *= Math.exp(-v.dt * 11);
    camera.position.set(camBase.x + (Math.random() - 0.5) * shake, camBase.y + (Math.random() - 0.5) * shake, camBase.z);
    camera.lookAt(camLook);
    renderer.render(scene, camera);
  }

  function screenToWorld(px: number, py: number) {
    ndc.set((px / width) * 2 - 1, -(py / height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(plane, hit) ? { x: hit.x, y: hit.y } : null;
  }

  function worldToScreen(x: number, y: number) {
    tmp.set(x, y, 0).project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
  }

  function dispose() {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) mat.dispose();
    });
    sun.shadow.map?.dispose();
    renderer.dispose();
  }

  setTheme(theme);
  return {
    render,
    burst,
    shake: (a) => {
      shake = Math.min(0.14, a);
    },
    pulseZone: (id) => {
      const z = zones.find((q) => q.id === id);
      if (z) z.pulse = 1;
    },
    popRacket: () => {
      racketPop = 1;
    },
    screenToWorld,
    worldToScreen,
    resize,
    setTheme,
    dispose,
  };
}
