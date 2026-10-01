/* =====================================================================
   CONCORSI MILITARI ACADEMY · Simulatore in 3D
   Un laptop e uno smartphone che mostrano il simulatore. Lo scroll guida 5 tappe:
   0 accesso · 1 banca dati · 2 allenamento per materia · 3 simulazione a tempo · 4 statistiche
   Gli schermi sono disegnati su canvas (grafica CMA, non screenshot del prodotto).
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const L = window.Lambda || { reduced: false, prog: () => 0 };
const tour = document.getElementById('tour'), stage = document.getElementById('simStage'), cv = document.getElementById('simCanvas');
if (!tour || !cv) throw new Error('sim3d: markup mancante');

/* ---------------- palette e dati che compaiono sugli schermi ---------------- */
const C = { bg: '#0d120b', panel: '#161e13', line: 'rgba(169,185,122,.22)', hud: '#a9b97a', red: '#CD141F', bone: '#F2F1EC', dim: 'rgba(242,241,236,.55)', ok: '#3fbf6a' };
const FONT = "'Space Grotesk', system-ui, sans-serif", MONO = "'JetBrains Mono', ui-monospace, monospace";
// banche dati dalla Libretta Tecnica CMA
const BANCHE = [['Allievi Carabinieri', 'CC', '#B3243A', 10378], ['Allievi Agenti PS', 'PS', '#2D5DA8', 6000], ['VFT Esercito · Marina · AM', 'EI', '#6B7F3A', 26760], ['Marescialli Esercito', 'EI', '#6B7F3A', 31196], ['Marescialli Marina', 'MM', '#22427A', 14694], ['Allievi Agenti Pol. Pen.', 'PP', '#4E6488', 2965]];
const MATERIE = [['Storia', 1897], ['Informatica', 941], ['Matematica', 929], ['Capacità verbale', 814], ['Ragionamento numerico', 790], ['Geografia', 670]];
// domande di esempio scritte da CMA (non tratte dalle banche dati)
const QS = [
  { m: 'Ragionamento numerico', q: 'Quale numero completa la serie: 3, 6, 12, 24, …?', a: ['36', '48', '42', '30'], ok: 1 },
  { m: 'Cittadinanza e Costituzione', q: 'In quale anno è entrata in vigore la Costituzione italiana?', a: ['1946', '1945', '1948', '1950'], ok: 2 },
  { m: 'Geografia', q: 'Qual è il fiume più lungo d’Italia?', a: ['Adige', 'Tevere', 'Arno', 'Po'], ok: 3 },
];
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ---------------- primitive di disegno ---------------- */
function rr(x, c, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); if (c) { x.fillStyle = c; x.fill(); } }
function txt(x, s, X, Y, size, color, weight = 500, font = FONT, align = 'left') { x.font = `${weight} ${size}px ${font}`; x.fillStyle = color; x.textAlign = align; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); }
function wrap(x, s, X, Y, maxW, lh, size, color, weight = 700) {
  x.font = `${weight} ${size}px ${FONT}`; x.fillStyle = color; x.textAlign = 'left';
  let line = '', y = Y;
  for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { x.fillText(line, X, y); line = w; y += lh; } else line = t; }
  x.fillText(line, X, y); return y;
}
function star(x, cx, cy, r, color) {
  x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); }
  x.closePath(); x.fillStyle = color; x.fill();
}
function clock(sec) { sec = Math.max(0, Math.floor(sec)); return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; }

/* intestazione comune: stella, nome, contesto */
function topbar(x, W, m, right) {
  const h = m ? 92 : 64, pad = m ? 30 : 34;
  x.fillStyle = '#0a0e09'; x.fillRect(0, 0, W, h);
  x.fillStyle = C.line; x.fillRect(0, h - 1, W, 1);
  const cy = m ? 62 : 33;
  star(x, pad + 12, cy - 1, 13, C.red);
  txt(x, 'SIMULATORE CMA', pad + 34, cy + 6, m ? 17 : 17, C.bone, 700, MONO);
  if (right && !m) txt(x, right, W - pad, cy + 6, 15, C.hud, 500, MONO, 'right');
  if (m) { x.fillStyle = '#000'; rr(x, '#000', W / 2 - 55, 12, 110, 26, 13); }
  return h;
}

