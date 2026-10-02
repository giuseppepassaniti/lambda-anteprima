/* =====================================================================
   CONCORSI MILITARI ACADEMY · intro 3D del logo
   I tre pezzi della stella (smalto rosso, smalto verde, banda in metallo)
   arrivano da direzioni diverse e si incastrano come in una medaglia;
   l'anello di testo ruota in posizione, una luce passa sulle superfici,
   poi il logo vola nell'header. Solo alla prima visita (?intro la fa rivedere).
   ===================================================================== */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const M = window.CMA_MARK, L = window.Lambda;
const intro = document.getElementById('cintro'), canvas = document.getElementById('cintro3d'), skipBtn = document.getElementById('cskip'), claim = document.getElementById('cclaim');
const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
let seen = null; try { seen = localStorage.getItem('cma-intro'); } catch (e) {}
if (/[?&]intro\b/.test(location.search)) seen = null;

function done() {
  intro?.remove(); document.body.classList.remove('intro-on'); L?.release?.();
  if (window.gsap) gsap.set('#logo', { autoAlpha: 1 });
}
if (!intro) { /* niente intro in questa pagina */ }
else if (!M || L.reduced || seen || !webglOK()) done();
else run();

function run() {
  try { localStorage.setItem('cma-intro', '1'); } catch (e) {}
  gsap.set('#logo', { autoAlpha: 0 });
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const VW = () => document.documentElement.clientWidth, VH = () => document.documentElement.clientHeight;
  renderer.setSize(VW(), VH(), false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 100);
  const fit = () => { const a = VW() / VH(); camera.aspect = a; camera.position.set(0, -0.7, a < 1 ? 18.5 / a : 21); camera.updateProjectionMatrix(); };
  fit();

  // luci: chiave calda, contro verde, e una "lama" di luce che passerà sulle superfici
  const key = new THREE.DirectionalLight('#fff4e0', 2.2); key.position.set(4, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight('#a9b97a', 1.4); rim.position.set(-6, -3, -4); scene.add(rim);
  const sweep = new THREE.PointLight('#ffffff', 0, 10, 1.5); sweep.position.set(-7, 1, 3); scene.add(sweep);

  /* ---------- la stella: tre pezzi estrusi, dalle stesse coordinate del logo ---------- */
  const S = 100, X = (px) => (px - 416) / S, Y = (py) => -(py - 418) / S;
  const shape = (pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(X(x), Y(y))));
  const ex = (pts, depth) => { const g = new THREE.ExtrudeGeometry(shape(pts), { depth, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments: 4, curveSegments: 1 }); g.translate(0, 0, -depth / 2); return g; };
  const enamel = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.1 });
  const logo = new THREE.Group(); scene.add(logo);
  const pieces = [
    { m: new THREE.Mesh(ex(M.red, 0.5), enamel(M.colors.red)), from: [5, 5, 3], rot: [0.8, -1.2, 0.9] },
    { m: new THREE.Mesh(ex(M.green, 0.5), enamel(M.colors.green)), from: [-6, -4, 2], rot: [-0.9, 1.1, -0.7] },
    { m: new THREE.Mesh(ex(M.grey, 0.62), new THREE.MeshPhysicalMaterial({ color: '#e4e6e6', metalness: 0.95, roughness: 0.26, envMapIntensity: 1.4 })), from: [0, -1, 12], rot: [0, 0, 2.4] },
  ];
  pieces.forEach((p) => { p.m.position.set(...p.from); p.m.rotation.set(...p.rot); logo.add(p.m); });

  /* ---------- l'anello di testo, disegnato con le stesse misure del logo ---------- */
  const tc = document.createElement('canvas'); tc.width = tc.height = 2048;
  const tx = tc.getContext('2d'), k = 2048 / 834, R = M.ring;
  const drawRing = () => {
    tx.clearRect(0, 0, 2048, 2048); tx.fillStyle = '#ffffff'; tx.font = `700 ${R.size * k}px ${R.font}`; tx.textAlign = 'center'; tx.textBaseline = 'alphabetic';
    const arc = (text, r, a0, a1, outward) => {
      const n = text.length, span = a1 - a0;
      [...text].forEach((ch, i) => {
        const a = ((a0 + (span * (i + 0.5)) / n) * Math.PI) / 180;
        tx.save(); tx.translate((R.cx + r * Math.cos(a)) * k, (R.cy + r * Math.sin(a)) * k);
        tx.rotate(outward ? a + Math.PI / 2 : a - Math.PI / 2); tx.fillText(ch, 0, 0); tx.restore();
      });
    };
    arc(R.top.text, R.top.r, R.top.from, R.top.to + 360, true);   // in alto, da sinistra a destra passando sopra
    arc(R.bottom.text, R.bottom.r, R.bottom.from, R.bottom.to, false); // in basso, lettere verso il centro
    ringTex.needsUpdate = true;
  };
  const ringTex = new THREE.CanvasTexture(tc); ringTex.colorSpace = THREE.SRGBColorSpace; ringTex.anisotropy = 8;
  const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, color: M.colors.ring, transparent: true, opacity: 0, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(8.34, 8.34), ringMat); ring.position.set(X(417), Y(417), -0.2); logo.add(ring);
  drawRing(); document.fonts?.load(`700 64px ${R.font}`).then(drawRing);

  // bagliore dell'incastro
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,240,220,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); flash.scale.setScalar(2); flash.position.z = 1; logo.add(flash);
  // polvere sospesa, come in un hangar illuminato
  const N = 220, dp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { dp[i * 3] = (Math.random() - 0.5) * 22; dp[i * 3 + 1] = (Math.random() - 0.5) * 14; dp[i * 3 + 2] = -Math.random() * 10; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.04, color: '#cfd8c0', transparent: true, opacity: 0.5, depthWrite: false })); scene.add(dust);

  /* ---------- la regia ---------- */
  logo.rotation.set(0.25, -0.6, 0);
  const tl = gsap.timeline({ delay: 0.25 });
  pieces.forEach((p, i) => {
    tl.to(p.m.position, { x: 0, y: 0, z: 0, duration: 1.15, ease: 'expo.out' }, i * 0.14)
      .to(p.m.rotation, { x: 0, y: 0, z: 0, duration: 1.15, ease: 'expo.out' }, i * 0.14);
  });
  tl.to(logo.rotation, { x: 0, y: 0.18, duration: 1.6, ease: 'power3.out' }, 0)
    .to(flash.material, { opacity: 0.9, duration: 0.12, ease: 'power2.out' }, 0.95)
    .to(flash.scale, { x: 9, y: 9, duration: 0.7, ease: 'expo.out' }, 0.95)
    .to(flash.material, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 1.1)
    .fromTo(logo.scale, { x: 1, y: 1, z: 1 }, { x: 1.035, y: 1.035, z: 1.035, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.95)
    .fromTo(ring.rotation, { z: -Math.PI * 0.9 }, { z: 0, duration: 1.4, ease: 'expo.out' }, 1.15)
    .fromTo(ring.scale, { x: 1.25, y: 1.25 }, { x: 1, y: 1, duration: 1.4, ease: 'expo.out' }, 1.15)
    .to(ringMat, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.15)
    .to(sweep, { intensity: 60, duration: 0.3 }, 1.6)
    .to(sweep.position, { x: 7, duration: 1.4, ease: 'power2.inOut' }, 1.6)
    .to(sweep, { intensity: 0, duration: 0.4 }, 2.7)
    .to(logo.rotation, { y: 0, duration: 1.2, ease: 'power2.inOut' }, 1.9)
    .fromTo(claim, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 2.0)
    .add(exit, 3.4);

  let running = true;
  (function loop(now) { if (!running) return; requestAnimationFrame(loop); const t = (now || 0) / 1000; dust.rotation.y = t * 0.02; dust.position.y = Math.sin(t * 0.3) * 0.2; renderer.render(scene, camera); })();
  addEventListener('resize', () => { renderer.setSize(VW(), VH(), false); fit(); });

  // il logo vola nell'header: il riquadro della stella sullo schermo diventa quello del marchio nell'header
  const box3 = new THREE.Box3();
  function starRect() {
    box3.makeEmpty(); pieces.forEach((p) => box3.expandByObject(p.m));
    const c = [[box3.min.x, box3.min.y], [box3.max.x, box3.max.y], [box3.min.x, box3.max.y], [box3.max.x, box3.min.y]].map(([x, y]) => new THREE.Vector3(x, y, 0).project(camera));
    const xs = c.map((v) => (v.x * 0.5 + 0.5) * VW()), ys = c.map((v) => (-v.y * 0.5 + 0.5) * VH());
    return { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) };
  }
  function exit() {
    if (!running) return;
    const target = document.querySelector('#logo .cma-star')?.getBoundingClientRect();
    gsap.to(claim, { autoAlpha: 0, duration: 0.3 });
    gsap.to(ringMat, { opacity: 0, duration: 0.45 });
    if (!target || !target.width) { gsap.to(intro, { autoAlpha: 0, duration: 0.6, onComplete: end }); return; }
    const s = starRect(), sc = target.height / (s.b - s.t);
    const dx = target.left + target.width / 2 - ((s.l + s.r) / 2) * sc, dy = target.top + target.height / 2 - ((s.t + s.b) / 2) * sc;
    canvas.style.transformOrigin = '0 0';
    gsap.timeline({ onComplete: end })
      .to(canvas, { x: dx, y: dy, scale: sc, duration: 1.05, ease: 'expo.inOut' }, 0)
      .to(logo.rotation, { y: 0, x: 0, duration: 1.05, ease: 'expo.inOut' }, 0)
      .to('#cintroBg', { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 0.15)
      .to('#logo', { autoAlpha: 1, duration: 0.25 }, 0.9)
      .to(canvas, { autoAlpha: 0, duration: 0.25 }, 0.95);
    intro.style.pointerEvents = 'none';
  }
  function end() { running = false; renderer.dispose(); done(); }
  skipBtn?.addEventListener('click', () => { tl.kill(); running = false; gsap.to(intro, { autoAlpha: 0, duration: 0.35, onComplete: () => { renderer.dispose(); done(); } }); });
}
