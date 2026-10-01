/* =====================================================================
   LAMBDA · tour 3D della singola sede
   Quattro tappe (ingresso, tutor, postazioni, collegamento alla rete).
   Si trascina per guardarsi intorno; i punti luminosi portano alla tappa.
   ===================================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildSedeInterior } from './sede-interior.js?v=4';

const L = window.Lambda, $ = (s) => document.querySelector(s);
const CMA = !!window.SEDI_THEME, BR = CMA ? 'CMA' : 'Lambda';
const box = $('#tBox'), canvas = $('#tCanvas'), hot = $('#tHot');
const info = window.SEDI_INFO?.[document.body.dataset.sede];
const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
if (box && info && !document.body.classList.contains('nogl') && !L.reduced && webglOK()) init();
else document.body.classList.add('nogl');

function init() {
  const city = info.name, mob = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
  const STOPS = [
    { k: 'Ingresso', t: `Benvenuti a ${BR} ${city}.`, p: CMA ? 'Uno spazio silenzioso, pensato per studiare. Qui puoi fare anche il primo colloquio di persona.' : 'Uno spazio luminoso e silenzioso, pensato per studiare. Qui puoi anche fare la prima consulenza di persona.', cam: [0.4, 1.65, 5.0], tgt: [0.1, 1.15, -0.5], hot: [0.4, 2.35, 5.3] },
    { k: 'Accoglienza e tutor', t: 'Il tutor, in presenza.', p: 'Ti accoglie, fa il punto sul percorso con te e con la tua famiglia, e ti assiste quando serve.', cam: [-0.25, 1.62, 2.9], tgt: [-2.3, 1.42, 0.85], hot: [-2.4, 1.95, 0.85] },
    { k: 'Le postazioni', t: 'Tablet e cuffie, pronti per te.', p: CMA ? 'Ogni postazione è attrezzata per seguire le lezioni live e allenarti sul simulatore in tranquillità.' : 'Ogni postazione è attrezzata per seguire lezioni live, aule studio e laboratori in tranquillità.', cam: [1.75, 1.3, 1.05], tgt: [1.4, 0.86, -0.47], hot: [1.4, 1.25, -0.35] },
    { k: 'Collegati alla rete', t: `Dalla sede, tutta ${BR}.`, p: CMA ? 'Dalla postazione accedi alla Rete CMA: gli stessi docenti, tutor e simulatore di chi si prepara da casa.' : 'Dalla postazione accedi alla Rete Lambda: gli stessi docenti, laboratori e aule studio di chi si collega da casa.', cam: [1.4, 1.3, 3.1], tgt: [1.4, 1.75, -1.2], hot: [2.5, 2.55, -1.7] },
  ];

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#dfe8ec');
  scene.add(new THREE.HemisphereLight('#ffffff', '#9fb6bf', 0.9));
  const camera = new THREE.PerspectiveCamera(mob ? 62 : 52, 1, 0.05, 60);
  const room = buildSedeInterior({ city }); scene.add(room.group);

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false; controls.enablePan = false; controls.enableDamping = true; controls.dampingFactor = 0.08; controls.rotateSpeed = 0.45;
  controls.minPolarAngle = 0.95; controls.maxPolarAngle = 1.85;
  controls.enableRotate = !mob;                       // su telefono si naviga con i pulsanti e i punti luminosi

  const V = (a) => new THREE.Vector3(...a);
  let cur = 0, connectK = 0, connectTo = 0, moving = false;
  const constrain = () => {
    const d = camera.position.clone().sub(controls.target), az = Math.atan2(d.x, d.z);
    controls.minDistance = controls.maxDistance = d.length();
    controls.minAzimuthAngle = az - 0.75; controls.maxAzimuthAngle = az + 0.75;
  };
  function go(i, instant) {
    cur = (i + STOPS.length) % STOPS.length; const S = STOPS[cur];
    // libera i vincoli durante lo spostamento, poi li rimette attorno alla nuova tappa
    controls.minDistance = 0; controls.maxDistance = Infinity; controls.minAzimuthAngle = -Infinity; controls.maxAzimuthAngle = Infinity;
    const from = { p: camera.position.clone(), t: controls.target.clone() }, to = { p: V(S.cam), t: V(S.tgt) }, o = { k: 0 };
    moving = true;
    gsap.to(o, { k: 1, duration: instant || L.reduced ? 0 : 1.6, ease: 'power3.inOut',
      onUpdate: () => { camera.position.lerpVectors(from.p, to.p, o.k); controls.target.lerpVectors(from.t, to.t, o.k); },
      onComplete: () => { moving = false; constrain(); } });
    connectTo = cur === 3 ? 1 : 0;
    $('#tN').textContent = cur + 1; $('#tK').textContent = S.k; $('#tT').textContent = S.t; $('#tP').textContent = S.p;
    $('#tNext').querySelector('span').textContent = cur === STOPS.length - 1 ? 'Ricomincia ↺' : 'Avanti →';
    $('#tPrev').disabled = cur === 0;
    dots.forEach((d, j) => d.setAttribute('aria-current', String(j === cur)));
    hots.forEach((h, j) => h.classList.toggle('on', j === cur));
    const panel = $('.tpanel'); panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  }

  // punti luminosi e puntini di navigazione
  const hots = STOPS.map((S, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'hs'; b.setAttribute('aria-label', `Vai a: ${S.k}`); b.innerHTML = `<i></i><span>${S.k}</span>`; b.addEventListener('click', () => go(i)); hot.appendChild(b); return b; });
  const dots = STOPS.map((S, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', S.k); b.addEventListener('click', () => go(i)); $('#tDots').appendChild(b); return b; });
  $('#tNext').addEventListener('click', () => go(cur + 1));
  $('#tPrev').addEventListener('click', () => go(cur - 1));
  canvas.addEventListener('pointerdown', () => box.classList.add('used'), { once: true });

  camera.position.set(...STOPS[0].cam); controls.target.set(...STOPS[0].tgt); go(0, true);

  function resize() { const w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  resize(); addEventListener('resize', resize);
  const proj = new THREE.Vector3();
  L.onFrame((now) => {
    const r = box.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const t = now / 1000;
    if (!moving) controls.update();
    room.idle(t);
    connectK += (connectTo - connectK) * 0.05; room.connect(connectK, t);
    hots.forEach((h, i) => {
      proj.copy(V(STOPS[i].hot)).project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 0.95 && Math.abs(proj.y) < 0.9 && i !== cur;
      h.style.opacity = vis ? 1 : 0; h.style.pointerEvents = vis ? 'auto' : 'none';
      h.style.transform = `translate(${(proj.x * 0.5 + 0.5) * box.clientWidth}px, ${(-proj.y * 0.5 + 0.5) * box.clientHeight}px) translate(-50%, -50%)`;
    });
    renderer.render(scene, camera);
  });
}
