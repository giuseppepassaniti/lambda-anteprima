/* =====================================================================
   LAMBDA · la sede di Messina, ricostruita in 3D dalle foto reali (stile illustrato)
   ~100 m²: vetrine su strada (Centro Studi Lambda + Concorsi Militari Academy),
   reception, aula studio con postazioni, ufficio per i colloqui individuali, sala relax.
   Coordinate: x = larghezza (-6..6), z = profondità (strada a +z, fondo a -z), y = altezza.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const FONT = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';
const C = { green: '#16352a', greenFrame: '#1d3d31', ochre: '#d8a24a', stone: '#9b948a', oak: '#d9cfc2', white: '#f5f6f4', black: '#17191a', marble: '#b9bcbc',
  blue: '#1f3f8a', teal: '#1d5f6e', orange: '#ee9330', gold: '#d9b45a', red: '#CD141F', hud: '#a9b97a' };

export function buildMessina({ cma = false, outdoorLight = true } = {}) {
  const g = new THREE.Group();
  const mats = {};
  const std = (color, o = {}) => { const k = color + JSON.stringify(o); return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o })); };
  const box = (w, h, d, mat, x, y, z, r = 0.012) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), typeof mat === 'string' ? std(mat) : mat); m.position.set(x, y, z); g.add(m); return m; };
  const plane = (w, h, mat, x, y, z, ry = 0, rx = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); g.add(m); return m; };
  const tex = (w, h, draw, repeat) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t; };
  const basic = (t, o = {}) => new THREE.MeshBasicMaterial({ map: t, toneMapped: false, ...o });
  const txt = (x, s, X, Y, size, color, w = 700, font = FONT, align = 'left') => { x.font = `${w} ${size}px ${font}`; x.fillStyle = color; x.textAlign = align; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); };
  const star = (x, cx, cy, r, color) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } x.closePath(); x.fillStyle = color; x.fill(); };
  const glasses = (x, cx, cy, r, color, lw) => { x.strokeStyle = color; x.lineWidth = lw; [-1, 1].forEach((s) => { x.beginPath(); x.arc(cx + s * r * 1.15, cy, r, 0, 7); x.stroke(); }); x.beginPath(); x.moveTo(cx - r * 0.25, cy - r * 0.1); x.quadraticCurveTo(cx, cy - r * 0.45, cx + r * 0.25, cy - r * 0.1); x.stroke(); };
  const noise = (x, w, h, base, n, a) => { x.fillStyle = base; x.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${Math.random() * a})`; x.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 2 + Math.random() * 3); } };

  /* ---------- materiali con texture ---------- */
  const floorT = tex(512, 512, (x, w, h) => { for (let r = 0; r < 8; r++) { const off = (r % 2) * 128; for (let k = -1; k < 3; k++) { const l = 175 + Math.random() * 18; x.fillStyle = `rgb(${l + 30},${l + 22},${l + 10})`; x.fillRect(off + k * 256, r * 64, 254, 62); } } x.fillStyle = 'rgba(0,0,0,.08)'; for (let r = 0; r < 8; r++) x.fillRect(0, r * 64 + 62, w, 2); }, [4, 3]);
  const floorM = new THREE.MeshStandardMaterial({ map: floorT, roughness: 0.6 });
  const ochreT = tex(256, 256, (x, w, h) => noise(x, w, h, C.ochre, 1800, 0.08), [6, 4]);
  const stoneT = tex(512, 256, (x, w, h) => { noise(x, w, h, C.stone, 2600, 0.18); x.strokeStyle = 'rgba(40,35,30,.35)'; x.lineWidth = 3; [[0, 120, 512, 128], [180, 0, 170, 120], [380, 128, 400, 256]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); }); }, [6, 1]);
  const marbleT = tex(512, 256, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#c9cccc'); gr.addColorStop(1, '#a9adad'); x.fillStyle = gr; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.45)'; for (let i = 0; i < 14; i++) { x.lineWidth = 1 + Math.random() * 2.5; x.beginPath(); x.moveTo(Math.random() * w, 0); x.bezierCurveTo(Math.random() * w, h * 0.3, Math.random() * w, h * 0.7, Math.random() * w, h); x.stroke(); } });
  const glassM = new THREE.MeshStandardMaterial({ color: '#cfe0e2', transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, depthWrite: false, side: THREE.DoubleSide });
  const frostM = new THREE.MeshStandardMaterial({ color: '#f4f6f6', transparent: true, opacity: 0.72, roughness: 0.9, depthWrite: false, side: THREE.DoubleSide });

  /* =====================================================================
     ESTERNO: facciata ocra, zoccolo in pietra, due vetrine con telaio verde e insegne
     ===================================================================== */
  const FZ = 4.2;
  // luce del sole sulla facciata (solo nel tour della sede: nel viaggio delle sedi la scena ha già le sue luci)
  if (outdoorLight) { const sun = new THREE.DirectionalLight('#fff3df', 1.6); sun.position.set(-6, 12, 18); sun.target.position.set(0, 1, 4); g.add(sun, sun.target); g.add(new THREE.HemisphereLight('#ffffff', '#b9b2a6', 0.55)); }
  plane(26, 30, new THREE.MeshStandardMaterial({ color: '#b7b3ad', roughness: 0.95 }), 0, 0.001, FZ + 15, 0, -Math.PI / 2);                                  // marciapiede
  const paveT = tex(256, 256, (x, w, h) => { noise(x, w, h, '#bdb8b0', 900, 0.08); x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } }, [10, 2]);
  plane(26, 3.4, new THREE.MeshStandardMaterial({ map: paveT, roughness: 0.9 }), 0, 0.004, FZ + 1.7, 0, -Math.PI / 2);
  plane(26, 8, std('#55595c', { roughness: 0.95 }), 0, 0.006, FZ + 7.4, 0, -Math.PI / 2);                                                                // strada
  box(26, 0.14, 0.2, '#9a958d', 0, 0.07, FZ + 3.4);                                                                                                       // cordolo
  // muro esterno: intonaco ocra sopra, pietra in basso, sui lati e tra le vetrine
  const ochreM = new THREE.MeshStandardMaterial({ map: ochreT, roughness: 0.95 }), stoneM = new THREE.MeshStandardMaterial({ map: stoneT, roughness: 0.95 });
  const EZ = FZ + 0.13;
  plane(26, 5.4, ochreM, 0, 5.7, EZ);                                     // piani superiori
  plane(26, 0.5, ochreM, 0, 3.25, EZ);                                    // fascia sopra le insegne
  [[-9.0, 7.2], [9.05, 7.2]].forEach(([x, w]) => { plane(w, 2.0, ochreM, x, 2.0, EZ); plane(w, 1.0, stoneM, x, 0.5, EZ); });
  plane(1.5, 2.0, ochreM, -0.2, 2.0, EZ); plane(1.5, 1.0, stoneM, -0.2, 0.5, EZ);   // tra le due vetrine
  // finestre dei piani superiori
  [-4, 0, 4].forEach((x) => { box(1.3, 1.6, 0.06, std('#3b3f42', { roughness: 0.4 }), x, 5.2, EZ + 0.02); box(1.5, 0.08, 0.2, '#e8dcc6', x, 4.36, EZ + 0.1); });
  // targa con QR tra le vetrine
  const plaqueT = tex(256, 320, (x, w, h) => { x.fillStyle = '#fafafa'; x.fillRect(0, 0, w, h); glasses(x, w / 2 - 30, 60, 16, C.green, 5); star(x, w / 2 + 40, 60, 20, C.red); txt(x, 'CENTRO STUDI', w / 2, 120, 22, C.green, 700, FONT, 'center'); txt(x, 'LAMBDA', w / 2, 146, 22, C.green, 700, FONT, 'center'); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if ((i * 7 + j * 3 + i * j) % 3 === 0 || i < 2 && j < 2 || i < 2 && j > 6 || i > 6 && j < 2) { x.fillStyle = '#111'; x.fillRect(80 + i * 11, 180 + j * 11, 11, 11); } });
  plane(0.34, 0.42, basic(plaqueT), -0.21, 1.6, EZ + 0.02);

  // una vetrina: telaio verde, vetro, fascia con l'insegna, vetrofania
  function shopfront(x0, x1, sign, decal, decalY, door) {
    const w = x1 - x0, cx = (x0 + x1) / 2, fr = std(C.greenFrame, { roughness: 0.45, metalness: 0.3 });
    box(w + 0.16, 0.12, 0.14, fr, cx, 0.06, FZ + 0.06);                       // soglia
    box(w + 0.16, 0.1, 0.14, fr, cx, 2.6, FZ + 0.06);                         // traverso
    [x0 - 0.04, x1 + 0.04].forEach((x) => box(0.1, 2.6, 0.14, fr, x, 1.3, FZ + 0.06));
    box(w, 0.06, 0.08, fr, cx, 2.25, FZ + 0.06);                              // sopraluce
    plane(w, 2.5, glassM, cx, 1.3, FZ + 0.05);
    if (door) { box(0.07, 2.25, 0.1, fr, door[0], 1.13, FZ + 0.07); box(0.07, 2.25, 0.1, fr, door[1], 1.13, FZ + 0.07); box(0.04, 0.5, 0.06, std('#c9cccc', { metalness: 0.8, roughness: 0.3 }), door[0] + 0.12, 1.05, FZ + 0.14); }
    // insegna a fascia
    const sT = tex(1024, 128, (x, W, H) => { x.fillStyle = sign.bg; x.fillRect(0, 0, W, H); txt(x, sign.t, W / 2, H / 2 + 18, 52, '#ffffff', 700, FONT, 'center'); });
    box(w + 0.3, 0.46, 0.12, std(sign.bg, { roughness: 0.5 }), cx, 2.9, FZ + 0.08);
    plane(w + 0.2, 0.4, basic(sT), cx, 2.9, FZ + 0.145);
    // vetrofania
    const dT = tex(1024, 256, decal); const dw = (door ? door[0] - x0 : w) - 0.2;
    plane(dw, dw * 0.25, basic(dT, { transparent: true, side: THREE.DoubleSide }), x0 + 0.1 + dw / 2, decalY, FZ + 0.055);
  }
  // Concorsi Militari Academy (vetrina dell'aula studio)
  shopfront(-5.4, -0.95, { bg: '#121314', t: 'CONCORSI MILITARI ACADEMY' }, (x, W, H) => {
    x.fillStyle = 'rgba(255,255,255,.93)'; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#2d4a33'; x.lineWidth = 6; x.beginPath(); x.arc(150, 128, 84, 0, 7); x.stroke(); star(x, 150, 132, 62, C.red);
    x.font = `700 46px ${FONT}`; const w1 = x.measureText('CONCORSI ').width; txt(x, 'CONCORSI ', 270, 110, 46, '#2d4a33'); txt(x, 'MILITARI ACADEMY', 270 + w1, 110, 46, C.red);
    x.fillStyle = '#121314'; x.fillRect(270, 140, 720, 50); txt(x, 'VINCI I CONCORSI PER LE FORZE ARMATE O DI POLIZIA', 284, 175, 26, '#fff', 700);
  }, 1.95);
  // Centro Studi Lambda (vetrina con l'ingresso)
  shopfront(0.55, 5.45, { bg: C.green, t: 'CENTRO STUDI LAMBDA' }, (x, W, H) => {
    x.fillStyle = 'rgba(255,255,255,.93)'; x.fillRect(0, 0, W, H);
    txt(x, 'CENTRO STUDI LAMBDA', 40, 78, 52, '#1c2a24'); x.fillStyle = C.green; x.fillRect(40, 96, 520, 46); txt(x, 'METODO DI STUDIO E RIPETIZIONI', 54, 130, 30, '#fff');
    txt(x, 'Uniamo l\'innovazione dei metodi di studio', 40, 182, 26, '#1c2a24', 500); txt(x, 'personalizzati alle ripetizioni tradizionali.', 40, 214, 26, '#1c2a24', 500);
    ['Metodo di studio', 'Supporto DSA e BES', 'Ripetizioni', 'Recupero debiti', 'Concorsi Forze Armate e Polizia', 'Supporto psicologico'].forEach((s, i) => { x.fillStyle = '#1c2a24'; x.beginPath(); x.arc(640, 44 + i * 36, 5, 0, 7); x.fill(); txt(x, s, 656, 52 + i * 36, 25, '#1c2a24', 600); });
  }, 1.55, [4.2, 5.4]);
  // pianta in vaso fuori e zerbino
  const plant = (x, z, s = 1) => { box(0.42 * s, 0.5 * s, 0.42 * s, '#2a2c2d', x, 0.25 * s, z, 0.05); for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 10, 8), std('#2f7d4f', { roughness: 0.8, flatShading: true })); l.scale.set(1, 0.45, 1.6); l.position.set(x + Math.cos(i) * 0.18 * s, (0.65 + (i % 3) * 0.16) * s, z + Math.sin(i * 1.7) * 0.18 * s); l.rotation.set(Math.random(), i, Math.random() * 0.6); g.add(l); } };
  plant(-6.1, FZ + 0.6, 1.2);
  // un albero sul marciapiede, come in via Pellegrino
  const tree = (x, z) => { const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 2.6, 8), std('#5b4a3a', { roughness: 1 })); tr.position.set(x, 1.3, z); g.add(tr);
    [[0, 3.0, 0, 0.95], [0.55, 2.7, 0.2, 0.7], [-0.5, 2.75, -0.15, 0.72], [0.1, 3.5, -0.1, 0.65]].forEach(([dx, y, dz, r]) => { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), std('#3f7d45', { roughness: 0.9, flatShading: true })); c.position.set(x + dx, y, z + dz); g.add(c); });
    box(0.9, 0.04, 0.9, '#6d675e', x, 0.02, z, 0.01); };
  tree(7.4, FZ + 2.6);

  /* =====================================================================
     INTERNO: pavimento in rovere chiaro, pareti bianche, soffitto con binari e anelli luminosi
     ===================================================================== */
  plane(12, 8.4, floorM, 0, 0.002, 0, 0, -Math.PI / 2);
  plane(12, 8.4, std('#fbfbfa'), 0, 3.0, 0, 0, Math.PI / 2);
  plane(8.4, 3, std(C.white), -6, 1.5, 0, Math.PI / 2);
  plane(8.4, 3, std(C.white), 6, 1.5, 0, -Math.PI / 2);
  plane(12, 3, std(C.white), 0, 1.5, -4.2);
  // muro frontale interno (attorno alle vetrine)
  [[-5.7, 0.6], [-0.2, 1.5], [5.72, 0.56]].forEach(([x, w]) => box(w, 3, 0.2, C.white, x, 1.5, FZ - 0.08));
  box(12, 0.4, 0.2, C.white, 0, 2.82, FZ - 0.08);
  // pareti vetrate con fascia satinata
  const glassWall = (len, x, z, ry, door) => {
    const grp = new THREE.Group(); grp.position.set(x, 0, z); grp.rotation.y = ry; g.add(grp);
    const add = (m, px, py) => { m.position.set(px, py, 0); grp.add(m); };
    const segs = door ? [[-len / 2, door[0]], [door[1], len / 2]] : [[-len / 2, len / 2]];
    segs.forEach(([a, b]) => { const w = b - a; add(new THREE.Mesh(new THREE.PlaneGeometry(w, 2.9), glassM), (a + b) / 2, 1.45); add(new THREE.Mesh(new THREE.PlaneGeometry(w, 0.7), frostM), (a + b) / 2, 1.3); });
    const prof = std('#cfd3d3', { metalness: 0.7, roughness: 0.3 });
    add(new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.06), prof), 0, 2.93); add(new THREE.Mesh(new THREE.BoxGeometry(len, 0.04, 0.06), prof), 0, 0.02);
    return grp;
  };
  glassWall(3.7, -0.95, 2.35, Math.PI / 2, [-1.2, -0.25]);   // aula studio, lato corridoio (con porta)
  glassWall(5.05, -3.475, 0.5, 0);                             // aula studio / ufficio
  glassWall(4.7, -0.95, -1.85, Math.PI / 2, [0.9, 1.8]);      // ufficio, lato corridoio (con porta)
  // colonna e parete della reception
  box(0.45, 3, 0.45, C.white, 0.95, 1.5, 0.75);
  box(3.6, 3, 0.18, C.white, 3.2, 1.5, 0.75);
  // luci a soffitto: binari con faretti e anelli
  const lights = [];
  if (!outdoorLight) { [[-3.5, 1.5], [3.4, 1.5], [0, -2.5]].forEach(([x, z]) => { const l = new THREE.PointLight('#ffffff', 4, 10, 1.2); l.position.set(x, 1.8, z); g.add(l); }); }
  [[-3.5, 2.4], [3.4, 2.6], [-3.4, -1.9], [3.6, -2.0], [0.1, 0.5]].forEach(([x, z]) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 40), new THREE.MeshBasicMaterial({ color: '#ffffff' })); ring.rotation.x = Math.PI / 2; ring.position.set(x, 2.55, z); g.add(ring);
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.45), std('#888')); wire.position.set(x, 2.78, z); g.add(wire);
    const l = new THREE.PointLight('#fff6ec', 7, 9, 1.4); l.position.set(x, 2.4, z); g.add(l); lights.push(l);
  });
  [-3.4, 0.1, 3.4].forEach((x) => { box(0.05, 0.04, 7.6, '#1b1b1b', x, 2.97, 0); for (let k = -3; k <= 3; k++) { const s = box(0.08, 0.14, 0.08, '#1b1b1b', x, 2.88, k * 1.1, 0.02); s.rotation.x = 0.4; } });

  /* ---------- RECEPTION ---------- */
  box(2.3, 1.02, 0.7, C.white, 3.1, 0.51, 2.05, 0.02);                                   // bancone
  plane(1.1, 0.92, new THREE.MeshStandardMaterial({ map: marbleT, roughness: 0.35 }), 3.7, 0.5, 2.405);  // frontale effetto marmo
  box(2.36, 0.04, 0.76, C.white, 3.1, 1.04, 2.05, 0.01);
  [2.6, 3.6].forEach((x) => { box(0.5, 0.08, 0.5, C.black, x, 0.5, 1.45); box(0.5, 0.55, 0.07, C.black, x, 0.82, 1.22); box(0.06, 0.45, 0.06, '#333', x, 0.25, 1.45); });
  const logoT = tex(512, 512, (x, w, h) => { x.fillStyle = C.green; x.beginPath(); x.arc(256, 256, 254, 0, 7); x.fill(); star(x, 196, 170, 34, '#e9ecea'); glasses(x, 314, 170, 22, '#e9ecea', 7); txt(x, 'CENTRO STUDI', 256, 280, 46, '#e9ecea', 700, FONT, 'center'); txt(x, 'LAMBDA', 256, 350, 78, '#e9ecea', 700, FONT, 'center'); });
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), basic(logoT, { transparent: true })); logo.position.set(3.1, 1.95, 0.845); g.add(logo);
  // pendenti lineari sopra il bancone
  [2.5, 2.9, 3.3, 3.7].forEach((x) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.6), new THREE.MeshBasicMaterial({ color: '#ffffff' })); p.position.set(x, 2.55, 1.6); g.add(p); });
  // libreria in metallo nero
  function shelf(x, z, ry, w = 1.6) {
    const grp = new THREE.Group(); grp.position.set(x, 0, z); grp.rotation.y = ry; g.add(grp);
    const metal = std(C.black, { roughness: 0.4, metalness: 0.4 });
    [-w / 2, w / 2].forEach((px) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, 2.0, 0.34), metal); p.position.set(px, 1.0, 0); grp.add(p); });
    for (let i = 0; i < 5; i++) {
      const sh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, 0.34), metal); sh.position.set(0, 0.1 + i * 0.46, 0); grp.add(sh);
      if (i < 4) { let bx = -w / 2 + 0.08; while (bx < w / 2 - 0.2) { const bw = 0.03 + Math.random() * 0.04, bh = 0.22 + Math.random() * 0.12; if (Math.random() < 0.82) { const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.22), std(['#e5a531', '#2d6db0', '#e8e4da', '#39a36b', '#c94b3a', '#f0c44c', '#5a5f9b'][Math.floor(Math.random() * 7)])); b.position.set(bx, 0.12 + i * 0.46 + bh / 2, 0); grp.add(b); } bx += bw + 0.008; if (Math.random() < 0.08) bx += 0.25; } }
    }
    return grp;
  }
  shelf(5.75, 2.3, -Math.PI / 2, 1.8);
  plant(1.6, 3.6, 1.1);
  box(0.55, 2.2, 0.5, C.white, 1.55, 1.1, 1.1);                                        // armadio bianco
  // il Manifesto (tela verde con titolo oro)
  const manT = tex(320, 440, (x, w, h) => { x.fillStyle = C.green; x.fillRect(0, 0, w, h); txt(x, 'Manifesto', w / 2, 60, 40, C.gold, 400, 'Georgia, serif', 'center'); txt(x, 'I PRINCIPI DI CENTRO STUDI LAMBDA', w / 2, 88, 12, '#e8e8e8', 600, FONT, 'center'); for (let i = 0; i < 7; i++) { x.fillStyle = 'rgba(255,255,255,.75)'; x.fillRect(34, 118 + i * 44, 160 + Math.random() * 80, 7); x.fillStyle = 'rgba(255,255,255,.4)'; x.fillRect(34, 132 + i * 44, 230, 5); x.fillRect(34, 142 + i * 44, 190, 5); } });
  box(0.5, 0.68, 0.04, C.green, 5.97, 1.6, 0.35).rotation.y = -Math.PI / 2;
  plane(0.48, 0.66, basic(manT), 5.94, 1.6, 0.35, -Math.PI / 2);
  // zerbino
  box(1.0, 0.012, 0.6, '#222', 4.8, 0.008, 3.75, 0.004);

  /* ---------- AULA STUDIO: postazioni con separatori, pannelli blu ---------- */
  const tabletT = tex(512, 320, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#123747'); gr.addColorStop(1, '#0a1c26'); x.fillStyle = gr; x.fillRect(0, 0, w, h); txt(x, 'LEZIONE LIVE', 24, 40, 20, '#3fc8d1', 500, MONO); x.fillStyle = '#1d5a6d'; x.fillRect(24, 58, 464, 200); x.fillStyle = 'rgba(229,239,242,.9)'; x.beginPath(); x.arc(256, 130, 32, 0, 7); x.fill(); x.beginPath(); x.ellipse(256, 236, 66, 52, 0, Math.PI, 0); x.fill(); x.fillStyle = '#00B67A'; x.beginPath(); x.arc(36, 292, 7, 0, 7); x.fill(); txt(x, cma ? 'Collegato alla Rete CMA' : 'Collegato alla Rete Lambda', 52, 300, 20, '#fff', 500); });
  const tabM = basic(tabletT);
  const beams = [], chairs = [];
  const mesh = std('#1c1d1f', { roughness: 0.55 });
  [1.0, 1.95, 2.9, 3.85].forEach((z, i) => {
    box(0.62, 0.035, 0.85, C.white, -5.62, 0.74, z, 0.01);                             // piano
    [[-5.85, z - 0.38], [-5.85, z + 0.38], [-5.36, z - 0.38], [-5.36, z + 0.38]].forEach(([x, zz]) => box(0.035, 0.72, 0.035, C.white, x, 0.37, zz));
    if (i < 3) box(0.6, 0.62, 0.03, '#ece9e3', -5.62, 1.05, z + 0.475, 0.01);           // separatore
    const tab = box(0.03, 0.22, 0.32, '#151515', -5.82, 0.92, z, 0.01); tab.rotation.z = -0.25;
    plane(0.29, 0.19, tabM, -5.8, 0.925, z, Math.PI / 2, 0).rotation.set(0, Math.PI / 2, 0.25);
    const lamp = box(0.03, 0.32, 0.03, '#ddd', -5.85, 0.92, z + 0.3); lamp.rotation.z = 0.3;
    // sedia ergonomica nera
    const ch = new THREE.Group(); ch.position.set(-4.95, 0, z); ch.rotation.y = -Math.PI / 2 + (i - 1.5) * 0.08; g.add(ch); chairs.push(ch);
    const seat = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.08, 0.48, 2, 0.03), mesh); seat.position.y = 0.48; ch.add(seat);
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.7, 0.06, 2, 0.03), mesh); back.position.set(0, 0.92, 0.25); back.rotation.x = -0.12; ch.add(back);
    const head = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.14, 0.06, 2, 0.03), mesh); head.position.set(0, 1.36, 0.3); ch.add(head);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), std('#333')); post.position.y = 0.26; ch.add(post);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 5), mesh); base.position.y = 0.05; ch.add(base);
    // pannello fonoassorbente blu sopra la postazione
    box(0.04, 0.85, 0.62, std(C.blue, { roughness: 1 }), -5.97, 1.95, z);
    // fascio di luce verso la rete (si accende nell'ultima tappa)
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 10, 1, true), new THREE.MeshBasicMaterial({ color: '#3fc8d1', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.position.set(-5.8, 2.0, z); g.add(beam); beams.push(beam);
  });
  box(0.9, 0.28, 0.22, '#f4f4f4', -3.5, 2.7, 0.62, 0.04);                                // condizionatore
  // uno studente al lavoro
  const stu = new THREE.Group(); stu.position.set(-5.0, 0, 1.95); stu.rotation.y = -Math.PI / 2; g.add(stu);
  const sb = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.36, 6, 16), std(cma ? '#4B5A2B' : '#ffd66b')); sb.position.y = 0.82; stu.add(sb);
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), std('#eec7a2')); sh.position.y = 1.2; stu.add(sh);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 16, 0, 6.3, 0, 1.5), std('#3b2a20')); hair.position.y = 1.22; if (cma) hair.scale.y = 0.62; stu.add(hair);
  const phones = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.014, 8, 24, Math.PI), std('#111')); phones.position.y = 1.22; stu.add(phones);

  /* ---------- UFFICIO PER I COLLOQUI: tavolo nero, pannelli arancioni ---------- */
  box(2.6, 0.05, 1.05, C.black, -3.5, 0.75, -2.0, 0.02);
  [[-4.6, -2.3], [-4.6, -1.7], [-2.4, -2.3], [-2.4, -1.7]].forEach(([x, z]) => box(0.05, 0.73, 0.05, C.black, x, 0.37, z));
  [-4.3, -3.5, -2.7].forEach((x) => [-2.75, -1.25].forEach((z) => { const s = box(0.44, 0.05, 0.44, C.black, x, 0.46, z); const b = box(0.44, 0.48, 0.04, C.black, x, 0.72, z + (z < -2 ? -0.2 : 0.2)); b.rotation.x = z < -2 ? 0.1 : -0.1; [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([dx, dz]) => box(0.025, 0.44, 0.025, '#111', x + dx, 0.22, z + dz)); }));
  [-3.2, -2.25, -1.3].forEach((z) => box(0.06, 0.95, 0.75, std(C.orange, { roughness: 1 }), -5.95, 1.7, z));
  box(0.9, 0.7, 0.05, '#111', -3.5, 1.35, -4.15, 0.01);                                  // TV
  const tvT = tex(512, 288, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#0f2c38'); gr.addColorStop(1, '#16475a'); x.fillStyle = gr; x.fillRect(0, 0, w, h); glasses(x, w / 2, h / 2 - 20, 30, '#ffd66b', 8); txt(x, 'Il tuo piano di studio', w / 2, h / 2 + 50, 28, '#fff', 700, FONT, 'center'); });
  plane(0.86, 0.48, basic(tvT), -3.5, 1.4, -4.12);
  box(1.4, 0.04, 0.25, '#1a1a1a', -3.5, 1.95, -4.07);                                    // mensola
  [-3.9, -3.6].forEach((x, i) => box(0.12, 0.2, 0.12, i ? '#f0c44c' : '#2d6db0', x, 2.07, -4.07));
  box(0.03, 1.5, 0.03, '#222', -5.5, 0.75, -3.8); box(0.18, 0.12, 0.18, '#222', -5.5, 1.5, -3.75);  // lampada da terra
  plant(-1.5, -3.8, 0.9);

  /* ---------- SALA RELAX: divano, TV, acqua, pannelli verde petrolio ---------- */
  box(1.9, 0.45, 0.85, '#3f4448', 3.6, 0.24, -1.2, 0.08); box(1.9, 0.5, 0.2, '#3f4448', 3.6, 0.62, -0.82, 0.08);
  [2.7, 4.5].forEach((x) => box(0.2, 0.62, 0.85, '#3f4448', x, 0.33, -1.2, 0.08));
  box(0.9, 0.04, 0.55, C.black, 3.6, 0.42, -2.3, 0.01); box(0.8, 0.38, 0.45, '#222', 3.6, 0.2, -2.3, 0.01);
  box(1.3, 0.45, 0.4, C.black, 3.6, 0.23, -3.95, 0.01);                                   // mobile TV
  box(1.1, 0.64, 0.05, '#111', 3.6, 0.85, -4.0, 0.01); plane(1.05, 0.58, basic(tvT), 3.6, 0.86, -3.97);
  box(1.6, 0.03, 0.22, '#1a1a1a', 3.6, 1.75, -4.08);
  [3.1, 3.5, 4.0].forEach((x, i) => box(0.1, 0.14 + i * 0.04, 0.1, ['#e5a531', '#39a36b', '#e8e4da'][i], x, 1.84, -4.08));
  // distributore d'acqua
  box(0.32, 1.0, 0.32, '#f2f2f2', 5.6, 0.5, -3.2, 0.03);
  const jug = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 20), new THREE.MeshStandardMaterial({ color: '#8fc6e8', transparent: true, opacity: 0.55, roughness: 0.1 })); jug.position.set(5.6, 1.22, -3.2); g.add(jug);
  [-3.4, -2.3, -1.2, -0.1].forEach((z) => box(0.06, 0.95, 0.75, std(C.teal, { roughness: 1 }), 5.95, 1.75, z));
  // poltroncine arancioni e tavolino
  [[1.75, -0.2, 0.6], [2.35, 0.25, 1.1]].forEach(([x, z, r]) => { const a = new THREE.Group(); a.position.set(x, 0, z); a.rotation.y = r; g.add(a);
    const m = std('#e8892f', { roughness: 0.9 }); const s = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.22, 0.6, 2, 0.08), m); s.position.y = 0.42; a.add(s); const b = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.4, 0.16, 2, 0.07), m); b.position.set(0, 0.7, -0.24); a.add(b);
    [[-0.25, -0.22], [0.25, -0.22], [-0.25, 0.22], [0.25, 0.22]].forEach(([dx, dz]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32), std('#222')); l.position.set(dx, 0.16, dz); a.add(l); }); });
  const st = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 24), std(C.black)); st.position.set(2.3, 0.5, -0.45); g.add(st);
  shelf(1.35, -2.2, Math.PI / 2, 1.9);
  plant(5.5, -0.4, 0.9);

  /* ---------- animazioni ---------- */
  const connect = (k, t = 0) => {
    beams.forEach((b, i) => { b.material.opacity = k * (0.45 + 0.25 * Math.sin(t * 3 + i)); b.scale.y = 0.2 + 0.8 * k; b.position.y = 0.95 + 1.05 * (0.2 + 0.8 * k); });
    lights.forEach((l) => (l.intensity = 7 * (1 - 0.5 * k)));
  };
  const idle = (t) => { sh.rotation.x = 0.25 + Math.sin(t * 1.1) * 0.05; chairs.forEach((c, i) => { if (i !== 1) c.rotation.y = -Math.PI / 2 + Math.sin(t * 0.3 + i) * 0.04; }); };

  /* ---------- le tappe del tour (camera, punto osservato, punto luminoso) ---------- */
  const BR = cma ? 'CMA' : 'Lambda';
  const stops = [
    { k: 'L\'ingresso', t: `${BR} Messina, sulla strada.`, p: 'In via Ettore Lombardo Pellegrino 23: due vetrine, Centro Studi Lambda e Concorsi Militari Academy. La prima volta ti accogliamo noi, alla porta.', cam: [0.9, 2.3, 12.4], tgt: [0.6, 0.85, 4.2], hot: [4.75, 1.5, 4.5] },
    { k: 'Reception', t: 'L\'accoglienza.', p: 'Al bancone trovi lo staff della sede: informazioni, orari, il primo colloquio. E la libreria con i manuali di metodo.', cam: [5.3, 1.75, 3.9], tgt: [2.6, 1.15, 1.2], hot: [3.1, 2.75, 0.86] },
    { k: 'Aula studio', t: 'La tua postazione.', p: cma ? 'Postazioni silenziose con tablet e cuffie: segui le lezioni live, ti alleni sul simulatore, e un docente è collegato se hai bisogno.' : 'Postazioni silenziose con tablet e cuffie: segui le lezioni live con i docenti, e in aula studio un docente è sempre collegato.', cam: [-2.1, 1.6, 3.6], tgt: [-5.6, 1.05, 2.4], hot: [-5.2, 2.55, 2.4] },
    { k: 'Colloqui', t: 'Gli incontri individuali.', p: 'Qui incontri la tua tutor personale, psicologa esperta in apprendimento: per conoscervi, fare il punto sul percorso e decidere i prossimi passi.', cam: [-1.5, 1.65, -0.35], tgt: [-4.2, 1.0, -2.5], hot: [-3.5, 2.4, -2.0] },
    { k: 'Sala relax', t: 'Una pausa, tra una lezione e l\'altra.', p: 'Un divano, un po\' di musica, l\'acqua fresca. Perché si studia meglio quando ci si sente a casa.', cam: [1.15, 1.75, 0.2], tgt: [4.1, 0.75, -2.9], hot: [3.7, 2.2, -3.9] },
    { k: 'Collegati alla rete', t: `Dalla sede, tutta ${BR}.`, p: cma ? 'Dalla postazione accedi alla Rete CMA: gli stessi docenti, tutor e simulatore di chi si prepara da casa.' : 'Dalla postazione accedi alla Rete Lambda: gli stessi docenti e le stesse aule studio di chi si collega da casa.', cam: [-1.3, 1.75, 4.0], tgt: [-5.2, 1.9, 2.2], hot: [-5.8, 2.95, 1.0], connect: true },
  ];
  return { group: g, connect, idle, stops, bg: '#dde7ec' };
}
