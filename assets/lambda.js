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
      nav: [['Percorsi', 'studenti.html#percorsi', 'percorsi'], ['Metodo FOCUS', 'metodo-focus.html', 'focus'], ['Risultati', 'risultati.html', 'risultati'], ['Sedi', 'sedi.html', 'sedi']],
      // i prodotti dell'ecosistema Lambda, separati dal percorso principale: menu a tendina "Oltre la scuola"
      more: ['Oltre la scuola', [['Vacanze studio a Malta', 'vacanze-studio.html', 'vacanze', 'Inglese, college ed escursioni. Anche con il Metodo FOCUS.'], ['Percorsi per genitori', 'genitori.html', 'genitori', 'Comunicare meglio con i figli, ogni giorno.']]],
      cta: ['Fai il Performance Test →', 'test.html', 'btn-cta-stud'], tutor: 'Parla con un tutor' },
    conc: { home: 'concorsi.html', logo: `${STAR}<span class="cma-word"><b>CONCORSI MILITARI</b><span>ACADEMY</span></span>`,
      nav: [['Concorsi', 'concorsi.html#corpi-sec', 'concorsi'], ['Metodo EAGLE', 'concorsi.html#eagle', 'eagle'], ['Simulatore', 'simulatore.html', 'simulatore'], ['Risultati', 'concorsi.html#risultati', 'risultati'], ['Sedi', 'sedi-concorsi.html', 'sedi']],
      cta: ['Test Concorsi →', 'test-concorsi.html', 'btn-cta-conc'], tutor: 'Parla con un consulente' },
  }[branch];
  // in alto a destra, il passaggio diretto all'altro marchio (al posto di "Cambia percorso")
  const OTHER = branch === 'conc' ? { name: 'Centro Studi Lambda', l1: 'Centro Studi', l2: 'Lambda', href: 'studenti.html', ic: '<svg viewBox="0 0 40 18" aria-hidden="true"><circle cx="10" cy="9" r="7"/><circle cx="30" cy="9" r="7"/><path d="M17 8q3-3 6 0"/></svg>' }
    : { name: 'Concorsi Militari Academy', l1: 'Concorsi Militari', l2: 'Academy', href: 'concorsi.html', ic: '<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M100 8 L124 76 L196 76 L138 118 L160 188 L100 146 L40 188 L62 118 L4 76 L76 76 Z"/></svg>' };
  const headerHTML = `
  <header class="hdr" id="hdr" data-hbranch="${branch}">
    <a class="logo" id="logo" href="${BR.home}" aria-label="Home">${BR.logo}</a>
    ${BR.nav.length ? `<nav class="nav" aria-label="Principale">${BR.nav.map(([t, h, id]) => `<a href="${h}"${id === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}${BR.more ? `<div class="nav-dd${BR.more[1].some((m) => m[2] === page) ? ' cur' : ''}"><button type="button" aria-expanded="false" aria-haspopup="true">${BR.more[0]}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button><div class="dd">${BR.more[1].map(([t, h, id, d]) => `<a href="${h}"${id === page ? ' aria-current="page"' : ''}><b>${t}</b><small>${d}</small></a>`).join('')}</div></div>` : ''}</nav>` : '<span class="hdr-space"></span>'}
    ${BR.cta ? `<div class="hdr-ctas"><a class="btn hdr-cta ${BR.cta[2]} magnetic" href="${BR.cta[1]}"><span class="t">${BR.cta[0]}</span></a>${BR.tutor ? `<button class="btn hdr-cta hdr-tutor magnetic" type="button" data-lead><span class="t">${BR.tutor}</span></button>` : ''}</div>` : ''}
    ${branch !== 'gate' ? `<a class="switch-branch ${branch === 'stud' ? 'to-conc' : 'to-stud'}" href="${OTHER.href}" title="Vai a ${OTHER.name}">${OTHER.ic}<span><i>${OTHER.l1}</i> <i>${OTHER.l2}</i></span></a>` : ''}
    ${BR.nav.length ? '<button class="burger" id="burger" aria-label="Apri il menu" aria-expanded="false"><i></i><i></i></button>' : ''}
  </header>
  ${BR.nav.length ? `<nav class="menu" id="menu" aria-label="Menu mobile">
    ${BR.nav.map(([t, h]) => `<a href="${h}"><span>${t}</span></a>`).join('')}
    ${BR.more ? `<div class="m-more"><small>${BR.more[0]}</small>${BR.more[1].map(([t, h]) => `<a href="${h}">${t} →</a>`).join('')}</div>` : ''}
    <div class="mt">${BR.cta ? `<a href="${BR.cta[1]}">${BR.cta[0]}</a>` : ''}${BR.tutor ? `<button type="button" data-lead>${BR.tutor}</button>` : ''}<a href="${OTHER.href}">${OTHER.name} →</a></div>
  </nav>` : ''}`;
  const col = (title, items) => `<div><h4>${title}</h4><ul>${items.map(([t, h, soon]) => `<li><a href="${h || '#'}">${t}</a>${soon ? '<span class="soon">PRESTO</span>' : ''}</li>`).join('')}</ul></div>`;
  const legal = (owner) => `<div class="legal"><span>${owner} · © ${new Date().getFullYear()} Preparazione Concorsi LTD · P.IVA: MT 3058-2802</span>
        <nav aria-label="Note legali"><a href="#">Privacy</a><a href="#">Cookie</a><a href="#">Termini</a><a href="#">Dati societari</a></nav></div>`;
  const social = `<div class="social"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="YouTube">YT</a><a href="#" aria-label="Facebook">FB</a><a href="#" aria-label="TikTok">TK</a></div>`;
  const WA_URL = 'https://chat.whatsapp.com/CHqB0h71IyQEsp2vjfAj1K?s=cl&p=i&mlu=4&ilr=4';
  const wa = `<a class="foot-wa" href="${WA_URL}" target="_blank" rel="noopener"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.5 4.9 2 .9 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg><span><b>Canale WhatsApp per genitori</b><small>Consigli sullo studio e novità Lambda</small></span></a>`;
  const TG_URL = 'https://t.me/+UqQopJvsr_5AitxG';
  const tg = `<a class="foot-wa foot-tg" href="${TG_URL}" target="_blank" rel="noopener"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M26.6 6.3 3.9 15.1c-1.5.6-1.5 1.5-.3 1.9l5.8 1.8 2.2 6.9c.3.8.5 1.1 1.1 1.1.5 0 .7-.2 1-.5l2.8-2.7 5.8 4.3c1.1.6 1.8.3 2.1-1l3.8-17.9c.4-1.6-.6-2.3-1.6-1.9zm-3.4 4.1-10.4 9.4-.4 4.3-2-6.4 12.1-7.6c.6-.3 1.1 0 .7.3z"/></svg><span><b>Community Telegram</b><small>Per chi prepara i concorsi</small></span></a>`;
  const FOOT = {
    gate: `<footer class="foot foot-gate" aria-label="Informazioni"><div class="fg-split">
        <div class="fg stud"><div class="fg-in"><div class="brand"><img src="assets/wordmark-white.png" alt="Centro Studi Lambda"><p>Metodo di studio, tutor e lezioni live per studenti di ogni età. Online, in tutta Italia.</p></div>
          <div class="fg-cols">${col('Percorsi', [['Scuola primaria', 'percorso.html?p=primaria'], ['Scuola media', 'percorso.html?p=media'], ['Scuola superiore', 'percorso.html?p=superiore'], ['Università', 'percorso.html?p=universita'], ['Metodo di studio', 'percorso.html?p=metodo-di-studio'], ['Ripetizioni', 'percorso.html?p=ripetizioni']])}
          ${col('Lambda', [['Metodo FOCUS', 'metodo-focus.html'], ['Performance Test', 'test.html'], ['Vacanze studio', 'vacanze-studio.html'], ['Percorsi per genitori', 'genitori.html'], ['Risultati', 'risultati.html'], ['Sedi', 'sedi.html'], ['Chi siamo', 'chisiamo.html']])}</div>
          <a class="fg-go" href="studenti.html">Entra in Centro Studi Lambda →</a></div></div>
        <div class="fg conc"><div class="fg-in"><div class="brand">${STAR}<p><b>Concorsi Militari Academy</b><br>La preparazione ai concorsi delle Forze Armate e di Polizia. Online, in tutta Italia.</p></div>
          <div class="fg-cols">${col('Concorsi', [['Polizia di Stato', 'corpo.html?c=polizia'], ['Carabinieri', 'corpo.html?c=carabinieri'], ['Guardia di Finanza', 'corpo.html?c=gdf'], ['Esercito', 'corpo.html?c=esercito'], ['Marina Militare', 'corpo.html?c=marina'], ['Aeronautica Militare', 'corpo.html?c=aeronautica']])}
          ${col('Academy', [['Metodo EAGLE', 'concorsi.html#eagle'], ['Test Concorsi', 'test-concorsi.html'], ['Simulatore', 'simulatore.html'], ['Sedi', 'sedi-concorsi.html'], ['Chi siamo', 'chisiamo.html'], ['Contatti', 'tel:+393514206823']])}</div>
          <a class="fg-go" href="concorsi.html">Entra in Concorsi Militari Academy →</a></div></div>
      </div><div class="foot-in fg-bottom">${social}${legal('Centro Studi Lambda · Concorsi Militari Academy')}</div></footer>`,
    stud: `<footer class="foot" aria-label="Informazioni"><div class="foot-in"><div class="foot-top">
        <div class="brand"><img src="assets/wordmark-white.png" alt="Centro Studi Lambda"><p>Metodo di studio, tutor e lezioni live. Online, in tutta Italia: per dare a ogni ragazzo gli strumenti per arrivare lontano.</p>${social}${wa}</div>
        ${col('Percorsi', [['Scuola primaria', 'percorso.html?p=primaria'], ['Scuola media', 'percorso.html?p=media'], ['Scuola superiore', 'percorso.html?p=superiore'], ['Università', 'percorso.html?p=universita'], ['Test universitari', 'percorso.html?p=test-universitari']])}
        ${col('Esigenze', [['Metodo di studio', 'percorso.html?p=metodo-di-studio'], ['Ripetizioni', 'percorso.html?p=ripetizioni'], ['Recupero insufficienze', 'percorso.html?p=recupero-insufficienze'], ['DSA/BES', 'percorso.html?p=dsa-bes'], ['Ansia scolastica', 'percorso.html?p=ansia-scolastica'], ['Memoria e concentrazione', 'percorso.html?p=memoria-concentrazione']])}
        ${col('Oltre la scuola', [['Vacanze studio a Malta', 'vacanze-studio.html'], ['Percorsi per genitori', 'genitori.html'], ['Performance Test', 'test.html'], ['Metodo FOCUS', 'metodo-focus.html'], ['La storia', 'storia.html'], ['Blog Lambda']])}
        ${col('Lambda', [['Chi siamo', 'chisiamo.html'], ['Risultati', 'risultati.html'], ['Sedi', 'sedi.html'], ['Lavora con noi'], ['Franchising'], ['Contatti', 'mailto:info@centrostudilambda.it']])}
      </div>
      <a class="foot-other conc" href="concorsi.html"><span>Prepari un concorso per le Forze Armate o di Polizia?</span><b>Concorsi Militari Academy →</b></a>
      ${legal('Centro Studi Lambda')}</div></footer>`,
    conc: `<footer class="foot foot-conc" aria-label="Informazioni"><div class="foot-in"><div class="foot-top">
        <div class="brand">${SEAL}<p><b>Concorsi Militari Academy</b><br>by Centro Studi Lambda. Preparazione ai concorsi delle Forze Armate e di Polizia, online in tutta Italia.</p>${social}${tg}</div>
        ${col('Concorsi', [['Polizia di Stato', 'corpo.html?c=polizia'], ['Carabinieri', 'corpo.html?c=carabinieri'], ['Guardia di Finanza', 'corpo.html?c=gdf'], ['Esercito', 'corpo.html?c=esercito'], ['Marina Militare', 'corpo.html?c=marina'], ['Aeronautica Militare', 'corpo.html?c=aeronautica'], ['Polizia Penitenziaria', 'corpo.html?c=penitenziaria'], ['Vigili del Fuoco', 'corpo.html?c=vvf'], ['Accademie', 'corpo.html?c=accademie']])}
        ${col('Risorse', [['Test Concorsi', 'test-concorsi.html'], ['Simulatore CMA', 'simulatore.html'], ['Metodo EAGLE', 'concorsi.html#eagle'], ['Blog CMA', '#', 1]])}
        ${col('Academy', [['Chi siamo', 'chisiamo.html'], ['Risultati', 'concorsi.html#risultati'], ['Sedi', 'sedi-concorsi.html'], ['Contatti', 'tel:+393514206823']])}
      </div>
      <a class="foot-other stud" href="studenti.html"><span>Cerchi un metodo di studio per tuo figlio?</span><b>Centro Studi Lambda →</b></a>
      ${legal('Concorsi Militari Academy')}</div></footer>`,
  }[branch];
  if ((BR.tutor || BR.lead) && !window.LambdaLead) { const sc = document.createElement('script'); sc.src = 'assets/lead.js?v=5'; document.head.appendChild(sc); }
  const headerHTML_ = headerHTML, footerHTML = FOOT;
  document.querySelector('[data-lambda-header]')?.insertAdjacentHTML('afterend', headerHTML_);
  document.querySelector('[data-lambda-header]')?.remove();
  document.querySelector('[data-lambda-footer]')?.insertAdjacentHTML('afterend', footerHTML);
  document.querySelector('[data-lambda-footer]')?.remove();
  /* ---------- "Hanno parlato di noi": banner delle testate che scorre ([data-press]) ----------
     Per aggiungere una testata basta una riga. Campi:
       k     sigla per lo stile tipografico (vedi .pl-* in lambda.css) · name  nome della testata
       html  logo ricostruito in tipografia · logo  file del logo ufficiale (es. 'assets/press/ansa.svg'): se c'è, vince sull'html
       url   link all'articolo o al servizio (facoltativo) · brand  'lambda', 'cma' o 'both': su quali pagine compare
     Nelle pagine Lambda compaiono 'lambda' e 'both', in quelle CMA 'cma' e 'both', nella home a due colonne tutte. */
  const PRESS = [
    { k: 'repubblica', name: 'La Repubblica', html: '<i>la</i> Repubblica', brand: 'both' },
    { k: 'skytg', name: 'Sky TG24', html: '<b>sky</b><span>TG24</span>', brand: 'both' },
    { k: 'ilgiorno', name: 'Il Giorno', html: 'Il Giorno', brand: 'both' },
    { k: 'studio', name: 'Studio Aperto', html: 'Studio<b>Aperto</b>', brand: 'both' },
    { k: 'tgcom', name: 'TGCOM24', html: '<b>TGCOM</b><span>24</span>', brand: 'both' },
    { k: 'ansa', name: 'ANSA', html: 'ANSA', brand: 'both' },
    { k: 'millionaire', name: 'Millionaire', html: 'millionaire', brand: 'both' },
    { k: 'radio1', name: 'Rai Radio 1', html: '<b>Rai</b> Radio<span>1</span>', brand: 'both' },
    { k: 'quotidiano', name: 'Quotidiano', html: 'Quotidiano', brand: 'both' },
    { k: 'nexteco', name: 'Next Economy', html: '<b>NEXT</b>economy', brand: 'both' },
    { k: 'millennium', name: 'Radio Millennium', html: '<span>Radio</span><b>Millennium</b>', brand: 'both' },
    { k: 'assofr', name: 'Assofranchising', html: '<b>Asso</b>franchising', brand: 'both' },
    { k: 'inblu', name: 'Radio InBlu', html: '<span>Radio</span><b>InBlu</b>', brand: 'both' },
    { k: 'express', name: 'L\'Express Franchisee', html: '<i>L\'Express</i><span>Franchisee</span>', brand: 'both' },
  ];
  document.querySelectorAll('[data-press]').forEach((el) => {
    const list = PRESS.filter((p) => branch === 'gate' || p.brand === 'both' || p.brand === (branch === 'conc' ? 'cma' : 'lambda'));
    if (!list.length) { el.remove(); return; }
    const item = (p) => { const inner = p.logo ? `<img src="${p.logo}" alt="${p.name}" loading="lazy">` : p.html;
      return `<li class="pl pl-${p.k}">${p.url ? `<a href="${p.url}" target="_blank" rel="noopener" title="${p.name}: leggi l'articolo">${inner}</a>` : inner}</li>`; };
    const row = list.map(item).join('');
    el.innerHTML = `<div class="wrap press-in"><p class="press-k">${el.dataset.press || 'Hanno parlato di noi'}</p>
      <div class="press-track"><ul class="press-row" aria-label="Testate: ${list.map((p) => p.name).join(', ')}">${row}</ul><ul class="press-row" aria-hidden="true">${row}</ul></div></div>`;
  });
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

  /* ---------------- KPI: i numeri ufficiali di Lambda e CMA, in un solo posto ----------------
     Nelle pagine: <b data-kpi="stud.docenti"></b>. Con n: null il dato non è ancora arrivato
     e al suo posto compare un segnaposto ben visibile (classe .kpi-todo). */
  L.KPI = {
    stud: {
      ore: { n: null, l: 'ore di lezione erogate al mese' },          // da inserire: numero massimo
      allievi: { n: null, pre: '+', l: 'allievi seguiti' },           // da inserire
      docenti: { n: 100, pre: '+', l: 'docenti esperti in apprendimento' },
      genitori: { n: 95, suf: '%', l: 'genitori soddisfatti' },
      autonomi: { n: 87, suf: '%', l: 'degli allievi autonomi dopo 20 giorni' },
    },
    conc: {
      allievi: { n: 5000, pre: '+', l: 'allievi seguiti' },
      prima: { n: 97, suf: '%', l: 'idonei alla prima nel 2026' },
      psico: { n: 92, suf: '%', l: 'idonei alle prove psicoattitudinali' },
      quiz: { n: 25, suf: ' mln', l: 'quiz fatti per studiare e memorizzare' },
      ore: { n: 9000, l: 'ore di lezione erogate dal 2020 al 2026' },
    },
  };
  L.kpis = (root = document) => root.querySelectorAll('[data-kpi]').forEach((el) => {
    const [b, k] = el.dataset.kpi.split('.'), K = L.KPI[b]?.[k]; if (!K) return;
    if (K.n == null) { el.textContent = '—'; el.classList.add('kpi-todo'); el.title = 'Dato da inserire'; return; }
    el.dataset.count = K.n; if (K.pre) el.dataset.pre = K.pre; if (K.suf) el.dataset.suf = K.suf;
    el.textContent = (K.pre || '') + '0' + (K.suf || '');
  });
  L.kpis();

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
  // menu a tendina "Oltre la scuola": si apre al passaggio del mouse (CSS) e al clic/tastiera
  document.querySelectorAll('.nav-dd > button').forEach((b) => { b.addEventListener('click', () => { const o = b.parentElement.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); }); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav-dd')) document.querySelectorAll('.nav-dd.open').forEach((d) => { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); }); });
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
    const cur = themed().findLast((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }); // l'ultima: le sezioni dopo stanno sopra (bordi arrotondati)
    // con data-hdr-manual è la pagina a decidere il colore dell'header (es. la storia, dopo la svolta)
    if (!body.hasAttribute('data-hdr-manual')) body.classList.toggle('light-hdr', cur?.dataset.theme === 'light');
    for (const f of L.frames) f(now, sy);
  }
  requestAnimationFrame(loop);
})();
