/* =====================================================================
   I due marchi in 3D, costruiti in codice (nessun modello da scaricare)
   - buildLambdaMark(): tre libri impilati e gli occhiali cromati (logo Centro Studi Lambda)
   - buildCmaStar(M):   la stella di Concorsi Militari Academy dalle coordinate di assets/cma-mark.js
   Entrambi restituiscono { group, meshes, materials } già in posa finale, centrati sull'origine.
   ===================================================================== */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function buildLambdaMark() {
  const group = new THREE.Group(), inner = new THREE.Group(); group.add(inner);
  const materials = [], meshes = [];
  const pageTex = (() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 256;
    const g = c.getContext('2d'); g.fillStyle = '#f4efe4'; g.fillRect(0, 0, 64, 256);
    for (let y = 0; y < 256; y += 6) { g.fillStyle = y % 12 ? 'rgba(120,100,80,.18)' : 'rgba(120,100,80,.3)'; g.fillRect(0, y, 64, 1.5); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const pagesMat = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.85, color: '#ffffff' }); materials.push(pagesMat);
  const add = (parent, mesh) => { parent.add(mesh); meshes.push(mesh); return mesh; };
  const book = (w, h, d, color, x, y, ry) => {
    const g = new THREE.Group(); g.position.set(x, y, 0); g.rotation.y = ry; inner.add(g);
    const cover = new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.25 }); materials.push(cover);
    const plate = new RoundedBoxGeometry(w, 0.07, d, 3, 0.03);
    add(g, new THREE.Mesh(plate, cover)).position.y = h / 2 - 0.035;
    add(g, new THREE.Mesh(plate, cover)).position.y = -h / 2 + 0.035;
    add(g, new THREE.Mesh(new RoundedBoxGeometry(0.1, h, d, 3, 0.045), cover)).position.x = -w / 2 + 0.05;
    add(g, new THREE.Mesh(new THREE.BoxGeometry(w - 0.14, h - 0.12, d - 0.1), pagesMat)).position.x = 0.02;
  };
  book(3.1, 0.44, 1.9, '#184e61', 0, 0.22, 0);
  book(2.6, 0.38, 1.7, '#00949e', -0.12, 0.63, 0.07);
  book(2.15, 0.34, 1.5, '#ffd66b', 0.1, 0.99, -0.06);
  const chrome = new THREE.MeshStandardMaterial({ color: '#f2f4f5', metalness: 1, roughness: 0.16 }); materials.push(chrome);
  const glass = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.18, envMapIntensity: 2.5, clearcoat: 1 });
  const glasses = new THREE.Group(); glasses.position.set(0, 1.85, 0); inner.add(glasses);
  const R = 0.46, T = 0.06, OFF = 0.62;
  [-OFF, OFF].forEach((x) => {
    add(glasses, new THREE.Mesh(new THREE.TorusGeometry(R, T, 24, 72), chrome)).position.x = x;
    const l = new THREE.Mesh(new THREE.CircleGeometry(R - 0.02, 48), glass); l.position.x = x; l.userData.glass = true; glasses.add(l);
    const s = Math.sign(x);
    add(glasses, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(x + s * R, 0.12, 0), new THREE.Vector3(x + s * (R + 0.08), 0.12, -0.5), new THREE.Vector3(x + s * (R + 0.08), 0.08, -1.2), new THREE.Vector3(x + s * (R + 0.02), -0.12, -1.45),
    ]), 40, 0.035, 10), chrome));
  });
  add(glasses, new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-OFF + R - 0.02, 0.06, 0), new THREE.Vector3(0, 0.26, 0), new THREE.Vector3(OFF - R + 0.02, 0.06, 0)), 24, 0.045, 10), chrome));
  inner.position.y = -1.18; // centrato: dalla base dei libri alla montatura
  return { group, meshes, materials, glass, glasses };
}

export function buildCmaStar(M) {
  const group = new THREE.Group(), materials = [], meshes = [];
  const S = 100, X = (px) => (px - 410) / S, Y = (py) => -(py - 425.6) / S; // centro della stella
  const ex = (pts, depth) => {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(X(x), Y(y)))), { depth, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments: 4, curveSegments: 1 });
    g.translate(0, 0, -depth / 2); return g;
  };
  const enamel = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.1 });
  [[M.red, 0.5, enamel(M.colors.red)], [M.green, 0.5, enamel(M.colors.green)], [M.grey, 0.62, new THREE.MeshPhysicalMaterial({ color: '#e4e6e6', metalness: 0.95, roughness: 0.26, envMapIntensity: 1.4 })]]
    .forEach(([pts, d, mat]) => { const m = new THREE.Mesh(ex(pts, d), mat); group.add(m); meshes.push(m); materials.push(mat); });
  return { group, meshes, materials };
}
