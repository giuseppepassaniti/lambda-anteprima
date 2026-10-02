/* =====================================================================
   LAMBDA · contenuti delle sottopagine (percorso.html?p=slug)
   - REG: tutte le pagine (nome, tipo, slogan) → link, menu, correlati
   - PAGES: contenuto completo. Una pagina senza contenuto mostra
     l'anteprima "in preparazione" con lo stesso stile.
   Per aggiungere una pagina: copiare un blocco di PAGES e cambiare i testi.
   ===================================================================== */
/* recensioni Trustpilot citate sul sito (testo identico alla home) */
const R = {
  silvia: ['La vedo più tranquilla, motivata ed organizzata nello studio.', 'Silvia'],
  elisabetta: ['Mio figlio aveva tre debiti, in 2 mesi ha superato i debiti.', 'Elisabetta V.'],
  fabio: ['Ho visto in mio figlio una scintilla di entusiasmo.', 'Fabio T.'],
  simona: ['Ha superato i debiti in modo soddisfacente e recuperato autostima.', 'Simona'],
  irene: ['Mio figlio non solo è cresciuto scolasticamente ma anche come persona.', 'Irene L. M.'],
};
window.PERCORSI = {
  REVIEWS: R,
  REG: {
    'primaria':               { kind: 'età', name: 'Scuola primaria', age: '6–10 anni', tag: 'Imparare a studiare prima che studiare diventi difficile.' },
    'media':                  { kind: 'età', name: 'Scuola media', age: '11–13 anni', tag: 'Alle medie cambia tutto. È qui che si costruisce il metodo.' },
    'superiore':              { kind: 'età', name: 'Scuola superiore', age: '14–18 anni', tag: 'Non basta studiare di più. Serve studiare meglio.' },
    'universita':             { kind: 'età', name: 'Università', age: '19+ anni', tag: 'Più autonomia, più organizzazione, un metodo per gli esami.' },
    'test-universitari':      { kind: 'età', name: 'Test universitari', age: 'Test d\'accesso', tag: 'Preparazione mirata ai test d\'accesso.' },
    'metodo-di-studio':       { kind: 'esigenza', name: 'Metodo di studio', tag: 'Meno ore sui libri, più risultati.' },
    'ripetizioni':            { kind: 'esigenza', name: 'Ripetizioni', tag: 'Recuperare la materia, e intanto imparare a studiarla.' },
    'recupero-insufficienze': { kind: 'esigenza', name: 'Recupero insufficienze', tag: 'Un piano chiaro per tornare alla sufficienza, e restarci.' },
    'dsa-bes':                { kind: 'esigenza', name: 'DSA/BES', tag: 'Strumenti su misura per chi impara in modo diverso.' },
    'autonomia':              { kind: 'esigenza', name: 'Autonomia nello studio', tag: 'Studiare da solo, senza un genitore accanto.' },
    'memoria-concentrazione': { kind: 'esigenza', name: 'Memoria e concentrazione', tag: 'Ricordare di più, distrarsi di meno.' },
    'organizzazione':         { kind: 'esigenza', name: 'Organizzazione', tag: 'Un piano per la settimana, e pomeriggi che finiscono.' },
    'ansia-scolastica':       { kind: 'esigenza', name: 'Ansia scolastica', tag: 'Sa le cose, ma quando conta si blocca.' },
  },

  PAGES: {
    /* ---------------------------------------------------------------- */
    'superiore': {
      accent: 'aqua',
      eyebrow: 'Scuola superiore · 14–18 anni',
      title: 'Non basta studiare di più. <em>Serve studiare meglio.</em>',
      lead: 'Alle superiori le materie si moltiplicano e i programmi corrono: il metodo delle medie non basta più. Con il Metodo FOCUS, docenti certificati e una tutor personale, tuo figlio impara a studiare in meno tempo, con risultati che si vedono.',
      quote: 'Passa tutto il pomeriggio sui libri. Ma i voti non arrivano.',
      lens: ['studiare di più', 'studiare meglio'],
      signs: ['Passa ore sui libri, ma i voti non salgono', 'Si riduce sempre all\'ultimo giorno', 'Il giorno dopo la verifica ha già dimenticato tutto', 'Ha una o più materie a rischio debito', 'Non sa più da dove cominciare'],
      before: { time: '21:30', items: ['Pomeriggi infiniti, fino a sera', 'Ripete a memoria, parola per parola', 'Verifiche preparate la notte prima', 'A cena si discute di voti'] },
      after: { time: '18:00', items: ['Un piano chiaro: finisce presto', 'Mappe e sintesi fatte da lui', 'Ripasso distribuito nella settimana', 'A cena si parla d\'altro'] },
      focus: { 1: 'Un piano settimanale che tiene conto di verifiche, interrogazioni e sport.', 2: 'Lettura attiva e sintesi: capisce il testo invece di impararlo a memoria.', 3: 'Mappe, lettura veloce e tecniche di memoria per i programmi lunghi.' },
      includes: ['tutor', 'live', 'aule', 'lab', 'ripetizioni', 'report'],
      review: R.irene,
      faq: [
        ['Fate anche ripetizioni nelle singole materie?', 'Sì. Nelle materie critiche i nostri docenti fanno ripetizioni applicando il metodo: così recupera la materia e, intanto, impara a studiarla da solo.'],
        ['Quanto tempo serve per vedere i risultati?', 'Di solito le prime differenze si vedono nell\'organizzazione già nelle prime settimane. Sui voti dipende dal punto di partenza: il tutor vi dà obiettivi e tempi chiari fin dalla consegna del test.'],
        ['Le lezioni sono online: funziona davvero?', 'Sì: le lezioni sono live e individuali, con un docente che lo conosce per nome. In più niente spostamenti: il tempo risparmiato diventa tempo libero.'],
        ['E se ha già debiti a fine anno?', 'Costruiamo un piano estivo mirato sulle materie da recuperare, con verifiche di allenamento prima dell\'esame di settembre.'],
      ],
      related: ['recupero-insufficienze', 'metodo-di-studio', 'organizzazione', 'ripetizioni'],
    },

    /* ---------------------------------------------------------------- */
    'ansia-scolastica': {
      accent: 'coral',
      eyebrow: 'Esigenza · Ansia scolastica',
      title: 'Sa le cose. <em>Ma quando conta, si blocca.</em>',
      lead: 'L\'ansia da verifica non è mancanza di impegno. È una reazione che si può allenare: con un metodo che dà sicurezza e un tutor che gli insegna a esporre, la paura lascia spazio alla fiducia.',
      quote: 'La sera prima ripete tutto alla perfezione. Il giorno dopo, scena muta.',
      lens: ['ansia', 'fiducia'],
      signs: ['Mal di pancia o insonnia prima delle verifiche', 'All\'interrogazione fa scena muta', 'Dice spesso "tanto vado male"', 'Studia, ma ha paura di non ricordare', 'Nei giorni di verifica vorrebbe restare a casa'],
      before: { time: '23:40', items: ['Notti agitate prima delle verifiche', 'Scena muta all\'interrogazione', '"Tanto vado male"', 'Studia per paura'] },
      after: { time: '21:00', items: ['Arriva preparato e tranquillo', 'Espone con una scaletta, in ordine', '"Ce la posso fare"', 'Studia per capire'] },
      focus: { 0: 'Piccoli successi misurabili, settimana dopo settimana: la fiducia si costruisce con le prove.', 1: 'Sapere cosa studiare e quando toglie l\'ansia dell\'ultimo momento.', 4: 'Simulazioni di interrogazione con i docenti, finché parlare diventa naturale.' },
      includes: ['tutor', 'live', 'simulazioni', 'aule', 'lab', 'report'],
      review: R.silvia,
      faq: [
        ['Chi lo segue?', 'La sua tutor personale è una psicologa esperta in apprendimento: lavora con lui sulla gestione della tensione, sul metodo e sull\'esposizione, che spesso sono la radice dell\'ansia scolastica. Il nostro è un percorso di apprendimento, non una psicoterapia: se la tutor nota segnali che richiedono un percorso clinico, ve lo dice con sincerità.'],
        ['Le lezioni online non lo agitano di più?', 'Di solito succede il contrario: da casa, nel suo ambiente, si sente più al sicuro. Si parte con calma, e la telecamera si accende quando è pronto.'],
        ['Quanto tempo ci vuole?', 'Ogni ragazzo ha i suoi tempi. Con un piano chiaro e le simulazioni di interrogazione, molte famiglie vedono un ragazzo più sereno già nel primo mese.'],
        ['Può parlarne con il tutor anche senza di me?', 'Sì. Il tutor diventa un punto di riferimento anche per lui, e a voi arriva un aggiornamento regolare sui progressi.'],
      ],
      related: ['memoria-concentrazione', 'organizzazione', 'metodo-di-studio', 'superiore'],
    },
  },

  /* servizi inclusi: icona + testo */
  INCLUDES: {
    tutor: ['Tutor personale', 'Una psicologa esperta in apprendimento: costruisce il piano di studio, segue i progressi e lo assiste per tutto il percorso.', 'M10 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM2 26c1-5 4.5-8 8-8s7 3 8 8M20 6l2 2 4-4'],
    live: ['Docenti certificati Lambda', 'Lezioni individuali live, dal lunedì al sabato, con docenti formati sul nostro metodo e aggiornati con corsi continui.', 'M3 7h17v15H3zM20 12l7-4v13l-7-4'],
    aule: ['Aule studio online', 'Applichi il metodo in autonomia, con un docente sempre collegato a cui chiedere aiuto.', 'M4 24V10l10-6 10 6v14M10 24v-7h8v7'],
    lab: ['Laboratori di metodo', 'Mappe, lettura veloce, memoria: le tecniche, allenate insieme.', 'M11 3v8L4 23h20l-7-12V3M9 3h10'],
    ripetizioni: ['Ripetizioni mirate', 'Nelle materie critiche i docenti recuperano le lacune, applicando il metodo.', 'M5 5h18v14H5zM9 23h10M14 19v4'],
    simulazioni: ['Simulazioni di interrogazione', 'Prove con i docenti, finché esporre diventa naturale.', 'M4 6h20v13H11l-5 4v-4H4z'],
    report: ['Report per i genitori', 'Aggiornamenti regolari: sapete sempre a che punto è.', 'M7 3h11l5 5v17H7zM11 14h8M11 18h8M11 10h4'],
  },
};
