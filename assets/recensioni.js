/* =====================================================================
   LAMBDA · recensioni e cambiamenti (pagina Risultati)
   Recensioni: testo identico a quello già pubblicato sul sito (Trustpilot).
   - tags: quali cambiamenti racconta la recensione (solo se lo dice il testo)
   - prima/dopo: solo quando la recensione racconta com'era prima e com'è dopo
   Per aggiungere una storia documentata: una voce con q, n, tags, prima, dopo.
   ===================================================================== */
window.LAMBDA_DIMS = [
  { k: 'metodo', name: 'Metodo', pre: 'Ripete a memoria e sottolinea tutto.', post: 'Legge, schematizza e ripete con parole sue.', how: 'il Metodo FOCUS, con mappe, sintesi e tecniche di memoria allenate nei laboratori.' },
  { k: 'autonomia', name: 'Autonomia', pre: 'Studia solo con un adulto accanto.', post: 'Si organizza e si verifica da solo.', how: 'un piano settimanale costruito con lui, e strumenti per capire da solo se è pronto.' },
  { k: 'tempo', name: 'Tempo di studio', pre: 'Pomeriggi interi sui libri.', post: 'Meno ore, fatte meglio.', how: 'lettura attiva, sessioni brevi e ripasso a intervalli: si studia con un metodo, non a oltranza.' },
  { k: 'risultati', name: 'Risultati', pre: 'Insufficienze e debiti.', post: 'Voti in risalita, lacune recuperate.', how: 'ripetizioni mirate sulle materie critiche e il metodo per non ritrovarsi di nuovo indietro.' },
  { k: 'sicurezza', name: 'Sicurezza', pre: 'Ansia e scena muta.', post: 'Affronta verifiche e interrogazioni con calma.', how: 'simulazioni con il tutor, piccoli successi misurabili e una scaletta per esporre.' },
];
window.LAMBDA_REVIEWS = [
  { q: 'Mio figlio aveva tre debiti, in 2 mesi ha superato i debiti.', n: 'Elisabetta V.', tags: ['risultati'], lead: 'risultati', prima: 'Tre debiti', dopo: 'Debiti superati in 2 mesi' },
  { q: 'Ha superato i debiti in modo soddisfacente e recuperato autostima.', n: 'Simona', tags: ['risultati', 'sicurezza'], lead: 'sicurezza', prima: 'Debiti, autostima in calo', dopo: 'Debiti superati, autostima recuperata' },
  { q: 'La vedo più tranquilla, motivata ed organizzata nello studio.', n: 'Silvia', tags: ['metodo', 'sicurezza'], lead: 'metodo' },
  { q: 'Mio figlio non solo è cresciuto scolasticamente ma anche come persona.', n: 'Irene L. M.', tags: ['risultati', 'sicurezza'] },
  { q: 'Ho visto in mio figlio una scintilla di entusiasmo.', n: 'Fabio T.', tags: [] },
];
