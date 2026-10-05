/* =====================================================================
   LAMBDA · Sedi immersive in 3D (Three.js)
   Un unico viaggio guidato dallo scroll:
   Italia di notte → la Rete Lambda → scegli "Da casa" o "In sede"
   → si entra (finestra di casa / porta della sede) → 4 tappe
   → si torna sull'Italia: stesso percorso, cambia solo da dove ti colleghi.
   Tutto è costruito in codice: nessun modello esterno da scaricare.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ITA, SIC, SAR, SEDI } from './italia-data.js?v=3';
import { buildSedeInterior } from './sede-interior.js?v=4';
import { buildMessina } from './sede-messina.js?v=6';
import { buildMonza } from './sede-monza.js?v=3';
import { buildLecco } from './sede-lecco.js?v=2';
import { buildCagliari } from './sede-cagliari.js?v=4';

// tema: Lambda di default; una pagina può impostare window.SEDI_THEME prima di caricare questo modulo
const LAMBDA_P = { bg: '#050d12', hemi: '#4f8da6', moon: '#a9d2e2', land: '#10303d', landE: '#071c25', acc: '#3fc8d1', dim: '#2b8a99', warm: '#ffd66b', win: '#ffd66b', core: '#ffe6a3', bld: '#1d5065', roof: '#0e2a36', pulse: '#fff2c8', scr1: '#123747', scr2: '#0a1c26',
  sea: [[0, 'rgba(24,78,97,.55)'], [0.5, 'rgba(14,33,46,.25)'], [1, 'rgba(5,13,18,0)']], flashCasa: 'radial-gradient(circle at 50% 50%, #fff6d8, #ffd66b)' };
const TH = window.SEDI_THEME || {};
const P = { ...LAMBDA_P, ...(TH.p || {}) };
const T = { net: 'Rete Lambda', brand: 'Lambda', btn: 'btn-stud', test: 'test.html', page: (k) => window.SEDE_LINKS(k).page, ...TH };
const L = window.Lambda;
const $ = (s) => document.querySelector(s);
const sec = $('#journey'), stage = $('#jStage'), canvas = $('#jCanvas');
const flash = $('#jFlash'), swapV = $('#jSwap'), labelsEl = $('#jLabels'), barEl = $('.jbar i');
const caps = [...document.querySelectorAll('#jCaps .cap')];
const toggles = [...document.querySelectorAll('[data-setpath]')];

const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
if (L.reduced || !webglOK()) document.body.classList.add('nogl');
else init();

function init() {
  const mob = innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const BG = new THREE.Color(P.bg);
  scene.background = BG;
  scene.fog = new THREE.FogExp2(BG, 0.026);
  const camera = new THREE.PerspectiveCamera(mob ? 56 : 42, 1, 0.02, 300);

  scene.add(new THREE.HemisphereLight(P.hemi, P.bg, 0.9));
  const moon = new THREE.DirectionalLight(P.moon, 1.1); moon.position.set(-6, 10, 6); scene.add(moon);

  /* ---------------- utilità grafiche ---------------- */
  const radial = (stops) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(([o, col]) => g.addColorStop(o, col)); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); };
  const glowTex = radial([[0, 'rgba(255,255,255,1)'], [0.22, 'rgba(255,255,255,.6)'], [1, 'rgba(255,255,255,0)']]);
  const dotTex = radial([[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,.9)'], [0.6, 'rgba(255,255,255,0)']]);
  const sprite = (color, s, op = 1) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); m.scale.setScalar(s); return m; };
  const at3 = (o, x, y, z) => { o.position.set(x, y, z); return o; };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o });
  const box = (w, h, d, mat, r = 0.01) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), mat);
  const ctex = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return { c, x: c.getContext('2d'), t, w, h }; };
  const FONT = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';

  /* =====================================================================
     1 · L'ITALIA DI NOTTE
     ===================================================================== */
  const POLYS = [ITA, SIC, SAR];
  const X = (lon) => (lon - 12.5) * 0.74, Zc = (lat) => -(lat - 42);
  const TOP = 0.15;
  const world = new THREE.Group(); scene.add(world);

  const landMat = std(P.land, { roughness: 0.85, metalness: 0.1, emissive: P.landE, emissiveIntensity: 1 });
  POLYS.forEach((poly) => {
    const sh = new THREE.Shape(poly.map(([lo, la]) => new THREE.Vector2(X(lo), la - 42)));
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 2, curveSegments: 1 });
    g.rotateX(-Math.PI / 2);
    world.add(new THREE.Mesh(g, landMat));
    const pts = poly.map(([lo, la]) => new THREE.Vector3(X(lo), TOP + 0.006, Zc(la))); pts.push(pts[0].clone());
    world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: P.acc, transparent: true, opacity: 0.6 })));
  });
  // mare: un velo che sfuma sotto la penisola
  const sea = new THREE.Mesh(new THREE.CircleGeometry(16, 64), new THREE.MeshBasicMaterial({ map: radial(P.sea), transparent: true, depthWrite: false }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -0.05; world.add(sea);

  // griglia di punti dentro l'Italia + le "finestre accese" (gli studenti collegati)
  const inPoly = (lo, la, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > la) !== (yj > la) && lo < ((xj - xi) * (la - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const inItaly = (lo, la) => POLYS.some((p) => inPoly(lo, la, p));
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const STEP = mob ? 0.15 : 0.11, grid = [];
  for (let la = 36.6; la <= 47.2; la += STEP) for (let lo = 6.5; lo <= 18.6; lo += STEP / 0.74) if (inItaly(lo, la)) grid.push(new THREE.Vector3(X(lo), TOP + 0.01, Zc(la)));
  const winIdx = new Set(); while (winIdx.size < Math.min(mob ? 160 : 280, grid.length * 0.14)) winIdx.add(Math.floor(rnd() * grid.length));
  const dimPos = [], winPos = [];
  grid.forEach((v, i) => (winIdx.has(i) ? winPos : dimPos).push(v.x, v.y, v.z));
  const dimG = new THREE.BufferGeometry(); dimG.setAttribute('position', new THREE.Float32BufferAttribute(dimPos, 3));
  world.add(new THREE.Points(dimG, new THREE.PointsMaterial({ size: 0.035, map: dotTex, color: P.dim, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })));
  const winG = new THREE.BufferGeometry(); winG.setAttribute('position', new THREE.Float32BufferAttribute(winPos, 3));
  const winCol = new Float32Array(winPos.length); winG.setAttribute('color', new THREE.BufferAttribute(winCol, 3));
  const winPh = [...Array(winPos.length / 3)].map(() => [rnd() * 6.28, 0.6 + rnd() * 1.6]);
  world.add(new THREE.Points(winG, new THREE.PointsMaterial({ size: 0.075, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  const WARM = new THREE.Color(P.win);

  /* ---------------- la Rete Lambda: il nucleo e i fili di luce ---------------- */
  const C = new THREE.Vector3(0.15, 3.1, -0.3);
  const core = new THREE.Group(); core.position.copy(C); world.add(core);
  const ico = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 1)), new THREE.LineBasicMaterial({ color: P.acc, transparent: true, opacity: 0.85 }));
  core.add(ico);
  core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 2), new THREE.MeshBasicMaterial({ color: P.core })));
  core.add(sprite(P.acc, 2.6, 0.55)); core.add(sprite(P.warm, 1.1, 0.8));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.006, 6, 96), new THREE.MeshBasicMaterial({ color: P.warm, transparent: true, opacity: 0.6 }));
  ring.rotation.x = Math.PI / 2.4; core.add(ring);

  const arc = (T, lift = 1.0) => { const m = C.clone().lerp(T, 0.5); m.y += lift; return new THREE.QuadraticBezierCurve3(C, m, T); };
  const lines = (curves, color, op) => {
    const pos = [];
    curves.forEach((cv) => { const p = cv.getPoints(28); for (let i = 0; i < p.length - 1; i++) pos.push(p[i].x, p[i].y, p[i].z, p[i + 1].x, p[i + 1].y, p[i + 1].z); });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
  };
  const winVec = []; for (let i = 0; i < winPos.length; i += 3) winVec.push(new THREE.Vector3(winPos[i], winPos[i + 1], winPos[i + 2]));
  const thinCurves = winVec.filter((_, i) => i % (mob ? 4 : 3) === 0).map((v) => arc(v, 0.7 + rnd() * 0.8));
  world.add(lines(thinCurves, P.acc, 0.1));
  // impulsi che viaggiano dal nucleo alle case
  const pulses = thinCurves.filter((_, i) => i % 2 === 0).map((cv) => ({ cv, sp: 0.12 + rnd() * 0.18, of: rnd() }));
  const pulseG = new THREE.BufferGeometry(); const pulsePos = new Float32Array(pulses.length * 3); pulseG.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  world.add(new THREE.Points(pulseG, new THREE.PointsMaterial({ size: 0.09, map: dotTex, color: P.core, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* ---------------- le sedi: piccoli edifici con un faro di luce ---------------- */
  const bodyMat = std(P.bld, { roughness: 0.55 }), roofMat = std(P.roof), litMat = new THREE.MeshBasicMaterial({ color: P.warm });
  const beamMat = new THREE.MeshBasicMaterial({ color: P.acc, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  // le sedi in apertura: edificio traslucido, senza faro (ancora "in costruzione")
  const soonBody = std(P.bld, { transparent: true, opacity: 0.4 }), soonBand = new THREE.MeshBasicMaterial({ color: P.warm, transparent: true, opacity: 0.3 });
  const sedi = SEDI.map(([name, lo, la, soon]) => {
    const g = new THREE.Group(); g.position.set(X(lo), TOP, Zc(la));
    const b = box(0.3, 0.24, 0.26, soon ? soonBody : bodyMat, 0.03); b.position.y = 0.12; g.add(b);
    const band = box(0.305, 0.05, 0.265, soon ? soonBand : litMat, 0.01); band.position.y = 0.15; g.add(band);
    const roof = box(0.34, 0.03, 0.3, roofMat, 0.01); roof.position.y = 0.255; g.add(roof);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.1), litMat); door.position.set(0, 0.05, 0.131); g.add(door);
    if (!soon) { const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 8, 1, true), beamMat); beam.position.y = 0.27 + 0.65; g.add(beam); g.add(at3(sprite(P.acc, 0.5, 0.7), 0, 1.6, 0)); }
    world.add(g);
    const T = g.position.clone().add(new THREE.Vector3(0, 1.6, 0));
    return { name, key: name.toLowerCase(), soon: !!soon, g, top: T, door: g.position.clone().add(new THREE.Vector3(0, 0.05, 0.131)), curve: arc(T, 0.6) };
  });
  // la sede scelta da chi guarda (all'inizio nessuna: si entra in quella che sceglie)
  let SEDE = sedi[0], sedeKey = null;
  const chosenHalo = sprite(P.warm, 0.9, 0); world.add(chosenHalo);
  const sedeLines = lines(sedi.filter((s) => !s.soon).map((s) => s.curve), P.acc, 0.5); world.add(sedeLines);

  /* ---------------- la casa: una finestra accesa tra tante ---------------- */
  const house = new THREE.Group(); house.position.set(X(11.95), TOP, Zc(43.2)); world.add(house);
  const hb = box(0.2, 0.15, 0.17, std('#2c4350', { roughness: 0.8 }), 0.015); hb.position.y = 0.075; house.add(hb);
  const roofH = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.11, 4), std('#18303c')); roofH.rotation.y = Math.PI / 4; roofH.position.y = 0.205; roofH.scale.z = 0.85; house.add(roofH);
  const hwin = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.05), new THREE.MeshBasicMaterial({ color: P.warm })); hwin.position.set(0.03, 0.08, 0.0855); house.add(hwin);
  house.add(at3(sprite(P.warm, 0.35, 0.9), 0.03, 0.08, 0.1));
  const HWIN = house.position.clone().add(new THREE.Vector3(0.03, 0.08, 0.0855));
  const houseCurve = arc(house.position.clone().add(new THREE.Vector3(0, 0.25, 0)), 0.5);
  const houseLine = lines([houseCurve], P.warm, 0.7); world.add(houseLine);
  const mainPulses = [{ cv: houseCurve, of: 0, sp: 0.35, warm: true }, ...sedi.filter((s) => !s.soon).map((s, i) => ({ cv: s.curve, of: i * 0.25, sp: 0.3 }))];
  const mpG = new THREE.BufferGeometry(); const mpPos = new Float32Array(mainPulses.length * 3); mpG.setAttribute('position', new THREE.BufferAttribute(mpPos, 3));
  world.add(new THREE.Points(mpG, new THREE.PointsMaterial({ size: 0.16, map: dotTex, color: P.pulse, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* =====================================================================
     2 · I DISEGNI SUGLI SCHERMI (canvas → texture)
     ===================================================================== */
  const bgNavy = (S) => { const g = S.x.createLinearGradient(0, 0, S.w, S.h); g.addColorStop(0, P.scr1); g.addColorStop(1, P.scr2); S.x.fillStyle = g; S.x.fillRect(0, 0, S.w, S.h); };
  const txt = (S, t, x, y, size, color, w = 700, font = FONT, align = 'left') => { S.x.font = `${w} ${size}px ${font}`; S.x.fillStyle = color; S.x.textAlign = align; S.x.fillText(t, x, y); };
  const rr = (S, x, y, w, h, r, fill, stroke) => { S.x.beginPath(); S.x.roundRect(x, y, w, h, r); if (fill) { S.x.fillStyle = fill; S.x.fill(); } if (stroke) { S.x.strokeStyle = stroke; S.x.lineWidth = 2; S.x.stroke(); } };
  const avatar = (S, cx, cy, s, col) => { S.x.fillStyle = col; S.x.beginPath(); S.x.arc(cx, cy - s * 0.32, s * 0.26, 0, 7); S.x.fill(); S.x.beginPath(); S.x.ellipse(cx, cy + s * 0.5, s * 0.52, s * 0.42, 0, Math.PI, 0); S.x.fill(); };
  // le 7 aree del Performance Test, scala da -100 a +100 (esempio)
  const AREAS = [['Organizzazione', -33], ['Elaborazione', -50], ['Strategie', -83], ['Metacognizione', 0], ['Autovalutazione', 50], ['Ansia', -100, 1], ['Resilienza', 75, 1]];
  const radarDraw = (S, cx, cy, R, labels = true) => {
    const n = AREAS.length, pt = (i, v) => { const k = (v + 100) / 200, a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + R * k * Math.cos(a), cy + R * k * Math.sin(a)]; };
    S.x.lineWidth = 2;
    [-50, 0, 50, 100].forEach((k) => { S.x.strokeStyle = k === 0 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.14)'; S.x.setLineDash(k === 0 ? [6, 6] : []); S.x.beginPath(); AREAS.forEach((_, i) => { const [x, y] = pt(i, k); i ? S.x.lineTo(x, y) : S.x.moveTo(x, y); }); S.x.closePath(); S.x.stroke(); });
    S.x.setLineDash([]);
    S.x.beginPath(); AREAS.forEach(([, v], i) => { const [x, y] = pt(i, v); i ? S.x.lineTo(x, y) : S.x.moveTo(x, y); }); S.x.closePath();
    S.x.fillStyle = 'rgba(255,214,107,.28)'; S.x.fill(); S.x.strokeStyle = P.warm; S.x.lineWidth = 4; S.x.stroke();
    AREAS.forEach(([, v, emo], i) => { const [x, y] = pt(i, v); S.x.fillStyle = emo ? '#b48ad6' : P.warm; S.x.beginPath(); S.x.arc(x, y, labels ? 8 : 5, 0, 7); S.x.fill(); });
    if (labels) AREAS.forEach(([nm, v, emo], i) => { const [x, y] = pt(i, 128); txt(S, nm, x, y, 17, emo ? '#c3a6e0' : 'rgba(255,255,255,.8)', 500, FONT, 'center'); txt(S, (v > 0 ? '+' : '') + v, x, y + 22, 18, emo ? '#c3a6e0' : P.warm, 700, FONT, 'center'); });
  };
  const screen = ctex(1024, 640);
  const SCR = {
    test(S) { bgNavy(S); txt(S, 'LAMBDA PERFORMANCE TEST', 60, 78, 22, P.warm, 500, MONO); txt(S, 'Il profilo di Marco', 60, 136, 46, '#fff');
      rr(S, 60, 190, 330, 150, 22, 'rgba(255,255,255,.06)'); txt(S, 'PUNTO DI FORZA', 84, 232, 18, 'rgba(255,255,255,.55)', 500, MONO); txt(S, 'Resilienza', 84, 280, 34, '#fff'); txt(S, '+75', 84, 320, 28, '#c3a6e0');
      rr(S, 60, 360, 330, 150, 22, 'rgba(255,255,255,.06)'); txt(S, 'DA ALLENARE', 84, 402, 18, 'rgba(255,255,255,.55)', 500, MONO); txt(S, 'Strategie', 84, 450, 34, '#fff'); txt(S, '−83', 84, 490, 28, P.warm);
      radarDraw(S, 712, 360, 170); },
    call(S) { S.x.fillStyle = '#0a161d'; S.x.fillRect(0, 0, S.w, S.h); txt(S, 'CONSEGNA DEI RISULTATI · VIDEOCHIAMATA', 40, 56, 20, P.warm, 500, MONO);
      const g = S.x.createLinearGradient(0, 90, 0, 560); g.addColorStop(0, '#1f6f83'); g.addColorStop(1, '#0f3a48'); rr(S, 40, 84, 610, 470, 26, g); avatar(S, 345, 330, 230, 'rgba(229,239,242,.88)');
      rr(S, 60, 500, 230, 40, 12, 'rgba(0,0,0,.35)'); txt(S, 'Tutor Lambda', 78, 528, 22, '#fff');
      rr(S, 670, 84, 314, 210, 22, '#3a2f24'); avatar(S, 790, 205, 120, 'rgba(255,214,107,.85)'); avatar(S, 885, 215, 100, 'rgba(255,214,107,.6)'); txt(S, 'Voi, da casa', 688, 278, 20, '#fff', 500);
      rr(S, 670, 314, 314, 240, 22, 'rgba(255,255,255,.06)'); txt(S, 'IL PROFILO', 690, 350, 16, 'rgba(255,255,255,.55)', 500, MONO); radarDraw(S, 827, 455, 78, false);
      [[420, '#22343e'], [490, '#22343e'], [560, '#d7263d']].forEach(([x, c]) => { S.x.fillStyle = c; S.x.beginPath(); S.x.arc(x, 598, 24, 0, 7); S.x.fill(); }); },
    hub(S) { bgNavy(S); txt(S, 'OGGI · IL TUO PERCORSO', 60, 78, 22, P.warm, 500, MONO); txt(S, 'Martedì', 60, 136, 46, '#fff');
      [['15:00', 'Lezione live', 'Matematica · 1 a 1', P.acc, 'LIVE'], ['16:30', 'Aula studio', 'con il tutor collegato', P.warm, 'APERTA'], ['18:00', 'Laboratorio', 'Mappe mentali', '#ff8a5b', 'GRUPPO']].forEach(([t, a, b, c, k], i) => {
        const y = 190 + i * 140; rr(S, 60, y, 904, 116, 22, 'rgba(255,255,255,.06)'); txt(S, t, 92, y + 70, 34, 'rgba(255,255,255,.6)'); txt(S, a, 260, y + 54, 36, '#fff'); txt(S, b, 260, y + 90, 24, 'rgba(255,255,255,.6)', 500);
        rr(S, 790, y + 36, 140, 44, 22, c); txt(S, k, 860, y + 66, 20, '#0e212e', 700, MONO, 'center'); }); },
    progress(S, t) { bgNavy(S); txt(S, 'I PROGRESSI DI MARCO', 60, 78, 22, P.warm, 500, MONO); txt(S, 'Più autonomo, ogni settimana', 60, 136, 44, '#fff');
      const x0 = 90, y0 = 560, w = 860, h = 330, V = [22, 28, 35, 41, 50, 57, 63, 72];
      S.x.strokeStyle = 'rgba(255,255,255,.1)'; S.x.lineWidth = 2; for (let i = 0; i <= 4; i++) { S.x.beginPath(); S.x.moveTo(x0, y0 - (h * i) / 4); S.x.lineTo(x0 + w, y0 - (h * i) / 4); S.x.stroke(); }
      const n = Math.max(1, t * (V.length - 1)); S.x.beginPath();
      for (let i = 0; i <= Math.floor(n); i++) { const x = x0 + (w * i) / (V.length - 1), y = y0 - (h * V[i]) / 80; i ? S.x.lineTo(x, y) : S.x.moveTo(x, y); }
      const fi = Math.floor(n), fr = n - fi; if (fi < V.length - 1) { const v = V[fi] + (V[fi + 1] - V[fi]) * fr; S.x.lineTo(x0 + (w * n) / (V.length - 1), y0 - (h * v) / 80); }
      S.x.strokeStyle = P.warm; S.x.lineWidth = 7; S.x.lineJoin = 'round'; S.x.stroke();
      V.forEach((_, i) => txt(S, 'S' + (i + 1), x0 + (w * i) / (V.length - 1), 600, 18, 'rgba(255,255,255,.45)', 500, MONO, 'center')); },
  };
  const HELP = { txt, rr, avatar, radarDraw, bg: bgNavy, FONT, MONO, P };
  if (T.screens) Object.assign(SCR, T.screens(HELP));
  let scrMode = '';
  const setScreen = (m, t = 0) => { if (m === scrMode && m !== 'progress') return; scrMode = m; SCR[m](screen, t); screen.t.needsUpdate = true; };

  const panel = (draw) => { const S = ctex(512, 320); bgNavy(S); draw(S); S.t.needsUpdate = true; return S.t; };
  const PANELS = T.panels ? T.panels(HELP).map(panel) : [
    panel((S) => { txt(S, 'LEZIONE LIVE', 30, 46, 18, P.acc, 500, MONO); rr(S, 30, 70, 452, 220, 18, '#1d5a6d'); avatar(S, 160, 200, 140, 'rgba(229,239,242,.9)'); S.x.strokeStyle = 'rgba(255,255,255,.5)'; S.x.lineWidth = 4; [110, 150, 190].forEach((y) => { S.x.beginPath(); S.x.moveTo(270, y); S.x.lineTo(440, y); S.x.stroke(); }); }),
    panel((S) => { txt(S, 'AULA STUDIO', 30, 46, 18, P.warm, 500, MONO); for (let i = 0; i < 6; i++) { const x = 30 + (i % 3) * 154, y = 70 + Math.floor(i / 3) * 112; rr(S, x, y, 142, 100, 14, i === 4 ? '#1d5a6d' : 'rgba(255,255,255,.08)'); avatar(S, x + 71, y + 58, 56, i === 4 ? 'rgba(229,239,242,.9)' : 'rgba(255,214,107,.7)'); } }),
    panel((S) => { txt(S, 'LABORATORIO', 30, 46, 18, '#ff8a5b', 500, MONO); const N = [[256, 180, 'METODO'], [120, 110, 'mappe'], [392, 110, 'memoria'], [130, 260, 'sintesi'], [384, 262, 'tempo']];
      S.x.strokeStyle = 'rgba(255,255,255,.35)'; S.x.lineWidth = 3; N.slice(1).forEach(([x, y]) => { S.x.beginPath(); S.x.moveTo(256, 180); S.x.lineTo(x, y); S.x.stroke(); });
      N.forEach(([x, y, t], i) => { rr(S, x - 62, y - 22, 124, 44, 22, i ? 'rgba(255,255,255,.1)' : P.warm); txt(S, t, x, y + 8, 20, i ? '#fff' : '#0e212e', 700, FONT, 'center'); }); }),
  ];

  /* =====================================================================
     3 · INTERNO "DA CASA": la scrivania, il portatile, la lampada
     ===================================================================== */
  const O1 = new THREE.Vector3(100, 0, 0);
  const casa = new THREE.Group(); casa.position.copy(O1); scene.add(casa);
  const floor1 = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), std('#2b201a', { roughness: 0.9 })); floor1.rotation.x = -Math.PI / 2; casa.add(floor1);
  const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), std('#3b2d26', { roughness: 0.95 })); wall1.position.set(0, 2.5, -1.4); casa.add(wall1);
  const wallL = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), std('#33271f', { roughness: 0.95 })); wallL.rotation.y = Math.PI / 2; wallL.position.set(-2.6, 2.5, 1); casa.add(wallL);
  // finestra sulla notte (con le luci della città)
  const night = ctex(512, 384); { const g = night.x.createLinearGradient(0, 0, 0, 384); g.addColorStop(0, '#071722'); g.addColorStop(1, P.scr1); night.x.fillStyle = g; night.x.fillRect(0, 0, 512, 384);
    for (let i = 0; i < 70; i++) { night.x.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.6})`; night.x.fillRect(rnd() * 512, rnd() * 220, 2, 2); }
    for (let i = 0; i < 90; i++) { night.x.fillStyle = `rgba(255,214,107,${0.3 + rnd() * 0.6})`; night.x.fillRect(rnd() * 512, 290 + rnd() * 90, 3, 3); } night.t.needsUpdate = true; }
  const win1 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), new THREE.MeshBasicMaterial({ map: night.t })); win1.position.set(-1.1, 1.85, -1.39); casa.add(win1);
  const frameMat = std('#1d1612'); [[0, 0.57, 1.58, 0.05], [0, -0.57, 1.58, 0.05], [-0.77, 0, 0.05, 1.18], [0.77, 0, 0.05, 1.18], [0, 0, 0.03, 1.1]].forEach(([x, y, w, h]) => { const f = box(w, h, 0.04, frameMat, 0.005); f.position.set(-1.1 + x, 1.85 + y, -1.37); casa.add(f); });
  const wood = std('#b88a5e', { roughness: 0.6 }), dark = std('#1b2329');
  const desk = box(2.2, 0.06, 1.0, wood, 0.02); desk.position.set(0, 0.76, 0); casa.add(desk);
  [[-1.0, -0.42], [1.0, -0.42], [-1.0, 0.42], [1.0, 0.42]].forEach(([x, z]) => { const l = box(0.05, 0.74, 0.05, dark, 0.01); l.position.set(x, 0.37, z); casa.add(l); });
  // portatile
  const alu = std('#c9d1d5', { roughness: 0.35, metalness: 0.6 });
  const lap = new THREE.Group(); lap.position.set(0, 0.79, 0.08); casa.add(lap);
  const base = box(0.62, 0.022, 0.42, alu, 0.01); base.position.y = 0.011; lap.add(base);
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.2), std('#2a3136')); keys.rotation.x = -Math.PI / 2; keys.position.set(0, 0.0225, -0.04); lap.add(keys);
  const hinge = new THREE.Group(); hinge.position.set(0, 0.022, -0.21); hinge.rotation.x = -0.26; lap.add(hinge);
  const lid = box(0.62, 0.4, 0.014, alu, 0.01); lid.position.y = 0.2; hinge.add(lid);
  const disp = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.3625), new THREE.MeshBasicMaterial({ map: screen.t, toneMapped: false })); disp.position.set(0, 0.2, 0.0075); hinge.add(disp);
  const SCREEN_C = new THREE.Vector3(); disp.getWorldPosition(SCREEN_C);
  // lampada
  const lamp = new THREE.Group(); lamp.position.set(0.8, 0.79, -0.28); casa.add(lamp);
  const lb = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.025, 24), dark); lamp.add(lb);
  const lp = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), dark); lp.position.y = 0.28; lamp.add(lp);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.15, 24, 1, true), std(P.warm, { side: THREE.DoubleSide, emissive: '#ffb347', emissiveIntensity: 0.25 })); shade.position.set(-0.04, 0.6, 0.02); shade.rotation.z = 0.3; lamp.add(shade);
  lamp.add(at3(sprite('#ffd08a', 0.5, 0.7), -0.06, 0.53, 0.03));
  const lampLight = new THREE.PointLight('#ffc77a', 6, 6, 1.6); lampLight.position.set(0.74, 1.3, -0.24); casa.add(lampLight);
  const fill1 = new THREE.PointLight('#ffd9a8', 3, 9, 1.6); fill1.position.set(1.6, 2.4, 2.2); casa.add(fill1);
  const scrLight = new THREE.PointLight('#8fdbe3', 1.2, 2.5, 2); scrLight.position.set(0, 1.05, 0.3); casa.add(scrLight);
  // libri e tazza
  const deskProps = [];
  [['#0E212E', 0.0], ['#00949E', 0.05], ['#FFD66B', 0.1]].forEach(([c, y], i) => { const b = box(0.32 - i * 0.02, 0.05, 0.24, std(c), 0.01); b.position.set(-0.78, 0.815 + y, -0.18); b.rotation.y = (i - 1) * 0.12; casa.add(b); deskProps.push(b); });
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 20), std('#e9eff1')); mug.position.set(0.48, 0.84, 0.28); casa.add(mug); deskProps.push(mug);
  // il tema può arredare la stanza a modo suo (es. la stanza dell'allievo CMA)
  if (T.casa) { deskProps.forEach((m) => casa.remove(m)); T.casa({ THREE, casa, box, std, ctex, sprite, at3, walls: { floor: floor1, back: wall1, left: wallL }, FONT, MONO }); }
  // i tre pannelli che "escono" dallo schermo (lezioni, aula studio, laboratorio)
  const panels = PANELS.map((t, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.325), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, toneMapped: false, depthWrite: false })); const bx = (i - 1) * 0.66; m.userData.base = new THREE.Vector3(bx, 1.42 + (i === 1 ? 0.12 : 0), -0.05 - (i === 1 ? 0.1 : 0)); m.rotation.y = -(i - 1) * 0.28; casa.add(m); return m; });

  /* =====================================================================
     4 · INTERNO "IN SEDE": accoglienza, tutor, postazioni con tablet e cuffie
     ===================================================================== */
  const O2 = new THREE.Vector3(200, 0, 0);
  const SEDE_IN = buildSedeInterior(); const sede = SEDE_IN.group; sede.position.copy(O2); scene.add(sede);
  // Messina: la sede vera, ricostruita dalle foto
  const O3 = new THREE.Vector3(300, 0, 0);
  const MES = buildMessina({ cma: !!window.SEDI_THEME, outdoorLight: false }); MES.group.position.copy(O3); scene.add(MES.group);
  const O4 = new THREE.Vector3(400, 0, 0);
  const CAG = buildCagliari({ cma: !!window.SEDI_THEME, outdoorLight: false }); CAG.group.position.copy(O4); scene.add(CAG.group);
  const O5 = new THREE.Vector3(500, 0, 0);
  const MON = buildMonza({ cma: !!window.SEDI_THEME, outdoorLight: false }); MON.group.position.copy(O5); scene.add(MON.group);
  const O6 = new THREE.Vector3(600, 0, 0);
  const LEC = buildLecco({ cma: !!window.SEDI_THEME, outdoorLight: false }); LEC.group.position.copy(O6); scene.add(LEC.group);
  const CUSTOM = { messina: MES, cagliari: CAG, monza: MON, lecco: LEC };
  const roomOf = () => (SEDE && CUSTOM[SEDE.key]) || SEDE_IN;

  /* =====================================================================
     5 · LA REGIA: posizioni della camera lungo lo scroll
     ===================================================================== */
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const at = (o, x, y, z) => o.clone().add(V(x, y, z));
  const far = mob ? 1.45 : 1;                             // su telefono la camera si allontana un po'
  const ext = (p, pos, look) => ({ p, pos: look.clone().add(pos.clone().sub(look).multiplyScalar(far)), look });
  const OVER = [ext(0, V(0, 15, 12.5), V(0, 0, 0.5)), ext(0.085, V(-1.4, 10.5, 9.5), V(0.1, 0, 0.3)), ext(0.165, V(-0.4, 7.4, 7.8), V(0.1, 0.2, 0.2))];
  const sx = mob ? 0 : -2.6;
  const END = [ext(0.813, V(0.2 + sx, 5.5, 6.5), V(sx, 0.6, 0)), ext(0.9, V(sx, 10.5, 10), V(sx, 0.4, 0.3)), ext(1, V(sx, 13, 11.5), V(sx, 0, 0.4))];
  const hp0 = house.position;
  const KF = {
    casa: [...OVER,
      { p: 0.215, pos: at(hp0, 1.3, 1.25, 2.2), look: at(hp0, 0, 0.08, 0) },
      { p: 0.262, pos: at(HWIN, 0.18, 0.12, 0.7), look: HWIN.clone() },
      { p: 0.3, pos: at(HWIN, 0, 0, 0.05), look: at(HWIN, 0, 0, -1) },
      { p: 0.3001, pos: at(O1, 0, 1.75, 3.1), look: at(O1, 0, 0.95, 0) },
      { p: 0.36, pos: at(O1, 0.05, 1.22, 1.3), look: at(O1, 0, 1.0, -0.12) },
      { p: 0.445, pos: at(O1, 0.12, 1.12, 0.92), look: at(O1, 0, 1.0, -0.12) },
      { p: 0.49, pos: at(O1, -0.55, 1.18, 1.1), look: at(O1, 0, 1.0, -0.12) },
      { p: 0.565, pos: at(O1, -0.38, 1.12, 0.9), look: at(O1, 0, 1.0, -0.12) },
      { p: 0.61, pos: at(O1, 0, 1.55, 2.35), look: at(O1, 0, 1.25, -0.2) },
      { p: 0.685, pos: at(O1, 0.25, 1.45, 2.05), look: at(O1, 0, 1.25, -0.2) },
      { p: 0.725, pos: at(O1, 1.25, 1.42, 1.6), look: at(O1, 0, 0.98, -0.08) },
      { p: 0.8, pos: at(O1, 0.85, 1.25, 1.15), look: at(O1, 0, 1.0, -0.12) },
      { p: 0.8129, pos: at(O1, 0.8, 1.22, 1.1), look: at(O1, 0, 1.0, -0.12) },
      ...END],
    sede: null,
  };
  if (T.casaKF) T.casaKF(KF.casa, { at, O1, V });
  const kfSede = (S) => { const sp0 = S.g.position; return [...OVER,
      { p: 0.215, pos: at(sp0, 1.2, 1.1, 2.0), look: at(sp0, 0, 0.1, 0) },
      { p: 0.262, pos: at(S.door, 0.1, 0.06, 0.6), look: S.door.clone() },
      { p: 0.3, pos: at(S.door, 0, 0, 0.04), look: at(S.door, 0, 0, -1) },
      { p: 0.3001, pos: at(O2, 0.4, 1.65, 4.8), look: at(O2, 0, 1.0, -0.6) },
      { p: 0.37, pos: at(O2, 0.2, 1.6, 3.6), look: at(O2, 0.2, 1.0, -0.6) },
      { p: 0.445, pos: at(O2, 0.1, 1.55, 3.2), look: at(O2, 0, 1.0, -0.8) },
      { p: 0.49, pos: at(O2, 0.2, 1.65, 3.0), look: at(O2, -2.2, 1.45, 0.85) },
      { p: 0.565, pos: at(O2, -0.1, 1.6, 2.7), look: at(O2, -2.3, 1.45, 0.85) },
      { p: 0.61, pos: at(O2, 1.75, 1.3, 1.05), look: at(O2, 1.4, 0.85, -0.5) },
      { p: 0.685, pos: at(O2, 1.55, 1.18, 0.75), look: at(O2, 1.4, 0.86, -0.47) },
      { p: 0.725, pos: at(O2, 1.4, 1.25, 3.1), look: at(O2, 1.4, 1.5, -1.2) },
      { p: 0.8, pos: at(O2, 1.4, 1.35, 2.7), look: at(O2, 1.4, 2.0, -1.4) },
      { p: 0.8129, pos: at(O2, 1.4, 1.38, 2.65), look: at(O2, 1.4, 2.05, -1.4) },
      ...END]; };
  // tappe dentro la sede di Messina (stesse didascalie: entri, incontri la tutor, la postazione, la rete)
  const kfMessina = (S) => { const sp0 = S.g.position; return [...OVER,
      { p: 0.215, pos: at(sp0, 1.2, 1.1, 2.0), look: at(sp0, 0, 0.1, 0) },
      { p: 0.262, pos: at(S.door, 0.1, 0.06, 0.6), look: S.door.clone() },
      { p: 0.3, pos: at(S.door, 0, 0, 0.04), look: at(S.door, 0, 0, -1) },
      { p: 0.3001, pos: at(O3, 5.5, 1.85, 3.95), look: at(O3, 2.8, 1.2, 1.2) },
      { p: 0.37, pos: at(O3, 5.6, 1.85, 3.95), look: at(O3, 2.4, 1.1, 1.3) },
      { p: 0.445, pos: at(O3, 5.5, 1.8, 3.9), look: at(O3, 2.2, 1.1, 1.4) },
      { p: 0.49, pos: at(O3, -1.5, 1.65, -0.35), look: at(O3, -4.2, 1.0, -2.5) },
      { p: 0.565, pos: at(O3, -1.8, 1.6, -0.6), look: at(O3, -4.0, 1.0, -2.4) },
      { p: 0.61, pos: at(O3, -1.4, 1.75, 3.9), look: at(O3, -5.6, 1.0, 2.3) },
      { p: 0.685, pos: at(O3, -2.3, 1.6, 3.5), look: at(O3, -5.7, 0.95, 2.1) },
      { p: 0.725, pos: at(O3, -1.3, 1.75, 4.0), look: at(O3, -5.2, 1.9, 2.2) },
      { p: 0.8, pos: at(O3, -1.4, 1.8, 3.9), look: at(O3, -5.2, 2.1, 2.2) },
      { p: 0.8129, pos: at(O3, -1.4, 1.8, 3.9), look: at(O3, -5.2, 2.1, 2.2) },
      ...END]; };
  // tappe dentro la sede di Cagliari: reception a sinistra, colloqui in fondo a destra, aula studio sulla pedana
  const kfCagliari = (S) => { const sp0 = S.g.position; return [...OVER,
      { p: 0.215, pos: at(sp0, 1.2, 1.1, 2.0), look: at(sp0, 0, 0.1, 0) },
      { p: 0.262, pos: at(S.door, 0.1, 0.06, 0.6), look: S.door.clone() },
      { p: 0.3, pos: at(S.door, 0, 0, 0.04), look: at(S.door, 0, 0, -1) },
      { p: 0.3001, pos: at(O4, 0.9, 1.7, 3.9), look: at(O4, -2.4, 1.0, 2.6) },
      { p: 0.37, pos: at(O4, 1.2, 1.72, 1.6), look: at(O4, -2.7, 0.95, 3.8) },
      { p: 0.445, pos: at(O4, 1.3, 1.75, 1.2), look: at(O4, -2.7, 0.9, 3.9) },
      { p: 0.49, pos: at(O4, 2.15, 1.65, -3.9), look: at(O4, 3.5, 0.8, -6.6) },
      { p: 0.565, pos: at(O4, 2.2, 1.6, -4.2), look: at(O4, 3.5, 0.8, -6.6) },
      { p: 0.61, pos: at(O4, -1.7, 2.05, -1.9), look: at(O4, -1.8, 1.35, -7.6) },
      { p: 0.685, pos: at(O4, -1.75, 1.95, -2.6), look: at(O4, -1.8, 1.3, -7.6) },
      { p: 0.725, pos: at(O4, -1.5, 2.2, -2.3), look: at(O4, -1.8, 2.1, -7.7) },
      { p: 0.8, pos: at(O4, -1.5, 2.25, -2.2), look: at(O4, -1.8, 2.4, -7.7) },
      { p: 0.8129, pos: at(O4, -1.5, 2.25, -2.2), look: at(O4, -1.8, 2.4, -7.7) },
      ...END]; };
  // tappe dentro la sede di Monza: reception in fondo, colloqui sul retro, postazioni sulla parete destra
  const kfMonza = (S) => { const sp0 = S.g.position; return [...OVER,
      { p: 0.215, pos: at(sp0, 1.2, 1.1, 2.0), look: at(sp0, 0, 0.1, 0) },
      { p: 0.262, pos: at(S.door, 0.1, 0.06, 0.6), look: S.door.clone() },
      { p: 0.3, pos: at(S.door, 0, 0, 0.04), look: at(S.door, 0, 0, -1) },
      { p: 0.3001, pos: at(O5, -2.6, 1.7, 4.4), look: at(O5, 0.3, 0.9, -2.0) },
      { p: 0.37, pos: at(O5, -2.2, 1.7, 3.6), look: at(O5, 0.4, 0.9, -2.0) },
      { p: 0.445, pos: at(O5, -1.9, 1.68, 3.0), look: at(O5, 0.4, 0.9, -2.0) },
      { p: 0.49, pos: at(O5, -3.5, 1.65, -2.9), look: at(O5, -1.6, 0.85, -5.4) },
      { p: 0.565, pos: at(O5, -3.4, 1.62, -3.3), look: at(O5, -1.6, 0.85, -5.4) },
      { p: 0.61, pos: at(O5, 0.6, 1.65, 0.9), look: at(O5, 4.9, 1.1, 0.3) },
      { p: 0.685, pos: at(O5, 1.2, 1.6, 0.8), look: at(O5, 4.9, 1.05, 0.3) },
      { p: 0.725, pos: at(O5, 0.9, 1.9, 0.6), look: at(O5, 4.9, 1.85, 0.35) },
      { p: 0.8, pos: at(O5, 1.0, 1.95, 0.6), look: at(O5, 4.9, 2.15, 0.35) },
      { p: 0.8129, pos: at(O5, 1.0, 1.95, 0.6), look: at(O5, 4.9, 2.15, 0.35) },
      ...END]; };
  // tappe dentro la sede di Lecco: si entra dalla porta CMA, reception subito a sinistra, colloqui sul retro, postazioni a destra
  const kfLecco = (S) => { const sp0 = S.g.position; return [...OVER,
      { p: 0.215, pos: at(sp0, 1.2, 1.1, 2.0), look: at(sp0, 0, 0.1, 0) },
      { p: 0.262, pos: at(S.door, 0.1, 0.06, 0.6), look: S.door.clone() },
      { p: 0.3, pos: at(S.door, 0, 0, 0.04), look: at(S.door, 0, 0, -1) },
      { p: 0.3001, pos: at(O6, -2.7, 1.7, 3.4), look: at(O6, -3.4, 1.2, -0.5) },
      { p: 0.37, pos: at(O6, -0.4, 1.7, 1.6), look: at(O6, -4.4, 1.15, 2.0) },
      { p: 0.445, pos: at(O6, 0.6, 1.7, 1.0), look: at(O6, -4.4, 1.15, 2.0) },
      { p: 0.49, pos: at(O6, -3.9, 1.65, -2.8), look: at(O6, -1.8, 0.85, -5.2) },
      { p: 0.565, pos: at(O6, -3.8, 1.62, -3.2), look: at(O6, -1.8, 0.85, -5.2) },
      { p: 0.61, pos: at(O6, 0.4, 1.65, 0.5), look: at(O6, 4.9, 1.1, 0.4) },
      { p: 0.685, pos: at(O6, 1.0, 1.6, 0.6), look: at(O6, 4.9, 1.05, 0.4) },
      { p: 0.725, pos: at(O6, 0.9, 1.9, 0.5), look: at(O6, 4.9, 1.85, 0.4) },
      { p: 0.8, pos: at(O6, 1.0, 1.95, 0.5), look: at(O6, 4.9, 2.15, 0.4) },
      { p: 0.8129, pos: at(O6, 1.0, 1.95, 0.5), look: at(O6, 4.9, 2.15, 0.4) },
      ...END]; };
  const kfFor = (S) => (S.key === 'messina' ? kfMessina(S) : S.key === 'cagliari' ? kfCagliari(S) : S.key === 'monza' ? kfMonza(S) : S.key === 'lecco' ? kfLecco(S) : kfSede(S));
  KF.sede = kfFor(SEDE);
  let path = 'casa';
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), tgtPos = new THREE.Vector3(), tgtLook = new THREE.Vector3();
  const sample = (p) => {
    const K = KF[path]; let i = 0; while (i < K.length - 2 && p > K[i + 1].p) i++;
    const a = K[i], b = K[i + 1], t = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1), e = t * t * (3 - 2 * t);
    tgtPos.lerpVectors(a.pos, b.pos, e); tgtLook.lerpVectors(a.look, b.look, e);
  };
  let snap = true;

  /* ---------------- etichette sopra la mappa ---------------- */
  const labels = [...sedi.map((s) => ({ name: s.name, soon: s.soon, pos: s.g.position.clone().add(V(s.key === 'lecco' ? 0.25 : s.key === 'monza' ? -0.25 : 0, s.key === 'lecco' ? 0.78 : 0.42, 0)), cls: 'sede' })), { name: 'Casa tua', pos: house.position.clone().add(V(0, 0.38, 0)), cls: 'home' }, { name: T.net, pos: C.clone().add(V(0, 0.85, 0)), cls: 'core' }]
    .map((l) => { const el = document.createElement(l.cls === 'sede' ? 'button' : 'div'); el.className = 'jl ' + l.cls + (l.soon ? ' soon' : ''); el.textContent = l.soon ? `${l.name} · nov` : l.name;
      if (l.cls === 'sede') { el.type = 'button'; el.dataset.sede = l.name.toLowerCase(); el.setAttribute('aria-label', `Scegli la sede di ${l.name}`); el.addEventListener('click', () => setSede(el.dataset.sede, true)); }
      labelsEl.appendChild(el); return { ...l, el }; });
  const proj = new THREE.Vector3();

  /* ---------------- scelta del percorso ---------------- */
  const pathRanges = () => L.prog(sec);
  function applyPath() {
    toggles.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setpath === path)));
    document.body.dataset.jpath = path;
    houseLine.material.opacity = path === 'casa' ? 0.85 : 0.25;
    sedeLines.material.opacity = path === 'sede' ? 0.75 : 0.3;
  }
  function setPath(np, jump) {
    if (np === path && !jump) return;
    const p = pathRanges(), inside = p > 0.3 && p < 0.813;
    const go = () => { path = np; applyPath(); snap = true; if (jump && p < 0.2) L.lenis?.scrollTo(sec.offsetTop + (sec.offsetHeight - innerHeight) * 0.2, { duration: 1.6 }); };
    if (inside && np !== path) gsap.timeline().to(swapV, { opacity: 1, duration: 0.25 }).add(go).to(swapV, { opacity: 0, duration: 0.4, delay: 0.05 });
    else go();
  }
  toggles.forEach((b) => b.addEventListener('click', () => setPath(b.dataset.setpath, b.hasAttribute('data-jump') && b.dataset.setpath === 'casa')));

  /* ---------------- scelta della sede: si entra in quella, e si aprono i suoi riferimenti ---------------- */
  const INFO = window.SEDI_INFO || {}, LINKS = window.SEDE_LINKS;
  function fillSede() {
    const k = SEDE.key, I = INFO[k], Lk = LINKS ? LINKS(k) : null;
    document.querySelectorAll('[data-pick-sede]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pickSede === sedeKey)));
    labels.forEach((l) => l.cls === 'sede' && l.el.classList.toggle('chosen', l.name.toLowerCase() === sedeKey));
    const box = document.getElementById('sedeRefs'); if (!box || !I) return;
    if (I.opening) {
      box.innerHTML = `<p class="k">In apertura · ${I.opening}</p>
        <h2>${T.brand} <em>${I.name}</em></h2>
        <p>La sede di ${I.name} apre a ${I.opening.split(' ')[0]}. Nel frattempo il percorso è già disponibile online, dalla prima consulenza.</p>
        <ul class="refs"><li><b>Contatti</b><span><a href="${Lk.tel}">${I.phone}</a><br><a href="${Lk.mail}">${I.email}</a></span></li></ul>
        <div class="rbtn"><a class="btn ${T.btn}" href="${T.test}"><span class="t">Inizia online →</span></a><a class="btn btn-ghost" href="${T.page(k)}"><span class="t">Pagina della sede</span></a></div>`;
      const end = document.getElementById('endSede'); if (end) end.innerHTML = `<b>${T.brand} ${I.name}</b> apre a ${I.opening.split(' ')[0]} · nel frattempo <a href="${T.test}">inizia online →</a>`;
      return;
    }
    box.innerHTML = `<p class="k">${sedeKey ? 'La sede che hai scelto' : 'Scegli la sede più vicina'}</p>
      <h2>${T.brand} <em>${I.name}</em></h2>
      <ul class="refs">
        <li><b>Indirizzo</b><span>${I.address}</span></li>
        <li><b>Orari</b><span>${I.hours.filter((h) => h[1] !== 'Chiuso').map((h) => `${h[0]} ${h[1]}`).join('<br>')}</span></li>
        <li><b>Contatti</b><span><a href="${Lk.tel}">${I.phone}</a><br><a href="${Lk.mail}">${I.email}</a></span></li>
      </ul>
      <div class="rbtn"><a class="btn ${T.btn}" href="${T.page(k)}"><span class="t">Pagina della sede →</span></a><a class="btn btn-ghost" href="${Lk.maps}" target="_blank" rel="noopener"><span class="t">Apri in Maps</span></a></div>`;
    const end = document.getElementById('endSede'); if (end) end.innerHTML = `Ti aspettiamo a <b>${T.brand} ${I.name}</b> · ${I.address} · <a href="${T.page(k)}">pagina della sede →</a>`;
  }
  function setSede(k, jump) {
    const S = sedi.find((s) => s.key === k); if (!S) return;
    sedeKey = k; SEDE = S; KF.sede = kfFor(S); SEDE_IN.setCity(S.name);
    if (path !== 'sede') { path = 'sede'; applyPath(); }
    snap = true; fillSede();
    const p = pathRanges();
    if (jump && p < 0.3) L.lenis?.scrollTo(sec.offsetTop + (sec.offsetHeight - innerHeight) * 0.215, { duration: 1.6 });
  }
  document.querySelectorAll('[data-pick-sede]').forEach((b) => b.addEventListener('click', () => setSede(b.dataset.pickSede, true)));
  fillSede();
  applyPath();

  /* ---------------- dimensioni ---------------- */
  function resize() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  resize(); addEventListener('resize', resize);
  document.fonts?.ready.then(() => { scrMode = ''; });

  /* =====================================================================
     6 · IL CICLO: un fotogramma alla volta, solo quando la sezione è visibile
     ===================================================================== */
  const win = (p, a, b, f = 0.012) => THREE.MathUtils.clamp((p - a) / f, 0, 1) * THREE.MathUtils.clamp((b - p) / f, 0, 1);
  const tri = (p, a, b, c, d) => (p < a || p > d ? 0 : p < b ? (p - a) / (b - a) : p <= c ? 1 : (d - p) / (d - c));
  L.onFrame((now) => {
    const r = sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const t = now / 1000, p = THREE.MathUtils.clamp(L.prog(sec), 0, 1);
    const inside = p > 0.3 && p < 0.813;

    // camera: segue la regia con un filo di morbidezza (e scatta nei passaggi dentro/fuori)
    sample(p);
    if (snap || camPos.distanceTo(tgtPos) > 15) { camPos.copy(tgtPos); camLook.copy(tgtLook); snap = false; }
    else { camPos.lerp(tgtPos, 0.14); camLook.lerp(tgtLook, 0.14); }
    const breathe = inside ? 0.008 : 0.06;
    camera.position.set(camPos.x + Math.sin(t * 0.5) * breathe, camPos.y + Math.sin(t * 0.7) * breathe * 0.6, camPos.z);
    camera.lookAt(camLook);

    // il mondo esterno
    ico.rotation.y = t * 0.25; ico.rotation.x = t * 0.12; ring.rotation.z = t * 0.4;
    const pulseOn = !inside;
    if (pulseOn) {
      for (let i = 0; i < winPh.length; i++) { const [ph, f] = winPh[i], k = 0.55 + 0.45 * Math.sin(t * f + ph); winCol[i * 3] = WARM.r * k; winCol[i * 3 + 1] = WARM.g * k; winCol[i * 3 + 2] = WARM.b * k; }
      winG.attributes.color.needsUpdate = true;
      pulses.forEach((q, i) => { const v = q.cv.getPoint((t * q.sp + q.of) % 1); pulsePos[i * 3] = v.x; pulsePos[i * 3 + 1] = v.y; pulsePos[i * 3 + 2] = v.z; }); pulseG.attributes.position.needsUpdate = true;
      mainPulses.forEach((q, i) => { const show = i === 0 ? path === 'casa' || p > 0.82 : path === 'sede' || p > 0.82; const v = q.cv.getPoint((t * q.sp + q.of) % 1); mpPos[i * 3] = v.x; mpPos[i * 3 + 1] = show ? v.y : -99; mpPos[i * 3 + 2] = v.z; }); mpG.attributes.position.needsUpdate = true;
      if (p > 0.82) { houseLine.material.opacity = 0.85; sedeLines.material.opacity = 0.75; } else applyPathOpacity();
    }

    // dentro casa: lo schermo cambia a ogni tappa, poi i pannelli escono, poi i progressi
    if (path === 'casa' && inside) {
      if (p < 0.46) setScreen('test'); else if (p < 0.58) setScreen('call'); else if (p < 0.7) setScreen('hub'); else setScreen('progress', THREE.MathUtils.clamp((p - 0.71) / 0.07, 0, 1));
      const po = win(p, 0.585, 0.7, 0.025);
      panels.forEach((m, i) => { m.material.opacity = po; const b = m.userData.base; const k = 1 - po; m.position.set(b.x * (0.4 + 0.6 * po), b.y - k * 0.35 + Math.sin(t * 1.3 + i) * 0.01, b.z); m.scale.setScalar(0.6 + 0.4 * po); });
      lampLight.intensity = 6 + Math.sin(t * 2.3) * 0.15;
    }
    // in sede: il tutor "respira", poi dalle postazioni partono i fasci verso la rete
    if (path === 'sede' && inside) { const RM = roomOf(); RM.idle(t); RM.connect(THREE.MathUtils.clamp((p - 0.71) / 0.05, 0, 1), t); }

    // velo bianco/caldo nei passaggi, e velo del cambio percorso
    const fIn = tri(p, 0.283, 0.297, 0.303, 0.318), fOut = tri(p, 0.797, 0.81, 0.816, 0.83);
    flash.style.opacity = Math.max(fIn, fOut);
    flash.style.background = fIn > 0 ? (path === 'casa' ? P.flashCasa : '#eef3f5') : P.bg;

    // didascalie
    caps.forEach((c) => {
      const pp = c.dataset.path, o = pp === 'both' || pp === path ? win(p, +c.dataset.a, +c.dataset.b) : 0;
      c.style.opacity = o; c.style.transform = `translateY(${(1 - o) * 18}px)`; c.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    });
    stage.classList.toggle('show-toggle', p > 0.07 && p < 0.97);
    stage.classList.toggle('inside', inside);
    barEl.style.width = p * 100 + '%';

    // alone sulla sede scelta
    chosenHalo.position.copy(SEDE.g.position).add(V(0, 0.45, 0)); chosenHalo.material.opacity = path === 'sede' && !inside ? 0.75 + Math.sin(t * 3) * 0.2 : 0;
    labelsEl.classList.toggle('pickable', path === 'sede' && p < 0.29);
    // etichette
    labels.forEach((l) => {
      const vis = !inside && (l.cls !== 'home' || path === 'casa' || p > 0.82) && (l.cls !== 'core' || p < 0.2 || p > 0.82);
      if (!vis) { l.el.style.opacity = 0; return; }
      proj.copy(l.pos).project(camera);
      const ok = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      l.el.style.opacity = ok ? 1 : 0;
      l.el.style.transform = `translate(${(proj.x * 0.5 + 0.5) * stage.clientWidth}px, ${(-proj.y * 0.5 + 0.5) * stage.clientHeight}px) translate(-50%, -100%)`;
    });

    renderer.render(scene, camera);
  });
  function applyPathOpacity() { houseLine.material.opacity = path === 'casa' ? 0.85 : 0.25; sedeLines.material.opacity = path === 'sede' ? 0.75 : 0.3; }
  document.body.classList.add('gl-ready');
}
