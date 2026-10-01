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
      photos: [], tutors: [], seats: null,
    },
    lecco: {
      name: 'Lecco', region: 'Lombardia', area: 'Lecco e provincia',
      address: 'Via Pietro Nava 35, 23900 Lecco (LC)',
      hours: [['Lun – Ven', '14:30 – 18:30'], ['Sabato', '10:00 – 13:00 · 14:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 393 233 1172', email: 'segreteria@lecco.centrostudilambda.it',
      photos: [], tutors: [], seats: null,
    },
    monza: {
      name: 'Monza', region: 'Lombardia', area: 'Monza e Brianza',
      address: 'Via Carlo Prina 9, 20900 Monza (MB)',
      hours: [['Lun – Ven', '15:00 – 19:00'], ['Sabato', '10:00 – 13:00 · 15:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 349 244 8364', email: 'segreteria@monza.centrostudilambda.it',
      photos: [], tutors: [], seats: null,
    },
    cagliari: {
      name: 'Cagliari', region: 'Sardegna', area: 'Cagliari e provincia',
      address: 'Via Carloforte 67, 09123 Cagliari (CA)',
      hours: [['Lun – Ven', '15:00 – 20:00'], ['Sabato', '10:00 – 13:00 · 14:00 – 18:00'], ['Domenica', 'Chiuso']],
      phone: '+39 370 167 3369', email: 'segreteria@cagliari.centrostudilambda.it',
      photos: [], tutors: [], seats: null,
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