/* ---------------- le 5 schermate (laptop m=false, telefono m=true) ---------------- */
function scrQuiz(x, W, H, t, m, exam = false) {
  const top = topbar(x, W, m, 'Allievi Carabinieri · 10.378 quesiti'), pad = m ? 30 : 60;
  const cyc = 6.5, qi = Math.floor(t / cyc) % QS.length, k = (t % cyc) / cyc, Q = QS[qi];
  const n = 12 + Math.floor(t / cyc) % 20;
  let y = top + (m ? 46 : 50);
  txt(x, `DOMANDA ${n} / 40`, pad, y, m ? 17 : 16, C.hud, 500, MONO);
  // timer
  const tl = exam ? 2280 - t : 45 - (t % cyc) * 4;
  const tw = m ? 112 : 120;
  rr(x, tl < 10 && !exam ? 'rgba(205,20,31,.25)' : 'rgba(242,241,236,.06)', W - pad - tw, y - (m ? 26 : 25), tw, m ? 38 : 36, 18);
  txt(x, clock(tl), W - pad - tw / 2, y, m ? 19 : 18, tl < 10 && !exam ? '#ff6b73' : C.bone, 700, MONO, 'center');
  // barra di avanzamento
  y += m ? 22 : 22; rr(x, 'rgba(242,241,236,.08)', pad, y, W - pad * 2, 6, 3); rr(x, C.red, pad, y, (W - pad * 2) * n / 40, 6, 3);
  y += m ? 56 : 62;
  txt(x, Q.m.toUpperCase(), pad, y, m ? 15 : 14, C.hud, 500, MONO);
  y = wrap(x, Q.q, pad, y + (m ? 46 : 52), W - pad * 2, m ? 42 : 48, m ? 33 : 38, C.bone) + (m ? 46 : 52);
  // risposte: 0-35% nessuna, 35-50% passa sopra una, poi scelta e verifica
  const pick = k > 0.35 ? (k < 0.5 ? (Q.ok + 2) % 4 : Q.ok) : -1, done = k > 0.55;
  const cols = m ? 1 : 2, bw = (W - pad * 2 - (cols - 1) * 18) / cols, bh = m ? 74 : 84;
  Q.a.forEach((a, i) => {
    const cx = pad + (i % cols) * (bw + 18), cy = y + Math.floor(i / cols) * (bh + (m ? 14 : 18));
    const isOk = done && i === Q.ok, sel = i === pick;
    rr(x, isOk ? 'rgba(63,191,106,.2)' : sel ? 'rgba(242,241,236,.1)' : 'rgba(242,241,236,.04)', cx, cy, bw, bh, 16);
    x.lineWidth = 2; x.strokeStyle = isOk ? C.ok : sel ? 'rgba(242,241,236,.5)' : C.line; x.stroke();
    rr(x, isOk ? C.ok : 'rgba(242,241,236,.08)', cx + 16, cy + bh / 2 - 20, 40, 40, 10);
    txt(x, 'ABCD'[i], cx + 36, cy + bh / 2 + 7, 18, isOk ? '#08130b' : C.bone, 700, MONO, 'center');
    txt(x, a, cx + 74, cy + bh / 2 + 9, m ? 25 : 27, done && !isOk ? C.dim : C.bone, 600);
    if (isOk) txt(x, '✓', cx + bw - 26, cy + bh / 2 + 10, 28, C.ok, 700, FONT, 'right');
  });
  if (!m && !exam) { const by = H - 70; txt(x, 'Ripasso errori  ·  Segnala  ·  Salta', pad, by, 15, C.dim, 500, MONO); rr(x, C.red, W - pad - 200, by - 34, 200, 52, 26); txt(x, 'Avanti →', W - pad - 100, by - 1, 19, '#fff', 700, FONT, 'center'); }
}
function scrBanche(x, W, H, t, m) {
  const top = topbar(x, W, m, 'Scegli la banca dati'), pad = m ? 30 : 60;
  let y = top + (m ? 58 : 66);
  txt(x, 'Le tue banche dati', pad, y, m ? 34 : 38, C.bone, 700);
  y += m ? 34 : 38; txt(x, 'Divise per materia', pad, y, m ? 18 : 18, C.dim, 500);
  const act = Math.floor(t / 1.6) % BANCHE.length;
  const rows = m ? BANCHE.slice(0, 6) : BANCHE, listW = m ? W - pad * 2 : W * 0.52, rh = m ? 84 : 78;
  y += m ? 34 : 36;
  rows.forEach((b, i) => {
    const ry = y + i * (rh + 10), on = i === act;
    rr(x, on ? 'rgba(205,20,31,.16)' : 'rgba(242,241,236,.04)', pad, ry, listW, rh, 16);
    x.lineWidth = 2; x.strokeStyle = on ? C.red : C.line; x.stroke();
    rr(x, b[2], pad + 16, ry + rh / 2 - 21, 52, 42, 10);
    txt(x, b[1], pad + 42, ry + rh / 2 + 7, 17, '#fff', 700, MONO, 'center');
    txt(x, b[0], pad + 86, ry + rh / 2 - 4, m ? 21 : 21, C.bone, 700);
    txt(x, `${fmt(b[3])} quesiti`, pad + 86, ry + rh / 2 + 22, 15, on ? '#f3c9cc' : C.hud, 500, MONO);
  });
  if (!m) {
    // pannello di dettaglio: materie della banca dati Allievi Carabinieri
    const px = pad + listW + 30, pw = W - px - pad; let py = y;
    rr(x, C.panel, px, py, pw, H - py - 46, 22); x.strokeStyle = C.line; x.stroke();
    txt(x, 'MATERIE · ALLIEVI CC', px + 28, py + 46, 14, C.hud, 500, MONO);
    MATERIE.forEach(([n, v], i) => {
      const yy = py + 92 + i * 62, grow = Math.min(1, Math.max(0, (t % 6) * 1.2 - i * 0.15));
      txt(x, n, px + 28, yy, 18, C.bone, 600); txt(x, fmt(v), px + pw - 28, yy, 15, C.dim, 500, MONO, 'right');
      rr(x, 'rgba(242,241,236,.07)', px + 28, yy + 12, pw - 56, 8, 4); rr(x, i ? C.hud : C.red, px + 28, yy + 12, (pw - 56) * (v / 1897) * grow, 8, 4);
    });
  }
}
function scrExam(x, W, H, t, m) {
  const top = topbar(x, W, m, 'Simulazione d’esame'), pad = m ? 30 : 60;
  const left = 2400 - (t * 7) % 2400, done = Math.min(40, Math.floor((t * 1.6) % 46));
  const R = m ? 128 : 150, cx = m ? W / 2 : pad + R + 20, cy = m ? top + 60 + R : H / 2 + 26;
  x.lineCap = 'round';
  x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.strokeStyle = 'rgba(242,241,236,.08)'; x.lineWidth = 16; x.stroke();
  x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left / 2400); x.strokeStyle = C.red; x.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; x.fillStyle = i % 5 ? 'rgba(169,185,122,.25)' : C.hud; x.fillRect(cx + Math.cos(a) * (R - 30) - 1.5, cy + Math.sin(a) * (R - 30) - 1.5, 3, 3); }
  txt(x, clock(left), cx, cy + 14, m ? 48 : 56, C.bone, 700, MONO, 'center');
  txt(x, 'TEMPO RESTANTE', cx, cy + (m ? 48 : 52), 13, C.hud, 500, MONO, 'center');
  // griglia delle 40 domande
  const gx = m ? pad : cx + R + 70, gy = m ? cy + R + 60 : top + 110, gw = W - gx - pad, colsN = m ? 8 : 8, cell = (gw - (colsN - 1) * 10) / colsN, ch = m ? cell * 0.8 : Math.min(cell * 0.72, 62);
  txt(x, 'Simulazione d’esame', gx, gy - (m ? 22 : 40), m ? 26 : 32, C.bone, 700);
  if (!m) txt(x, '40 domande · come il giorno della prova', gx, gy - 12, 16, C.dim, 500);
  for (let i = 0; i < 40; i++) {
    const X = gx + (i % colsN) * (cell + 10), Y = gy + 10 + Math.floor(i / colsN) * (ch + 10);
    const st = i < done ? (i % 9 === 4 ? 'flag' : 'ok') : i === done ? 'cur' : 'todo';
    rr(x, st === 'ok' ? 'rgba(169,185,122,.3)' : st === 'flag' ? 'rgba(205,20,31,.3)' : st === 'cur' ? 'rgba(242,241,236,.18)' : 'rgba(242,241,236,.05)', X, Y, cell, ch, 10);
    if (st === 'cur') { x.strokeStyle = C.bone; x.lineWidth = 2; x.stroke(); }
    txt(x, String(i + 1), X + cell / 2, Y + ch / 2 + 6, m ? 15 : 16, st === 'todo' ? C.dim : C.bone, 600, MONO, 'center');
  }
  const ly = gy + 10 + 5 * (ch + 10) + (m ? 36 : 40);
  txt(x, `Risposte date ${done}/40`, gx, ly, m ? 19 : 19, C.bone, 700);
  if (!m) { rr(x, 'rgba(169,185,122,.3)', gx + 250, ly - 15, 16, 16, 4); txt(x, 'data', gx + 274, ly, 15, C.dim); rr(x, 'rgba(205,20,31,.3)', gx + 340, ly - 15, 16, 16, 4); txt(x, 'da rivedere', gx + 364, ly, 15, C.dim); }
}
function scrStats(x, W, H, t, m) {
  const top = topbar(x, W, m, 'I tuoi progressi'), pad = m ? 30 : 60;
  const g = Math.min(1, (t % 8) / 2.2), e = 1 - Math.pow(1 - g, 3);
  txt(x, 'DATI DI ESEMPIO', W - pad, top + (m ? 44 : 50), 13, C.red, 700, MONO, 'right');
  txt(x, 'I tuoi progressi', pad, top + (m ? 50 : 56), m ? 30 : 36, C.bone, 700);
  // anello del punteggio
  const R = m ? 82 : 96, cx = pad + R + 6, cy = top + (m ? 90 : 110) + R;
  x.lineCap = 'round'; x.lineWidth = 16;
  x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.strokeStyle = 'rgba(242,241,236,.08)'; x.stroke();
  x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.86 * e); x.strokeStyle = C.ok; x.stroke();
  txt(x, `${Math.round(86 * e)}%`, cx, cy + 14, m ? 40 : 46, C.bone, 700, FONT, 'center');
  txt(x, 'RISPOSTE ESATTE', cx, cy + (m ? 40 : 44), 11, C.hud, 500, MONO, 'center');
  // materie
  const mat = [['Storia', 0.78], ['Matematica', 0.91], ['Capacità verbale', 0.84], ['Geografia', 0.69], ['Informatica', 0.88]];
  const bx = m ? cx + R + 40 : pad, bw = m ? W - bx - pad : W * 0.4, by = m ? cy - R + 10 : cy + R + 60;
  mat.slice(0, m ? 4 : 5).forEach(([n, v], i) => {
    const yy = by + i * (m ? 44 : 50);
    txt(x, n, bx, yy, m ? 16 : 16, C.bone, 600); txt(x, `${Math.round(v * 100 * e)}`, bx + bw, yy, 14, C.dim, 500, MONO, 'right');
    rr(x, 'rgba(242,241,236,.07)', bx, yy + 9, bw, 7, 4); rr(x, v < 0.75 ? C.red : C.hud, bx, yy + 9, bw * v * e, 7, 4);
  });
  // andamento delle simulazioni
  const lx = m ? pad : bx + bw + 60, lw = W - lx - pad, ly = m ? cy + R + 60 : top + 120, lh = m ? H - ly - 70 : H - ly - 110;
  rr(x, C.panel, lx, ly, lw, lh, 20); x.strokeStyle = C.line; x.lineWidth = 1.5; x.stroke();
  txt(x, 'ANDAMENTO SIMULAZIONI', lx + 22, ly + 36, 12, C.hud, 500, MONO);
  const pts = [0.42, 0.48, 0.47, 0.56, 0.61, 0.6, 0.69, 0.74, 0.79, 0.86];
  const X0 = lx + 24, X1 = lx + lw - 24, Y0 = ly + lh - 26, Y1 = ly + 60;
  for (let i = 0; i < 4; i++) { x.fillStyle = 'rgba(242,241,236,.06)'; x.fillRect(X0, Y1 + i * (Y0 - Y1) / 3, X1 - X0, 1); }
  x.beginPath(); const shown = 1 + (pts.length - 1) * e;
  pts.forEach((p, i) => { if (i > shown) return; const X = X0 + (X1 - X0) * i / (pts.length - 1), Y = Y0 - (Y0 - Y1) * p; i ? x.lineTo(X, Y) : x.moveTo(X, Y); });
  x.strokeStyle = C.red; x.lineWidth = 4; x.lineJoin = 'round'; x.stroke();
  pts.forEach((p, i) => { if (i > shown) return; const X = X0 + (X1 - X0) * i / (pts.length - 1), Y = Y0 - (Y0 - Y1) * p; x.beginPath(); x.arc(X, Y, 5, 0, Math.PI * 2); x.fillStyle = C.bone; x.fill(); });
  if (!m) { const yy = H - 60; txt(x, 'Da ripassare: Geografia · 41 errori', pad, yy, 17, C.bone, 600); rr(x, 'rgba(205,20,31,.18)', W - pad - 260, yy - 33, 260, 50, 25); txt(x, 'Ripassa gli errori →', W - pad - 130, yy - 1, 17, '#ffd5d8', 700, FONT, 'center'); }
}
const SCREENS = [(x, W, H, t, m) => scrQuiz(x, W, H, t, m), scrBanche, (x, W, H, t, m) => scrQuiz(x, W, H, t + 2, m), scrExam, scrStats];

