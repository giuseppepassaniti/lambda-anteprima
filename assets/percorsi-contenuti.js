/* =====================================================================
   LAMBDA · contenuti delle pagine percorso (nuovo modello)
   numeri · "Ti riconosci?" con pop-up educativi · come funziona · recensioni · domande frequenti
   Si applica sopra percorsi.js e percorsi-pagine.js (caricare per ultimo).
   ===================================================================== */
(() => {
  const P = window.PERCORSI, R = P.REVIEWS;
  const C = {
 "ansia-scolastica": {
  "nums": [
   "studenti seguiti, anche quando la scuola fa paura",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi e famiglie, con calma e metodo"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Non è debolezza.</em>",
  "painLead": "L'ansia scolastica ha quasi sempre un meccanismo preciso, e capirlo è il primo passo. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “stai tranquillo” spesso non basta.",
  "pains": [
   {
    "a": "heart",
    "t": "Mal di pancia prima delle verifiche",
    "q": "La mattina della verifica ha mal di pancia e non riesce a fare colazione.",
    "real": "Quando il cervello percepisce una minaccia, il corpo si prepara a reagire: cuore accelerato, stomaco chiuso, respiro corto. È una risposta antica, nata per proteggerci dai pericoli; qui il “pericolo” è un compito in classe. Il malessere è vero, non è una scusa.",
    "mythT": "Perché “non è niente, vai” non basta",
    "myth": "Minimizzare non spegne la reazione del corpo: il ragazzo si sente incompreso, e la volta dopo l'agitazione arriva ancora prima.",
    "fact": "La reazione “attacco o fuga” è automatica: non si sceglie di averla. Si può però imparare a riconoscerla e a ridurla. Se i sintomi sono frequenti, parlatene con il pediatra."
   },
   {
    "a": "read",
    "t": "All'interrogazione fa scena muta",
    "q": "La sera prima ripete tutto alla perfezione. Il giorno dopo, scena muta.",
    "real": "Sotto forte tensione la memoria di lavoro, quella che serve a recuperare e ordinare le informazioni, si restringe. Le cose studiate ci sono, ma in quel momento non si trovano. E spesso nessuno gli ha insegnato a esporre: sa ripetere da solo, non davanti a qualcuno.",
    "mythT": "Perché “studia di più” non basta",
    "myth": "Il problema non è quanto sa, ma come arriva all'interrogazione. Studiare ancora di più spesso alza la posta, e con lei la tensione.",
    "fact": "Un po' di attivazione aiuta a rendere meglio, troppa fa crollare la prestazione: è la relazione descritta dalla legge di Yerkes-Dodson. L'obiettivo non è zero tensione, ma quella giusta."
   },
   {
    "a": "battery",
    "t": "“Tanto vado male”",
    "q": "Prima ancora di cominciare dice: «tanto vado male».",
    "real": "Dopo alcune esperienze negative, il ragazzo smette di credere che il suo impegno possa cambiare il risultato. “Tanto vado male” è un modo per proteggersi dalla delusione. Ma così studia con meno energia, e il voto sembra dargli ragione.",
    "mythT": "Perché “devi credere in te stesso” non basta",
    "myth": "La fiducia non nasce dalle parole di incoraggiamento, per quanto sincere. Nasce dalle prove concrete di avercela fatta.",
    "fact": "Gli psicologi chiamano autoefficacia la convinzione di saper affrontare un compito. Cresce soprattutto attraverso esperienze di successo vissute in prima persona, anche piccole."
   },
   {
    "a": "storm",
    "t": "Non è mai abbastanza",
    "q": "Prende 8 e piange perché non è 10.",
    "real": "Per alcuni ragazzi il voto diventa la misura del proprio valore. Ogni errore pesa come un fallimento personale: studiano fino a tardi, ripetono all'infinito, non si sentono mai pronti. Da fuori sembrano bravissimi; dentro vivono una pressione continua.",
    "mythT": "Perché “ma sei bravissimo” non basta",
    "myth": "I complimenti sul risultato confermano che conta solo il voto. Ha bisogno di sentire che vale anche quando sbaglia.",
    "fact": "Lodare l'impegno e la strategia, più che il risultato o il talento, aiuta i ragazzi a vivere l'errore come parte dell'imparare, e non come una sentenza."
   },
   {
    "a": "alone",
    "t": "Non vuole andare a scuola",
    "q": "Nei giorni di verifica trova sempre un motivo per restare a casa.",
    "real": "Evitare ciò che spaventa dà un sollievo immediato, e la mente lo registra come la soluzione. Ma ogni verifica saltata rende la successiva più minacciosa: l'ansia non si spegne, cresce. E intanto si accumulano argomenti da recuperare.",
    "mythT": "Perché “per oggi resta a casa” non basta",
    "myth": "L'assenza toglie l'ansia per un giorno, ma la rinforza per le settimane dopo. Anche costringerlo senza ascoltarlo, però, non aiuta.",
    "fact": "L'ansia tende a ridursi affrontando le situazioni temute un passo alla volta, in modo graduale. Se il rifiuto della scuola diventa frequente, è importante parlarne con uno specialista."
   },
   {
    "a": "slow",
    "t": "La notte prima non dorme",
    "q": "La notte prima della verifica non dorme, o ripassa fino a tardi.",
    "real": "La sera prima la mente continua a rimuginare: e se mi chiede proprio quello? Così si ripassa fino a notte, o ci si gira nel letto. Il risultato è un ragazzo stanco proprio quando gli servirebbe tutta la sua lucidità.",
    "mythT": "Perché “un ultimo ripasso” non basta",
    "myth": "Il ripasso notturno dà l'illusione di avere tutto sotto controllo, ma toglie sonno. E al mattino la stanchezza amplifica l'agitazione.",
    "fact": "Il sonno aiuta a consolidare quello che si è studiato durante il giorno. Arrivare riposati alla verifica fa parte della preparazione, non è un lusso."
   },
   {
    "a": "grades",
    "t": "Nel compito in classe va nel pallone",
    "q": "A casa gli esercizi li sa fare. Nel compito in classe va nel pallone.",
    "real": "In classe c'è il tempo che scorre, il silenzio, i compagni che consegnano. Basta un esercizio che non torna per far scattare il panico, e da lì si perde anche ciò che si sapeva. Spesso manca una strategia: da dove partire, come gestire il tempo, cosa fare se ci si blocca.",
    "mythT": "Perché “stai attento a non sbagliare” non basta",
    "myth": "Concentrarsi sull'errore da evitare aumenta la tensione e consuma attenzione. Serve sapere cosa fare, non solo cosa non fare.",
    "fact": "Allenarsi in condizioni simili alla verifica, con tempi e consegne veri, rende la situazione più familiare e riduce l'effetto sorpresa."
   }
  ],
  "howTitle": "Dalla paura alla fiducia, <em>un passo alla volta.</em>",
  "how": [
   "Il Performance Test, 10 minuti senza voti né giudizi: capiamo come studia e in quale momento si inceppa.",
   "La tutor personale, psicologa esperta in apprendimento, costruisce con lui un piano che lavora su metodo, gestione della tensione ed esposizione.",
   "Lezioni individuali con un docente certificato Lambda e simulazioni di interrogazione graduali, finché parlare davanti a qualcuno diventa normale.",
   "Ogni settimana la tutor verifica i progressi, aggiusta il piano e vi dà indicazioni su come sostenerlo a casa senza aumentare la pressione.",
   "Arriva alle verifiche preparato e più sereno. E al posto del “tanto vado male”, piano piano, compare un “ce la posso fare”."
  ],
  "reviews": [
   "silvia",
   "simona",
   "irene"
  ],
  "faq": [
   [
    "Chi lo segue?",
    "La sua tutor personale è una psicologa esperta in apprendimento: lavora con lui sulla gestione della tensione, sul metodo e sull'esposizione, che spesso sono la radice dell'ansia scolastica. Le lezioni individuali le fa un docente certificato Lambda. Il nostro è un percorso di apprendimento, non una psicoterapia: se la tutor nota segnali che richiedono un percorso clinico, ve lo dice con sincerità."
   ],
   [
    "Le lezioni online non lo agitano di più?",
    "Di solito succede il contrario: da casa, nel suo ambiente, si sente più al sicuro. Si parte con calma, e la telecamera si accende quando è pronto."
   ],
   [
    "Quanto tempo ci vuole?",
    "Ogni ragazzo ha i suoi tempi. Con un piano chiaro e le simulazioni di interrogazione, spesso i primi segnali di maggiore serenità arrivano già nelle prime settimane; la tutor vi aggiorna con regolarità su come procede."
   ],
   [
    "Può parlarne con la tutor anche senza di me?",
    "Sì. La tutor diventa un punto di riferimento anche per lui, e a voi arriva un aggiornamento regolare sui progressi."
   ],
   [
    "Come posso aiutarlo a casa?",
    "La tutor vi dà indicazioni pratiche: come parlare delle verifiche senza aumentare la pressione, come reagire a un brutto voto, come stargli accanto senza sostituirvi a lui."
   ]
  ]
 },
 "autonomia": {
  "nums": [
   "studenti seguiti verso uno studio più autonomo",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi che imparano a fare da soli"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Non è mancanza di volontà.</em>",
  "painLead": "Dietro un ragazzo che non studia da solo c'è quasi sempre un'abilità che non ha ancora imparato. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “arrangiati” spesso non basta.",
  "pains": [
   {
    "a": "alone",
    "t": "Studia solo con un adulto accanto",
    "q": "Se non mi siedo accanto a lui, non apre nemmeno il libro.",
    "real": "Quando lo studio è sempre partito con un adulto vicino, la presenza del genitore diventa il segnale che “si comincia”. Non è pigrizia: non ha mai sperimentato di potercela fare da solo, e senza quel segnale non sa come avviarsi.",
    "mythT": "Perché “da domani fai da solo” non basta",
    "myth": "Togliere di colpo il supporto lo lascia senza strumenti: di solito il risultato è un pomeriggio perso, e il ritorno alla situazione di prima.",
    "fact": "L'autonomia si costruisce riducendo l'aiuto in modo graduale: prima si fa insieme, poi si osserva, poi si verifica solo alla fine."
   },
   {
    "a": "week",
    "t": "Rimanda finché non intervieni tu",
    "q": "Rimanda tutto fino a sera, e alla fine devo intervenire io.",
    "real": "Iniziare è la parte più difficile, soprattutto quando il compito sembra grande e indefinito. Se non sa da dove partire, rimanda; e se sa che prima o poi arriverà un adulto a sbloccarlo, rimandare diventa un'abitudine.",
    "mythT": "Perché “mettiti a studiare!” non basta",
    "myth": "L'ordine lo fa sedere, ma non gli dice da dove cominciare. Il giorno dopo si ricomincia da capo, con un po' più di tensione.",
    "fact": "Scomporre il lavoro in compiti piccoli e concreti, con un primo passo chiaro, rende molto più facile cominciare. È una delle strategie più semplici contro la procrastinazione."
   },
   {
    "a": "battery",
    "t": "Chiede conferma per tutto",
    "q": "Ogni due minuti mi chiama: «così va bene?».",
    "real": "Chiedere conferma di continuo è spesso un segno di insicurezza: non si fida del proprio giudizio e cerca fuori la garanzia di non sbagliare. Ogni conferma lo rassicura per un attimo, ma gli toglie l'occasione di imparare a valutarsi da solo.",
    "mythT": "Perché “sì, va bene” non basta",
    "myth": "Rispondere ogni volta rinforza il bisogno di chiedere. Serve che impari criteri suoi per capire se un lavoro è fatto bene.",
    "fact": "Allenare l'autovalutazione, ad esempio con una breve lista di controllo a fine compito, aiuta i ragazzi a fidarsi di più del proprio lavoro."
   },
   {
    "a": "read",
    "t": "Non sa se è pronto",
    "q": "Ogni sera mi chiede di interrogarlo, sennò non si sente preparato.",
    "real": "Senza un modo per verificarsi da solo, non ha idea di quanto sa davvero. L'unica prova è l'interrogazione del genitore: così il ripasso dipende dalla vostra disponibilità, e a volte finisce a tarda sera.",
    "mythT": "Perché “rileggi finché lo sai” non basta",
    "myth": "Rileggere dà l'impressione di sapere, perché il testo diventa familiare. Ma riconoscere una pagina non è la stessa cosa che saperla ripetere.",
    "fact": "Provare a richiamare a memoria ciò che si è studiato, ad esempio rispondendo a domande guida, è tra i modi più efficaci per fissarlo e capire se si è pronti."
   },
   {
    "a": "storm",
    "t": "I compiti finiscono in litigio",
    "q": "Ogni pomeriggio i compiti finiscono in una discussione.",
    "real": "Quando il genitore diventa anche insegnante e controllore, il rapporto si carica di tensione. Lui vive ogni correzione come una critica, voi vi sentite inascoltati. E il conflitto finisce per riguardare voi due, più che i compiti.",
    "mythT": "Perché “controllo solo un attimo” non basta",
    "myth": "Il controllo nasce dalla preoccupazione, ma per lui diventa sfiducia. Più si controlla, più lui resiste, e la tensione sale per tutti.",
    "fact": "Molti ragazzi accettano più facilmente indicazioni da una figura esterna alla famiglia. Spostare il ruolo di guida fuori casa spesso alleggerisce il rapporto."
   },
   {
    "a": "bored",
    "t": "Rifiuta il vostro aiuto",
    "q": "Se provo ad aiutarlo mi dice «lasciami stare, faccio da solo». Ma poi non fa.",
    "real": "Crescendo, il bisogno di indipendenza è sano e naturale: accettare l'aiuto del genitore può sembrargli un passo indietro. Il problema è che vuole fare da solo senza avere ancora gli strumenti per farlo, e resta bloccato a metà.",
    "mythT": "Perché “allora arrangiati” non basta",
    "myth": "Lasciarlo solo senza strumenti conferma soltanto che non ce la fa. Il suo desiderio di autonomia va preso sul serio, e sostenuto con un metodo.",
    "fact": "Nell'adolescenza il bisogno di prendere le distanze dai genitori fa parte della crescita. È un'energia preziosa, se viene indirizzata verso la capacità di organizzarsi."
   },
   {
    "a": "bag",
    "t": "Non sa organizzarsi",
    "q": "Non sa mai cosa deve fare per domani: lo chiedo io alle altre mamme.",
    "real": "Organizzarsi richiede abilità precise: annotare, stimare i tempi, decidere le priorità. Se è sempre qualcun altro a ricordare scadenze e compiti, il ragazzo non ha motivo, né occasione, per sviluppare queste abilità da sé.",
    "mythT": "Perché “scrivilo sul diario” non basta",
    "myth": "Il diario è utile solo se si sa come usarlo. Annotare non è pianificare: serve imparare a trasformare un elenco di compiti in un piano.",
    "fact": "Le funzioni esecutive, come pianificare e tenere a mente più impegni, maturano gradualmente fino all'età adulta. Per questo vanno allenate con pazienza, non date per scontate."
   }
  ],
  "howTitle": "Un passo indietro per voi, <em>un passo avanti per lui.</em>",
  "how": [
   "Il Performance Test in 10 minuti: capiamo quali abilità di autonomia ha già e quali vanno costruite.",
   "La tutor personale, psicologa esperta in apprendimento, imposta un piano che riduce gradualmente il bisogno di un adulto accanto.",
   "Con un docente certificato Lambda impara, lezione dopo lezione, a pianificare, iniziare da solo e verificarsi con mappe e domande guida.",
   "La tutor lo segue ogni settimana e vi suggerisce come fare un passo indietro, senza lasciarlo solo.",
   "Si organizza da solo e sa quando è pronto. E voi tornate a fare i genitori, non gli insegnanti."
  ],
  "reviews": [
   "silvia",
   "irene",
   "fabio"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Un docente certificato Lambda fa con lui le lezioni individuali, applicando il metodo alle sue materie. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano, segue i progressi ed è il vostro punto di riferimento."
   ],
   [
    "Da che età può diventare autonomo?",
    "Si può iniziare già alla fine della primaria; le medie sono il momento ideale."
   ],
   [
    "E se rifiuta di farsi aiutare?",
    "Spesso rifiuta l'aiuto dei genitori, non quello di una figura esterna. La tutor e i docenti cambiano la dinamica, e tolgono a voi il ruolo di controllori."
   ],
   [
    "Io cosa devo fare?",
    "La tutor vi dà indicazioni pratiche per lasciargli spazio, passo dopo passo, senza lasciarlo solo."
   ],
   [
    "Come funzionano le aule studio online?",
    "Applica da solo il metodo sui suoi compiti, con un docente sempre collegato a cui chiedere aiuto se si blocca: impara a cavarsela, senza bisogno di voi."
   ]
  ]
 },
 "dsa-bes": {
  "nums": [
   "studenti seguiti, ognuno con il suo modo di imparare",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi e famiglie, partendo dai punti di forza"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Impara in modo diverso.</em>",
  "painLead": "Dietro la fatica di un ragazzo con DSA o BES c'è quasi sempre un meccanismo preciso. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “impegnati di più” spesso non basta.",
  "pains": [
   {
    "a": "read",
    "t": "Leggere è una fatica enorme",
    "q": "Dopo una pagina è già stanco, e non ricorda cosa ha letto.",
    "real": "Quando la lettura non è automatica, gran parte dell'energia va nel decifrare le parole. Per capire e ricordare il contenuto ne resta poca, e la stanchezza arriva presto. Non è disattenzione: è un modo diverso di elaborare il testo scritto.",
    "mythT": "Perché “leggi finché non migliori” non basta",
    "myth": "Insistere solo sulla lettura aumenta fatica e frustrazione. L'obiettivo è che capisca e impari i contenuti, anche passando da altre strade.",
    "fact": "Ascoltare un testo con la sintesi vocale permette di concentrare l'attenzione sul significato. Non è una scorciatoia: è un'altra strada per arrivare allo stesso contenuto."
   },
   {
    "a": "battery",
    "t": "Si sente diverso dai compagni",
    "q": "Mi ha detto: «sono stupido, gli altri ci mettono la metà».",
    "real": "Confrontarsi ogni giorno con compagni più veloci può convincere un ragazzo di valere meno. Spesso non sa che la sua difficoltà riguarda abilità specifiche, non l'intelligenza. Senza questa consapevolezza, la fiducia si consuma un po' alla volta.",
    "mythT": "Perché “non è vero, sei bravissimo” non basta",
    "myth": "Rassicurarlo è giusto, ma non cambia l'idea che ha di sé. Serve che capisca come funziona lui, e che lo veda funzionare.",
    "fact": "Un disturbo specifico dell'apprendimento riguarda abilità precise, come lettura, scrittura o calcolo, e per definizione non dipende dal livello intellettivo."
   },
   {
    "a": "bag",
    "t": "Gli strumenti restano nello zaino",
    "q": "Ha la calcolatrice e le mappe, ma in classe si vergogna di usarle.",
    "real": "Usare uno strumento diverso dagli altri, davanti ai compagni, può far sentire “segnati”. Altre volte non li usa perché nessuno gli ha insegnato a farlo bene: una mappa fatta da altri o una sintesi vocale mai provata servono a poco.",
    "mythT": "Perché “usali, ti spettano” non basta",
    "myth": "Avere diritto a uno strumento non significa saperlo usare, né sentirsi a proprio agio nel farlo. Serve allenamento, e serve che diventi suo.",
    "fact": "Gli strumenti compensativi funzionano meglio quando il ragazzo partecipa a costruirli, ad esempio realizzando da sé le proprie mappe: così diventano anche un modo per studiare."
   },
   {
    "a": "slow",
    "t": "Ci mette il doppio del tempo",
    "q": "Quello che i compagni fanno in un'ora, a lui porta via tutto il pomeriggio.",
    "real": "Lettura, scrittura e calcolo richiedono a lui passaggi consapevoli che negli altri sono automatici. Ogni compito costa più tempo e più energia, e a fine pomeriggio non resta spazio per altro: né per il ripasso, né per lo svago.",
    "mythT": "Perché “stringi i denti e finisci” non basta",
    "myth": "Prolungare il lavoro oltre la stanchezza abbassa la qualità e alimenta il rifiuto. Spesso la differenza la fa un metodo che toglie i passaggi inutili.",
    "fact": "Il PDP può prevedere tempi più distesi o un carico di lavoro ridotto: sono misure pensate proprio per questa fatica. Se il carico vi sembra sproporzionato, parlatene con gli insegnanti."
   },
   {
    "a": "storm",
    "t": "Rabbia e lacrime sui compiti",
    "q": "Davanti a un esercizio difficile butta il quaderno e scoppia a piangere.",
    "real": "Dopo anni di sforzi che non sempre portano risultati, la frustrazione si accumula. Basta un esercizio che non torna per far traboccare il vaso. Non è un capriccio: è il segnale che il compito, così com'è proposto, in quel momento supera le sue risorse.",
    "mythT": "Perché “calmati, non è niente” non basta",
    "myth": "Non è niente solo visto da fuori. Senza un modo diverso di affrontare il compito, la scena si ripeterà il giorno dopo.",
    "fact": "Dividere il lavoro in passi brevi, con un obiettivo chiaro per ciascuno, riduce il senso di sopraffazione e rende più facile ripartire dopo un momento difficile."
   },
   {
    "a": "grades",
    "t": "Voti bassi nonostante l'impegno",
    "q": "Studia, studia davvero. Ma nelle verifiche scritte i voti non arrivano.",
    "real": "Nelle prove scritte la difficoltà può nascondere quello che sa: errori di ortografia, consegne lette di fretta, tempi stretti. Il voto finisce per misurare la difficoltà più che la preparazione, e lui conclude che studiare non serve.",
    "mythT": "Perché “allora studia ancora di più” non basta",
    "myth": "Più ore sui libri non risolvono un problema di modalità. Serve preparare le verifiche nel modo previsto dal suo PDP, con i suoi strumenti.",
    "fact": "Il PDP può prevedere misure anche per le verifiche, come interrogazioni programmate o la compensazione orale delle prove scritte. Concordarle con la scuola aiuta."
   },
   {
    "a": "alone",
    "t": "A casa tocca sempre a voi",
    "q": "Ogni sera gli leggo io il capitolo, sennò non ce la fa.",
    "real": "Leggere al posto suo è un aiuto prezioso, e a volte necessario. Ma se resta l'unica strada, lui impara che da solo non può farcela, e voi diventate il suo strumento compensativo. Col tempo il carico pesa su tutti, e i compiti diventano tensione.",
    "mythT": "Perché “lo aiuto io, finché serve” non basta",
    "myth": "Il vostro aiuto è un gesto d'amore, ma non può durare per sempre. L'obiettivo è che trovi strumenti suoi per arrivare dove arrivate voi.",
    "fact": "Sintesi vocale, audiolibri e mappe permettono a molti ragazzi con DSA di studiare in autonomia. Impararli presto rende più semplice il passaggio da un ciclo scolastico all'altro."
   }
  ],
  "howTitle": "Un metodo <em>costruito su come impara lui.</em>",
  "how": [
   "Il Performance Test misura il suo modo di studiare, non l'intelligenza: in 10 minuti vediamo dove fatica e dove è forte.",
   "La tutor personale, psicologa esperta in apprendimento, parte dal PDP e costruisce un piano che integra strumenti compensativi e misure previste.",
   "Un docente certificato Lambda lavora con lui sulle materie, in lezioni individuali, e gli insegna a usare mappe, sintesi vocale e software con sicurezza.",
   "Ogni settimana la tutor verifica i progressi, adatta il piano e vi tiene aggiornati, così anche il dialogo con la scuola diventa più semplice.",
   "Studia con i suoi strumenti, senza vergogna, e arriva alle verifiche più preparato. Soprattutto smette di pensare “sono stupido”: ha capito come impara lui."
  ],
  "reviews": [
   "simona",
   "irene",
   "fabio"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Un docente certificato Lambda fa con lui le lezioni individuali, applicando il metodo e i suoi strumenti compensativi alle materie. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano partendo dal PDP, segue i progressi ed è il vostro punto di riferimento."
   ],
   [
    "Fate diagnosi di DSA?",
    "No: la diagnosi spetta agli specialisti. Noi lavoriamo sul metodo di studio, tenendo conto della certificazione e del PDP. Se notiamo segnali senza una diagnosi, vi consigliamo di rivolgervi a uno specialista."
   ],
   [
    "Può usare i suoi strumenti a lezione?",
    "Certo: mappe, sintesi vocale, calcolatrice e tutto ciò che usa a scuola. Anzi, lo aiutiamo a usarli meglio."
   ],
   [
    "Il Performance Test va bene anche per lui?",
    "Sì: misura il modo di studiare, non l'intelligenza. In consegna la tutor tiene conto della sua certificazione."
   ],
   [
    "Come lavorate con il PDP?",
    "Partiamo dal PDP per costruire il piano: misure compensative e dispensative diventano parte del suo metodo, anche a casa."
   ]
  ]
 },
 "media": {
  "nums": [
   "studenti seguiti, dalla primaria all'università",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto ai ragazzi, nei passaggi più delicati della scuola"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Alle medie cambia tutto.</em>",
  "painLead": "Il passaggio alle medie mette alla prova abilità che nessuno gli ha ancora insegnato. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “impegnarsi di più” spesso non basta.",
  "pains": [
   {
    "a": "grades",
    "t": "Alle elementari andava bene, ora i voti calano",
    "q": "Alle elementari andava benissimo. Alle medie è crollato.",
    "real": "Alle elementari spesso bastavano attenzione in classe e un breve ripasso. Alle medie crescono materie, pagine e richieste, e serve uno studio a casa strutturato. Chi non ha ancora un metodo non è meno capace: usa strumenti che non bastano più.",
    "mythT": "Perché “deve solo abituarsi” non basta",
    "myth": "Il tempo, da solo, non porta un metodo. Se nessuno glielo insegna, si abitua a studiare male, e le lacune si sommano mese dopo mese.",
    "fact": "La fiducia nelle proprie capacità nasce soprattutto da esperienze di successo concrete: per questo i primi mesi delle medie contano così tanto."
   },
   {
    "a": "read",
    "t": "Non sa come si studia una pagina",
    "q": "Legge il capitolo di storia tre volte, ma all'interrogazione non sa cosa dire.",
    "real": "Leggere e studiare sono due cose diverse. Per studiare bisogna trovare le idee principali, collegarle e ridirle con parole proprie: un lavoro attivo che, di solito, nessuno insegna in modo esplicito.",
    "mythT": "Perché “rileggilo finché non lo sai” non basta",
    "myth": "Rileggere dà una sensazione di familiarità che sembra conoscenza, ma non lo è: riconoscere una pagina non vuol dire saperla raccontare.",
    "fact": "Provare a ripetere senza guardare il libro aiuta a fissare i ricordi più di una rilettura in più, ed è anche il modo più onesto per capire se si è pronti."
   },
   {
    "a": "week",
    "t": "Studia tutto il giorno prima",
    "q": "Si riduce sempre all'ultimo: la sera prima della verifica è il caos.",
    "real": "A 11-12 anni la capacità di pianificare è ancora in costruzione: una verifica tra cinque giorni sembra lontanissima. Senza uno strumento per vedere la settimana intera, compiti e verifiche arrivano tutti insieme.",
    "mythT": "Perché “dovevi pensarci prima” non basta",
    "myth": "Il rimprovero arriva quando il danno è fatto, e non insegna come si fa a pensarci prima. Pianificare è un'abilità che si allena, non un tratto del carattere.",
    "fact": "Distribuire lo studio in più sessioni brevi, nei giorni precedenti, aiuta a ricordare più a lungo che concentrare tutto in una sola sera."
   },
   {
    "a": "bag",
    "t": "Dimentica compiti e materiale",
    "q": "Il diario è vuoto: i compiti li scopre dai compagni sulla chat di classe.",
    "real": "Alle medie aumentano professori, materie e richieste diverse ogni giorno. Tenere traccia di tutto richiede un sistema, non solo buona volontà. Molti ragazzi passano dalla maestra che ricordava tutto al doversela cavare da soli, senza un passaggio intermedio.",
    "mythT": "Perché “il diario lo controllo io” non basta",
    "myth": "Se il controllo resta all'adulto, il ragazzo non costruisce il proprio: appena il genitore smette, tutto torna come prima.",
    "fact": "Usare sempre lo stesso strumento, nello stesso momento della giornata, trasforma l'organizzazione in un'abitudine che chiede meno sforzo e meno memoria."
   },
   {
    "a": "slow",
    "t": "Compiti infiniti, fino a sera",
    "q": "Comincia alle tre e alle nove è ancora sui libri.",
    "real": "Spesso non è la quantità a rendere i pomeriggi infiniti, ma il modo: compiti e studio mescolati, senza un ordine, con continue interruzioni. Ogni ripartenza costa tempo ed energia, e la stanchezza peggiora la qualità di quello che fa.",
    "mythT": "Perché “più ore stai sui libri, meglio è” non basta",
    "myth": "Oltre un certo punto le ore in più rendono sempre meno: la stanchezza abbassa attenzione e memoria, e lo studio diventa sinonimo di fatica.",
    "fact": "Il sonno aiuta la memoria: mentre si dorme, il cervello consolida ciò che si è imparato. Togliere riposo per studiare di più può essere controproducente."
   },
   {
    "a": "heart",
    "t": "Le prime interrogazioni lo bloccano",
    "q": "A casa sa tutto, poi all'interrogazione si blocca.",
    "real": "Esporre davanti alla classe è una competenza nuova, che alle elementari si allenava poco. Se ha studiato solo leggendo, non ha mai provato a dire le cose ad alta voce: davanti al professore lo fa per la prima volta, e sotto pressione.",
    "mythT": "Perché “tanto lo sai, stai tranquillo” non basta",
    "myth": "Rassicurare non dà gli strumenti. La sicurezza arriva dall'aver già provato, più volte, a ripetere in modo ordinato, con una scaletta.",
    "fact": "Un po' di tensione aiuta a concentrarsi, ma quando è troppa la prestazione cala. Allenarsi a ripetere in condizioni simili a quelle reali aiuta a tenerla a bada."
   },
   {
    "a": "storm",
    "t": "L'esame di terza media lo spaventa",
    "q": "Al solo pensiero dell'esame di terza media va in crisi.",
    "real": "Per molti ragazzi è il primo esame vero: tanti argomenti, prove scritte e un colloquio in cui collegare le materie. Visto tutto insieme sembra una montagna, e la paura arriva prima ancora di cominciare.",
    "mythT": "Perché “ci penserai a maggio” non basta",
    "myth": "Rimandare aumenta il carico finale e lascia l'ansia sullo sfondo per mesi. Affrontato per tappe, l'esame diventa un percorso gestibile.",
    "fact": "Dividere un obiettivo grande in tappe piccole e verificabili rende più facile cominciare e aumenta la sensazione di avere la situazione sotto controllo."
   }
  ],
  "howTitle": "Un percorso <em>per costruire il metodo, adesso.</em>",
  "how": [
   "Il Performance Test, in dieci minuti: capiamo come studia oggi e cosa gli manca nel passaggio alle medie.",
   "La tutor personale, psicologa esperta in apprendimento, costruisce con lui un piano settimanale che tiene insieme compiti, verifiche e sport.",
   "Lezioni individuali con docenti certificati Lambda: ripetizioni dove serve e, intanto, il metodo applicato alle sue materie.",
   "Ogni settimana la tutor controlla i progressi, aggiusta il piano e vi tiene aggiornati.",
   "Si organizza da solo, sa come si studia un capitolo e arriva all'esame di terza media preparato."
  ],
  "reviews": [
   "irene",
   "silvia",
   "fabio"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Un docente certificato Lambda fa con lui le lezioni individuali, comprese le ripetizioni, applicando il metodo alle sue materie. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano, segue i progressi ogni settimana ed è il vostro punto di riferimento."
   ],
   [
    "Conviene iniziare già in prima media?",
    "Sì: è il momento migliore per costruire il metodo, prima che le lacune si accumulino. Ma si può iniziare in qualsiasi momento dell'anno."
   ],
   [
    "Lo preparate anche all'esame di terza media?",
    "Sì: dall'organizzazione del ripasso al colloquio orale, con simulazioni d'esame insieme ai docenti."
   ],
   [
    "Fate anche ripetizioni?",
    "Sì, nelle materie dove serve: i docenti certificati recuperano le lacune applicando il metodo. Così recupera la materia e, intanto, impara a studiarla da solo."
   ],
   [
    "Come capisco se sta migliorando?",
    "La tutor vi manda aggiornamenti regolari sui progressi, e potete sentirla quando volete."
   ]
  ]
 },
 "memoria-concentrazione": {
  "nums": [
   "studenti seguiti, per studiare meglio in meno tempo",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi e famiglie, tra distrazioni e dimenticanze"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Non è disinteresse.</em>",
  "painLead": "Distrarsi e dimenticare hanno quasi sempre una spiegazione precisa, legata a come funzionano attenzione e memoria. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “concentrati!” spesso non basta.",
  "pains": [
   {
    "a": "focus",
    "t": "Il telefono sempre accanto",
    "q": "Ogni volta che entro in camera, lo trovo con il telefono in mano.",
    "real": "Ogni notifica interrompe il filo del ragionamento, e riprenderlo richiede tempo ed energia. Anche un telefono silenzioso sul tavolo tiene una parte della mente in attesa. Un'ora di studio così vale molto meno di quanto sembri.",
    "mythT": "Perché “mettilo in silenzioso” non basta",
    "myth": "Il silenzioso toglie il suono, non la tentazione: il telefono resta lì, a portata di mano e di sguardo.",
    "fact": "Notifiche e messaggi interrompono il lavoro anche quando non si risponde. Tenere il telefono in un'altra stanza durante lo studio è un modo semplice per proteggere la concentrazione."
   },
   {
    "a": "curve",
    "t": "Studia, ma poi dimentica",
    "q": "Lo aveva studiato bene. Dopo una settimana, è come se non l'avesse mai visto.",
    "real": "Dimenticare è normale: senza ripasso, gran parte di ciò che si studia svanisce nei giorni successivi. Se dopo la verifica l'argomento non viene più ripreso, la memoria lo lascia andare, e all'interrogazione di fine anno si riparte da zero.",
    "mythT": "Perché “tanto l'ha già studiato” non basta",
    "myth": "Aver studiato una volta non vuol dire ricordare per sempre. Senza ritorni periodici, anche ciò che era chiaro sbiadisce.",
    "fact": "Distribuire il ripasso su più giorni, a intervalli crescenti, aiuta a ricordare molto più a lungo: è uno dei risultati più solidi della ricerca sulla memoria."
   },
   {
    "a": "slow",
    "t": "Studia facendo mille cose",
    "q": "Studia con la musica, la chat aperta e la TV accesa. Dice che così si concentra meglio.",
    "real": "Il cervello non fa davvero due cose impegnative insieme: passa rapidamente dall'una all'altra, e ogni passaggio ha un costo in tempo ed errori. Per questo un capitolo che richiederebbe un'ora finisce per occupare tutto il pomeriggio.",
    "mythT": "Perché “tanto lui ci riesce” non basta",
    "myth": "La sensazione di riuscire a fare tutto insieme è comune, ma ingannevole: il lavoro sembra scorrere, mentre la comprensione resta in superficie.",
    "fact": "Passare da un'attività all'altra ha un costo: a ogni cambio si perde tempo e aumentano gli errori. Fare una cosa alla volta, di solito, è anche più veloce."
   },
   {
    "a": "bored",
    "t": "Non riesce a stare sui libri",
    "q": "Dopo dieci minuti si alza, va in cucina, torna, si rialza.",
    "real": "Mantenere l'attenzione su un compito poco stimolante è faticoso, e la fatica cresce se la sessione non ha una fine chiara. Cerca pause improvvise perché non ne ha di programmate. Non è maleducazione: è la mente che chiede tregua.",
    "mythT": "Perché “stai seduto finché non hai finito” non basta",
    "myth": "Lunghe sessioni senza pause lo tengono sui libri con il corpo, non con la testa. Il tempo passa, l'apprendimento no.",
    "fact": "La capacità di mantenere l'attenzione è limitata e cala con il tempo. Alternare blocchi di studio brevi e pause programmate aiuta a restare concentrati più a lungo."
   },
   {
    "a": "read",
    "t": "Legge e rilegge senza capire",
    "q": "Rilegge la stessa pagina tre volte, e alla fine non sa dire di cosa parla.",
    "real": "Leggere in modo passivo è come guardare il paesaggio dal finestrino: le parole scorrono, ma la mente è altrove. Senza un obiettivo e senza domande da porsi, il testo non lascia traccia. E rileggere nello stesso modo dà solo l'illusione di conoscerlo.",
    "mythT": "Perché “rileggilo un'altra volta” non basta",
    "myth": "Ogni rilettura rende il testo più familiare, e familiare sembra uguale a saputo. Ma riconoscere non è ricordare.",
    "fact": "Unire parole e immagini, ad esempio con mappe e schemi, offre alla memoria due strade per recuperare un'informazione invece di una sola."
   },
   {
    "a": "battery",
    "t": "Dorme poco",
    "q": "Va a letto a mezzanotte con il telefono, e la mattina non si regge in piedi.",
    "real": "Il sonno non è tempo perso: è il momento in cui il cervello fissa quello che si è studiato durante il giorno. Se si dorme poco, il giorno dopo concentrarsi costa più fatica, e anche ricordare diventa più difficile.",
    "mythT": "Perché “recupererà nel weekend” non basta",
    "myth": "Dormire di più la domenica non restituisce le notti brevi della settimana: attenzione e memoria ne risentono giorno per giorno.",
    "fact": "Sonno e memoria sono strettamente collegati: durante la notte i ricordi del giorno vengono consolidati. E la luce degli schermi, la sera, può rendere più difficile addormentarsi."
   },
   {
    "a": "week",
    "t": "Ripassa tutto all'ultimo",
    "q": "Si riduce sempre alla sera prima e prova a ripassare tutto in poche ore.",
    "real": "La memoria di lavoro può gestire poche informazioni alla volta. Quando si prova a ripassare tre capitoli in una sera, i concetti si accavallano e si confondono. Il risultato è una preparazione fragile, che regge male la tensione della verifica.",
    "mythT": "Perché “stanotte ripasso tutto” non basta",
    "myth": "La maratona notturna toglie sonno e lucidità proprio al cervello che dovrà ricordare. Più ore non significa più memoria.",
    "fact": "Mettersi alla prova con domande, invece di rileggere, rafforza il ricordo: è la cosiddetta pratica di recupero. Funziona ancora meglio se distribuita su più giorni."
   }
  ],
  "howTitle": "Un allenamento <em>per attenzione e memoria.</em>",
  "how": [
   "Il Performance Test in 10 minuti: capiamo come studia, quando si distrae e come prova a ricordare.",
   "La tutor personale, psicologa esperta in apprendimento, costruisce un piano con sessioni brevi, pause programmate e ripassi distribuiti.",
   "Nelle lezioni individuali un docente certificato Lambda gli insegna lettura attiva e tecniche di memoria; nei laboratori le allena finché diventano naturali.",
   "Ogni settimana la tutor controlla i progressi, rivede il piano con lui e vi aggiorna, anche sulle regole condivise per telefono e sonno.",
   "Studia meno ore, con il telefono lontano, e ricorda quello che ha studiato. Il ripasso dell'ultima sera diventa un'eccezione."
  ],
  "reviews": [
   "fabio",
   "silvia",
   "irene"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Un docente certificato Lambda fa con lui le lezioni individuali, applicando il metodo alle sue materie. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano, segue i progressi ed è il vostro punto di riferimento."
   ],
   [
    "Non si concentra mai: può essere un disturbo dell'attenzione?",
    "Non possiamo dirlo noi: solo uno specialista può valutarlo, e se ci sono dubbi ve lo consigliamo. Il nostro lavoro è insegnargli strategie concrete per concentrarsi meglio."
   ],
   [
    "Come gestite il telefono?",
    "Con regole concordate con lui, non imposte, e sessioni di studio brevi in cui il telefono sta lontano."
   ],
   [
    "Le tecniche di memoria funzionano davvero?",
    "Sì, se vengono allenate: per questo le pratichiamo nelle lezioni e nei laboratori di metodo, finché diventano naturali."
   ],
   [
    "Online non si distrae ancora di più?",
    "Le lezioni sono live, individuali e interattive, con un docente che lo coinvolge continuamente: non c'è tempo per distrarsi."
   ]
  ]
 },
 "metodo-di-studio": {
  "nums": [
   "studenti a cui abbiamo insegnato un metodo, dalla primaria all'università",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni a insegnare come si studia, non solo cosa"
  ],
  "painTitle": "Studia tanto, ma rende poco? <em>Non è colpa dell'impegno.</em>",
  "painLead": "Quando le ore sui libri non si trasformano in risultati, di solito il problema è nel come si studia. Tocca la situazione che riconosci: ti spieghiamo cosa succede davvero, e perché “studiare di più” spesso non basta.",
  "pains": [
   {
    "a": "slow",
    "t": "Ore sui libri, pochi risultati",
    "q": "Sta sui libri tutto il pomeriggio, ma i voti non arrivano.",
    "real": "Il tempo passato davanti al libro non coincide con il tempo in cui si impara. Senza una strategia, gran parte delle ore se ne va in letture ripetute e passive, che danno la sensazione di lavorare ma lasciano poco in memoria.",
    "mythT": "Perché “studia di più” non basta",
    "myth": "Aggiungere ore a un modo di studiare poco efficace moltiplica la fatica, non i risultati. E toglie tempo al riposo, che serve anche per ricordare.",
    "fact": "Provare a ripetere un argomento senza guardare il libro, invece di rileggerlo, tende a fissarlo meglio nella memoria: è la cosiddetta pratica di recupero."
   },
   {
    "a": "read",
    "t": "Sottolinea tutto, non sa sintetizzare",
    "q": "Il libro è tutto evidenziato, e i riassunti sono lunghi quanto il capitolo.",
    "real": "Sottolineare tutto e riassumere tutto hanno la stessa origine: non sa ancora distinguere l'idea principale dai dettagli. Così evidenziatore e quaderno diventano gesti automatici, che accompagnano la lettura senza aiutare a capirla.",
    "mythT": "Perché “fai un riassunto” non basta",
    "myth": "Se non sa cosa conta, il riassunto diventa una copia del libro: tanta fatica, e alla fine un altro testo lungo da studiare.",
    "fact": "Sottolineare e sintetizzare funzionano meglio dopo una prima lettura, quando si è capito di cosa parla il testo e si può scegliere cosa conta davvero."
   },
   {
    "a": "curve",
    "t": "Dimentica tutto dopo la verifica",
    "q": "Il giorno della verifica sapeva tutto. Una settimana dopo, niente.",
    "real": "Quello che si studia in una volta sola, la sera prima, resta in memoria per poco: abbastanza per la verifica, non per il resto dell'anno. Senza ripassi il ricordo si affievolisce in fretta, e a ogni nuovo argomento si riparte da zero.",
    "mythT": "Perché “l'importante è il voto” non basta",
    "myth": "Il programma si costruisce su quello che viene prima. Ciò che si dimentica oggi torna come lacuna domani, spesso nella verifica più importante.",
    "fact": "È la cosiddetta curva dell'oblio: si dimentica soprattutto nei primi giorni. Brevi ripassi distanziati nel tempo aiutano a ricordare molto più a lungo."
   },
   {
    "a": "heart",
    "t": "Ripete a memoria, poi si blocca",
    "q": "Ripete il libro parola per parola, ma se la domanda cambia va nel pallone.",
    "real": "Imparare a memoria senza capire significa legare il ricordo all'ordine esatto delle parole. Basta una domanda formulata in modo diverso, o un passaggio dimenticato, e il filo si spezza: per questo all'interrogazione arriva il vuoto.",
    "mythT": "Perché “ripetilo finché non lo sai” non basta",
    "myth": "Ripetere meccanicamente allena la memoria delle parole, non la comprensione. E più il programma si allunga, più questo modo di studiare diventa faticoso.",
    "fact": "Spiegare un argomento con parole proprie, come se lo si insegnasse a qualcun altro, è uno dei modi più efficaci per capire e ricordare insieme."
   },
   {
    "a": "grades",
    "t": "Prima andava bene, ora non più",
    "q": "L'anno scorso andava bene. Adesso, con lo stesso impegno, prende voti bassi.",
    "real": "Un metodo che basta con pochi argomenti e pagine brevi non regge quando i programmi si allungano e le materie si moltiplicano. Non è cambiato l'impegno di tuo figlio: è cambiata la quantità, e il suo modo di studiare non si è adattato.",
    "mythT": "Perché “prima ce la facevi” non basta",
    "myth": "Ricordargli i successi passati, senza dargli strumenti nuovi, rischia solo di fargli pensare di non essere più capace.",
    "fact": "Il metodo di studio non è un talento innato: è un insieme di abilità che si imparano e si aggiornano, man mano che la scuola chiede di più."
   },
   {
    "a": "battery",
    "t": "Si è convinto di non essere portato",
    "q": "Ormai dice che lui per lo studio non è portato.",
    "real": "Quando a tanto impegno corrispondono pochi risultati, la conclusione più facile è “il problema sono io”. È una convinzione che pesa: abbassa le aspettative, riduce lo sforzo, e i voti finiscono per confermarla.",
    "mythT": "Perché “ma tu sei intelligente” non basta",
    "myth": "La rassicurazione fa piacere, ma non spiega perché i risultati non arrivano. Per crederci davvero, gli servono prove concrete di riuscire.",
    "fact": "La fiducia nelle proprie capacità, che gli psicologi chiamano autoefficacia, cresce soprattutto con esperienze di successo vissute in prima persona."
   }
  ],
  "howTitle": "Dallo studiare tanto <em>allo studiare bene.</em>",
  "how": [
   "Il Performance Test fotografa come studia oggi: dove perde tempo e quale abilità del Metodo FOCUS allenare per prima.",
   "La tutor personale, psicologa esperta in apprendimento, trasforma i risultati in un piano su misura, con obiettivi chiari.",
   "Nelle lezioni individuali un docente certificato Lambda gli insegna a leggere, sintetizzare e ripetere, lavorando sui suoi libri di scuola.",
   "Ogni settimana la tutor verifica quali tecniche funzionano, corregge la rotta e vi tiene aggiornati.",
   "Studia in meno tempo, ricorda più a lungo e usa il metodo da solo, in ogni materia."
  ],
  "reviews": [
   "irene",
   "silvia",
   "fabio"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Un docente certificato Lambda, formato sul Metodo FOCUS, gli insegna le tecniche nelle lezioni individuali, applicandole alle sue materie. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano, segue i progressi ogni settimana ed è il vostro punto di riferimento."
   ],
   [
    "In cosa è diverso dalle ripetizioni?",
    "Le ripetizioni recuperano le lacune in una materia. Il metodo aiuta in tutte: insegna come si studia, così non resta più indietro. Da noi non dovete scegliere: siamo i primi a unire le due cose, con docenti che lavorano sulla materia applicando il metodo."
   ],
   [
    "Quanto tempo serve per impararlo?",
    "Le prime tecniche si usano già dalle prime settimane; perché diventino abitudine serve qualche mese di allenamento costante, con i docenti nelle lezioni e la tutor che ne segue i progressi."
   ],
   [
    "Va bene a tutte le età?",
    "Sì, dalla primaria all'università: cambiano gli strumenti, non i principi."
   ],
   [
    "Cos'è esattamente il Metodo FOCUS?",
    "È il nostro metodo: Fiducia, Organizzazione, Comprensione, Uso consapevole degli strumenti, Sicurezza nell'esposizione. Il Performance Test misura da quale abilità partire."
   ]
  ]
 },
 "organizzazione": {
  "nums": [
   "studenti seguiti, dalla primaria all'università",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni ad aiutare ragazzi e famiglie a ritrovare i pomeriggi"
  ],
  "painTitle": "Sempre di corsa, sempre all'ultimo? <em>Non è una questione di carattere.</em>",
  "painLead": "Organizzarsi è un'abilità che si impara, non un tratto di carattere. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “organizzati meglio” spesso non basta.",
  "pains": [
   {
    "a": "week",
    "t": "Tutto all'ultimo momento",
    "q": "Scopre alle dieci di sera che domani ha la verifica.",
    "real": "Chi non pianifica vive la settimana giorno per giorno: affronta solo quello che scade domani, e il resto resta invisibile finché non diventa urgente. Così le verifiche arrivano sempre “all'improvviso”, anche se erano segnate da giorni.",
    "mythT": "Perché “guarda il diario più spesso” non basta",
    "myth": "Il diario dice cosa c'è da fare, non quando farlo. Senza un piano che distribuisca il lavoro, l'informazione resta lì e l'urgenza arriva comunque.",
    "fact": "Distribuire lo studio di una verifica su più giorni, invece di concentrarlo la sera prima, aiuta a ricordare di più e con meno fatica."
   },
   {
    "a": "bag",
    "t": "Il diario non serve a niente",
    "q": "Il diario ce l'ha, ma è vuoto. O pieno di cose che non guarda mai.",
    "real": "Il diario è un archivio: registra i compiti, ma non dice da dove cominciare né quanto tempo dedicare a ciascuno. Senza il passaggio dalla lista al piano, le annotazioni si perdono e le cose da fare si dimenticano.",
    "mythT": "Perché “scrivi tutto sul diario” non basta",
    "myth": "Annotare è il primo passo, ma non è organizzarsi. Una lista lunga e senza priorità può persino scoraggiare, e finisce per non essere più guardata.",
    "fact": "Trasformare un elenco di compiti in un piano, con giorni e orari, rende molto più probabile passare all'azione: è un'abitudine che si allena."
   },
   {
    "a": "slow",
    "t": "Pomeriggi che non finiscono mai",
    "q": "Si siede alle tre, e alle nove di sera è ancora sui libri.",
    "real": "Un pomeriggio senza struttura si allunga da solo: si salta da un compito all'altro, ci si interrompe, si riparte da capo. Senza un orario di fine non c'è motivo di andare spediti, e il lavoro riempie tutto il tempo disponibile.",
    "mythT": "Perché “almeno sta sui libri” non basta",
    "myth": "Il tempo alla scrivania non è tempo di studio efficace. Ore senza pause riducono attenzione e resa, e tolgono spazio a riposo, sport e amici.",
    "fact": "Blocchi di lavoro definiti, con brevi pause e un orario di fine stabilito in anticipo, aiutano a mantenere la concentrazione e a lavorare meglio."
   },
   {
    "a": "heart",
    "t": "Non sa quanto tempo gli serve",
    "q": "Dice «ci metto mezz'ora», e poi ci mette tre ore.",
    "real": "Stimare quanto richiede un compito è difficile per tutti: tendiamo a immaginare lo scenario migliore, senza imprevisti. Nei ragazzi l'errore è più grande, perché conoscono ancora poco i propri tempi, e il piano salta prima di cominciare.",
    "mythT": "Perché “calcola meglio” non basta",
    "myth": "Senza un riscontro la stima non migliora: serve confrontare ogni volta il tempo previsto con quello reale, finché le previsioni diventano affidabili.",
    "fact": "Gli psicologi la chiamano fallacia della pianificazione: tutti tendiamo a sottostimare il tempo necessario. Annotare i tempi reali aiuta a prevedere meglio."
   },
   {
    "a": "storm",
    "t": "Sport e studio si scontrano",
    "q": "Tra allenamenti e partite non ha mai tempo. Pensiamo di fargli lasciare lo sport.",
    "real": "Quando lo studio non ha spazi fissi, ogni impegno sembra rubargli tempo, e lo sport diventa il primo indiziato. Spesso però il problema è la mancanza di un piano che parta dagli impegni fissi e organizzi lo studio intorno a loro.",
    "mythT": "Perché “lascia lo sport” non basta",
    "myth": "Togliere lo sport libera ore, ma non insegna a usarle: il tempo guadagnato rischia di disperdersi come prima. E si perde un'attività che fa bene a corpo e umore.",
    "fact": "L'attività fisica regolare è associata a più benessere e può favorire attenzione e umore: con un piano, sport e studio possono convivere."
   },
   {
    "a": "focus",
    "t": "Rimanda di continuo",
    "q": "Dice sempre «dopo», e intanto il pomeriggio passa.",
    "real": "Rimandare raramente è pigrizia: spesso nasce da un compito percepito come troppo grande o poco chiaro. Non sapendo da dove cominciare, la mente cerca qualcosa di più facile, e il telefono è sempre a portata di mano.",
    "mythT": "Perché “mettiti lì e comincia” non basta",
    "myth": "L'ordine generico non scioglie il blocco: il compito resta grande e indistinto. Aiuta invece sapere qual è il primo passo, piccolo e concreto.",
    "fact": "Decidere in anticipo quando, dove e come svolgere un compito (“alle 15, alla scrivania, esercizi 1-5”) rende più probabile iniziarlo davvero."
   },
   {
    "a": "alone",
    "t": "Senza di me non si organizza",
    "q": "Se non gli preparo io la scaletta del pomeriggio, non combina niente.",
    "real": "Quando è il genitore a decidere ordine e tempi, il ragazzo esegue ma non impara a pianificare. Funziona finché c'è qualcuno a farlo per lui; appena l'adulto si allontana, o le richieste crescono, l'organizzazione crolla.",
    "mythT": "Perché “ci penso io” non basta",
    "myth": "Organizzare al posto suo risolve la giornata, non il problema. E trasforma il genitore in controllore, con discussioni quotidiane per tutti.",
    "fact": "La capacità di pianificare matura con la pratica: un piano costruito dal ragazzo, poi verificato e corretto, sviluppa più autonomia di uno ricevuto già pronto."
   }
  ],
  "howTitle": "Dalla corsa dell'ultimo minuto <em>a una settimana sotto controllo.</em>",
  "how": [
   "Il Performance Test mostra come gestisce oggi tempi e impegni, e dove la sua settimana si inceppa.",
   "La tutor personale, psicologa esperta in apprendimento, costruisce con lui il primo piano settimanale, partendo da scuola, sport e tempo libero.",
   "Nelle lezioni con un docente certificato Lambda impara a usare diario e planner, stimare i tempi e studiare a blocchi, sulle sue materie.",
   "Ogni settimana la tutor rivede il piano con lui: cosa ha funzionato, cosa cambiare. E voi ricevete gli aggiornamenti.",
   "Arriva alle verifiche preparato, finisce prima e ritrova il tempo per sport e amici."
  ],
  "reviews": [
   "silvia",
   "irene",
   "fabio"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Una tutor personale, psicologa esperta in apprendimento, costruisce con lui il piano settimanale, lo rivede ogni settimana ed è il vostro punto di riferimento. Un docente certificato Lambda, nelle lezioni individuali, gli insegna a organizzare lo studio delle sue materie applicando il metodo."
   ],
   [
    "Non basta un diario?",
    "Il diario è lo strumento; quello che manca è il metodo per usarlo. Gli insegniamo a pianificare, non solo ad annotare."
   ],
   [
    "E lo sport?",
    "Lo sport resta: il piano parte proprio dagli impegni fissi, e lo studio si organizza intorno."
   ],
   [
    "Quanto tempo serve?",
    "Il primo piano si costruisce subito, nelle prime settimane; perché diventi un'abitudine servono alcune settimane di pratica costante."
   ],
   [
    "Chi controlla che rispetti il piano?",
    "La tutor segue i progressi ogni settimana e aggiusta il piano insieme a lui, così impara a rispettarlo da solo. Voi ricevete gli aggiornamenti, senza dover fare i controllori."
   ]
  ]
 },
 "recupero-insufficienze": {
  "nums": [
   "studenti seguiti, anche nel recupero delle materie a rischio",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi e famiglie, anche negli anni più difficili"
  ],
  "painTitle": "Le insufficienze si accumulano? <em>Non è una sentenza.</em>",
  "painLead": "Dietro un voto in calo c'è quasi sempre una causa che si può individuare. Tocca la situazione che state vivendo: ti spieghiamo cosa succede davvero, e perché le soluzioni d'istinto spesso non bastano.",
  "pains": [
   {
    "a": "grades",
    "t": "I voti calano, materia dopo materia",
    "q": "A inizio anno andava bene. Adesso le insufficienze sono quattro.",
    "real": "Raramente i voti crollano all'improvviso: di solito una prima difficoltà toglie tempo e serenità alle altre materie, e il calo si allarga. Quando le insufficienze sono più di una, spesso il problema non è la singola materia, ma il modo di studiare.",
    "mythT": "Perché “recuperale tutte insieme” non basta",
    "myth": "Affrontare tutto contemporaneamente disperde le energie: piccoli progressi ovunque, ma insufficienti ovunque. Servono priorità chiare.",
    "fact": "Davanti a richieste troppe e indistinte si tende a rimandare. Suddividere il lavoro in obiettivi piccoli e definiti rende più facile cominciare e andare avanti."
   },
   {
    "a": "week",
    "t": "Studia solo all'ultimo minuto",
    "q": "Si mette a studiare solo la sera prima della verifica.",
    "real": "Studiare all'ultimo momento comprime tutto in poche ore: si legge in fretta, si memorizza senza capire, si dorme poco. Il voto che ne esce è spesso basso e, anche quando si salva, quello che si è imparato svanisce in pochi giorni.",
    "mythT": "Perché “stasera stai su finché non lo sai” non basta",
    "myth": "Le ore tolte al sonno costano care: la stanchezza peggiora attenzione e memoria proprio il giorno della verifica.",
    "fact": "Il sonno ha un ruolo importante nel consolidare i ricordi: dormire bene dopo aver studiato aiuta a trattenere quello che si è imparato."
   },
   {
    "a": "curve",
    "t": "Recupera il voto, poi ricade",
    "q": "Il secondo quadrimestre l'ha salvato. Ma l'anno dopo, di nuovo da capo.",
    "real": "Un recupero mirato solo all'ultima verifica riporta il voto sopra il sei, ma lascia intatte le basi mancanti e il modo di studiare che le ha create. Al primo argomento più impegnativo, la difficoltà si ripresenta.",
    "mythT": "Perché “l'importante è arrivare al sei” non basta",
    "myth": "Un sei raggiunto di corsa è fragile: basta un programma più lungo o una verifica più difficile per ritrovarsi sotto.",
    "fact": "Le conoscenze ripassate a distanza di tempo, e non solo prima della prova, restano disponibili più a lungo e fanno da base agli argomenti successivi."
   },
   {
    "a": "heart",
    "t": "Il debito a giugno",
    "q": "Ha il debito, e l'estate sembra già rovinata.",
    "real": "Un debito vissuto come una punizione porta spesso a due estremi: rimandare tutto ad agosto, oppure passare l'estate sui libri senza un piano. In entrambi i casi si arriva a settembre stanchi e con poca fiducia.",
    "mythT": "Perché “studierà tutta l'estate” non basta",
    "myth": "Tante ore senza un obiettivo chiaro stancano senza preparare davvero. E senza riposo, la motivazione si esaurisce prima dell'esame.",
    "fact": "Sessioni di studio regolari e non troppo lunghe, alternate al riposo, tendono a funzionare meglio di lunghe maratone concentrate in poche settimane."
   },
   {
    "a": "battery",
    "t": "Ha perso la motivazione",
    "q": "Ha smesso di provarci: dice che tanto non serve a niente.",
    "real": "Dopo una serie di insufficienze, molti ragazzi smettono di collegare l'impegno al risultato: “tanto vado male comunque”. Non è svogliatezza, è un modo per proteggersi dalla delusione, che però blocca ogni tentativo di recupero.",
    "mythT": "Perché “se ti impegni ce la fai” non basta",
    "myth": "Lui ha la sensazione di averci già provato. Per ripartire non gli servono altre parole, ma la prova che, con un modo diverso, il risultato arriva.",
    "fact": "Gli psicologi chiamano autoefficacia la convinzione di potercela fare: si ricostruisce soprattutto con successi concreti, anche piccoli, ottenuti in prima persona."
   },
   {
    "a": "storm",
    "t": "A casa si litiga per la scuola",
    "q": "Ogni voto diventa una discussione, e a cena non si parla d'altro.",
    "real": "Quando i voti calano, è naturale che la preoccupazione dei genitori cresca e diventi controllo. Il ragazzo però vive ogni domanda come un giudizio, si chiude e racconta sempre meno: la scuola diventa terreno di scontro, e lo studio ne risente.",
    "mythT": "Perché “più controllo” non basta",
    "myth": "Controllare diario e registro ogni giorno dà l'illusione di avere la situazione in mano, ma aumenta la tensione e toglie al ragazzo la responsabilità del suo recupero.",
    "fact": "Tensione e stress prolungati rendono più difficile concentrarsi e ricordare: un clima più sereno in casa è parte del recupero, non un dettaglio."
   }
  ],
  "howTitle": "Dall'insufficienza alla sufficienza. <em>Con un piano, non di corsa.</em>",
  "how": [
   "Il Performance Test, insieme alle pagelle, ci dice quali materie sono a rischio e da dove nascono le difficoltà.",
   "La tutor personale, psicologa esperta in apprendimento, costruisce un piano di recupero con priorità e scadenze: verifiche, pagelle, esami di riparazione.",
   "Nelle lezioni individuali i docenti certificati Lambda ricostruiscono le basi che mancano, materia per materia, applicando il metodo.",
   "Ogni settimana la tutor controlla i progressi, rivede le priorità e vi aggiorna: a casa non dovete più fare i controllori.",
   "Recupera le insufficienze e, con un metodo suo, smette di ritrovarsi a rischio a ogni fine anno."
  ],
  "reviews": [
   "elisabetta",
   "simona",
   "silvia"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. I docenti certificati Lambda fanno con lui le lezioni individuali nelle materie da recuperare, applicando il metodo. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano di recupero, segue i progressi ogni settimana ed è il vostro punto di riferimento."
   ],
   [
    "Si può recuperare anche a metà anno?",
    "Sì, e prima si interviene meglio è. Il piano parte dalle scadenze: verifiche, pagelle, esami di riparazione."
   ],
   [
    "E se il debito è già arrivato?",
    "Prepariamo l'esame di settembre con un piano estivo e verifiche di allenamento, lasciando spazio anche al riposo."
   ],
   [
    "Quanto tempo ci vuole?",
    "Dipende dalle lacune: nella consegna del Performance Test la tutor vi indica obiettivi e tempi realistici, senza promesse facili."
   ],
   [
    "Bastano le ripetizioni?",
    "Le ripetizioni recuperano la materia; il metodo evita di ricadere. Noi siamo i primi a unire le due cose: i docenti lavorano sulle materie a rischio e, intanto, gli insegnano come studiarle."
   ]
  ]
 },
 "ripetizioni": {
  "nums": [
   "studenti seguiti, tra ripetizioni e metodo di studio",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni a recuperare materie, e a insegnare come studiarle"
  ],
  "painTitle": "Le ripetizioni aiutano, ma non bastano? <em>C'è un motivo.</em>",
  "painLead": "Quando una materia resta difficile nonostante l'aiuto, la causa di solito è precisa. Tocca la situazione che riconosci: ti spieghiamo cosa succede davvero, e perché “qualche ora in più” spesso non basta.",
  "pains": [
   {
    "a": "grades",
    "t": "Le lacune si accumulano",
    "q": "In matematica non ha capito una cosa due anni fa, e da lì è crollato tutto.",
    "real": "Molte materie sono costruite a strati: ogni argomento poggia su quello precedente. Se una base manca, i nuovi argomenti non trovano dove appoggiarsi, e la difficoltà cresce di anno in anno, anche con lo stesso impegno.",
    "mythT": "Perché “ripassa l'ultimo capitolo” non basta",
    "myth": "Lavorare solo sull'argomento della prossima verifica tampona il problema, ma lascia la lacuna di partenza dov'era: tornerà al capitolo successivo.",
    "fact": "In didattica si parla di prerequisiti: verificare che le basi siano solide prima di affrontare un argomento nuovo rende l'apprendimento molto più stabile."
   },
   {
    "a": "curve",
    "t": "Recupera, poi ricade",
    "q": "Ogni anno le ripetizioni a maggio. E a settembre si ricomincia.",
    "real": "Un recupero fatto di corsa, a ridosso della scadenza, porta il voto ma raramente consolida le conoscenze. Passata la verifica, quello che si è imparato in fretta si dimentica, e il ciclo riparte con l'argomento successivo.",
    "mythT": "Perché “le facciamo anche quest'anno” non basta",
    "myth": "Ripetere lo stesso schema ogni anno risolve l'emergenza, non la causa. Se nessuno gli insegna come studiare quella materia, il bisogno di aiuto si ripresenta puntuale.",
    "fact": "Lo studio distribuito nel tempo, con ripassi a distanza di giorni, tende a lasciare ricordi più duraturi dello studio concentrato tutto nello stesso periodo."
   },
   {
    "a": "alone",
    "t": "Dipende dall'insegnante privato",
    "q": "Senza l'insegnante accanto non apre nemmeno il libro.",
    "real": "Se a lezione è sempre l'insegnante a guidare, a scegliere l'esercizio e a correggere, il ragazzo impara a seguire, non a fare. Così l'aiuto, invece di renderlo autonomo, diventa una stampella di cui non riesce più a fare a meno.",
    "mythT": "Perché “aumentiamo le ore” non basta",
    "myth": "Più ore guidate significano meno occasioni per provarci da solo. La dipendenza rischia di crescere insieme al numero di lezioni.",
    "fact": "L'aiuto più efficace si riduce un po' alla volta: prima si mostra come si fa, poi si guida, infine si lascia lavorare da soli e si verifica."
   },
   {
    "a": "storm",
    "t": "Capisce a lezione, ma non da solo",
    "q": "Durante la lezione capisce tutto. Poi a casa non sa rifare gli esercizi.",
    "real": "Capire una spiegazione e saper rifare da soli un esercizio sono due abilità diverse. A lezione il ragionamento lo guida qualcun altro; a casa deve ricostruirlo da sé, e lì emergono i passaggi che non erano davvero chiari.",
    "mythT": "Perché “ma l'avevi capito, no?” non basta",
    "myth": "Seguire un ragionamento è molto più facile che produrlo. Solo la pratica in autonomia mostra cosa è stato davvero appreso.",
    "fact": "Si parla di illusione di competenza: ciò che sembra chiaro mentre lo si ascolta può non esserlo quando si prova a farlo da soli."
   },
   {
    "a": "week",
    "t": "Ripetizioni solo d'emergenza",
    "q": "Ci accorgiamo che è in difficoltà solo quando la verifica è dopodomani.",
    "real": "Quando l'aiuto arriva solo a ridosso della verifica, non c'è tempo per capire: si punta a “passare”, imparando procedure a memoria. E il ragazzo entra in classe con l'ansia di chi sa di aver preparato tutto di corsa.",
    "mythT": "Perché “una lezione intensiva il giorno prima” non basta",
    "myth": "Due ore la sera prima possono salvare un voto, ma non costruiscono una comprensione che regge. Alla verifica successiva si ricomincia da capo.",
    "fact": "Distribuire il lavoro su più giorni, anche con sessioni brevi, lascia alla mente il tempo di consolidare quello che ha imparato, anche durante il sonno."
   },
   {
    "a": "battery",
    "t": "Non è portato per quella materia",
    "q": "Dice che la matematica non fa per lui, e ha smesso di provarci.",
    "real": "Dopo tanti tentativi andati male, molti ragazzi smettono di vedere la materia come qualcosa da imparare e la vivono come un limite personale. A quel punto evitano gli esercizi, e la lacuna cresce proprio perché non ci provano più.",
    "mythT": "Perché “non tutti sono portati” non basta",
    "myth": "Accettare l'etichetta sembra togliere pressione, ma chiude la porta: se non è portato, non vale la pena provare. E senza pratica le difficoltà restano.",
    "fact": "La fiducia in una materia torna soprattutto con successi concreti: un esercizio risolto da soli convince più di qualsiasi incoraggiamento."
   }
  ],
  "howTitle": "Recuperare oggi, <em>e non restare indietro domani.</em>",
  "how": [
   "Il Performance Test e il confronto con voi mostrano dove sono le lacune e da quanto tempo si trascinano.",
   "La tutor personale, psicologa esperta in apprendimento, fissa le priorità: quali basi ricostruire prima, e con quali tempi.",
   "Un docente certificato Lambda fa ripetizioni individuali nella materia: spiega la teoria e, insieme, gli insegna come studiarla da solo.",
   "Settimana dopo settimana la tutor controlla che lavori in modo sempre più autonomo, e vi tiene aggiornati.",
   "Basi solide ed esercizi svolti da solo: arriva alle verifiche preparato, senza corse dell'ultimo minuto."
  ],
  "reviews": [
   "simona",
   "irene",
   "fabio"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. Le ripetizioni le fa un docente certificato Lambda, con lezioni individuali live in cui recupera la materia applicando il metodo di studio. Una tutor personale, psicologa esperta in apprendimento, costruisce il piano, segue i progressi ogni settimana e resta il vostro punto di riferimento per tutto il percorso."
   ],
   [
    "In cosa siete diversi da un insegnante privato?",
    "Siamo i primi a unire le ripetizioni tradizionali al metodo di studio: mentre recupera la materia, impara anche come studiarla, così non dipende dall'aiuto per sempre. E non è solo: la tutor coordina il percorso e vi aggiorna sui progressi."
   ],
   [
    "In quali materie fate ripetizioni?",
    "Nelle materie scolastiche dove serve. Nella consegna del Performance Test vi diciamo con chiarezza su quali materie lavoreremo e come."
   ],
   [
    "Le lezioni sono individuali?",
    "Sì: le ripetizioni sono sempre 1 a 1, live e online, dal lunedì al sabato. In più può studiare nelle aule studio online, dove applica il metodo in autonomia con un docente sempre collegato a cui chiedere aiuto."
   ],
   [
    "Si possono fare solo prima di una verifica?",
    "Si può, ma funzionano meglio con continuità: così si recuperano le basi, non solo la verifica."
   ]
  ]
 },
 "superiore": {
  "nums": [
   "studenti seguiti, dalla primaria all'università",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi e famiglie, fino alla maturità e oltre"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Non è svogliatezza.</em>",
  "painLead": "Alle superiori molte difficoltà hanno la stessa radice: un metodo che non regge più il carico. Tocca la situazione che vivete a casa: ti spieghiamo cosa succede davvero, e perché “studiare di più” spesso non basta.",
  "pains": [
   {
    "a": "slow",
    "t": "Studia ore, ma i voti non salgono",
    "q": "Passa tutto il pomeriggio sui libri. Ma i voti non arrivano.",
    "real": "Alle superiori il tempo sui libri conta meno del modo in cui viene usato. Se studia leggendo e rileggendo, o ripetendo a memoria parola per parola, lavora tanto ma trattiene poco, e alla verifica fatica a ragionare sui contenuti.",
    "mythT": "Perché “deve studiare di più” non basta",
    "myth": "Aggiungere ore a un metodo che non funziona aumenta la fatica, non i risultati, e alimenta la convinzione di “non essere portato”.",
    "fact": "Le strategie che sembrano più faticose, come ripetere senza libro o spiegare ad alta voce, sono spesso quelle che fanno ricordare meglio e più a lungo."
   },
   {
    "a": "week",
    "t": "Si riduce sempre all'ultimo",
    "q": "Studia tutto la sera prima, a volte fino a notte.",
    "real": "Con tante materie e verifiche ravvicinate, senza un piano lo studio segue l'urgenza: si prepara solo quello che c'è domani. Il resto si accumula, e la settimana diventa una rincorsa continua.",
    "mythT": "Perché “organizzati meglio” non basta",
    "myth": "È il consiglio giusto, ma nessuno gli ha mostrato come si fa: quanto tempo serve, cosa viene prima, come si distribuisce un capitolo nella settimana.",
    "fact": "Lo studio distribuito su più giorni porta a ricordi più stabili di quello concentrato in una sola sessione: è uno dei risultati più solidi della ricerca sull'apprendimento."
   },
   {
    "a": "curve",
    "t": "Dopo la verifica ha già dimenticato tutto",
    "q": "Il giorno dopo la verifica non ricorda più niente.",
    "real": "Ciò che si impara in fretta la sera prima resta in memoria per poco: basta per la prova, poi svanisce. Il problema emerge dopo, quando quegli argomenti tornano all'interrogazione, nel programma dell'anno successivo o alla maturità.",
    "mythT": "Perché “l'importante è il voto” non basta",
    "myth": "Il voto può arrivare, ma senza ricordi stabili ogni argomento va ristudiato da capo, e le lacune si sommano anno dopo anno.",
    "fact": "Senza ripasso, gran parte di ciò che si studia si perde nei giorni successivi: è la curva dell'oblio. Brevi ripassi a intervalli rallentano molto questa perdita."
   },
   {
    "a": "grades",
    "t": "Ha materie a rischio debito",
    "q": "A fine quadrimestre ha due insufficienze e rischia il debito.",
    "real": "Un'insufficienza raramente nasce dall'ultimo argomento: spesso è il risultato di basi fragili che si trascinano da tempo, soprattutto in materie cumulative come matematica, latino o lingue. Ogni nuovo capitolo poggia su qualcosa che manca.",
    "mythT": "Perché “qualche ripetizione prima della verifica” non basta",
    "myth": "Il recupero d'emergenza salva la singola prova, ma se le basi restano fragili la difficoltà si ripresenta al capitolo successivo.",
    "fact": "Nelle materie in cui ogni argomento si costruisce sul precedente, colmare una lacuna di base spesso sblocca più di molte ore spese sugli argomenti nuovi."
   },
   {
    "a": "bored",
    "t": "Ha perso la motivazione",
    "q": "Non gli interessa più niente. Dice che tanto non serve.",
    "real": "Dopo una serie di risultati deludenti, molti ragazzi smettono di investire: se l'impegno non porta a nulla, il disinteresse diventa una protezione. Dietro il “non mi importa” c'è spesso un “non credo di farcela”.",
    "mythT": "Perché “pensa al tuo futuro” non basta",
    "myth": "A quest'età il futuro è lontano e astratto. La motivazione si accende con risultati vicini e concreti, non con le prediche.",
    "fact": "La fiducia nelle proprie capacità è tra i fattori più legati alla motivazione nello studio, e cresce soprattutto con esperienze di successo concrete."
   },
   {
    "a": "read",
    "t": "Il metodo delle medie non regge più",
    "q": "Alle medie andava bene. Con le superiori è un disastro.",
    "real": "Alle superiori i testi sono più lunghi e astratti, e le verifiche chiedono di collegare e argomentare, non solo ripetere. Il metodo che funzionava alle medie, imparare il paragrafo e ridirlo, non regge più il carico.",
    "mythT": "Perché “prima ce la faceva, quindi è pigro” non basta",
    "myth": "Non è cambiato lui, è cambiata la richiesta. Serve un metodo più adulto: selezionare, sintetizzare, collegare.",
    "fact": "Riassumere con parole proprie e costruire schemi obbliga a rielaborare il contenuto, e ciò che viene rielaborato in profondità tende a essere ricordato meglio."
   },
   {
    "a": "focus",
    "t": "Studia con il telefono accanto",
    "q": "Ogni volta che entro in camera, lo trovo con il telefono in mano.",
    "real": "Ogni notifica interrompe il lavoro, e riprendere il filo costa tempo ed energia: a fine pomeriggio le ore sui libri sono tante, quelle di vera concentrazione poche. Non è solo questione di volontà: lo smartphone è fatto per attirare l'attenzione.",
    "mythT": "Perché “togligli il telefono” non basta",
    "myth": "Vietare senza costruire un'alternativa crea scontri e non insegna a gestirsi: quando il telefono torna, torna anche la distrazione.",
    "fact": "Passare di continuo da un'attività all'altra ha un costo: il cervello impiega tempo a rientrare nel compito. Tenere il telefono fuori dalla vista aiuta."
   }
  ],
  "howTitle": "Un percorso <em>per studiare meglio, non di più.</em>",
  "how": [
   "Il Performance Test in dieci minuti, poi una videochiamata con la tutor: capiamo dove si inceppa il suo modo di studiare.",
   "La tutor personale, psicologa esperta in apprendimento, imposta un piano settimanale che tiene conto di verifiche, interrogazioni e impegni.",
   "Lezioni individuali live con docenti certificati Lambda: ripetizioni nelle materie critiche e il Metodo FOCUS applicato a ogni programma.",
   "Ogni settimana la tutor controlla i progressi, corregge la rotta e vi aggiorna su come sta andando.",
   "Studia in meno tempo, ricorda più a lungo e affronta verifiche e debiti con un piano, non all'ultimo minuto."
  ],
  "reviews": [
   "elisabetta",
   "simona",
   "irene"
  ],
  "faq": [
   [
    "Chi segue mio figlio?",
    "Due figure. I docenti certificati Lambda fanno con lui le lezioni individuali, comprese le ripetizioni, applicando il metodo alle sue materie. La tutor personale, psicologa esperta in apprendimento, costruisce il piano di studio, segue i progressi ogni settimana ed è il vostro punto di riferimento."
   ],
   [
    "Fate anche ripetizioni nelle singole materie?",
    "Sì. Nelle materie critiche i nostri docenti fanno ripetizioni applicando il metodo: così recupera la materia e, intanto, impara a studiarla da solo."
   ],
   [
    "Quanto tempo serve per vedere i risultati?",
    "Di solito le prime differenze nell'organizzazione si vedono già nelle prime settimane. Sui voti dipende dal punto di partenza: la tutor vi indica obiettivi e tempi chiari fin dalla consegna del test."
   ],
   [
    "Le lezioni sono online: funziona davvero?",
    "Sì: le lezioni sono live e individuali, con un docente che lo conosce per nome. In più niente spostamenti: il tempo risparmiato diventa tempo libero."
   ],
   [
    "E se ha già debiti a fine anno?",
    "Costruiamo un piano estivo mirato sulle materie da recuperare, con lezioni individuali e verifiche di allenamento prima dell'esame di settembre."
   ]
  ]
 },
 "test-universitari": {
  "nums": [
   "studenti seguiti, dalla scuola all'università",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a ragazzi e famiglie nelle scelte che contano"
  ],
  "painTitle": "Riconosci tuo figlio? <em>Non è questione di talento.</em>",
  "painLead": "Il semestre filtro misura non solo cosa sai, ma come studi in tre mesi intensi e come gestisci tre esami a tempo. Tocca la situazione che riconosci: ti spieghiamo cosa succede davvero, e perché “studiare di più” spesso non basta.",
  "pains": [
   {
    "a": "bag",
    "t": "Le basi di chimica e fisica sono fragili",
    "q": "Al liceo chimica e fisica le ha fatte poco. Ora sono due esami su tre.",
    "real": "Le lezioni del semestre filtro danno per scontate molte basi delle superiori. Chi parte con lacune in chimica o fisica passa le prime settimane a rincorrere, mentre il programma va avanti.",
    "mythT": "Perché “le recupererà durante le lezioni” non basta",
    "myth": "Il semestre dura pochi mesi: recuperare le basi e seguire il programma nello stesso tempo è la situazione più faticosa. Conviene arrivare a settembre con le fondamenta già solide.",
    "fact": "Le conoscenze nuove si fissano meglio quando si agganciano a quelle che già si hanno: per questo le basi solide rendono più veloce tutto lo studio successivo."
   },
   {
    "a": "slow",
    "t": "Il tempo finisce sempre a metà",
    "q": "Alle simulazioni non arriva mai in fondo: 50 minuti volano.",
    "real": "Ogni esame ha 31 domande in 50 minuti: poco più di un minuto e mezzo a domanda. Chi affronta ogni quesito con la stessa cura si blocca su quelli difficili e perde quelli facili.",
    "mythT": "Perché “devi andare più veloce” non basta",
    "myth": "La fretta aumenta gli errori di lettura. Serve una strategia: quali domande affrontare subito, quando passare oltre, quando tornare indietro.",
    "fact": "Allenarsi con prove a tempo, nelle stesse condizioni dell'esame, rende più automatiche le decisioni e lascia più energie per ragionare."
   },
   {
    "a": "read",
    "t": "Sbaglia le domande a completamento",
    "q": "Con le crocette se la cava. Quando deve scrivere la risposta, si blocca.",
    "real": "Dieci domande su 31 sono a completamento: non c'è un'opzione da riconoscere, la risposta va richiamata dalla memoria e scritta in modo preciso. È un'abilità diversa dal riconoscere quella giusta tra quattro.",
    "mythT": "Perché “fai più quiz a crocette” non basta",
    "myth": "Le crocette allenano il riconoscimento, non il richiamo. Per le domande a completamento bisogna esercitarsi proprio a recuperare le informazioni senza aiuti.",
    "fact": "Provare a richiamare un'informazione, invece di rileggerla, è uno dei modi più efficaci per ricordarla a lungo: si chiama pratica di recupero."
   },
   {
    "a": "heart",
    "t": "Si agita e sbaglia sotto pressione",
    "q": "A casa va bene. Nella simulazione cronometrata si agita e sbaglia.",
    "real": "Tre esami nella stessa giornata, una graduatoria nazionale e la sensazione di giocarsi tutto: questa pressione può assorbire attenzione e memoria proprio quando servono, anche in chi è preparato.",
    "mythT": "Perché “non pensarci troppo” non basta",
    "myth": "Non pensarci non si può. La tensione si gestisce allenandosi in condizioni simili al giorno dell'esame, finché la situazione diventa familiare.",
    "fact": "Le simulazioni realistiche non servono solo a ripassare: abituarsi a formato e tempi riduce l'incertezza, una delle principali fonti di tensione."
   },
   {
    "a": "week",
    "t": "Studia senza un piano",
    "q": "Segue le lezioni, ma non sa cosa ripassare e quando.",
    "real": "Tre materie in parallelo, lezioni ogni giorno e gli esami già a dicembre. Senza un piano a ritroso dalle date degli appelli, si studia ciò che viene meglio e le materie deboli restano scoperte fino alla fine.",
    "mythT": "Perché “basta seguire le lezioni” non basta",
    "myth": "Le lezioni spiegano il programma, ma non organizzano lo studio personale né il ripasso. Quello va pianificato, settimana per settimana.",
    "fact": "Ripassare gli stessi argomenti a intervalli via via più distanti, fino al giorno dell'esame, aiuta a ricordarli più a lungo che studiarli una volta sola."
   },
   {
    "a": "battery",
    "t": "Il ritmo universitario lo travolge",
    "q": "Dopo la maturità era carico. Dopo un mese di lezioni è esausto.",
    "real": "Il passaggio dalle superiori all'università è brusco: lezioni lunghe, nessuno che interroga, tanto studio autonomo. Senza un metodo, si accumula arretrato e la stanchezza cresce proprio mentre si avvicinano gli esami.",
    "mythT": "Perché “per tre mesi sacrifica tutto” non basta",
    "myth": "Eliminare sonno, sport e pause riduce l'efficacia dello studio. Un ritmo sostenibile rende di più di uno estremo.",
    "fact": "Il sonno ha un ruolo importante nel consolidare la memoria: dormire poco per studiare di più rischia di far ricordare meno."
   },
   {
    "a": "grades",
    "t": "Si confronta con gli altri",
    "q": "Dice che i suoi compagni di corso sono molto più avanti e che lui non ce la farà.",
    "real": "Gruppi online, punteggi delle simulazioni condivisi, migliaia di iscritti in tutta Italia: il confronto continuo fa sembrare il proprio percorso sempre in ritardo. Spesso si mette a confronto il proprio momento peggiore con il racconto migliore degli altri.",
    "mythT": "Perché “non ascoltare gli altri” non basta",
    "myth": "Il confronto non si spegne a comando. Si ridimensiona quando si hanno dati propri: un piano chiaro e progressi misurati nel tempo.",
    "fact": "Confrontarsi con i propri risultati precedenti, invece che con quelli degli altri, tende a sostenere meglio motivazione e fiducia nel lungo periodo."
   }
  ],
  "howTitle": "Un percorso <em>fino agli esami del semestre.</em>",
  "how": [
   "Il Performance Test in dieci minuti, poi la videochiamata con la tutor: punti di forza, lacune nelle basi e tempo a disposizione fino alle lezioni.",
   "Prima di settembre: lezioni individuali per rinforzare le basi di biologia, chimica e fisica, così le lezioni del semestre non partono in salita.",
   "Durante il semestre la tutor personale, psicologa esperta in apprendimento, costruisce un calendario a ritroso dagli appelli di dicembre e gennaio.",
   "Lezioni individuali live con docenti certificati Lambda sulle tre materie, e simulazioni da 31 domande in 50 minuti, a crocette e a completamento.",
   "Ogni settimana la tutor analizza i risultati, ricalibra il piano e lo aiuta a gestire la tensione, fino al giorno degli esami."
  ],
  "reviews": [
   "fabio",
   "silvia",
   "irene"
  ],
  "faq": [
   [
    "Come funziona il semestre filtro?",
    "Dall'anno accademico 2025/26 a Medicina, Odontoiatria e Veterinaria non c'è più il test d'ingresso. Ci si iscrive liberamente al primo semestre su Universitaly, si frequentano le lezioni (dal 1° settembre, con frequenza obbligatoria) di Biologia, Chimica e propedeutica biochimica e Fisica, e si sostengono tre esami nazionali. Ogni esame ha 31 domande, 21 a risposta multipla e 10 a completamento, in 50 minuti."
   ],
   [
    "Quali sono le date del 2026/27?",
    "Iscrizioni su Universitaly dal 13 luglio al 3 agosto 2026, lezioni dal 1° settembre, primo appello il 10 dicembre 2026 e secondo appello l'11 gennaio 2027. La graduatoria nazionale esce il 22 gennaio 2027. Le date possono cambiare: fa fede il bando ufficiale."
   ],
   [
    "Come si entra in graduatoria?",
    "Bisogna superare ogni esame con almeno 18/30. La graduatoria nazionale si forma sulla somma dei punteggi delle tre materie; se un esame si sostiene in entrambi gli appelli, vale il punteggio migliore. Si può partecipare al semestre filtro al massimo tre volte."
   ],
   [
    "E se non entra a Medicina?",
    "Gli esami superati non vanno persi: i 18 crediti del semestre vengono riconosciuti per iscriversi a un corso affine, come Biotecnologie o Farmacia."
   ],
   [
    "Quando conviene iniziare?",
    "Prima di settembre: rinforzare le basi in estate permette di seguire le lezioni senza rincorrere. Ma si può iniziare anche a semestre avviato: la tutor parte dalle date degli appelli e lavora a ritroso."
   ],
   [
    "Garantite l'ingresso a Medicina?",
    "Nessuno può garantire un posto in graduatoria, e diffidate di chi lo fa. Quello che garantiamo è una preparazione seria, misurata con simulazioni regolari, e una tutor personale che lo segue fino agli esami."
   ],
   [
    "Chi lo segue?",
    "Due figure. I docenti certificati Lambda fanno con lui le lezioni individuali di biologia, chimica e fisica, applicando il metodo. La tutor personale, psicologa esperta in apprendimento, costruisce il piano fino agli appelli, segue i risultati delle simulazioni ogni settimana ed è il vostro punto di riferimento."
   ]
  ]
 },
 "universita": {
  "nums": [
   "studenti seguiti, dalla scuola all'università",
   "su Trustpilot, su 350+ recensioni di genitori e studenti",
   "in Italia per recensioni certificate",
   "anni accanto a studenti e famiglie, fino alla laurea"
  ],
  "painTitle": "Riconosci tuo figlio? <em>L'università chiede un altro metodo.</em>",
  "painLead": "All'università le difficoltà si vedono meno, perché nessuno controlla: emergono quando gli esami restano indietro. Tocca la situazione che riconosci: ti spieghiamo cosa succede davvero.",
  "pains": [
   {
    "a": "week",
    "t": "Rimanda tutto a fine sessione",
    "q": "Per mesi sembra tranquillo, poi a due settimane dall'esame studia giorno e notte.",
    "real": "Senza verifiche intermedie né qualcuno che controlla, l'università lascia tutta l'organizzazione allo studente. Se nessuno gli ha insegnato a pianificare su mesi, lo studio parte solo quando la scadenza diventa vicina e minacciosa.",
    "mythT": "Perché “ormai è grande, deve arrangiarsi” non basta",
    "myth": "L'età non porta automaticamente un metodo. Molti studenti che andavano bene al liceo si trovano per la prima volta senza una struttura su cui contare.",
    "fact": "Preparare un esame su più settimane, con ripassi distribuiti, porta a ricordi più solidi che concentrare tutto negli ultimi giorni."
   },
   {
    "a": "read",
    "t": "Si perde nei manuali enormi",
    "q": "Ha un manuale di 600 pagine e lo legge dalla prima riga, come un romanzo.",
    "real": "Davanti a volumi così grandi, leggere tutto con la stessa attenzione è impossibile. Serve una lettura strategica: capire la struttura, distinguere l'essenziale dal dettaglio, costruire una sintesi propria. Senza, a metà libro l'inizio è già sbiadito.",
    "mythT": "Perché “basta leggere tutto con attenzione” non basta",
    "myth": "La lettura passiva dà una sensazione di familiarità che inganna: davanti alla domanda d'esame, il contenuto non c'è.",
    "fact": "Mettersi alla prova con domande mentre si studia, invece di limitarsi a rileggere, è una delle strategie più efficaci per ricordare a lungo."
   },
   {
    "a": "grades",
    "t": "Esami rimandati di appello in appello",
    "q": "È al secondo anno e ha dato solo tre esami.",
    "real": "Un esame rimandato rende più pesante la sessione successiva, che a sua volta porta a rimandarne altri. In poco tempo si forma un arretrato che spaventa, e più cresce, più è difficile ripartire.",
    "mythT": "Perché “al prossimo appello lo dai” non basta",
    "myth": "Se il modo di prepararsi resta lo stesso, il prossimo appello rischia di andare come l'ultimo. Serve un piano, esame per esame.",
    "fact": "Obiettivi vicini e concreti, come “questo capitolo entro venerdì”, tendono a sostenere la motivazione più di obiettivi lontani e generici."
   },
   {
    "a": "heart",
    "t": "L'ansia da esame lo blocca",
    "q": "Studia, ma la mattina dell'esame va in panico. A volte non si presenta.",
    "real": "Un esame concentra mesi di lavoro in pochi minuti, spesso davanti al professore. Se la preparazione è incerta, la tensione sale; e se sale troppo, la memoria si inceppa proprio quando serve. Ritirarsi dà sollievo subito, ma rafforza la paura.",
    "mythT": "Perché “devi solo stare calmo” non basta",
    "myth": "La calma non si comanda. Arriva da una preparazione di cui ci si fida e dall'aver già provato a esporre ad alta voce.",
    "fact": "Un livello moderato di tensione aiuta la prestazione, uno troppo alto la peggiora. Allenarsi in condizioni simili all'esame aiuta a restare nella zona utile."
   },
   {
    "a": "focus",
    "t": "Le giornate passano senza studiare davvero",
    "q": "Dice che studia tutto il giorno, ma gli esami non arrivano.",
    "real": "Senza orari imposti, la giornata si sfalda facilmente: un'ora al telefono, una pausa che si allunga, lo studio spezzettato. Le ore “passate a studiare” sono tante, quelle di concentrazione vera poche.",
    "mythT": "Perché “deve impegnarsi di più” non basta",
    "myth": "Spesso l'impegno c'è: mancano struttura e ritmo. Senza blocchi di lavoro definiti, la volontà da sola si esaurisce presto.",
    "fact": "Lavorare per blocchi di tempo definiti, con pause programmate, aiuta a mantenere la concentrazione più a lungo che restare sui libri senza una fine stabilita."
   },
   {
    "a": "battery",
    "t": "Pensa di aver sbagliato facoltà",
    "q": "Dice che forse ha sbagliato facoltà, che l'università non fa per lui.",
    "real": "Dopo esami andati male o rimandati, è facile concludere di non essere all'altezza. A volte la scelta va davvero ripensata; spesso però il problema è il metodo, e la sfiducia nasce dai risultati, non dalle capacità.",
    "mythT": "Perché “cambia corso e vedrai” non basta",
    "myth": "Se la difficoltà sta nel modo di studiare, si ripresenta identica anche in un altro corso. Prima di cambiare strada, conviene capire cosa non funziona.",
    "fact": "La fiducia nelle proprie capacità cresce soprattutto con esperienze di successo concrete: un esame preparato bene e superato può cambiare la prospettiva sul percorso."
   },
   {
    "a": "alone",
    "t": "Non racconta più niente",
    "q": "Degli esami non parla più, e noi non sappiamo come aiutarlo.",
    "real": "All'università il genitore perde visibilità: niente pagelle, niente colloqui. Molti studenti in difficoltà si chiudono per vergogna o per non deludere, e la famiglia scopre il problema quando l'arretrato è già grande.",
    "mythT": "Perché “chiedergli sempre degli esami” non basta",
    "myth": "Le domande insistenti vengono vissute come controllo e spesso aumentano la chiusura. Aiuta di più una figura esterna e neutra con cui parlare.",
    "fact": "Per un giovane adulto sentirsi autonomo conta molto: un aiuto viene accolto meglio quando lo coinvolge nelle scelte, invece di decidere al posto suo."
   }
  ],
  "howTitle": "Un percorso <em>costruito sulla sua sessione.</em>",
  "how": [
   "Il Performance Test lo fa lui, in dieci minuti; poi una videochiamata con la tutor per leggere insieme i risultati.",
   "La tutor personale, psicologa esperta in apprendimento, costruisce con lui un piano di sessione realistico: esami, appelli, ripassi.",
   "Lezioni individuali live con docenti certificati Lambda: lettura strategica, sintesi, memoria e allenamento all'orale, applicati ai suoi esami.",
   "Ogni settimana la tutor verifica l'avanzamento e ricalibra il piano; a voi arrivano aggiornamenti, se lui è d'accordo.",
   "Torna a dare esami con regolarità, un appello alla volta, e a sentirsi di nuovo capace."
  ],
  "reviews": [
   "irene",
   "fabio",
   "silvia"
  ],
  "faq": [
   [
    "Chi lo segue?",
    "Due figure. I docenti certificati Lambda fanno con lui le lezioni individuali, applicando il metodo ai suoi esami. La tutor personale, psicologa esperta in apprendimento, costruisce il piano di sessione, segue i progressi ogni settimana ed è il punto di riferimento per lui e, se lui è d'accordo, anche per voi."
   ],
   [
    "È maggiorenne: deve volerlo lui?",
    "Sì, e lo coinvolgiamo dal primo momento: il Performance Test e la consegna dei risultati li fa lui. A voi arrivano gli aggiornamenti, se lui è d'accordo."
   ],
   [
    "Fate ripetizioni sulle materie universitarie?",
    "Lavoriamo soprattutto su metodo e organizzazione, che valgono per ogni esame. Se per una materia serve un aiuto specifico, ve lo diciamo con chiarezza durante la consegna del test."
   ],
   [
    "Funziona anche se è fuori corso?",
    "Sì: si parte da un piano per rimettersi in pari, un esame alla volta."
   ],
   [
    "Quanto dura il percorso?",
    "Di solito si lavora una sessione alla volta, con obiettivi chiari e misurabili."
   ]
  ]
 }
};
  Object.entries(C).forEach(([slug, c]) => {
    const page = P.PAGES[slug]; if (!page) return;
    Object.assign(page, c, { reviews: c.reviews.map((k) => R[k]).filter(Boolean) });
  });
})();
