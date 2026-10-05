/* =====================================================================
   LAMBDA · le informazioni di ogni sede (sede.html?c=chiave)
   Dati presi dalle pagine delle sedi su centrostudilambda.it (ottobre 2026).
   Formato:
     address, hours: [['Lun – Ven', '15:00 – 20:00'], ...], phone, email,
     opening: 'novembre 2026'  → sede in apertura (indirizzo e orari ancora da definire)
     photos: [{ src, alt }], tutors: [{ name, role, photo }], seats: numero
   Per aggiungere una sede: una voce qui + le coordinate in italia-data.js.
   ===================================================================== */
(() => {
  window.SEDI_INFO = {
    messina: {
      name: 'Messina', region: 'Sicilia', area: 'Messina e provincia',
      address: 'Via Ettore Lombardo Pellegrino 23, 98123 Messina (ME)',
      hours: [['Lun – Ven', '15:00 – 20:00'], ['Sabato', '10:00 – 13:00 · 14:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 351 420 6823', email: 'info@centrostudilambda.it',
      photos: [
        { src: 'assets/sedi/messina/esterno.jpg', alt: 'Le vetrine della sede di Messina, con l\'insegna Centro Studi Lambda', label: 'L\'ingresso', stop: 0 },
        { src: 'assets/sedi/messina/reception.jpg', alt: 'La reception con il bancone bianco e il logo Lambda', label: 'Reception', stop: 1 },
        { src: 'assets/sedi/messina/aula-studio.jpg', alt: 'L\'aula studio con le postazioni e i pannelli blu', label: 'Aula studio', stop: 2 },
        { src: 'assets/sedi/messina/colloqui.jpg', alt: 'L\'ufficio per i colloqui individuali, con il tavolo nero e i pannelli arancioni', label: 'Colloqui', stop: 3 },
        { src: 'assets/sedi/messina/sala-relax.jpg', alt: 'La sala relax con il divano e la TV', label: 'Sala relax', stop: 4 },
        { src: 'assets/sedi/messina/open-space.jpg', alt: 'Lo spazio d\'ingresso con le pareti vetrate e le poltroncine arancioni', label: 'Lo spazio', stop: 1 },
      ], tutors: [], seats: null,
    },
    lecco: {
      name: 'Lecco', region: 'Lombardia', area: 'Lecco e provincia',
      address: 'Via Pietro Nava 35, 23900 Lecco (LC)',
      hours: [['Lun – Ven', '14:30 – 18:30'], ['Sabato', '10:00 – 13:00 · 14:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 393 233 1172', email: 'segreteria@lecco.centrostudilambda.it',
      photos: [
        { src: 'assets/sedi/lecco/esterno.jpg', alt: 'La facciata della sede di Lecco: la porta di Concorsi Militari Academy e la vetrina del Centro Studi Lambda', label: 'L\'ingresso', stop: 0 },
        { src: 'assets/sedi/lecco/reception.jpg', alt: 'La reception subito a sinistra entrando, con la bussola in legno rosso e il logo verde', label: 'Reception', stop: 1 },
        { src: 'assets/sedi/lecco/attesa.jpg', alt: 'L\'angolo attesa con la parete in doghe di legno, la TV e le poltroncine senape', label: 'Lo spazio', stop: 2 },
        { src: 'assets/sedi/lecco/aula.jpg', alt: 'Le postazioni dell\'aula studio con i divisori e i pannelli blu', label: 'Aula studio', stop: 3 },
        { src: 'assets/sedi/lecco/accoglienza.jpg', alt: 'Il bancone bianco della reception con il logo Centro Studi Lambda', label: 'L\'accoglienza', stop: 1 },
        { src: 'assets/sedi/lecco/postazioni.jpg', alt: 'Due postazioni separate dai divisori in feltro, con lampade e piante', label: 'Le postazioni', stop: 3 },
      ],
      tutors: [], seats: null,
    },
    monza: {
      name: 'Monza', region: 'Lombardia', area: 'Monza e Brianza',
      address: 'Via Carlo Prina 9, 20900 Monza (MB)',
      hours: [['Lun – Ven', '15:00 – 19:00'], ['Sabato', '10:00 – 13:00 · 15:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 349 244 8364', email: 'segreteria@monza.centrostudilambda.it',
      photos: [
        { src: 'assets/sedi/monza/reception.jpg', alt: 'La reception con il logo arancione, le poltroncine e la parete verde', label: 'Reception e attesa', stop: 1 },
        { src: 'assets/sedi/monza/vetrina.jpg', alt: 'La vetrina del Centro Studi Lambda con l\'insegna verde e gli orari', label: 'La vetrina', stop: 0 },
        { src: 'assets/sedi/monza/postazione.jpg', alt: 'Una postazione dell\'aula studio, con il divisore in feltro e il pannello petrolio', label: 'Aula studio', stop: 3 },
        { src: 'assets/sedi/monza/esterno.jpg', alt: 'Le vetrine della sede di Monza: Centro Studi Lambda e Concorsi Militari Academy', label: 'L\'ingresso', stop: 0 },
      ],
      tutors: [], seats: null,
    },
    cagliari: {
      name: 'Cagliari', region: 'Sardegna', area: 'Cagliari e provincia',
      address: 'Via Carloforte 67, 09123 Cagliari (CA)',
      hours: [['Lun – Ven', '15:00 – 20:00'], ['Sabato', '10:00 – 13:00 · 14:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 370 167 3369', email: 'segreteria@cagliari.centrostudilambda.it',
      photos: [
        { src: 'assets/sedi/cagliari/arco.jpg', alt: 'I gradini in travertino e l\'arco che portano all\'aula studio', label: 'Verso l\'aula studio', stop: 3 },
        { src: 'assets/sedi/cagliari/attesa.jpg', alt: 'L\'angolo d\'attesa con le poltroncine color senape e i quadri', label: 'L\'attesa', stop: 1 },
        { src: 'assets/sedi/cagliari/aula-studio.jpg', alt: 'L\'aula studio con le tre postazioni bianche e il logo Lambda', label: 'Aula studio', stop: 3 },
        { src: 'assets/sedi/cagliari/sala.jpg', alt: 'La sala con il divano nero, il tavolino e il parapetto in vetro', label: 'La sala', stop: 2 },
        { src: 'assets/sedi/cagliari/angolo.jpg', alt: 'Il tavolino alto con gli sgabelli e il roll-up Lambda', label: 'L\'angolo bar', stop: 2 },
        { src: 'assets/sedi/cagliari/esterno.jpg', alt: 'Le vetrine della sede di Cagliari, con le insegne Concorsi Militari Academy e Centro Studi Lambda', label: 'L\'ingresso', stop: 0 },
      ],
      tutors: [], seats: null,
    },
    foggia: {
      name: 'Foggia', region: 'Puglia', area: 'Foggia e provincia', opening: 'novembre 2026',
      address: '', hours: [], phone: '+39 351 420 6823', email: 'info@centrostudilambda.it',
      photos: [], tutors: [], seats: null,
    },
    catania: {
      name: 'Catania', region: 'Sicilia', area: 'Catania e provincia', opening: 'novembre 2026',
      address: '', hours: [], phone: '+39 351 420 6823', email: 'info@centrostudilambda.it',
      photos: [], tutors: [], seats: null,
    },
  };
  const I = window.SEDI_INFO;
  // utilità condivise: link per chiamare, scrivere, aprire la mappa
  window.SEDE_LINKS = (k) => ({
    tel: 'tel:' + I[k].phone.replace(/\s/g, ''),
    mail: 'mailto:' + I[k].email,
    maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(I[k].address ? 'Centro Studi Lambda, ' + I[k].address : I[k].name),
    embed: I[k].address ? 'https://maps.google.com/maps?q=' + encodeURIComponent(I[k].address) + '&t=m&z=15&output=embed' : '',
    page: 'sede.html?c=' + k,
  });
})();