/* ---------------- scena ---------------- */
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0.6, 9);

scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0xcd141f, 2.4); rim.position.set(-5, 2, -4); scene.add(rim);
const rim2 = new THREE.DirectionalLight(0xa9b97a, 1.2); rim2.position.set(5, -1, -3); scene.add(rim2);

function screenTex(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return { c, x: c.getContext('2d'), t };
}
const metal = new THREE.MeshStandardMaterial({ color: 0x2b302a, metalness: 0.85, roughness: 0.32 });
const dark = new THREE.MeshStandardMaterial({ color: 0x0b0d0a, metalness: 0.3, roughness: 0.6 });

/* laptop */
const laptop = new THREE.Group();
const base = new THREE.Mesh(new RoundedBoxGeometry(3.3, 0.12, 2.2, 4, 0.05), metal); laptop.add(base);
const kb = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.05), new THREE.MeshStandardMaterial({ color: 0x0e110d, roughness: 0.85 }));
kb.rotation.x = -Math.PI / 2; kb.position.set(0, 0.062, -0.38); laptop.add(kb);
// tasti: una griglia leggera, così il piano non sembra vuoto
const keyG = new THREE.BoxGeometry(0.17, 0.02, 0.15), keyM = new THREE.MeshStandardMaterial({ color: 0x1a1e18, roughness: 0.7 });
const keys = new THREE.InstancedMesh(keyG, keyM, 14 * 5); let ki = 0; const dm = new THREE.Object3D();
for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) { dm.position.set(-1.33 + c * 0.205, 0.07, -0.8 + r * 0.205); dm.updateMatrix(); keys.setMatrixAt(ki++, dm.matrix); }
laptop.add(keys);
const pad = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6), new THREE.MeshStandardMaterial({ color: 0x232822, metalness: 0.6, roughness: 0.4 }));
pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.062, 0.62); laptop.add(pad);
const hinge = new THREE.Group(); hinge.position.set(0, 0.06, -1.1); laptop.add(hinge);
const lid = new THREE.Mesh(new RoundedBoxGeometry(3.3, 2.12, 0.07, 4, 0.04), metal); lid.position.set(0, 1.06, 0); hinge.add(lid);
const bez = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.02), dark); bez.position.set(0, 1.06, 0.0365); hinge.add(bez);
const LS = screenTex(1280, 800);
const lscreen = new THREE.Mesh(new THREE.PlaneGeometry(3.04, 1.9), new THREE.MeshBasicMaterial({ map: LS.t, toneMapped: false }));
lscreen.position.set(0, 1.08, 0.038); hinge.add(lscreen);
// stella CMA sul retro del coperchio
const backStar = new THREE.Mesh(new THREE.CircleGeometry(0.2, 5), new THREE.MeshStandardMaterial({ color: 0xcd141f, metalness: 0.4, roughness: 0.3, emissive: 0x3a0306 }));
backStar.position.set(0, 1.06, -0.037); backStar.rotation.set(0, Math.PI, Math.PI / 2 * 0.2); hinge.add(backStar);
const lglow = new THREE.PointLight(0xa9b97a, 1.2, 4); lglow.position.set(0, 1, 0.8); hinge.add(lglow);
scene.add(laptop);

