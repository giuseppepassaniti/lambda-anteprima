/* =====================================================================
   LAMBDA · la sede di Monza, ricostruita in 3D dalle foto reali (stile illustrato)
   Facciata in intonaco ocra con zoccolo in travertino: a sinistra la vetrina Centro Studi Lambda
   (insegna verde, porta a due ante al centro), targa nera con il QR, a destra la vetrina
   Concorsi Militari Academy. Dentro: soffitto grigio scuro con faretti, pavimento in grandi
   lastre chiare, reception bianca col logo arancione in fondo, poltroncine arancioni sul tappeto
   in juta, parete verde con la TV, libreria nera a giorno, colonna petrolio; a destra la fila di
   postazioni con i divisori in feltro e i pannelli petrolio. L'ufficio dei colloqui è sul retro.
   Coordinate: x = larghezza (-5..5), z = profondità (strada a +z), y = altezza.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const FONT = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';
const C = { green: '#2f6b45', navy: '#1d2c4c', ochre: '#a9714f', trav: '#ddd3c2', granite: '#8d8a86', white: '#f6f6f4', black: '#161718',
  orange: '#e8902e', teal: '#0f6a72', jute: '#c7b08a', ceil: '#6c6964', felt: '#e6e4df', red: '#CD141F' };

export function buildMonza({ cma = false, outdoorLight = true } = {}) {
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
  const face = (dx, dz) => Math.atan2(dx, dz);   // rotazione y per guardare verso (dx, dz)

  if (outdoorLight) { const sun = new THREE.DirectionalLight('#fff3df', 1.5); sun.position.set(-6, 12, 18); sun.target.position.set(0, 1, 5); g.add(sun, sun.target); g.add(new THREE.HemisphereLight('#ffffff', '#b9b2a6', 0.55)); }
  else { [[-2.5, 3], [2.5, 1.5], [0, -1.5], [-2, -4.5]].forEach(([x, z]) => { const l = new THREE.PointLight('#ffffff', 4, 10, 1.2); l.position.set(x, 1.8, z); g.add(l); }); }

  /* ---------- materiali ---------- */
  const tileT = tex(512, 512, (x, w, h) => { noise(x, w, h, '#d9d6d0', 2200, 0.05); x.strokeStyle = 'rgba(0,0,0,.09)'; x.lineWidth = 3; for (let i = 0; i <= 2; i++) { x.beginPath(); x.moveTo(0, i * 256); x.lineTo(w, i * 256); x.stroke(); x.beginPath(); x.moveTo(i * 256, 0); x.lineTo(i * 256, h); x.stroke(); } }, [5, 6]);
  const floorM = new THREE.MeshStandardMaterial({ map: tileT, roughness: 0.5 });
  const stuccoM = new THREE.MeshStandardMaterial({ map: tex(512, 512, (x, w, h) => { x.fillStyle = C.ochre; x.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '60,30,15' : '255,235,210'},${Math.random() * 0.06})`; x.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } }), roughness: 0.95 });
  const travM = new THREE.MeshStandardMaterial({ map: tex(256, 256, (x, w, h) => { noise(x, w, h, C.trav, 1600, 0.08); x.strokeStyle = 'rgba(120,100,80,.12)'; for (let i = 0; i < 30; i++) { x.beginPath(); x.moveTo(0, Math.random() * h); x.lineTo(w, Math.random() * h); x.stroke(); } }), roughness: 0.8 });
  const graniteM = new THREE.MeshStandardMaterial({ map: tex(256, 256, (x, w, h) => noise(x, w, h, C.granite, 4000, 0.18)), roughness: 0.6 });
  const glassM = new THREE.MeshStandardMaterial({ color: '#cfe0e2', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false, side: THREE.DoubleSide });
  const steel = std('#c9cccc', { metalness: 0.85, roughness: 0.25 });

  /* =====================================================================
     ESTERNO
     ===================================================================== */
  const FZ = 5, EZ = FZ + 0.13;
  const cobT = tex(256, 256, (x, w, h) => { x.fillStyle = '#6f6c68'; x.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let k = 0; k < 16; k++) { const l = 120 + Math.random() * 40; x.fillStyle = `rgb(${l},${l - 4},${l - 10})`; x.beginPath(); x.ellipse(k * 16 + (r % 2) * 8, r * 16 + 8, 7, 6.5, 0, 0, 7); x.fill(); } }, [14, 3]);
  plane(26, 3.4, new THREE.MeshStandardMaterial({ map: cobT, roughness: 0.95 }), 0, 0.004, FZ + 1.7, 0, -Math.PI / 2);
  plane(26, 8, std('#56595b', { roughness: 0.95 }), 0, 0.006, FZ + 7.4, 0, -Math.PI / 2);
  // muro: intonaco ocra sopra, rivestimento in travertino e zoccolo scuro in basso
  [[-8.6, 8], [8.6, 7.2], [0.7, 2.6]].forEach(([x, w]) => { plane(w, 2.2, stuccoM, x, 2.5, EZ); plane(w, 1.4, travM, x, 0.95, EZ + 0.005); plane(w, 0.25, std('#4a4a4a'), x, 0.125, EZ + 0.01); });
  plane(26, 4, stuccoM, 0, 5.6, EZ - 0.001);
  box(26, 0.12, 0.25, std('#cfc6b6'), 0, 3.6, EZ + 0.1, 0.02);                 // cornicione
  // vetrine: cornice in granito, insegna, cassonetto della tenda
  const opening = (x0, x1, top = 3.35) => { const cx = (x0 + x1) / 2, w = x1 - x0;
    box(0.14, top, 0.22, graniteM, x0 - 0.07, top / 2, FZ + 0.08); box(0.14, top, 0.22, graniteM, x1 + 0.07, top / 2, FZ + 0.08);
    box(w + 0.28, 0.1, 0.5, graniteM, cx, 0.05, FZ + 0.3);                  // soglia
    box(w, 0.06, 0.08, steel, cx, 2.38, FZ + 0.03); plane(w, 2.3, glassM, cx, 1.23, FZ + 0.02);
    box(w + 0.3, 0.2, 0.32, std('#e4e1da'), cx, top + 0.1, FZ + 0.2, 0.03);  // cassonetto tenda
    return { cx, w }; };
  const signBox = (cx, w, bg, t) => { box(w, 0.62, 0.16, std(bg, { roughness: 0.5 }), cx, 2.82, FZ + 0.09, 0.015);
    const T = tex(1024, 140, (x, W, H) => { x.fillStyle = bg; x.fillRect(0, 0, W, H); txt(x, t, W / 2, H / 2 + 18, 52, '#ffffff', 700, FONT, 'center'); });
    plane(w - 0.06, 0.56, basic(T), cx, 2.82, FZ + 0.172); };
  const L1 = opening(-4.7, -0.6), L2 = opening(2.0, 5.2);
  signBox(L1.cx, L1.w, C.green, 'CENTRO STUDI LAMBDA');
  signBox(L2.cx, L2.w, C.navy, 'CONCORSI MILITARI ACADEMY');
  // porta Lambda a due ante al centro, maniglioni verticali
  [-3.0, -2.3].forEach((x) => box(0.04, 2.3, 0.05, steel, x, 1.2, FZ + 0.04));
  [-2.78, -2.52].forEach((x) => { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.1), steel); h.position.set(x, 1.25, FZ + 0.12); g.add(h); });
  // vetrofanie Lambda: elenco servizi a sinistra, presentazione a destra, orari in alto
  const dList = tex(512, 360, (x, W, H) => { x.fillStyle = 'rgba(255,255,255,.96)'; x.fillRect(0, 0, W, H); ['Metodo di studio', 'Supporto DSA e BES', 'Ripetizioni', 'Recupero Debiti', 'Concorsi Forze Armate e di Polizia', 'Concorsi Pubblica Amministrazione', 'Supporto Psicologico'].forEach((s, i) => { x.fillStyle = '#1c2a24'; x.beginPath(); x.arc(40, 46 + i * 44, 5, 0, 7); x.fill(); txt(x, s, 60, 54 + i * 44, 24, '#1c2a24', 600); }); });
  plane(1.75, 1.0, basic(dList, { transparent: true, side: THREE.DoubleSide }), -3.75, 0.72, FZ + 0.03);
  const dLam = tex(1024, 400, (x, W, H) => { x.fillStyle = 'rgba(255,255,255,.96)'; x.fillRect(0, 0, W, H); txt(x, 'CENTRO STUDI LAMBDA', 40, 110, 70, '#1c2a24'); x.fillStyle = C.green; x.fillRect(40, 136, 860, 66); txt(x, 'METODO DI STUDIO E RIPETIZIONI', 58, 186, 50, '#fff'); txt(x, 'Uniamo l\'innovazione dei metodi di studio', 40, 262, 42, '#1c2a24', 500); txt(x, 'personalizzati alle ripetizioni tradizionali.', 40, 316, 42, '#1c2a24', 500); });
  plane(1.95, 0.76, basic(dLam, { transparent: true, side: THREE.DoubleSide }), -1.62, 0.66, FZ + 0.03);
  const orari = tex(400, 380, (x, W, H) => { x.clearRect(0, 0, W, H); const c = 'rgba(255,255,255,.92)'; txt(x, 'Orario di Lavoro', 30, 50, 34, c, 600); txt(x, 'dal Lunedì al Venerdì', 30, 100, 24, c, 500); txt(x, '10:00 – 13:00   14:30 – 18:30', 30, 136, 22, c, 500); txt(x, 'Sabato', 30, 186, 26, c, 600); txt(x, '10:00 – 13:00   14:00 – 18:00', 30, 222, 22, c, 500); txt(x, '349 244 8364', 30, 290, 24, c, 500); txt(x, 'segreteria@monza.centrostudilambda.it', 30, 336, 17, c, 500); });
  plane(1.0, 0.95, basic(orari, { transparent: true }), -1.75, 1.75, FZ + 0.035);
  // vetrofanie CMA
  const dCma = tex(1024, 280, (x, W, H) => { x.fillStyle = 'rgba(255,255,255,.95)'; x.fillRect(0, 0, W, H); x.strokeStyle = '#2d4a33'; x.lineWidth = 6; x.beginPath(); x.arc(140, 140, 104, 0, 7); x.stroke(); star(x, 140, 146, 74, C.red); txt(x, 'VINCI I CONCORSI', 290, 112, 60, '#2b2e2f'); txt(x, 'PER LE FORZE', 290, 180, 60, '#2b2e2f'); txt(x, 'ARMATE O DI POLIZIA', 290, 248, 60, '#2b2e2f'); });
  plane(2.9, 0.8, basic(dCma, { transparent: true, side: THREE.DoubleSide }), 3.6, 1.0, FZ + 0.03);
  // targa nera con il QR, numero civico
  const plaqueT = tex(256, 300, (x, w, h) => { x.fillStyle = '#1e1f21'; x.fillRect(0, 0, w, h); star(x, 96, 46, 16, '#e9e9e9'); glasses(x, 160, 46, 14, '#e9e9e9', 5); txt(x, 'CENTRO STUDI', w / 2, 98, 22, '#eee', 700, FONT, 'center'); txt(x, 'LAMBDA', w / 2, 126, 28, '#eee', 700, FONT, 'center'); txt(x, 'cosa dicono di noi', w / 2, 156, 16, '#ccc', 500, FONT, 'center'); x.fillStyle = '#fff'; x.fillRect(80, 172, 96, 96); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if ((i * 5 + j * 3 + i * j) % 3 === 0) { x.fillStyle = '#111'; x.fillRect(82 + i * 10, 174 + j * 10, 10, 10); } });
  plane(0.72, 0.84, basic(plaqueT), 0.75, 1.75, EZ + 0.012);
  plane(0.16, 0.2, basic(tex(64, 80, (x, w, h) => { x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, w, h); txt(x, '9/c', w / 2, 52, 28, '#222', 700, FONT, 'center'); })), -0.32, 2.75, EZ + 0.012);
  const lamp = box(0.18, 0.12, 0.1, '#eee', 1.4, 2.95, EZ + 0.06, 0.02);

  /* =====================================================================
     INTERNO
     ===================================================================== */
  const W2 = 5, BK = -2.6, OB = -6.4;   // parete della reception e fondo dell'ufficio
  plane(10, 7.6, floorM, 0, 0.002, (FZ + BK) / 2, 0, -Math.PI / 2);
  plane(10, 7.6, std(C.ceil, { roughness: 0.9 }), 0, 3.0, (FZ + BK) / 2, 0, Math.PI / 2);
  box(5.2, 0.16, 3.4, std('#77736e', { roughness: 0.9 }), -1.4, 2.9, 1.2, 0.01);   // ribassamento sopra l'attesa
  plane(7.6, 3, std(C.white), -W2, 1.5, (FZ + BK) / 2, Math.PI / 2);
  plane(7.6, 3, std(C.white), W2, 1.5, (FZ + BK) / 2, -Math.PI / 2);
  // muro frontale interno, attorno alle due vetrine
  [[-4.85, 0.3], [0.7, 2.6], [5.1, 0.2]].forEach(([x, w]) => box(w, 3, 0.2, C.white, x, 1.5, FZ - 0.08));
  box(10, 0.6, 0.2, C.white, 0, 2.7, FZ - 0.08);
  // parete di fondo, con la porta dell'ufficio a sinistra
  box(1.0, 3, 0.18, C.white, -4.5, 1.5, BK); box(7.0, 3, 0.18, C.white, 1.5, 1.5, BK); box(1.0, 0.75, 0.18, C.white, -3.5, 2.62, BK);
  box(0.06, 2.25, 0.06, '#d9d9d9', -3.98, 1.12, BK + 0.1); box(0.06, 2.25, 0.06, '#d9d9d9', -3.02, 1.12, BK + 0.1);
  box(0.04, 2.2, 0.9, std('#ece9e3'), -3.97, 1.1, BK - 0.5);     // anta aperta verso l'ufficio
  const downs = [[-3, 3.6], [-1, 3.6], [-3, 1.2], [-1, 1.2], [1.5, 2.6], [3.4, 2.6], [1.5, 0], [3.4, 0], [0, -1.6], [2.4, -1.6], [-3, -1]];
  downs.forEach(([x, z]) => { const d = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), new THREE.MeshBasicMaterial({ color: '#ffffff' })); d.rotation.x = Math.PI / 2; d.position.set(x, Math.abs(x + 1.4) < 2.6 && z > -0.5 && z < 2.9 ? 2.815 : 2.99, z); g.add(d); });
  const lights = [];
  [[-2.4, 3], [2.6, 1.6], [0, -1.2], [-2, -4.6]].forEach(([x, z]) => { const l = new THREE.PointLight('#fff6ec', 6.5, 9, 1.4); l.position.set(x, 2.5, z); g.add(l); lights.push(l); });

  const logoTex = (bg, fg) => tex(512, 512, (x, w, h) => { x.fillStyle = bg; x.beginPath(); x.arc(256, 256, 254, 0, 7); x.fill(); x.strokeStyle = fg; x.lineWidth = 5; x.beginPath(); x.arc(186, 168, 46, 0, 7); x.stroke(); star(x, 186, 172, 32, fg); glasses(x, 322, 160, 20, fg, 7); [0, 1, 2].forEach((i) => { x.fillStyle = fg; x.fillRect(288, 186 + i * 14, 70 - i * 6, 9); }); txt(x, 'CENTRO STUDI', 256, 300, 46, fg, 700, FONT, 'center'); txt(x, 'LAMBDA', 256, 372, 80, fg, 700, FONT, 'center'); });
  const logoOrange = basic(logoTex('#f0a021', '#2c2a26'), { transparent: true }), logoGreen = basic(logoTex('#2f5242', '#e9ecea'), { transparent: true });
  const logo = (m, r, x, y, z, ry) => { const d = new THREE.Mesh(new THREE.CircleGeometry(r, 48), m); d.position.set(x, y, z); d.rotation.y = ry; g.add(d); };
  const plant = (x, z, s = 1, y0 = 0) => { const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * s, 0.14 * s, 0.32 * s, 20), std('#f4f4f2')); pot.position.set(x, y0 + 0.16 * s, z); g.add(pot); for (let i = 0; i < 8; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.18 * s, 10, 8), std('#2f7d4f', { roughness: 0.8, flatShading: true })); l.scale.set(0.5, 0.12, 1.4); l.position.set(x + Math.cos(i) * 0.16 * s, y0 + (0.45 + (i % 3) * 0.13) * s, z + Math.sin(i * 1.9) * 0.16 * s); l.rotation.set(0.6, i * 0.8, 0.3); g.add(l); } };
  const chair = (x, z, ry, y0 = 0) => { const c = new THREE.Group(); c.position.set(x, y0, z); c.rotation.y = ry; g.add(c); const m = std('#1c1d1f', { roughness: 0.55 });
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.48, 2, 0.03), m); s.position.y = 0.48; c.add(s);
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.72, 0.06, 2, 0.03), m); b.position.set(0, 0.92, 0.25); b.rotation.x = -0.1; c.add(b);
    const hd = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.14, 0.06, 2, 0.03), m); hd.position.set(0, 1.38, 0.3); c.add(hd);
    [-1, 1].forEach((sd) => { const a = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.05, 0.3, 2, 0.02), m); a.position.set(sd * 0.27, 0.68, 0.02); c.add(a); });
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), std('#333')); p.position.y = 0.26; c.add(p);
    const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 5), m); bs.position.y = 0.05; c.add(bs); return c; };

  /* ---------- RECEPTION: bancone bianco in fondo, logo arancione, nicchie ---------- */
  box(1.9, 1.05, 0.62, C.white, 0.3, 0.525, BK + 0.75, 0.02);
  box(1.96, 0.03, 0.66, std('#e8eef0', { roughness: 0.15, metalness: 0.1 }), 0.3, 1.065, BK + 0.75, 0.01);
  logo(logoOrange, 0.36, 0.3, 0.58, BK + 1.065, 0);
  [-0.15, 0.75].forEach((x) => box(0.42, 0.28, 0.03, '#151515', x, 1.24, BK + 0.6, 0.01));
  chair(0.3, BK + 0.3, Math.PI);
  // nicchie bianche nel muro, con un quadretto
  box(0.75, 1.3, 0.12, C.white, 1.8, 1.5, BK + 0.1); [1.1, 1.5].forEach((y) => box(0.62, 0.025, 0.2, C.white, 1.8, y, BK + 0.16));
  plane(0.24, 0.17, basic(tex(120, 85, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5fb6d6'); gr.addColorStop(1, '#e9d9a8'); x.fillStyle = gr; x.fillRect(0, 0, w, h); x.fillStyle = '#2f6e57'; x.beginPath(); x.ellipse(70, 50, 30, 18, 0, 0, 7); x.fill(); })), 1.8, 1.65, BK + 0.2);
  // colonna petrolio
  box(0.6, 3, 0.6, std(C.teal, { roughness: 0.85 }), 2.65, 1.5, BK + 0.6, 0.01);

  /* ---------- ATTESA: tre poltroncine arancioni, tavolino nero, tappeto in juta ---------- */
  plane(2.6, 1.8, std(C.jute, { roughness: 1 }), 0.3, 0.006, 0.6, 0, -Math.PI / 2);
  const armchair = (x, z, ry) => { const a = new THREE.Group(); a.position.set(x, 0, z); a.rotation.y = ry; g.add(a);
    const m = std(C.orange, { roughness: 0.9 }), shell = std('#d88a4a', { roughness: 0.95 });
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.18, 0.6, 2, 0.08), m); s.position.y = 0.44; a.add(s);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.4, 24, 1, true, Math.PI * 0.42, Math.PI * 1.16), shell); b.material.side = THREE.DoubleSide; b.position.set(0, 0.74, 0.02); a.add(b);
    const cu = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.3, 0.12, 2, 0.05), m); cu.position.set(0, 0.7, -0.22); cu.rotation.x = -0.15; a.add(cu);
    [[-0.26, -0.22], [0.26, -0.22], [-0.26, 0.22], [0.26, 0.22]].forEach(([dx, dz]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.38), std('#1a1a1a')); l.position.set(dx, 0.18, dz); a.add(l); }); return a; };
  [[-0.6, 0.0], [0.9, -0.15], [1.25, 1.0]].forEach(([x, z]) => armchair(x, z, face(0.3 - x, 0.6 - z)));
  box(0.9, 0.06, 0.55, '#2a2a2c', 0.3, 0.42, 0.6, 0.01); box(0.86, 0.22, 0.5, '#232325', 0.3, 0.26, 0.6, 0.01);
  [[-0.1, 0.4], [0.7, 0.4], [-0.1, 0.8], [0.7, 0.8]].forEach(([x, z]) => box(0.03, 0.18, 0.03, '#111', x, 0.09, z));
  const man = box(0.22, 0.3, 0.03, '#d9c6a0', 0.15, 0.6, 0.6, 0.005); man.rotation.set(-0.2, 0.3, 0);         // cartello "Manifesto"
  // parete verde con la TV e le doghe in legno (parete sinistra)
  const mossT = tex(256, 256, (x, w, h) => { x.fillStyle = '#4c8a2e'; x.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { const l = Math.random(); x.fillStyle = `rgb(${60 + l * 70},${120 + l * 70},${30 + l * 30})`; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 1.5 + Math.random() * 2.5, 0, 7); x.fill(); } }, [3, 2]);
  box(0.08, 1.9, 2.6, new THREE.MeshStandardMaterial({ map: mossT, roughness: 1 }), -4.94, 1.85, -1.0, 0.02);
  for (let i = 0; i < 16; i++) box(0.05, 0.9, 0.09, std('#b5875a'), -4.93, 0.95, -2.0 + i * 0.15, 0.01);
  box(0.06, 0.7, 1.2, '#111214', -4.86, 2.0, -1.0, 0.02);
  plane(1.12, 0.62, basic(tex(320, 180, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#17313f'); gr.addColorStop(1, '#0a1a22'); x.fillStyle = gr; x.fillRect(0, 0, w, h); glasses(x, w / 2, h / 2 - 10, 18, '#ffd66b', 5); txt(x, 'LAMBDA', w / 2, h / 2 + 40, 22, '#e9ecea', 700, FONT, 'center'); })), -4.82, 2.0, -1.0, Math.PI / 2);
  // libreria nera a giorno (4×4)
  const kx = -3.6, kz = 2.0, cube = 0.36, kw = 4 * cube + 0.04;
  const kM = std('#1d1e20', { roughness: 0.6 });
  for (let i = 0; i <= 4; i++) { box(kw, 0.035, 0.38, kM, kx, 0.05 + i * cube, kz, 0.005); box(0.035, 4 * cube, 0.38, kM, kx - kw / 2 + 0.02 + i * cube, 0.05 + 2 * cube, kz, 0.005); }
  box(0.08, 0.26, 0.08, '#cfd2d2', kx - 0.5, 1.22, kz, 0.03); box(0.25, 0.25, 0.04, '#e7e1d2', kx + 0.18, 1.2, kz, 0.005);
  [0, 1, 2, 3].forEach((i) => box(0.03, 0.26, 0.2, std(['#eae6dc', '#c8473c', '#ffffff', '#2c5a8a'][i]), kx - 0.6 + i * 0.035, 0.56, kz, 0.004));

  /* ---------- AULA STUDIO: la fila di postazioni sulla parete destra ---------- */
  const tabletT = tex(512, 320, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#123747'); gr.addColorStop(1, '#0a1c26'); x.fillStyle = gr; x.fillRect(0, 0, w, h); txt(x, 'LEZIONE LIVE', 24, 40, 20, '#3fc8d1', 500, MONO); x.fillStyle = '#1d5a6d'; x.fillRect(24, 58, 464, 200); x.fillStyle = 'rgba(229,239,242,.9)'; x.beginPath(); x.arc(256, 130, 32, 0, 7); x.fill(); x.beginPath(); x.ellipse(256, 236, 66, 52, 0, Math.PI, 0); x.fill(); x.fillStyle = '#00B67A'; x.beginPath(); x.arc(36, 292, 7, 0, 7); x.fill(); txt(x, cma ? 'Collegato alla Rete CMA' : 'Collegato alla Rete Lambda', 52, 300, 20, '#fff', 500); });
  const tabM = basic(tabletT), beams = [], chairs = [];
  const DX = 4.55, rowZ = [-1.75, -0.4, 0.95, 2.3];
  rowZ.forEach((z, i) => {
    box(0.6, 0.035, 1.15, C.white, DX, 0.75, z, 0.01);
    [-0.5, 0.5].forEach((dz) => { box(0.05, 0.7, 0.05, C.white, DX - 0.1, 0.38, z + dz); box(0.55, 0.04, 0.05, C.white, DX, 0.04, z + dz); });
    const lap = box(0.02, 0.2, 0.3, '#2b2d30', DX + 0.12, 0.88, z + 0.1, 0.008); lap.rotation.z = 0.25;
    const sc = plane(0.28, 0.18, tabM, DX + 0.105, 0.885, z + 0.1, -Math.PI / 2); sc.rotation.order = 'YXZ'; sc.rotation.x = 0.25;
    box(0.03, 0.42, 0.03, '#eee', DX + 0.18, 0.96, z - 0.42).rotation.x = 0.3;          // lampada
    box(0.07, 0.11, 0.07, '#222', DX + 0.15, 0.82, z + 0.42, 0.02);                    // portapenne
    plane(0.62, 1.05, std(C.teal, { roughness: 0.95 }), W2 - 0.015, 1.95, z, -Math.PI / 2);   // pannello fonoassorbente
    box(0.03, 1.07, 0.64, std(C.teal, { roughness: 0.95 }), W2 - 0.03, 1.95, z, 0.01);
    chairs.push(chair(DX - 0.75, z, -Math.PI / 2 + (i - 1.5) * 0.08));
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 10, 1, true), new THREE.MeshBasicMaterial({ color: '#3fc8d1', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.position.set(DX + 0.1, 2.0, z + 0.1); g.add(beam); beams.push(beam);
  });
  // divisori in feltro su ruote, tra una postazione e l'altra
  const feltM = new THREE.MeshStandardMaterial({ map: tex(128, 128, (x, w, h) => noise(x, w, h, C.felt, 900, 0.08)), roughness: 1 });
  [-1.08, 0.28, 1.63].forEach((z) => { box(0.95, 1.55, 0.06, feltM, DX - 0.15, 0.95, z, 0.02); box(0.6, 0.04, 0.06, C.white, DX - 0.15, 0.1, z); [-0.3, 0.3].forEach((dx) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), std('#ddd')); w.rotation.x = Math.PI / 2; w.position.set(DX - 0.15 + dx, 0.035, z); g.add(w); }); });
  // uno studente al lavoro (seconda postazione)
  const stu = new THREE.Group(); stu.position.set(DX - 0.8, 0, rowZ[1]); stu.rotation.y = -Math.PI / 2; g.add(stu);
  const sb = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.36, 6, 16), std(cma ? '#4B5A2B' : '#7fa7d9')); sb.position.y = 0.82; stu.add(sb);
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), std('#eec7a2')); sh.position.y = 1.2; stu.add(sh);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 16, 0, 6.3, 0, 1.5), std('#3b2a20')); hair.position.y = 1.22; if (cma) hair.scale.y = 0.62; stu.add(hair);
  const bag = box(0.3, 0.38, 0.2, '#222', DX - 0.55, 0.19, rowZ[2] - 0.4, 0.06);

  /* ---------- UFFICIO PER I COLLOQUI: sul retro (non in foto: ricostruzione plausibile) ---------- */
  plane(6.5, 3.8, floorM, -1.75, 0.003, (BK + OB) / 2, 0, -Math.PI / 2);
  plane(6.5, 3.8, std(C.ceil, { roughness: 0.9 }), -1.75, 2.99, (BK + OB) / 2, 0, Math.PI / 2);
  plane(6.5, 3, std(C.white), -1.75, 1.5, OB);
  plane(3.8, 3, std(C.white), 1.5, 1.5, (BK + OB) / 2, -Math.PI / 2);
  plane(3.8, 3, std(C.white), -W2, 1.5, (BK + OB) / 2, Math.PI / 2);
  box(1.7, 0.04, 0.9, C.white, -1.7, 0.75, -4.7, 0.02);
  [[-2.45, -5.05], [-0.95, -5.05], [-2.45, -4.35], [-0.95, -4.35]].forEach(([x, z]) => box(0.04, 0.73, 0.04, '#222', x, 0.37, z));
  [[-2.15, -5.4, 0], [-1.25, -5.4, 0], [-2.15, -4.0, Math.PI], [-1.25, -4.0, Math.PI]].forEach(([x, z, r]) => { box(0.42, 0.05, 0.42, C.black, x, 0.46, z); box(0.42, 0.42, 0.04, C.black, x, 0.7, z + (r ? 0.2 : -0.2)); [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(([dx, dz]) => box(0.02, 0.44, 0.02, '#111', x + dx, 0.22, z + dz)); });
  logo(logoGreen, 0.42, -1.7, 1.85, OB + 0.01, 0);
  box(0.95, 0.04, 0.03, std(C.teal), -1.7, 1.25, OB + 0.02);
  plant(0.9, -5.9, 1.0);
  box(0.4, 1.8, 0.35, '#1d1e20', -4.6, 0.9, -5.8, 0.01);
  const ol = new THREE.PointLight('#fff6ec', 5, 7, 1.4); ol.position.set(-1.7, 2.5, -4.6); g.add(ol); lights.push(ol);

  /* ---------- animazioni ---------- */
  const connect = (k, t = 0) => {
    beams.forEach((b, i) => { b.material.opacity = k * (0.45 + 0.25 * Math.sin(t * 3 + i)); b.scale.y = 0.2 + 0.8 * k; b.position.y = 0.95 + 1.05 * (0.2 + 0.8 * k); });
    lights.forEach((l) => (l.intensity = 6.5 * (1 - 0.5 * k)));
  };
  const idle = (t) => { sh.rotation.x = 0.25 + Math.sin(t * 1.1) * 0.05; chairs.forEach((c, i) => { if (i !== 1) c.rotation.y = -Math.PI / 2 + (i - 1.5) * 0.08 + Math.sin(t * 0.3 + i) * 0.04; }); };

  /* ---------- tappe del tour ---------- */
  const BR = cma ? 'CMA' : 'Lambda';
  const stops = [
    { k: 'L\'ingresso', t: `${BR} Monza, sulla strada.`, p: 'In via Carlo Prina 9: a sinistra la vetrina del Centro Studi Lambda, a destra quella di Concorsi Militari Academy. Si entra dalla porta a vetri, al centro.', cam: [0.2, 2.2, 12.8], tgt: [0.2, 1.2, 5.0], hot: [-2.65, 1.5, 5.3] },
    { k: 'Reception', t: 'L\'accoglienza, in fondo alla sala.', p: 'Appena entri vedi la reception: informazioni, orari, il primo colloquio. Davanti, le poltroncine per chi aspetta.', cam: [-2.4, 1.7, 4.2], tgt: [0.6, 0.9, -2.0], hot: [0.3, 1.6, BK + 0.75] },
    { k: 'Lo spazio', t: 'Uno spazio accogliente.', p: 'La parete verde con lo schermo, la libreria, le poltroncine sul tappeto: un posto dove aspettare, o fare una pausa tra una lezione e l\'altra.', cam: [2.6, 1.7, 3.2], tgt: [-3.6, 1.1, -0.6], hot: [-4.8, 2.6, -1.0] },
    { k: 'Aula studio', t: 'La tua postazione.', p: cma ? 'Sulla parete di destra, le postazioni con i divisori: segui le lezioni live e ti alleni sul simulatore, con un docente collegato.' : 'Sulla parete di destra, le postazioni separate dai divisori: segui le lezioni live con i docenti, e in aula studio un docente è sempre collegato.', cam: [0.6, 1.65, 0.9], tgt: [4.9, 1.1, 0.3], hot: [4.8, 2.7, 0.95] },
    { k: 'Colloqui', t: 'Gli incontri individuali.', p: 'Sul retro, oltre la porta accanto alla reception, l\'ufficio dove incontri la tua tutor personale, psicologa esperta in apprendimento: per conoscervi e fare il punto sul percorso.', cam: [-3.5, 1.65, -2.9], tgt: [-1.6, 0.85, -5.4], hot: [-1.7, 1.95, -5.0] },
    { k: 'Collegati alla rete', t: `Dalla sede, tutta ${BR}.`, p: cma ? 'Dalla postazione accedi alla Rete CMA: gli stessi docenti, tutor e simulatore di chi si prepara da casa.' : 'Dalla postazione accedi alla Rete Lambda: gli stessi docenti e le stesse aule studio di chi si collega da casa.', cam: [0.9, 1.9, 0.6], tgt: [4.9, 1.85, 0.35], hot: [3.6, 2.7, 2.3], connect: true },
  ];
  return { group: g, connect, idle, stops, bg: '#dde7ec' };
}
