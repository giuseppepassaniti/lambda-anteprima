/* =====================================================================
   LAMBDA · l'interno 3D di una sede (condiviso)
   Usato dal viaggio della pagina Sedi e dal tour della singola sede.
   Coordinate locali: ingresso verso +z, accoglienza a sinistra (x<0),
   postazioni a destra, parete con l'insegna sul lato sinistro.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const FONT = '"Space Grotesk", system-ui, sans-serif', MONO = '"JetBrains Mono", ui-monospace, monospace';

// tema: colori e insegna (Lambda di default; la pagina può passarne un altro, es. Concorsi Militari Academy)
const LAMBDA_T = { navy: '#0E212E', teal: '#1f7a93', warm: '#ffd66b', acc: '#3fc8d1', scr1: '#123747', scr2: '#0a1c26', scrBox: '#1d5a6d', net: 'Rete Lambda', sign: null };
export function buildSedeInterior({ city = '', theme = (window.SEDI_THEME || {}).interior } = {}) {
  const T = { ...LAMBDA_T, ...(theme || {}) };
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o });
  const box = (w, h, d, mat, r = 0.01) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)), mat);
  const ctex = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return { c, x: c.getContext('2d'), t, w, h }; };
  const txt = (S, t, x, y, size, color, w = 700, font = FONT) => { S.x.font = `${w} ${size}px ${font}`; S.x.fillStyle = color; S.x.textAlign = 'left'; S.x.fillText(t, x, y); };
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.22, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const litMat = new THREE.MeshBasicMaterial({ color: T.warm });
  const navyM = std(T.navy, { roughness: 0.5 }), whiteM = std('#f4f7f8', { roughness: 0.45 }), tealM = std(T.teal, { roughness: 0.6 }), skinM = std('#eec7a2', { roughness: 0.7 }), darkM = std('#1b2329');

  const g = new THREE.Group();
  // stanza
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#cfdade', { roughness: 0.55 })); floor.rotation.x = -Math.PI / 2; g.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#eef3f5')); ceil.rotation.x = Math.PI / 2; ceil.position.y = 3.0; g.add(ceil);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(14, 3), std('#eaf0f2')); back.position.set(0, 1.5, -2.6); g.add(back);
  const right = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), std('#e3ebee')); right.rotation.y = -Math.PI / 2; right.position.set(3.6, 1.5, 1.3); g.add(right);
  const acc = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), std(T.navy, { roughness: 0.8 })); acc.rotation.y = Math.PI / 2; acc.position.set(-3.1, 1.5, 1.3); g.add(acc);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(7, 3), std('#e6edf0')); front.rotation.y = Math.PI; front.position.set(0.25, 1.5, 5.6); g.add(front);
  // ingresso vetrato sulla parete frontale
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.3), new THREE.MeshBasicMaterial({ color: '#bfe4ea' })); glass.rotation.y = Math.PI; glass.position.set(0.3, 1.15, 5.58); g.add(glass);
  [[-0.42, 1.15, 0.05, 2.3], [1.02, 1.15, 0.05, 2.3], [0.3, 2.32, 1.5, 0.06], [0.3, 1.15, 0.03, 2.3]].forEach(([x, y, w, h]) => { const f = box(w, h, 0.05, navyM, 0.01); f.position.set(x, y, 5.56); g.add(f); });
  // insegna sulla parete scura
  const sign = ctex(1024, 384);
  const drawSign = (cityName) => { const S = sign; if (T.sign) { T.sign(S, cityName, txt, MONO); S.t.needsUpdate = true; return; } S.x.fillStyle = '#0E212E'; S.x.fillRect(0, 0, 1024, 384); S.x.strokeStyle = '#ffd66b'; S.x.lineWidth = 12;
    [[150, 150], [270, 150]].forEach(([x, y]) => { S.x.beginPath(); S.x.arc(x, y, 52, 0, 7); S.x.stroke(); }); S.x.beginPath(); S.x.moveTo(202, 145); S.x.quadraticCurveTo(210, 128, 218, 145); S.x.stroke();
    if (cityName) { txt(S, 'LAMBDA', 360, 140, 56, '#fff'); txt(S, cityName.toUpperCase(), 360, 216, cityName.length > 8 ? 76 : 92, '#ffd66b'); }
    else { txt(S, 'CENTRO STUDI', 360, 140, 56, '#fff'); txt(S, 'LAMBDA', 360, 216, 92, '#fff'); }
    txt(S, 'SEDE COLLEGATA ALLA RETE LAMBDA', 110, 320, 30, '#3fc8d1', 500, MONO); S.t.needsUpdate = true; };
  drawSign(city); document.fonts?.ready.then(() => drawSign(city));
  const signM = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.9), new THREE.MeshBasicMaterial({ map: sign.t, toneMapped: false })); signM.rotation.y = Math.PI / 2; signM.position.set(-3.08, 2.0, 0.9); g.add(signM);
  // luci a soffitto
  const lights = [];
  [[-1.4, 0.6], [1.2, -0.9], [1.2, 1.4], [0.2, 3.8]].forEach(([x, z]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.26), new THREE.MeshBasicMaterial({ color: '#ffffff' })); p.rotation.x = Math.PI / 2; p.position.set(x, 2.99, z); g.add(p); const l = new THREE.PointLight('#f4fbff', 9, 10, 1.4); l.position.set(x, 2.6, z); g.add(l); lights.push(l); });
  // accoglienza + tutor
  const desk = box(0.62, 0.98, 1.5, navyM, 0.04); desk.position.set(-1.9, 0.49, 0.9); g.add(desk);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.05), litMat); strip.rotation.y = Math.PI / 2; strip.position.set(-1.585, 0.86, 0.9); g.add(strip);
  const tutor = new THREE.Group(); tutor.position.set(-2.4, 0, 0.85); g.add(tutor);
  const tb = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.62, 6, 16), tealM); tb.position.y = 0.95; tutor.add(tb);
  const tutorHead = new THREE.Mesh(new THREE.SphereGeometry(0.125, 24, 16), skinM); tutorHead.position.y = 1.5; tutor.add(tutorHead);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16, 0, 6.3, 0, 1.4), navyM); hair.position.y = 1.52; tutor.add(hair);
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), litMat); badge.position.set(0.17, 1.12, 0.05); badge.rotation.y = Math.PI / 2; tutor.add(badge);
  tutor.rotation.y = Math.PI / 2;
  // pianta vicino all'ingresso
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.42, 20), navyM); pot.position.set(-2.5, 0.21, 4.6); g.add(pot);
  [[0, 0.75, 0, 0.32], [0.14, 0.95, 0.05, 0.22], [-0.12, 0.92, -0.06, 0.24]].forEach(([x, y, z, r]) => { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), std('#2f7d5b', { roughness: 0.8, flatShading: true })); f.position.set(-2.5 + x, y, 4.6 + z); g.add(f); });
  // postazioni
  const tablet = ctex(512, 340); { const S = tablet; const gr = S.x.createLinearGradient(0, 0, 512, 340); gr.addColorStop(0, T.scr1); gr.addColorStop(1, T.scr2); S.x.fillStyle = gr; S.x.fillRect(0, 0, 512, 340);
    txt(S, 'LEZIONE LIVE', 28, 44, 20, T.acc, 500, MONO); S.x.beginPath(); S.x.roundRect(28, 64, 456, 200, 16); S.x.fillStyle = T.scrBox; S.x.fill();
    S.x.fillStyle = 'rgba(229,239,242,.9)'; S.x.beginPath(); S.x.arc(256, 138, 34, 0, 7); S.x.fill(); S.x.beginPath(); S.x.ellipse(256, 245, 68, 55, 0, Math.PI, 0); S.x.fill();
    S.x.fillStyle = '#00B67A'; S.x.beginPath(); S.x.arc(40, 300, 8, 0, 7); S.x.fill(); txt(S, 'Collegato alla ' + T.net, 58, 308, 22, '#fff', 500); S.t.needsUpdate = true; }
  const tabMat = new THREE.MeshBasicMaterial({ map: tablet.t, toneMapped: false });
  const beams = [];
  [0.3, 1.4, 2.5].forEach((x) => [-1.7, -0.35].forEach((z) => {
    const s = new THREE.Group(); s.position.set(x, 0, z); g.add(s);
    const top = box(0.95, 0.05, 0.6, whiteM, 0.015); top.position.y = 0.74; s.add(top);
    [[-0.42, -0.25], [0.42, -0.25], [-0.42, 0.25], [0.42, 0.25]].forEach(([a, b]) => { const l = box(0.04, 0.72, 0.04, navyM, 0.01); l.position.set(a, 0.36, b); s.add(l); });
    const div = box(0.95, 0.4, 0.03, navyM, 0.01); div.position.set(0, 0.97, -0.29); s.add(div);
    const tab = new THREE.Group(); tab.position.set(0, 0.86, -0.12); tab.rotation.x = -0.32; s.add(tab);
    tab.add(box(0.3, 0.2, 0.014, darkM, 0.012)); const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.18), tabMat); sc.position.z = 0.008; tab.add(sc);
    const stand = box(0.06, 0.1, 0.06, darkM, 0.01); stand.position.set(0, 0.79, -0.16); s.add(stand);
    const hp = new THREE.Group(); hp.position.set(0.3, 0.77, 0.08); hp.rotation.set(-Math.PI / 2, 0, 0.4); s.add(hp);
    hp.add(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 24, Math.PI), navyM));
    [-0.075, 0.075].forEach((a) => { const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), tealM); cup.rotation.x = Math.PI / 2; cup.position.set(a, 0, 0); hp.add(cup); });
    const seat = box(0.42, 0.06, 0.4, tealM, 0.03); seat.position.set(0, 0.46, 0.45); s.add(seat);
    const bk = box(0.42, 0.42, 0.05, tealM, 0.03); bk.position.set(0, 0.72, 0.66); s.add(bk);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.1, 10, 1, true), new THREE.MeshBasicMaterial({ color: T.acc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    beam.position.set(0, 2.0, -0.12); s.add(beam); beams.push(beam);
  }));
  // uno studente al lavoro
  const stu = new THREE.Group(); stu.position.set(0.3, 0, 0.05); g.add(stu);
  const sb = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.36, 6, 16), std(T.warm)); sb.position.y = 0.8; stu.add(sb);
  const studentHead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), skinM); studentHead.position.y = 1.18; stu.add(studentHead);
  const sHair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 16, 0, 6.3, 0, 1.5), std('#3b2a20')); sHair.position.y = 1.2; stu.add(sHair);
  const stuPh = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.014, 8, 24, Math.PI), navyM); stuPh.position.y = 1.2; stu.add(stuPh);
  if (T.student) { sb.material.color.set(T.student); sHair.scale.y = 0.62; sHair.position.y = 1.215; }
  if (T.decor) T.decor({ THREE, g, box, std, ctex, txt, FONT, MONO });
  const ceilGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: T.acc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); ceilGlow.scale.setScalar(3.2); ceilGlow.position.set(1.4, 2.95, -1.0); g.add(ceilGlow);

  /** fasci di luce verso la rete: k da 0 (spenti) a 1 (accesi), con le luci della stanza che si abbassano */
  const connect = (k, t = 0) => {
    beams.forEach((b, i) => { b.material.opacity = k * (0.45 + 0.25 * Math.sin(t * 3 + i)); b.scale.y = 0.2 + 0.8 * k; b.position.y = 0.95 + 1.05 * (0.2 + 0.8 * k); });
    ceilGlow.material.opacity = k * 0.8;
    lights.forEach((l) => (l.intensity = 9 * (1 - 0.8 * k)));
  };
  /** piccoli movimenti di vita: il tutor si guarda intorno, lo studente annuisce */
  const idle = (t) => { tutorHead.rotation.y = Math.sin(t * 0.8) * 0.15; tutorHead.position.y = 1.5 + Math.sin(t * 1.6) * 0.004; studentHead.rotation.x = 0.25 + Math.sin(t * 1.1) * 0.05; };

  /** cambia il nome della città sull'insegna */
  const setCity = (c) => { city = c; drawSign(c); };

  return { group: g, connect, idle, setCity };
}