/* smartphone */
const phone = new THREE.Group();
phone.add(new THREE.Mesh(new RoundedBoxGeometry(0.94, 1.94, 0.09, 6, 0.12), metal));
const pfront = new THREE.Mesh(new RoundedBoxGeometry(0.9, 1.9, 0.01, 6, 0.005), dark); pfront.position.z = 0.043; phone.add(pfront);
const PS = screenTex(450, 950);
const pscreen = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.84 * 950 / 450), new THREE.MeshBasicMaterial({ map: PS.t, toneMapped: false }));
pscreen.position.z = 0.05; phone.add(pscreen);
const cam = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.3, 0.04, 3, 0.06), dark); cam.position.set(-0.24, 0.66, -0.06); phone.add(cam);
scene.add(phone);

/* base HUD: anelli e spazzata radar sotto i dispositivi */
const hud = new THREE.Group(); hud.position.y = -1.45; scene.add(hud);
[1.6, 2.6, 3.6].forEach((r, i) => {
  const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.012, 128), new THREE.MeshBasicMaterial({ color: 0xa9b97a, transparent: true, opacity: 0.35 - i * 0.08, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; hud.add(ring);
});
const sw = document.createElement('canvas'); sw.width = sw.height = 256;
{ const g = sw.getContext('2d'), gr = g.createConicGradient(0, 128, 128); gr.addColorStop(0, 'rgba(169,185,122,0)'); gr.addColorStop(0.85, 'rgba(169,185,122,0)'); gr.addColorStop(1, 'rgba(169,185,122,.28)'); g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill(); }
const sweep = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sw), transparent: true, depthWrite: false }));
sweep.rotation.x = -Math.PI / 2; sweep.position.y = 0.002; hud.add(sweep);
// particelle
const PN = 260, pg = new THREE.BufferGeometry(), pp = new Float32Array(PN * 3);
for (let i = 0; i < PN; i++) { pp[i * 3] = (Math.random() - 0.5) * 14; pp[i * 3 + 1] = Math.random() * 6 - 2; pp[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1; }
pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xa9b97a, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false })); scene.add(dust);

