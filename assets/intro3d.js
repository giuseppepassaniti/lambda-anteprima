// LAMBDA · intro 3D della home studenti: i libri si impilano, gli occhiali si posano, il logo vola nell'header.
// Richiede un importmap per 'three' nella pagina e chiama window.__startHero(true) all'uscita.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const intro = document.getElementById('intro');
// solo alla prima visita (localStorage 'lambda-intro'); ?intro nell'indirizzo la fa rivedere
let seen = null; try { seen = localStorage.getItem('lambda-intro'); } catch (e) {}
if (/[?&]intro\b/.test(location.search)) seen = null;
const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
if (!intro) { /* nessuna intro in questa pagina */ }
else if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches || !webglOK()) { intro.remove(); window.__startHero?.(false); }
else run();

function run() {
window.__introRunning = true;
try { localStorage.setItem('lambda-intro', '1'); } catch (e) {}

const canvas = document.getElementById('intro3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setSize(innerWidth, innerHeight, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 100);
const fitCamera = () => {
  camera.aspect = innerWidth / innerHeight;
  const portrait = innerWidth < innerHeight;
  camera.position.set(0, 1.4, portrait ? 13 : 9.5);
  camera.lookAt(0, 1.05, 0);
  camera.updateProjectionMatrix();
};
fitCamera();

const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 6, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0x3cc4cc, 3); rim.position.set(-4, 3, -4); scene.add(rim);
const warmFill = new THREE.PointLight(0xffd66b, 12, 12); warmFill.position.set(2.5, 2.5, 3); scene.add(warmFill);

// texture dei bordi delle pagine (righe sottili)
const pageTex = (() => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const g = c.getContext('2d'); g.fillStyle = '#f4efe4'; g.fillRect(0, 0, 64, 256);
  for (let y = 0; y < 256; y += 6) { g.fillStyle = y % 12 ? 'rgba(120,100,80,.18)' : 'rgba(120,100,80,.3)'; g.fillRect(0, y, 64, 1.5); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const pagesMat = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.85 });

function book(w, h, d, color) {
  const g = new THREE.Group();
  const cover = new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.25 });
  const plate = new RoundedBoxGeometry(w, 0.07, d, 3, 0.03);
  const top = new THREE.Mesh(plate, cover); top.position.y = h / 2 - 0.035;
  const bot = new THREE.Mesh(plate, cover); bot.position.y = -h / 2 + 0.035;
  const spine = new THREE.Mesh(new RoundedBoxGeometry(0.1, h, d, 3, 0.045), cover); spine.position.x = -w / 2 + 0.05;
  const pages = new THREE.Mesh(new THREE.BoxGeometry(w - 0.14, h - 0.12, d - 0.1), pagesMat); pages.position.x = 0.02;
  g.add(top, bot, spine, pages);
  return g;
}
const logo = new THREE.Group(); scene.add(logo);
const books = [
  { m: book(3.1, 0.44, 1.9, 0x184e61), y: 0.22, x: 0, ry: 0 },
  { m: book(2.6, 0.38, 1.7, 0x00949e), y: 0.63, x: -0.12, ry: 0.07 },
  { m: book(2.15, 0.34, 1.5, 0xffd66b), y: 0.99, x: 0.1, ry: -0.06 },
];
books.forEach((b) => { b.m.position.set(b.x, -6, 0); b.m.rotation.y = b.ry; logo.add(b.m); });

// occhiali cromati
const chrome = new THREE.MeshStandardMaterial({ color: 0xf2f4f5, metalness: 1, roughness: 0.16 });
const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.18, envMapIntensity: 2.5, clearcoat: 1 });
const glasses = new THREE.Group();
const R = 0.46, T = 0.06, OFF = 0.62;
[-OFF, OFF].forEach((x) => {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, T, 24, 72), chrome); ring.position.x = x; glasses.add(ring);
  const lensM = new THREE.Mesh(new THREE.CircleGeometry(R - 0.02, 48), glass); lensM.position.x = x; glasses.add(lensM);
  const s = Math.sign(x);
  const arm = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(x + s * R, 0.12, 0), new THREE.Vector3(x + s * (R + 0.08), 0.12, -0.5), new THREE.Vector3(x + s * (R + 0.08), 0.08, -1.2), new THREE.Vector3(x + s * (R + 0.02), -0.12, -1.45)
  ]), 40, 0.035, 10), chrome);
  glasses.add(arm);
});
const bridge = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(-OFF + R - 0.02, 0.06, 0), new THREE.Vector3(0, 0.26, 0), new THREE.Vector3(OFF - R + 0.02, 0.06, 0)), 24, 0.045, 10), chrome);
glasses.add(bridge);
glasses.position.set(0, 7, 0);
logo.add(glasses);

