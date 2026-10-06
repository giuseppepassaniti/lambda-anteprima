/* =====================================================================
   LAMBDA · modulo "Parla con un tutor" / CMA "Parla con un consulente" (condiviso)
   Qualsiasi elemento con [data-lead] apre il modulo. Nome, telefono ed email obbligatori.
   Prototipo: i dati non vengono inviati (vedi TODO).
   ===================================================================== */
(() => {
  if (window.LambdaLead) return; // già caricato
  let ld = null, lastFocus = null;
  const L = () => window.Lambda || {};
  const CMA = document.body.dataset.branch === 'conc';
  const T = CMA ? {
    ey: 'Parla con un consulente', sub: 'Lascia i tuoi contatti: un consulente CMA ti contatta entro un giorno lavorativo.',
    selL: 'Concorso che ti interessa', sel: ['Polizia di Stato', 'Carabinieri', 'Guardia di Finanza', 'Esercito', 'Marina Militare', 'Aeronautica Militare', 'Polizia Penitenziaria', 'Vigili del Fuoco', 'Accademie', 'Non lo so ancora'],
    ph: 'Per esempio: ho già provato la preselettiva e voglio superarla', btn: 'btn-red',
    ok: 'Un consulente CMA ti contatta presto. Intanto, se vuoi, puoi fare il Test Concorsi: al colloquio avrete già il tuo profilo.', okBtn: ['Fai il Test Concorsi →', 'test-concorsi.html#inizia'], tick: '#CD141F',
  } : {
    ey: 'Parla con un tutor', sub: 'Lascia i tuoi contatti: un tutor Lambda ti contatta entro un giorno lavorativo.',
    selL: 'Classe o età di tuo figlio', sel: ['Scuola primaria', 'Scuola media', 'Scuola superiore', 'Università', 'Medicina (semestre filtro)'],
    ph: 'Per esempio: studia tanto ma i voti non arrivano', btn: 'btn-stud',
    ok: 'Un tutor ti contatta presto. Intanto, se vuoi, puoi fare il Performance Test: in videochiamata avrete già il suo profilo.', okBtn: ['Fai il Performance Test →', 'test.html'], tick: '#FFD66B',
  };
  function build() {
    if (ld) return ld;
    document.body.insertAdjacentHTML('beforeend', `<div class="ldm${CMA ? ' cma' : ''}" id="leadModal" role="dialog" aria-modal="true" aria-labelledby="ldT" hidden>
    <div class="pm-back" data-lclose></div>
    <div class="ld-card"><button class="pm-x" type="button" data-lclose aria-label="Chiudi">×</button>
      <form id="ldForm" novalidate>
        <p class="eyebrow">${T.ey}</p>
        <h3 id="ldT">Ti richiamiamo noi.</h3>
        <p class="ld-sub">${T.sub}</p>
        <label class="ldf"><span>Nome *</span><input id="ldName" type="text" autocomplete="name" required></label>
        <div class="row2"><label class="ldf"><span>Telefono / WhatsApp *</span><input id="ldTel" type="tel" autocomplete="tel" inputmode="tel" required></label>
          <label class="ldf"><span>Email *</span><input id="ldMail" type="email" autocomplete="email" required></label></div>
        <label class="ldf"><span>${T.selL}</span><select id="ldAge"><option value="">Seleziona</option>${T.sel.map((o) => `<option>${o}</option>`).join('')}</select></label>
        <label class="ldf"><span>Di cosa vorresti parlare?</span><textarea id="ldMsg" rows="3" placeholder="${T.ph}"></textarea></label>
        <label class="ld-chk"><input type="checkbox" id="ldOk"><span>Ho letto l'informativa privacy e acconsento a essere ricontattato.</span></label>
        <p class="ld-err" id="ldErr" aria-live="polite"></p>
        <button class="btn ${T.btn}" type="submit"><span class="t">Richiedi il contatto →</span></button>
      </form>
      <div class="ld-ok" aria-live="polite"><svg viewBox="0 0 60 60" width="60" aria-hidden="true"><circle cx="30" cy="30" r="27" fill="none" stroke="${T.tick}" stroke-width="3"/><path d="M18 31l8 8 16-17" fill="none" stroke="${T.tick}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><b>Richiesta inviata!</b><p>${T.ok}</p><a class="btn ${T.btn}" href="${T.okBtn[1]}"><span class="t">${T.okBtn[0]}</span></a></div>
    </div></div>`);
    ld = document.getElementById('leadModal');
    const $ = (id) => ld.querySelector('#' + id), form = $('ldForm');
    ld.addEventListener('click', (e) => { if (e.target.closest('[data-lclose]')) close(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ld.hidden) close(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = [], tel = $('ldTel').value.replace(/\D/g, ''), mail = $('ldMail').value.trim();
      if (!$('ldName').value.trim()) err.push('il nome');
      if (tel.length < 8) err.push('un numero di telefono valido');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) err.push('un\'email valida');
      if (!$('ldOk').checked) err.push('il consenso privacy');
      $('ldErr').textContent = err.length ? 'Manca ' + err.join(', ').replace(/, ([^,]*)$/, ' e $1') + '.' : '';
      $('ldName').classList.toggle('bad', !$('ldName').value.trim()); $('ldTel').classList.toggle('bad', tel.length < 8 && !!err.length); $('ldMail').classList.toggle('bad', !!err.length && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail));
      if (err.length) return;
      /* TODO: collegare al CRM (nome, telefono, email, classe, messaggio, pagina di provenienza) */
      ld.classList.add('sent');
    });
    return ld;
  }
  function open(preset) {
    build(); if (document.body.classList.contains('menu-open')) { document.body.classList.remove('menu-open'); document.getElementById('burger')?.setAttribute('aria-expanded', 'false'); }
    lastFocus = document.activeElement; ld.hidden = false; ld.classList.remove('sent'); document.body.classList.add('modal-on'); L().lenis?.stop();
    if (preset) { const s = ld.querySelector('#ldAge'), m = ld.querySelector('#ldMsg'); let hit = false; [...s.options].forEach((o) => { if (o.text === preset) { s.value = o.text; hit = true; } });
      // un prodotto (es. "Vacanze studio a Malta") va nel messaggio, se non è una delle opzioni
      if (!hit && !m.value) m.value = `Mi interessa: ${preset}`; }
    if (!L().reduced && window.gsap) gsap.fromTo(ld.querySelector('.ld-card'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out' });
    setTimeout(() => ld.querySelector('#ldName').focus(), 50);
  }
  function close() { ld.hidden = true; document.body.classList.remove('modal-on'); L().lenis?.start(); lastFocus?.focus(); }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-lead]'); if (!b) return; e.preventDefault(); open(b.dataset.lead || ''); });
  window.LambdaLead = { open };
})();