/* ---------------- tappe: posizione e rotazione dei dispositivi ---------------- */
// [laptop x,y,z, rx,ry,rz | phone x,y,z, rx,ry,rz]
const KF = [
  [0.85, -0.55, 0, 0.18, -0.5, 0, 2.55, -0.25, 1.3, 0.04, -0.32, 0.07],
  [0.55, -0.5, 0.7, 0.1, -0.16, 0, 2.75, -0.6, -0.6, 0.02, -0.6, 0.02],
  [1.75, -0.55, -1.6, 0.16, -0.62, 0, 1.15, -0.12, 1.8, 0.02, -0.18, 0.02],
  [0.6, -0.5, 0.85, 0.06, 0.12, 0, 2.65, -0.55, -0.3, 0.02, -0.55, 0.08],
  [1.3, -0.55, 0.1, 0.16, 0.38, 0, 2.75, -0.45, 1.5, 0.04, -0.38, -0.06],
];
// su telefono: dispositivi centrati nella metà alta, testo sotto
const KFM = [
  [-0.35, 1.4, -0.4, 0.22, -0.35, 0, 1, 1.3, 1.2, 0.04, -0.3, 0.06],
  [0, 1.4, 0.2, 0.14, -0.08, 0, 1.6, 0.95, -1.2, 0.02, -0.5, 0.02],
  [0.9, 1.5, -2.2, 0.18, -0.55, 0, -0.05, 1.5, 1.9, 0.02, -0.1, 0.02],
  [0, 1.4, 0.3, 0.1, 0.06, 0, 1.6, 0.95, -1, 0.02, -0.5, 0.08],
  [-0.1, 1.4, -0.4, 0.2, 0.42, 0, 1.0, 1.35, 1, 0.04, -0.35, -0.06],
];
const N = KF.length;
let W = 1, H = 1, mobile = false;
function resize() {
  const r = stage.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
  mobile = W / H < 0.9;
  renderer.setSize(W, H, false); camera.aspect = W / H;
  camera.fov = mobile ? 44 : 32;
  camera.position.set(mobile ? 0.4 : 0, mobile ? 0.9 : 0.6, mobile ? 9.6 : 9);
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const smooth = (k) => k * k * (3 - 2 * k);
const lerp = (a, b, k) => a + (b - a) * k;
let cur = 0, mx = 0, my = 0, tmx = 0, tmy = 0, lastScr = [-1, -1], visible = true, lidOpen = L.reduced ? 1 : 0;
addEventListener('pointermove', (e) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; });
new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(tour);

