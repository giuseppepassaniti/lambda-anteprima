/* =====================================================================
   CONCORSI MILITARI ACADEMY · tema del viaggio 3D delle sedi
   Stesse sedi e stesso modello di Lambda (tutto online, la sede per il tutor
   in presenza e una postazione): cambiano colori, insegna e schermi.
   Va caricato PRIMA di assets/sedi3d.js.
   ===================================================================== */
(() => {
  const RED = '#CD141F', HUD = '#a9b97a', BONE = '#F2F1EC';
  // la stella CMA disegnata su canvas (insegna e schermi)
  const star = (x, cx, cy, r, color) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } x.closePath(); x.fillStyle = color; x.fill(); };

  // disegno su canvas: testo e scudetto di un corpo
  const T2 = (x, s, X, Y, size, color, w = 700, font = "'Space Grotesk', system-ui, sans-serif", align = 'left') => { x.font = `${w} ${size}px ${font}`; x.fillStyle = color; x.textAlign = align; x.fillText(s, X, Y); };
  const MONO = "'JetBrains Mono', ui-monospace, monospace";
  const shield = (x, cx, cy, s, col, code) => { x.beginPath(); x.moveTo(cx, cy - s); x.lineTo(cx + s * 0.86, cy - s * 0.7); x.lineTo(cx + s * 0.86, cy + s * 0.1); x.quadraticCurveTo(cx + s * 0.8, cy + s * 0.8, cx, cy + s * 1.05); x.quadraticCurveTo(cx - s * 0.8, cy + s * 0.8, cx - s * 0.86, cy + s * 0.1); x.lineTo(cx - s * 0.86, cy - s * 0.7); x.closePath(); x.fillStyle = col; x.fill(); x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 3; x.setLineDash([6, 5]); x.stroke(); x.setLineDash([]); T2(x, code, cx, cy + s * 0.25, s * 0.62, '#fff', 700, MONO, 'center'); };

  /* ---------- la stanza dell'allievo (percorso "da casa") ---------- */
  function casa({ THREE, casa, box, std, ctex, sprite, at3, walls }) {
    walls.back.material.color.set('#2a3124'); walls.left.material.color.set('#232a1e'); walls.floor.material.color.set('#1d1914');
    // la bacheca: obiettivo, corpi, conto alla rovescia alla preselettiva
    const B = ctex(1024, 720), x = B.x;
    x.fillStyle = '#b08d62'; x.fillRect(0, 0, 1024, 720);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '90,60,30' : '255,230,190'},${Math.random() * 0.18})`; x.fillRect(Math.random() * 1024, Math.random() * 720, 3, 3); }
    x.fillStyle = '#f4ecd6'; x.save(); x.translate(60, 50); x.rotate(-0.02); x.fillRect(0, 0, 560, 150); T2(x, 'OBIETTIVO', 28, 52, 30, RED, 700, MONO); T2(x, 'Allievi Carabinieri', 28, 112, 54, '#1a1a1a'); x.restore();
    star(x, 600, 60, 26, RED);
    [['CC', '#B3243A'], ['EI', '#6B7F3A'], ['PS', '#2D5DA8']].forEach(([c, col], i) => shield(x, 130 + i * 170, 330, 66, col, c));
    // calendario del mese con i giorni barrati
    x.fillStyle = '#f4ecd6'; x.save(); x.translate(600, 230); x.rotate(0.025); x.fillRect(0, 0, 380, 420);
    T2(x, 'PRESELETTIVA', 24, 50, 26, RED, 700, MONO);
    for (let d = 0; d < 35; d++) { const cx = 24 + (d % 7) * 48, cy = 90 + Math.floor(d / 7) * 56; x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2; x.strokeRect(cx, cy, 44, 50); T2(x, String(d + 1), cx + 6, cy + 20, 16, '#333', 500);
      if (d < 18) { x.strokeStyle = 'rgba(205,20,31,.75)'; x.lineWidth = 4; x.beginPath(); x.moveTo(cx + 8, cy + 10); x.lineTo(cx + 38, cy + 44); x.moveTo(cx + 38, cy + 10); x.lineTo(cx + 8, cy + 44); x.stroke(); }
      if (d === 30) { x.strokeStyle = RED; x.lineWidth = 5; x.beginPath(); x.arc(cx + 22, cy + 26, 26, 0, 7); x.stroke(); } }
    x.restore();
    x.fillStyle = '#141c10'; x.save(); x.translate(70, 520); x.rotate(0.03); x.fillRect(0, 0, 470, 150);
    T2(x, '−12', 30, 112, 96, RED, 700, MONO); T2(x, 'GIORNI', 250, 72, 30, BONE, 700, MONO); T2(x, 'alla prova', 250, 112, 28, HUD, 500); x.restore();
    [[120, 40], [600, 230], [80, 520], [960, 240]].forEach(([px, py]) => { x.fillStyle = RED; x.beginPath(); x.arc(px, py, 10, 0, 7); x.fill(); });
    B.t.needsUpdate = true;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.81), new THREE.MeshStandardMaterial({ map: B.t, roughness: 0.9, emissive: '#3a2a18', emissiveIntensity: 0.25 }));
    board.position.set(1.45, 1.95, -1.385); casa.add(board);
    const frame = box(1.21, 0.87, 0.03, std('#3b2a1c'), 0.01); frame.position.set(1.45, 1.95, -1.405); casa.add(frame);
    // il basco, appoggiato dove lo studente aveva i libri
    const beret = new THREE.Group(); beret.position.set(-0.75, 0.8, -0.16); beret.rotation.set(0.05, 0.5, 0.08); casa.add(beret);
    const bm = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), std('#3a4a2a', { roughness: 0.95 })); bm.scale.set(1, 0.32, 0.9); beret.add(bm);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.014, 8, 40), std('#1a1a14')); band.rotation.x = Math.PI / 2; band.scale.y = 0.9; beret.add(band);
    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.03, 5), new THREE.MeshStandardMaterial({ color: RED, metalness: 0.6, roughness: 0.3, emissive: '#3a0306' })); badge.position.set(0.11, 0.03, 0.06); badge.rotation.set(-0.3, 0.9, 0); beret.add(badge);
    // le piastrine
    const steel = std('#b9c0c4', { metalness: 0.85, roughness: 0.25 });
    [0, 1].forEach((i) => { const t = box(0.07, 0.006, 0.042, steel, 0.012); t.position.set(0.46 + i * 0.03, 0.795 + i * 0.006, 0.26 + i * 0.02); t.rotation.y = 0.4 + i * 0.3; casa.add(t); });
    const chain = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.003, 6, 40), steel); chain.rotation.x = Math.PI / 2; chain.position.set(0.53, 0.792, 0.33); chain.scale.set(1, 0.7, 1); casa.add(chain);
    // il cronometro delle prove fisiche
    const sw = new THREE.Group(); sw.position.set(-0.45, 0.8, 0.3); sw.rotation.x = -0.15; casa.add(sw);
    const F = ctex(128, 128); F.x.fillStyle = '#f4ecd6'; F.x.beginPath(); F.x.arc(64, 64, 62, 0, 7); F.x.fill(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; F.x.fillStyle = '#222'; F.x.fillRect(64 + Math.cos(a) * 50 - 2, 64 + Math.sin(a) * 50 - 2, 4, 4); } F.x.strokeStyle = RED; F.x.lineWidth = 4; F.x.beginPath(); F.x.moveTo(64, 64); F.x.lineTo(92, 30); F.x.stroke(); F.t.needsUpdate = true;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 32), std('#1f241c', { metalness: 0.5, roughness: 0.4 })); sw.add(body);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.052, 32), new THREE.MeshBasicMaterial({ map: F.t })); face.rotation.x = -Math.PI / 2; face.position.y = 0.016; sw.add(face);
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 12), std('#1f241c')); knob.rotation.x = Math.PI / 2; knob.position.set(0, 0, -0.07); sw.add(knob);
    // il kettlebell accanto alla scrivania
    const kb = new THREE.Group(); kb.position.set(1.35, 0, 0.35); casa.add(kb);
    const iron = std('#15180f', { metalness: 0.6, roughness: 0.45 });
    const kbb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 18), iron); kbb.position.y = 0.14; kbb.scale.y = 0.92; kb.add(kbb);
    const kbh = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.022, 10, 24, Math.PI), iron); kbh.position.y = 0.25; kb.add(kbh);
    // la luce della bacheca
    const bl = new THREE.PointLight('#ffd9a8', 1.6, 2.4, 1.6); bl.position.set(1.45, 2.1, -0.7); casa.add(bl);
  }

  /* ---------- in sede: la bacheca degli allievi ---------- */
  function decor({ THREE, g, box, std, ctex }) {
    const B = ctex(1024, 576), x = B.x;
    x.fillStyle = '#141c10'; x.fillRect(0, 0, 1024, 576);
    star(x, 60, 62, 22, RED); T2(x, 'BACHECA ALLIEVI', 96, 74, 34, BONE, 700, MONO);
    [['CC', '#B3243A', 'Allievi Carabinieri', 'Banca dati', 0.72], ['EI', '#6B7F3A', 'VFI Esercito', 'Prove fisiche', 0.48], ['PS', '#2D5DA8', 'Allievi Agenti PS', 'Simulazioni', 0.6]].forEach(([c, col, n, t, v], i) => {
      const y = 140 + i * 136; x.fillStyle = 'rgba(242,241,236,.06)'; x.fillRect(40, y, 944, 112);
      shield(x, 110, y + 50, 40, col, c); T2(x, n, 180, y + 50, 38, BONE); T2(x, t.toUpperCase(), 180, y + 90, 22, HUD, 500, MONO);
      x.fillStyle = 'rgba(242,241,236,.1)'; x.fillRect(640, y + 48, 300, 14); x.fillStyle = i ? HUD : RED; x.fillRect(640, y + 48, 300 * v, 14);
    });
    B.t.needsUpdate = true;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.01), new THREE.MeshBasicMaterial({ map: B.t, toneMapped: false }));
    m.position.set(-0.75, 1.9, -2.54); g.add(m);
    const f = box(1.88, 1.09, 0.04, std('#1d2a18'), 0.02); f.position.set(-0.75, 1.9, -2.565); g.add(f);
  }

  window.SEDI_THEME = {
    casa,
    // ultima tappa da casa: la camera inquadra insieme il portatile (le simulazioni) e la bacheca (il conto alla rovescia)
    casaKF: (K, { at, O1 }) => { const m = innerWidth < 760; K.forEach((k) => { if (k.p === 0.725) { k.pos = at(O1, m ? 0.4 : -0.25, 1.62, m ? 2.9 : 2.35); k.look = at(O1, m ? 0.75 : 0.3, m ? 1.55 : 1.38, -0.9); } if (k.p === 0.8 || k.p === 0.8129) { k.pos = at(O1, m ? 0.5 : -0.1, 1.58, m ? 2.6 : 2.05); k.look = at(O1, m ? 0.8 : 0.38, m ? 1.6 : 1.4, -0.95); } }); },
    net: 'Rete CMA', brand: 'CMA', btn: 'btn-conc', test: 'test-concorsi.html',
    page: (k) => `sede.html?c=${k}&b=cma`,
    p: {
      bg: '#060805', hemi: '#7d8f5a', moon: '#dfe6cc', land: '#1a2614', landE: '#0b1208', acc: HUD, dim: '#5f7034', warm: RED, win: '#f4ecd6', core: '#ffd2d5',
      bld: '#2f4126', roof: '#141c10', pulse: '#fff0e8', scr1: '#18210f', scr2: '#0b0f08',
      sea: [[0, 'rgba(75,90,43,.45)'], [0.5, 'rgba(30,40,20,.22)'], [1, 'rgba(6,8,5,0)']],
      flashCasa: 'radial-gradient(circle at 50% 50%, #fff4ee, #e8343f)',
    },
    interior: {
      navy: '#1d2a18', teal: '#4B5A2B', warm: RED, acc: HUD, scr1: '#18210f', scr2: '#0b0f08', scrBox: '#33452a', net: 'Rete CMA', student: '#4B5A2B', decor,
      sign: (S, city, txt, MONO) => {
        const x = S.x; x.fillStyle = '#141c10'; x.fillRect(0, 0, 1024, 384);
        x.strokeStyle = 'rgba(169,185,122,.5)'; x.lineWidth = 4; x.beginPath(); x.arc(190, 176, 118, 0, 7); x.stroke();
        star(x, 190, 180, 92, RED);
        txt(S, 'CONCORSI MILITARI', 350, 130, 46, '#fff');
        txt(S, city ? `ACADEMY · ${city.toUpperCase()}` : 'ACADEMY', 350, 204, city && city.length > 7 ? 54 : 62, RED);
        txt(S, 'SEDE COLLEGATA ALLA RETE CMA', 350, 300, 28, HUD, 500, MONO);
      },
    },

    /* schermi del portatile "da casa": test → colloquio → giornata → simulazioni */
    screens: ({ txt, rr, avatar, bg, MONO }) => ({
      test(S) {
        bg(S); txt(S, 'TEST CONCORSI · IL TUO FASCICOLO', 60, 78, 22, HUD, 500, MONO); txt(S, 'Le compatibilità di Luca', 60, 136, 44, BONE);
        [['Carabinieri', 'CC', '#B3243A', 92], ['Esercito', 'EI', '#6B7F3A', 84], ['Polizia di Stato', 'PS', '#2D5DA8', 77]].forEach(([n, c, col, v], i) => {
          const y = 196 + i * 120; rr(S, 60, y, 640, 100, 20, 'rgba(242,241,236,.05)');
          rr(S, 84, y + 22, 64, 56, 12, col); txt(S, c, 116, y + 60, 22, '#fff', 700, MONO, 'center');
          txt(S, n, 172, y + 46, 30, BONE); rr(S, 172, y + 62, 420, 10, 5, 'rgba(242,241,236,.1)'); rr(S, 172, y + 62, 420 * v / 100, 10, 5, i ? HUD : RED);
          txt(S, v + '%', 676, y + 60, 30, BONE, 700, MONO, 'right');
        });
        S.x.save(); S.x.translate(850, 330); S.x.rotate(-0.16); S.x.strokeStyle = RED; S.x.lineWidth = 6; S.x.strokeRect(-130, -48, 260, 96);
        txt(S, 'COMPATIBILE', 0, 14, 36, RED, 700, MONO, 'center'); S.x.restore();
        txt(S, 'Primo concorso consigliato', 760, 470, 20, 'rgba(242,241,236,.55)', 500); txt(S, 'Allievi Carabinieri', 760, 506, 28, BONE);
      },
      call(S) {
        S.x.fillStyle = '#090c07'; S.x.fillRect(0, 0, S.w, S.h); txt(S, 'COLLOQUIO CON IL TUTOR · VIDEOCHIAMATA', 40, 56, 20, HUD, 500, MONO);
        const g = S.x.createLinearGradient(0, 90, 0, 560); g.addColorStop(0, '#3d5230'); g.addColorStop(1, '#18210f'); rr(S, 40, 84, 610, 470, 26, g); avatar(S, 345, 330, 230, 'rgba(242,241,236,.9)');
        rr(S, 60, 500, 220, 40, 12, 'rgba(0,0,0,.4)'); txt(S, 'Tutor CMA', 78, 528, 22, '#fff');
        rr(S, 670, 84, 314, 210, 22, '#2a2420'); avatar(S, 827, 210, 130, 'rgba(244,236,214,.85)'); txt(S, 'Tu, da casa', 688, 278, 20, '#fff', 500);
        rr(S, 670, 314, 314, 240, 22, 'rgba(242,241,236,.05)'); txt(S, 'IL TUO PIANO', 690, 352, 16, HUD, 500, MONO);
        ['Allievi Carabinieri', 'Banca dati · 10.378', 'Metodo EAGLE', 'Prove psicoattitudinali'].forEach((t, i) => { star(S.x, 700, 392 + i * 42, 9, i ? HUD : RED); txt(S, t, 720, 400 + i * 42, 21, BONE, 500); });
        [[420, '#262e20'], [490, '#262e20'], [560, RED]].forEach(([x, c]) => { S.x.fillStyle = c; S.x.beginPath(); S.x.arc(x, 598, 24, 0, 7); S.x.fill(); });
      },
      hub(S) {
        bg(S); txt(S, 'OGGI · LA TUA PREPARAZIONE', 60, 78, 22, HUD, 500, MONO); txt(S, 'Martedì', 60, 136, 46, BONE);
        [['15:00', 'Lezione live', 'Metodo EAGLE · memoria', HUD, 'LIVE'], ['16:30', 'Simulatore', 'Banca dati Allievi CC', RED, 'QUIZ'], ['18:00', 'Psicoattitudinale', 'Colloquio di prova', '#f4ecd6', '1 A 1']].forEach(([t, a, b, c, k], i) => {
          const y = 190 + i * 140; rr(S, 60, y, 904, 116, 22, 'rgba(242,241,236,.05)'); txt(S, t, 92, y + 70, 34, 'rgba(242,241,236,.6)'); txt(S, a, 260, y + 54, 36, BONE); txt(S, b, 260, y + 90, 24, 'rgba(242,241,236,.6)', 500);
          rr(S, 790, y + 36, 140, 44, 22, c); txt(S, k, 860, y + 66, 20, c === RED ? '#fff' : '#10160d', 700, MONO, 'center');
        });
      },
      progress(S, t) {
        bg(S); txt(S, 'LE SIMULAZIONI DI LUCA', 60, 78, 22, HUD, 500, MONO); txt(S, 'Più risposte esatte, ogni settimana', 60, 136, 42, BONE);
        const x0 = 90, y0 = 560, w = 860, h = 330, V = [41, 46, 52, 55, 61, 66, 72, 79];
        S.x.strokeStyle = 'rgba(242,241,236,.1)'; S.x.lineWidth = 2; for (let i = 0; i <= 4; i++) { S.x.beginPath(); S.x.moveTo(x0, y0 - (h * i) / 4); S.x.lineTo(x0 + w, y0 - (h * i) / 4); S.x.stroke(); }
        const n = Math.max(1, t * (V.length - 1)); S.x.beginPath();
        for (let i = 0; i <= Math.floor(n); i++) { const x = x0 + (w * i) / (V.length - 1), y = y0 - (h * V[i]) / 100; i ? S.x.lineTo(x, y) : S.x.moveTo(x, y); }
        const fi = Math.floor(n), fr = n - fi; if (fi < V.length - 1) { const v = V[fi] + (V[fi + 1] - V[fi]) * fr; S.x.lineTo(x0 + (w * n) / (V.length - 1), y0 - (h * v) / 100); }
        S.x.strokeStyle = RED; S.x.lineWidth = 7; S.x.lineJoin = 'round'; S.x.stroke();
        V.forEach((_, i) => txt(S, 'SIM ' + (i + 1), x0 + (w * i) / (V.length - 1), 600, 16, 'rgba(242,241,236,.45)', 500, MONO, 'center'));
        txt(S, 'DATI DI ESEMPIO', 964, 78, 16, RED, 700, MONO, 'right');
      },
    }),

    /* i tre pannelli che escono dallo schermo */
    panels: ({ txt, rr, avatar, MONO }) => [
      (S) => { txt(S, 'LEZIONE LIVE', 30, 46, 18, HUD, 500, MONO); rr(S, 30, 70, 452, 220, 18, '#33452a'); avatar(S, 160, 200, 140, 'rgba(242,241,236,.9)'); S.x.strokeStyle = 'rgba(242,241,236,.5)'; S.x.lineWidth = 4; [110, 150, 190].forEach((y) => { S.x.beginPath(); S.x.moveTo(270, y); S.x.lineTo(440, y); S.x.stroke(); }); },
      (S) => { txt(S, 'SIMULATORE', 30, 46, 18, RED, 500, MONO); txt(S, 'Domanda 12 / 40', 30, 92, 22, BONE); ['A  36', 'B  48', 'C  42', 'D  30'].forEach((a, i) => { rr(S, 30 + (i % 2) * 230, 120 + Math.floor(i / 2) * 82, 218, 66, 14, i === 1 ? 'rgba(63,191,106,.25)' : 'rgba(242,241,236,.07)'); txt(S, a, 54 + (i % 2) * 230, 162 + Math.floor(i / 2) * 82, 24, BONE, 600); }); },
      (S) => { txt(S, 'AULA STUDIO', 30, 46, 18, '#f4ecd6', 500, MONO); for (let i = 0; i < 6; i++) { const x = 30 + (i % 3) * 154, y = 70 + Math.floor(i / 3) * 112; rr(S, x, y, 142, 100, 14, i === 4 ? '#33452a' : 'rgba(242,241,236,.07)'); avatar(S, x + 71, y + 58, 56, i === 4 ? 'rgba(242,241,236,.9)' : 'rgba(205,20,31,.7)'); } },
    ],
  };
})();
