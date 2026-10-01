/* =====================================================================
   LAMBDA · motore condiviso da tutte le pagine
   - header e footer da un'unica fonte
   - scorrimento morbido (Lenis) e UN SOLO ciclo di animazione
   - animazioni all'ingresso, contatori, bottoni magnetici
   ===================================================================== */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body, page = body.dataset.page || '';
  const L = (window.Lambda = { reduced, frames: [], lenis: null, onFrame(fn) { this.frames.push(fn); } });

  /* ---------------- header e footer: un'unica fonte, uno per ramo ----------------
     body[data-branch]:  "gate" = soglia · "stud" = Lambda (studenti) · "conc" = Concorsi Militari Academy */
  const branch = body.dataset.branch || 'stud';
  const ICON = `<svg class="logo-icon" id="logoIcon" viewBox="0 0 120 100" aria-hidden="true">
      <circle class="st glass" cx="38" cy="24" r="17"/><circle class="st glass" cx="82" cy="24" r="17"/>
      <path class="st" d="M55 22 Q60 17 65 22"/><path class="st" d="M34 50 H92 V62 H34 Z M40 56 H86"/>
      <path class="st" d="M30 66 H86 V76 H30 Z"/><path class="st" d="M22 80 H98 V94 H22 Z M30 87 H92"/></svg>`;
  // marchio Concorsi Militari Academy: se c'è assets/cma-mark.js usa il logo ufficiale ricostruito
  const CM = window.CMA_MARK;
  const STAR = CM ? CM.svg({ ring: false, cls: 'cma-star' }) : `<svg class="cma-star" viewBox="0 0 200 200" aria-hidden="true"><path fill="#CD141F" d="M100 8 L124 76 L196 76 L138 118 L160 188 L100 146 L40 188 L62 118 L4 76 L76 76 Z"/></svg>`;
  const SEAL = CM ? CM.svg({ ring: true, cls: 'cma-seal' }) : STAR;
  const BR = {
    gate: { home: 'index.html', logo: `${ICON}<img class="wordmark" src="assets/wordmark-white.png" alt="Centro Studi Lambda">`, nav: [], cta: null },
    stud: { home: 'studenti.html', logo: `${ICON}<img class="wordmark" src="assets/wordmark-white.png" alt="Centro Studi Lambda">`,
      nav: [['Percorsi', 'studenti.html#percorsi', 'percorsi'], ['Metodo FOCUS', 'metodo-focus.html', 'focus'], ['Come funziona', 'studenti.html#come', 'come'], ['Risultati', 'risultati.html', 'risultati'], ['Sedi', 'sedi.html', 'sedi']],
      cta: ['Fai il Performance Test →', 'test.html', 'btn-cta-stud'] },
    conc: { home: 'concorsi.html', logo: `${STAR}<span class="cma-word"><b>CONCORSI MILITARI</b><span>ACADEMY</span></span>`,
      nav: [['Concorsi', 'concorsi.html#corpi-sec', 'concorsi'], ['Metodo EAGLE', 'concorsi.html#eagle', 'eagle'], ['Simulatore', 'simulatore.html', 'simulatore'], ['Risultati', 'concorsi.html#risultati', 'risultati'], ['Sedi', 'sedi-concorsi.html', 'sedi']],
      cta: ['Test Concorsi →', 'test-concorsi.html', 'btn-cta-conc'] },
  }[branch];
  const headerHTML = `
  <header class="hdr" id="hdr" data-hbranch="${branch}">
    <a class="logo" id="logo" href="${BR.home}" aria-label="Home">${BR.logo}</a>
    ${BR.nav.length ? `<nav class="nav" aria-label="Principale">${BR.nav.map(([t, h, id]) => `<a href="${h}"${id === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>` : '<span class="hdr-space"></span>'}
    ${BR.cta ? `<a class="btn hdr-cta ${BR.cta[2]} magnetic" href="${BR.cta[1]}"><span class="t">${BR.cta[0]}</span></a>` : ''}
    ${branch !== 'gate' ? `<a class="switch-branch" href="index.html" title="Torna alla scelta del percorso">Cambia percorso</a>` : ''}
    ${BR.nav.length ? '<button class="burger" id="burger" aria-label="Apri il menu" aria-expanded="false"><i></i><i></i></button>' : ''}
  </header>
  ${BR.nav.length ? `<nav class="menu" id="menu" aria-label="Menu mobile">
    ${BR.nav.map(([t, h]) => `<a href="${h}"><span>${t}</span></a>`).join('')}
    <div class="mt">${BR.cta ? `<a href="${BR.cta[1]}">${BR.cta[0]}</a>` : ''}<a href="index.html">↺ Cambia percorso</a></div>
  </nav>` : ''}`;
  const col = (title, items) => `<div><h4>${title}</h4><ul>${items.map(([t, h, soon]) => `<li><a href="${h || '#'}">${t}</a>${soon ? '<span class="soon">PRESTO</span>' : ''}</li>`).join('')}</ul></div>`;
  const legal = (owner) => `<div class="legal"><span>${owner} · © ${new Date().getFullYear()} Preparazione Concorsi LTD · P.IVA: MT 3058-2802</span>
        <nav aria-label="Note legali"><a href="#">Privacy</a><a href="#">Cookie</a><a href="#">Termini</a><a href="#">Dati societari</a></nav></div>`;
  const social = `<div class="social"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="YouTube">YT</a><a href="#" aria-label="Facebook">FB</a><a href="#" aria-label="TikTok">TK</a></div>`;
  const FOOT = {
    gate: `<footer class="foot foot-slim"><div class="foot-in">${legal('Centro Studi Lambda · Concorsi Militari Academy')}</div></footer>`,
    stud: `<footer class="foot" aria-label="Informazioni"><div class="foot-in"><div class="foot-top">
        <div class="brand"><img src="assets/wordmark-white.png" alt="Centro Studi Lambda"><p>Metodo di studio, tutor e lezioni live. Online, in tutta Italia: per dare a ogni ragazzo gli strumenti per arrivare lontano.</p>${social}</div>
        ${col('Percorsi', [['Scuola primaria', 'percorso.html?p=primaria'], ['Scuola media', 'percorso.html?p=media'], ['Scuola superiore', 'percorso.html?p=superiore'], ['Università', 'percorso.html?p=universita'], ['Test universitari', 'percorso.html?p=test-universitari']])}
        ${col('Esigenze', [['Metodo di studio', 'percorso.html?p=metodo-di-studio'], ['Ripetizioni', 'percorso.html?p=ripetizioni'], ['Recupero insufficienze', 'percorso.html?p=recupero-insufficienze'], ['DSA/BES', 'percorso.html?p=dsa-bes'], ['Ansia scolastica', 'percorso.html?p=ansia-scolastica'], ['Memoria e concentrazione', 'percorso.html?p=memoria-concentrazione']])}
        ${col('Risorse', [['Performance Test', 'test.html'], ['Metodo FOCUS', 'metodo-focus.html'], ['La storia', 'storia.html'], ['Blog Lambda'], ['Guide per genitori']])}
        ${col('Lambda', [['Chi siamo', 'chisiamo.html'], ['Team', 'chisiamo.html#team'], ['Risultati', 'risultati.html'], ['Sedi', 'sedi.html'], ['Lavora con noi'], ['Franchising'], ['Contatti', 'mailto:info@centrostudilambda.it']])}
      </div>
      <a class="foot-other conc" href="concorsi.html"><span>Prepari un concorso per le Forze Armate o di Polizia?</span><b>Concorsi Militari Academy →</b></a>
      ${legal('Centro Studi Lambda')}</div></footer>`,
    conc: `<footer class="foot foot-conc" aria-label="Informazioni"><div class="foot-in"><div class="foot-top">
        <div class="brand">${SEAL}<p><b>Concorsi Militari Academy</b><br>by Centro Studi Lambda. Preparazione ai concorsi delle Forze Armate e di Polizia, online in tutta Italia.</p>${social}</div>
        ${col('Concorsi', [['Polizia di Stato', 'corpo.html?c=polizia'], ['Carabinieri', 'corpo.html?c=carabinieri'], ['Guardia di Finanza', 'corpo.html?c=gdf'], ['Esercito', 'corpo.html?c=esercito'], ['Marina Militare', 'corpo.html?c=marina'], ['Aeronautica Militare', 'corpo.html?c=aeronautica'], ['Polizia Penitenziaria', 'corpo.html?c=penitenziaria'], ['Vigili del Fuoco', 'corpo.html?c=vvf'], ['Accademie', 'corpo.html?c=accademie']])}
        ${col('Risorse', [['Test Concorsi', 'test-concorsi.html'], ['Simulatore CMA', 'simulatore.html'], ['Metodo EAGLE', 'concorsi.html#eagle'], ['Blog CMA', '#', 1]])}
        ${col('Academy', [['Chi siamo', 'chisiamo.html'], ['Risultati', 'concorsi.html#risultati'], ['Sedi', 'sedi-concorsi.html'], ['Contatti', 'tel:+393514206823']])}
      </div>
      <a class="foot-other stud" href="studenti.html"><span>Cerchi un metodo di studio per tuo figlio?</span><b>Centro Studi Lambda →</b></a>
      ${legal('Concorsi Militari Academy')}</div></footer>`,
  }[branch];
  const headerHTML_ = headerHTML, footerHTML = FOOT;
  document.querySelector('[data-lambda-header]')?.insertAdjacentHTML('afterend', headerHTML_);
  document.querySelector('[data-lambda-header]')?.remove();
  document.querySelector('[data-lambda-footer]')?.insertAdjacentHTML('afterend', footerHTML);
  document.querySelector('[data-lambda-footer]')?.remove();
  const $ = (s) => document.querySelector(s);
  const hdr = $('#hdr');

  /* ---------------- scorrimento morbido ---------------- */
  if (!reduced && window.Lenis) {
    L.lenis = new Lenis({ lerp: 0.09 });
    window.__lenis = L.lenis;
    if (body.classList.contains('intro-on')) L.lenis.stop();
  }
  L.release = () => { body.classList.remove('intro-on'); L.lenis?.start(); };

  /* ---------------- utilità ---------------- */
  L.clamp01 = (v) => Math.min(1, Math.max(0, v));
  L.win = (p, a, b, f = 0.03) => L.clamp01((p - a) / f) * L.clamp01((b - p) / f);
  L.ease = (t) => 1 - Math.pow(1 - t, 3);
  L.easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  /** avanzamento di una sezione fissata: 0 = inizio, 1 = fine */
  L.prog = (el) => { const r = el.getBoundingClientRect(); return (-r.top) / Math.max(1, r.height - innerHeight); };
  /** divide un titolo in parole per l'animazione di ingresso */
  L.split = (el) => {
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'word'; const i = document.createElement('span'); i.textContent = p; w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('word')) walk(n);
    });
    walk(el);
    el.querySelectorAll('.word > span').forEach((s, i) => (s.style.transitionDelay = i * 0.045 + 's'));
  };
  document.querySelectorAll('.split').forEach(L.split);
  // stelle Trustpilot
  const STAR5 = '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 17.5 5.8 21.2l1.6-7L2 9.5l7.1-.6z"/></svg>';
  L.stars = (root = document) => root.querySelectorAll('.stars i').forEach((i) => { if (!i.innerHTML) i.innerHTML = STAR5; });
  L.stars();

  /* ---------------- ingresso allo scroll + contatori ---------------- */
  const fmt = (v, d) => v.toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const count = (el) => {
    const to = parseFloat(el.dataset.count), d = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (reduced) { el.textContent = pre + fmt(to, d) + suf; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (now) => { const k = L.ease(Math.min(1, (now - t0) / dur)); el.textContent = pre + fmt(to * k, d) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll?.('[data-count]').forEach(count);
    if (e.target.dataset.count) count(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
  L.observe = (root = document) => root.querySelectorAll('[data-reveal], .split:not([data-manual]), [data-count-group]').forEach((el) => io.observe(el));
  L.observe();

  /* ---------------- header: test, menu, magnetici ---------------- */
  $('#burger')?.addEventListener('click', () => { const o = body.classList.toggle('menu-open'); $('#burger').setAttribute('aria-expanded', String(o)); if (L.lenis) o ? L.lenis.stop() : L.lenis.start(); });
  L.magnetic = (root = document) => {
    if (reduced || !matchMedia('(pointer: fine)').matches || !window.gsap) return;
    root.querySelectorAll('.magnetic:not([data-mag])').forEach((btn) => {
      btn.dataset.mag = 1; const t = btn.querySelector('.t');
      btn.addEventListener('pointermove', (e) => { const b = btn.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2); gsap.to(btn, { x: dx * 0.25, y: dy * 0.35, duration: 0.5, ease: 'power3.out' }); if (t) gsap.to(t, { x: dx * 0.1, y: dy * 0.14, duration: 0.5, ease: 'power3.out' }); });
      btn.addEventListener('pointerleave', () => gsap.to(t ? [btn, t] : btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }));
    });
  };
  L.magnetic();

  /* ---------------- UN SOLO ciclo di animazione per tutta la pagina ---------------- */
  const themed = () => [...document.querySelectorAll('[data-theme]')];
  function loop(now) {
    requestAnimationFrame(loop);
    L.lenis?.raf(now);
    const sy = L.lenis ? L.lenis.scroll : scrollY;
    hdr?.classList.toggle('scrolled', sy > 30);
    // header chiaro quando passa sopra una sezione chiara
    const y = (hdr?.offsetHeight || 70) * 0.6;
    const cur = themed().find((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
    // con data-hdr-manual è la pagina a decidere il colore dell'header (es. la storia, dopo la svolta)
    if (!body.hasAttribute('data-hdr-manual')) body.classList.toggle('light-hdr', cur?.dataset.theme === 'light');
    for (const f of L.frames) f(now, sy);
  }
  requestAnimationFrame(loop);
})();