/* testi della tappa e indice laterale */
const steps = [...document.querySelectorAll('[data-sstep]')], dots = [...document.querySelectorAll('[data-sdot]')], bar = document.getElementById('simBar');
let shown = -1;
function setStep(i) {
  if (i === shown) return; shown = i;
  steps.forEach((s, k) => s.classList.toggle('on', k === i));
  dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('past', k < i); });
}
dots.forEach((d, k) => d.addEventListener('click', () => {
  const top = tour.getBoundingClientRect().top + scrollY, span = tour.offsetHeight - innerHeight;
  const y = top + span * (k / (N - 1));
  L.lenis ? L.lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
}));

const clockT = new THREE.Clock();
let lastDraw = 0;
document.fonts && document.fonts.ready.then(() => { lastScr = [-1, -1]; });

function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const t = clockT.getElapsedTime();
  const target = Math.min(1, Math.max(0, L.prog(tour))) * (N - 1);
  cur += (target - cur) * (L.reduced ? 1 : 0.075);
  const i0 = Math.min(N - 2, Math.floor(cur)), k = smooth(cur - i0), set = mobile ? KFM : KF;
  const a = set[i0], b = set[i0 + 1], v = a.map((n, j) => lerp(n, b[j], k));
  mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
  const fl = L.reduced ? 0 : 1;
  laptop.position.set(v[0], v[1] + Math.sin(t * 0.8) * 0.04 * fl, v[2]);
  laptop.rotation.set(v[3] + my * 0.06, v[4] + mx * 0.18, v[5]);
  phone.position.set(v[6], v[7] + Math.sin(t * 1.1 + 1) * 0.07 * fl, v[8]);
  phone.rotation.set(v[9] + my * 0.08, v[10] + mx * 0.25, v[11] + Math.sin(t * 0.7) * 0.02 * fl);
  // apertura del coperchio all'arrivo
  lidOpen = Math.min(1, lidOpen + 0.012);
  const lo = 1 - Math.pow(1 - lidOpen, 3);
  hinge.rotation.x = lerp(Math.PI / 2 - 0.02, -0.22, lo);
  hud.position.x = mobile ? 0.3 : 1.4; hud.position.y = mobile ? 0.3 : -1.45;
  sweep.rotation.z = -t * 0.8;
  dust.rotation.y = t * 0.02;

  // schermate: si cambia a metà del passaggio, con un attimo di "spegnimento"
  const si = Math.round(cur), mid = Math.abs((cur % 1) - 0.5), dip = L.reduced ? 1 : Math.min(1, 0.25 + mid * 3);
  lscreen.material.color.setScalar(dip * Math.min(1, lo * 1.4)); pscreen.material.color.setScalar(dip);
  if (t - lastDraw > 1 / 20 || si !== lastScr[0]) {
    lastDraw = t; lastScr[0] = si;
    const draw = (S, m) => { S.x.fillStyle = C.bg; S.x.fillRect(0, 0, S.c.width, S.c.height); SCREENS[si](S.x, S.c.width, S.c.height, t, m); S.t.needsUpdate = true; };
    draw(LS, false); draw(PS, true);
  }
  setStep(si);
  if (bar) bar.style.transform = `scaleY(${cur / (N - 1)})`;
  renderer.render(scene, camera);
}
frame();
stage.classList.add('ready');
