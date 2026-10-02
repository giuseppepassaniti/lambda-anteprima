/* =====================================================================
   LAMBDA · la sede di Cagliari, ricostruita in 3D dalle foto reali (stile illustrato)
   Facciata in listelli di mattone, due vetrine con telaio nero (Concorsi Militari Academy e
   Centro Studi Lambda). Dentro: reception a sinistra dietro la vetrina, attesa con le
   poltroncine, divano sotto il logo, gradini in travertino con parapetto in vetro e arco verso
   l'aula studio rialzata; a destra in fondo l'ufficio per i colloqui.
   Coordinate: x = larghezza (-4.5..4.5), z = profondità (strada a +z), y = altezza.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const FONT = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';
const C = { green: '#3c5c48', logo: '#2f5242', charcoal: '#2b2e2f', brick: '#c98d5c', trav: '#ddd2bb', oak: '#c49a6c', white: '#f6f6f4', black: '#161718',
  mustard: '#e0a23a', sage: '#9db59a', jute: '#c7b08a', red: '#CD141F' };

export function buildCagliari({ cma = false, outdoorLight = true } = {}) {
  const g = new THREE.Group(), mats = {};
  const std = (color, o = {}) => { const k = color + JSON.stringify(o); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o })); };
  const box = (w, h, d, mat, x, y, z, r = 0.012) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), typeof mat === 'string' ? std(mat) : mat); m.position.set(x, y, z); g.add(m); return m; };
  const plane = (w, h, mat, x, y, z, ry = 0, rx = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); g.add(m); return m; };
  const tex = (w, h, draw, repeat) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t; };
  const basic = (t, o = {}) => new THREE.MeshBasicMaterial({ map: t, toneMapped: false, ...o });
  const txt = (x, s, X, Y, size, color, w = 700, font = FONT, align = 'left') => { x.font = `${w} ${size}px ${font}`; x.fillStyle = color; x.textAlign = align; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); };
  const star = (x, cx, cy, r, color) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } x.closePath(); x.fillStyle = color; x.fill(); };
  const glasses = (x, cx, cy, r, color, lw) => { x.strokeStyle = color; x.lineWidth = lw; [-1, 1].forEach((s) => { x.beginPath(); x.arc(cx + s * r * 1.15, cy, r, 0, 7); x.stroke(); }); x.beginPath(); x.moveTo(cx - r * 0.25, cy - r * 0.1); x.quadraticCurveTo(cx, cy - r * 0.45, cx + r * 0.25, cy - r * 0.1); x.stroke(); };
  const noise = (x, w, h, base, n, a) => { x.fillStyle = base; x.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${Math.random() * a})`; x.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 2 + Math.random() * 3); } };

  if (outdoorLight) { const sun = new THREE.DirectionalLight('#fff3df', 1.5); sun.position.set(-5, 12, 18); sun.target.position.set(0, 1, 5); g.add(sun, sun.target); g.add(new THREE.HemisphereLight('#ffffff', '#b9b2a6', 0.55)); }
  else { [[-2.5, 2.5], [2.5, 1.0], [-1.5, -5.5], [3, -5.5]].forEach(([x, z]) => { const l = new THREE.PointLight('#ffffff', 4, 10, 1.2); l.position.set(x, 1.8, z); g.add(l); }); }

  /* ---------- materiali ---------- */
  const floorT = tex(512, 512, (x, w, h) => { for (let r = 0; r < 6; r++) { const off = (r % 2) * 160; for (let k = -1; k < 3; k++) { const l = 150 + Math.random() * 22; x.fillStyle = `rgb(${l + 48},${l + 22},${l - 8})`; x.fillRect(off + k * 320, r * 85, 318, 83); } } x.fillStyle = 'rgba(60,30,10,.12)'; for (let r = 0; r < 6; r++) x.fillRect(0, r * 85 + 83, w, 2); }, [3, 4]);
  const floorM = new THREE.MeshStandardMaterial({ map: floorT, roughness: 0.55 });
  const brickT = tex(512, 512, (x, w, h) => { x.fillStyle = '#d8c3a8'; x.fillRect(0, 0, w, h); for (let r = 0; r < 32; r++) { const off = (r % 2) * 32; for (let k = -1; k < 9; k++) { const t = Math.random() * 30; x.fillStyle = `rgb(${200 + t},${135 + t * 0.6},${85 + t * 0.3})`; x.fillRect(off + k * 64 + 1, r * 16 + 1, 62, 13); } } }, [3, 2]);
  const brickM = new THREE.MeshStandardMaterial({ map: brickT, roughness: 0.95 });
  const travM = new THREE.MeshStandardMaterial({ map: tex(256, 256, (x, w, h) => noise(x, w, h, C.trav, 1600, 0.08)), roughness: 0.8 });
  const glassM = new THREE.MeshStandardMaterial({ color: '#cfe0e2', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false, side: THREE.DoubleSide });
  const blackFr = std('#1a1b1c', { roughness: 0.45, metalness: 0.3 });

  /* =====================================================================
     ESTERNO
     ===================================================================== */
  const FZ = 5, EZ = FZ + 0.13;
  const paveT = tex(256, 256, (x, w, h) => { noise(x, w, h, '#c9c4bc', 800, 0.07); x.strokeStyle = 'rgba(0,0,0,.1)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } }, [10, 2]);
  plane(26, 3.4, new THREE.MeshStandardMaterial({ map: paveT, roughness: 0.9 }), 0, 0.004, FZ + 1.7, 0, -Math.PI / 2);
  plane(26, 8, std('#56595b', { roughness: 0.95 }), 0, 0.006, FZ + 7.4, 0, -Math.PI / 2);
  box(26, 0.14, 0.2, '#9a958d', 0, 0.07, FZ + 3.4);
  // muro in listelli; sopra la fascia grigia a doghe
  [[-8.5, 7.8], [8.6, 7.8]].forEach(([x, w]) => plane(w, 3.4, brickM, x, 1.7, EZ));
  plane(1.2, 3.4, brickM, -0.55, 1.7, EZ);                       // pilastro tra le vetrine
  plane(26, 1.0, brickM, 0, 3.0, EZ - 0.001);
  for (let i = 0; i < 6; i++) box(26, 0.16, 0.06, std(i % 2 ? '#8a9095' : '#7b8186', { roughness: 0.6 }), 0, 3.6 + i * 0.18, EZ + 0.03, 0.01);
  plane(26, 3, std('#9aa0a4'), 0, 6.1, EZ);
  // insegna a cassonetto
  const signBox = (cx, w, bg, t) => { box(w, 0.62, 0.22, std(bg, { roughness: 0.5 }), cx, 3.05, FZ + 0.25, 0.02);
    const T = tex(1024, 140, (x, W, H) => { x.fillStyle = bg; x.fillRect(0, 0, W, H); txt(x, t, W / 2, H / 2 + 18, 50, '#ffffff', 700, FONT, 'center'); });
    plane(w - 0.06, 0.56, basic(T), cx, 3.05, FZ + 0.362); };
  signBox(-2.75, 3.6, C.charcoal, 'CONCORSI MILITARI ACADEMY');
  signBox(1.95, 3.6, C.green, 'CENTRO STUDI LAMBDA');
  // cornici in travertino attorno alle aperture
  const opening = (x0, x1) => { const cx = (x0 + x1) / 2, w = x1 - x0;
    box(w + 0.3, 0.16, 0.3, travM, cx, 2.58, FZ + 0.1); box(0.15, 2.6, 0.3, travM, x0 - 0.07, 1.3, FZ + 0.1); box(0.15, 2.6, 0.3, travM, x1 + 0.07, 1.3, FZ + 0.1);
    box(w, 0.08, 0.1, blackFr, cx, 0.04, FZ + 0.03); box(w, 0.07, 0.1, blackFr, cx, 2.47, FZ + 0.03); plane(w, 2.45, glassM, cx, 1.25, FZ + 0.02); };
  opening(-4.4, -1.2); opening(0.1, 3.7);
  // porta d'ingresso (parte sinistra dell'apertura Lambda) con maniglione in acciaio
  [0.15, 1.25].forEach((x) => box(0.07, 2.42, 0.1, blackFr, x, 1.22, FZ + 0.05));
  box(1.1, 0.07, 0.1, blackFr, 0.7, 2.05, FZ + 0.05);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9), std('#c9cccc', { metalness: 0.85, roughness: 0.25 })); handle.position.set(0.85, 1.05, FZ + 0.16); handle.rotation.z = -0.75; g.add(handle);
  box(1.0, 0.012, 0.6, '#222', 0.7, 0.01, FZ + 0.5, 0.004);
  // vetrofanie
  const dCma = tex(1024, 300, (x, W, H) => { x.fillStyle = 'rgba(255,255,255,.95)'; x.fillRect(0, 0, W, H); x.strokeStyle = '#2d4a33'; x.lineWidth = 6; x.beginPath(); x.arc(150, 150, 100, 0, 7); x.stroke(); star(x, 150, 156, 74, C.red); txt(x, 'VINCI I CONCORSI', 290, 128, 62, '#2b2e2f'); txt(x, 'PER LE FORZE', 290, 200, 62, '#2b2e2f'); txt(x, 'ARMATE O DI POLIZIA', 290, 272, 62, '#2b2e2f'); });
  plane(3.0, 0.88, basic(dCma, { transparent: true, side: THREE.DoubleSide }), -2.8, 1.65, FZ + 0.03);
  const dLam = tex(1024, 360, (x, W, H) => { x.fillStyle = 'rgba(255,255,255,.95)'; x.fillRect(0, 0, W, H); txt(x, 'CENTRO STUDI LAMBDA', 30, 70, 54, '#1c2a24'); x.fillStyle = C.green; x.fillRect(30, 90, 720, 52); txt(x, 'METODO DI STUDIO E RIPETIZIONI', 46, 128, 36, '#fff'); txt(x, 'Uniamo l\'innovazione dei metodi di studio', 30, 186, 32, '#1c2a24', 500); txt(x, 'personalizzati alle ripetizioni tradizionali.', 30, 226, 32, '#1c2a24', 500); ['Metodo di studio', 'Supporto DSA e BES', 'Ripetizioni', 'Recupero debiti'].forEach((s, i) => txt(x, '• ' + s, 30 + (i % 2) * 420, 290 + Math.floor(i / 2) * 40, 28, '#1c2a24', 600)); });
  plane(2.3, 0.81, basic(dLam, { transparent: true, side: THREE.DoubleSide }), 2.5, 1.45, FZ + 0.03);
  const orari = tex(256, 256, (x, W, H) => { x.clearRect(0, 0, W, H); txt(x, 'Orario di lavoro', 128, 60, 26, 'rgba(255,255,255,.9)', 600, FONT, 'center'); ['Lun – Ven', '15:00 – 20:00', 'Sabato', '10:00 – 13:00 · 14:00 – 18:00'].forEach((s, i) => txt(x, s, 128, 104 + i * 34, i % 2 ? 18 : 22, 'rgba(255,255,255,.85)', 500, FONT, 'center')); });
  plane(0.6, 0.6, basic(orari, { transparent: true }), 0.7, 1.6, FZ + 0.035);
  // targa con QR e numeri civici
  const plaqueT = tex(256, 300, (x, w, h) => { x.fillStyle = '#fafafa'; x.fillRect(0, 0, w, h); star(x, 96, 52, 18, C.red); glasses(x, 160, 52, 15, C.logo, 5); txt(x, 'CENTRO STUDI', w / 2, 104, 22, C.logo, 700, FONT, 'center'); txt(x, 'LAMBDA', w / 2, 130, 26, C.logo, 700, FONT, 'center'); txt(x, 'cosa dicono di noi', w / 2, 160, 16, '#333', 500, FONT, 'center'); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if ((i * 5 + j * 3 + i * j) % 3 === 0) { x.fillStyle = '#111'; x.fillRect(84 + i * 10, 176 + j * 10, 10, 10); } });
  plane(0.72, 0.84, basic(plaqueT), -0.55, 1.65, EZ + 0.01);
  // pluviale
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.4), std('#9da2a6')); pipe.position.set(-5.1, 1.7, EZ + 0.08); g.add(pipe);

  /* =====================================================================
     INTERNO
     ===================================================================== */
  const W2 = 4.5, BACK = -8;
  plane(9, 13, floorM, 0, 0.002, -1.5, 0, -Math.PI / 2);
  plane(9, 13, std('#fbfbfa'), 0, 3.0, -1.5, 0, Math.PI / 2);
  plane(13, 3, std(C.white), -W2, 1.5, -1.5, Math.PI / 2);
  plane(13, 3, std(C.white), W2, 1.5, -1.5, -Math.PI / 2);
  plane(9, 3, std(C.white), 0, 1.5, BACK);
  // muro frontale interno
  [[-4.47, 0.06], [-0.55, 1.3], [4.1, 0.8]].forEach(([x, w]) => box(w, 3, 0.2, C.white, x, 1.5, FZ - 0.08));
  box(9, 0.5, 0.2, C.white, 0, 2.75, FZ - 0.08);
  // controsoffitto curvo con faretti (lato sinistro)
  const bulk = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.32, 48, 1, false, Math.PI / 2, Math.PI), std('#fdfdfc')); bulk.scale.set(0.9, 1, 1.4); bulk.position.set(-4.5, 2.84, 0.5); g.add(bulk);
  [[-3.2, 3.6], [-2.4, 2.2], [-1.9, 0.6], [-1.9, -1.0], [-2.4, -2.6], [1.5, 2.5], [2.6, -0.5], [1.0, 0.3]].forEach(([x, z]) => { const d = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), new THREE.MeshBasicMaterial({ color: '#ffffff' })); d.rotation.x = Math.PI / 2; d.position.set(x, x < -1.5 ? 2.67 : 2.99, z); g.add(d); });
  [[0.8, 1.4], [2.2, -2.2]].forEach(([x, z]) => { box(0.62, 0.04, 0.62, '#eeeeee', x, 2.98, z, 0.005); box(0.4, 0.045, 0.1, '#bbb', x, 2.97, z, 0.005); });   // condizionatori a cassetta
  const lights = [];
  [[-2.5, 3.2], [2.5, 2.8], [0, 0], [-1.6, -5.6], [3, -5.8]].forEach(([x, z]) => { const l = new THREE.PointLight('#fff6ec', 6.5, 9, 1.4); l.position.set(x, 2.5, z); g.add(l); lights.push(l); });

  const logoT = tex(512, 512, (x, w, h) => { x.fillStyle = C.logo; x.beginPath(); x.arc(256, 256, 254, 0, 7); x.fill(); x.strokeStyle = '#e9ecea'; x.lineWidth = 5; x.beginPath(); x.arc(186, 168, 46, 0, 7); x.stroke(); star(x, 186, 172, 32, '#e9ecea'); glasses(x, 322, 160, 20, '#e9ecea', 7); [0, 1, 2].forEach((i) => { x.fillStyle = '#e9ecea'; x.fillRect(288, 186 + i * 14, 70 - i * 6, 9); }); txt(x, 'CENTRO STUDI', 256, 300, 46, '#e9ecea', 700, FONT, 'center'); txt(x, 'LAMBDA', 256, 372, 80, '#e9ecea', 700, FONT, 'center'); });
  const logoM = basic(logoT, { transparent: true });
  const logo = (r, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 48), logoM); m.position.set(x, y, z); m.rotation.y = ry; g.add(m); };
  const plant = (x, z, s = 1, y0 = 0) => { const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * s, 0.14 * s, 0.32 * s, 20), std('#f4f4f2')); pot.position.set(x, y0 + 0.16 * s, z); g.add(pot); for (let i = 0; i < 8; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.18 * s, 10, 8), std('#2f7d4f', { roughness: 0.8, flatShading: true })); l.scale.set(0.5, 0.12, 1.4); l.position.set(x + Math.cos(i) * 0.16 * s, y0 + (0.45 + (i % 3) * 0.13) * s, z + Math.sin(i * 1.9) * 0.16 * s); l.rotation.set(0.6, i * 0.8, 0.3); g.add(l); } };

  /* ---------- RECEPTION: a sinistra, dietro la vetrina CMA ---------- */
  box(1.6, 0.76, 0.7, C.white, -2.8, 0.38, 3.4, 0.02);
  box(1.66, 0.04, 0.76, C.white, -2.8, 0.77, 3.4, 0.01);
  [-3.3, -2.3].forEach((x) => { box(0.1, 0.72, 0.6, C.white, x, 0.36, 3.4); });
  const chair = (x, z, ry) => { const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = ry; g.add(c); const m = std('#1c1d1f', { roughness: 0.55 });
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.48, 2, 0.03), m); s.position.y = 0.48; c.add(s);
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.72, 0.06, 2, 0.03), m); b.position.set(0, 0.92, 0.25); b.rotation.x = -0.1; c.add(b);
    const hd = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.14, 0.06, 2, 0.03), m); hd.position.set(0, 1.38, 0.3); c.add(hd);
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), std('#333')); p.position.y = 0.26; c.add(p);
    const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 5), m); bs.position.y = 0.05; c.add(bs); return c; };
  chair(-2.8, 4.25, 0);
  box(0.5, 0.32, 0.03, '#151515', -2.6, 0.95, 3.25, 0.01);                        // monitor
  plane(0.46, 0.27, basic(tex(256, 160, (x, w, h) => { x.fillStyle = '#123747'; x.fillRect(0, 0, w, h); glasses(x, w / 2, h / 2, 20, '#ffd66b', 6); })), -2.6, 0.95, 3.235, Math.PI);
  logo(0.55, -4.48, 1.85, 3.0, Math.PI / 2);

  /* ---------- ATTESA: poltroncine senape, tappeto in juta, quadri ---------- */
  plane(2.2, 1.6, std(C.jute, { roughness: 1 }), 3.2, 0.006, 3.4, 0, -Math.PI / 2);
  const armchair = (x, z, ry) => { const a = new THREE.Group(); a.position.set(x, 0, z); a.rotation.y = ry; g.add(a);
    const m = std(C.mustard, { roughness: 0.9 }), shell = std('#b88a5c', { roughness: 0.95 });
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.2, 0.62, 2, 0.08), m); s.position.y = 0.44; a.add(s);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.42, 24, 1, true, Math.PI * 0.15, Math.PI * 0.7), shell); b.position.set(0, 0.72, -0.05); b.rotation.y = Math.PI; a.add(b);
    const cu = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.34, 0.1, 2, 0.05), std(C.sage, { roughness: 1 })); cu.position.set(0, 0.7, -0.18); cu.rotation.x = -0.2; a.add(cu);
    [[-0.26, -0.22], [0.26, -0.22], [-0.26, 0.22], [0.26, 0.22]].forEach(([dx, dz]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36), std('#1a1a1a')); l.position.set(dx, 0.18, dz); a.add(l); }); };
  armchair(3.75, 4.0, -Math.PI / 2 - 0.3); armchair(3.75, 2.9, -Math.PI / 2 + 0.2);
  box(0.8, 0.04, 0.5, C.black, 2.75, 0.42, 3.4, 0.01); box(0.74, 0.03, 0.44, C.black, 2.75, 0.15, 3.4, 0.01);
  [[2.43, 3.2], [3.07, 3.2], [2.43, 3.6], [3.07, 3.6]].forEach(([x, z]) => box(0.03, 0.42, 0.03, '#111', x, 0.21, z));
  plant(2.75, 3.4, 0.9, 0.44);
  // quadri sulla parete destra
  const print = (z, y, w, h, draw) => { box(0.03, h + 0.06, w + 0.06, std('#cda877'), 4.47, y, z); plane(w, h, basic(tex(200, 260, draw)), 4.45, y, z, -Math.PI / 2); };
  print(1.9, 1.75, 0.45, 0.6, (x, w, h) => { x.fillStyle = '#f2efe8'; x.fillRect(0, 0, w, h); x.fillStyle = '#3346a3'; x.beginPath(); x.ellipse(100, 120, 40, 80, 0.3, 0, 7); x.fill(); });
  print(0.9, 1.8, 0.55, 0.75, (x, w, h) => { x.fillStyle = '#f2efe8'; x.fillRect(0, 0, w, h); x.strokeStyle = '#999'; x.lineWidth = 2; for (let i = 0; i < 18; i++) { x.beginPath(); x.moveTo(100, 220); x.quadraticCurveTo(30 + i * 8, 40, 100 + (i - 9) * 6, 30); x.stroke(); } });

  /* ---------- CENTRO: divano nero sotto il logo, tavolino, mobiletto del caffè ---------- */
  box(0.8, 0.36, 1.9, '#222426', 4.0, 0.3, -1.4, 0.06); box(0.2, 0.48, 1.9, '#222426', 4.36, 0.66, -1.4, 0.05);
  [[3.75, -2.25], [3.75, -0.55]].forEach(([x, z]) => box(0.04, 0.12, 0.04, '#c9cccc', x, 0.06, z));
  logo(0.6, 4.47, 2.05, -1.4, -Math.PI / 2);
  box(0.9, 0.04, 0.9, C.black, 2.4, 0.46, -1.2, 0.01); box(0.86, 0.03, 0.86, C.black, 2.4, 0.18, -1.2, 0.01);
  [[1.98, -1.62], [2.82, -1.62], [1.98, -0.78], [2.82, -0.78]].forEach(([x, z]) => box(0.035, 0.46, 0.035, '#111', x, 0.23, z));
  plant(2.4, -1.2, 1.0, 0.48);
  box(0.4, 0.5, 0.9, C.black, 4.2, 0.25, -2.85, 0.01); box(0.22, 0.34, 0.26, '#2a2a2a', 4.2, 0.67, -3.0, 0.02);   // mobiletto con macchina del caffè

  /* ---------- FONDO: pedana rialzata, gradini in travertino, parapetto in vetro, arco ---------- */
  const PH = 0.6, PZ = -1.4;   // altezza e bordo della pedana
  box(6, PH, 6.6, std(C.white), -1.5, PH / 2, (PZ + BACK) / 2, 0.01);
  plane(6, 6.6, floorM, -1.5, PH + 0.003, (PZ + BACK) / 2, 0, -Math.PI / 2);
  // gradini (parte destra del fronte pedana)
  for (let i = 0; i < 3; i++) box(2.1, PH - i * 0.2, 0.32, travM, 0.45, (PH - i * 0.2) / 2, PZ + 0.16 + i * 0.32, 0.01);
  // muretto + parapetto in vetro (parte sinistra)
  box(3.9, 0.06, 0.12, travM, -2.55, PH + 0.03, PZ + 0.02);
  plane(3.9, 0.9, glassM, -2.55, PH + 0.5, PZ);
  [-4.4, -0.65].forEach((x) => box(0.04, 0.95, 0.04, std('#cfd3d3', { metalness: 0.8, roughness: 0.25 }), x, PH + 0.48, PZ));
  // corrimano in acciaio
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.25), std('#cfd3d3', { metalness: 0.85, roughness: 0.25 })); rail.position.set(-0.55, 0.85, PZ + 0.45); rail.rotation.x = -0.55; g.add(rail);
  plant(-1.6, PZ - 0.4, 1.1, PH);
  box(0.03, 0.9, 0.6, std('#d9c4a0'), -3.2, PH + 0.46, PZ - 0.25).rotation.y = 0.2;   // quadro appoggiato
  // parete con l'arco (sopra la pedana)
  const AZ = -3.4;
  // pareti laterali dell'arco: apertura da x -3.5 a -0.1, imposta a 2.2 m e chiave a 2.65 m
  box(1.0, 3 - PH, 0.25, C.white, -4.0, PH + (3 - PH) / 2, AZ);
  box(1.6, 3 - PH, 0.25, C.white, 0.7, PH + (3 - PH) / 2, AZ);
  const aw = 1.7, archShape = new THREE.Shape();
  archShape.moveTo(-aw, 0); archShape.absellipse(0, 0, aw, 0.45, Math.PI, 0, true); archShape.lineTo(aw, 0.8); archShape.lineTo(-aw, 0.8); archShape.closePath();
  const ag = new THREE.ExtrudeGeometry(archShape, { depth: 0.25, bevelEnabled: false, curveSegments: 32 }); ag.translate(0, 0, -0.125);
  const arch = new THREE.Mesh(ag, std(C.white)); arch.position.set(-1.8, 2.2, AZ); g.add(arch);
  // aula studio sulla pedana: tre scrivanie bianche, lampade, sedie nere, logo sul fondo
  const tabletT = tex(512, 320, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#123747'); gr.addColorStop(1, '#0a1c26'); x.fillStyle = gr; x.fillRect(0, 0, w, h); txt(x, 'LEZIONE LIVE', 24, 40, 20, '#3fc8d1', 500, MONO); x.fillStyle = '#1d5a6d'; x.fillRect(24, 58, 464, 200); x.fillStyle = 'rgba(229,239,242,.9)'; x.beginPath(); x.arc(256, 130, 32, 0, 7); x.fill(); x.beginPath(); x.ellipse(256, 236, 66, 52, 0, Math.PI, 0); x.fill(); x.fillStyle = '#00B67A'; x.beginPath(); x.arc(36, 292, 7, 0, 7); x.fill(); txt(x, cma ? 'Collegato alla Rete CMA' : 'Collegato alla Rete Lambda', 52, 300, 20, '#fff', 500); });
  const tabM = basic(tabletT), beams = [], chairs = [];
  [-3.4, -1.8, -0.2].forEach((x, i) => {
    box(1.2, 0.035, 0.62, C.white, x, PH + 0.74, BACK + 0.45, 0.01);
    [[-0.55, -0.27], [0.55, -0.27]].forEach(([dx, dz]) => { box(0.05, 0.72, 0.05, C.white, x + dx, PH + 0.36, BACK + 0.45 + dz); box(0.05, 0.03, 0.55, C.white, x + dx, PH + 0.02, BACK + 0.45); });
    const tab = box(0.32, 0.22, 0.03, '#151515', x, PH + 0.9, BACK + 0.3, 0.01); tab.rotation.x = -0.25;
    const sc = plane(0.29, 0.19, tabM, x, PH + 0.905, BACK + 0.318); sc.rotation.x = -0.25;
    const lp = box(0.025, 0.36, 0.025, '#eee', x - 0.42, PH + 0.93, BACK + 0.3); lp.rotation.z = 0.25;
    box(0.2, 0.08, 0.12, i % 2 ? '#e8892f' : '#39a39b', x + 0.42, PH + 0.8, BACK + 0.32, 0.02);       // portapenne colorati
    chairs.push(chair(x, BACK + 1.15, (i - 1) * 0.1));
    chairs[chairs.length - 1].position.y = PH;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 10, 1, true), new THREE.MeshBasicMaterial({ color: '#3fc8d1', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.position.set(x, PH + 2.0, BACK + 0.3); g.add(beam); beams.push(beam);
  });
  logo(0.75, -1.8, PH + 1.85, BACK + 0.01, 0);
  // uno studente al lavoro
  const stu = new THREE.Group(); stu.position.set(-1.8, PH, BACK + 1.05); g.add(stu);
  const sb = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.36, 6, 16), std(cma ? '#4B5A2B' : '#ffd66b')); sb.position.y = 0.82; stu.add(sb);
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), std('#eec7a2')); sh.position.y = 1.2; stu.add(sh);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 16, 0, 6.3, 0, 1.5), std('#3b2a20')); hair.position.y = 1.22; if (cma) hair.scale.y = 0.62; stu.add(hair);
  // angolo bar: tavolino alto, sgabelli, roll-up
  box(0.06, 1.05, 0.06, C.black, -3.2, 0.53, 0.2); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 32), std(C.black)); top.position.set(-3.2, 1.06, 0.2); g.add(top);
  [[-3.75, 0.25], [-2.65, 0.15]].forEach(([x, z]) => { box(0.36, 0.04, 0.34, C.black, x, 0.76, z); box(0.36, 0.3, 0.03, C.black, x, 0.98, z + (x < -3.2 ? 0.15 : -0.15)); [[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]].forEach(([dx, dz]) => box(0.02, 0.76, 0.02, '#111', x + dx, 0.38, z + dz)); });
  const rollT = tex(256, 600, (x, w, h) => { x.fillStyle = '#1f3456'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.beginPath(); x.ellipse(128, 140, 200, 90, 0, Math.PI, 0); x.fill(); x.fillRect(0, 140, w, 300); txt(x, 'CENTRO STUDI', 128, 200, 22, '#1f3456', 700, FONT, 'center'); txt(x, 'LAMBDA', 128, 236, 34, '#1f3456', 700, FONT, 'center'); txt(x, 'STUDIARE', 128, 320, 28, '#e04a3a', 700, FONT, 'center'); txt(x, 'NON È QUESTIONE', 128, 352, 18, '#1f3456', 700, FONT, 'center'); txt(x, 'DI ORE,', 128, 376, 18, '#1f3456', 700, FONT, 'center'); x.fillStyle = '#1f3456'; x.fillRect(58, 392, 140, 30); txt(x, 'MA DI METODO.', 128, 414, 16, '#fff', 700, FONT, 'center'); x.fillStyle = '#fff'; x.fillRect(88, 470, 80, 80); });
  box(0.84, 2.0, 0.05, '#ddd', -4.2, 1.05, -0.6, 0.01).rotation.y = 0.5;
  const rp = plane(0.8, 1.9, basic(rollT), -4.2, 1.05, -0.6); rp.rotation.y = 0.5; rp.position.x += 0.012; rp.position.z += 0.022;

  /* ---------- UFFICIO PER I COLLOQUI: a destra in fondo (non in foto: ricostruzione plausibile) ---------- */
  box(0.15, 3, 4.6, C.white, 1.55, 1.5, -5.7);                                    // parete laterale
  box(0.9, 3, 0.15, C.white, 4.05, 1.5, AZ - 0.05); box(1.0, 3, 0.15, C.white, 2.05, 1.5, AZ - 0.05);  // fronte, con porta
  box(1.0, 0.6, 0.15, C.white, 3.1, 2.7, AZ - 0.05);
  box(0.95, 2.35, 0.04, std('#ece9e3'), 3.55, 1.17, AZ + 0.3).rotation.y = -1.1;  // porta aperta
  box(1.6, 0.04, 0.9, C.white, 3.0, 0.75, -6.0, 0.02);
  [[2.3, -6.35], [3.7, -6.35], [2.3, -5.65], [3.7, -5.65]].forEach(([x, z]) => box(0.04, 0.73, 0.04, '#222', x, 0.37, z));
  [[2.55, -6.75, 0], [3.45, -6.75, 0], [2.55, -5.25, Math.PI], [3.45, -5.25, Math.PI]].forEach(([x, z, r]) => { box(0.42, 0.05, 0.42, C.black, x, 0.46, z); box(0.42, 0.42, 0.04, C.black, x, 0.7, z + (r ? 0.2 : -0.2)); [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(([dx, dz]) => box(0.02, 0.44, 0.02, '#111', x + dx, 0.22, z + dz)); });
  logo(0.32, 4.47, 1.75, -5.4, -Math.PI / 2);
  plant(4.1, -7.6, 0.9);
  box(0.03, 0.7, 0.5, std('#cda877'), 3.0, 1.75, BACK + 0.02).rotation.y = Math.PI / 2;

  /* ---------- animazioni ---------- */
  const connect = (k, t = 0) => {
    beams.forEach((b, i) => { b.material.opacity = k * (0.45 + 0.25 * Math.sin(t * 3 + i)); b.scale.y = 0.2 + 0.8 * k; b.position.y = PH + 0.95 + 1.05 * (0.2 + 0.8 * k); });
    lights.forEach((l) => (l.intensity = 6.5 * (1 - 0.5 * k)));
  };
  const idle = (t) => { sh.rotation.x = 0.25 + Math.sin(t * 1.1) * 0.05; chairs.forEach((c, i) => { if (i !== 1) c.rotation.y = (i - 1) * 0.1 + Math.sin(t * 0.3 + i) * 0.04; }); };

  /* ---------- tappe del tour ---------- */
  const BR = cma ? 'CMA' : 'Lambda';
  const stops = [
    { k: 'L\'ingresso', t: `${BR} Cagliari, sulla strada.`, p: 'In via Carloforte 67: due vetrine, Concorsi Militari Academy e Centro Studi Lambda. Entri dalla porta di destra, e ti accogliamo noi.', cam: [0.2, 2.2, 12.8], tgt: [0.0, 1.0, 5.0], hot: [0.7, 1.5, 5.3] },
    { k: 'Reception', t: 'L\'accoglienza, appena entri.', p: 'A sinistra, dietro la vetrina, la reception: informazioni, orari, il primo colloquio. A destra le poltroncine per chi aspetta.', cam: [1.3, 1.75, 1.2], tgt: [-2.7, 0.9, 3.9], hot: [-2.6, 0.82, 3.3] },
    { k: 'La sala', t: 'Uno spazio accogliente.', p: 'Il divano sotto il logo, il caffè, le piante. E in fondo, oltre i gradini, l\'aula studio.', cam: [-1.2, 1.7, 4.2], tgt: [1.2, 0.9, -3.0], hot: [3.0, 2.3, -1.4] },
    { k: 'Aula studio', t: 'La tua postazione, oltre l\'arco.', p: cma ? 'Sulla pedana, dietro l\'arco, le postazioni con tablet e cuffie: segui le lezioni live e ti alleni sul simulatore, con un docente collegato.' : 'Sulla pedana, dietro l\'arco, le postazioni con tablet e cuffie: segui le lezioni live con i docenti, e in aula studio un docente è sempre collegato.', cam: [-1.7, PH + 1.45, -1.9], tgt: [-1.8, PH + 0.75, BACK + 0.4], hot: [-1.8, PH + 2.0, BACK + 0.1] },
    { k: 'Colloqui', t: 'Gli incontri individuali.', p: 'A destra in fondo l\'ufficio dove incontri la tua tutor personale, psicologa esperta in apprendimento: per conoscervi e fare il punto sul percorso.', cam: [2.15, 1.65, -3.9], tgt: [3.5, 0.8, -6.6], hot: [3.0, 1.9, -6.2] },
    { k: 'Collegati alla rete', t: `Dalla sede, tutta ${BR}.`, p: cma ? 'Dalla postazione accedi alla Rete CMA: gli stessi docenti, tutor e simulatore di chi si prepara da casa.' : 'Dalla postazione accedi alla Rete Lambda: gli stessi docenti e le stesse aule studio di chi si collega da casa.', cam: [-1.5, PH + 1.6, -2.3], tgt: [-1.8, PH + 1.5, BACK + 0.3], hot: [-0.2, PH + 2.6, BACK + 0.4], connect: true },
  ];
  // tappe per il viaggio della pagina Sedi (offset passato da fuori)
  return { group: g, connect, idle, stops, bg: '#dde7ec', door: [0.7, 0.9, FZ] };
}
