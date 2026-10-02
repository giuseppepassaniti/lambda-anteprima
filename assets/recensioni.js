/* =====================================================================
   LAMBDA · recensioni, cambiamenti e numeri per percorso
   Recensioni: estratti testuali da Trustpilot (it.trustpilot.com/review/centrostudioonline.eu),
   solo famiglie e studenti Lambda (le recensioni CMA sono escluse). "…" = taglio nel testo originale.
   - cat:  i percorsi di cui parla la recensione (slug di percorso.html?p=…), solo se lo dice il testo
   - tags: quali cambiamenti racconta (metodo, autonomia, tempo, risultati, sicurezza)
   - prima/dopo: solo quando la recensione racconta com'era prima e com'è dopo
   ===================================================================== */
window.LAMBDA_DIMS = [
  { k: 'metodo', name: 'Metodo', pre: 'Ripete a memoria e sottolinea tutto.', post: 'Legge, schematizza e ripete con parole sue.', how: 'il Metodo FOCUS, con mappe, sintesi e tecniche di memoria allenate nei laboratori.' },
  { k: 'autonomia', name: 'Autonomia', pre: 'Studia solo con un adulto accanto.', post: 'Si organizza e si verifica da solo.', how: 'un piano settimanale costruito con lui, e strumenti per capire da solo se è pronto.' },
  { k: 'tempo', name: 'Tempo di studio', pre: 'Pomeriggi interi sui libri.', post: 'Meno ore, fatte meglio.', how: 'lettura attiva, sessioni brevi e ripasso a intervalli: si studia con un metodo, non a oltranza.' },
  { k: 'risultati', name: 'Risultati', pre: 'Insufficienze e debiti.', post: 'Voti in risalita, lacune recuperate.', how: 'ripetizioni mirate sulle materie critiche e il metodo per non ritrovarsi di nuovo indietro.' },
  { k: 'sicurezza', name: 'Sicurezza', pre: 'Ansia e scena muta.', post: 'Affronta verifiche e interrogazioni con calma.', how: 'simulazioni con i docenti, piccoli successi misurabili e una scaletta per esporre.' },
];
window.LAMBDA_REVIEWS = [
  { q: 'Mio figlio aveva tre debiti, in 2 mesi ha superato i debiti e ha capito come studiare in meno tempo.', n: 'Elisabetta V.', cat: ['recupero-insufficienze', 'superiore'], tags: ['risultati', 'tempo'], lead: 'risultati', prima: 'Tre debiti', dopo: 'Debiti superati in 2 mesi' },
  { q: 'Mio figlio ha recuperato 3 materie nel primo quadrimestre ed uscito dagli scrutini di secondo liceo scientifico con zero debiti.', n: 'Silvia G.', cat: ['superiore', 'recupero-insufficienze'], tags: ['risultati'], prima: '3 materie da recuperare', dopo: 'Scrutini con zero debiti' },
  { q: 'Per mio figlio, dislessico, la scuola è sempre stata un incubo… a dicembre con 6 materie insufficienti su 12… un pezzetto alla volta come insegna il Centro, ha recuperato in un mese 4 materie su 6.', n: 'Cinzia C.', cat: ['dsa-bes', 'superiore', 'recupero-insufficienze'], tags: ['risultati', 'metodo'], prima: '6 insufficienze su 12', dopo: '4 materie recuperate in un mese' },
  { q: 'Non immaginavo che in un mese sarebbe passato da 6 in storia a prendere 8 oppure scienze da 5 a 7! Si sente più sicuro e non fa più fatica a capire gli argomenti da studiare.', n: 'Jennifer', cat: ['ripetizioni', 'metodo-di-studio'], tags: ['risultati', 'sicurezza'], prima: '6 in storia, 5 in scienze', dopo: '8 in storia, 7 in scienze' },
  { q: 'In terza media, faticava a gestire lo studio a causa di un disturbo specifico dell\'apprendimento… Ora riesce a organizzarsi meglio, non passa più ore sui libri e anticipa i compiti. Oggi, al primo anno di superiori, le difficoltà sono un ricordo lontano.', n: 'Maria', cat: ['dsa-bes', 'media', 'organizzazione'], tags: ['tempo', 'autonomia', 'metodo'], lead: 'tempo', prima: 'DSA, ore sui libri', dopo: 'Organizzata e autonoma, alle superiori' },
  { q: 'Ha superato i debiti in modo soddisfacente e recuperato autostima.', n: 'Simona', cat: ['recupero-insufficienze', 'ansia-scolastica'], tags: ['risultati', 'sicurezza'], lead: 'sicurezza', prima: 'Debiti, autostima in calo', dopo: 'Debiti superati, autostima recuperata' },
  { q: 'Ho fatto seguire mio figlio per delle ripetizioni ed in poco più di un mese ha raggiunto la sufficienza nella materia… è arrivato al giorno del recupero sicuro e sereno e soprattutto molto preparato.', n: 'Valentina M.', cat: ['ripetizioni', 'recupero-insufficienze'], tags: ['risultati', 'sicurezza'] },
  { q: 'L\'inizio dell\'anno è stato un po\' disastroso e avvilente, ora invece è stato promosso con la media del 7! Il percorso che ha fatto gli ha dato sicurezza, autonomia e risultati molto gratificanti.', n: 'Cinzia C.', cat: ['superiore', 'autonomia'], tags: ['risultati', 'autonomia', 'sicurezza'], lead: 'autonomia' },
  { q: 'Aveva gli esami di terza media… grazie a loro è riuscito a superare gli esami, non so come ringraziarvi.', n: 'Manuela R.', cat: ['media'], tags: ['risultati'] },
  { q: 'Abbiamo visto una crescita importante per nostra figlia, soprattutto nella gestione delle priorità e nell\'autonomia. Sicuramente migliorata l\'autostima!', n: 'Maria', cat: ['media', 'autonomia'], tags: ['autonomia', 'sicurezza'] },
  { q: 'Abbiamo scoperto che non c\'è solo un modo di studiare ma tanti e che si può adattare al ritmo e alle capacità dello studente. Essendo mio figlio anche un DSA… ha fatto la differenza.', n: 'Morena S.', cat: ['dsa-bes', 'metodo-di-studio'], tags: ['metodo'] },
  { q: 'Ha smesso di frequentare la scuola per il motivo di ansia da prestazione… siamo riusciti a fare i primi passi di recupero.', n: 'Svitlana S.', cat: ['ansia-scolastica'], tags: ['sicurezza'] },
  { q: 'Ciò che mi preoccupava era il crollo della sua autostima… Mio figlio ha ritrovato la serenità e la voglia di mettersi in gioco, sentendosi finalmente capito e non giudicato.', n: 'Moira I.', cat: ['ansia-scolastica'], tags: ['sicurezza'], lead: 'sicurezza' },
  { q: 'Hanno accompagnato mio figlio ad acquisire un metodo di studio efficace, a far crescere la sua autostima, ad organizzare meglio il suo tempo e a gestire la scuola con meno ansia.', n: 'Alessandra', cat: ['ansia-scolastica', 'metodo-di-studio', 'organizzazione'], tags: ['metodo', 'tempo', 'sicurezza'], lead: 'metodo' },
  { q: 'Il corso di metodo ha funzionato alla grande a migliorare la qualità dello studio anche alla gestione del tempo. La gestione dello stress aiuta molto i ragazzi a gestire le loro emozioni.', n: 'Iman O.', cat: ['ansia-scolastica', 'organizzazione', 'metodo-di-studio'], tags: ['metodo', 'tempo', 'sicurezza'] },
  { q: 'Le tecniche di memorizzazione hanno rappresentato per me una vera svolta. Dopo tanti tentativi e difficoltà, sono riuscito finalmente a prendere il diploma… e a superare l\'ansia da esame.', n: 'Mirko', who: 'studente', cat: ['superiore', 'memoria-concentrazione', 'ansia-scolastica'], tags: ['metodo', 'risultati', 'sicurezza'] },
  { q: 'Il loro metodo ha permesso a mia figlia a imparare a gestire i compiti e a responsabilizzarsi nello svolgimento. La possibilità di essere seguiti quotidianamente nelle aule studio… la sta motivando nella costanza a studiare.', n: 'Sara', cat: ['autonomia', 'metodo-di-studio'], tags: ['autonomia', 'metodo'] },
  { q: 'Ottimizzando il suo tempo, tra i suoi vari impegni extrascolastici… terminerà l\'anno scolastico con buoni risultati e più autostima.', n: 'Vincenza F.', cat: ['organizzazione'], tags: ['tempo', 'risultati'] },
  { q: 'La vedo più tranquilla, motivata ed organizzata nello studio.', n: 'Silvia', cat: ['metodo-di-studio', 'organizzazione'], tags: ['metodo', 'sicurezza'] },
  { q: 'Cercano di supportare i ragazzi non solo dal punto di vista didattico e cosa più importante di promuovere autonomia.', n: 'Simona', cat: ['autonomia'], tags: ['autonomia'] },
  { q: 'Abbiamo finalmente trovato un metodo di studio efficace che ha colmato le sue lacune… ho notato un miglioramento non solo nei voti, ma anche nell\'approccio di mia figlia nei confronti della scuola.', n: 'Anna Maria C.', cat: ['metodo-di-studio', 'recupero-insufficienze'], tags: ['metodo', 'risultati'] },
  { q: 'Mi ha permesso di colmare tante lacune, soprattutto in matematica.', n: 'Nicolò P.', who: 'studente', cat: ['ripetizioni'], tags: ['risultati'] },
  { q: 'Ho seguito principalmente le lezioni delle materie dove avevo più difficoltà, come geometria e inglese, migliorando in breve tempo grazie all\'aiuto dei professori.', n: 'Giulia', who: 'studentessa', cat: ['ripetizioni'], tags: ['risultati'] },
  { q: 'Con il loro metodo, mio figlio ha migliorato i suoi voti. I docenti sono preparati e disponibili nel spiegare bene le materie.', n: 'Viorica R.', cat: ['ripetizioni'], tags: ['risultati'] },
  { q: 'Ha reso possibile un evidente miglioramento scolastico e ha ridato a mio figlio la fiducia di potercela fare, anche quando sembrava che tutto fosse perso!', n: 'Daniela', cat: [], tags: ['risultati', 'sicurezza'] },
  { q: 'Ho visto mio figlio acquisire maggiore sicurezza e serenità.', n: 'Monica P.', cat: [], tags: ['sicurezza'] },
  { q: 'Il Centro "cura" non solo lo studente ma anche la famiglia.', n: 'Cinzia C.', cat: [], tags: [] },
  { q: 'Aiutano i genitori a gestirli, a non avere conflitti soprattutto per la scuola e lo studio. Infinitamente grata a loro per avermi sollevato dal problema studio.', n: 'Simona S.', cat: [], tags: ['autonomia'] },
  { q: 'Non è una soluzione "miracolosa", ma sicuramente un valido supporto per chi cerca un aiuto strutturato e continuo nello studio.', n: 'Annalisa', cat: [], tags: ['metodo'] },
  { q: 'Mio figlio non solo è cresciuto scolasticamente ma anche come persona.', n: 'Irene L. M.', cat: [], tags: ['risultati', 'sicurezza'] },
  { q: 'Ho visto in mio figlio una scintilla di entusiasmo.', n: 'Fabio T.', cat: [], tags: [] },
];

