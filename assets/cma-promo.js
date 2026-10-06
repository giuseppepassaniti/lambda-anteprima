/* =====================================================================
   CONCORSI MILITARI ACADEMY · motion graphic dei prodotti (v2: tipografia cinetica a tempo di musica)
   Nella card: anteprima muta in loop con "Guarda come funziona". Al clic: il video completo
   a tutto schermo, a capitoli, con musica originale sintetizzata (Web Audio, nessun file esterno)
   e "Parla con un consulente" sempre visibile.
   Regia a 125 bpm: un battito = 0,48 s, una battuta = 1,92 s. Ogni capitolo dura un numero intero
   di battute, così cambi di scena, parole e numeri cadono sempre sul battito.
   Uso: <div data-promo="smart"></div> dentro la card · window.CMAPromo.mount(document)
   ===================================================================== */
(() => {
  if (window.CMAPromo) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BPM = 125, BT = 60 / BPM, BAR = BT * 4, STEP = BT / 4;
  const COL = { bone: '#F2F1EC', ink: '#121310', red: '#CD141F', green: '#1d3524' };
  const FG = { bone: '#0b0c0a', ink: '#F2F1EC', red: '#ffffff', green: '#F2F1EC' };

  /* ---------- i copioni ---------- */
  const PROMOS = {
    smart: {
      name: 'PC Smart',
      chapters: [
        { t: 'Intro', bars: 2, bg: 'ink', type: 'intro' },
        { t: 'Il problema', bars: 3, bg: 'bone', type: 'problem', q: 'Da dove inizi?',
          counts: [[10378, 'quesiti · Allievi Carabinieri'], [26760, 'quesiti · VFT Esercito'], [31196, 'quesiti · Marescialli Esercito']] },
        { t: 'Il circolo vizioso', bars: 4, bg: 'ink', type: 'loop', },
        { t: 'PC Smart', bars: 3, bg: 'red', type: 'reveal', big: 'PC Smart.', line: 'Il percorso più completo per la prova preselettiva.' },
        { t: 'E · Memoria', bars: 4, bg: 'bone', type: 'eagle', L: 'E', name: 'Efficienza della memoria', title: 'Tecniche di memoria', viz: 'curve',
          keys: ['Non rileggi.', 'Trasformi in immagini.', '<b>Ricordi a lungo termine.</b>'] },
        { t: 'A · Richiamo', bars: 4, bg: 'ink', type: 'eagle', L: 'A', name: 'Allenamento al richiamo', title: 'Il simulatore CMA', viz: 'quiz',
          keys: ['Richiami, non rileggi.', 'La banca dati del tuo concorso.', '<b>Statistiche sui tuoi errori.</b>'] },
        { t: 'G · Masterplan', bars: 4, bg: 'bone', type: 'eagle', L: 'G', name: 'Gestione strategica', title: 'Il tuo Masterplan', viz: 'plan',
          keys: ['Quali domande. Quante.', 'Ogni giorno, nell\'app CMA.', '<b>Zero caos.</b>'] },
        { t: 'L · Mente', bars: 3, bg: 'green', type: 'eagle', L: 'L', name: 'Leadership emotiva', title: 'Mente ed emozioni', viz: 'pulse',
          keys: ['Psicologa: 2 incontri al mese.', '<b>Ansia sotto controllo.</b>'] },
        { t: 'E · Esame', bars: 4, bg: 'ink', type: 'eagle', L: 'E', name: 'Esame sicuro', title: 'Aule studio live', viz: 'chat',
          keys: ['2 ore al giorno, lun–sab.', 'Il docente risponde subito.', '<b>La prova l\'hai già vissuta.</b>'] },
        { t: 'Su misura', bars: 4, bg: 'red', type: 'adapt', pairs: [['Lavori?', 'Basta un\'ora al giorno.', 1], ['Studi a tempo pieno?', 'Acceleriamo.', 7], ['Ovunque tu sia?', 'Tutto online, anche dal telefono.', 0]] },
        { t: 'I risultati', bars: 4, bg: 'bone', type: 'numbers', big: 97, cap: 'idonei alla prima prova · 2026', more: ['+5000 allievi', '25 mln di quiz', '9000 ore di lezione', '4,9 su Trustpilot'] },
        { t: 'La garanzia', bars: 3, bg: 'ink', type: 'seal', q: 'Il risultato?', a: 'Lo garantiamo noi.', seal: 'SODDISFATTO O RIPREPARATO · CONCORSI MILITARI ACADEMY · ' },
        { t: 'Come iniziare', bars: 5, bg: 'ink', type: 'steps', steps: [['call', 'Prenoti la call'], ['head', 'Il consulente ti chiama', 'risponde ai dubbi, ti consiglia il percorso'], ['ok', 'Ti iscrivi'], ['cal', 'Ti prepari', 'con supporto ogni giorno'], ['star', 'Superi il concorso', 'con la garanzia']] },
        { t: 'Inizia ora', bars: 3, bg: 'bone', type: 'end', end: ['Non aspettare il bando.', 'Ti prepariamo fino al giorno del concorso: <b>non sarai mai solo.</b>'] },
      ],
    },
  };
  Object.values(PROMOS).forEach((P) => { let at = 0; P.chapters.forEach((c) => { c.at = at; c.d = c.bars * BAR; at += c.d; }); P.dur = at; });
  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  /* ---------- il marchio ---------- */
  const STAR_FALLBACK = '<svg viewBox="0 0 64 64"><path fill="#CD141F" d="M32 6l7 19h20L43 37l6 20-17-12-17 12 6-20L5 25h20z"/></svg>';
  const mark = (ring = false, cls = '') => window.CMA_MARK ? CMA_MARK.svg({ ring, cls, ringColor: '#F2F1EC' }) : STAR_FALLBACK.replace('<svg', `<svg class="${cls}"`);

  /* ---------- stile (iniettato una volta) ---------- */
  const CSS = `
.pm-prev{position:absolute;inset:0;container-type:inline-size;display:grid;place-items:center;background:#F2F1EC;color:#0b0c0a;overflow:hidden;cursor:pointer}
.pm-prev .pv{position:absolute;inset:0;display:grid;place-items:center;text-align:center;opacity:0}
.pm-prev .pv b{display:block;font:700 13cqw/.9 'Space Grotesk',system-ui,sans-serif;letter-spacing:-.055em}
.pm-prev .pv.dk{background:#121310;color:#F2F1EC} .pm-prev .pv.rd{background:#CD141F;color:#fff}
.pm-prev .pv em{font-style:normal;color:#CD141F} .pm-prev .pv.rd em{color:#0b0c0a}
.pm-prev .pv small{display:block;margin-top:3cqw;font:500 3.4cqw/1 'JetBrains Mono',monospace;letter-spacing:.2em;text-transform:uppercase;opacity:.75}
.pm-prev .zst{position:relative;display:inline-block}
.pm-prev .zst i{position:absolute;left:-4%;right:-4%;top:54%;height:.11em;background:#CD141F;transform:scaleX(0);transform-origin:left}
.pm-prev .zlet{display:flex;justify-content:center;gap:2cqw} .pm-prev .zlet span{display:inline-block}
.pm-prev .zpm{position:absolute;left:4cqw;top:4cqw;z-index:2;display:flex;align-items:center;gap:1.6cqw;font:700 2.6cqw/1 'Space Grotesk',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#0b0c0a}
.pm-prev .zpm svg{width:7cqw;height:7cqw}
.pm-play{position:absolute;left:50%;bottom:9%;z-index:3;transform:translateX(-50%);display:inline-flex;align-items:center;gap:9px;padding:9px 15px;border-radius:999px;background:rgba(11,12,10,.82);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25);color:#fff;font:700 12.5px/1 'Space Grotesk',system-ui,sans-serif;white-space:nowrap;transition:transform .35s cubic-bezier(.16,1,.3,1),background .3s}
.pm-play i{width:0;height:0;border-left:9px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent}
.pm-prev:hover .pm-play,.pm-play:focus-visible{transform:translateX(-50%) scale(1.06);background:#CD141F}
/* lettore */
.pmx{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:clamp(10px,3vw,40px);background:rgba(5,6,5,.9);backdrop-filter:blur(12px)}
.pmx[hidden]{display:none}
.pmx-box{position:relative;width:min(1200px,100%,calc((100svh - 150px) * 16 / 9));border-radius:22px;overflow:hidden;background:#070806;border:1px solid rgba(255,255,255,.1);box-shadow:0 60px 120px -40px rgba(0,0,0,.9)}
.pmx-stage{position:relative;aspect-ratio:16/9;width:100%;container-type:inline-size;overflow:hidden;background:var(--bgc,#121310);color:var(--fg,#F2F1EC);--bp:0;--bk:0}
@media (max-aspect-ratio: 1/1){ .pmx-box{width:min(100%,calc((100svh - 190px) * 4 / 5))} .pmx-stage{aspect-ratio:4/5} }
.pmx-x{position:absolute;right:12px;top:12px;z-index:20;width:42px;height:42px;border-radius:50%;background:rgba(11,12,10,.6);color:#fff;font-size:22px;line-height:1;border:1px solid rgba(255,255,255,.2)}
.pmx-bar{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#0d0f0c;border-top:1px solid rgba(255,255,255,.08)}
.pmx-pp,.pmx-snd{flex-shrink:0;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;color:#fff}
.pmx-pp svg,.pmx-snd svg{width:16px;height:16px;fill:currentColor}
.pmx-snd svg{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round}
.pmx-ch{flex:1;min-width:0;display:flex;gap:3px}
.pmx-ch button{position:relative;height:30px;padding:0;background:none;display:flex;flex-direction:column;justify-content:center;gap:5px;min-width:0}
.pmx-ch button i{display:block;height:4px;border-radius:2px;background:rgba(255,255,255,.15);overflow:hidden}
.pmx-ch button i b{display:block;height:100%;width:0;background:#F2F1EC}
.pmx-ch button.zon i b{background:#CD141F}
.pmx-ch button span{font:500 9px/1 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:rgba(242,241,236,.45);white-space:nowrap;overflow:hidden;text-overflow:clip;text-align:left}
.pmx-ch button.zon span{color:#F2F1EC}
.pmx-cta{flex-shrink:0;padding:12px 18px;border-radius:999px;background:#CD141F;color:#fff;font:700 14px/1 'Space Grotesk',system-ui,sans-serif;white-space:nowrap}
.pmx-ch button span{display:none}
@media (max-width: 700px){ .pmx-cta{padding:11px 13px;font-size:12.5px;margin-left:auto} .pmx-bar{gap:8px;flex-wrap:wrap} .pmx-ch{order:3;flex-basis:100%} }
/* strati fissi: sfondo, griglia, transizioni, marchio */
.zbgl{position:absolute;inset:-10%;pointer-events:none;opacity:.08;background-image:linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px);background-size:6cqw 6cqw}
.zwipe{position:absolute;inset:0;z-index:8;pointer-events:none;clip-path:inset(0 100% 0 0)}
.zflash{position:absolute;inset:0;z-index:9;background:#fff;opacity:0;pointer-events:none}
.zhud{position:absolute;left:3.2cqw;top:2.8cqw;z-index:7;display:flex;align-items:center;gap:1.1cqw;opacity:0;pointer-events:none}
.zhud svg{width:3.6cqw;height:3.6cqw;scale:calc(1 + var(--bp) * .1)}
.zhud b{display:block;font:700 1.15cqw/1.05 'Space Grotesk',system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.zhud small{display:block;margin-top:.35cqw;font:500 .95cqw/1 'JetBrains Mono',monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.6}
.zfoot{position:absolute;left:3.2cqw;bottom:2.6cqw;z-index:7;display:flex;align-items:center;gap:1cqw;font:500 1cqw/1 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase;opacity:0;pointer-events:none}
.zfoot .zmeter{display:flex;align-items:flex-end;gap:.3cqw;height:1.4cqw}
.zfoot .zmeter i{width:.35cqw;height:100%;background:#CD141F;transform-origin:bottom;transform:scaleY(calc(.2 + var(--bp) * var(--k)))}
.zfoot .zcn{opacity:.6}
/* scene */
.sc2{position:absolute;inset:0;font-family:'Space Grotesk',system-ui,sans-serif;visibility:hidden;color:var(--sfg)}
.sc2.ink,.sc2.green{--sfg:#F2F1EC;--acc:#CD141F} .sc2.bone{--sfg:#0b0c0a;--acc:#CD141F} .sc2.red{--sfg:#fff;--acc:#0b0c0a} .sc2.green{--acc:#ff5a5f}
.sc2 .zcam{position:absolute;inset:0;display:grid;place-items:center;padding:6cqw 7cqw;scale:calc(1 + var(--bk) * .006)}
.sc2 em{font-style:normal;color:var(--acc)}
.sc2 .zw{display:block;font:700 9.5cqw/.9 'Space Grotesk';letter-spacing:-.055em}
.sc2 .zblk{text-align:center;position:relative;z-index:2}
.sc2 .zline{display:block;margin:2.4cqw auto 0;max-width:62cqw;font:500 2.5cqw/1.25 'Space Grotesk';letter-spacing:-.01em}
.sc2 .zst{position:relative;display:inline-block}
.sc2 .zst i{position:absolute;left:-3%;right:-3%;top:55%;height:.1em;background:#CD141F;transform:scaleX(0);transform-origin:left}
/* intro */
.sc2 .zin{display:grid;justify-items:center;text-align:center}
.sc2 .zin svg{width:15cqw;height:15cqw;overflow:visible}
.sc2 .zin b{display:block;margin-top:2.4cqw;font:700 3.4cqw/1 'Space Grotesk';letter-spacing:.14em}
.sc2 .zin b span{display:inline-block}
.sc2 .zin small{display:block;margin-top:1.4cqw;font:500 1.4cqw/1 'JetBrains Mono',monospace;letter-spacing:.4em;text-transform:uppercase;opacity:.6}
/* problema */
.sc2 .zrain{position:absolute;inset:0;overflow:hidden}
.sc2 .zrain i{position:absolute;top:0;width:11cqw;padding:1cqw;border-radius:1cqw;background:#fff;border:1px solid rgba(11,12,10,.1);box-shadow:0 1.5cqw 3cqw -2cqw rgba(0,0,0,.35);font:500 .8cqw/1 'JetBrains Mono',monospace;font-style:normal;color:#CD141F}
.sc2 .zrain i::after{content:"";display:block;height:3.4cqw;margin-top:.7cqw;background:repeating-linear-gradient(180deg,rgba(11,12,10,.14) 0 .45cqw,transparent .45cqw 1cqw)}
.sc2 .zcnt{position:relative;z-index:2;text-align:center;padding:2cqw 4cqw;border-radius:2cqw;background:rgba(242,241,236,.86);backdrop-filter:blur(6px)}
.sc2 .zcnt b{display:block;font:700 15cqw/.85 'Space Grotesk';letter-spacing:-.06em}
.sc2 .zcnt small{display:block;margin-top:1.4cqw;font:500 1.5cqw/1 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase;color:#CD141F}
.sc2 .zqbig{position:absolute;z-index:3;inset:0;display:grid;place-items:center;font:700 11cqw/.9 'Space Grotesk';letter-spacing:-.06em;color:#fff;background:#CD141F}
/* circolo vizioso */
.sc2 .zring{position:absolute;width:44cqw;height:44cqw;left:50%;top:50%;margin:-22cqw 0 0 -22cqw;opacity:.18}
.sc2 .zring svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2}
.sc2 .zgrp{position:absolute;inset:0;display:grid;place-items:center;text-align:center}
.sc2 .ztb{display:block;width:30cqw;height:.7cqw;margin:3cqw auto 0;border-radius:1cqw;background:rgba(242,241,236,.2);overflow:hidden}
.sc2 .ztb i{display:block;height:100%;width:100%;background:#CD141F;transform-origin:left}
.sc2 .zvig{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 14cqw rgba(205,20,31,.55);opacity:0}
/* soluzione */
.sc2 .zrv{position:relative;display:inline-block}
.sc2 .zrv .zw{font-size:17cqw}
.sc2 .zecho{position:absolute;inset:0;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.6);pointer-events:none}
.sc2 .zeg{display:flex;justify-content:center;gap:1.4cqw;margin-top:1.6cqw}
.sc2 .zeg span{display:grid;place-items:center;width:7cqw;height:7cqw;border-radius:1.2cqw;background:#0b0c0a;color:#fff;font:700 5cqw/1 'Space Grotesk'}
.sc2 .zmet{display:block;margin-top:2.4cqw;font:500 1.4cqw/1 'JetBrains Mono',monospace;letter-spacing:.24em;text-transform:uppercase}
/* EAGLE */
.sc2 .zL{position:absolute;left:-3cqw;bottom:-12cqw;font:700 62cqw/.8 'Space Grotesk';letter-spacing:-.08em;color:var(--acc);opacity:.08;transform-origin:30% 60%;pointer-events:none}
.sc2 .ztxt{position:absolute;left:7cqw;top:10.5cqw;width:47cqw;z-index:2}
.sc2 .ztag{display:inline-flex;align-items:center;gap:1cqw;font:500 1.25cqw/1 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase}
.sc2 .ztag i{display:grid;place-items:center;width:3.2cqw;height:3.2cqw;border-radius:.8cqw;background:#CD141F;color:#fff;font:700 2.2cqw/1 'Space Grotesk';font-style:normal;letter-spacing:0}
.sc2 .zti{display:block;margin-top:1.6cqw;font:700 5cqw/.95 'Space Grotesk';letter-spacing:-.045em}
.sc2 .zwhy{display:block;margin-top:2.4cqw;font:500 1.1cqw/1 'JetBrains Mono',monospace;letter-spacing:.24em;text-transform:uppercase;color:var(--acc)}
.sc2.green .zwhy{color:#ff8a8f}
.sc2 .zli p{margin-top:1.3cqw;font:500 2.15cqw/1.28 'Space Grotesk';letter-spacing:-.01em}
.sc2 .zli p span{display:block;opacity:calc(1 - var(--dim,0) * .62)}
.sc2 .zli p b{color:var(--acc);font-weight:700} .sc2.green .zli p b{color:#ff8a8f}
.sc2 .zviz{position:absolute;right:6cqw;top:10.5cqw;bottom:6.5cqw;width:33cqw;z-index:2;display:grid;align-content:center;gap:1.4cqw}
.sc2 .zvk{display:block;font:500 1cqw/1 'JetBrains Mono',monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.6}
.sc2 .zpan{padding:2cqw;border-radius:1.8cqw;background:#fff;color:#0b0c0a;box-shadow:0 3cqw 6cqw -4cqw rgba(0,0,0,.45)}
.sc2.ink .zpan{background:#1c1e19;color:#F2F1EC;border:1px solid rgba(255,255,255,.08)}
.sc2 .zpan svg{display:block;width:100%;margin-top:1cqw;overflow:visible}
.sc2 .zcurve .ax{stroke:currentColor;stroke-width:1.5;opacity:.25}
.sc2 .zcurve .zc1{fill:none;stroke:#9a9b95;stroke-width:4;stroke-linecap:round}
.sc2 .zcurve .zc2{fill:none;stroke:#CD141F;stroke-width:5;stroke-linecap:round}
.sc2 .zcurve text{font:600 13px 'Space Grotesk';fill:currentColor} .sc2 .zcurve .t2{fill:#CD141F;font-weight:700} .sc2 .zcurve .t3{font:500 10px 'JetBrains Mono';opacity:.55}
.sc2 .zcurve .zdot{fill:#CD141F}
.sc2 .zqq{display:block;margin-top:1cqw;font:700 2.3cqw/1.1 'Space Grotesk'}
.sc2 .zqo{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:.8cqw;margin-top:1.4cqw;padding:0}
.sc2 .zqo li{padding:1cqw 1.2cqw;border-radius:1cqw;border:1px solid rgba(242,241,236,.18);font:600 1.6cqw/1 'Space Grotesk'}
.sc2 .zqo li.zsel{border-color:#F2F1EC} .sc2 .zqo li.zok{background:#2f9e5b;border-color:#2f9e5b;color:#fff}
.sc2 .zsta div{display:grid;grid-template-columns:9cqw 1fr 3.4cqw;align-items:center;gap:1cqw;margin-top:.9cqw;font:600 1.25cqw/1 'Space Grotesk'}
.sc2 .zsta i{height:.8cqw;border-radius:1cqw;background:rgba(242,241,236,.12);overflow:hidden} .sc2 .zsta i b{display:block;height:100%;background:#CD141F;transform-origin:left}
.sc2 .zsta em{font:500 1.1cqw/1 'JetBrains Mono';color:inherit;text-align:right}
.sc2 .zph{justify-self:center;width:21cqw;padding:1.6cqw;border-radius:3cqw;background:#121310;color:#F2F1EC;border:.5cqw solid #2a2c27;box-shadow:0 4cqw 7cqw -4cqw rgba(0,0,0,.6)}
.sc2 .zph-h b{display:block;font:700 2cqw/1 'Space Grotesk'} .sc2 .zph-h span{display:block;margin-top:.6cqw;font:500 .9cqw/1 'JetBrains Mono';letter-spacing:.12em;text-transform:uppercase;opacity:.6}
.sc2 .zph-r{display:flex;align-items:center;gap:.8cqw;margin-top:1cqw;padding:1cqw;border-radius:1cqw;background:rgba(255,255,255,.06);font:600 1.15cqw/1.1 'Space Grotesk'}
.sc2 .zph-r span{flex:1;opacity:.7} .sc2 .zph-r i{display:grid;place-items:center;width:1.7cqw;height:1.7cqw;border-radius:50%;background:#2f9e5b;color:#fff;font:700 1cqw/1 sans-serif;font-style:normal}
.sc2 .zph-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:.4cqw;margin-top:1.2cqw}
.sc2 .zph-cal i{aspect-ratio:1;border-radius:.4cqw;background:rgba(255,255,255,.08)} .sc2 .zph-cal i.zon{background:#CD141F}
.sc2 .zph-f{display:flex;justify-content:space-between;align-items:baseline;margin-top:1.2cqw;font:500 .95cqw/1 'JetBrains Mono';letter-spacing:.1em;text-transform:uppercase}
.sc2 .zph-f b{font:700 2.4cqw/1 'Space Grotesk';color:#CD141F;letter-spacing:-.03em}
.sc2 .zpulse{justify-items:center}
.sc2 .zbr{width:16cqw;height:16cqw;border-radius:50%;border:2px solid rgba(242,241,236,.4);display:grid;place-items:center;font:500 1.1cqw/1 'JetBrains Mono';letter-spacing:.2em;text-transform:uppercase}
.sc2 .zpulse svg{width:100%;overflow:visible} .sc2 .zpulse path{fill:none;stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round}
.sc2 .zpulse .zp1{stroke:#ff5a5f} .sc2 .zpulse .zp2{stroke:#F2F1EC}
.sc2 .zpl{position:relative;height:2.4cqw;width:100%;text-align:center;font:700 2cqw/1 'Space Grotesk'} .sc2 .zpl span{position:absolute;left:0;right:0}
.sc2 .zlive{display:inline-flex;align-items:center;gap:.8cqw;justify-self:start;padding:.8cqw 1.2cqw;border-radius:999px;background:#CD141F;color:#fff;font:500 1.05cqw/1 'JetBrains Mono';letter-spacing:.14em;text-transform:uppercase}
.sc2 .zlive i{width:.8cqw;height:.8cqw;border-radius:50%;background:#fff}
.sc2 .zbub{max-width:80%;padding:1.3cqw 1.6cqw;border-radius:1.6cqw;font:500 1.55cqw/1.3 'Space Grotesk'}
.sc2 .zbub.me{justify-self:end;background:#F2F1EC;color:#0b0c0a;border-bottom-right-radius:.3cqw}
.sc2 .zbub.doc{justify-self:start;background:#2a2c27;color:#F2F1EC;border-bottom-left-radius:.3cqw}
.sc2 .zbub small{display:block;margin-bottom:.5cqw;font:500 .9cqw/1 'JetBrains Mono';letter-spacing:.14em;text-transform:uppercase;color:#ff8a8f}
.sc2 .zstamp{position:absolute;right:2cqw;bottom:1cqw;padding:1cqw 2.2cqw;border:.5cqw solid #CD141F;border-radius:1cqw;color:#CD141F;font:700 4.2cqw/1 'Space Grotesk';letter-spacing:.06em;transform:rotate(-12deg);background:rgba(18,19,16,.6)}
/* su misura */
.sc2 .zpr{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
.sc2 .zpr .zw:first-child{font-size:5cqw;opacity:.8}
.sc2 .zday{display:flex;justify-content:center;gap:.6cqw;margin-top:3cqw}
.sc2 .zday i{width:2.4cqw;height:4cqw;border-radius:.6cqw;background:rgba(255,255,255,.2)} .sc2 .zday i.zon{background:#0b0c0a}
.sc2 .zday+small{display:block;margin-top:1cqw;font:500 1.2cqw/1 'JetBrains Mono';letter-spacing:.2em;text-transform:uppercase;opacity:.75}
/* risultati */
.sc2 .znb{display:flex;align-items:center;gap:5cqw}
.sc2 .zrg{position:relative;width:30cqw;height:30cqw;flex-shrink:0}
.sc2 .zrg svg{width:100%;height:100%;transform:rotate(-90deg)} .sc2 .zrg circle{fill:none;stroke-width:9}
.sc2 .zrg .r0{stroke:rgba(11,12,10,.08)} .sc2 .zrg .r1{stroke:#CD141F;stroke-linecap:round}
.sc2 .zrg b{position:absolute;inset:0;display:grid;place-items:center;font:700 10cqw/1 'Space Grotesk';letter-spacing:-.06em;color:#CD141F}
.sc2 .znc{max-width:38cqw}
.sc2 .znc .zw{font-size:3.6cqw;line-height:1.05;letter-spacing:-.03em}
.sc2 .zmore{display:grid;grid-template-columns:1fr 1fr;gap:1.2cqw;margin-top:2.6cqw}
.sc2 .zmore span{font:700 1.9cqw/1.1 'Space Grotesk';letter-spacing:-.02em;padding:1.2cqw 1.4cqw;border:2px solid rgba(11,12,10,.16);border-radius:1.2cqw}
/* garanzia */
.sc2 .zgu{display:flex;align-items:center;gap:6cqw}
.sc2 .zgu .zw{font-size:7cqw}
.sc2 .zseal{position:relative;width:28cqw;height:28cqw;flex-shrink:0}
.sc2 .zseal .zsr{position:absolute;inset:0;width:100%;height:100%}
.sc2 .zseal .zsr text{font:700 13.5px 'JetBrains Mono',monospace;letter-spacing:.12em;fill:#F2F1EC}
.sc2 .zseal .zsr circle{fill:none;stroke:#CD141F;stroke-width:2}
.sc2 .zseal .zsc{position:absolute;inset:22%;display:grid;place-items:center;border-radius:50%;background:#CD141F}
.sc2 .zseal .zsc svg{width:70%;height:70%}
/* parole chiave EAGLE */
.sc2 .zkeys{position:relative;height:10cqw;margin-top:3.4cqw}
.sc2 .zkeys p{position:absolute;left:0;right:0;top:0;font:700 4.4cqw/1.02 'Space Grotesk';letter-spacing:-.045em}
.sc2 .zkeys p b{color:var(--acc)} .sc2.green .zkeys p b{color:#ff8a8f}
.sc2 .zkd{display:flex;gap:.7cqw;margin-top:1cqw} .sc2 .zkd i{width:4cqw;height:.45cqw;border-radius:1cqw;background:currentColor;opacity:.15} .sc2 .zkd i.zon{background:#CD141F;opacity:1}
/* step: binario orizzontale */
.sc2 .zsth{position:absolute;left:7cqw;top:9.5cqw;font:700 4.4cqw/1 'Space Grotesk';letter-spacing:-.045em}
.sc2 .zsbar{position:absolute;left:7cqw;right:7cqw;top:16cqw;display:flex;gap:.8cqw}
.sc2 .zsbar i{flex:1;height:.45cqw;border-radius:1cqw;background:rgba(242,241,236,.12);overflow:hidden} .sc2 .zsbar b{display:block;height:100%;background:#CD141F;transform-origin:left}
.sc2 .ztrk{position:absolute;left:50%;top:21cqw;display:flex;gap:4cqw}
.sc2 .ztrk::before{content:"";position:absolute;left:0;right:0;top:50%;border-top:2px dashed rgba(242,241,236,.18)}
.sc2 .zsk{position:relative;flex-shrink:0;width:30cqw;height:27cqw;padding:2.6cqw;border-radius:2.6cqw;background:#1c1e19;border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;justify-content:flex-end;transition:background .3s}
.sc2 .zsk.zon{background:#CD141F;border-color:#CD141F;box-shadow:0 3cqw 7cqw -3cqw rgba(205,20,31,.7)}
.sc2 .zsk .zsn{position:absolute;right:2.2cqw;top:1.4cqw;font:700 7cqw/1 'Space Grotesk';letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.5px rgba(242,241,236,.35)}
.sc2 .zsk svg{position:absolute;left:2.6cqw;top:2.6cqw;width:5.4cqw;height:5.4cqw;fill:none;stroke:#F2F1EC;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.sc2 .zsk b{font:700 3cqw/1.02 'Space Grotesk';letter-spacing:-.035em}
.sc2 .zsk small{margin-top:.8cqw;font:500 1.4cqw/1.3 'Space Grotesk';opacity:.75}
.sc2 .zburst{position:absolute;inset:0;border-radius:2.6cqw;border:2px solid #CD141F;pointer-events:none;opacity:0}
/* chiusura: marchio pulito su fondo chiaro */
.sc2 .zend{display:grid;justify-items:center;text-align:center}
.sc2 .zlogo{position:relative;display:flex;align-items:center;gap:2.4cqw}
.sc2 .zlogo svg{position:relative;width:13cqw;height:13cqw;overflow:visible}
.sc2 .zglow{position:absolute;left:6.5cqw;top:50%;width:26cqw;height:26cqw;margin:-13cqw 0 0 -13cqw;border-radius:50%;background:radial-gradient(circle,rgba(205,20,31,.22),transparent 65%);scale:calc(1 + var(--bp) * .12)}
.sc2 .zwm{position:relative;overflow:hidden;text-align:left;padding:.4cqw 0}
.sc2 .zwm b{display:block;font:700 5.4cqw/.95 'Space Grotesk';letter-spacing:-.03em;text-transform:uppercase;color:#0b0c0a}
.sc2 .zwm span{display:block;margin-top:.6cqw;font:700 2.6cqw/1 'JetBrains Mono',monospace;letter-spacing:.62em;text-transform:uppercase;color:#CD141F}
.sc2 .zshine{position:absolute;top:0;bottom:0;left:0;width:25%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.85),transparent);mix-blend-mode:screen}
.sc2 .zet{display:block;margin-top:4cqw;font:700 6cqw/.92 'Space Grotesk';letter-spacing:-.055em}
.sc2 .zend p{margin-top:1.4cqw;font:500 2.2cqw/1.3 'Space Grotesk';opacity:.85} .sc2 .zend p b{font-weight:700;color:#CD141F}
.sc2 .zend button{margin-top:2.6cqw;padding:1.8cqw 3.4cqw;border-radius:999px;background:#CD141F;color:#fff;font:700 2.3cqw/1 'Space Grotesk';box-shadow:0 0 0 calc(var(--bp) * 1.4cqw) rgba(205,20,31,.25)}
@media (max-aspect-ratio: 1/1){
  .zhud{left:5cqw;top:5cqw;gap:2cqw} .zhud svg{width:7cqw;height:7cqw} .zhud b{font-size:2.3cqw} .zhud small{font-size:1.9cqw}
  .zfoot{left:5cqw;bottom:4.5cqw;font-size:2cqw;gap:2cqw} .zfoot .zmeter{height:2.8cqw;gap:.6cqw} .zfoot .zmeter i{width:.7cqw}
  .sc2 .zw{font-size:13cqw} .sc2 .zline{font-size:4.6cqw;max-width:none}
  .sc2 .zin svg{width:34cqw;height:34cqw} .sc2 .zin b{font-size:4.6cqw;letter-spacing:.03em;white-space:nowrap} .sc2 .zin small{font-size:2.8cqw}
  .sc2 .zrain i{width:22cqw;font-size:1.6cqw;padding:2cqw} .sc2 .zrain i::after{height:6.8cqw}
  .sc2 .zcnt b{font-size:22cqw} .sc2 .zcnt small{font-size:2.8cqw} .sc2 .zqbig{font-size:16cqw;text-align:center}
  .sc2 .zring{width:80cqw;height:80cqw;margin:-40cqw 0 0 -40cqw} .sc2 .ztb{width:60cqw;height:1.4cqw}
  .sc2 .zrv .zw{font-size:22cqw} .sc2 .zeg span{width:13cqw;height:13cqw;font-size:9cqw} .sc2 .zmet{font-size:2.8cqw}
  .sc2 .zL{font-size:110cqw;left:auto;right:-8cqw;bottom:auto;top:-6cqw}
  .sc2 .ztxt{left:6cqw;right:6cqw;top:16cqw;width:auto} .sc2 .ztag{font-size:2.5cqw;gap:2cqw} .sc2 .ztag i{width:6.4cqw;height:6.4cqw;font-size:4.4cqw;border-radius:1.6cqw}
  .sc2 .zti{font-size:8.6cqw;margin-top:2.6cqw} .sc2 .zwhy{font-size:2.3cqw;margin-top:3.6cqw} .sc2 .zkeys{height:18cqw;margin-top:5cqw} .sc2 .zkeys p{font-size:8cqw} .sc2 .zkd{gap:1.4cqw;margin-top:2cqw} .sc2 .zkd i{width:8cqw;height:.9cqw} .sc2 .zchat .zbub:nth-of-type(3){display:none}
  .sc2 .zviz{left:6cqw;right:6cqw;width:auto;top:auto;bottom:12.5cqw;height:40cqw;gap:2.4cqw}
  .sc2 .zvk{font-size:2.1cqw} .sc2 .zpan{padding:3.6cqw;border-radius:3.4cqw}
  .sc2 .zcurve svg{max-height:26cqw}
  .sc2 .zqq{font-size:4.4cqw} .sc2 .zqo li{font-size:3.2cqw;padding:2cqw;border-radius:2cqw} .sc2 .zqo{gap:1.6cqw}
  .sc2 .zsta{display:none}
  .sc2 .zph{width:44cqw;padding:3.2cqw;border-radius:5cqw} .sc2 .zph-h b{font-size:4cqw} .sc2 .zph-h span,.sc2 .zph-f{font-size:1.8cqw} .sc2 .zph-r{font-size:2.3cqw;padding:2cqw;margin-top:2cqw;border-radius:2cqw} .sc2 .zph-r i{width:3.4cqw;height:3.4cqw;font-size:2cqw} .sc2 .zph-cal{display:none} .sc2 .zph-f b{font-size:4.8cqw}
  .sc2 .zbr{width:24cqw;height:24cqw;font-size:2cqw} .sc2 .zpl{font-size:4cqw;height:5cqw}
  .sc2 .zlive{font-size:2.1cqw;padding:1.6cqw 2.4cqw} .sc2 .zlive i{width:1.6cqw;height:1.6cqw} .sc2 .zbub{font-size:3.1cqw;padding:2.4cqw 3cqw;border-radius:3cqw} .sc2 .zbub small{font-size:1.8cqw} .sc2 .zstamp{font-size:8cqw}
  .sc2 .zpr .zw:first-child{font-size:8cqw} .sc2 .zday i{width:4cqw;height:7cqw} .sc2 .zday+small{font-size:2.4cqw}
  .sc2 .znb{flex-direction:column;gap:4cqw;text-align:center} .sc2 .zrg{width:52cqw;height:52cqw} .sc2 .zrg b{font-size:17cqw} .sc2 .znc{max-width:none} .sc2 .znc .zw{font-size:6cqw} .sc2 .zmore span{font-size:3.6cqw;padding:2.2cqw}
  .sc2 .zgu{flex-direction:column;gap:5cqw;text-align:center} .sc2 .zgu .zw{font-size:11cqw} .sc2 .zseal{width:50cqw;height:50cqw}
  .sc2 .zsth{left:6cqw;top:16cqw;font-size:8cqw} .sc2 .zsbar{left:6cqw;right:6cqw;top:28cqw;gap:1.4cqw} .sc2 .zsbar i{height:.9cqw} .sc2 .ztrk{top:40cqw;gap:6cqw} .sc2 .zsk{width:58cqw;height:56cqw;padding:5cqw;border-radius:5cqw} .sc2 .zsk .zsn{font-size:14cqw;right:4cqw;top:3cqw} .sc2 .zsk svg{left:5cqw;top:5cqw;width:11cqw;height:11cqw} .sc2 .zsk b{font-size:6.4cqw} .sc2 .zsk small{font-size:3.2cqw} .sc2 .zburst{border-radius:5cqw}
  .sc2 .zlogo{flex-direction:column;gap:3cqw} .sc2 .zlogo svg{width:30cqw;height:30cqw} .sc2 .zglow{left:50%;top:15cqw;width:60cqw;height:60cqw;margin:-30cqw 0 0 -30cqw} .sc2 .zwm{text-align:center} .sc2 .zwm b{font-size:8.6cqw} .sc2 .zwm span{font-size:4.4cqw;letter-spacing:.5em} .sc2 .zet{font-size:10cqw;margin-top:7cqw} .sc2 .zend p{font-size:4.4cqw} .sc2 .zend button{font-size:4.4cqw;padding:3.4cqw 6cqw}
}`;
  const css = () => { if (document.getElementById('cmaPromoCss')) return; const s = document.createElement('style'); s.id = 'cmaPromoCss'; s.textContent = CSS; document.head.appendChild(s); };

  /* =====================================================================
     LA MUSICA · 125 bpm, La minore (Am F C G). Batteria, basso, accordi e pad sintetizzati,
     più gli effetti legati alla storia (orologio, battito, click, timbro).
     ===================================================================== */
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const PROG = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]], ROOT = [33, 29, 36, 31];
  function makeAudio() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    const ac = new AC(), out = ac.createGain(), comp = ac.createDynamicsCompressor();
    out.gain.value = 0.85; comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
    comp.connect(out); out.connect(ac.destination);
    const verb = ac.createConvolver(); { const len = ac.sampleRate * 2.2, b = ac.createBuffer(2, len, ac.sampleRate); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); } verb.buffer = b; }
    const wet = ac.createGain(); wet.gain.value = 0.28; verb.connect(wet); wet.connect(comp);
    const bus = (send = 0) => { const g = ac.createGain(); g.connect(comp); if (send) { const s = ac.createGain(); s.gain.value = send; g.connect(s); s.connect(verb); } return g; };
    const noise = (() => { const b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; })();
    const env = (p, t, a, peak, d) => { p.setValueAtTime(0.0001, t); p.exponentialRampToValueAtTime(peak, t + a); p.exponentialRampToValueAtTime(0.0001, t + a + d); };
    const osc = (type, f, t, a, d, peak, send = 0, f2, filt) => {
      const o = ac.createOscillator(), g = bus(send); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + d);
      env(g.gain, t, a, peak, d);
      if (filt) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(filt[0], t); f.frequency.exponentialRampToValueAtTime(filt[1], t + a + d); f.Q.value = filt[2] || 1; o.connect(f); f.connect(g); } else o.connect(g);
      o.start(t); o.stop(t + a + d + 0.05);
    };
    const nz = (t, d, peak, type, freq, q = 0.8, send = 0, f2, a = 0.003) => {
      const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = bus(send); s.buffer = noise; s.loop = true; f.type = type; f.frequency.setValueAtTime(freq, t); if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + a + d); f.Q.value = q;
      env(g.gain, t, a, peak, d); s.connect(f); f.connect(g); s.start(t); s.stop(t + a + d + 0.05);
    };
    const X = {
      kick: (t, v = 1) => { osc('sine', 160, t, 0.002, 0.34, 0.95 * v, 0, 40); osc('triangle', 70, t, 0.002, 0.08, 0.35 * v); },
      clap: (t, v = 1) => { [0, 0.011, 0.023].forEach((d) => nz(t + d, 0.06, 0.3 * v, 'bandpass', 1400, 1.4, 0.2)); nz(t + 0.03, 0.2, 0.22 * v, 'bandpass', 1100, 0.9, 0.35); },
      hat: (t, v = 1, open) => nz(t, open ? 0.16 : 0.035, 0.11 * v, 'highpass', 8200, 0.7),
      bass: (t, m, d = 0.2, v = 1) => { osc('sawtooth', mtof(m), t, 0.004, d, 0.32 * v, 0, null, [900, 180, 4]); osc('sine', mtof(m), t, 0.004, d, 0.4 * v); },
      stab: (t, ch, v = 1) => ch.forEach((m) => [-8, 8].forEach((dt) => osc('sawtooth', mtof(m + 12) * Math.pow(2, dt / 1200), t, 0.005, 0.22, 0.05 * v, 0.35, null, [3200, 600, 1]))),
      pad: (t, ch, d, v = 0.05) => ch.forEach((m) => [-10, 10].forEach((dt) => osc('sawtooth', mtof(m) * Math.pow(2, dt / 1200), t, d * 0.35, d * 0.65, v, 0.5, null, [1300, 700, 0.7]))),
      boom: (t, v = 1) => { osc('sine', 95, t, 0.004, 1.8, 0.95 * v, 0.25, 26); nz(t, 1.1, 0.4 * v, 'lowpass', 1200, 0.7, 0.5, 70); },
      hit: (t, v = 1) => { osc('sine', 130, t, 0.002, 0.45, 0.55 * v, 0.2, 45); nz(t, 0.3, 0.28 * v, 'lowpass', 4000, 0.8, 0.45, 400); },
      whoosh: (t, v = 1, d = 0.32) => nz(t, 0.08, 0.22 * v, 'bandpass', 500, 1.6, 0.3, 5500, d),
      riser: (t, v = 1, d = BAR) => { nz(t, 0.05, 0.2 * v, 'highpass', 300, 1, 0.4, 9000, d); osc('sawtooth', 110, t, d, 0.05, 0.05 * v, 0.4, 880, [400, 6000, 2]); },
      tick: (t, v = 1) => { nz(t, 0.018, 0.3 * v, 'highpass', 6000, 3); osc('square', 2400, t, 0.001, 0.015, 0.04 * v); },
      tock: (t, v = 1) => { nz(t, 0.02, 0.26 * v, 'bandpass', 2600, 4); },
      heart: (t, v = 1) => { osc('sine', 62, t, 0.006, 0.13, 0.85 * v, 0, 40); osc('sine', 56, t + 0.16, 0.006, 0.15, 0.6 * v, 0, 38); },
      click: (t, v = 1) => { osc('square', 1900, t, 0.001, 0.03, 0.07 * v); nz(t, 0.02, 0.12 * v, 'highpass', 4000, 1); },
      ding: (t, v = 1) => { osc('sine', 1318, t, 0.002, 0.7, 0.16 * v, 0.6); osc('sine', 1976, t + 0.06, 0.002, 0.6, 0.1 * v, 0.6); },
      lock: (t, v = 1) => { osc('square', 660, t, 0.001, 0.05, 0.08 * v, 0.2, 1320); nz(t, 0.04, 0.16 * v, 'bandpass', 3200, 2); },
      pop: (t, v = 1) => osc('sine', 500, t, 0.002, 0.08, 0.25 * v, 0.2, 1100),
      stamp: (t, v = 1) => { osc('sine', 80, t, 0.002, 0.5, 0.9 * v, 0.3, 35); nz(t, 0.25, 0.45 * v, 'lowpass', 2500, 0.8, 0.5, 200); },
      flash: (t, v = 1) => nz(t, 0.6, 0.25 * v, 'highpass', 2500, 0.7, 0.7, 9000),
    };
    return { ac, out, X };
  }
  /* il pattern della musica, sedicesimo per sedicesimo, in base al "modo" del capitolo */
  function music(X, s, t, c, P) {
    // un unico groove, identico in tutti i capitoli: cambia solo il giro di accordi, il ritmo resta quello
    const st = s % 16, bar = Math.floor(s / 16), ch = PROG[bar % 4], root = ROOT[bar % 4];
    if (s * STEP >= P.dur - BAR - 1e-6) { if (st === 0) { X.kick(t, 1); X.stab(t, PROG[0], 1); X.pad(t, PROG[0], BAR * 1.5, 0.05); } return; }
    if (st % 4 === 0) X.kick(t, 1);
    if (st === 4 || st === 12) X.clap(t, 0.8);
    X.hat(t, st % 4 === 2 ? 0.8 : 0.3);
    if (st % 4 === 2) X.bass(t, root + 12, 0.16, 0.8); else if (st % 4 === 0) X.bass(t, root, 0.14, 0.65);
    if (st === 0) { X.stab(t, ch, 0.55); X.pad(t, ch, BAR, 0.025); }
  }

  /* ---------- anteprima nella card (muta) ---------- */
  function preview(el, P) {
    el.innerHTML = `<div class="pm-prev" role="button" tabindex="0" aria-label="Guarda il video di ${P.name}">
      <div class="pv"><b>Studi.<br><span class="zst"><em>Dimentichi.</em><i></i></span></b></div>
      <div class="pv rd"><b>${P.name}.<small>Metodo EAGLE</small></b></div>
      <div class="pv dk"><b><em>97%</em></b><small>idonei alla prima prova · 2026</small></div>
      <span class="zpm">${mark(false)}CMA</span>
      <span class="pm-play"><i></i>Guarda come funziona · ${mmss(P.dur)}</span></div>`;
    const prev = el.querySelector('.pm-prev'), V = [...el.querySelectorAll('.pv')], line = el.querySelector('.zst i');
    const go = () => open(P);
    prev.addEventListener('click', go); prev.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    if (reduced || !window.gsap) { V[0].style.opacity = 1; line.style.transform = 'scaleX(1)'; return; }
    const tl = gsap.timeline({ repeat: -1 });
    tl.set(line, { scaleX: 0 })
      .to(V[0], { opacity: 1, duration: 0.2 }).from(V[0].querySelector('b'), { y: 24, duration: 0.6, ease: 'expo.out' }, '<')
      .to(line, { scaleX: 1, duration: 0.35, ease: 'power3.out' }, '+=0.5')
      .to(V[1], { opacity: 1, duration: 0.15 }, '+=0.9').from(V[1].querySelector('b'), { scale: 1.3, duration: 0.6, ease: 'expo.out' }, '<').set(V[0], { opacity: 0 })
      .to(V[2], { opacity: 1, duration: 0.15 }, '+=1.4').from(V[2].querySelector('b'), { scale: 0.6, duration: 0.6, ease: 'back.out(2)' }, '<').set(V[1], { opacity: 0 })
      .to(V[2], { opacity: 0, duration: 0.3 }, '+=1.6');
  }

  /* ---------- lettore a tutto schermo ---------- */
  let box = null, tl = null, cur = null, A = null, sched = null, last = 0, muted = false, FX = [];
  try { muted = localStorage.getItem('cmaPromoMute') === '1'; } catch (e) {}
  const ICO = {
    pause: '<svg viewBox="0 0 16 16"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>',
    play: '<svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"/></svg>',
    again: '<svg viewBox="0 0 16 16"><path d="M8 2a6 6 0 1 1-5.6 3.8l1.8.7A4 4 0 1 0 8 4v2.5L4.5 3.2 8 0z"/></svg>',
    on: '<svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" stroke="none"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6.3 6.3 0 0 1 0 9"/></svg>',
    off: '<svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" stroke="none"/><path d="M11 6l4 4M15 6l-4 4"/></svg>',
  };
  function build() {
    if (box) return box;
    document.body.insertAdjacentHTML('beforeend', `<div class="pmx" id="pmx" role="dialog" aria-modal="true" aria-label="Video" hidden>
      <div class="pmx-box"><button class="pmx-x" type="button" aria-label="Chiudi">×</button>
        <div class="pmx-stage" id="pmxStage"></div>
        <div class="pmx-bar"><button class="pmx-pp" type="button" id="pmxPP" aria-label="Pausa"></button><button class="pmx-snd" type="button" id="pmxSnd"></button><div class="pmx-ch" id="pmxCh"></div><button class="pmx-cta" type="button" data-lead>Parla con un consulente →</button></div>
      </div></div>`);
    box = document.getElementById('pmx');
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.pmx-x')) close(); if (e.target.closest('[data-lead]')) { tl?.pause(); close(); } });
    addEventListener('keydown', (e) => { if (box.hidden) return; if (e.key === 'Escape') close(); if (e.key === ' ') { e.preventDefault(); toggle(); } if (e.key === 'm' || e.key === 'M') mute(); });
    box.querySelector('#pmxPP').addEventListener('click', toggle);
    box.querySelector('#pmxSnd').addEventListener('click', mute);
    return box;
  }
  function sndIcon() { const b = box.querySelector('#pmxSnd'); b.innerHTML = muted ? ICO.off : ICO.on; b.setAttribute('aria-label', muted ? 'Attiva audio' : 'Togli audio'); }
  function mute() { muted = !muted; try { localStorage.setItem('cmaPromoMute', muted ? '1' : '0'); } catch (e) {} if (A) A.out.gain.setTargetAtTime(muted ? 0 : 0.85, A.ac.currentTime, 0.03); sndIcon(); }
  function toggle() { if (!tl) return; if (tl.progress() >= 1) { tl.restart(); last = 0; } else tl.paused(!tl.paused()); if (!tl.paused()) { last = tl.time(); A?.ac.resume(); } ppIcon(); }
  function ppIcon() { const b = box.querySelector('#pmxPP'); const end = tl && tl.progress() >= 1; b.innerHTML = end ? ICO.again : tl && tl.paused() ? ICO.play : ICO.pause; b.setAttribute('aria-label', end ? 'Rivedi' : tl && tl.paused() ? 'Riproduci' : 'Pausa'); }
  function open(P) {
    build(); css(); cur = P; box.hidden = false; document.body.classList.add('modal-on'); window.Lambda?.lenis?.stop();
    const stage = box.querySelector('#pmxStage');
    stage.innerHTML = `<div class="zbgl"></div>${P.chapters.map((c, i) => scene(c, i)).join('')}
      <div class="zhud">${mark(false)}<div><b>Concorsi Militari Academy</b><small>${P.name} · Metodo EAGLE</small></div></div>
      <div class="zfoot"><span class="zmeter">${[0.9, 0.5, 0.75, 0.35].map((k) => `<i style="--k:${k}"></i>`).join('')}</span><span class="zcn"></span></div>
      <div class="zwipe za"></div><div class="zwipe zb"></div><div class="zflash"></div>`;
    box.querySelector('#pmxCh').innerHTML = P.chapters.map((c, i) => `<button type="button" data-i="${i}" style="flex:${c.bars}" aria-label="${c.t}"><i><b></b></i><span>${c.t}</span></button>`).join('');
    box.querySelectorAll('#pmxCh button').forEach((b) => b.addEventListener('click', () => { tl.seek('c' + b.dataset.i, false); tl.play(); last = tl.time(); A?.ac.resume(); ppIcon(); }));
    // l'audio nasce dal clic dell'utente (i browser non lo permettono prima)
    if (!A && !reduced) A = makeAudio();
    if (A) { A.ac.resume(); A.out.gain.value = muted ? 0 : 0.85; }
    tl = timeline(stage, P); last = 0; ppIcon(); sndIcon();
    clearInterval(sched); sched = setInterval(schedule, 25);
    box.querySelector('.pmx-x').focus();
  }
  function close() { if (!box) return; tl?.kill(); tl = null; clearInterval(sched); A?.ac.suspend(); box.hidden = true; document.body.classList.remove('modal-on'); window.Lambda?.lenis?.start(); }
  /* lo scheduler: guarda 120 ms avanti sulla timeline e programma musica ed effetti in Web Audio */
  function schedule() {
    if (!tl || !A || tl.paused() || tl.progress() >= 1) return;
    const now = tl.time();
    if (now < last - 0.08 || now > last + 0.6) last = now; // salto (capitolo cliccato) o scheda in pausa
    const ahead = now + 0.12; if (ahead <= last) return;
    const base = A.ac.currentTime - now, at = (ts) => Math.max(A.ac.currentTime, base + ts);
    for (let s = Math.ceil(last / STEP - 1e-6); s * STEP < ahead; s++) {
      const ts = s * STEP; if (ts < last || ts >= cur.dur) continue;
      const c = cur.chapters.find((k) => ts >= k.at - 1e-6 && ts < k.at + k.d - 1e-6); if (c) music(A.X, s, at(ts), c, cur);
    }
    for (const f of FX) if (f.t >= last && f.t < ahead) A.X[f.n]?.(at(f.t), f.v, f.d);
    last = ahead;
  }

  /* ---------- le scene ---------- */
  const W = (s, st = '') => `<span class="zw"${st ? ` style="${st}"` : ''}>${s}</span>`;
  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const ICS = { call: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2', head: 'M4 15v-3a8 8 0 0 1 16 0v3M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z', ok: 'M20 6L9 17l-5-5', cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3', star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z' };
  const VIZ = {
    curve: () => `<div class="zpan zcurve"><span class="zvk">Quanto ricordi nel tempo · schema</span>
      <svg viewBox="0 0 320 200"><line class="ax" x1="30" y1="175" x2="310" y2="175"/><line class="ax" x1="30" y1="20" x2="30" y2="175"/>
      <path class="zc1" d="M30 32 C 70 125, 130 152, 310 160"/><path class="zc2" d="M30 32 C 90 36, 140 56, 180 46 S 260 40, 310 36"/>
      <circle class="zdot" cx="310" cy="36" r="7"/><text class="t1" x="306" y="148" text-anchor="end">Rileggere</text><text class="t2" x="306" y="22" text-anchor="end">Tecniche di memoria CMA</text>
      <text class="t3" x="32" y="194">oggi</text><text class="t3" x="308" y="194" text-anchor="end">giorno della prova</text></svg></div>`,
    quiz: () => `<div class="zpan"><span class="zvk">Simulatore CMA · Matematica · quiz 1.284</span><b class="zqq">Il 15% di 240 è:</b>
      <ol class="zqo"><li>A · 32</li><li class="zgood">B · 36</li><li>C · 40</li><li>D · 24</li></ol></div>
      <div class="zpan zsta"><span class="zvk">Le tue statistiche</span>${[['Matematica', 82], ['Logica', 76], ['Italiano', 88], ['Inglese', 71]].map(([n, v]) => `<div><span>${n}</span><i><b style="width:${v}%"></b></i><em>${v}%</em></div>`).join('')}</div>`,
    plan: () => `<div class="zph"><div class="zph-h"><b>Masterplan</b><span>Oggi · giorno 24</span></div>
      ${[['Ripasso', '40 domande'], ['Nuove domande', '60 domande'], ['Simulazione', '1 prova']].map(([a, b]) => `<div class="zph-r"><span>${a}</span><b>${b}</b><i>✓</i></div>`).join('')}
      <div class="zph-cal">${'<i></i>'.repeat(28)}</div><div class="zph-f"><span>Domande di oggi</span><b>0</b></div></div>`,
    pulse: () => `<div class="zbr">Respira</div>
      <svg viewBox="0 0 320 120"><path class="zp1" d="M0 60 L20 60 L28 18 L36 102 L44 8 L52 92 L60 60 L78 60 L86 28 L92 98 L100 12 L108 88 L116 60 L136 60 L144 22 L152 102 L160 6 L168 94 L176 60 L196 60 L204 18 L212 102 L220 10 L228 92 L236 60 L254 60 L262 26 L270 98 L278 12 L286 88 L294 60 L320 60"/>
      <path class="zp2" d="M0 60 C 40 30, 80 30, 120 60 S 200 90, 240 60 S 300 30, 320 60"/></svg>
      <div class="zpl"><span class="za1" style="color:#ff8a8f">Ansia</span><span class="za2">Controllo</span></div>`,
    chat: () => `<span class="zlive"><i></i>Aula studio live · Zoom</span>
      <div class="zbub me">Quiz 214: non mi torna.</div>
      <div class="zbub doc"><small>Docente · Logica</small>Regola: ×2, poi +3.</div>
      <div class="zstamp">IDONEO</div>`,
  };
  function scene(c, i) {
    let h = '';
    if (c.type === 'intro') h = `<div class="zin">${mark(false)}<b>${'CONCORSI MILITARI ACADEMY'.split('').map((ch) => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</b><small>presenta</small></div>`;
    if (c.type === 'problem') h = `<div class="zrain">${Array.from({ length: 18 }, (_, k) => `<i style="left:${(rnd(k, 1) * 92).toFixed(1)}%">Quiz ${Math.floor(1000 + rnd(k, 2) * 30000)}</i>`).join('')}</div>
      <div class="zcnt"><b>0</b><small></small></div><div class="zqbig">${c.q}</div>`;
    if (c.type === 'loop') h = `<div class="zring"><svg viewBox="0 0 100 100"><path d="M50 6a44 44 0 1 1-38 22"/><path d="M6 22l6 7 8-4"/></svg></div>
      <div class="zgrp g1">${W('Ripeti.')}${W('Ripeti.')}<span class="zw"><span class="zst"><em>Dimentichi.</em><i></i></span></span></div>
      <div class="zgrp g2"><div>${W('Studi tanto.')}${W('<em>Ricordi poco.</em>')}</div></div>
      <div class="zgrp g3"><div>${W('E il giorno della prova:', 'font-size:4.4cqw;letter-spacing:-.03em;margin-bottom:1.4cqw')}${W('poco tempo,')}${W('<em>tanta ansia.</em>')}<span class="ztb"><i></i></span></div></div><div class="zvig"></div>`;
    if (c.type === 'reveal') h = `<div class="zblk"><span class="zrv">${W(c.big)}<span class="zw zecho">${c.big}</span><span class="zw zecho">${c.big}</span></span><span class="zline">${c.line}</span>
      <span class="zmet">Costruito sul Metodo EAGLE</span><div class="zeg">${'EAGLE'.split('').map((l) => `<span>${l}</span>`).join('')}</div></div>`;
    if (c.type === 'eagle') h = `<span class="zL">${c.L}</span><div class="ztxt"><span class="ztag"><i>${c.L}</i>${c.name}</span><span class="zti">${c.title}</span>
      <div class="zkeys">${c.keys.map((k) => `<p>${k}</p>`).join('')}</div><div class="zkd">${c.keys.map(() => '<i></i>').join('')}</div></div><div class="zviz z${c.viz}">${VIZ[c.viz]()}</div>`;
    if (c.type === 'adapt') h = c.pairs.map(([q, a, n]) => `<div class="zpr">${W(q)}${W(`<em>${a}</em>`)}${n ? `<div class="zday">${Array.from({ length: 12 }, (_, k) => `<i${k < n ? ' class="zon"' : ''}></i>`).join('')}</div><small>${n === 1 ? '1 ora al giorno' : n + ' ore al giorno'}</small>` : ''}</div>`).join('');
    if (c.type === 'numbers') h = `<div class="znb"><div class="zrg"><svg viewBox="0 0 120 120"><circle class="r0" cx="60" cy="60" r="52"/><circle class="r1" cx="60" cy="60" r="52" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg><b>0%</b></div>
      <div class="znc">${W(c.cap)}<div class="zmore">${c.more.map((m) => `<span>${m}</span>`).join('')}</div></div></div>`;
    if (c.type === 'seal') h = `<div class="zgu"><div>${W(c.q)}${W(`<em>${c.a}</em>`)}</div><div class="zseal"><svg class="zsr" viewBox="0 0 200 200"><defs><path id="zsp${i}" d="M100 100 m-82 0 a82 82 0 1 1 164 0 a82 82 0 1 1 -164 0"/></defs><circle cx="100" cy="100" r="97"/><circle cx="100" cy="100" r="66"/><text><textPath href="#zsp${i}" textLength="512" lengthAdjust="spacing">${c.seal}</textPath></text></svg><div class="zsc">${mark(false)}</div></div></div>`;
    if (c.type === 'steps') h = `<span class="zsth">Come iniziare</span><div class="zsbar">${c.steps.map(() => '<i><b></b></i>').join('')}</div>
      <div class="ztrk">${c.steps.map(([ic, ti, sub], j) => `<div class="zsk${j === c.steps.length - 1 ? ' zlast' : ''}"><span class="zsn">0${j + 1}</span><svg viewBox="0 0 24 24"><path d="${ICS[ic]}"/></svg><b>${ti}</b>${sub ? `<small>${sub}</small>` : ''}${j === c.steps.length - 1 ? '<i class="zburst"></i><i class="zburst"></i>' : ''}</div>`).join('')}</div>`;
    if (c.type === 'end') h = `<div class="zend"><div class="zlogo"><span class="zglow"></span>${mark(false)}<div class="zwm"><b>Concorsi Militari</b><span>Academy</span><i class="zshine"></i></div></div>
      <b class="zet">${c.end[0]}</b><p>${c.end[1]}</p><button type="button" data-lead>Parla con un consulente →</button></div>`;
    return `<section class="sc2 ${c.bg}" data-i="${i}"><div class="zcam">${h}</div></section>`;
  }

  /* ---------- la regia ---------- */
  function timeline(stage, P) {
    const S = [...stage.querySelectorAll('.sc2')], segs = [...box.querySelectorAll('#pmxCh button')];
    const hud = stage.querySelector('.zhud'), foot = stage.querySelector('.zfoot'), cn = foot.querySelector('.zcn');
    const [wa, wb] = stage.querySelectorAll('.zwipe'), flashEl = stage.querySelector('.zflash');
    const t = gsap.timeline({ onUpdate: progress, onComplete: ppIcon, defaults: { ease: 'expo.out' } });
    FX = [];
    const KEEP = { whoosh: 0.55, hit: 0.45, lock: 0.4, pop: 0.4, click: 0.35, boom: 0.45, stamp: 0.5 };
    const fx = (time, n, v = 1, d) => { if (!KEEP[n]) return; FX.push({ t: Math.max(0, time), n: n === 'boom' || n === 'stamp' ? 'hit' : n, v: KEEP[n], d }); };
    const flash = (time, k = 0.85) => { t.fromTo(flashEl, { opacity: k }, { opacity: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, time); fx(time, 'flash', 0.7); };
    const shake = (el, time, n = 6, amp = 0.8) => t.to(el, { keyframes: Array.from({ length: n }, (_, k) => ({ x: `${(k % 2 ? -1 : 1) * amp}cqw`, duration: 0.04 })).concat([{ x: 0, duration: 0.04 }]), ease: 'none' }, time);
    const draw = (path, time, dur, ease = 'power2.inOut') => { const L = path.getTotalLength ? path.getTotalLength() : 400; t.fromTo(path, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease, immediateRender: true }, time); };
    const counter = (el, to, time, dur, fmt = (n) => Math.round(n).toLocaleString('it-IT')) => { const o = { n: 0 }; t.fromTo(o, { n: 0 }, { n: to, duration: dur, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.n); }, immediateRender: false }, time); };

    t.set(stage, { '--bgc': COL[P.chapters[0].bg], '--fg': FG[P.chapters[0].bg] }, 0);
    // la griglia scorre per tutto il video: movimento continuo anche nei momenti di lettura
    t.fromTo(stage.querySelector('.zbgl'), { x: 0, y: 0 }, { x: '-6cqw', y: '-6cqw', duration: BAR, ease: 'none', repeat: Math.ceil(P.dur / BAR) - 1 }, 0);

    P.chapters.forEach((c, i) => {
      const s = S[i], cam = s.querySelector('.zcam'), at = c.at, end = at + c.d, b = (n) => at + n * BT;
      const q = (sel) => s.querySelector(sel), qa = (sel) => [...s.querySelectorAll(sel)];
      t.addLabel('c' + i, at);
      // transizione: due pannelli (rosso, poi il colore della scena nuova) spazzano lo schermo sul battito
      if (i > 0) {
        const wc = c.bg === 'red' ? COL.ink : COL.red, dir = i % 2 ? ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)'] : ['inset(0 0 0 100%)', 'inset(0 0 0 0%)', 'inset(0 100% 0 0)'];
        t.set(wa, { background: wc }, at - 0.3).set(wb, { background: COL[c.bg] }, at - 0.3)
          .fromTo(wa, { clipPath: dir[0] }, { clipPath: dir[1], duration: 0.24, ease: 'power3.in', immediateRender: false }, at - 0.3)
          .fromTo(wb, { clipPath: dir[0] }, { clipPath: dir[1], duration: 0.22, ease: 'power3.in', immediateRender: false }, at - 0.22)
          .set(stage, { '--bgc': COL[c.bg], '--fg': FG[c.bg] }, at)
          .set(wa, { clipPath: dir[0] }, at)
          .to(wb, { clipPath: dir[2], duration: 0.3, ease: 'power3.out' }, at)
          .set(wb, { clipPath: dir[0] }, at + 0.31);
        fx(at - 0.32, 'whoosh', 0.9);
        fx(at, 'hit');
      }
      t.set(S, { autoAlpha: 0 }, at).set(s, { autoAlpha: 1 }, at).call(() => { cn.textContent = `${String(i).padStart(2, '0')} / ${String(P.chapters.length - 1).padStart(2, '0')} · ${c.t}`; }, null, at);
      // camera: lenta spinta in avanti per tutto il capitolo, poi uscita sul battito
      t.fromTo(cam, { scale: 1, autoAlpha: 1, y: 0 }, { scale: 1.045, duration: c.d, ease: 'none', immediateRender: false }, at);
      if (i < P.chapters.length - 1) t.to(cam, { autoAlpha: 0, y: '-2cqw', duration: 0.22, ease: 'power2.in' }, end - 0.26);

      if (c.type === 'intro') {
        const paths = qa('.zin svg path'), letters = qa('.zin b span');
        const from = [{ x: -260, y: 220, rotation: -50 }, { x: -120, y: 320, rotation: 30 }, { x: 260, y: -260, rotation: 60 }];
        paths.forEach((p, k) => t.from(p, { ...from[k % 3], opacity: 0, svgOrigin: '410 400', duration: 0.7, ease: 'power4.out' }, b(0.25 + k * 0.5)));
        paths.forEach((p, k) => fx(b(0.25 + k * 0.5), 'whoosh', 0.6, 0.2));
        fx(0, 'boom', 1); flash(b(2), 0.7); fx(b(2), 'hit', 1);
        t.from(q('.zin svg'), { scale: 0.7, duration: 1.6, ease: 'expo.out' }, 0)
          .to(q('.zin svg'), { rotation: 360, duration: 0.8, ease: 'power4.inOut' }, b(2))
          .from(letters, { yPercent: 120, opacity: 0, duration: 0.5, stagger: 0.025 }, b(2.2))
          .from(q('.zin small'), { opacity: 0, letterSpacing: '1em', duration: 0.8 }, b(4))
          .to(q('.zin'), { scale: 0.22, x: '-40cqw', y: '-21cqw', autoAlpha: 0, duration: 0.6, ease: 'power3.inOut' }, b(6.6))
          .fromTo([hud, foot], { autoAlpha: 0, x: '-2cqw' }, { autoAlpha: 1, x: 0, duration: 0.5, immediateRender: false }, b(7.2));
      }
      if (c.type === 'problem') {
        const cnt = q('.zcnt b'), lab = q('.zcnt small'), cards = qa('.zrain i');
        cards.forEach((k, j) => t.fromTo(k, { y: '-16cqw', rotation: (rnd(j, 3) - 0.5) * 40 }, { y: '62cqw', rotation: (rnd(j, 4) - 0.5) * 80, duration: 2.6 + rnd(j, 5) * 1.8, ease: 'none', immediateRender: true }, at + rnd(j, 6) * c.d * 0.75));
        t.from(q('.zcnt'), { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, at);
        c.counts.forEach(([n, l], k) => {
          t.call(() => { lab.textContent = l; }, null, b(k * 3)).call(() => { lab.textContent = c.counts[Math.max(0, k - 1)][1]; }, null, b(k * 3) - 0.001);
          counter(cnt, n, b(k * 3), BT * 2.6);
          t.fromTo(cnt, { scale: 1.12 }, { scale: 1, duration: 0.4, immediateRender: false }, b(k * 3));
          fx(b(k * 3), 'hit', 0.8); for (let r = 0; r < 5; r++) fx(b(k * 3) + r * STEP, 'tick', 0.5);
        });
        t.call(() => { lab.textContent = c.counts[0][1]; }, null, at + 0.001);
        t.fromTo(q('.zqbig'), { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 0.35, ease: 'power4.out', immediateRender: true }, b(9))
          .from(q('.zqbig'), { scale: 1.3, duration: 0.7 }, b(9));
        fx(b(9), 'boom', 0.9);
      }
      if (c.type === 'loop') {
        const g = qa('.zgrp');
        t.set(g, { autoAlpha: 0 }, at).set(g[0], { autoAlpha: 1 }, at)
          .fromTo(q('.zring'), { rotation: 0 }, { rotation: -720, duration: BT * 7, ease: 'none', immediateRender: false }, at)
          .from(q('.zring'), { scale: 0.5, opacity: 0, duration: 0.6 }, at);
        qa('.g1 .zw').forEach((w, k) => { t.from(w, { yPercent: 100, opacity: 0, duration: 0.4 }, b(k * 2)); fx(b(k * 2), 'hit', 0.6); });
        t.to(q('.g1 .zst i'), { scaleX: 1, duration: 0.3, ease: 'power3.out' }, b(5)); fx(b(5), 'lock', 1.2);
        t.set(g[0], { autoAlpha: 0 }, b(7)).set(g[1], { autoAlpha: 1 }, b(7)).to(q('.zring'), { autoAlpha: 0, duration: 0.3 }, b(7))
          .from(qa('.g2 .zw'), { yPercent: 90, opacity: 0, duration: 0.45, stagger: BT * 1.5 }, b(7));
        t.set(g[1], { autoAlpha: 0 }, b(10)).set(g[2], { autoAlpha: 1 }, b(10))
          .from(qa('.g3 .zw'), { yPercent: 90, opacity: 0, duration: 0.45, stagger: BT }, b(10))
          .fromTo(q('.ztb i'), { scaleX: 1 }, { scaleX: 0, duration: BT * 5, ease: 'none', immediateRender: false }, b(10.5))
          .to(q('.zvig'), { opacity: 1, duration: BT * 4, ease: 'power1.in' }, b(11));
        shake(q('.g3'), b(13.5), 10, 0.6);
        // il battito accelera
        [10, 11, 12, 12.75, 13.5, 14.1, 14.6].forEach((k) => fx(b(k), 'heart', 0.9));
      }
      if (c.type === 'reveal') {
        flash(at, 1); fx(at, 'boom', 1.1);
        t.from(q('.zrv > .zw:not(.zecho)'), { scale: 1.8, opacity: 0, duration: 0.55, ease: 'power4.out' }, at)
          .fromTo(qa('.zecho'), { scale: 1, opacity: 0.8 }, { scale: (k) => 1.25 + k * 0.25, opacity: 0, duration: 0.9, ease: 'power2.out', stagger: 0.08, immediateRender: false }, at + 0.05)
          .from(q('.zline'), { y: 20, opacity: 0, duration: 0.6 }, b(3))
          .from(q('.zmet'), { opacity: 0, letterSpacing: '.6em', duration: 0.6 }, b(6));
        qa('.zeg span').forEach((e, k) => { t.from(e, { y: '-8cqw', scale: 1.6, opacity: 0, duration: 0.35, ease: 'power4.out' }, b(7 + k)); fx(b(7 + k), 'lock', 1); });
      }
      if (c.type === 'eagle') {
        const K = qa('.zkeys p'), D = qa('.zkd i'), beats = c.bars * 4, gap = (beats - 4) / K.length;
        // la lettera gigante riempie lo schermo e si ritira nello sfondo: è la transizione firma del video
        t.fromTo(q('.zL'), { scale: 4.5, opacity: 1, xPercent: 20 }, { scale: 1, opacity: 0.08, xPercent: 0, duration: BT * 1.6, ease: 'power4.inOut', immediateRender: false }, at)
          .to(q('.zL'), { x: '3cqw', duration: c.d - BT * 1.6, ease: 'none' }, at + BT * 1.6);
        fx(at, 'whoosh');
        t.from(q('.ztag'), { x: '-3cqw', opacity: 0, duration: 0.5 }, b(1))
          .from(q('.zti'), { yPercent: 70, opacity: 0, duration: 0.6 }, b(1.5))
          .from(q('.zkd'), { opacity: 0, duration: 0.3 }, b(2.5));
        t.set(K, { autoAlpha: 0 }, at);
        // una parola chiave alla volta, grande, sul battito: la precedente esce verso l'alto
        K.forEach((p, k) => {
          const tk = b(Math.round(2.5 + k * gap));
          t.fromTo(p, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.45, immediateRender: false }, tk)
            .call(() => D.forEach((d, j) => d.classList.toggle('zon', j <= k)), null, tk).call(() => D.forEach((d, j) => d.classList.toggle('zon', j < k)), null, tk - 0.001);
          if (k > 0) t.to(K[k - 1], { autoAlpha: 0, yPercent: -60, duration: 0.2, ease: 'power2.in', immediateRender: false }, tk - 0.22);
          fx(tk, 'pop');
        });
        VIZA[c.viz]?.(s, b, { t, fx, draw, counter, shake, at, c });
      }
      if (c.type === 'adapt') {
        const pr = qa('.zpr'), slot = c.bars * 4 / pr.length;
        t.set(pr, { autoAlpha: 0 }, at);
        pr.forEach((p, k) => {
          const t0 = b(Math.round(k * slot)); t.set(pr, { autoAlpha: 0 }, t0).set(p, { autoAlpha: 1 }, t0)
            .from(p.querySelectorAll('.zw'), { yPercent: 80, opacity: 0, duration: 0.45, stagger: BT }, t0)
            .from(p.querySelectorAll('.zday i'), { scaleY: 0, duration: 0.25, stagger: 0.04, ease: 'back.out(2)' }, t0 + BT * 1.5);
          fx(t0 + BT, 'pop', 0.8);
        });
      }
      if (c.type === 'numbers') {
        const r1 = q('.r1'), num = q('.zrg b');
        t.from(q('.zrg'), { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, at)
          .fromTo(r1, { attr: { 'stroke-dashoffset': 100 } }, { attr: { 'stroke-dashoffset': 100 - c.big }, duration: BT * 4, ease: 'power3.out', immediateRender: false }, at);
        counter(num, c.big, at, BT * 4, (v) => Math.round(v) + '%');
        fx(b(4), 'boom', 0.8); t.fromTo(num, { scale: 1.2 }, { scale: 1, duration: 0.4, immediateRender: false }, b(4));
        t.from(q('.znc > .zw'), { y: '2cqw', opacity: 0, duration: 0.5 }, b(4));
        qa('.zmore span').forEach((m, k) => { t.from(m, { scale: 0.7, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, b(7 + k * 2)); fx(b(7 + k * 2), 'lock', 0.9); });
      }
      if (c.type === 'seal') {
        t.from(qa('.zgu .zw'), { yPercent: 90, opacity: 0, duration: 0.5, stagger: BT * 2 }, at)
          .from(q('.zseal'), { scale: 2.6, rotation: -40, opacity: 0, duration: 0.4, ease: 'power4.in' }, b(4) - 0.4)
          .fromTo(q('.zsr'), { rotation: 0 }, { rotation: 120, duration: c.d, ease: 'none', immediateRender: false }, at);
        fx(b(2), 'pop', 0.8); fx(b(4), 'stamp', 1.1); shake(q('.zgu'), b(4), 4, 0.5);
      }
      if (c.type === 'steps') {
        // binario orizzontale: la "camera" scorre da un passo all'altro, il passo attivo si accende
        const cards = qa('.zsk'), bars = qa('.zsbar i b'), por = matchMedia('(max-aspect-ratio: 1/1)').matches, CW = por ? 58 : 30, GP = por ? 6 : 4, every = 4;
        const xOf = (k) => `${-(k * (CW + GP) + CW / 2)}cqw`;
        t.set(q('.ztrk'), { x: xOf(0) }, at).set(cards, { opacity: 0.3, scale: 0.86 }, at).set(bars, { scaleX: 0 }, at)
          .from(q('.zsth'), { opacity: 0, x: '-2cqw', duration: 0.4 }, at).from(q('.ztrk'), { y: '6cqw', opacity: 0, duration: 0.6 }, at);
        cards.forEach((cd, k) => {
          const tk = k ? b(k * every) : at + 0.06;
          if (k > 0) t.to(q('.ztrk'), { x: xOf(k), duration: 0.5, ease: 'expo.inOut' }, tk - 0.3).to(cards[k - 1], { opacity: 0.3, scale: 0.86, duration: 0.4 }, tk - 0.3);
          t.to(cd, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, tk - 0.05).call(() => cd.classList.add('zon'), null, tk).call(() => cd.classList.remove('zon'), null, tk - 0.001)
            .from(cd.querySelector('svg'), { scale: 0, rotation: -90, duration: 0.5, ease: 'back.out(2)' }, tk)
            .to(bars[k], { scaleX: 1, duration: BT * every, ease: 'none' }, tk);
          fx(tk, k === cards.length - 1 ? 'hit' : 'lock');
        });
        t.fromTo(qa('.zburst'), { scale: 0.6, opacity: 0.9 }, { scale: 2.4, opacity: 0, duration: BT * 2, stagger: BT, repeat: 1, ease: 'power2.out', immediateRender: false }, b((cards.length - 1) * every));
      }
      if (c.type === 'end') {
        const paths = qa('.zlogo svg path');
        t.to([hud, foot], { autoAlpha: 0, duration: 0.3 }, at);
        const from = [{ x: -220, y: 180, rotation: -50 }, { x: -100, y: 260, rotation: 30 }, { x: 220, y: -220, rotation: 60 }];
        paths.forEach((p, k) => { t.from(p, { ...from[k % 3], opacity: 0, svgOrigin: '410 400', duration: 0.6, ease: 'power4.out' }, b(k * 0.5)); fx(b(k * 0.5), 'whoosh'); });
        t.from(q('.zglow'), { scale: 0, opacity: 0, duration: 1 }, b(1))
          .fromTo(q('.zwm'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power3.inOut', immediateRender: true }, b(1.5))
          .fromTo(q('.zshine'), { xPercent: -120 }, { xPercent: 420, duration: 0.9, ease: 'power2.inOut', immediateRender: true }, b(3))
          .from(q('.zet'), { yPercent: 60, opacity: 0, duration: 0.55 }, b(4))
          .from(q('.zend p'), { y: '1.4cqw', opacity: 0, duration: 0.5 }, b(5.5))
          .from(q('.zend button'), { scale: 0.7, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, b(7));
        fx(b(1.5), 'hit'); fx(b(7), 'pop');
      }
    });
    t.to({}, { duration: 0.01 }, P.dur);
    FX.sort((a, b) => a.t - b.t);
    
    function progress() {
      const time = t.time();
      const ph = 1 - ((time / BT) % 1), c = P.chapters.find((k) => time >= k.at && time < k.at + k.d) || P.chapters[P.chapters.length - 1];
      stage.style.setProperty('--bp', (Math.pow(ph, 3)).toFixed(3));
      stage.style.setProperty('--bk', Math.pow(ph, 4).toFixed(3));
      P.chapters.forEach((k, i) => { const p = Math.min(1, Math.max(0, (time - k.at) / k.d)); segs[i].querySelector('b').style.width = (p * 100).toFixed(1) + '%'; segs[i].classList.toggle('zon', time >= k.at && time < k.at + k.d); });
    }
    if (reduced) { t.progress(1); t.pause(); }
    return t;
  }

  /* ---------- le animazioni dei visual EAGLE ---------- */
  const VIZA = {
    curve(s, b, { t, fx, draw }) {
      const q = (x) => s.querySelector(x);
      t.from(q('.zpan'), { y: '3cqw', opacity: 0, duration: 0.6 }, b(1.5));
      draw(q('.zc1'), b(3), BT * 4); t.from(q('.t1'), { opacity: 0, duration: 0.4 }, b(6));
      draw(q('.zc2'), b(8), BT * 4); t.from(q('.t2'), { opacity: 0, duration: 0.4 }, b(11));
      t.from(q('.zdot'), { scale: 0, svgOrigin: '310 36', duration: 0.4, ease: 'back.out(3)' }, b(12)); fx(b(12), 'lock', 1.2);
      t.to(q('.zdot'), { scale: 1.6, svgOrigin: '310 36', duration: BT * 0.5, repeat: 9, yoyo: true, ease: 'sine.inOut' }, b(12.5));
    },
    quiz(s, b, { t, fx }) {
      const q = (x) => s.querySelector(x), qa = (x) => [...s.querySelectorAll(x)], li = qa('.zqo li'), good = q('.zgood');
      t.from(q('.zpan'), { y: '3cqw', opacity: 0, duration: 0.6 }, b(1.5)).from(li, { y: '1cqw', opacity: 0, duration: 0.35, stagger: BT / 2 }, b(3));
      [li[0], li[2], good].forEach((el, k) => { t.call(() => { li.forEach((x) => x.classList.toggle('zsel', x === el)); }, null, b(5 + k)); t.call(() => { li.forEach((x) => x.classList.toggle('zsel', x === [null, li[0], li[2]][k])); }, null, b(5 + k) - 0.001); fx(b(5 + k), 'click', 1); });
      t.call(() => good.classList.add('zok'), null, b(8)).call(() => good.classList.remove('zok'), null, b(8) - 0.001)
        .fromTo(good, { scale: 1.15 }, { scale: 1, duration: 0.4, immediateRender: false }, b(8)); fx(b(8), 'ding', 1);
      t.from(q('.zsta'), { y: '3cqw', opacity: 0, duration: 0.6 }, b(9)).from(qa('.zsta i b'), { scaleX: 0, duration: 0.8, stagger: BT / 2, ease: 'power3.out' }, b(10));
      qa('.zsta i b').forEach((_, k) => fx(b(10 + k / 2), 'tick', 0.6));
    },
    plan(s, b, { t, fx, counter }) {
      const q = (x) => s.querySelector(x), qa = (x) => [...s.querySelectorAll(x)], cells = qa('.zph-cal i');
      t.from(q('.zph'), { y: '12cqw', rotation: 6, opacity: 0, duration: 0.8 }, b(1.5)).from(qa('.zph-r'), { x: '3cqw', opacity: 0, duration: 0.4, stagger: BT / 2 }, b(3));
      qa('.zph-r i').forEach((e, k) => { t.from(e, { scale: 0, duration: 0.3, ease: 'back.out(3)' }, b(6 + k)); fx(b(6 + k), 'click', 1); });
      cells.forEach((e, k) => { if (k < 24) { t.call(() => e.classList.add('zon'), null, b(9) + k * STEP).call(() => e.classList.remove('zon'), null, b(9) + k * STEP - 0.001); if (k % 2 === 0) fx(b(9) + k * STEP, 'tick', 0.5); } });
      counter(q('.zph-f b'), 100, b(9), BT * 6);
    },
    pulse(s, b, { t, fx, draw }) {
      const q = (x) => s.querySelector(x);
      t.from(q('.zbr'), { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, b(1))
        .to(q('.zbr'), { scale: 1.25, duration: BT * 2, repeat: 5, yoyo: true, ease: 'sine.inOut' }, b(2));
      draw(q('.zp1'), b(1.5), BT * 3, 'none'); t.from(q('.za1'), { opacity: 0, duration: 0.3 }, b(1.5)).to([q('.zp1'), q('.za1')], { opacity: 0, duration: 0.5 }, b(7));
      draw(q('.zp2'), b(7), BT * 4); t.from(q('.za2'), { opacity: 0, y: '1cqw', duration: 0.5 }, b(7));
      [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5.3, 6.3, 7.5, 9, 11, 13].forEach((k) => fx(b(k), 'heart', 0.8));
    },
    chat(s, b, { t, fx, shake }) {
      const q = (x) => s.querySelector(x), bub = [...s.querySelectorAll('.zbub')];
      t.from(q('.zlive'), { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, b(1))
        .to(q('.zlive i'), { opacity: 0.2, duration: BT / 2, repeat: 40, yoyo: true, ease: 'steps(1)' }, b(1.5));
      [3, 7].forEach((k, j) => { t.from(bub[j], { y: '2cqw', scale: 0.85, opacity: 0, duration: 0.45, ease: 'back.out(1.8)' }, b(k)); fx(b(k), j === 1 ? 'ding' : 'pop', 1); });
      t.from(q('.zstamp'), { scale: 3, opacity: 0, rotation: -30, duration: 0.3, ease: 'power4.in' }, b(13) - 0.3); fx(b(13), 'stamp'); shake(q('.zviz') || s, b(13), 4, 0.5);
    },
  };

  window.CMAPromo = {
    mount(root = document) { css(); root.querySelectorAll('[data-promo]').forEach((el) => { const P = PROMOS[el.dataset.promo]; if (P && !el.dataset.ok) { el.dataset.ok = 1; preview(el, P); } }); },
    open: (k) => PROMOS[k] && open(PROMOS[k]),
    get tl() { return tl; },
  };
})();
