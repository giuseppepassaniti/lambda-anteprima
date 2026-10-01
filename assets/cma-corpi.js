/* =====================================================================
   CONCORSI MILITARI ACADEMY · i corpi e i percorsi
   Usato da: home CMA ("Scegli il tuo corpo"), pagine dei corpi, test.
   Definizioni dalla Libretta Tecnica CMA. I testi sono descrittivi: requisiti, limiti e prove precise
   cambiano a ogni bando e vanno sempre verificati sul bando ufficiale.
   I "patch" sono grafiche di Concorsi Militari Academy, non stemmi ufficiali.
   ===================================================================== */
window.CMA_CORPI = [
  { k: 'polizia', def: "Forza di Polizia · ordinamento civile (Ministero dell'Interno)", n: 'Polizia di Stato', code: 'PS', color: '#2D5DA8', tag: 'Sicurezza sul territorio',
    what: 'Prevenzione, pronto intervento, indagini: al servizio dei cittadini, nelle città e sulle strade.',
    roles: ['Agenti', 'Vice ispettori', 'Commissari'], env: ['Territorio', 'Indagini', 'Contatto con i cittadini'] },
  { k: 'carabinieri', def: "Forza Armata con compiti di polizia", n: 'Carabinieri', code: 'CC', color: '#B3243A', tag: 'Presidio in ogni comune',
    what: 'Forza armata con compiti di polizia: sicurezza del territorio, tutela dei cittadini, reparti specializzati.',
    roles: ['Allievi carabinieri', 'Allievi marescialli', 'Ufficiali'], env: ['Territorio', 'Comunità', 'Reparti speciali'] },
  { k: 'gdf', def: "Forza di Polizia a ordinamento militare (Economia e Finanze)", n: 'Guardia di Finanza', code: 'GdF', color: '#C9A227', tag: 'Economia e legalità',
    what: 'Contrasto a evasione, frodi e contrabbando: indagini economiche, controlli, anche in mare e in volo.',
    roles: ['Allievi finanzieri', 'Allievi marescialli', 'Ufficiali'], env: ['Indagini economiche', 'Controlli', 'Mare e cielo'] },
  { k: 'esercito', def: "Forza Armata · componente terrestre", n: 'Esercito', code: 'EI', color: '#6B7F3A', tag: 'Sul campo',
    what: 'Difesa, missioni in Italia e all\'estero, soccorso nelle emergenze: addestramento e spirito di squadra.',
    roles: ['Volontari', 'Allievi marescialli', 'Ufficiali'], env: ['All\'aperto', 'Missioni', 'Squadra'] },
  { k: 'marina', def: "Forza Armata · componente marina", n: 'Marina Militare', code: 'MM', color: '#22427A', tag: 'In mare',
    what: 'Navi, sommergibili, aviazione navale e soccorso in mare: una vita di bordo, tra tecnologia e mare aperto.',
    roles: ['Volontari', 'Allievi marescialli', 'Ufficiali'], env: ['Mare', 'Tecnologia', 'Navigazione'] },
  { k: 'aeronautica', def: "Forza Armata · difesa dello spazio aereo", n: 'Aeronautica Militare', code: 'AM', color: '#4A8FD6', tag: 'In volo',
    what: 'Difesa dello spazio aereo, aeroporti, tecnologia e meteorologia: per chi ha la testa tra le nuvole, con metodo.',
    roles: ['Volontari', 'Allievi marescialli', 'Ufficiali'], env: ['Volo', 'Tecnologia', 'Aeroporti'] },
  { k: 'penitenziaria', def: "Forza di Polizia · ordinamento civile (Ministero della Giustizia)", n: 'Polizia Penitenziaria', code: 'PP', color: '#4E6488', tag: 'Sicurezza e rieducazione',
    what: 'Sicurezza degli istituti, traduzioni, percorsi di rieducazione: un ruolo di responsabilità e di equilibrio.',
    roles: ['Allievi agenti', 'Vice ispettori', 'Commissari'], env: ['Istituti', 'Sicurezza', 'Relazione'] },
  { k: 'vvf', def: 'Corpo Nazionale dei Vigili del Fuoco · soccorso pubblico', n: 'Vigili del Fuoco', code: 'VVF', color: '#D9541E', tag: 'Soccorso e protezione',
    what: 'Soccorso tecnico urgente, incendi, emergenze e protezione civile: un ruolo operativo, fisico e di squadra.',
    roles: ['Allievi Vigili del Fuoco'], env: ['Soccorso', 'Squadra', 'Emergenze'] },
  { k: 'accademie', def: "Percorsi per diventare ufficiale", n: 'Accademie', code: 'ACC', color: '#C8A14A', tag: 'Diventare ufficiale',
    what: 'I percorsi per diventare ufficiale nelle Forze Armate e di Polizia: formazione universitaria e comando.',
    roles: ['Esercito', 'Marina', 'Aeronautica', 'Carabinieri', 'Guardia di Finanza'], env: ['Comando', 'Studio', 'Leadership'] },
];
/** il "patch": una toppa ricamata con la sigla del corpo, nei colori del corpo (grafica CMA) */
window.CMA_PATCH = (c, size = 120) => `<svg class="patch" viewBox="0 0 120 140" width="${size}" aria-hidden="true">
  <path d="M60 4 L112 22 V70 C112 104 88 126 60 136 C32 126 8 104 8 70 V22 Z" fill="${c.color}"/>
  <path d="M60 4 L112 22 V70 C112 104 88 126 60 136 C32 126 8 104 8 70 V22 Z" fill="url(#pg)" opacity=".35"/>
  <path d="M60 12 L104 27 V70 C104 99 84 118 60 127 C36 118 16 99 16 70 V27 Z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.6" stroke-dasharray="3 3"/>
  <path d="M8 58 L112 40 V52 L8 70 Z" fill="rgba(255,255,255,.14)"/>
  <text x="60" y="${c.code.length > 2 ? 86 : 90}" text-anchor="middle" font-family="'Space Mono', monospace" font-weight="700" font-size="${c.code.length > 2 ? 30 : 40}" fill="#fff" letter-spacing="2">${c.code}</text>
  <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient></defs></svg>`;
