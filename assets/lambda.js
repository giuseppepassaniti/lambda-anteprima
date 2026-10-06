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
    gate: { home: 'index.html', logo: `${ICON}<img class="wordmark" src="assets/wordmark-white.png" alt="Centro Studi Lambda">`, nav: [], cta: null, lead: true },
    stud: { home: 'studenti.html', logo: `${ICON}<img class="wordmark" src="assets/wordmark-white.png" alt="Centro Studi Lambda">`,
      nav: [['Percorsi', 'studenti.html#percorsi', 'percorsi'], ['Metodo FOCUS', 'metodo-focus.html', 'focus'], ['Risultati', 'risultati.html', 'risultati'], ['Sedi', 'sedi.html', 'sedi']],
      // menu a tendina "Oltre la scuola" (tolto dal menu su richiesta: le due pagine restano nel footer e nella home studenti)
      moreOff: ['Oltre la scuola', [['Vacanze studio a Malta', 'vacanze-studio.html', 'vacanze', 'Inglese, college ed escursioni. Anche con il Metodo FOCUS.'], ['Percorsi per genitori', 'genitori.html', 'genitori', 'Comunicare meglio con i figli, ogni giorno.']]],
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
  /* ---------------- FOOTER: uno solo per tutto il sito (soglia, Lambda, CMA) ----------------
     Dati societari, contatti e social dal sito attuale di Centro Studi Lambda. */
  const CO = { name: 'Preparazione Concorsi LTD', vat: 'MT 3058-2802', tel: '+39 351 420 6823', telH: 'tel:+393514206823',
    mail: branch === 'conc' ? 'info@concorsimilitariacademy.it' : 'info@centrostudilambda.it',
    privacy: 'https://www.iubenda.com/privacy-policy/14965751', cookie: 'https://www.iubenda.com/privacy-policy/14965751/cookie-policy', blog: 'https://centrostudilambda.it/blog/' };
  const IC = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
    yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor" stroke="none"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4.5h-3c-2.5 0-4 1.6-4 4V11H7.5v3.5H10V21h3.6v-6.5h3l.5-3.5h-3.5V8.8c0-.5.3-.8.8-.8z" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  };
  const IG_L = ['https://www.instagram.com/centro_studi_lambda_/', 'Instagram Centro Studi Lambda'], IG_C = ['https://www.instagram.com/concorsi_militari_academy/', 'Instagram Concorsi Militari Academy'];
  const socs = [...(branch === 'conc' ? [IG_C] : branch === 'stud' ? [IG_L] : [IG_L, IG_C]).map(([h, l]) => [h, l, IC.ig]), ['https://www.youtube.com/@centro_studi_lambda', 'YouTube', IC.yt], ['https://www.facebook.com/profile.php?id=61566760292485', 'Facebook', IC.fb]];
  const fcol = (title, cls, items) => `<div class="ft-col ${cls}"><h4>${title}</h4><ul>${items.map(([t, h]) => `<li><a href="${h}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ''}>${t}</a></li>`).join('')}</ul></div>`;
  const FCOLS = [
    fcol('Studenti e famiglie<small>Centro Studi Lambda</small>', 'stud', [['Scuola primaria', 'percorso.html?p=primaria'], ['Scuola media', 'percorso.html?p=media'], ['Scuola superiore', 'percorso.html?p=superiore'], ['Università', 'percorso.html?p=universita'], ['Medicina · semestre filtro', 'percorso.html?p=test-universitari'], ['DSA e BES', 'percorso.html?p=dsa-bes'], ['Tutti i percorsi', 'studenti.html#percorsi'], ['Vacanze studio a Malta', 'vacanze-studio.html'], ['Percorsi per genitori', 'genitori.html'], ['Risultati studenti', 'risultati.html'], ['Sedi Lambda', 'sedi.html'], ['Blog Lambda', CO.blog]]),
    fcol('Forze Armate e Polizia<small>Concorsi Militari Academy</small>', 'conc', [['Polizia di Stato', 'corpo.html?c=polizia'], ['Carabinieri', 'corpo.html?c=carabinieri'], ['Guardia di Finanza', 'corpo.html?c=gdf'], ['Esercito', 'corpo.html?c=esercito'], ['Marina Militare', 'corpo.html?c=marina'], ['Aeronautica Militare', 'corpo.html?c=aeronautica'], ['Polizia Penitenziaria', 'corpo.html?c=penitenziaria'], ['Vigili del Fuoco', 'corpo.html?c=vvf'], ['Accademie', 'corpo.html?c=accademie'], ['Tutti i concorsi', 'concorsi.html#corpi-sec'], ['Risultati concorsi', 'concorsi.html#risultati'], ['Sedi CMA', 'sedi-concorsi.html']]),
    fcol('Il nostro metodo<small>Strumenti e test</small>', 'meth', [['Metodo FOCUS', 'metodo-focus.html'], ['Metodo EAGLE', 'concorsi.html#eagle'], ['Performance Test', 'test.html'], ['Test Concorsi', 'test-concorsi.html'], ['Simulatore CMA', 'simulatore.html'], ['Come funziona', 'studenti.html#come'], ['La nostra storia', 'storia.html'], ['Domande frequenti', 'studenti.html#faq']]),
    fcol('Il gruppo<small>Lambda e CMA</small>', 'grp', [['Chi siamo', 'chisiamo.html'], ['Le nostre sedi', 'sedi.html'], ['Contatti', 'contatti.html'], ['Lavora con noi', 'lavora-con-noi.html'], ['Franchising', 'franchising.html'], ['Press e media', 'press.html']]),
  ];
  const FKPI = [
    ['<b>4,9/5</b><span>su Trustpilot · 350+ recensioni</span>', 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z'],
    ['<b data-kpi="stud.docenti"></b><span>docenti esperti in apprendimento</span>', 'M3 9l9-5 9 5-9 5zM7 11.5v4.5c3 2 7 2 10 0v-4.5M21 9v6'],
    ['<b data-kpi="stud.genitori"></b><span>genitori soddisfatti</span>', 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z'],
    ['<b data-kpi="conc.prima"></b><span>allievi CMA idonei alla prima prova nel 2026</span>', 'M5 21h14M8 21v-4h8v4M12 13a5 5 0 0 0 5-5V3H7v5a5 5 0 0 0 5 5zM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3'],
    ['<b>Sedi in Italia</b><span>e online, ovunque tu sia</span>', 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z'],
  ];
  const brandTop = branch === 'conc' ? `<a class="ft-logo mk-cma" href="concorsi.html">${SEAL}<span class="cma-word"><b>CONCORSI MILITARI</b><span>ACADEMY</span></span></a>` : `<a class="ft-logo" href="${branch === 'gate' ? 'index.html' : 'studenti.html'}"><img src="assets/wordmark-white.png" alt="Centro Studi Lambda"></a>`;
  const FOOT = `<footer class="ft ft-${branch}" aria-label="Informazioni">
    <div class="ft-in">
      <div class="ft-top">
        <div class="ft-brand">${brandTop}
          <p>Un metodo, due percorsi. La stessa visione: dare a ogni persona gli strumenti per costruire il proprio futuro.</p>
          <div class="ft-soc">${socs.map(([h, l, ic]) => `<a href="${h}" target="_blank" rel="noopener" aria-label="${l}">${ic}</a>`).join('')}</div>
          <ul class="ft-contact"><li><a href="mailto:${CO.mail}">${IC.mail}${CO.mail}</a></li><li><a href="${CO.telH}">${IC.tel}${CO.tel}</a></li></ul>
          ${branch === 'stud' ? wa : branch === 'conc' ? tg : ''}
        </div>
        <div class="ft-cols">${FCOLS.join('')}</div>
        <form class="ft-news" novalidate>
          <p class="ft-k">Resta aggiornato</p>
          <h3>Consigli di studio, novità sui concorsi e storie di successo.</h3>
          <p class="ft-sub">Iscriviti alla newsletter: contenuti utili, eventi e aggiornamenti da Lambda e CMA.</p>
          <div class="ft-field"><label class="sr" for="ftMail">La tua email</label><input id="ftMail" type="email" autocomplete="email" placeholder="La tua email" required><button type="submit">Iscriviti →</button></div>
          <div class="ft-chk"><label><input type="checkbox" name="l"${branch !== 'conc' ? ' checked' : ''}><span>Per studenti e famiglie (Lambda)</span></label><label><input type="checkbox" name="c"${branch !== 'stud' ? ' checked' : ''}><span>Sui concorsi (CMA)</span></label></div>
          <label class="ft-ok"><input type="checkbox" name="p"><span>Acconsento al trattamento dei dati secondo la <a href="${CO.privacy}" target="_blank" rel="noopener">privacy policy</a>.</span></label>
          <p class="ft-msg" aria-live="polite"></p>
        </form>
      </div>
      <div class="ft-kpi" data-count-group>${FKPI.map(([t, d]) => `<div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg><p>${t}</p></div>`).join('')}</div>
      <div class="ft-bottom">
        <p class="ft-co">© ${new Date().getFullYear()} ${CO.name} · P.IVA ${CO.vat}<br>Tutti i diritti riservati.</p>
        <nav aria-label="Note legali"><a href="${CO.privacy}" target="_blank" rel="noopener">Privacy</a><a href="${CO.cookie}" target="_blank" rel="noopener">Cookie</a><a href="dati-societari.html">Dati societari</a><a href="mappa-del-sito.html">Mappa del sito</a><a href="lavora-con-noi.html">Lavora con noi</a><a href="contatti.html">Contatti</a></nav>
        <div class="ft-marks"><a href="studenti.html" aria-label="Centro Studi Lambda"><img src="assets/wordmark-white.png" alt=""></a><i></i><a class="mk-cma" href="concorsi.html" aria-label="Concorsi Militari Academy">${STAR}<span class="cma-word"><b>CONCORSI MILITARI</b><span>ACADEMY</span></span></a></div>
      </div>
    </div>
  </footer>`;
  if ((BR.tutor || BR.lead) && !window.LambdaLead) { const sc = document.createElement('script'); sc.src = 'assets/lead.js?v=6'; document.head.appendChild(sc); }
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
  L.PRESS = PRESS;
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
  // titoli con gradiente sulle parole (.ih h1 em): ogni parola mostra il suo pezzo del gradiente della riga
  const gradWords = () => document.querySelectorAll('.ih h1 em').forEach((em) => { const r0 = em.getBoundingClientRect();
    em.querySelectorAll('.word > span').forEach((w) => { const r = w.getBoundingClientRect(); w.style.backgroundSize = `${r0.width}px 100%`; w.style.backgroundPosition = `${r0.left - r.left}px 0`; }); });
  gradWords(); addEventListener('resize', gradWords); document.fonts?.ready.then(gradWords);
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
  // newsletter del footer (prototipo: i dati non vengono inviati)
  document.querySelectorAll('.ft-news').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault(); const m = f.querySelector('.ft-msg'), mail = f.querySelector('input[type=email]').value.trim();
    const err = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? 'Inserisci un\'email valida.' : !f.l.checked && !f.c.checked ? 'Scegli almeno un argomento.' : !f.p.checked ? 'Serve il consenso alla privacy.' : '';
    m.classList.toggle('bad', !!err); if (err) { m.textContent = err; return; }
    /* TODO: collegare al servizio newsletter (email, argomenti scelti, pagina di provenienza) */
    m.textContent = 'Grazie! Ti scriveremo presto.'; f.reset();
  }));
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