// ombra morbida a terra
const shadowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }));
shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.01; logo.add(shadow);

logo.rotation.y = -0.6;

/* ---------------- coreografia ---------------- */
let spin = { v: 0 }, float = { a: 0 }, running = true;
const word = document.getElementById('introWord');
const tl = gsap.timeline({ onComplete: exit });
books.forEach((b, i) => {
  tl.to(b.m.position, { y: b.y, duration: 1.0, ease: 'back.out(1.5)' }, 0.15 + i * 0.28)
    .from(b.m.rotation, { z: (i % 2 ? 1 : -1) * 0.5, x: 0.4, duration: 1.0, ease: 'back.out(1.5)' }, '<');
});
tl.to(shadow.material, { opacity: 1, duration: 1 }, 0.3)
  .to(glasses.position, { y: 1.85, duration: 1.3, ease: 'expo.out' }, 1.0)
  .from(glasses.rotation, { y: -Math.PI * 2.5, duration: 1.3, ease: 'expo.out' }, '<')
  .to(float, { a: 1, duration: 0.8 }, 2.0)
  .to(logo.rotation, { y: 0.22, duration: 3.2, ease: 'power2.inOut' }, 0)
  .to(word, { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power3.inOut' }, 1.7)
  .to({}, { duration: 0.7 });

function screenBox() {
  const box = new THREE.Box3().setFromObject(logo), pts = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).project(camera));
  const xs = pts.map((p) => (p.x * 0.5 + 0.5) * innerWidth), ys = pts.map((p) => (-p.y * 0.5 + 0.5) * innerHeight);
  return { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) };
}
let exiting = false;
function exit() {
  if (exiting) return; exiting = true;
  tl.progress(1);
  const s = screenBox(), target = document.getElementById('logoIcon').getBoundingClientRect();
  const sc = target.height / (s.b - s.t);
  const tx = target.left + target.width / 2 - ((s.l + s.r) / 2) * sc, ty = target.top + target.height / 2 - ((s.t + s.b) / 2) * sc;
  // il canvas vola nell'header, lo sfondo si dissolve e rivela l'hero
  window.__startHero(true);
  gsap.set(document.getElementById('logo'), { autoAlpha: 0 });
  const out = gsap.timeline({ onComplete: () => { running = false; window.__introRunning = false; renderer.dispose(); intro.remove(); } });
  out.to(canvas, { x: tx, y: ty, scale: sc, duration: 1.1, ease: 'expo.inOut' }, 0)
     .to(logo.rotation, { y: 0, duration: 1.1, ease: 'expo.inOut' }, 0)
     .to(word, { autoAlpha: 0, y: 20, duration: 0.4, ease: 'power2.in' }, 0)
     .to('#skip', { autoAlpha: 0, duration: 0.3 }, 0)
     .to(document.getElementById('logo'), { autoAlpha: 1, duration: 0.35 }, 0.85)
     .to(canvas, { autoAlpha: 0, duration: 0.3 }, 0.9)
     .to('#introBg', { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 0.1);
  intro.style.pointerEvents = 'none';
}
document.getElementById('skip').addEventListener('click', exit);

const clock = new THREE.Clock();
function loop() {
  if (!running) return;
  const t = clock.getElapsedTime();
  glasses.position.y += Math.sin(t * 2.2) * 0.0025 * float.a;
  glasses.rotation.z = Math.sin(t * 1.6) * 0.04 * float.a;
  warmFill.position.x = Math.sin(t * 0.8) * 3;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight, false); fitCamera(); });
}
