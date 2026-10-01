/* =====================================================================
   LAMBDA · hero 3D della singola sede
   L'Italia di notte; la camera scende sulla città della sede,
   il filo di luce la collega alla Rete Lambda e alle altre sedi.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ITA, SIC, SAR, SEDI } from './italia-data.js?v=3';

// tema: Lambda di default, oppure window.SEDI_THEME (es. Concorsi Militari Academy)
const P = { bg: '#050d12', hemi: '#4f8da6', moon: '#a9d2e2', land: '#10303d', landE: '#071c25', acc: '#3fc8d1', dim: '#2b8a99', warm: '#ffd66b', core: '#ffe6a3', bld: '#1d5065', roof: '#0e2a36', pulse: '#fff2c8', ...((window.SEDI_THEME || {}).p || {}) };
const L = window.Lambda, host = document.getElementById('sHero'), canvas = document.getElementById('sCanvas'), labelEl = document.getElementById('sLabel');
const key = document.body.dataset.sede;
const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
if (!canvas || L.reduced || !webglOK()) document.body.classList.add('nogl');
else init();

function init() {
  const mob = innerWidth < 860;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(); const BG = new THREE.Color(P.bg); scene.background = BG; scene.fog = new THREE.FogExp2(BG, 0.03);
  const camera = new THREE.PerspectiveCamera(mob ? 52 : 40, 1, 0.05, 200);
  scene.add(new THREE.HemisphereLight(P.hemi, P.bg, 0.9));
  const moon = new THREE.DirectionalLight(P.moon, 1.1); moon.position.set(-6, 10, 6); scene.add(moon);

  const radial = (stops) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); };
  const glowTex = radial([[0, 'rgba(255,255,255,1)'], [0.22, 'rgba(255,255,255,.6)'], [1, 'rgba(255,255,255,0)']]);
  const dotTex = radial([[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,.9)'], [0.6, 'rgba(255,255,255,0)']]);
  const sprite = (color, s, op = 1) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); m.scale.setScalar(s); return m; };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o });
  const box = (w, h, d, mat, r = 0.01) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, r), mat);

  /* ---------- Italia ---------- */
  const POLYS = [ITA, SIC, SAR], X = (lon) => (lon - 12.5) * 0.74, Zc = (lat) => -(lat - 42), TOP = 0.15;
  const landMat = std(P.land, { roughness: 0.85, metalness: 0.1, emissive: P.landE, emissiveIntensity: 1 });
  POLYS.forEach((poly) => {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(poly.map(([lo, la]) => new THREE.Vector2(X(lo), la - 42))), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 2, curveSegments: 1 });
    g.rotateX(-Math.PI / 2); scene.add(new THREE.Mesh(g, landMat));
    const pts = poly.map(([lo, la]) => new THREE.Vector3(X(lo), TOP + 0.006, Zc(la))); pts.push(pts[0].clone());
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: P.acc, transparent: true, opacity: 0.6 })));
  });
  const inPoly = (lo, la, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > la) !== (yj > la) && lo < ((xj - xi) * (la - yi)) / (yj - yi) + xi) c = !c; } return c; };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const STEP = mob ? 0.15 : 0.11, dim = [], win = [];
  for (let la = 36.6; la <= 47.2; la += STEP) for (let lo = 6.5; lo <= 18.6; lo += STEP / 0.74) if (POLYS.some((p) => inPoly(lo, la, p))) (rnd() < 0.12 ? win : dim).push(X(lo), TOP + 0.01, Zc(la));
  const pts = (arr, size, color, op) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const m = new THREE.PointsMaterial({ size, map: dotTex, color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }); scene.add(new THREE.Points(g, m)); return m; };
  pts(dim, 0.035, P.dim, 0.55); const winMat = pts(win, 0.075, P.warm, 0.9);

  /* ---------- Rete Lambda, sedi, fili ---------- */
  const C = new THREE.Vector3(0.15, 3.1, -0.3);
  const core = new THREE.Group(); core.position.copy(C); scene.add(core);
  const ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 1)), new THREE.LineBasicMaterial({ color: P.acc, transparent: true, opacity: 0.85 })); core.add(ico);
  core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 2), new THREE.MeshBasicMaterial({ color: P.core }))); core.add(sprite(P.acc, 2.6, 0.55)); core.add(sprite(P.warm, 1.1, 0.8));
  const arc = (T, lift) => { const m = C.clone().lerp(T, 0.5); m.y += lift; return new THREE.QuadraticBezierCurve3(C, m, T); };
  const lineOf = (cv, color, op) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(cv.getPoints(40)), new THREE.LineBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
  const bodyMat = std(P.bld, { roughness: 0.55 }), roofMat = std(P.roof), litMat = new THREE.MeshBasicMaterial({ color: P.warm });
  const beamMat = new THREE.MeshBasicMaterial({ color: P.acc, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  let here = null; const pulses = [];
  SEDI.forEach(([name, lo, la, soon]) => {
    const isHere = name.toLowerCase() === key, s = isHere ? 1.7 : 1;
    if (soon && !isHere) { const g = new THREE.Group(); g.position.set(X(lo), TOP, Zc(la)); const b = box(0.3, 0.24, 0.26, std(P.bld, { transparent: true, opacity: 0.4 }), 0.03); b.position.y = 0.12; g.add(b); scene.add(g); return; }
    const g = new THREE.Group(); g.position.set(X(lo), TOP, Zc(la)); g.scale.setScalar(s); scene.add(g);
    const b = box(0.3, 0.24, 0.26, bodyMat, 0.03); b.position.y = 0.12; g.add(b);
    const band = box(0.305, 0.05, 0.265, litMat, 0.01); band.position.y = 0.15; g.add(band);
    const roof = box(0.34, 0.03, 0.3, roofMat, 0.01); roof.position.y = 0.255; g.add(roof);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.1), litMat); door.position.set(0, 0.05, 0.131); g.add(door);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 8, 1, true), beamMat); beam.position.y = 0.92; g.add(beam);
    const top = g.position.clone().add(new THREE.Vector3(0, 1.6 * s, 0));
    const cv = arc(top, isHere ? 0.9 : 0.6); scene.add(lineOf(cv, isHere ? P.warm : P.acc, isHere ? 0.9 : 0.35));
    pulses.push({ cv, sp: isHere ? 0.32 : 0.22, of: rnd(), big: isHere });
    if (isHere) {
      here = g;
      const halo = sprite(P.warm, 0.9, 0.9); halo.position.set(0, 1.6, 0); g.add(halo);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.23, 64), new THREE.MeshBasicMaterial({ color: P.warm, transparent: true, opacity: 0.6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; g.add(ring); g.userData.ring = ring;
    } else { const sp = sprite(P.acc, 0.5, 0.7); sp.position.set(0, 1.6, 0); g.add(sp); }
  });
  // gli studenti da casa: qualche filo sottile verso le finestre
  for (let i = 0; i < win.length; i += 3 * (mob ? 10 : 6)) { const cv = arc(new THREE.Vector3(win[i], win[i + 1], win[i + 2]), 0.6 + rnd() * 0.6); scene.add(lineOf(cv, P.acc, 0.09)); if (i % 4 === 0) pulses.push({ cv, sp: 0.15 + rnd() * 0.15, of: rnd() }); }
  const pg = new THREE.BufferGeometry(), pp = new Float32Array(pulses.length * 3); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.12, map: dotTex, color: P.pulse, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* ---------- la camera scende sulla sede ---------- */
  const H = here ? here.position.clone() : new THREE.Vector3();
  const off = mob ? new THREE.Vector3(0, -1.6, 1.2) : new THREE.Vector3(-2.1, 0.2, 0);   // su desktop la sede sta a destra, il testo a sinistra
  const startPos = new THREE.Vector3(0, mob ? 22 : 15, mob ? 17 : 12.5), startLook = new THREE.Vector3(0, 0, 0.5);
  const endLook = H.clone().add(off), endDist = mob ? 7 : 5.6;
  const cam = { k: 0 }, pos = new THREE.Vector3(), look = new THREE.Vector3();
  gsap.to(cam, { k: 1, duration: L.reduced ? 0 : 3.4, delay: 0.3, ease: 'expo.inOut' });
  let mx = 0, my = 0; addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

  function resize() { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  resize(); addEventListener('resize', resize);
  const proj = new THREE.Vector3();
  L.onFrame((now) => {
    const r = host.getBoundingClientRect(); if (r.bottom < 0) return;
    const t = now / 1000, k = cam.k;
    // orbita lenta attorno alla sede, a fine discesa
    const ang = 0.55 + Math.sin(t * 0.12) * 0.25 + mx * 0.15;
    const endPos = endLook.clone().add(new THREE.Vector3(Math.sin(ang) * endDist, endDist * 0.62 - my * 0.3, Math.cos(ang) * endDist));
    pos.lerpVectors(startPos, endPos, k); look.lerpVectors(startLook, endLook, k);
    camera.position.copy(pos); camera.lookAt(look);
    ico.rotation.y = t * 0.25; ico.rotation.x = t * 0.12;
    winMat.opacity = 0.75 + Math.sin(t * 1.3) * 0.15;
    if (here) { const ring = here.userData.ring, f = (t * 0.5) % 1; ring.scale.setScalar(1 + f * 1.6); ring.material.opacity = 0.7 * (1 - f); }
    pulses.forEach((q, i) => { const v = q.cv.getPoint((t * q.sp + q.of) % 1); pp[i * 3] = v.x; pp[i * 3 + 1] = v.y; pp[i * 3 + 2] = v.z; }); pg.attributes.position.needsUpdate = true;
    // etichetta della sede
    if (labelEl && here) {
      proj.copy(H).add(new THREE.Vector3(0, 0.75, 0)).project(camera);
      labelEl.style.opacity = k > 0.6 ? Math.min(1, (k - 0.6) / 0.3) : 0;
      labelEl.style.transform = `translate(${(proj.x * 0.5 + 0.5) * host.clientWidth}px, ${(-proj.y * 0.5 + 0.5) * host.clientHeight}px) translate(-50%, -100%)`;
    }
    renderer.render(scene, camera);
  });
  document.body.classList.add('gl-ready');
}
