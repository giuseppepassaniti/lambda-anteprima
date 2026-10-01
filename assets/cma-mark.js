/* =====================================================================
   CONCORSI MILITARI ACADEMY · il marchio
   Ricostruito in vettoriale dal logo ufficiale (assets/cma-logo-ufficiale.png):
   la stella tagliata in diagonale (verde, banda grigia, rosso) e la scritta
   ad anello "MILITARI ACADEMY / CONCORSI". Coordinate nello spazio 834×834.
   Usato da header/footer (SVG) e dall'intro 3D (stesse forme, estruse).
   ===================================================================== */
(() => {
  const M = {
    colors: { green: '#284C31', grey: '#DADBDA', red: '#CD141F', ring: '#DADBDA' },
    green: [[561.5, 616.4], [572.0, 648.6], [410.0, 530.9], [248.0, 648.6], [309.9, 458.1], [147.9, 340.4], [186.5, 340.4]],
    grey: [[536.1, 538.1], [548.7, 576.8], [227.5, 340.4], [267.5, 340.4]],
    red: [[410.0, 150.0], [471.9, 340.4], [672.1, 340.4], [510.1, 458.1], [523.5, 499.4], [307.5, 340.4], [348.1, 340.4]],
    // anello di testo: centro, raggi delle linee di base, archi (gradi), corpo del carattere
    ring: { cx: 416, cy: 418, top: { r: 322, from: 170, to: 10, text: 'MILITARI ACADEMY' }, bottom: { r: 404, from: 136, to: 44, text: 'CONCORSI' }, size: 128, font: '"Space Mono", ui-monospace, monospace' },
  };
  const path = (pts) => 'M' + pts.map((p) => p.join(' ')).join(' L') + 'Z';
  const pt = (r, a) => [M.ring.cx + r * Math.cos((a * Math.PI) / 180), M.ring.cy + r * Math.sin((a * Math.PI) / 180)];
  let uid = 0;
  /** svg({ ring, cls, ringColor, title }) → markup del marchio; ring=false: solo la stella, inquadrata stretta */
  M.svg = ({ ring = true, cls = '', ringColor = M.colors.ring, title = 'Concorsi Militari Academy' } = {}) => {
    const id = 'cmaR' + ++uid, R = M.ring, T = R.top, B = R.bottom;
    const [x1, y1] = pt(T.r, T.from), [x2, y2] = pt(T.r, T.to), [x3, y3] = pt(B.r, B.from), [x4, y4] = pt(B.r, B.to);
    const lenT = ((Math.PI * T.r * (360 - T.from + T.to)) / 180).toFixed(1), lenB = ((Math.PI * B.r * (B.from - B.to)) / 180).toFixed(1);
    const star = `<path fill="${M.colors.green}" d="${path(M.green)}"/><path fill="${M.colors.grey}" d="${path(M.grey)}"/><path fill="${M.colors.red}" d="${path(M.red)}"/>`;
    const ringSvg = ring ? `<defs><path id="${id}t" d="M${x1} ${y1} A${T.r} ${T.r} 0 1 1 ${x2} ${y2}"/><path id="${id}b" d="M${x3} ${y3} A${B.r} ${B.r} 0 0 0 ${x4} ${y4}"/></defs>
      <g fill="${ringColor}" font-family='${R.font}' font-weight="700" font-size="${R.size}"><text><textPath href="#${id}t" textLength="${lenT}" lengthAdjust="spacing">${T.text}</textPath></text><text><textPath href="#${id}b" textLength="${lenB}" lengthAdjust="spacing">${B.text}</textPath></text></g>` : '';
    return `<svg class="${cls}" viewBox="${ring ? '0 0 834 834' : '135 140 552 520'}" role="img" aria-label="${title}">${star}${ringSvg}</svg>`;
  };
  window.CMA_MARK = M;
})();
