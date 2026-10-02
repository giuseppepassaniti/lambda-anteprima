/* =====================================================================
   LAMBDA · "Ti riconosci?" — card orizzontali + pop-up educativo (condiviso)
   Obiettivo: consapevolezza, non vendita. Ogni difficoltà: la frase del genitore,
   cosa succede davvero, perché "di più" non basta, una curiosità.
   Le animazioni sono provvisorie: andranno sostituite dai motion graphic.

   Uso:  LambdaPains.mount({ track: '#pTrack', prev: '#pPrev', next: '#pNext', data: [...] })
   data: [{ a: 'curve', t: 'Titolo breve', q: 'Frase del genitore', real, mythT, myth, fact }]
   a (animazione): curve · read · slow · focus · week · heart · grades · battery · alone · storm · bored · bag
   ===================================================================== */
(() => {
  const range = (n) => [...Array(n).keys()];
  const ANIM = {
    curve: '<svg viewBox="0 0 200 120"><path class="pain-ax" d="M20 10V100H190"/><path class="cv" d="M22 18 C40 70 70 86 110 92 S170 96 186 97"/><circle class="dt" cx="22" cy="18" r="5"/><text x="24" y="114">giorni</text><text x="150" y="30">ricordo</text></svg>',
    read: '<svg viewBox="0 0 200 120"><g class="wd"><rect x="18" y="20" width="44" height="14" rx="7"/><rect x="120" y="14" width="58" height="14" rx="7"/><rect x="40" y="58" width="36" height="14" rx="7"/><rect x="98" y="52" width="48" height="14" rx="7"/><rect x="26" y="92" width="54" height="14" rx="7"/><rect x="112" y="90" width="40" height="14" rx="7"/></g><text class="qm" x="96" y="86">?</text></svg>',
    slow: '<svg viewBox="0 0 200 120"><g class="ln"><rect x="20" y="20" width="160" height="6" rx="3"/><rect x="20" y="38" width="150" height="6" rx="3"/><rect x="20" y="56" width="160" height="6" rx="3"/><rect x="20" y="74" width="120" height="6" rx="3"/></g><rect class="eye" x="20" y="16" width="26" height="14" rx="7"/><circle class="clk" cx="168" cy="98" r="14"/><path class="hand" d="M168 98V88"/></svg>',
    focus: '<svg viewBox="0 0 200 120"><rect class="bar0" x="20" y="70" width="160" height="12" rx="6"/><rect class="bar" x="20" y="70" width="160" height="12" rx="6"/><g class="nt"><rect x="118" y="20" width="62" height="30" rx="10"/><circle cx="133" cy="35" r="5"/><rect x="143" y="31" width="28" height="4" rx="2"/><rect x="143" y="38" width="18" height="4" rx="2"/></g><text x="20" y="104">concentrazione</text></svg>',
    week: '<svg viewBox="0 0 200 120"><g class="cols">' + range(7).map((d) => `<rect x="${16 + d * 25}" y="20" width="20" height="84" rx="5"/>`).join('') + '</g><g class="tk">' + range(5).map((k) => `<rect class="t${k}" x="${16 + k * 25 + 2}" y="26" width="16" height="10" rx="3"/>`).join('') + '</g><text x="160" y="116">verifica</text></svg>',
    heart: '<svg viewBox="0 0 200 120"><path class="ecg" d="M10 70H50L58 60L66 70H80L90 20L100 108L110 50L118 70H140L148 62L156 70H190"/></svg>',
    grades: '<svg viewBox="0 0 200 120"><path class="pain-ax" d="M20 10V100H190"/>' + [7, 6.5, 6, 5, 4.5].map((v, k) => `<rect class="gb g${k}" x="${34 + k * 30}" y="${100 - v * 11}" width="18" height="${v * 11}" rx="4"/>`).join('') + '<path class="six" d="M20 34H190"/><text x="160" y="30">6</text></svg>',
    battery: '<svg viewBox="0 0 200 120"><rect class="bo" x="40" y="34" width="110" height="52" rx="10"/><rect class="bt" x="150" y="50" width="10" height="20" rx="3"/><rect class="lv" x="48" y="42" width="94" height="36" rx="5"/></svg>',
    // per i più piccoli
    alone: '<svg viewBox="0 0 200 120"><rect class="dk" x="30" y="72" width="140" height="8" rx="4"/><circle class="kid" cx="80" cy="52" r="12"/><rect class="kidb" x="68" y="64" width="24" height="10" rx="5"/><g class="mom"><circle cx="130" cy="44" r="13"/><rect x="117" y="57" width="26" height="17" rx="6"/></g><text x="40" y="104">ore accanto</text><path class="tick" d="M160 20a10 10 0 1 1 -1 0"/></svg>',
    storm: '<svg viewBox="0 0 200 120"><g class="cloud"><circle cx="86" cy="44" r="18"/><circle cx="110" cy="38" r="22"/><circle cx="132" cy="48" r="16"/><rect x="74" y="44" width="72" height="20" rx="10"/></g><path class="bolt" d="M108 64l-10 18h12l-8 18"/><g class="drops"><rect x="80" y="74" width="3" height="10" rx="1.5"/><rect x="130" y="76" width="3" height="10" rx="1.5"/><rect x="92" y="86" width="3" height="10" rx="1.5"/></g></svg>',
    bored: '<svg viewBox="0 0 200 120"><circle class="face" cx="100" cy="58" r="34"/><path class="eyeL" d="M84 52h10"/><path class="eyeR" d="M106 52h10"/><path class="mouth" d="M88 76h24"/><g class="zz"><text x="138" y="34">z</text><text x="150" y="22">z</text></g></svg>',
    bag: '<svg viewBox="0 0 200 120"><rect class="bg" x="62" y="40" width="76" height="62" rx="12"/><path class="hd" d="M84 40v-8a16 16 0 0 1 32 0v8"/><g class="out"><rect class="b1" x="72" y="50" width="22" height="30" rx="3"/><rect class="b2" x="100" y="48" width="18" height="28" rx="3"/><circle class="b3" cx="128" cy="58" r="6"/></g></svg>',
  };
  let modal = null, cur = 0, data = [], lastFocus = null;
  const L = () => window.Lambda || {};
  const reduced = () => !!L().reduced;

  function ensureModal() {
    if (modal) return modal;
    document.body.insertAdjacentHTML('beforeend', `<div class="pmodal" id="pModal" role="dialog" aria-modal="true" aria-labelledby="pmT" hidden>
      <div class="pm-back" data-close></div>
      <article class="pm-card"><button class="pm-x" type="button" data-close aria-label="Chiudi">×</button>
        <div class="pm-anim" id="pmAnim" aria-hidden="true"></div>
        <div class="pm-body"><p class="pm-k" id="pmK"></p><h3 id="pmT"></h3>
          <div class="pm-blk"><small>Cosa succede davvero</small><p id="pmReal"></p></div>
          <div class="pm-blk"><small id="pmMythT"></small><p id="pmMyth"></p></div>
          <div class="pm-fact"><small>Lo sapevi?</small><p id="pmFact"></p></div>
          <div class="pm-nav"><button type="button" id="pmPrev">← Precedente</button><span id="pmN"></span><button type="button" id="pmNext">Successivo →</button></div></div>
      </article></div>`);
    modal = document.getElementById('pModal');
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    modal.querySelector('#pmPrev').addEventListener('click', () => fill(cur - 1));
    modal.querySelector('#pmNext').addEventListener('click', () => fill(cur + 1));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
    return modal;
  }
  const $m = (id) => modal.querySelector('#' + id);
  function fill(i) {
    cur = (i + data.length) % data.length; const p = data[cur];
    const a = $m('pmAnim'); a.className = 'pm-anim a-' + p.a; a.innerHTML = ANIM[p.a] || '';
    $m('pmK').textContent = `${String(cur + 1).padStart(2, '0')} · ${p.t}`; $m('pmT').textContent = `“${p.q}”`;
    $m('pmReal').textContent = p.real; $m('pmMythT').textContent = p.mythT; $m('pmMyth').textContent = p.myth; $m('pmFact').textContent = p.fact;
    $m('pmN').textContent = `${cur + 1} / ${data.length}`;
    if (!reduced() && window.gsap) gsap.fromTo(modal.querySelectorAll('.pm-body > *'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' });
  }
  function open(i) {
    ensureModal(); lastFocus = document.activeElement; fill(i); modal.hidden = false; document.body.classList.add('modal-on'); L().lenis?.stop();
    if (!reduced() && window.gsap) { gsap.fromTo(modal.querySelector('.pm-back'), { opacity: 0 }, { opacity: 1, duration: 0.35 }); gsap.fromTo(modal.querySelector('.pm-card'), { y: 40, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'expo.out' }); }
    modal.querySelector('.pm-x').focus();
  }
  function close() { modal.hidden = true; document.body.classList.remove('modal-on'); L().lenis?.start(); lastFocus?.focus(); }

  function mount({ track, prev, next, data: d }) {
    const tr = typeof track === 'string' ? document.querySelector(track) : track; if (!tr || !d?.length) return;
    data = d; ensureModal();
    tr.innerHTML = d.map((p, i) => `<button class="pain-card" type="button" role="listitem" data-i="${i}" aria-haspopup="dialog"><span class="pain-anim a-${p.a}" aria-hidden="true">${ANIM[p.a] || ''}</span><span class="pain-num">${String(i + 1).padStart(2, '0')}</span><q>${p.q}</q><span class="pain-tag">${p.t}</span><span class="pain-why">Capisci perché <i>→</i></span></button>`).join('');
    const step = () => (tr.querySelector('.pain-card')?.offsetWidth || 320) + 16;
    document.querySelector(prev)?.addEventListener('click', () => tr.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
    document.querySelector(next)?.addEventListener('click', () => tr.scrollBy({ left: step() * 2, behavior: 'smooth' }));
    let drag = null, justDragged = false;
    tr.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, l: tr.scrollLeft, moved: false }; });
    addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 5) { drag.moved = true; tr.classList.add('dragging'); } tr.scrollLeft = drag.l - dx; });
    addEventListener('pointerup', () => { if (!drag) return; justDragged = drag.moved; drag = null; setTimeout(() => tr.classList.remove('dragging'), 0); });
    tr.addEventListener('click', (e) => { const b = e.target.closest('.pain-card'); if (!b) return; if (justDragged) { justDragged = false; return; } open(+b.dataset.i); });
  }
  window.LambdaPains = { mount, open, ANIM };
})();