/* ---------------------------------------------------------------------
   NUMERI PER PERCORSO — PROVVISORI (inventati come segnaposto):
   da sostituire con i dati veri della segreteria. v = valore, pre/suf = prefisso/suffisso, l = etichetta.
   cats: i percorsi da cui pescare le recensioni del pannello.
   --------------------------------------------------------------------- */
window.LAMBDA_RESULTS = [
  { k: 'primaria', name: 'Scuola primaria', p: 'primaria', cats: ['primaria'], lead: 'Imparare a studiare prima che studiare diventi difficile.',
    nums: [{ v: 600, pre: '+', l: 'bambini seguiti' }, { v: 88, suf: '%', l: 'fa i compiti con meno aiuto dei genitori dopo 3 mesi' }, { v: 4.9, dec: 1, suf: '/5', l: 'la soddisfazione delle famiglie' }] },
  { k: 'media', name: 'Scuola media', p: 'media', cats: ['media'], lead: 'Alle medie cambia tutto: è qui che si costruisce il metodo.',
    nums: [{ v: 1500, pre: '+', l: 'ragazzi seguiti' }, { v: 96, suf: '%', l: 'supera l\'esame di terza media' }, { v: 1.2, dec: 1, pre: '+', l: 'punti di media in un anno' }] },
  { k: 'superiore', name: 'Scuola superiore', p: 'superiore', cats: ['superiore'], lead: 'Più materie, più ritmo: con il metodo giusto si regge.',
    nums: [{ v: 2400, pre: '+', l: 'studenti seguiti' }, { v: 92, suf: '%', l: 'recupera i debiti entro settembre' }, { v: 1, pre: '+', l: 'punto di media nel primo quadrimestre' }] },
  { k: 'universita', name: 'Università e test', p: 'universita', cats: ['universita', 'test-universitari'], lead: 'Esami e test d\'ingresso: meno ore, più risultati.',
    nums: [{ v: 700, pre: '+', l: 'universitari e maturandi' }, { v: 8, suf: ' su 10', l: 'superano l\'esame preparato con noi al primo tentativo' }, { v: 35, pre: '-', suf: '%', l: 'ore di studio per esame' }] },
  { k: 'dsa', name: 'DSA e BES', p: 'dsa-bes', cats: ['dsa-bes'], lead: 'Un metodo che si adatta allo studente, non il contrario.',
    nums: [{ v: 900, pre: '+', l: 'studenti con DSA o BES' }, { v: 9, suf: ' su 10', l: 'usa gli strumenti compensativi in autonomia' }, { v: 87, suf: '%', l: 'migliora i voti nel primo anno' }] },
  { k: 'ansia', name: 'Ansia scolastica', p: 'ansia-scolastica', cats: ['ansia-scolastica'], lead: 'Verifiche e interrogazioni, affrontate con calma.',
    nums: [{ v: 800, pre: '+', l: 'ragazzi seguiti' }, { v: 8, suf: ' su 10', l: 'affronta le verifiche con meno ansia dopo 3 mesi' }, { v: 90, suf: '%', l: 'delle famiglie vede più serenità a casa' }] },
  { k: 'recupero', name: 'Recupero e ripetizioni', p: 'recupero-insufficienze', cats: ['recupero-insufficienze', 'ripetizioni'], lead: 'Recuperare le lacune, e non ritrovarsi più indietro.',
    nums: [{ v: 3200, pre: '+', l: 'materie recuperate' }, { v: 92, suf: '%', l: 'raggiunge la sufficienza entro fine anno' }, { v: 6, suf: ' settimane', l: 'in media per vedere i primi voti in salita' }] },
];
