/* =====================================================================
   La cartina 3D delle sedi, in formato "riquadro" (home Lambda)
   Stessa Italia di notte della pagina Sedi: la Rete Lambda al centro, le finestre accese
   degli studenti collegati, gli impulsi di luce, le sedi con il loro faro (quelle in apertura
   traslucide). Ruota piano e segue il mouse; le etichette portano alla pagina di ogni sede.
   Uso: <div data-map3d><canvas></canvas><div class="mlabels"></div></div>
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ITA, SIC, SAR, SEDI } from './italia-data.js?v=3';

const host = document.querySelector('[data-map3d]');
const L = window.Lambda || { reduced: false };
const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
if (host && webglOK()) init(); else host?.classList.add('nogl');

function init() {
  const canvas = host.querySelector('canvas'), labelsEl = host.querySelector('.mlabels');
  const P = { bg: '#0E212E', land: '#10303d', landE: '#071c25', acc: '#3fc8d1', dim: '#2b8a99', warm: '#ffd66b', core: '#ffe6a3', bld: '#1d5065', roof: '#0e2a36', pulse: '#fff2c8', net: 'Rete Lambda', ...(window.MAP3D_THEME || {}) };
  const mob = innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(P.bg, 0.035);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight('#4f8da6', P.bg, 0.9));
  const moon = new THREE.DirectionalLight('#a9d2e2', 1.1); moon.position.set(-6, 10, 6); scene.add(moon);

  const radial = (stops) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); };
  const glowTex = radial([[0, 'rgba(255,255,255,1)'], [0.22, 'rgba(255,255,255,.6)'], [1, 'rgba(255,255,255,0)']]);
  const dotTex = radial([[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,.9)'], [0.6, 'rgba(255,255,255,0)']]);
  const sprite = (color, s, op = 1) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); m.scale.setScalar(s); return m; };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o });
  const box = (w, h, d, mat, r = 0.01) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), mat);

  /* ---------- l'Italia ---------- */
  const POLYS = [ITA, SIC, SAR], X = (lon) => (lon - 12.5) * 0.74, Zc = (lat) => -(lat - 42), TOP = 0.15;
  const world = new THREE.Group(); scene.add(world);
  const landMat = std(P.land, { roughness: 0.85, metalness: 0.1, emissive: P.landE, emissiveIntensity: 1 });
  POLYS.forEach((poly) => {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(poly.map(([lo, la]) => new THREE.Vector2(X(lo), la - 42))), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 2, curveSegments: 1 });
    g.rotateX(-Math.PI / 2); world.add(new THREE.Mesh(g, landMat));
    const pts = poly.map(([lo, la]) => new THREE.Vector3(X(lo), TOP + 0.006, Zc(la))); pts.push(pts[0].clone());
    world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: P.acc, transparent: true, opacity: 0.6 })));
  });
  const sea = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshBasicMaterial({ map: radial([[0, 'rgba(24,78,97,.5)'], [0.55, 'rgba(14,33,46,.2)'], [1, 'rgba(14,33,46,0)']]), transparent: true, depthWrite: false }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -0.05; world.add(sea);

  // griglia di punti e finestre accese (gli studenti collegati)
  const inPoly = (lo, la, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > la) !== (yj > la) && lo < ((xj - xi) * (la - yi)) / (yj - yi) + xi) c = !c; } return c; };
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const STEP = mob ? 0.17 : 0.12, grid = [];
  for (let la = 36.6; la <= 47.2; la += STEP) for (let lo = 6.5; lo <= 18.6; lo += STEP / 0.74) if (POLYS.some((p) => inPoly(lo, la, p))) grid.push(new THREE.Vector3(X(lo), TOP + 0.01, Zc(la)));
  const winIdx = new Set(); while (winIdx.size < Math.min(mob ? 140 : 240, grid.length * 0.14)) winIdx.add(Math.floor(rnd() * grid.length));
  const dimPos = [], winPos = []; grid.forEach((v, i) => (winIdx.has(i) ? winPos : dimPos).push(v.x, v.y, v.z));
  const dimG = new THREE.BufferGeometry(); dimG.setAttribute('position', new THREE.Float32BufferAttribute(dimPos, 3));
  world.add(new THREE.Points(dimG, new THREE.PointsMaterial({ size: 0.035, map: dotTex, color: P.dim, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })));
  const winG = new THREE.BufferGeometry(); winG.setAttribute('position', new THREE.Float32BufferAttribute(winPos, 3));
  const winCol = new Float32Array(winPos.length); winG.setAttribute('color', new THREE.BufferAttribute(winCol, 3));
  const winPh = [...Array(winPos.length / 3)].map(() => [rnd() * 6.28, 0.6 + rnd() * 1.6]);
  world.add(new THREE.Points(winG, new THREE.PointsMaterial({ size: 0.075, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  const WARM = new THREE.Color(P.warm);

  /* ---------- la rete: nucleo, fili e impulsi ---------- */
  const C = new THREE.Vector3(0.15, 3.1, -0.3);
  const core = new THREE.Group(); core.position.copy(C); world.add(core);
  const ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 1)), new THREE.LineBasicMaterial({ color: P.acc, transparent: true, opacity: 0.85 })); core.add(ico);
  core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 2), new THREE.MeshBasicMaterial({ color: P.core })));
  core.add(sprite(P.acc, 2.6, 0.55)); core.add(sprite(P.warm, 1.1, 0.8));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.006, 6, 96), new THREE.MeshBasicMaterial({ color: P.warm, transparent: true, opacity: 0.6 })); ring.rotation.x = Math.PI / 2.4; core.add(ring);
  const arc = (T, lift = 1.0) => { const m = C.clone().lerp(T, 0.5); m.y += lift; return new THREE.QuadraticBezierCurve3(C, m, T); };
  const lines = (curves, color, op) => { const pos = []; curves.forEach((cv) => { const p = cv.getPoints(28); for (let i = 0; i < p.length - 1; i++) pos.push(p[i].x, p[i].y, p[i].z, p[i + 1].x, p[i + 1].y, p[i + 1].z); }); const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); };
  const winVec = []; for (let i = 0; i < winPos.length; i += 3) winVec.push(new THREE.Vector3(winPos[i], winPos[i + 1], winPos[i + 2]));
  const thin = winVec.filter((_, i) => i % (mob ? 4 : 3) === 0).map((v) => arc(v, 0.7 + rnd() * 0.8));
  world.add(lines(thin, P.acc, 0.1));
  const pulses = thin.filter((_, i) => i % 2 === 0).map((cv) => ({ cv, sp: 0.12 + rnd() * 0.18, of: rnd() }));
  const pulseG = new THREE.BufferGeometry(), pulsePos = new Float32Array(pulses.length * 3); pulseG.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  world.add(new THREE.Points(pulseG, new THREE.PointsMaterial({ size: 0.09, map: dotTex, color: P.core, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* ---------- le sedi ---------- */
  const bodyMat = std(P.bld, { roughness: 0.55 }), roofMat = std(P.roof), litMat = new THREE.MeshBasicMaterial({ color: P.warm });
  const beamMat = new THREE.MeshBasicMaterial({ color: P.acc, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  const soonBody = std(P.bld, { transparent: true, opacity: 0.4 }), soonBand = new THREE.MeshBasicMaterial({ color: P.warm, transparent: true, opacity: 0.3 });
  const sedi = SEDI.map(([name, lo, la, soon]) => {
    const g = new THREE.Group(); g.position.set(X(lo), TOP, Zc(la));
    const b = box(0.3, 0.24, 0.26, soon ? soonBody : bodyMat, 0.03); b.position.y = 0.12; g.add(b);
    const band = box(0.305, 0.05, 0.265, soon ? soonBand : litMat, 0.01); band.position.y = 0.15; g.add(band);
    const roof = box(0.34, 0.03, 0.3, roofMat, 0.01); roof.position.y = 0.255; g.add(roof);
    let beam = null; if (!soon) { beam = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 8, 1, true), beamMat.clone()); beam.position.y = 0.92; g.add(beam); g.add(Object.assign(sprite(P.acc, 0.5, 0.7), {}).translateY(1.6)); }
    const halo = sprite(P.warm, 0.9, 0); halo.position.y = 0.45; g.add(halo);
    world.add(g);
    return { name, key: name.toLowerCase(), soon: !!soon, g, halo, beam, curve: arc(g.position.clone().add(new THREE.Vector3(0, 1.6, 0)), 0.6) };
  });
  world.add(lines(sedi.filter((s) => !s.soon).map((s) => s.curve), P.acc, 0.5));
  const main = sedi.filter((s) => !s.soon).map((s, i) => ({ cv: s.curve, of: i * 0.25, sp: 0.3 }));
  const mpG = new THREE.BufferGeometry(), mpPos = new Float32Array(main.length * 3); mpG.setAttribute('position', new THREE.BufferAttribute(mpPos, 3));
  world.add(new THREE.Points(mpG, new THREE.PointsMaterial({ size: 0.16, map: dotTex, color: P.pulse, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* ---------- etichette (link alle pagine delle sedi) ---------- */
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const page = (k) => (window.SEDE_LINKS ? window.SEDE_LINKS(k).page : `sede.html?c=${k}`);
  const labels = [...sedi.map((s) => ({ s, pos: s.g.position.clone().add(V(s.key === 'lecco' ? 0.25 : s.key === 'monza' ? -0.25 : 0, s.key === 'lecco' ? 0.78 : 0.42, 0)) })), { core: true, pos: C.clone().add(V(0, 0.85, 0)) }]
    .map((l) => {
      const el = document.createElement(l.core ? 'div' : 'a');
      el.className = 'ml' + (l.core ? ' core' : '') + (l.s?.soon ? ' soon' : '');
      el.textContent = l.core ? P.net : l.s.soon ? `${l.s.name} · nov` : l.s.name;
      if (!l.core) { el.href = page(l.s.key); el.setAttribute('aria-label', l.s.soon ? `Sede di ${l.s.name}, in apertura a novembre` : `Scopri la sede di ${l.s.name}`);
        el.addEventListener('pointerenter', () => { hot = l.s; }); el.addEventListener('pointerleave', () => { if (hot === l.s) hot = null; }); el.addEventListener('focus', () => { hot = l.s; }); el.addEventListener('blur', () => { hot = null; }); }
      labelsEl.appendChild(el); return { ...l, el };
    });
  let hot = null;

  /* ---------- camera: entra dall'alto quando la sezione arriva, poi ruota piano ---------- */
  let W = 1, H = 1;
  const resize = () => { const r = host.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);
  const look = V(0.25, 0.2, 0.75), cam = { r: 15.5, h: 10.5, a: -0.2, k: 0 };
  let visible = false, entered = false, mx = 0, my = 0, tmx = 0, tmy = 0;
  host.addEventListener('pointermove', (e) => { const r = host.getBoundingClientRect(); tmx = (e.clientX - r.left) / r.width - 0.5; tmy = (e.clientY - r.top) / r.height - 0.5; });
  host.addEventListener('pointerleave', () => { tmx = 0; tmy = 0; });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !entered) { entered = true; if (window.gsap && !L.reduced) gsap.fromTo(cam, { k: 0 }, { k: 1, duration: 2.4, ease: 'expo.out' }); else cam.k = 1; }
  }, { threshold: 0.15 }).observe(host);
  const proj = new THREE.Vector3(), clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop); if (!visible) return;
    const t = clock.getElapsedTime();
    mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
    const a = cam.a + (L.reduced ? 0 : Math.sin(t * 0.12) * 0.35) + mx * 0.5, r = 22 - (22 - cam.r) * cam.k, h = 18 - (18 - cam.h) * cam.k + my * 1.2;
    camera.position.set(look.x + Math.sin(a) * r * 0.55, h, look.z + Math.cos(a) * r * 0.75); camera.lookAt(look);
    ico.rotation.y = t * 0.25; ico.rotation.x = t * 0.12; ring.rotation.z = t * 0.4;
    for (let i = 0; i < winPh.length; i++) { const [ph, f] = winPh[i], k = 0.55 + 0.45 * Math.sin(t * f + ph); winCol[i * 3] = WARM.r * k; winCol[i * 3 + 1] = WARM.g * k; winCol[i * 3 + 2] = WARM.b * k; }
    winG.attributes.color.needsUpdate = true;
    pulses.forEach((q, i) => { const v = q.cv.getPoint((t * q.sp + q.of) % 1); pulsePos.set([v.x, v.y, v.z], i * 3); }); pulseG.attributes.position.needsUpdate = true;
    main.forEach((q, i) => { const v = q.cv.getPoint((t * q.sp + q.of) % 1); mpPos.set([v.x, v.y, v.z], i * 3); }); mpG.attributes.position.needsUpdate = true;
    sedi.forEach((s) => { const on = s === hot; s.halo.material.opacity += ((on ? 0.85 + Math.sin(t * 4) * 0.15 : 0) - s.halo.material.opacity) * 0.15; if (s.beam) s.beam.material.opacity = on ? 0.75 : 0.35; });
    labels.forEach((l) => {
      proj.copy(l.pos).project(camera);
      const ok = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
      l.el.style.opacity = ok ? (cam.k > 0.6 ? 1 : 0) : 0;
      l.el.style.transform = `translate(${(proj.x * 0.5 + 0.5) * W}px, ${(-proj.y * 0.5 + 0.5) * H}px) translate(-50%, -100%)`;
      l.el.classList.toggle('hot', l.s && l.s === hot);
    });
    renderer.render(scene, camera);
  })();
  host.classList.add('ready');
}
