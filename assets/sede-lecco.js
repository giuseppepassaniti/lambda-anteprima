/* =====================================================================
   LAMBDA · la sede di Lecco, ricostruita in 3D dalle foto reali (stile illustrato)
   Facciata in intonaco giallo con zoccolo in pietra: a sinistra la porta di Concorsi Militari
   Academy (insegna blu, civico 35), da cui si entra; al centro la targa bianca con il QR; a destra
   la vetrina del Centro Studi Lambda (insegna verde, telaio rosso, marmo verde in basso).
   Dentro: oltre la bussola in legno rosso con la porta ad arco, la reception è subito a sinistra
   (bancone bianco a righe nere, pannelli esagonali, logo verde); in fondo la parete in doghe di
   legno con la TV e le poltroncine senape; sulla parete destra le postazioni con i divisori e i
   pannelli blu. L'ufficio dei colloqui è sul retro (non in foto: ricostruzione plausibile).
   Coordinate: x = larghezza (-5..5), z = profondità (strada a +z), y = altezza.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const FONT = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';
const C = { green: '#2f5242', navy: '#1d2448', yellow: '#e2a640', stone: '#a8a59d', granite: '#8a8784', white: '#f6f6f4', black: '#161718',
  wood: '#7c1f24', mustard: '#e0ae2e', blue: '#24508e', slat: '#b8895a', felt: '#ebe9e3', red: '#CD141F', marble: '#2f4a3c' };

export function buildLecco({ cma = false, outdoorLight = true } = {}) {
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
  else { [[-3, 2.5], [2.5, 1.5], [-0.5, -1.2], [-2, -4.4]].forEach(([x, z]) => { const l = new THREE.PointLight('#ffffff', 4, 10, 1.2); l.position.set(x, 1.8, z); g.add(l); }); }

  /* ---------- materiali ---------- */
  const tileT = tex(512, 512, (x, w, h) => { x.fillStyle = '#cbc4b7'; x.fillRect(0, 0, w, h); for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { const l = 190 + Math.random() * 22; x.fillStyle = `rgb(${l},${l - 6},${l - 16})`; x.fillRect(k * 128 + 2, r * 128 + 2, 124, 124); for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '90,80,60' : '255,250,240'},${Math.random() * 0.12})`; x.fillRect(k * 128 + Math.random() * 124, r * 128 + Math.random() * 124, 3, 3); } } }, [5, 6]);
  const floorM = new THREE.MeshStandardMaterial({ map: tileT, roughness: 0.55 });
  const stuccoM = new THREE.MeshStandardMaterial({ map: tex(512, 512, (x, w, h) => { x.fillStyle = C.yellow; x.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '90,50,10' : '255,240,200'},${Math.random() * 0.06})`; x.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } }), roughness: 0.95 });
  // zoccolo in pietra a blocchi irregolari
  const stoneM = new THREE.MeshStandardMaterial({ map: tex(512, 256, (x, w, h) => { x.fillStyle = '#7d7a73'; x.fillRect(0, 0, w, h); let y = 0; while (y < h) { const rh = 40 + Math.random() * 50; let X = -Math.random() * 60; while (X < w) { const bw = 60 + Math.random() * 90, l = 150 + Math.random() * 40; x.fillStyle = `rgb(${l},${l - 2},${l - 10})`; x.beginPath(); x.moveTo(X + 3 + Math.random() * 6, y + 3); x.lineTo(X + bw - 3, y + 2 + Math.random() * 6); x.lineTo(X + bw - 2 - Math.random() * 6, y + rh - 3); x.lineTo(X + 4, y + rh - 2 - Math.random() * 5); x.fill(); X += bw; } y += rh; } for (let i = 0; i < 5000; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${Math.random() * 0.1})`; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }, [3, 1]), roughness: 0.9 });
  const graniteM = new THREE.MeshStandardMaterial({ map: tex(256, 256, (x, w, h) => noise(x, w, h, C.granite, 4000, 0.18)), roughness: 0.6 });
  const marbleM = new THREE.MeshStandardMaterial({ map: tex(256, 128, (x, w, h) => { x.fillStyle = C.marble; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(230,236,230,.55)'; for (let i = 0; i < 26; i++) { x.lineWidth = Math.random() * 2.5; x.beginPath(); let px = Math.random() * w, py = Math.random() * h; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (Math.random() - 0.3) * 40; py += (Math.random() - 0.5) * 30; x.lineTo(px, py); } x.stroke(); } }), roughness: 0.3 });
  const glassM = new THREE.MeshStandardMaterial({ color: '#cfe0e2', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false, side: THREE.DoubleSide });
  const steel = std('#c9cccc', { metalness: 0.85, roughness: 0.25 });
  const woodM = std(C.wood, { roughness: 0.55 });

  /* =====================================================================
     ESTERNO
     ===================================================================== */
  const FZ = 5, EZ = FZ + 0.13;
  const asphT = tex(256, 256, (x, w, h) => noise(x, w, h, '#5d5e5f', 3000, 0.12), [10, 3]);
  plane(26, 3.4, new THREE.MeshStandardMaterial({ map: asphT, roughness: 0.95 }), 0, 0.004, FZ + 1.7, 0, -Math.PI / 2);
  plane(26, 8, std('#56595b', { roughness: 0.95 }), 0, 0.006, FZ + 7.4, 0, -Math.PI / 2);
  // muro: intonaco giallo sopra, pietra in basso (tra le aperture)
  const DX0 = -3.4, DX1 = -2.0, WX0 = 0.9, WX1 = 4.4;
  [[-13, DX0 - 0.14], [DX1 + 0.14, WX0 - 0.14], [WX1 + 0.14, 13]].forEach(([a, b]) => { const w = b - a, x = (a + b) / 2; plane(w, 2.3, stuccoM, x, 2.45, EZ); plane(w, 1.3, stoneM, x, 0.65, EZ + 0.005); });
  plane(26, 4, stuccoM, 0, 5.6, EZ - 0.001);
  box(26, 0.1, 0.2, std('#d9cfb8'), 0, 3.62, EZ + 0.08, 0.02);
  // aperture con la cornice in granito e l'insegna dentro la cornice
  const opening = (x0, x1, top = 3.3) => { const cx = (x0 + x1) / 2, w = x1 - x0;
    box(0.14, top, 0.22, graniteM, x0 - 0.07, top / 2, FZ + 0.08); box(0.14, top, 0.22, graniteM, x1 + 0.07, top / 2, FZ + 0.08);
    box(w + 0.28, 0.12, 0.22, graniteM, cx, top + 0.06, FZ + 0.08);
    box(w + 0.28, 0.08, 0.5, graniteM, cx, 0.04, FZ + 0.3);                  // soglia
    return { cx, w }; };
  const signBox = (cx, w, bg, t) => { box(w, 0.6, 0.1, std('#d4d6d6', { metalness: 0.6, roughness: 0.3 }), cx, 2.95, FZ + 0.06, 0.01);
    const T = tex(1024, 150, (x, W, H) => { x.fillStyle = bg; x.fillRect(0, 0, W, H); txt(x, t, W / 2, H / 2 + 18, w < 2 ? 64 : 54, '#ffffff', 700, FONT, 'center'); });
    plane(w - 0.08, 0.52, basic(T), cx, 2.95, FZ + 0.115); };
  const D = opening(DX0, DX1), Wn = opening(WX0, WX1);
  signBox(D.cx, D.w, C.navy, 'CONCORSI MILITARI ACADEMY');
  signBox(Wn.cx, Wn.w, C.green, 'CENTRO STUDI LAMBDA');
  // porta CMA: la porta a vetri è aperta, si vede la bussola in legno rosso
  box(0.05, 2.6, 0.05, steel, DX0 + 0.03, 1.32, FZ - 0.05); box(D.w, 0.06, 0.06, steel, D.cx, 2.62, FZ - 0.05);
  const leaf = box(0.04, 2.55, 1.3, glassM, DX0 + 0.06, 1.3, FZ - 0.72); box(0.05, 2.55, 0.05, steel, DX0 + 0.06, 1.3, FZ - 1.37);
  // vetrina Lambda: telaio rosso con traverso, marmo verde in basso
  const WY = [0.45, 1.6, 2.6];
  box(Wn.w, 0.45, 0.1, marbleM, Wn.cx, 0.225, FZ + 0.02, 0.005);
  WY.forEach((y) => box(Wn.w, 0.08, 0.1, woodM, Wn.cx, y, FZ + 0.04, 0.01));
  [WX0 + 0.04, WX1 - 0.04].forEach((x) => box(0.08, 2.2, 0.1, woodM, x, 1.52, FZ + 0.04, 0.01));
  plane(Wn.w, 2.15, glassM, Wn.cx, 1.53, FZ + 0.02);
  plane(Wn.w - 0.1, 0.95, std('#eceeee', { roughness: 0.9, transparent: true, opacity: 0.55 }), Wn.cx, 2.1, FZ - 0.06);   // tenda a rullo dietro il vetro alto
  // vetrofania Lambda (pannello in basso): presentazione a sinistra, servizi a destra
  const dLam = tex(1200, 330, (x, W, H) => { x.fillStyle = 'rgba(255,255,255,.96)'; x.fillRect(0, 0, W, H); txt(x, 'CENTRO STUDI LAMBDA', 40, 82, 56, '#1c2a24'); x.fillStyle = '#1c2a24'; x.fillRect(40, 102, 640, 52); txt(x, 'METODO DI STUDIO E RIPETIZIONI', 54, 142, 38, '#fff'); txt(x, 'Uniamo l\'innovazione dei metodi di studio', 40, 210, 34, '#1c2a24', 500); txt(x, 'personalizzati alle ripetizioni tradizionali.', 40, 254, 34, '#1c2a24', 500);
    ['Metodo di studio', 'Supporto DSA e BES', 'Ripetizioni', 'Recupero Debiti', 'Concorsi Forze Armate e di Polizia', 'Concorsi Pubblica Amministrazione', 'Supporto Psicologico'].forEach((s, i) => { x.fillStyle = '#1c2a24'; x.beginPath(); x.arc(790, 50 + i * 40, 4, 0, 7); x.fill(); txt(x, s, 806, 57 + i * 40, 21, '#1c2a24', 600); }); });
  plane(Wn.w - 0.2, 0.86, basic(dLam, { transparent: true, side: THREE.DoubleSide }), Wn.cx, 0.98, FZ + 0.03);
  // targa bianca con il QR, quadro elettrico, civico 35
  const plaqueT = tex(256, 300, (x, w, h) => { x.fillStyle = '#f7f7f5'; x.fillRect(0, 0, w, h); star(x, 96, 46, 16, '#222'); glasses(x, 160, 46, 14, '#222', 5); txt(x, 'CENTRO STUDI', w / 2, 98, 22, '#222', 700, FONT, 'center'); txt(x, 'LAMBDA', w / 2, 126, 28, '#222', 700, FONT, 'center'); txt(x, 'cosa dicono di noi', w / 2, 156, 16, '#555', 500, FONT, 'center'); x.fillStyle = '#fff'; x.fillRect(80, 172, 96, 96); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if ((i * 5 + j * 3 + i * j) % 3 === 0) { x.fillStyle = '#111'; x.fillRect(82 + i * 10, 174 + j * 10, 10, 10); } });
  box(0.66, 0.78, 0.03, '#f7f7f5', -0.55, 1.95, EZ + 0.01, 0.01); plane(0.62, 0.74, basic(plaqueT), -0.55, 1.95, EZ + 0.027);
  box(0.42, 0.5, 0.14, std('#eceae4', { roughness: 0.5 }), -4.15, 1.7, EZ + 0.07, 0.02);
  plane(0.18, 0.16, basic(tex(80, 70, (x, w, h) => { x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, w, h); x.strokeStyle = '#333'; x.lineWidth = 3; x.strokeRect(2, 2, w - 4, h - 4); txt(x, '35', w / 2, 48, 32, '#222', 700, FONT, 'center'); })), DX0 - 0.42, 3.0, EZ + 0.012);
  box(0.06, 3.6, 0.06, '#9a9a96', -5.6, 1.8, EZ + 0.08);                       // pluviale

  /* =====================================================================
     INTERNO
     ===================================================================== */
  const W2 = 5, BK = -2.4, OB = -6.2, VZ = 3.6;   // parete di fondo, fondo dell'ufficio, bussola d'ingresso
  plane(10, 7.4, floorM, 0, 0.002, (FZ + BK) / 2, 0, -Math.PI / 2);
  plane(10, 7.4, std('#efefec', { roughness: 0.95 }), 0, 3.0, (FZ + BK) / 2, 0, Math.PI / 2);
  plane(7.4, 3, std(C.white), -W2, 1.5, (FZ + BK) / 2, Math.PI / 2);
  plane(7.4, 3, std(C.white), W2, 1.5, (FZ + BK) / 2, -Math.PI / 2);
  // muro frontale interno, attorno alla porta e alla vetrina
  [[-5, DX0 - 0.14], [DX1 + 0.14, WX0 - 0.14], [WX1 + 0.14, 5]].forEach(([a, b]) => box(b - a, 3, 0.2, C.white, (a + b) / 2, 1.5, FZ - 0.08));
  box(10, 0.3, 0.2, C.white, 0, 2.85, FZ - 0.08);
  // bussola d'ingresso in legno rosso: zoccolo pieno, vetri sopra, porta ad arco aperta verso l'interno
  const VX0 = DX0 - 0.15, VX1 = DX1 + 0.15, VW = VX1 - VX0, VD = FZ - 0.18 - VZ;
  [VX0, VX1].forEach((x) => { box(0.08, 0.85, VD, woodM, x, 0.425, VZ + VD / 2, 0.01); plane(VD, 1.75, glassM, x, 1.75, VZ + VD / 2, Math.PI / 2); box(0.08, 0.08, VD, woodM, x, 2.62, VZ + VD / 2, 0.01); box(0.08, 2.66, 0.08, woodM, x, 1.33, VZ, 0.01); });
  box(VW, 0.12, 0.08, woodM, (VX0 + VX1) / 2, 2.62, VZ, 0.01);
  const arch = new THREE.Mesh(new THREE.TorusGeometry(VW / 2 - 0.08, 0.05, 8, 32, Math.PI), woodM); arch.position.set((VX0 + VX1) / 2, 2.0, VZ); g.add(arch);
  // anta ad arco aperta (ruotata verso l'interno), con la vetrofania CMA
  const door = new THREE.Group(); door.position.set(VX0 + 0.04, 0, VZ); door.rotation.y = -1.25; g.add(door);
  const dw = VW - 0.1;
  const dPart = (w, h, d, m, x, y) => { const p = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.01), m); p.position.set(x, y, 0); door.add(p); };
  dPart(dw, 0.85, 0.06, woodM, dw / 2, 0.43); dPart(0.07, 2.4, 0.06, woodM, 0.035, 1.2); dPart(0.07, 2.4, 0.06, woodM, dw - 0.035, 1.2);
  const dg = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.14, 1.5), glassM); dg.position.set(dw / 2, 1.6, 0); door.add(dg);
  const dCma = tex(1024, 300, (x, W, H) => { x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(255,255,255,.95)'; x.fillRect(0, 20, W, 260); x.strokeStyle = '#2d4a33'; x.lineWidth = 6; x.beginPath(); x.arc(140, 150, 100, 0, 7); x.stroke(); star(x, 140, 156, 70, C.red); txt(x, 'VINCI I CONCORSI', 280, 118, 60, '#2b2e2f'); txt(x, 'PER LE FORZE', 280, 186, 60, '#2b2e2f'); txt(x, 'ARMATE O DI POLIZIA', 280, 254, 60, '#2b2e2f'); });
  const dd = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.2, (dw - 0.2) * 0.29), basic(dCma, { transparent: true, side: THREE.DoubleSide })); dd.position.set(dw / 2, 1.55, 0.035); door.add(dd); const db = dd.clone(); db.position.z = -0.035; db.rotation.y = Math.PI; door.add(db);
  // vetro fisso sopra la bussola fino al soffitto
  plane(VW, 0.4, glassM, (VX0 + VX1) / 2, 2.82, VZ);
  // parete di fondo: porta a sinistra verso l'ufficio (aperta), porta a vetro satinato a destra
  const DL = -2.7, DR = 1.5;
  box(DL - 0.45 + 5, 3, 0.18, C.white, (-5 + DL - 0.45) / 2, 1.5, BK);
  box(DR - 0.45 - (DL + 0.45), 3, 0.18, C.white, (DL + 0.45 + DR - 0.45) / 2, 1.5, BK);
  box(5 - (DR + 0.45), 3, 0.18, C.white, (DR + 0.45 + 5) / 2, 1.5, BK);
  [DL, DR].forEach((x) => { box(0.9, 0.78, 0.18, C.white, x, 2.61, BK); [-0.47, 0.47].forEach((d) => box(0.07, 2.25, 0.24, '#ffffff', x + d, 1.12, BK)); box(1.0, 0.07, 0.24, '#ffffff', x, 2.25, BK); });
  box(0.04, 2.2, 0.88, std('#f3f3f0'), DL + 0.44, 1.1, BK - 0.48);                  // anta aperta verso l'ufficio
  box(0.88, 2.2, 0.04, std('#f3f3f0'), DR, 1.1, BK - 0.02); plane(0.5, 1.6, std('#dfe3e3', { roughness: 0.3 }), DR, 1.25, BK + 0.005);
  // plafoniere a tubo
  const tubes = [[-2.5, 2.4], [-2.5, 0], [0.4, 2.4], [0.4, 0], [3.2, 1.4], [3.2, -1.2], [-0.8, -1.6]];
  tubes.forEach(([x, z]) => { box(0.14, 0.06, 1.25, std('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.9 }), x, 2.96, z, 0.02); });
  box(0.9, 0.28, 0.22, '#f4f4f2', -4.85, 2.65, -0.5, 0.04);                          // split del clima
  box(0.9, 0.28, 0.22, '#f4f4f2', 4.85, 2.65, 2.8, 0.04);
  const lights = [];
  [[-3, 2.0], [2.6, 1.4], [-0.5, -1.0], [-2, -4.4]].forEach(([x, z]) => { const l = new THREE.PointLight('#fff8f0', 6.5, 9, 1.4); l.position.set(x, 2.5, z); g.add(l); lights.push(l); });

  // logo della sede: disco verde con lo stemma CMA, gli occhiali e i libri di Lambda
  const logoTex = tex(512, 512, (x, w, h) => { const fg = '#eef1ee'; x.fillStyle = C.green; x.beginPath(); x.arc(256, 256, 254, 0, 7); x.fill();
    x.strokeStyle = fg; x.lineWidth = 4; x.beginPath(); x.arc(178, 168, 52, 0, 7); x.stroke(); star(x, 178, 172, 30, fg);
    x.save(); x.font = `700 13px ${FONT}`; x.fillStyle = fg; x.textAlign = 'center'; 'MILITARY ACADEMY'.split('').forEach((ch, i, a) => { const an = -Math.PI * 0.85 + (i / (a.length - 1)) * Math.PI * 0.7; x.save(); x.translate(178 + Math.cos(an) * 42, 168 + Math.sin(an) * 42); x.rotate(an + Math.PI / 2); x.fillText(ch, 0, 4); x.restore(); }); x.restore();
    glasses(x, 330, 150, 20, fg, 7); [0, 1, 2].forEach((i) => { x.fillStyle = fg; x.fillRect(296, 180 + i * 14, 70 - i * 6, 9); });
    txt(x, 'CENTRO STUDI', 256, 310, 46, fg, 700, FONT, 'center'); txt(x, 'LAMBDA', 256, 384, 82, fg, 700, FONT, 'center'); });
  const logoM = basic(logoTex, { transparent: true });
  const logo = (r, x, y, z, ry) => { const d = new THREE.Mesh(new THREE.CircleGeometry(r, 48), logoM); d.position.set(x, y, z); d.rotation.y = ry; g.add(d); };
  const plant = (x, z, s = 1, y0 = 0, pot = '#3a3a3a') => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * s, 0.14 * s, 0.32 * s, 20), std(pot)); p.position.set(x, y0 + 0.16 * s, z); g.add(p); for (let i = 0; i < 9; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.18 * s, 10, 8), std('#2f7d4f', { roughness: 0.8, flatShading: true })); l.scale.set(0.5, 0.12, 1.4); l.position.set(x + Math.cos(i) * 0.18 * s, y0 + (0.45 + (i % 4) * 0.2) * s, z + Math.sin(i * 1.9) * 0.18 * s); l.rotation.set(0.6, i * 0.8, 0.3); g.add(l); } };
  const chair = (x, z, ry, y0 = 0) => { const c = new THREE.Group(); c.position.set(x, y0, z); c.rotation.y = ry; g.add(c); const m = std('#1c1d1f', { roughness: 0.55 });
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.48, 2, 0.03), m); s.position.y = 0.48; c.add(s);
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.72, 0.06, 2, 0.03), m); b.position.set(0, 0.92, 0.25); b.rotation.x = -0.1; c.add(b);
    const hd = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.14, 0.06, 2, 0.03), m); hd.position.set(0, 1.38, 0.3); c.add(hd);
    [-1, 1].forEach((sd) => { const a = new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.05, 0.3, 2, 0.02), m); a.position.set(sd * 0.27, 0.68, 0.02); c.add(a); });
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), std('#333')); p.position.y = 0.26; c.add(p);
    const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 5), m); bs.position.y = 0.05; c.add(bs); return c; };

  /* ---------- RECEPTION: subito a sinistra entrando, contro la parete sinistra ---------- */
  const RX = -4.15, RZ = 1.7;
  [-0.5, 0.5].forEach((dz) => { box(0.62, 1.05, 0.98, C.white, RX, 0.525, RZ + dz, 0.015); box(0.66, 0.03, 1.0, std('#fbfbfa', { roughness: 0.3 }), RX, 1.065, RZ + dz, 0.01);
    [0.38, 0.72].forEach((y) => plane(0.98, 0.022, std('#151515'), RX + 0.312, y, RZ + dz, Math.PI / 2)); });
  [RZ - 0.5, RZ + 0.5].forEach((z) => chair(RX - 0.55, z, -Math.PI / 2));
  [[RZ - 0.92, 0.09], [RZ + 0.95, 0.1]].forEach(([z]) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.24, 14), steel); b.position.set(RX + 0.05, 1.2, z); g.add(b); });
  // pannelli fonoassorbenti esagonali grigi dietro le sedie
  const hexM = std('#bfc1c3', { roughness: 1 }), hex = new THREE.CircleGeometry(0.19, 6);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(hex, hexM); m.rotation.set(0, Math.PI / 2, Math.PI / 6); m.position.set(-W2 + 0.02, 1.12 + r * 0.29, RZ - 1.05 + k * 0.4 + (r ? 0.2 : 0)); g.add(m); }
  logo(0.62, -W2 + 0.02, 2.25, RZ, Math.PI / 2);
  // orologio, estintore, pianta, cartello
  const clk = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), basic(tex(128, 128, (x, w, h) => { x.fillStyle = '#1d2e4a'; x.beginPath(); x.arc(64, 64, 63, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 4; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.moveTo(64 + Math.cos(a) * 50, 64 + Math.sin(a) * 50); x.lineTo(64 + Math.cos(a) * 58, 64 + Math.sin(a) * 58); x.stroke(); } x.beginPath(); x.moveTo(64, 64); x.lineTo(64, 26); x.moveTo(64, 64); x.lineTo(92, 70); x.stroke(); })));
  clk.position.set(-W2 + 0.02, 2.2, -0.2); clk.rotation.y = Math.PI / 2; g.add(clk);
  const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16), std('#c8202a', { roughness: 0.4 })); ext.position.set(-4.82, 0.3, RZ + 1.35); g.add(ext);
  plane(0.18, 0.24, basic(tex(64, 84, (x, w, h) => { x.fillStyle = '#d9262e'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.fillRect(22, 18, 20, 44); })), -W2 + 0.02, 1.25, RZ + 1.35, Math.PI / 2);
  plant(-4.45, 0.15, 1.35);
  plane(0.42, 0.2, basic(tex(170, 80, (x, w, h) => { x.fillStyle = '#0f8a46'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.fillRect(16, 16, 30, 48); txt(x, '→', 110, 58, 44, '#fff', 700, FONT, 'center'); })), (VX0 + VX1) / 2, 2.82, VZ - 0.01, Math.PI);   // uscita di sicurezza

  /* ---------- ATTESA: parete in doghe con la TV, due poltroncine senape, tappeto verde ---------- */
  const AX = -0.6;
  const slatT = tex(256, 256, (x, w, h) => { x.fillStyle = '#2a2420'; x.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { const gr = x.createLinearGradient(i * 32, 0, i * 32 + 22, 0); gr.addColorStop(0, '#a87a4c'); gr.addColorStop(0.5, '#c4945f'); gr.addColorStop(1, '#a3744a'); x.fillStyle = gr; x.fillRect(i * 32 + 4, 0, 22, h); } }, [3.5, 1]);
  box(1.15, 2.85, 0.05, new THREE.MeshStandardMaterial({ map: slatT, roughness: 0.75 }), AX, 1.44, BK + 0.115, 0.005);
  box(1.3, 0.76, 0.06, '#111214', AX, 1.85, BK + 0.18, 0.02);
  const tvT = tex(512, 300, (x, w, h) => { x.fillStyle = '#f3f5f6'; x.fillRect(0, 0, w, h); x.fillStyle = '#1f2a44'; x.fillRect(0, 0, w, 64); x.fillStyle = '#56636f'; x.fillRect(16, 12, 110, 40); txt(x, 'CENTRO STUDI LAMBDA', 140, 32, 16, '#fff', 700); txt(x, 'Metodo di studio e ripetizioni', 140, 52, 13, '#cbd3dc', 500); txt(x, 'Centro Studi Lambda', 30, 104, 20, '#222', 700); x.fillStyle = '#00B67A'; for (let i = 0; i < 5; i++) x.fillRect(30 + i * 24, 116, 20, 20); txt(x, '4,9', 380, 120, 46, '#222', 700); [0, 1, 2, 3, 4].forEach((i) => { x.fillStyle = '#e1e5e8'; x.fillRect(330, 140 + i * 14, 150, 7); x.fillStyle = '#00B67A'; x.fillRect(330, 140 + i * 14, 150 - i * 32, 7); }); x.fillStyle = '#e7eaee'; for (let i = 0; i < 4; i++) x.fillRect(30, 160 + i * 28, 260, 16); });
  plane(1.22, 0.68, basic(tvT), AX, 1.85, BK + 0.215);
  plane(2.4, 1.6, std('#2f4f48', { roughness: 1 }), AX, 0.006, BK + 1.05, 0, -Math.PI / 2);
  const armchair = (x, z, ry) => { const a = new THREE.Group(); a.position.set(x, 0, z); a.rotation.y = ry; g.add(a);
    const m = std(C.mustard, { roughness: 0.9 });
    const s = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.18, 0.6, 2, 0.08), m); s.position.y = 0.44; a.add(s);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.35, 0.44, 24, 1, true, Math.PI * 0.4, Math.PI * 1.2), m); b.material.side = THREE.DoubleSide; b.position.set(0, 0.76, 0.02); a.add(b);
    [-0.12, 0.12].forEach((dx) => { const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), m); lobe.scale.set(1, 0.7, 0.45); lobe.position.set(dx, 0.98, -0.3); a.add(lobe); });
    [[-0.26, -0.22], [0.26, -0.22], [-0.26, 0.22], [0.26, 0.22]].forEach(([dx, dz]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.4), std('#1a1a1a')); l.position.set(dx * 1.05, 0.18, dz * 1.05); l.rotation.set(dz * 0.35, 0, -dx * 0.35); a.add(l); }); return a; };
  [[AX - 0.85, BK + 1.05], [AX + 0.85, BK + 1.05]].forEach(([x, z]) => armchair(x, z, face(AX - x, 0.8) + Math.PI));
  const tt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 28), std('#1a1a1a')); tt.position.set(AX, 0.58, BK + 0.75); g.add(tt);
  [0, 1, 2, 3].forEach((i) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.58), std('#1a1a1a')); const a = i * Math.PI / 2 + 0.6; l.position.set(AX + Math.cos(a) * 0.14, 0.29, BK + 0.75 + Math.sin(a) * 0.14); g.add(l); });
  plant(AX, BK + 0.75, 0.6, 0.6, '#f4f4f2');

  /* ---------- AULA STUDIO: le postazioni sulla parete destra, la vetrina sulla destra ---------- */
  const tabletT = tex(512, 320, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#123747'); gr.addColorStop(1, '#0a1c26'); x.fillStyle = gr; x.fillRect(0, 0, w, h); txt(x, 'LEZIONE LIVE', 24, 40, 20, '#3fc8d1', 500, MONO); x.fillStyle = '#1d5a6d'; x.fillRect(24, 58, 464, 200); x.fillStyle = 'rgba(229,239,242,.9)'; x.beginPath(); x.arc(256, 130, 32, 0, 7); x.fill(); x.beginPath(); x.ellipse(256, 236, 66, 52, 0, Math.PI, 0); x.fill(); x.fillStyle = '#00B67A'; x.beginPath(); x.arc(36, 292, 7, 0, 7); x.fill(); txt(x, cma ? 'Collegato alla Rete CMA' : 'Collegato alla Rete Lambda', 52, 300, 20, '#fff', 500); });
  const tabM = basic(tabletT), beams = [], chairs = [];
  const DX = 4.55, rowZ = [-1.55, -0.25, 1.05, 2.35];
  rowZ.forEach((z, i) => {
    box(0.65, 0.035, 1.1, C.white, DX, 0.75, z, 0.01);
    [-0.48, 0.48].forEach((dz) => { box(0.05, 0.7, 0.05, C.white, DX, 0.38, z + dz); box(0.6, 0.04, 0.05, C.white, DX, 0.04, z + dz); });
    const lap = box(0.02, 0.2, 0.3, '#2b2d30', DX + 0.12, 0.88, z + 0.1, 0.008); lap.rotation.z = 0.25;
    const sc = plane(0.28, 0.18, tabM, DX + 0.105, 0.885, z + 0.1, -Math.PI / 2); sc.rotation.order = 'YXZ'; sc.rotation.x = 0.25;
    box(0.025, 0.4, 0.025, '#f2f2f0', DX + 0.2, 0.96, z - 0.38).rotation.x = 0.35;     // lampada bianca
    const sh = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 16, 1, true), std('#f2f2f0', { side: THREE.DoubleSide })); sh.position.set(DX + 0.2, 1.17, z - 0.3); sh.rotation.x = 2.2; g.add(sh);
    if (i % 2) plant(DX + 0.15, z + 0.4, 0.45, 0.77, '#b8663e');
    box(0.04, 1.12, 0.6, std(C.blue, { roughness: 0.95 }), W2 - 0.03, 2.0, z, 0.01);   // pannello fonoassorbente blu
    chairs.push(chair(DX - 0.7, z, -Math.PI / 2 + (i - 1.5) * 0.08));
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 10, 1, true), new THREE.MeshBasicMaterial({ color: '#3fc8d1', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.position.set(DX + 0.1, 2.0, z + 0.1); g.add(beam); beams.push(beam);
  });
  // divisori alti in feltro chiaro su ruote, tra una postazione e l'altra
  const feltM = new THREE.MeshStandardMaterial({ map: tex(128, 128, (x, w, h) => noise(x, w, h, C.felt, 900, 0.08)), roughness: 1 });
  [-0.9, 0.4, 1.7].forEach((z) => { box(0.95, 1.85, 0.06, feltM, DX - 0.1, 1.1, z, 0.02); box(0.7, 0.04, 0.06, C.white, DX - 0.1, 0.1, z); [-0.32, 0.32].forEach((dx) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12), std('#ddd')); w.rotation.x = Math.PI / 2; w.position.set(DX - 0.1 + dx, 0.035, z); g.add(w); }); });
  plant(4.35, 3.6, 1.3, 0, '#4a4a4a');
  const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.34, 16), std('#2a2a2a')); bin.position.set(DX + 0.1, 0.17, rowZ[1] + 0.62); g.add(bin);
  // uno studente al lavoro (seconda postazione)
  const stu = new THREE.Group(); stu.position.set(DX - 0.75, 0, rowZ[1]); stu.rotation.y = -Math.PI / 2; g.add(stu);
  const sb = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.36, 6, 16), std(cma ? '#4B5A2B' : '#7fa7d9')); sb.position.y = 0.82; stu.add(sb);
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), std('#eec7a2')); sh.position.y = 1.2; stu.add(sh);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 16, 0, 6.3, 0, 1.5), std('#3b2a20')); hair.position.y = 1.22; if (cma) hair.scale.y = 0.62; stu.add(hair);

  /* ---------- UFFICIO PER I COLLOQUI: sul retro, oltre la porta a sinistra (non in foto) ---------- */
  const OX0 = -5, OX1 = 0.6;
  plane(OX1 - OX0, BK - OB, floorM, (OX0 + OX1) / 2, 0.003, (BK + OB) / 2, 0, -Math.PI / 2);
  plane(OX1 - OX0, BK - OB, std('#efefec', { roughness: 0.95 }), (OX0 + OX1) / 2, 2.99, (BK + OB) / 2, 0, Math.PI / 2);
  plane(OX1 - OX0, 3, std(C.white), (OX0 + OX1) / 2, 1.5, OB);
  plane(BK - OB, 3, std(C.white), OX1, 1.5, (BK + OB) / 2, -Math.PI / 2);
  plane(BK - OB, 3, std(C.white), OX0, 1.5, (BK + OB) / 2, Math.PI / 2);
  box(1.7, 0.04, 0.9, C.white, -1.9, 0.75, -4.6, 0.02);
  [[-2.65, -4.95], [-1.15, -4.95], [-2.65, -4.25], [-1.15, -4.25]].forEach(([x, z]) => box(0.04, 0.73, 0.04, '#222', x, 0.37, z));
  [[-2.35, -5.3, 0], [-1.45, -5.3, 0], [-2.35, -3.9, Math.PI], [-1.45, -3.9, Math.PI]].forEach(([x, z, r]) => { box(0.42, 0.05, 0.42, std(C.mustard, { roughness: 0.9 }), x, 0.46, z); box(0.42, 0.42, 0.04, std(C.mustard, { roughness: 0.9 }), x, 0.7, z + (r ? 0.2 : -0.2)); [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(([dx, dz]) => box(0.02, 0.44, 0.02, '#111', x + dx, 0.22, z + dz)); });
  logo(0.45, -1.9, 1.9, OB + 0.01, 0);
  box(1.3, 0.85, 0.03, '#fbfbfa', -4.0, 1.55, OB + 0.03, 0.01); box(1.36, 0.04, 0.06, '#c9cccc', -4.0, 1.1, OB + 0.05, 0.01);   // lavagna bianca
  plant(0.1, -5.8, 1.0, 0, '#f4f4f2');
  box(0.4, 1.8, 0.35, '#1d1e20', -4.6, 0.9, -3.0, 0.01);
  const ol = new THREE.PointLight('#fff6ec', 5, 7, 1.4); ol.position.set(-1.9, 2.5, -4.5); g.add(ol); lights.push(ol);

  /* ---------- animazioni ---------- */
  const connect = (k, t = 0) => {
    beams.forEach((b, i) => { b.material.opacity = k * (0.45 + 0.25 * Math.sin(t * 3 + i)); b.scale.y = 0.2 + 0.8 * k; b.position.y = 0.95 + 1.05 * (0.2 + 0.8 * k); });
    lights.forEach((l) => (l.intensity = 6.5 * (1 - 0.5 * k)));
  };
  const idle = (t) => { sh.rotation.x = 0.25 + Math.sin(t * 1.1) * 0.05; chairs.forEach((c, i) => { if (i !== 1) c.rotation.y = -Math.PI / 2 + (i - 1.5) * 0.08 + Math.sin(t * 0.3 + i) * 0.04; }); };

  /* ---------- tappe del tour ---------- */
  const BR = cma ? 'CMA' : 'Lambda';
  const stops = [
    { k: 'L\'ingresso', t: `${BR} Lecco, sulla strada.`, p: 'In via Pietro Nava 35: a destra la vetrina del Centro Studi Lambda, a sinistra la porta di Concorsi Militari Academy. Si entra da lì.', cam: [-1.3, 2.2, 12.8], tgt: [-1.2, 1.3, 5.0], hot: [D.cx, 1.5, 5.3] },
    { k: 'Reception', t: 'L\'accoglienza, subito a sinistra.', p: 'Oltre la porta ad arco, la reception è appena entri sulla sinistra: informazioni, orari, il primo colloquio.', cam: [0.6, 1.7, 1.0], tgt: [-4.4, 1.15, 2.0], hot: [RX, 1.6, RZ] },
    { k: 'Lo spazio', t: 'Un angolo per aspettare.', p: 'La parete in legno con lo schermo, le poltroncine sul tappeto verde: un posto dove aspettare, o fare una pausa tra una lezione e l\'altra.', cam: [-0.5, 1.6, 3.5], tgt: [-0.6, 1.2, BK], hot: [AX, 2.55, BK + 0.2] },
    { k: 'Aula studio', t: 'La tua postazione.', p: cma ? 'Sulla parete di destra, le postazioni separate dai divisori: segui le lezioni live e ti alleni sul simulatore, con un docente collegato.' : 'Sulla parete di destra, le postazioni separate dai divisori: segui le lezioni live con i docenti, e in aula studio un docente è sempre collegato.', cam: [0.4, 1.65, 0.5], tgt: [4.9, 1.1, 0.4], hot: [4.8, 2.75, 1.05] },
    { k: 'Colloqui', t: 'Gli incontri individuali.', p: 'Sul retro, oltre la porta a sinistra della parete in legno, l\'ufficio dove incontri la tua tutor personale, psicologa esperta in apprendimento: per conoscervi e fare il punto sul percorso.', cam: [-3.9, 1.65, -2.8], tgt: [-1.8, 0.85, -5.2], hot: [-1.9, 1.95, -4.9] },
    { k: 'Collegati alla rete', t: `Dalla sede, tutta ${BR}.`, p: cma ? 'Dalla postazione accedi alla Rete CMA: gli stessi docenti, tutor e simulatore di chi si prepara da casa.' : 'Dalla postazione accedi alla Rete Lambda: gli stessi docenti e le stesse aule studio di chi si collega da casa.', cam: [0.9, 1.9, 0.5], tgt: [4.9, 1.85, 0.4], hot: [3.6, 2.75, 2.35], connect: true },
  ];
  return { group: g, connect, idle, stops, bg: '#dde7ec' };
}
