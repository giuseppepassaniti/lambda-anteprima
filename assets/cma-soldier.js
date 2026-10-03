/* =====================================================================
   CONCORSI MILITARI ACADEMY · il soldato 3D low poly (stile "tattico")
   Una figura a facce geometriche con i contorni nel colore del corpo, su una piattaforma
   esagonale che scansiona. Divise stilizzate: colori e copricapo, senza gradi, fregi o stemmi.

   Un solo canvas WebGL per tutta la pagina: ogni elemento [data-soldier="corpo"] (con
   data-lvl opzionale: base · medio · dir · scuole) viene disegnato nel suo riquadro.
   Uso:  import { mountSoldiers } from './cma-soldier.js';  mountSoldiers(document);
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const U = {
  polizia:      { jacket: '#1f2c4d', pants: '#1a2440', shirt: '#9cc1e6', tie: '#1a2440', cap: 'peak', capC: '#1f2c4d', band: '#c9ccd2', belt: '#e8e8e8', accent: '#2D5DA8' },
  carabinieri:  { jacket: '#16181e', pants: '#16181e', shirt: '#ffffff', tie: '#16181e', cap: 'peak', capC: '#16181e', band: '#b3243a', belt: '#ffffff', stripe: '#b3243a', bando: true, accent: '#B3243A' },
  gdf:          { jacket: '#5d6457', pants: '#555b4f', shirt: '#e9e7df', tie: '#3b3f36', cap: 'peak', capC: '#5d6457', band: '#c9a227', belt: '#2b2b2b', collar: '#e0b62e', accent: '#C9A227' },
  esercito:     { jacket: 'camo', pants: 'camo', cap: 'beret', capC: '#2f3a22', belt: '#3a3a2c', boots: true, accent: '#7f9645' },
  marina:       { jacket: '#f4f4f2', pants: '#f4f4f2', cap: 'peak', capC: '#f8f8f8', band: '#1b2747', visor: '#111', belt: '#f4f4f2', buttons: '#d8b45a', accent: '#3d6bc0' },
  aeronautica:  { jacket: '#4f6787', pants: '#46607f', shirt: '#cfe0f2', tie: '#2b3442', cap: 'peak', capC: '#4f6787', band: '#2b3442', belt: '#2b3442', accent: '#4A8FD6' },
  penitenziaria:{ jacket: '#26324c', pants: '#222c44', shirt: '#b8cde6', tie: '#1a2238', cap: 'peak', capC: '#26324c', band: '#7a8db0', belt: '#1a1a1a', accent: '#6f86b3' },
  vvf:          { jacket: '#1d2433', pants: '#1d2433', cap: 'helmet', capC: '#c23a1a', belt: '#1a1a1a', reflect: '#e8f04a', boots: true, accent: '#D9541E' },
  accademie:    { jacket: '#121626', pants: '#121626', shirt: '#ffffff', tie: '#121626', cap: 'peak', capC: '#121626', band: '#c8a14a', belt: '#c8a14a', buttons: '#d8b45a', sabre: true, accent: '#C8A14A' },
};
/* varianti per livello: gli ufficiali in alta uniforme con la sciabola, gli allievi delle scuole militari più giovani */
const variant = (k, lvl) => {
  const u = { ...(U[k] || U.accademie) };
  if (lvl === 'dir' && u.cap !== 'helmet' && u.jacket !== 'camo') Object.assign(u, { buttons: '#d8b45a', sabre: true, belt: k === 'marina' ? '#d8b45a' : u.belt });
  if (lvl === 'dir' && u.jacket === 'camo') Object.assign(u, { jacket: '#3d4a2c', pants: '#3d4a2c', shirt: '#e9e7df', tie: '#2a331f', cap: 'peak', capC: '#3d4a2c', band: '#2a331f', buttons: '#d8b45a', sabre: true, boots: false });
  if (lvl === 'scuole' && u.jacket === 'camo') Object.assign(u, { jacket: '#3d4a2c', pants: '#3d4a2c', shirt: '#e9e7df', tie: '#2a331f', cap: 'peak', capC: '#3d4a2c', band: '#2a331f', boots: false });
  if (lvl === 'scuole') Object.assign(u, { young: true, buttons: '#d8b45a' });
  return u;
};

