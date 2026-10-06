/* =====================================================================
   PAGINA D'INGRESSO · intro con i due marchi ("Un'origine, due strade")
   Un punto di luce → si divide in due eliche di particelle → a sinistra (sopra, su telefono)
   le particelle diventano il marchio Lambda, a destra (sotto) la stella CMA → i marchi solidi
   prendono il posto delle particelle → la frase → il logo Lambda vola nell'header, la stella
   nella sua porta, lo sfondo diviso diventa le due porte.
   Solo alla prima visita (localStorage 'gate-intro'); ?intro nell'indirizzo la fa rivedere.
   ===================================================================== */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { buildLambdaMark, buildCmaStar } from './brand3d.js?v=1';

const L = window.Lambda, M = window.CMA_MARK, $ = (s) => document.querySelector(s);
const intro = $('#gintro'), canvas = $('#gintro3d');
const webglOK = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } };
let seen = null; try { seen = localStorage.getItem('gate-intro'); } catch (e) {}
if (/[?&]intro\b/.test(location.search)) seen = null;

const finish = (mode) => { intro?.remove(); window.__startHero?.(mode); };
if (!intro) { /* nessuna intro */ }
else if (!M || L.reduced || seen || !webglOK()) finish(false);
else run();

function run() {
  window.__introRunning = true;
  try { localStorage.setItem('gate-intro', '1'); } catch (e) {}
  const VW = () => document.documentElement.clientWidth, VH = () => document.documentElement.clientHeight;
  const portrait = () => VW() / VH() < 0.85, mob = VW() < 760;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.6 : 2));
  renderer.setSize(VW(), VH(), false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(32, VW() / VH(), 0.1, 100);

  // luci: chiave calda, contro-luce oro a sinistra e verde a destra, una lama che passa sulle superfici
  scene.add(new THREE.AmbientLight('#ffffff', 0.25));
  const key = new THREE.DirectionalLight('#fff4e0', 2.0); key.position.set(3, 6, 8); scene.add(key);
  const rimL = new THREE.PointLight('#ffd66b', 0, 14, 1.4); scene.add(rimL);
  const rimR = new THREE.PointLight('#a9b97a', 0, 14, 1.4); scene.add(rimR);
  const sweep = new THREE.PointLight('#ffffff', 0, 9, 1.4); sweep.position.set(-8, 1.5, 3.5); scene.add(sweep);

  /* ---------- i due marchi, in posa finale ---------- */
  const LAM = buildLambdaMark(), CMA = buildCmaStar(M);
  const lamScale = 0.92, cmaScale = 0.5;
  LAM.group.scale.setScalar(lamScale); LAM.group.rotation.set(0.18, -0.38, 0);
  CMA.group.scale.setScalar(cmaScale); CMA.group.rotation.set(0.05, 0.28, 0);
  scene.add(LAM.group, CMA.group);
  const allMats = [...LAM.materials, ...CMA.materials];
  allMats.forEach((m) => { m.transparent = true; m.opacity = 0; m.depthWrite = false; });
  LAM.glass.opacity = 0;

  // impaginazione: affiancati su schermi larghi, uno sopra l'altro su telefono
  const layout = { dir: new THREE.Vector3(1, 0, 0), S: 3.3 };
  function place() {
    const a = VW() / VH(); camera.aspect = a;
    if (portrait()) { layout.dir.set(0, -1, 0); layout.S = 2.45; camera.position.set(0, 0.15, Math.max(16.5, 15 / Math.min(a / 0.62, 1))); }
    else { layout.dir.set(1, 0, 0); layout.S = Math.min(3.4, 2.6 + (a - 1) * 0.9); camera.position.set(0, 0.25, a < 1.3 ? 17 : 14.5); }
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    LAM.group.position.copy(layout.dir).multiplyScalar(-layout.S).add(new THREE.Vector3(0, portrait() ? 0.15 : 0.35, 0));
    CMA.group.position.copy(layout.dir).multiplyScalar(layout.S).add(new THREE.Vector3(0, portrait() ? -0.1 : 0.35, 0));
    rimL.position.copy(LAM.group.position).add(new THREE.Vector3(-1.5, 1.5, -2.5));
    rimR.position.copy(CMA.group.position).add(new THREE.Vector3(1.5, 1.5, -2.5));
  }
  place();

  /* ---------- le particelle: un punto per ogni granello della superficie dei marchi ---------- */
  const N_SIDE = mob ? 3200 : 7500;
  const tgt = new Float32Array(N_SIDE * 2 * 3), col = new Float32Array(N_SIDE * 2 * 3), seed = new Float32Array(N_SIDE * 2), side = new Float32Array(N_SIDE * 2);
  const v = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Color();
  function sampleMark(mark, offset, sgn, tint) {
    mark.group.updateMatrixWorld(true);
    const samplers = mark.meshes.map((m) => { const s = new MeshSurfaceSampler(m).build(); return { m, s, a: s.distribution[s.distribution.length - 1] }; });
    const tot = samplers.reduce((t, x) => t + x.a, 0);
    let i = 0;
    samplers.forEach((x, k) => {
      const cnt = k === samplers.length - 1 ? N_SIDE - i : Math.round((x.a / tot) * N_SIDE);
      const base = x.m.material.color.clone();
      for (let j = 0; j < cnt && i < N_SIDE; j++, i++) {
        x.s.sample(v, n); v.applyMatrix4(x.m.matrixWorld);
        const o = offset + i;
        tgt.set([v.x, v.y, v.z], o * 3);
        c.copy(base).lerp(tint, 0.18).multiplyScalar(1.35); col.set([c.r, c.g, c.b], o * 3);
        seed[o] = Math.random(); side[o] = sgn;
      }
    });
  }
  function sampleAll() { sampleMark(LAM, 0, -1, new THREE.Color('#ffd66b')); sampleMark(CMA, N_SIDE, 1, new THREE.Color('#ffffff')); }
  sampleAll();
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N_SIDE * 2 * 3), 3));
  pg.setAttribute('aTarget', new THREE.BufferAttribute(tgt, 3));
  pg.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  pg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  pg.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
  const U = { uA: { value: 0 }, uB: { value: 0 }, uFade: { value: 1 }, uTime: { value: 0 }, uDir: { value: layout.dir }, uS: { value: layout.S }, uSize: { value: mob ? 46 : 52 }, uPix: { value: renderer.getPixelRatio() } };
  const pmat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aTarget; attribute vec3 aColor; attribute float aSeed; attribute float aSide;
      uniform float uA, uB, uTime, uS, uSize, uPix; uniform vec3 uDir;
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float sd = aSeed, s = aSide, p = uA;
        // la doppia elica: due filamenti che si avvolgono e si allontanano verso il proprio lato
        vec3 p1 = abs(uDir.y) > 0.5 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
        vec3 p2 = vec3(0.0, 0.0, 1.0);
        float ang = sd * 6.2831 * 0.35 + p * 9.0 + uTime * 0.8 + (s > 0.0 ? 3.1416 : 0.0);
        float rad = 0.06 + (0.5 + fract(sd * 17.13) * 1.7) * sin(min(p, 1.0) * 3.1416 * 0.85);
        vec3 helix = uDir * s * uS * p * (0.15 + 1.05 * fract(sd * 7.31)) + p1 * sin(ang) * rad + p2 * cos(ang) * rad;
        // poi ogni granello raggiunge il suo posto sulla superficie del marchio (con un piccolo ritardo diverso)
        float d = clamp((uB - sd * 0.38) / 0.62, 0.0, 1.0); d = d * d * (3.0 - 2.0 * d);
        vec3 pos = mix(helix, aTarget, d);
        pos += (1.0 - d) * 0.03 * vec3(sin(uTime * 3.0 + sd * 40.0), cos(uTime * 2.6 + sd * 31.0), 0.0);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        float big = (1.0 - d) * 0.25 + (1.0 - smoothstep(0.0, 0.08, p)) * 2.0;
        gl_PointSize = uSize * uPix * (0.55 + fract(sd * 3.7) * 0.7) * (1.0 + big) / -mv.z;
        vColor = aColor * (1.0 + (1.0 - d) * 0.35);
        vAlpha = (0.45 + 0.55 * fract(sd * 13.7)) * (0.3 + 0.7 * d);
      }`,
    fragmentShader: `
      uniform float uFade; varying vec3 vColor; varying float vAlpha;
      void main() { float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vColor, a * a * vAlpha * uFade); }`,
  });
  const points = new THREE.Points(pg, pmat); points.frustumCulled = false; scene.add(points);

  // il punto di luce iniziale
  const glowTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, 'rgba(255,240,215,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); })();
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); core.scale.setScalar(0.4); scene.add(core);
  // polvere di fondo
  const DN = mob ? 140 : 260, dp = new Float32Array(DN * 3); for (let i = 0; i < DN; i++) { dp[i * 3] = (Math.random() - 0.5) * 26; dp[i * 3 + 1] = (Math.random() - 0.5) * 16; dp[i * 3 + 2] = -2 - Math.random() * 10; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.035, color: '#cfd6d8', transparent: true, opacity: 0, depthWrite: false })); scene.add(dust);

  /* ---------- etichette dei marchi, agganciate ai modelli ---------- */
  const lblL = $('#glblL'), lblR = $('#glblR'), tag = $('#gtag');
  const box = new THREE.Box3();
  function rectOf(group) {
    box.setFromObject(group);
    const pts = []; for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).project(camera));
    const xs = pts.map((p) => (p.x * 0.5 + 0.5) * VW()), ys = pts.map((p) => (-p.y * 0.5 + 0.5) * VH());
    return { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) };
  }
  function placeLabels() {
    [[LAM, lblL], [CMA, lblR]].forEach(([mk, el]) => { const r = rectOf(mk.group); el.style.left = (r.l + r.r) / 2 + 'px'; el.style.top = r.b + (portrait() ? 8 : 22) + 'px'; });
  }

  /* ---------- la regia ---------- */
  const halves = intro.querySelectorAll('.ghalf'), seam = $('#gseam');
  const tl = gsap.timeline({ delay: 0.2 });
  if (innerWidth < 760) tl.timeScale(1.7);   // su telefono l'intro dura meno
  tl.to(core.material, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .fromTo(core.scale, { x: 0.2, y: 0.2 }, { x: 1.1, y: 1.1, duration: 0.55, ease: 'power2.out' }, 0)
    .to(core.scale, { x: 0.7, y: 0.7, duration: 0.18, ease: 'power2.in' }, 0.5)          // si raccoglie...
    .to(core.scale, { x: 5, y: 5, duration: 0.5, ease: 'expo.out' }, 0.68)               // ...e si apre
    .to(core.material, { opacity: 0, duration: 0.7, ease: 'power2.in' }, 0.75)
    .to(U.uA, { value: 1, duration: 1.55, ease: 'power2.out' }, 0.68)
    .to(dust.material, { opacity: 0.45, duration: 1.5 }, 0.7)
    .to(halves, { autoAlpha: 1, duration: 1.6, ease: 'power2.inOut', stagger: 0.12 }, 0.75)
    .fromTo(seam, { scaleY: 0 }, { scaleY: 1, duration: 1.3, ease: 'power3.inOut' }, 0.95)
    .to(U.uB, { value: 1, duration: 1.8, ease: 'power3.inOut' }, 1.75)
    .to(rimL, { intensity: 30, duration: 1.2 }, 2.7).to(rimR, { intensity: 30, duration: 1.2 }, 2.7)
    .to(allMats, { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 3.1)
    .to(LAM.glass, { opacity: 0.18, duration: 0.9 }, 3.1)
    .to(U.uFade, { value: 0, duration: 1.0, ease: 'power2.in' }, 3.2)
    .add(() => allMats.forEach((m) => { m.depthWrite = true; }), 3.9)
    .to(sweep, { intensity: 55, duration: 0.3 }, 3.45)
    .to(sweep.position, { x: 8, duration: 1.5, ease: 'power2.inOut' }, 3.45)
    .to(sweep, { intensity: 0, duration: 0.4 }, 4.55)
    .add(placeLabels, 3.35)
    .fromTo([lblL, lblR], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 3.45)
    .fromTo(tag.querySelectorAll('.w > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 3.7)
    .fromTo(tag.querySelector('em'), { backgroundSize: '0% 4px' }, { backgroundSize: '100% 4px', duration: 0.9, ease: 'power3.inOut' }, 4.25)
    .add(exit, 5.6);

  // movimento continuo: i marchi respirano e seguono appena il mouse
  let mx = 0, my = 0, tmx = 0, tmy = 0, running = true, flying = false;
  addEventListener('pointermove', (e) => { tmx = e.clientX / VW() - 0.5; tmy = e.clientY / VH() - 0.5; });
  const clock = new THREE.Clock();
  (function loop() {
    if (!running) return; requestAnimationFrame(loop);
    const t = clock.getElapsedTime(); U.uTime.value = t;
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    if (!flying) {
      LAM.group.rotation.y = -0.38 + Math.sin(t * 0.6) * 0.12 + mx * 0.3; LAM.group.rotation.x = 0.18 + my * 0.12;
      CMA.group.rotation.y = 0.28 + Math.sin(t * 0.55 + 1) * 0.14 + mx * 0.3; CMA.group.rotation.x = 0.05 + my * 0.12;
    }
    dust.rotation.y = t * 0.015;
    renderer.render(scene, camera);
  })();
  addEventListener('resize', () => { if (flying) return; renderer.setSize(VW(), VH(), false); place(); U.uS.value = layout.S; sampleAll(); pg.attributes.aTarget.needsUpdate = true; placeLabels(); });

  /* ---------- uscita: ogni marchio vola al suo posto nella pagina ---------- */
  const flyTo = (group, el, dur, size) => {
    const r = rectOf(group); let T = el?.getBoundingClientRect();
    if (T && size) T = { left: T.left + T.width / 2 - size / 2, top: T.top + T.height / 2 - size / 2, width: size, height: size, bottom: T.top + T.height / 2 + size / 2 };
    if (!T || !T.width || T.top > VH() || T.bottom < 0) return gsap.timeline().to(group.scale, { x: group.scale.x * 0.6, y: group.scale.y * 0.6, z: group.scale.z * 0.6, duration: dur, ease: 'expo.in' });
    const k = Math.min(T.width / (r.r - r.l), T.height / (r.b - r.t));
    const ndc = group.position.clone().project(camera);
    const cx = ((T.left + T.width / 2) / VW()) * 2 - 1, cy = -((T.top + T.height / 2) / VH()) * 2 + 1;
    const dest = new THREE.Vector3(cx, cy, ndc.z).unproject(camera);
    return gsap.timeline()
      .to(group.position, { x: dest.x, y: dest.y, z: dest.z, duration: dur, ease: 'expo.inOut' }, 0)
      .to(group.scale, { x: group.scale.x * k, y: group.scale.y * k, z: group.scale.z * k, duration: dur, ease: 'expo.inOut' }, 0)
      .to(group.rotation, { x: 0, y: 0, z: 0, duration: dur, ease: 'expo.inOut' }, 0);
  };
  let exited = false;
  function exit() {
    if (exited) return; exited = true; flying = true; tl.progress(1);
    window.__startHero?.('gate');                    // le porte si preparano sotto
    gsap.set('#logo', { autoAlpha: 0 });
    gsap.to([lblL, lblR, tag, '#gskip'], { autoAlpha: 0, duration: 0.35 });
    allMats.forEach((m) => { m.transparent = true; m.depthWrite = true; });
    const out = gsap.timeline({ onComplete: end });
    out.add(flyTo(LAM.group, document.getElementById('logoIcon'), 1.1), 0)
       .add(flyTo(CMA.group, document.querySelector('#doorConc .tricolore'), 1.1, 40), 0.05)   // la stella si posa sull'etichetta della sua porta
       .to('#logo', { autoAlpha: 1, duration: 0.3 }, 0.95)
       .to(LAM.materials.concat([LAM.glass]), { opacity: 0, duration: 0.25 }, 1.0)
       .to(CMA.materials, { opacity: 0, duration: 0.3 }, 0.95)
       .to(dust.material, { opacity: 0, duration: 0.5 }, 0.2)
       .to('#gintroBg', { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 0.25);
    intro.style.pointerEvents = 'none';
  }
  function end() { running = false; window.__introRunning = false; renderer.dispose(); intro.remove(); }
  $('#gskip').addEventListener('click', exit);
}