let camoT = null;
const camoTex = () => { if (camoT) return camoT; const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#6b7346'; x.fillRect(0, 0, 128, 128); ['#4c5530', '#8a8457', '#3a3a28', '#5d6b3a'].forEach((col) => { x.fillStyle = col; for (let i = 0; i < 16; i++) { x.beginPath(); x.ellipse(Math.random() * 128, Math.random() * 128, 6 + Math.random() * 12, 4 + Math.random() * 8, Math.random() * 3, 0, 7); x.fill(); } }); camoT = new THREE.CanvasTexture(c); camoT.colorSpace = THREE.SRGBColorSpace; camoT.wrapS = camoT.wrapT = THREE.RepeatWrapping; camoT.repeat.set(2, 2); return camoT; };

function build(u) {
  const g = new THREE.Group(), body = new THREE.Group(), S = 6, edges = [];
  g.add(body);
  const mat = (c, o = {}) => (c === 'camo' ? new THREE.MeshStandardMaterial({ map: camoTex(), flatShading: true, roughness: .8 }) : new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: .75, ...o }));
  const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1, parent = body) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.scale.set(sx, sy, sz); parent.add(o); edges.push(o); return o; };
  const cyl = (rt, rb, h, seg = S) => new THREE.CylinderGeometry(rt, rb, h, seg);
  const skin = mat('#d9b08e'), J = mat(u.jacket), P = mat(u.pants), shoe = mat('#141414', { roughness: .4 });
  const refl = u.reflect && mat(u.reflect, { emissive: u.reflect, emissiveIntensity: .3 });
  [-.1, .1].forEach((x) => {
    add(cyl(.1, .088, .46), P, x, .72, 0); add(cyl(.086, .07, .46), P, x, .27, 0);
    if (u.boots) add(cyl(.078, .074, .2), shoe, x, .14, 0);
    add(new RoundedBoxGeometry(.14, .08, .28, 1, .03), shoe, x, .04, .045);
    if (u.stripe) add(new THREE.BoxGeometry(.012, .9, .03), mat(u.stripe), x + Math.sign(x) * .095, .5, 0);
    if (refl) [.2, .34].forEach((y) => add(cyl(.082, .082, .035), refl, x, y, 0));
  });
  add(new RoundedBoxGeometry(.36, .16, .22, 1, .06), P, 0, .96, 0);
  add(cyl(.25, .19, .56), J, 0, 1.3, 0, 0, 0, 0, 1, 1, .62);
  add(cyl(.205, .2, .045), mat(u.belt), 0, 1.04, 0, 0, 0, 0, 1, 1, .66);
  if (u.shirt) { add(new THREE.BoxGeometry(.1, .14, .02), mat(u.shirt), 0, 1.48, .135, -.15); add(new THREE.BoxGeometry(.035, .16, .022), mat(u.tie || '#1a1a1a'), 0, 1.44, .142, -.12); }
  if (u.collar) [-1, 1].forEach((s) => add(new THREE.BoxGeometry(.04, .04, .02), mat(u.collar, { emissive: u.collar, emissiveIntensity: .2 }), s * .07, 1.5, .13, -.15));
  if (u.bando) add(new THREE.BoxGeometry(.045, .66, .33), mat('#ffffff'), 0, 1.3, 0, 0, 0, .62);
  if (u.buttons) [1.44, 1.34, 1.24, 1.14].forEach((y) => add(new THREE.SphereGeometry(.016, 4, 3), mat(u.buttons, { metalness: .85, roughness: .25 }), 0, y, .148));
  if (refl) [1.2, 1.36].forEach((y) => add(cyl(.236, .232, .035), refl, 0, y, 0, 0, 0, 0, 1, 1, .64));
  [-1, 1].forEach((s) => {
    add(new THREE.SphereGeometry(.09, S, 4), J, s * .24, 1.52, 0);
    add(cyl(.068, .06, .36), J, s * .285, 1.33, 0, 0, 0, s * .1);
    add(cyl(.058, .05, .32), J, s * .315, 1.0, .02, -.08, 0, s * .06);
    add(new THREE.SphereGeometry(.055, S, 4), skin, s * .325, .82, .03, 0, 0, 0, .9, 1.15, .8);
    if (refl) add(cyl(.062, .062, .03), refl, s * .3, 1.06, .015, 0, 0, s * .08);
  });
  add(cyl(.055, .06, .1), skin, 0, 1.6, 0);
  if (u.shirt) add(cyl(.068, .07, .05), mat(u.shirt), 0, 1.575, 0);
  add(new THREE.SphereGeometry(.118, S, 4), skin, 0, 1.75, 0, 0, 0, 0, 1, 1.2, 1.08);
  add(new THREE.ConeGeometry(.018, .05, 3), skin, 0, 1.74, .125, Math.PI / 2);
  [-1, 1].forEach((s) => add(new THREE.SphereGeometry(.022, 4, 3), skin, s * .117, 1.75, 0, 0, 0, 0, .5, 1, .8));
  add(new THREE.SphereGeometry(.122, S, 4, 0, 6.3, 0, 1.25), mat('#2f2219'), 0, 1.77, -.008, 0, 0, 0, 1, 1.18, 1.08);
  const y = 1.75;
  if (u.cap === 'peak') {
    add(cyl(.142, .128, .075), mat(u.capC), 0, y + .14, -.005, -.08, 0, 0, 1, 1, 1.08);
    add(cyl(.13, .13, .032), mat(u.band), 0, y + .1, 0, -.08, 0, 0, 1, 1, 1.06);
    add(new THREE.CylinderGeometry(.1, .1, .012, 5, 1, false, -Math.PI / 2, Math.PI), mat(u.visor || '#0d0d0d', { roughness: .2 }), 0, y + .085, .085, .32);
  } else if (u.cap === 'beret') {
    add(new THREE.SphereGeometry(.13, S, 4, 0, 6.3, 0, 1.3), mat(u.capC), .02, y + .085, -.005, 0, 0, -.28, 1.12, .5, 1.1);
  } else if (u.cap === 'helmet') {
    add(new THREE.SphereGeometry(.152, S, 4, 0, 6.3, 0, 1.6), mat(u.capC, { roughness: .3 }), 0, y + .02, 0, 0, 0, 0, 1, 1.05, 1.1);
    add(new THREE.TorusGeometry(.15, .01, 3, 8), mat(u.reflect), 0, y + .06, 0, Math.PI / 2, 0, 0, 1, 1.1, 1);
    add(new THREE.BoxGeometry(.03, .03, .26), mat('#9a9a9a'), 0, y + .165, 0);
  }
  if (u.sabre) { add(new THREE.BoxGeometry(.022, .74, .04), mat('#d0d0d0', { metalness: .9, roughness: .2 }), .29, .58, -.1, .25, 0, -.06); add(new THREE.TorusGeometry(.045, .012, 3, 6), mat(u.buttons || '#d8b45a', { metalness: .8 }), .31, .95, -.02, 0, 1.2, 0); }
  if (u.young) body.scale.setScalar(.9);
  // piattaforma esagonale + anello luminoso + piano di scansione
  add(new THREE.CylinderGeometry(.62, .66, .08, 6), mat('#141a10'), 0, -.04, 0, 0, 0, 0, 1, 1, 1, g);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .012, 4, 6), new THREE.MeshBasicMaterial({ color: u.accent })); ring.rotation.set(Math.PI / 2, 0, Math.PI / 6); ring.position.y = .005; g.add(ring);
  edges.forEach((o) => o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 25), new THREE.LineBasicMaterial({ color: u.accent, transparent: true, opacity: .55 }))));
  const scan = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .012, 6, 1, true), new THREE.MeshBasicMaterial({ color: u.accent, transparent: true, opacity: .35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  g.add(scan);
  return { g, body, scan };
}

/* una scena per ogni combinazione corpo + livello, riusata da tutte le card uguali */
const SCENES = new Map();
function sceneFor(k, lvl) {
  const key = k + '|' + (lvl || 'base');
  if (SCENES.has(key)) return SCENES.get(key);
  const u = variant(k, lvl), sc = new THREE.Scene(), b = build(u);
  sc.add(new THREE.HemisphereLight('#dfe8d0', '#20261a', 1.3));
  const d = new THREE.DirectionalLight('#ffffff', 1.8); d.position.set(2, 3, 3); sc.add(d);
  const rim = new THREE.DirectionalLight(u.accent, 2.2); rim.position.set(-3, 2, -2); sc.add(rim);
  sc.add(b.g);
  const it = { sc, ...b };
  SCENES.set(key, it);
  return it;
}

export function mountSoldiers(root = document, { maxDpr = 1.75 } = {}) {
  const els = [...root.querySelectorAll('[data-soldier]')];
  if (!els.length) return null;
  let canvas = document.getElementById('soldierCanvas');
  if (!canvas) { canvas = document.createElement('canvas'); canvas.id = 'soldierCanvas'; canvas.setAttribute('aria-hidden', 'true'); document.body.appendChild(canvas); }
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, maxDpr)); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.15;
  r.setScissorTest(true); r.setClearColor(0x000000, 0);
  const cam = new THREE.PerspectiveCamera(28, 1, .1, 50);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const views = els.map((el, i) => {
    const v = { el, k: el.dataset.soldier, lvl: el.dataset.lvl, rot: 0, tx: null, ph: i * 1.7 };
    const card = el.closest('[data-soldier-card]') || el;
    card.addEventListener('pointermove', (e) => { const b = el.getBoundingClientRect(); v.tx = ((e.clientX - b.left) / b.width - .5) * 1.6; });
    card.addEventListener('pointerleave', () => (v.tx = null));
    return v;
  });
  const hdr = () => document.getElementById('hdr')?.getBoundingClientRect().bottom || 0;
  const clock = new THREE.Clock();
  let raf = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    const W = innerWidth, H = innerHeight;
    if (canvas.width !== Math.floor(W * r.getPixelRatio()) || canvas.height !== Math.floor(H * r.getPixelRatio())) r.setSize(W, H, false);
    r.setScissor(0, 0, W, H); r.setViewport(0, 0, W, H); r.clear();
    const t = clock.getElapsedTime(), top = hdr();
    for (const v of views) {
      if (!v.el.isConnected || v.el.offsetParent === null) continue;
      const b = v.el.getBoundingClientRect();
      if (b.bottom < top || b.top > H || b.right < 0 || b.left > W || b.width < 2) continue;
      // il riquadro visibile (sotto l'header), per non disegnare sopra il menu
      const vt = Math.max(b.top, top), vh = b.bottom - vt; if (vh <= 0) continue;
      const it = sceneFor(v.k, v.lvl);
      const target = v.tx ?? (reduced ? 0 : Math.sin(t * .45 + v.ph) * .55);
      v.rot += (target - v.rot) * .06;
      it.g.rotation.y = v.rot;
      const k = (t * .45 + v.ph) % 1; it.scan.position.y = k * 2; it.scan.material.opacity = reduced ? 0 : .35 * Math.sin(k * Math.PI);
      cam.aspect = b.width / b.height; cam.position.set(0, 1.12, 5.4); cam.lookAt(0, 1.04, 0); cam.updateProjectionMatrix();
      r.setViewport(b.left, H - b.bottom, b.width, b.height);
      r.setScissor(b.left, H - b.bottom, b.width, vh);
      r.render(it.sc, cam);
    }
  }
  frame();
  return { stop: () => cancelAnimationFrame(raf) };
}
