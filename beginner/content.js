'use strict';

/* =========================================================
   Ilustracje SVG — wspólny styl kreski (figurki + sprzęt)
   Klatka: 110×130, podłoga y=112. Ruch: 2 klatki obok siebie.
   ========================================================= */
const SV = (function () {
  function pt(a) { return a[0] + ' ' + a[1]; }
  function ln(a, b) { return 'M' + pt(a) + ' L' + pt(b); }
  function fig(p) {
    let s = '';
    if (p.k2) s += '<path class="fig back" d="' + ln(p.p, p.k2) + ' L' + pt(p.f2) + '"/>';
    if (p.e2) s += '<path class="fig back" d="' + ln(p.n, p.e2) + ' L' + pt(p.w2) + '"/>';
    const torso = p.c ? 'M' + pt(p.n) + ' Q' + pt(p.c) + ' ' + pt(p.p) : ln(p.n, p.p);
    s += '<path class="fig" d="' + torso + '"/>';
    if (p.k) s += '<path class="fig" d="' + ln(p.p, p.k) + ' L' + pt(p.f) + '"/>';
    if (p.e) s += '<path class="fig" d="' + ln(p.n, p.e) + ' L' + pt(p.w) + '"/>';
    s += '<circle class="head" cx="' + p.h[0] + '" cy="' + p.h[1] + '" r="6.5"/>';
    return s;
  }
  function head(x2, y2, ux, uy) {
    const hx = x2 - ux * 7, hy = y2 - uy * 7, px = -uy * 4.5, py = ux * 4.5;
    return ' M' + (hx + px).toFixed(1) + ' ' + (hy + py).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (hx - px).toFixed(1) + ' ' + (hy - py).toFixed(1);
  }
  function arrow(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    return '<path class="arrow" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + head(x2, y2, dx / len, dy / len) + '"/>';
  }
  function carrow(d, x2, y2, ux, uy) {
    const len = Math.hypot(ux, uy) || 1;
    return '<path class="arrow" d="' + d + head(x2, y2, ux / len, uy / len) + '"/>';
  }
  function prop(d) { return '<path class="prop" d="' + d + '"/>'; }
  function rect(x, y, w, h, r) { return '<rect class="propf" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r == null ? 2 : r) + '"/>'; }
  function circ(x, y, r) { return '<circle class="propf" cx="' + x + '" cy="' + y + '" r="' + r + '"/>'; }
  function plate(x, y, r) { return '<circle class="load" cx="' + x + '" cy="' + y + '" r="' + (r || 4.5) + '"/>'; }
  function dbh(x, y) {
    return '<g class="load"><rect x="' + (x - 7.5) + '" y="' + (y - 3.5) + '" width="3" height="7" rx="1"/><rect x="' + (x + 4.5) + '" y="' + (y - 3.5) + '" width="3" height="7" rx="1"/><rect x="' + (x - 5) + '" y="' + (y - 1) + '" width="10" height="2"/></g>';
  }
  function kb(x, y) {
    return '<path class="prop" d="M' + (x - 4) + ' ' + (y + 3) + ' A4 4 0 0 1 ' + (x + 4) + ' ' + (y + 3) + '"/><circle class="load" cx="' + x + '" cy="' + (y + 8) + '" r="5.5"/>';
  }
  function bar(x1, y, x2) { return '<rect class="load" x="' + x1 + '" y="' + (y - 1.5) + '" width="' + (x2 - x1) + '" height="3" rx="1.5"/>'; }
  function lbl(x, y, t) { return '<text class="lbl" x="' + x + '" y="' + y + '" text-anchor="middle">' + t + '</text>'; }
  const floor = '<path class="floor" d="M6 112 H104"/>';
  function frame(parts, nofloor) { return (nofloor ? '' : floor) + parts.join(''); }
  function mv(f1, f2) {
    return '<svg class="mv" viewBox="0 0 240 130" role="img" aria-label="Schemat ruchu: pozycja startowa i końcowa"><g>' + f1 +
      '</g><path class="sep" d="M120 14 V116"/><path class="arrow" d="M114 65 L126 65 M122 61 L126 65 L122 69"/><g transform="translate(130 0)">' + f2 + '</g></svg>';
  }
  function thumb(f) { return '<svg class="mv" viewBox="0 0 110 130" aria-hidden="true">' + f + '</svg>'; }
  return { fig: fig, arrow: arrow, carrow: carrow, prop: prop, rect: rect, circ: circ, plate: plate, dbh: dbh, kb: kb, bar: bar, lbl: lbl, frame: frame, mv: mv, thumb: thumb };
})();

/* Klatki ruchu dla każdego ćwiczenia: [start, koniec] */
const ILLU = (function () {
  const F = SV.fig, A = SV.arrow, C = SV.carrow, P = SV.prop, R = SV.rect, O = SV.circ, PL = SV.plate, DB = SV.dbh, KB = SV.kb, BAR = SV.bar, L = SV.lbl, fr = SV.frame;
  const stand = { h: [52, 20], n: [52, 31], p: [52, 66], k: [52, 89], f: [52, 112] };
  const seatA5 = [P('M48 46 V92'), R(48, 86, 30, 8), P('M62 94 V112')];
  const o = {};

  o.a1 = [
    fr([F(Object.assign({}, stand, { e: [62, 46], w: [63, 36] })), KB(63, 30)]),
    fr([F({ h: [58, 44], n: [56, 54], p: [42, 84], k: [66, 90], f: [56, 112], e: [70, 72], w: [68, 62] }), KB(68, 56), A(28, 58, 28, 80)])
  ];
  o.a2 = [
    fr([R(6, 64, 26, 48), F({ h: [20, 50], n: [29, 58], p: [58, 96], k: [78, 80], f: [88, 112], e: [40, 76], w: [54, 86] }), PL(58, 88, 6)]),
    fr([R(6, 64, 26, 48), F({ h: [18, 50], n: [29, 57], p: [62, 68], k: [84, 70], f: [88, 112], e: [46, 62], w: [58, 60] }), PL(62, 60, 6), A(62, 104, 62, 82)])
  ];
  o.a3 = [
    fr([R(40, 84, 34, 8), P('M57 92 V112'), R(60, 74, 16, 6), P('M56 0 V15'), F({ h: [55, 40], n: [55, 50], p: [55, 84], k: [78, 84], f: [78, 112], e: [44, 30], w: [40, 16], e2: [66, 30], w2: [70, 16] }), BAR(28, 15, 84)]),
    fr([R(40, 84, 34, 8), P('M57 92 V112'), R(60, 74, 16, 6), P('M56 0 V52'), F({ h: [55, 40], n: [55, 50], p: [55, 84], k: [78, 84], f: [78, 112], e: [40, 66], w: [42, 52], e2: [70, 66], w2: [68, 52] }), BAR(28, 52, 84), A(96, 26, 96, 48)])
  ];
  o.a4 = [
    fr([P('M34 42 V92'), R(34, 86, 30, 8), P('M48 94 V112'), P('M60 58 V40'), F({ h: [40, 40], n: [40, 50], p: [40, 86], k: [62, 84], f: [64, 112], e: [52, 62], w: [58, 58] }), O(60, 58, 3)]),
    fr([P('M34 42 V92'), R(34, 86, 30, 8), P('M48 94 V112'), P('M80 56 V40'), F({ h: [40, 40], n: [40, 50], p: [40, 86], k: [62, 84], f: [64, 112], e: [60, 56], w: [78, 56] }), O(80, 56, 3), A(64, 30, 86, 30)])
  ];
  o.a5 = [
    fr(seatA5.concat([F({ h: [55, 42], n: [55, 52], p: [55, 86], k: [76, 86], f: [78, 112], e: [40, 66], w: [40, 52], e2: [70, 66], w2: [70, 52] }), DB(40, 48), DB(70, 48)])),
    fr(seatA5.concat([F({ h: [55, 42], n: [55, 52], p: [55, 86], k: [76, 86], f: [78, 112], e: [43, 36], w: [45, 20], e2: [67, 36], w2: [65, 20] }), DB(45, 16), DB(65, 16), A(90, 50, 90, 26)]))
  ];
  o.a6 = [
    fr([R(30, 82, 50, 8), P('M55 90 V112'), R(39, 80, 5, 12), R(66, 80, 5, 12), F({ h: [55, 34], n: [55, 44], p: [55, 80], k: [47, 86], f: [45, 112], k2: [63, 86], f2: [65, 112], e: [42, 64], w: [40, 80], e2: [68, 64], w2: [70, 80] })]),
    fr([R(30, 82, 50, 8), P('M55 90 V112'), R(22, 80, 5, 12), R(83, 80, 5, 12), F({ h: [55, 34], n: [55, 44], p: [55, 80], k: [30, 86], f: [28, 112], k2: [80, 86], f2: [82, 112], e: [42, 64], w: [40, 80], e2: [68, 64], w2: [70, 80] }), A(50, 104, 36, 104), A(60, 104, 74, 104)])
  ];
  o.a7 = [
    fr([F({ h: [20, 74], n: [30, 78], p: [62, 84], k: [80, 112], f: [100, 104], e: [34, 112], w: [52, 112] })]),
    fr([F({ h: [18, 68], n: [28, 72], p: [64, 80], k: [86, 96], f: [104, 112], e: [32, 112], w: [50, 112] }), L(55, 126, 'trzymaj 20–40 s')])
  ];
  o.b1 = [
    fr([P('M43 95 L26 59'), P('M40 96 H58'), P('M46 96 V112'), '<path class="propf" d="M60 44 L65 39 L93 67 L88 72 Z"/>', F({ h: [30, 58], n: [36, 66], p: [48, 92], k: [52, 62], f: [74, 58], e: [44, 82], w: [52, 90] })]),
    fr([P('M43 95 L26 59'), P('M40 96 H58'), P('M46 96 V112'), '<path class="propf" d="M74 38 L79 33 L107 61 L102 66 Z"/>', F({ h: [30, 58], n: [36, 66], p: [48, 92], k: [70, 70], f: [88, 52], e: [44, 82], w: [52, 90] }), A(84, 92, 98, 78)])
  ];
  o.b2 = [
    fr([F({ h: [50, 20], n: [50, 31], p: [50, 66], k: [50, 89], f: [50, 112], e: [53, 50], w: [55, 68] }), PL(55, 73)]),
    fr([F({ h: [80, 52], n: [74, 58], p: [44, 76], k: [48, 92], f: [52, 112], e: [74, 74], w: [72, 92] }), PL(72, 97), A(40, 64, 24, 64)])
  ];
  o.b3 = [
    fr([R(26, 86, 40, 8), P('M46 94 V112'), P('M84 90 L92 110'), P('M108 62 H80'), R(76, 58, 5, 8), F({ h: [44, 40], n: [44, 50], p: [44, 86], k: [66, 82], f: [86, 98], e: [60, 58], w: [76, 62] })]),
    fr([R(26, 86, 40, 8), P('M46 94 V112'), P('M84 90 L92 110'), P('M108 68 H54'), R(50, 64, 5, 8), F({ h: [44, 40], n: [44, 50], p: [44, 86], k: [66, 82], f: [86, 98], e: [36, 72], w: [50, 68] }), A(100, 50, 78, 50)])
  ];
  o.b4 = [
    fr([F({ h: [50, 20], n: [50, 31], p: [50, 66], k: [50, 89], f: [50, 112], e: [53, 50], w: [55, 68] }), PL(55, 73)]),
    fr([F({ h: [50, 30], n: [50, 41], p: [50, 78], k: [76, 86], f: [76, 112], k2: [36, 104], f2: [20, 112], e: [53, 58], w: [55, 76] }), PL(55, 81), A(92, 60, 92, 84)])
  ];
  o.b5 = [
    fr([F({ h: [20, 60], n: [30, 64], p: [64, 78], k: [82, 112], f: [102, 106], e: [34, 88], w: [38, 112] })]),
    fr([F({ h: [20, 84], n: [30, 86], p: [64, 90], k: [82, 112], f: [102, 106], e: [46, 102], w: [36, 112] }), A(12, 64, 12, 80)])
  ];
  o.b6 = [
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k: [48, 90], f: [46, 112], k2: [62, 90], f2: [64, 112], e: [43, 50], w: [40, 68], e2: [67, 50], w2: [70, 68] }), DB(40, 72), DB(70, 72)]),
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k: [48, 90], f: [46, 112], k2: [62, 90], f2: [64, 112], e: [36, 36], w: [18, 34], e2: [74, 36], w2: [92, 34] }), DB(14, 34), DB(96, 34), A(24, 62, 16, 46), A(86, 62, 94, 46)])
  ];
  o.b7 = [
    fr([F({ h: [14, 104], n: [24, 103], p: [60, 104], e: [30, 86], w: [32, 68], k: [62, 82], f: [80, 84] })]),
    fr([F({ h: [14, 104], n: [24, 103], p: [60, 104], e: [12, 96], w: [2, 90], e2: [30, 86], w2: [32, 68], k: [84, 98], f: [104, 100], k2: [62, 82], f2: [80, 84] }), A(88, 82, 102, 92), A(20, 78, 8, 86)])
  ];
  /* alternatywy */
  o.a1x = [
    fr([R(6, 84, 36, 28), F(Object.assign({}, stand, { h: [56, 20], n: [56, 31], p: [56, 66], k: [56, 89], f: [56, 112], e: [64, 48], w: [74, 44] }))]),
    fr([R(6, 84, 36, 28), F({ h: [60, 44], n: [58, 54], p: [40, 82], k: [64, 88], f: [56, 112], e: [70, 62], w: [84, 58] }), A(26, 56, 26, 76)])
  ];
  o.a2x = [
    fr([F({ h: [14, 104], n: [24, 102], p: [58, 104], k: [74, 84], f: [86, 112], e: [36, 108], w: [48, 108] }), PL(58, 96, 5)]),
    fr([F({ h: [14, 104], n: [24, 102], p: [58, 80], k: [76, 80], f: [86, 112], e: [36, 108], w: [48, 108] }), PL(58, 72, 5), A(68, 106, 68, 90)])
  ];
  o.a3x = [
    fr([P('M22 112 V10 H88 V112'), BAR(22, 10, 88), R(40, 100, 30, 6), F({ h: [55, 40], n: [55, 50], p: [55, 84], k: [60, 100], f: [78, 106], e: [43, 30], w: [40, 12], e2: [67, 30], w2: [70, 12] })]),
    fr([P('M22 112 V10 H88 V112'), BAR(22, 10, 88), R(40, 78, 30, 6), F({ h: [55, 18], n: [55, 28], p: [55, 62], k: [60, 78], f: [78, 84], e: [41, 34], w: [40, 12], e2: [69, 34], w2: [70, 12] }), A(100, 70, 100, 48)])
  ];
  o.a4x = [
    fr([R(8, 84, 84, 10), P('M16 94 V112 M84 94 V112'), F({ h: [16, 76], n: [26, 78], p: [60, 80], k: [80, 90], f: [92, 112], e: [40, 68], w: [34, 58] }), PL(34, 53)]),
    fr([R(8, 84, 84, 10), P('M16 94 V112 M84 94 V112'), F({ h: [16, 76], n: [26, 78], p: [60, 80], k: [80, 90], f: [92, 112], e: [28, 60], w: [28, 42] }), PL(28, 37), A(46, 58, 46, 40)])
  ];
  o.a5x = [
    fr(seatA5.concat([P('M70 52 L86 80 V112'), F({ h: [55, 42], n: [55, 52], p: [55, 86], k: [76, 86], f: [78, 112], e: [40, 66], w: [40, 52], e2: [70, 66], w2: [70, 52] }), O(40, 52, 3), O(70, 52, 3)])),
    fr(seatA5.concat([P('M65 20 L86 80 V112'), F({ h: [55, 42], n: [55, 52], p: [55, 86], k: [76, 86], f: [78, 112], e: [43, 36], w: [45, 20], e2: [67, 36], w2: [65, 20] }), O(45, 20, 3), O(65, 20, 3), A(96, 50, 96, 26)]))
  ];
  o.a6x = [
    fr([R(30, 82, 50, 8), P('M55 90 V112'), F({ h: [55, 34], n: [55, 44], p: [55, 80], k: [47, 86], f: [45, 112], k2: [63, 86], f2: [65, 112], e: [42, 64], w: [40, 80], e2: [68, 64], w2: [70, 80] }), '<path class="prop" style="stroke-width:3.5" d="M45 88 Q55 92 65 88 Q55 84 45 88"/>']),
    fr([R(30, 82, 50, 8), P('M55 90 V112'), F({ h: [55, 34], n: [55, 44], p: [55, 80], k: [30, 86], f: [28, 112], k2: [80, 86], f2: [82, 112], e: [42, 64], w: [40, 80], e2: [68, 64], w2: [70, 80] }), '<path class="prop" style="stroke-width:3.5" d="M28 88 Q55 94 82 88 Q55 82 28 88"/>', A(50, 104, 36, 104), A(60, 104, 74, 104)])
  ];
  o.a7x = [
    fr([F({ h: [22, 62], n: [32, 66], p: [66, 70], k: [72, 112], f: [92, 112], e: [36, 90], w: [38, 112] })]),
    fr([F({ h: [20, 74], n: [30, 78], p: [62, 84], k: [80, 112], f: [100, 104], e: [34, 112], w: [52, 112] }), L(55, 126, 'trzymaj 20–40 s')])
  ];
  o.b2x = [
    fr([R(8, 88, 86, 10), P('M16 98 V112 M84 98 V112'), F({ h: [14, 78], n: [24, 80], p: [58, 84], k: [76, 86], f: [96, 88], e: [34, 92], w: [44, 98] }), O(94, 82, 4)]),
    fr([R(8, 88, 86, 10), P('M16 98 V112 M84 98 V112'), F({ h: [14, 78], n: [24, 80], p: [58, 84], k: [76, 86], f: [74, 60], e: [34, 92], w: [44, 98] }), O(72, 56, 4), C('M102 76 Q100 56 86 50', 86, 50, -1, -0.3)])
  ];
  o.b3x = [
    fr([P('M38 50 L54 86'), R(46, 94, 26, 8), P('M60 102 V112'), P('M28 112 H36'), F({ h: [40, 42], n: [46, 52], p: [62, 90], k: [46, 98], f: [34, 112], e: [34, 64], w: [20, 68] }), O(20, 68, 3)]),
    fr([P('M38 50 L54 86'), R(46, 94, 26, 8), P('M60 102 V112'), P('M28 112 H36'), F({ h: [40, 42], n: [46, 52], p: [62, 90], k: [46, 98], f: [34, 112], e: [60, 70], w: [40, 64] }), O(40, 64, 3), A(8, 82, 28, 82)])
  ];
  o.b4x = [
    fr([R(58, 92, 44, 20), F({ h: [38, 30], n: [38, 41], p: [38, 76], k: [56, 86], f: [66, 92], k2: [38, 98], f2: [38, 112], e: [42, 58], w: [44, 76] })]),
    fr([R(58, 92, 44, 20), F({ h: [78, 10], n: [78, 21], p: [78, 56], k: [78, 74], f: [78, 92], k2: [64, 80], f2: [52, 102], e: [82, 38], w: [84, 56] }), A(30, 80, 30, 58)])
  ];
  o.b6x = [
    fr([R(30, 84, 50, 8), P('M55 92 V112'), F({ h: [55, 30], n: [55, 41], p: [55, 80], k: [47, 86], f: [45, 112], k2: [63, 86], f2: [65, 112], e: [43, 58], w: [42, 72], e2: [67, 58], w2: [68, 72] }), O(43, 58, 4), O(67, 58, 4)]),
    fr([R(30, 84, 50, 8), P('M55 92 V112'), F({ h: [55, 30], n: [55, 41], p: [55, 80], k: [47, 86], f: [45, 112], k2: [63, 86], f2: [65, 112], e: [36, 44], w: [22, 42], e2: [74, 44], w2: [88, 42] }), O(36, 44, 4), O(74, 44, 4), A(24, 68, 16, 52), A(86, 68, 94, 52)])
  ];
  o.b7x = [
    fr([F({ h: [14, 104], n: [24, 103], p: [60, 104], k: [76, 90], f: [90, 112], e: [36, 110], w: [48, 110] })]),
    fr([F({ h: [14, 104], n: [24, 103], p: [60, 104], k: [62, 78], f: [80, 84], e: [36, 110], w: [48, 110] }), A(94, 100, 86, 86)])
  ];
  /* rozgrzewka */
  o.w1 = [
    fr(['<path class="propf" d="M6 112 L104 112 L100 104 L10 108 Z"/>', P('M84 104 V70 H70'), F({ h: [50, 22], n: [50, 33], p: [50, 68], k: [60, 88], f: [64, 108], k2: [42, 90], f2: [34, 108], e: [60, 50], w: [68, 60], e2: [42, 50], w2: [34, 60] })], true),
    fr(['<path class="propf" d="M6 112 L104 112 L100 104 L10 108 Z"/>', P('M84 104 V70 H70'), F({ h: [50, 22], n: [50, 33], p: [50, 68], k: [40, 88], f: [34, 108], k2: [60, 90], f2: [66, 108], e: [42, 50], w: [34, 60], e2: [60, 50], w2: [68, 60] }), A(14, 40, 30, 40)], true)
  ];
  o.w2 = [
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k: [48, 90], f: [46, 112], k2: [62, 90], f2: [64, 112], e: [36, 32], w: [18, 30], e2: [74, 32], w2: [92, 30] })]),
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k: [48, 90], f: [46, 112], k2: [62, 90], f2: [64, 112], e: [44, 20], w: [40, 6], e2: [66, 20], w2: [70, 6] }), C('M18 56 A30 30 0 0 1 28 14', 28, 14, 0.5, -0.85)])
  ];
  o.w3 = [
    fr([F({ h: [24, 74], n: [32, 66], p: [66, 68], c: [49, 48], k: [72, 112], f: [92, 112], e: [36, 90], w: [38, 112] }), A(49, 40, 49, 28)]),
    fr([F({ h: [22, 56], n: [32, 66], p: [66, 68], c: [49, 84], k: [72, 112], f: [92, 112], e: [36, 90], w: [38, 112] }), A(49, 92, 49, 104)])
  ];
  o.w4 = [
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k2: [62, 90], f2: [64, 112], k: [46, 76], f: [46, 94], e: [42, 50], w: [48, 64], e2: [68, 50], w2: [62, 64] })]),
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k2: [62, 90], f2: [64, 112], k: [28, 76], f: [30, 94], e: [42, 50], w: [48, 64], e2: [68, 50], w2: [62, 64] }), C('M46 62 A14 14 0 0 0 30 64', 30, 64, -0.6, 0.8)])
  ];
  o.w5 = [
    fr([F({ h: [14, 104], n: [24, 102], p: [58, 104], k: [74, 84], f: [86, 112], e: [36, 108], w: [48, 108] })]),
    fr([F({ h: [14, 104], n: [24, 102], p: [58, 80], k: [76, 80], f: [86, 112], e: [36, 108], w: [48, 108] }), A(68, 106, 68, 90)])
  ];
  o.w6 = [
    fr([F(Object.assign({}, stand, { e: [54, 50], w: [56, 66] }))]),
    fr([F({ h: [58, 44], n: [56, 54], p: [42, 84], k: [66, 90], f: [56, 112], e: [70, 62], w: [84, 58] }), A(28, 58, 28, 80)])
  ];
  o.w7 = [
    fr([F({ h: [55, 20], n: [55, 31], p: [55, 66], k: [46, 88], f: [44, 112], k2: [64, 88], f2: [66, 112], e: [42, 50], w: [48, 64], e2: [68, 50], w2: [62, 64] }), '<path class="prop" style="stroke-width:3.5" d="M44 100 Q55 104 66 100 Q55 96 44 100"/>']),
    fr([F({ h: [50, 20], n: [50, 31], p: [50, 66], k: [30, 86], f: [26, 112], k2: [64, 88], f2: [66, 112], e: [38, 50], w: [44, 64], e2: [62, 50], w2: [56, 64] }), '<path class="prop" style="stroke-width:3.5" d="M26 100 Q46 106 66 100 Q46 94 26 100"/>', A(20, 56, 6, 56)])
  ];
  o.w8 = [
    fr([BAR(14, 100, 96), PL(24, 100, 9), PL(86, 100, 9), L(55, 84, 'lekko')]),
    fr([BAR(14, 100, 96), PL(20, 100, 11), PL(30, 100, 9), PL(80, 100, 9), PL(90, 100, 11), L(55, 84, 'ciężar roboczy')])
  ];
  return o;
})();

/* =========================================================
   Sylwetka z mięśniami
   ========================================================= */
const MUSCLE_NAMES = {
  shoulders: 'barki', chest: 'klatka piersiowa', biceps: 'biceps', triceps: 'triceps', core: 'brzuch / core',
  quads: 'przód ud', abductors: 'boki pośladków', hipflexors: 'zginacze bioder', upperback: 'górna część pleców',
  lats: 'najszersze grzbietu', lowerback: 'dolny odcinek pleców', glutes: 'pośladki', hamstrings: 'tył ud', calves: 'łydki', traps: 'kaptury'
};
const MUSCLE_SHAPES = {
  shoulders: [[17, 37, 5.5, 5.5], [43, 37, 5.5, 5.5], [77, 37, 5.5, 5.5], [103, 37, 5.5, 5.5]],
  chest: [[30, 46, 12, 6]],
  biceps: [[13, 52, 3.5, 8], [47, 52, 3.5, 8]],
  triceps: [[73, 52, 3.5, 8], [107, 52, 3.5, 8]],
  core: [[30, 64, 7.5, 11]],
  quads: [[23, 94, 5.5, 17], [37, 94, 5.5, 17]],
  abductors: [[16, 80, 4, 8], [44, 80, 4, 8], [80, 76, 3.5, 6], [100, 76, 3.5, 6]],
  hipflexors: [[25, 77, 3.5, 6], [35, 77, 3.5, 6]],
  traps: [[90, 36, 9, 5]],
  upperback: [[90, 46, 12, 6]],
  lats: [[81, 58, 5.5, 11], [99, 58, 5.5, 11]],
  lowerback: [[90, 71, 6, 5]],
  glutes: [[84, 83, 6.5, 6.5], [96, 83, 6.5, 6.5]],
  hamstrings: [[83, 103, 5.5, 15], [97, 103, 5.5, 15]],
  calves: [[83, 128, 4, 9], [97, 128, 4, 9]]
};
function bodySVG(primary, secondary) {
  function outline(cx) {
    return '<circle class="body" cx="' + cx + '" cy="17" r="7"/>' +
      '<path class="body" d="M' + (cx - 13) + ' 30 L' + (cx + 13) + ' 30 L' + (cx + 12) + ' 74 L' + (cx + 14) + ' 140 L' + (cx + 4) + ' 140 L' + (cx + 2) + ' 80 L' + (cx - 2) + ' 80 L' + (cx - 4) + ' 140 L' + (cx - 14) + ' 140 L' + (cx - 12) + ' 74 Z"/>' +
      '<path class="body" d="M' + (cx - 13) + ' 32 L' + (cx - 20) + ' 72 L' + (cx - 15) + ' 73 L' + (cx - 9) + ' 50"/>' +
      '<path class="body" d="M' + (cx + 13) + ' 32 L' + (cx + 20) + ' 72 L' + (cx + 15) + ' 73 L' + (cx + 9) + ' 50"/>';
  }
  let s = '<svg viewBox="0 0 120 150" role="img" aria-label="Zaangażowane mięśnie">' + outline(30) + outline(90);
  Object.keys(MUSCLE_SHAPES).forEach(function (k) {
    const cls = primary.indexOf(k) >= 0 ? 'm on' : secondary.indexOf(k) >= 0 ? 'm sec' : 'm';
    MUSCLE_SHAPES[k].forEach(function (e) {
      s += '<ellipse class="' + cls + '" cx="' + e[0] + '" cy="' + e[1] + '" rx="' + e[2] + '" ry="' + e[3] + '"/>';
    });
  });
  s += '<text x="30" y="148" text-anchor="middle" font-size="7" fill="currentColor" opacity=".6">przód</text><text x="90" y="148" text-anchor="middle" font-size="7" fill="currentColor" opacity=".6">tył</text></svg>';
  return s;
}

/* =========================================================
   Ćwiczenia — pełne instrukcje
   kind: dumbbell | machine | barbell | legpress | body
   step = skok steppera (kg), inc = skok progresji (kg)
   ========================================================= */
function yt(q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q); }

const EX = {};
function defEx(e) { EX[e.id] = e; }

defEx({
  id: 'a1', name: 'Przysiad goblet', short: 'Przysiad goblet', kind: 'dumbbell', step: 1, inc: 1,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'a1x',
  primary: ['quads', 'glutes'], secondary: ['core', 'hamstrings'],
  musclesText: 'Przód ud i pośladki robią większość pracy; brzuch trzyma tułów prosto. To najważniejszy wzorzec ruchu w całym planie.',
  setup: 'Weź kettlebell albo hantel z półki z hantlami (na start 4–8 kg). Trzymaj go oburącz przy klatce, jak kielich — łokcie skierowane w dół, pod ciężarem. Stopy na szerokość bioder lub odrobinę szerzej, palce lekko na zewnątrz.',
  steps: ['Stań stabilnie, ciężar przy mostku, łokcie pod nim.', 'Weź wdech, napnij brzuch i zacznij ruch od cofnięcia bioder i zgięcia kolan — jakbyś siadała na niskie krzesło.', 'Schodź kontrolowanie, aż uda będą mniej więcej równolegle do podłogi (albo tak nisko, jak wygodnie, z prostymi plecami).', 'Kolana idą w kierunku palców stóp, pięty cały czas na ziemi.', 'Wypchnij podłogę stopami i wróć do stania, wydychając powietrze.'],
  mistakes: [{ e: 'Kolana schodzą do środka.', fix: 'Lekko rozpychaj kolana na zewnątrz, w linii palców stóp.' }, { e: 'Pięty odrywają się od podłogi.', fix: 'Zmniejsz głębokość, rozstaw stopy szerzej albo podłóż pod pięty małe talerze.' }, { e: 'Plecy zaokrąglają się na dole.', fix: 'Trzymaj ciężar blisko klatki, patrz przed siebie i zejdź trochę płycej.' }],
  cue: 'Wyobraź sobie, że siadasz na krzesło, które ktoś odsunął — biodra idą w tył, a ciężar przy klatce trzyma Cię prosto.',
  start: { big: '4–8 kg', txt: 'Hantel lub kettlebell. Pierwsze serie na 4 kg, żeby poczuć ruch — dołóż, gdy 12 powtórzeń będzie lekkie.' },
  video: yt('przysiad goblet technika kobiety')
});
defEx({
  id: 'a1x', name: 'Przysiad do ławki bez ciężaru', short: 'Przysiad do ławki', kind: 'body', noWeight: true, step: 1, inc: 1,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90,
  primary: ['quads', 'glutes'], secondary: ['core'],
  musclesText: 'Przód ud i pośladki. Ławka daje poczucie bezpieczeństwa i uczy, jak głęboko schodzić.',
  setup: 'Ławka lub skrzynia o wysokości mniej więcej Twoich kolan. Stań tyłem do niej, łydki prawie dotykają krawędzi, stopy na szerokość bioder.',
  steps: ['Ręce wyciągnij przed siebie — pomagają w równowadze.', 'Cofaj biodra i zginaj kolana, jakbyś powoli siadała.', 'Delikatnie dotknij ławki pośladkami — nie opadaj na nią.', 'Od razu wstań, wypychając podłogę stopami, i zaciśnij pośladki na górze.'],
  mistakes: [{ e: 'Opadanie na ławkę całym ciężarem.', fix: 'Kontroluj ruch do samego końca — dotknij i wracaj.' }, { e: 'Kolana uciekają do środka.', fix: 'Kolana w linii stóp, lekko na zewnątrz.' }, { e: 'Odrywanie pięt.', fix: 'Cały ciężar na całej stopie, szczególnie na piętach.' }],
  cue: 'Siadasz na gorące krzesło — dotknij i od razu wstajesz.',
  start: { big: 'bez ciężaru', txt: 'Gdy 12 powtórzeń jest łatwe przez 3 serie — weź niższą ławkę albo przejdź do przysiadu goblet z lekkim hantlem.' },
  video: yt('przysiad do ławki box squat bez ciężaru technika')
});
defEx({
  id: 'a2', name: 'Hip thrust', short: 'Hip thrust', kind: 'barbell', step: 2.5, inc: 5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'a2x',
  primary: ['glutes'], secondary: ['hamstrings', 'core'],
  musclesText: 'Najlepsze ćwiczenie na pośladki w planie. Tył ud pomaga, brzuch stabilizuje.',
  setup: 'Ławka o wysokości ok. kolan (najczęściej płaska ławka do wyciskania). Usiądź na podłodze plecami do ławki tak, aby dolna krawędź łopatek opierała się o jej krawędź. Sztanga (albo hantel) leży na biodrach — podłóż pod nią miękką osłonę (gąbkę z siłowni). Stopy płasko, na szerokość bioder, tak żeby na górze ruchu kolana były zgięte pod kątem ok. 90°. Jeśli na siłowni jest maszyna do hip thrustu — usiądź w niej, pas na biodrach, i wykonaj ten sam ruch.',
  steps: ['Oprzyj górną część pleców o ławkę, sztanga na biodrach, dłonie na gryfie.', 'Broda lekko do klatki, wzrok przed siebie — nie w sufit.', 'Wypchnij biodra w górę przez pięty, aż uda i tułów utworzą prostą linię.', 'Na górze mocno zaciśnij pośladki na 1 sekundę — nie wyginaj lędźwi.', 'Powoli opuść biodra prawie do podłogi i powtórz.'],
  mistakes: [{ e: 'Wyginanie lędźwi na górze.', fix: 'Podwiń lekko miednicę („schowaj ogon”) i ściskaj pośladki, nie wypychaj brzucha.' }, { e: 'Stopy za daleko od bioder.', fix: 'Ustaw je tak, żeby na górze łydki były pionowo.' }, { e: 'Wzrok w sufit, odchylona głowa.', fix: 'Patrz przed siebie, broda schowana — to chroni szyję i kręgosłup.' }],
  cue: 'Na górze ruchu spróbuj zgnieść orzech między pośladkami.',
  start: { big: 'sam gryf (15–20 kg)', txt: 'Albo hantel 8–12 kg na biodrach. Krótszy, lżejszy gryf (10–15 kg) też jest OK. Zanim dołożysz talerze — 2 serie na samym gryfie.' },
  video: yt('hip thrust technika kobiety')
});
defEx({
  id: 'a2x', name: 'Glute bridge z hantlem na biodrach', short: 'Glute bridge z hantlem', kind: 'dumbbell', step: 1, inc: 2,
  sets: 3, min: 12, max: 15, repsLabel: '12–15', rest: '60–90 s', restSec: 75,
  primary: ['glutes'], secondary: ['hamstrings', 'core'],
  musclesText: 'Pośladki, z pomocą tyłu ud. Bezpieczna, podłogowa wersja hip thrustu.',
  setup: 'Mata na podłodze. Połóż się na plecach, kolana zgięte, stopy płasko na szerokość bioder, pięty ok. 20–30 cm od pośladków. Hantel (na start 6–10 kg) połóż poprzecznie na biodrach i przytrzymaj dłońmi.',
  steps: ['Dociśnij lędźwie do maty, napnij brzuch.', 'Wypchnij biodra w górę przez pięty, aż ciało utworzy linię od kolan do barków.', 'Na górze zaciśnij pośladki na 1–2 sekundy.', 'Opuszczaj powoli, nie kładź bioder całkiem na podłodze między powtórzeniami.'],
  mistakes: [{ e: 'Wypychanie bioder za wysoko z wygięciem pleców.', fix: 'Zatrzymaj się w linii prostej, żebra „w dół”.' }, { e: 'Praca tyłem ud zamiast pośladkami (skurcze łydki).', fix: 'Przysuń stopy bliżej pośladków.' }, { e: 'Za szybkie tempo.', fix: '1 s w górę, 1–2 s zatrzymania, 2 s w dół.' }],
  cue: 'Podnosisz biodra, jakbyś chciała nimi dosięgnąć sufitu — ale pośladki są dźwigiem.',
  start: { big: '6–10 kg', txt: 'Hantel na biodrach. Bez hantla to świetne ćwiczenie rozgrzewkowe; z hantlem — pełnoprawna alternatywa.' },
  video: yt('glute bridge z hantlem mostek biodrowy technika')
});
defEx({
  id: 'a3', name: 'Ściąganie drążka wyciągu górnego do klatki', short: 'Ściąganie drążka', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'a3x',
  primary: ['lats', 'upperback'], secondary: ['biceps', 'shoulders'],
  musclesText: 'Najszersze grzbietu — mięśnie, które robią „V” pleców i wąską talię optycznie. Biceps pomaga.',
  setup: 'Wysoka maszyna z siedziskiem, drążkiem na lince u góry i wałkiem na uda. Ustaw wałek (dźwignia lub pokrętło z boku) tak, aby dociskał uda, gdy stopy stoją płasko na podłodze. Chwyć drążek nachwytem (kciuki do środka) trochę szerzej niż barki. Ciężar na stosie: wsuń bolec (na start 15–20 kg).',
  steps: ['Usiądź, uda pod wałkiem, ręce wyprostowane, klatka lekko uniesiona.', 'Odchyl tułów minimalnie w tył (10–15°).', 'Zacznij od ściągnięcia łopatek w dół, potem ciągnij łokcie w dół i do tyłu.', 'Drążek dochodzi do górnej części klatki (mostek).', 'Wracaj powoli, do pełnego wyprostu rąk — ale bez „wiszenia” na barkach.'],
  mistakes: [{ e: 'Bujanie tułowiem, żeby dociągnąć drążek.', fix: 'Zmniejsz ciężar; tułów zostaje stabilny.' }, { e: 'Ciągnięcie drążka za głowę.', fix: 'Zawsze do klatki — kark Ci podziękuje.' }, { e: 'Barki podniesione do uszu.', fix: 'Najpierw ściągnij łopatki w dół, dopiero potem ciągnij.' }],
  cue: 'Schowaj łokcie do tylnych kieszeni spodni — ręce to tylko haki.',
  start: { big: '15–25 kg', txt: 'Na stosie maszyny; zwykle 1 cegiełka = 5 kg. Jeśli 10 powtórzeń nie wychodzi — zdejmij jedną.' },
  video: yt('ściąganie drążka wyciągu górnego do klatki technika')
});
defEx({
  id: 'a3x', name: 'Podciąganie na maszynie z asystą', short: 'Podciąganie z asystą', kind: 'machine', step: 5, inc: -5, assist: true,
  sets: 3, min: 8, max: 10, repsLabel: '8–10', rest: '90 s', restSec: 90,
  primary: ['lats', 'upperback'], secondary: ['biceps', 'core'],
  musclesText: 'Plecy (najszersze) i biceps — jak przy podciąganiu, ale maszyna „odejmuje” część Twojej wagi.',
  setup: 'Wysoka maszyna z drążkiem u góry i poduszką (lub platformą) na kolana, która podnosi się razem z Tobą. Uwaga: tutaj ciężar na stosie POMAGA — im więcej kilogramów, tym łatwiej. Na start ustaw ok. 60–70% swojej masy ciała (np. 40–45 kg przy 65 kg). Wejdź po stopniach, klęknij na poduszce, chwyć drążek szerzej niż barki.',
  steps: ['Zwiś na prostych rękach, kolana na poduszce, brzuch napięty.', 'Ściągnij łopatki w dół, potem ciągnij łokcie w dół, aż broda znajdzie się na wysokości drążka.', 'Zatrzymaj na chwilę na górze.', 'Opuszczaj się powoli (2–3 s) do pełnego wyprostu.'],
  mistakes: [{ e: 'Szarpanie i „skakanie” z poduszki.', fix: 'Więcej asysty, spokojne tempo.' }, { e: 'Krótki zakres ruchu.', fix: 'Pełny wyprost rąk na dole — nawet kosztem ciężaru.' }, { e: 'Wzruszanie barkami.', fix: 'Łopatki w dół, szyja długa.' }],
  cue: 'Ciągniesz drążek do siebie, nie siebie do drążka — łokcie do bioder.',
  start: { big: 'asysta 40–50 kg', txt: 'Progresja działa odwrotnie: gdy 10 powtórzeń jest łatwe, ZMNIEJSZ asystę o 5 kg.' },
  video: yt('podciąganie na maszynie z asystą technika')
});
defEx({
  id: 'a4', name: 'Wyciskanie na maszynie siedząc (chest press)', short: 'Chest press', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'a4x',
  primary: ['chest'], secondary: ['shoulders', 'triceps'],
  musclesText: 'Klatka piersiowa; pomagają przód barków i triceps (tył ramienia). Maszyna prowadzi tor ruchu, więc to bezpieczny start.',
  setup: 'Maszyna z siedziskiem, oparciem i dwoma uchwytami na wysokości klatki. Wyreguluj siedzisko tak, aby uchwyty były na wysokości środka klatki, gdy siedzisz z plecami na oparciu. Stopy płasko. Wiele maszyn ma pedał, który przybliża uchwyty do pozycji startowej — użyj go. Ciężar 10–20 kg.',
  steps: ['Usiądź, plecy i głowa przy oparciu, łopatki lekko ściągnięte.', 'Chwyć uchwyty; łokcie pod kątem ok. 45° od tułowia (nie szeroko na boki).', 'Wypchnij uchwyty przed siebie na wydechu, do prawie prostych rąk.', 'Wracaj powoli (2 s), aż dłonie będą na wysokości klatki.', 'Nie odrywaj pleców od oparcia.'],
  mistakes: [{ e: 'Łokcie szeroko na boki.', fix: 'Trzymaj je bliżej tułowia (45°) — mniej obciążenia dla barków.' }, { e: 'Blokowanie łokci z „trzaskiem”.', fix: 'Zatrzymaj ruch tuż przed pełnym wyprostem.' }, { e: 'Barki uciekają w górę.', fix: 'Klatka do góry, barki w dół i w tył.' }],
  cue: 'Odpychasz od siebie ciężkie drzwi — całą dłonią, spokojnie.',
  start: { big: '10–20 kg', txt: 'Na stosie. Zacznij od najmniejszego ciężaru, żeby wyczuć tor ruchu.' },
  video: yt('wyciskanie na maszynie chest press technika')
});
defEx({
  id: 'a4x', name: 'Wyciskanie hantli na ławce płaskiej', short: 'Wyciskanie hantli', kind: 'dumbbell', step: 1, inc: 1,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90,
  primary: ['chest'], secondary: ['shoulders', 'triceps'],
  musclesText: 'Klatka piersiowa, przód barków, triceps. Hantle uczą stabilizacji — każda ręka pracuje osobno.',
  setup: 'Płaska ławka. Weź dwa lekkie hantle (2×4–6 kg). Usiądź na końcu ławki z hantlami na udach, a potem połóż się, „wnosząc” hantle kolanami na wysokość klatki. Stopy płasko na podłodze, łopatki ściągnięte.',
  steps: ['Hantle na wysokości klatki, łokcie pod kątem ok. 45° od tułowia.', 'Wyciśnij hantle w górę na wydechu, aż ręce będą prawie proste, hantle nad klatką (nie nad twarzą).', 'Opuszczaj powoli (2 s) do wysokości klatki.', 'Na końcu serii opuść hantle na uda i usiądź — nie rzucaj ich.'],
  mistakes: [{ e: 'Hantle „uciekają” na boki.', fix: 'Lżejsze hantle, prowadź je lekko do środka na górze.' }, { e: 'Odrywanie bioder od ławki.', fix: 'Stopy mocno w podłogę, brzuch napięty.' }, { e: 'Wyginanie nadgarstków.', fix: 'Nadgarstek prosto nad łokciem, hantel „na kości”.' }],
  cue: 'Wyciskasz po lekkim łuku — jakby dłonie chciały się spotkać nad klatką.',
  start: { big: '2× 4–6 kg', txt: 'Pierwsze 2 serie z 4 kg — poznaj ruch, potem dokładaj po 1 kg.' },
  video: yt('wyciskanie hantli na ławce płaskiej technika kobiety')
});
defEx({
  id: 'a5', name: 'Wyciskanie hantli nad głowę siedząc', short: 'Wyciskanie nad głowę', kind: 'dumbbell', step: 1, inc: 1,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '60–90 s', restSec: 75, alt: 'a5x',
  primary: ['shoulders'], secondary: ['triceps', 'core'],
  musclesText: 'Barki (głównie przód i bok), triceps. Ładne, zaokrąglone barki optycznie zwężają talię.',
  setup: 'Ławka z regulowanym oparciem — ustaw je prawie pionowo (80–90°). Weź lekkie hantle (2×4–6 kg). Usiądź, plecy przy oparciu, stopy płasko i szeroko.',
  steps: ['Unieś hantle na wysokość barków, dłonie skierowane do przodu lub lekko do siebie.', 'Napnij brzuch, żebra „w dół” — nie wyginaj lędźwi.', 'Wyciśnij hantle w górę na wydechu, aż ręce będą prawie proste, hantle nad głową.', 'Opuszczaj powoli do wysokości uszu.', 'Ruch po lekkim łuku, bez stukania hantlami na górze.'],
  mistakes: [{ e: 'Wyginanie lędźwi.', fix: 'Oparcie bliżej pionu, brzuch napięty, mniej ciężaru.' }, { e: 'Wzruszanie barkami.', fix: 'Barki w dół, szyja długa.' }, { e: 'Łokcie szeroko na boki na dole.', fix: 'Łokcie lekko przed tułowiem, nie na boki.' }],
  cue: 'Rośnij w górę — wypychasz sufit, nie hantle.',
  start: { big: '2× 4–6 kg', txt: 'Barki to małe mięśnie: 4 kg na start to nie wstyd. Dokładaj po 1 kg.' },
  video: yt('wyciskanie hantli nad głowę siedząc technika')
});
defEx({
  id: 'a5x', name: 'Wyciskanie na maszynie (shoulder press)', short: 'Shoulder press', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '60–90 s', restSec: 75,
  primary: ['shoulders'], secondary: ['triceps'],
  musclesText: 'Barki i triceps. Maszyna prowadzi ruch — dobra opcja, gdy hantle jeszcze „latają”.',
  setup: 'Maszyna z siedziskiem i uchwytami nad barkami (czasem nazywana „shoulder press” lub „overhead press”). Ustaw siedzisko tak, aby uchwyty były na wysokości barków lub tuż nad nimi, gdy siedzisz. Stopy płasko. Ciężar 10–15 kg.',
  steps: ['Usiądź, plecy przy oparciu, chwyć uchwyty.', 'Wypchnij uchwyty w górę na wydechu, do prawie prostych rąk.', 'Opuszczaj powoli do wysokości uszu.', 'Nie odrywaj pleców od oparcia.'],
  mistakes: [{ e: 'Blokowanie łokci na górze.', fix: 'Zatrzymaj ruch tuż przed pełnym wyprostem.' }, { e: 'Uchwyty za nisko (poniżej barków).', fix: 'Podnieś siedzisko, żeby start był na wysokości barków.' }, { e: 'Wyginanie pleców.', fix: 'Brzuch napięty, mniejszy ciężar.' }],
  cue: 'Wypychasz sufit — ramiona rosną w górę, barki zostają w dole.',
  start: { big: '10–15 kg', txt: 'Na stosie. Zacznij od najmniejszej cegiełki.' },
  video: yt('wyciskanie nad głowę na maszynie shoulder press technika')
});
defEx({
  id: 'a6', name: 'Odwodzenie nóg na maszynie (hip abduction)', short: 'Odwodzenie nóg', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 12, max: 15, repsLabel: '12–15', rest: '60 s', restSec: 60, alt: 'a6x',
  primary: ['abductors'], secondary: ['glutes'],
  musclesText: 'Boczna część pośladków (pośladkowy średni) — odpowiada za „okrągły” kształt z boku i stabilne kolana.',
  setup: 'Maszyna z siedziskiem i dwoma wałkami po ZEWNĘTRZNEJ stronie kolan. Uwaga: obok często stoi bliźniacza maszyna do przywodzenia (wałki wewnątrz, między kolanami) — Ty potrzebujesz tej, w której wałki są na zewnątrz. Usiądź, plecy przy oparciu, kolana przy wałkach. Ciężar 15–25 kg.',
  steps: ['Usiądź, stopy na podpórkach, dłonie na uchwytach.', 'Rozchyl kolana na boki na wydechu, kontrolowanie, do wyczuwalnego napięcia w bocznej części pośladków.', 'Zatrzymaj na 1 s w najszerszym punkcie.', 'Wracaj powoli — nie pozwól, żeby ciężar „opadł”.', 'Możesz pochylić tułów lekko do przodu, żeby mocniej poczuć pośladki.'],
  mistakes: [{ e: 'Szarpanie ciężarem.', fix: 'Zmniejsz ciężar, 2 s w każdą stronę.' }, { e: 'Za mały zakres ruchu.', fix: 'Pełny zakres — jeśli nie idzie, odejmij cegiełkę.' }, { e: 'Napinanie szyi i barków.', fix: 'Rozluźnij górę ciała — pracują tylko biodra.' }],
  cue: 'Rozpychasz ściany windy, która chce się zamknąć.',
  start: { big: '15–25 kg', txt: 'Cegiełki na stosie. To ćwiczenie „lubi” więcej powtórzeń niż kilogramów.' },
  video: yt('odwodzenie nóg na maszynie hip abduction technika')
});
defEx({
  id: 'a6x', name: 'Odwodzenie z gumą oporową w siadzie', short: 'Odwodzenie z gumą', kind: 'body', noWeight: true, step: 1, inc: 1,
  sets: 3, min: 15, max: 20, repsLabel: '15–20', rest: '60 s', restSec: 60,
  primary: ['abductors'], secondary: ['glutes'],
  musclesText: 'Boczna część pośladków. Guma daje opór rosnący z zakresem — świetne „dopalenie” pośladków.',
  setup: 'Mini-guma oporowa (pętla, tzw. mini band — zwykle leży przy matach). Usiądź na ławce lub krześle, załóż gumę tuż nad kolanami. Stopy płasko na szerokość bioder, dłonie na ławce obok bioder.',
  steps: ['Siedź prosto lub pochyl się lekko do przodu.', 'Rozchyl kolana na boki, pokonując opór gumy, do wyczuwalnego napięcia w bokach pośladków.', 'Zatrzymaj na 1 s.', 'Wracaj powoli, nie pozwól gumie „strzelić” kolanami do środka.'],
  mistakes: [{ e: 'Guma zsuwa się poniżej kolan.', fix: 'Załóż ją wyżej, nad kolana.' }, { e: 'Krótki, szybki ruch.', fix: 'Wolniej i szerzej — 2 s na zewnątrz, 2 s do środka.' }, { e: 'Garbienie się.', fix: 'Klatka w górę, plecy proste.' }],
  cue: 'Rozciągasz gumę kolanami, jakbyś chciała ją zerwać — ale powoli.',
  start: { big: 'guma lekka / średnia', txt: 'Gdy 20 powtórzeń jest łatwe — weź mocniejszą gumę albo dodaj 1 s zatrzymania.' },
  video: yt('odwodzenie nóg z gumą w siadzie technika')
});
defEx({
  id: 'a7', name: 'Deska (plank)', short: 'Deska (plank)', kind: 'body', noWeight: true, unit: 's', step: 1, inc: 5,
  sets: 3, min: 20, max: 40, repsLabel: '20–40 s', rest: '60 s', restSec: 60, alt: 'a7x',
  primary: ['core'], secondary: ['shoulders', 'glutes'],
  musclesText: 'Głębokie mięśnie brzucha i cały „gorset” tułowia. Płaski, mocny brzuch to nie tylko wygląd — to zdrowe plecy.',
  setup: 'Mata na podłodze. Nie potrzebujesz sprzętu. W polu „powtórzenia” wpisujesz liczbę sekund.',
  steps: ['Klęknij, oprzyj przedramiona na macie, łokcie dokładnie pod barkami.', 'Wyprostuj nogi, oprzyj się na palcach stóp — ciało w jednej linii od głowy do pięt.', 'Napnij brzuch (jakby ktoś miał Cię szturchnąć) i zaciśnij pośladki.', 'Patrz w podłogę między dłonie, szyja w linii z kręgosłupem.', 'Oddychaj spokojnie i trzymaj 20–40 s.'],
  mistakes: [{ e: 'Biodra w górze („namiot”).', fix: 'Opuść biodra do linii ciała, ściśnij pośladki.' }, { e: 'Biodra opadają, lędźwie się wyginają.', fix: 'Skróć czas i napnij brzuch mocniej.' }, { e: 'Wstrzymywanie oddechu.', fix: 'Licz na głos oddechy.' }],
  cue: 'Jesteś deską — a między łopatki ktoś włożył kartkę, której nie możesz upuścić.',
  start: { big: '20 s', txt: 'Gdy 40 s przez 3 serie jest łatwe, utrudnij: unieś jedną nogę albo wydłuż czas do 60 s.' },
  video: yt('plank deska prawidłowa technika')
});
defEx({
  id: 'a7x', name: 'Deska na kolanach', short: 'Deska na kolanach', kind: 'body', noWeight: true, unit: 's', step: 1, inc: 5,
  sets: 3, min: 20, max: 40, repsLabel: '20–40 s', rest: '60 s', restSec: 60,
  primary: ['core'], secondary: ['shoulders'],
  musclesText: 'Mięśnie brzucha i tułowia — mniejsze obciążenie niż w pełnej desce, ta sama technika.',
  setup: 'Mata. Bez sprzętu. W polu „powtórzenia” wpisujesz sekundy.',
  steps: ['Klęknij, przedramiona na macie, łokcie pod barkami.', 'Przesuń kolana do tyłu tak, aby od kolan do głowy ciało tworzyło prostą linię.', 'Napnij brzuch i pośladki, wzrok w podłogę.', 'Trzymaj 20–40 s, oddychając spokojnie.'],
  mistakes: [{ e: 'Biodra „siadają” w tył, ku piętom.', fix: 'Przesuń kolana dalej, biodra do przodu.' }, { e: 'Zapadanie się między łopatkami.', fix: 'Wypchnij podłogę przedramionami.' }, { e: 'Wstrzymywanie oddechu.', fix: 'Oddychaj — licz oddechy.' }],
  cue: 'Od kolan do czubka głowy jesteś jedną prostą linią — jak stół.',
  start: { big: '20 s', txt: 'Gdy 40 s jest łatwe przez 3 serie — przejdź do pełnej deski.' },
  video: yt('deska na kolanach plank na kolanach technika')
});

/* Trening B */
defEx({
  id: 'b1', name: 'Wyciskanie nogami na suwnicy (leg press)', short: 'Suwnica (leg press)', kind: 'legpress', step: 2.5, inc: 5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'a1',
  primary: ['quads', 'glutes'], secondary: ['hamstrings'],
  musclesText: 'Przód ud i pośladki, tył ud pomaga. Maszyna trzyma plecy — możesz bezpiecznie dokładać ciężar.',
  setup: 'Duża maszyna z platformą na stopy — siedzi się w niej odchylonym do tyłu (suwnica skośna) albo siedząc (pozioma). Ustaw oparcie tak, aby na dole ruchu kolana nie dotykały klatki. Stopy na platformie na szerokość bioder, mniej więcej na środku lub odrobinę wyżej. Blokady bezpieczeństwa (uchwyty z boku) zwalniasz dopiero, gdy stopy są na platformie.',
  steps: ['Usiądź, plecy i biodra dociśnięte do oparcia, stopy na platformie.', 'Wypchnij platformę i zwolnij blokady.', 'Zginaj kolana powoli, opuszczając platformę do kąta ok. 90° w kolanie.', 'Wypchnij przez całą stopę (zwłaszcza pięty), na wydechu.', 'Nie prostuj kolan do końca („na blokadę”) — zostaw lekkie ugięcie.', 'Po ostatnim powtórzeniu załóż blokady i dopiero wtedy zdejmij stopy.'],
  mistakes: [{ e: 'Kolana schodzą do środka.', fix: 'Rozpychaj kolana w linii stóp.' }, { e: 'Biodra odrywają się od oparcia na dole.', fix: 'Nie schodź tak głęboko.' }, { e: 'Prostowanie kolan do blokady.', fix: 'Zatrzymaj tuż przed końcem.' }],
  cue: 'Wypychaj podłogę od siebie, nie ciągnij ciężaru — pięty przyklejone.',
  start: { big: '20–40 kg', txt: 'Talerze na suwnicy. Sama platforma waży ok. 20–30 kg — to już ciężar! Na start bez talerzy lub 2×5 kg.' },
  video: yt('wypychanie nóg na suwnicy leg press technika')
});
defEx({
  id: 'b2', name: 'Rumuński martwy ciąg z hantlami (RDL)', short: 'Rumuński martwy ciąg', kind: 'dumbbell', step: 1, inc: 1,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'b2x',
  primary: ['hamstrings', 'glutes'], secondary: ['lowerback', 'core'],
  musclesText: 'Tył ud i pośladki — „tylna taśma”. Dolny odcinek pleców pracuje jako stabilizator.',
  setup: 'Dwa hantle (na start 2×6–8 kg). Stań na szerokość bioder, hantle przed udami, dłonie skierowane do siebie (do ud).',
  steps: ['Stań prosto, hantle przy udach, kolana lekko ugięte — i tak zostają przez cały ruch.', 'Cofaj biodra w tył, jakbyś chciała nimi zamknąć drzwi — plecy proste.', 'Hantle zsuwają się blisko nóg, do wysokości połowy piszczeli (lub gdy poczujesz mocne rozciąganie tyłu ud).', 'Wróć do góry, wypychając biodra w przód i ściskając pośladki.', 'Na górze stań prosto — nie wyginaj się w tył.'],
  mistakes: [{ e: 'Zaokrąglone plecy.', fix: 'Zmniejsz zakres, klatka w górę, patrz 2 m przed siebie na podłogę.' }, { e: 'Zginanie kolan jak w przysiadzie.', fix: 'To ruch bioder w tył — kolana prawie nieruchome.' }, { e: 'Hantle daleko od nóg.', fix: 'Zsuwaj je po udach i piszczelach.' }],
  cue: 'Biodrami sięgnij ściany za sobą; hantle po prostu jadą po nogach.',
  start: { big: '2× 6–10 kg', txt: 'Najpierw 2 serie z 6 kg — RDL łatwo „wziąć plecami”, gdy technika jeszcze nie siedzi.' },
  video: yt('rumuński martwy ciąg z hantlami technika')
});
defEx({
  id: 'b2x', name: 'Uginanie nóg leżąc na maszynie', short: 'Uginanie nóg leżąc', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90,
  primary: ['hamstrings'], secondary: ['glutes', 'calves'],
  musclesText: 'Tył ud w izolacji — bez obciążania pleców.',
  setup: 'Maszyna, na której leży się na brzuchu; wałek nad piętami (ustaw go tak, aby leżał tuż nad kostkami). Kolana powinny być minimalnie poza krawędzią ławki, biodra dociśnięte. Ciężar 15–20 kg.',
  steps: ['Połóż się, chwyć uchwyty, biodra dociśnięte do ławki.', 'Uginaj kolana, przyciągając pięty do pośladków na wydechu.', 'Zatrzymaj na 1 s na górze.', 'Opuszczaj powoli (2–3 s), prawie do wyprostu.'],
  mistakes: [{ e: 'Unoszenie bioder z ławki.', fix: 'Mniej ciężaru, biodra wciśnięte w ławkę.' }, { e: 'Szybkie opuszczanie.', fix: 'Faza w dół zawsze wolniejsza.' }, { e: 'Wałek na łydkach zamiast nad kostkami.', fix: 'Przesuń regulację wałka niżej.' }],
  cue: 'Przyciągasz pięty do pośladków, jakbyś chciała nimi kopnąć własne plecy — powoli.',
  start: { big: '15–20 kg', txt: 'Na stosie. Tył ud lubi kontrolowane tempo bardziej niż ciężar.' },
  video: yt('uginanie nóg leżąc na maszynie technika')
});
defEx({
  id: 'b3', name: 'Wiosłowanie na wyciągu dolnym siedząc', short: 'Wiosłowanie siedząc', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, alt: 'b3x',
  primary: ['upperback', 'lats'], secondary: ['biceps', 'shoulders'],
  musclesText: 'Środek pleców i najszerste grzbietu — mięśnie „prostej postawy”. Biceps i tył barków pomagają.',
  setup: 'Niska maszyna z siedziskiem, podnóżkami i uchwytem na lince (najczęściej trójkątny uchwyt „V”). Usiądź, stopy na podnóżkach, kolana lekko ugięte. Chwyć uchwyt i odsuń się tak, żeby ręce były proste, a tułów pionowy. Ciężar 15–25 kg.',
  steps: ['Siedź prosto, klatka w górę, ręce proste, lekki naciąg linki.', 'Ściągnij łopatki, potem ciągnij łokcie wzdłuż tułowia do tyłu.', 'Uchwyt dochodzi do dolnej części brzucha.', 'Zatrzymaj na 1 s, ściskając łopatki.', 'Wracaj powoli, pozwól łopatkom „odjechać” do przodu — tułów zostaje prosty.'],
  mistakes: [{ e: 'Bujanie tułowiem w przód i w tył.', fix: 'Tułów stabilny — ciężar mniejszy.' }, { e: 'Barki do uszu.', fix: 'Łopatki w dół i w tył.' }, { e: 'Ciągnięcie samymi rękami.', fix: 'Dłonie to haki — ciągną łokcie.' }],
  cue: 'Ściskaj pomarańczę między łopatkami.',
  start: { big: '15–25 kg', txt: 'Cegiełki na stosie. Jeśli tułów się buja — odejmij jedną.' },
  video: yt('wiosłowanie na wyciągu dolnym siedząc technika')
});
defEx({
  id: 'b3x', name: 'Wiosłowanie na maszynie z podparciem klatki', short: 'Wiosłowanie z podparciem', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90,
  primary: ['upperback', 'lats'], secondary: ['biceps'],
  musclesText: 'Środek pleców, najszersze i tył barków. Poduszka na klatkę „wyłącza” bujanie tułowiem.',
  setup: 'Maszyna z siedziskiem, poduszką pod klatkę i uchwytami z przodu (często pod nazwą „seated row” / „chest supported row”). Ustaw siedzisko tak, aby poduszka opierała się o środek klatki, a uchwyty były na wysokości brzucha. Stopy na podnóżkach. Ciężar 15–20 kg.',
  steps: ['Usiądź, klatka na poduszce, chwyć uchwyty.', 'Ściągnij łopatki i ciągnij łokcie do tyłu, wzdłuż tułowia.', 'Zatrzymaj na 1 s.', 'Wracaj powoli do pełnego wyprostu rąk.'],
  mistakes: [{ e: 'Odrywanie klatki od poduszki.', fix: 'Mniej ciężaru, klatka przyklejona.' }, { e: 'Wzruszanie barkami.', fix: 'Barki w dół, długa szyja.' }, { e: 'Szarpanie.', fix: '1 s do siebie, 2 s od siebie.' }],
  cue: 'Łokcie do tylnych kieszeni, łopatki ściskają pomarańczę.',
  start: { big: '15–20 kg', txt: 'Na stosie, od najmniejszej cegiełki.' },
  video: yt('wiosłowanie na maszynie z podparciem klatki technika')
});
defEx({
  id: 'b4', name: 'Wykroki w miejscu', short: 'Wykroki w miejscu', kind: 'dumbbell', step: 1, inc: 1, perSide: true,
  sets: 3, min: 8, max: 10, repsLabel: '8–10 / noga', rest: '90 s', restSec: 90, alt: 'b4x',
  primary: ['quads', 'glutes'], secondary: ['hamstrings', 'core'],
  musclesText: 'Pośladki i przód ud — każda noga osobno, więc wyrównujesz różnice w sile i uczysz się równowagi.',
  setup: 'Miejsce na jeden duży krok. Opcjonalnie hantle (2×3–5 kg) w opuszczonych rękach. Na początku możesz trzymać się jedną ręką stojaka lub ściany dla równowagi.',
  steps: ['Zrób duży krok do przodu jedną nogą — stopy zostają na szerokość bioder (nie na jednej linii, jak na linie).', 'Opuszczaj ciało prosto w dół, aż oba kolana będą zgięte pod kątem ok. 90°; tylne kolano tuż nad podłogą.', 'Przednie kolano nad stopą, pięta przedniej stopy mocno na ziemi.', 'Wypchnij się przez przednią piętę do góry.', 'Zrób wszystkie powtórzenia na jedną nogę, potem zmień.'],
  mistakes: [{ e: 'Przednie kolano „ucieka” do środka.', fix: 'Kolano w linii drugiego palca stopy.' }, { e: 'Za krótki krok — pięta przodu w górze.', fix: 'Wydłuż krok; pięta przedniej stopy zawsze na ziemi.' }, { e: 'Pochylanie się do przodu.', fix: 'Tułów pionowo, wzrok przed siebie.' }],
  cue: 'Opuszczasz się jak winda — prosto w dół, nie do przodu.',
  start: { big: 'bez ciężaru lub 2× 3–5 kg', txt: 'Najpierw bez hantli, aż równowaga będzie pewna. Wpisz 0 kg, jeśli ćwiczysz bez obciążenia.' },
  video: yt('wykroki w miejscu technika')
});
defEx({
  id: 'b4x', name: 'Step-up na skrzynię / stopień', short: 'Step-up', kind: 'dumbbell', step: 1, inc: 1, perSide: true,
  sets: 3, min: 8, max: 10, repsLabel: '8–10 / noga', rest: '90 s', restSec: 90,
  primary: ['glutes', 'quads'], secondary: ['hamstrings', 'core'],
  musclesText: 'Pośladki i przód ud — prostsze w równowadze niż wykroki, a równie skuteczne.',
  setup: 'Stabilna skrzynia, stopień lub ławka o wysokości ok. kolana (na start niższa). Stań przodem, opcjonalnie hantle w dłoniach.',
  steps: ['Postaw całą stopę na skrzyni.', 'Wypchnij się przez piętę stopy na skrzyni i stań na niej prosto — druga noga tylko dołącza, nie odbija się od podłogi.', 'Opuść się powoli tą samą nogą (kontrola w dół!).', 'Wszystkie powtórzenia na jedną nogę, potem zmiana.'],
  mistakes: [{ e: 'Odbijanie się od podłogi drugą nogą.', fix: 'Niższa skrzynia; cała praca w nodze na skrzyni.' }, { e: 'Kolano do środka.', fix: 'Kolano nad stopą, w linii palców.' }, { e: 'Opadanie z hukiem.', fix: '2–3 s w dół.' }],
  cue: 'Stopa na skrzyni jest przyklejona — reszta ciała po prostu do niej dojeżdża.',
  start: { big: 'bez ciężaru lub 2× 3–5 kg', txt: 'Wpisz 0 kg, jeśli bez obciążenia. Dokładaj po 1 kg albo podnieś skrzynię.' },
  video: yt('step up na skrzynię technika')
});
defEx({
  id: 'b5', name: 'Pompki na kolanach lub o podwyższenie', short: 'Pompki', kind: 'body', noWeight: true, step: 1, inc: 1,
  sets: 3, min: 8, max: 12, repsLabel: '8–12', rest: '60–90 s', restSec: 75, alt: 'a4',
  primary: ['chest'], secondary: ['triceps', 'shoulders', 'core'],
  musclesText: 'Klatka, triceps i przód barków; brzuch trzyma ciało w linii. Wersja na kolanach lub o podwyższenie jest po prostu lżejsza.',
  setup: 'Mata (na kolana) albo podwyższenie: ławka, stopień, gryf maszyny Smitha ustawiony na wysokości bioder. Im wyżej ręce, tym łatwiej — wybierz wersję, w której zrobisz 8 czystych powtórzeń.',
  steps: ['Dłonie trochę szerzej niż barki, palce skierowane do przodu.', 'Kolana na macie (lub stopy na podłodze przy podwyższeniu), ciało w jednej linii od kolan/pięt do głowy.', 'Zginaj łokcie pod kątem ok. 45° od tułowia, opuszczając klatkę do podłogi / podwyższenia.', 'Zatrzymaj tuż nad i wypchnij się z powrotem na wydechu.', 'Cały czas napięty brzuch i pośladki.'],
  mistakes: [{ e: 'Biodra opadają, „banan” w plecach.', fix: 'Napnij pośladki i brzuch albo podnieś ręce wyżej.' }, { e: 'Łokcie szeroko na boki.', fix: 'Bliżej tułowia (45°).' }, { e: 'Niepełny zakres.', fix: 'Zejdź niżej, nawet kosztem 2 powtórzeń.' }],
  cue: 'Wkręć dłonie w podłogę na zewnątrz — łokcie same wskoczą na miejsce.',
  start: { big: 'bez ciężaru', txt: 'Progresja: podwyższenie coraz niższe → kolana → pełne pompki. Gdy 12 jest łatwe, obniż podwyższenie.' },
  video: yt('pompki na kolanach technika kobiety')
});
defEx({
  id: 'b6', name: 'Wznosy hantli bokiem', short: 'Wznosy bokiem', kind: 'dumbbell', step: 1, inc: 1,
  sets: 3, min: 12, max: 15, repsLabel: '12–15', rest: '60 s', restSec: 60, alt: 'b6x',
  primary: ['shoulders'], secondary: ['traps'],
  musclesText: 'Boczna część barków — daje ramionom „zaokrąglony” kształt i optycznie zwęża talię.',
  setup: 'Lekkie hantle: 2×2–4 kg. Stań na szerokość bioder, hantle wzdłuż ciała, łokcie minimalnie ugięte.',
  steps: ['Stań prosto, brzuch napięty, hantle przy udach.', 'Unieś ręce bokiem, łokcie lekko ugięte, aż do wysokości barków (nie wyżej).', 'Na górze łokcie są odrobinę wyżej niż dłonie — jak „nalewanie z dzbanka”.', 'Opuszczaj powoli (2–3 s).', 'Nie bujaj tułowiem; jeśli musisz — hantle są za ciężkie.'],
  mistakes: [{ e: 'Wzruszanie barkami do uszu.', fix: 'Barki w dół, ruch prowadzą łokcie.' }, { e: 'Unoszenie ponad barki.', fix: 'Do poziomu i stop.' }, { e: 'Bujanie i „podrzucanie”.', fix: 'Mniejsze hantle.' }],
  cue: 'Sięgasz łokciami do ścian po obu stronach pokoju.',
  start: { big: '2× 2–4 kg', txt: 'Serio, 2 kg. To ćwiczenie techniczne — ciężar rośnie bardzo powoli i to normalne.' },
  video: yt('wznosy hantli bokiem technika')
});
defEx({
  id: 'b6x', name: 'Wznosy bokiem na maszynie', short: 'Wznosy na maszynie', kind: 'machine', step: 1, inc: 2.5,
  sets: 3, min: 12, max: 15, repsLabel: '12–15', rest: '60 s', restSec: 60,
  primary: ['shoulders'], secondary: ['traps'],
  musclesText: 'Boczna część barków. Maszyna prowadzi ruch — trudniej o „bujanie”.',
  setup: 'Maszyna z siedziskiem i poduszkami po zewnętrznej stronie ramion (przy łokciach). Ustaw siedzisko tak, aby oś obrotu maszyny była na wysokości barków. Ciężar 5–10 kg.',
  steps: ['Usiądź, ramiona przy poduszkach, dłonie na uchwytach.', 'Unieś ramiona bokiem do wysokości barków, na wydechu.', 'Zatrzymaj na 1 s.', 'Opuszczaj powoli (2–3 s).'],
  mistakes: [{ e: 'Za wysoko (ponad barki).', fix: 'Do poziomu i stop.' }, { e: 'Wzruszanie barkami.', fix: 'Barki w dół.' }, { e: 'Opadanie ciężaru.', fix: 'Kontroluj fazę w dół.' }],
  cue: 'Podnosisz łokcie, nie dłonie.',
  start: { big: '5–10 kg', txt: 'Najmniejsza cegiełka na start.' },
  video: yt('wznosy bokiem na maszynie lateral raise machine technika')
});
defEx({
  id: 'b7', name: 'Dead bug (martwy robak)', short: 'Dead bug', kind: 'body', noWeight: true, step: 1, inc: 1, perSide: true,
  sets: 3, min: 8, max: 10, repsLabel: '8–10 / str.', rest: '60 s', restSec: 60, alt: 'b7x',
  primary: ['core'], secondary: ['hipflexors'],
  musclesText: 'Głębokie mięśnie brzucha — uczą trzymać lędźwie stabilnie, co przyda się w każdym innym ćwiczeniu.',
  setup: 'Mata. Bez sprzętu. Liczysz powtórzenia na jedną stronę.',
  steps: ['Połóż się na plecach, ręce pionowo nad klatką, nogi uniesione — biodra i kolana pod kątem 90° (jak siedzenie na niewidzialnym krześle).', 'Dociśnij lędźwie do maty — to najważniejsze w całym ćwiczeniu.', 'Na wydechu opuszczaj powoli prawą rękę za głowę i lewą nogę w dół, tuż nad podłogę.', 'Wróć i zrób to samo drugą stroną.', 'Ruch powolny, lędźwie cały czas przy macie.'],
  mistakes: [{ e: 'Lędźwie odrywają się od maty.', fix: 'Mniejszy zakres — noga niżej dopiero, gdy plecy zostają na macie.' }, { e: 'Wstrzymywanie oddechu.', fix: 'Wydech w trakcie opuszczania.' }, { e: 'Za szybko.', fix: 'Licz 3 s w dół.' }],
  cue: 'Pod lędźwiami masz kartkę — nie pozwól, żeby ktoś ją wyciągnął.',
  start: { big: 'bez ciężaru', txt: 'Gdy 10 powtórzeń na stronę jest łatwe — opuszczaj kończyny niżej albo dodaj 2 s zatrzymania.' },
  video: yt('dead bug martwy robak technika')
});
defEx({
  id: 'b7x', name: 'Unoszenie nóg leżąc z ugiętymi kolanami', short: 'Unoszenie nóg leżąc', kind: 'body', noWeight: true, step: 1, inc: 1,
  sets: 3, min: 10, max: 15, repsLabel: '10–15', rest: '60 s', restSec: 60,
  primary: ['core'], secondary: ['hipflexors'],
  musclesText: 'Dolna część brzucha i zginacze bioder.',
  setup: 'Mata. Połóż się na plecach, dłonie pod pośladkami lub wzdłuż ciała, kolana zgięte, stopy na podłodze.',
  steps: ['Dociśnij lędźwie do maty.', 'Unieś kolana w stronę klatki na wydechu, aż uda będą pionowo.', 'Zatrzymaj na chwilę.', 'Opuszczaj powoli, aż stopy dotkną podłogi — bez odrywania lędźwi.'],
  mistakes: [{ e: 'Wyginanie lędźwi przy opuszczaniu.', fix: 'Opuszczaj tylko tak nisko, jak plecy zostają na macie.' }, { e: 'Bujanie i rozpęd.', fix: 'Wolniej, 2 s w górę, 3 s w dół.' }, { e: 'Napinanie szyi.', fix: 'Głowa leży na macie.' }],
  cue: 'Podciągasz kolana brzuchem, a nie nogami.',
  start: { big: 'bez ciężaru', txt: 'Gdy 15 jest łatwe — wyprostuj nogi bardziej albo przejdź do dead buga.' },
  video: yt('unoszenie nóg leżąc z ugiętymi kolanami technika')
});

/* Rozgrzewka */
defEx({
  id: 'w1', name: 'Lekkie kardio na rozgrzanie', short: 'Kardio 5 min', kind: 'body', noWeight: true, warm: true, dur: 300, dose: '5 min',
  primary: ['quads', 'calves'], secondary: ['glutes', 'hamstrings'],
  musclesText: 'Całe ciało — chodzi o podniesienie tętna i temperatury mięśni, nie o zmęczenie.',
  setup: 'Bieżnia (marsz 5–6 km/h z nachyleniem 3–6%), orbitrek albo rower stacjonarny. Na bieżni: wciśnij START, ustaw prędkość strzałkami, nachylenie osobnymi strzałkami „incline”.',
  steps: ['Zacznij spokojnie, przez pierwszą minutę bardzo lekko.', 'Dojdź do tempa, przy którym możesz rozmawiać, ale czujesz, że się rozgrzewasz.', 'Ostatnie 30 s trochę szybciej.', 'Zejdź z maszyny dopiero, gdy się zatrzyma.'],
  mistakes: [{ e: 'Za szybko — zadyszka przed treningiem.', fix: 'To rozgrzewka, nie kardio: tempo rozmowy.' }, { e: 'Trzymanie się poręczy bieżni całą dłonią.', fix: 'Tylko lekko, dla równowagi; ręce pracują naturalnie.' }],
  cue: 'Budzisz ciało, nie ścigasz się z nikim.',
  start: { big: '5 min', txt: 'Tempo rozmowy.' },
  video: yt('rozgrzewka przed treningiem siłowym marsz na bieżni z nachyleniem')
});
defEx({
  id: 'w2', name: 'Krążenia ramion w przód i w tył', short: 'Krążenia ramion', kind: 'body', noWeight: true, warm: true, dur: 30, dose: '10 + 10',
  primary: ['shoulders'], secondary: ['upperback', 'chest'],
  musclesText: 'Barki i obręcz barkowa — przygotowanie do wyciskania i wiosłowania.',
  setup: 'Stań w rozkroku, ręce wyprostowane na boki.',
  steps: ['10 dużych, powolnych kręgów rękami w przód.', '10 kręgów w tył.', 'Zwiększaj zakres z każdym kręgiem.'],
  mistakes: [{ e: 'Małe, szybkie kółka.', fix: 'Duże, powolne — całe ramię pracuje.' }, { e: 'Barki podciągnięte do uszu.', fix: 'Szyja długa, barki w dół.' }],
  cue: 'Rysujesz dłońmi jak największe koła na ścianach obok.',
  start: { big: '10 + 10', txt: '' },
  video: yt('krążenia ramion rozgrzewka barków')
});
defEx({
  id: 'w3', name: 'Kot–krowa (mobilizacja kręgosłupa)', short: 'Kot–krowa', kind: 'body', noWeight: true, warm: true, dur: 40, dose: '8 powtórzeń',
  primary: ['core', 'lowerback'], secondary: ['upperback'],
  musclesText: 'Cały kręgosłup i mięśnie wokół niego — delikatne „rozruszanie” pleców.',
  setup: 'Mata. Klęk podparty: dłonie pod barkami, kolana pod biodrami.',
  steps: ['Kot: na wydechu wypchnij plecy w górę, jak przestraszony kot, broda do klatki.', 'Krowa: na wdechu opuść brzuch w dół, wypnij pośladki, spójrz lekko w górę.', 'Płynnie, 8 razy w każdą stronę.'],
  mistakes: [{ e: 'Ruch tylko w szyi.', fix: 'Zacznij ruch od miednicy — kręg po kręgu.' }, { e: 'Za szybko.', fix: 'Jeden oddech = jedna pozycja.' }],
  cue: 'Kręgosłup to łańcuch — poruszasz każdym ogniwem po kolei.',
  start: { big: '8 powt.', txt: '' },
  video: yt('kot krowa cat cow mobilizacja kręgosłupa')
});
defEx({
  id: 'w4', name: 'Krążenia bioder („otwieranie bramki”)', short: 'Krążenia bioder', kind: 'body', noWeight: true, warm: true, dur: 45, dose: '8 / strona', perSide: true,
  primary: ['abductors', 'hipflexors'], secondary: ['glutes'],
  musclesText: 'Biodra i boki pośladków — przygotowanie do przysiadów i wykroków.',
  setup: 'Stań na jednej nodze (możesz trzymać się ściany).',
  steps: ['Unieś kolano przed siebie do wysokości biodra.', 'Otwórz je na zewnątrz, jak bramkę, i opuść stopę na podłogę.', '8 razy, potem odwrotnie (z boku do przodu) i zmiana nogi.'],
  mistakes: [{ e: 'Pochylanie tułowia.', fix: 'Tułów pionowo, brzuch napięty.' }, { e: 'Szybkie machanie nogą.', fix: 'Powoli, z kontrolą — czuj biodro.' }],
  cue: 'Kolano rysuje duże koło w powietrzu.',
  start: { big: '8 / str.', txt: '' },
  video: yt('otwieranie bramki krążenia bioder rozgrzewka')
});
defEx({
  id: 'w5', name: 'Glute bridge bez ciężaru', short: 'Glute bridge', kind: 'body', noWeight: true, warm: true, dur: 50, dose: '2 × 12',
  primary: ['glutes'], secondary: ['hamstrings', 'core'],
  musclesText: 'Pośladki — „włączasz” je przed ciężkimi ćwiczeniami.',
  setup: 'Mata. Leżysz na plecach, kolana zgięte, stopy płasko blisko pośladków.',
  steps: ['Dociśnij lędźwie do maty.', 'Wypchnij biodra w górę przez pięty, ściśnij pośladki na 2 s.', 'Opuść powoli. 2 serie po 12.'],
  mistakes: [{ e: 'Wyginanie pleców na górze.', fix: 'Zatrzymaj w linii prostej, żebra w dół.' }, { e: 'Czucie tylko w tyle ud.', fix: 'Stopy bliżej pośladków.' }],
  cue: 'Zgniatasz orzech pośladkami na górze każdego powtórzenia.',
  start: { big: '2 × 12', txt: '' },
  video: yt('glute bridge mostek biodrowy technika')
});
defEx({
  id: 'w6', name: 'Przysiad bez ciężaru', short: 'Przysiad bez ciężaru', kind: 'body', noWeight: true, warm: true, dur: 50, dose: '2 × 10',
  primary: ['quads', 'glutes'], secondary: ['core'],
  musclesText: 'Nogi i pośladki — powtórzenie wzorca przed przysiadem goblet i suwnicą.',
  setup: 'Stopy na szerokość bioder, ręce przed sobą.',
  steps: ['Biodra w tył, kolana w linii stóp, schodź powoli tak nisko, jak wygodnie.', 'Wstań, ściskając pośladki.', '2 serie po 10, tempo spokojne.'],
  mistakes: [{ e: 'Pięty w górze.', fix: 'Płycej, stopy szerzej.' }, { e: 'Kolana do środka.', fix: 'Rozpychaj lekko na zewnątrz.' }],
  cue: 'Siadasz na niewidzialne krzesło.',
  start: { big: '2 × 10', txt: '' },
  video: yt('przysiad bez ciężaru technika kobiety')
});
defEx({
  id: 'w7', name: 'Spacer z gumą oporową (bokiem)', short: 'Spacer z gumą', kind: 'body', noWeight: true, warm: true, dur: 50, dose: '2 × 10 kroków / str.', perSide: true,
  primary: ['abductors', 'glutes'], secondary: ['quads'],
  musclesText: 'Boki pośladków — stabilizatory kolan; po tym ćwiczeniu pośladki „pracują” w przysiadach mocniej.',
  setup: 'Mini-guma (pętla) nad kolanami lub nad kostkami. Lekki półprzysiad, stopy na szerokość bioder.',
  steps: ['Zrób 10 małych kroków w bok w jedną stronę, utrzymując napięcie gumy.', 'Wróć 10 krokami w drugą stronę.', 'Powtórz 2 razy.'],
  mistakes: [{ e: 'Prostowanie się między krokami.', fix: 'Cały czas w półprzysiadzie.' }, { e: 'Stopy schodzą się razem (guma luźna).', fix: 'Krok w bok krótszy niż „dostawienie” — guma zawsze napięta.' }],
  cue: 'Idziesz jak krab, guma nigdy nie odpoczywa.',
  start: { big: '2 × 10 / str.', txt: '' },
  video: yt('spacer z gumą oporową bokiem monster walk technika')
});
defEx({
  id: 'w8', name: 'Seria wprowadzająca (~50% ciężaru)', short: 'Seria wprowadzająca', kind: 'body', noWeight: true, warm: true, dur: 45, dose: '1 seria, ok. 50% ciężaru',
  primary: [], secondary: [],
  musclesText: 'Mięśnie, które zaraz będą pracować w pierwszym ćwiczeniu treningu.',
  setup: 'Sprzęt z pierwszego ćwiczenia planu (A: przysiad goblet, B: suwnica).',
  steps: ['Ustaw mniej więcej połowę ciężaru, którym normalnie robisz pierwsze ćwiczenie.', 'Zrób 8–10 spokojnych, technicznych powtórzeń.', 'Odpocznij 60 s i zaczynaj serie właściwe.'],
  mistakes: [{ e: 'Robienie serii „do zmęczenia”.', fix: 'To próba techniki, ma być lekko.' }],
  cue: 'Powtarzasz choreografię przed występem.',
  start: { big: '~50%', txt: 'Jeśli ćwiczysz pierwszy raz — po prostu zrób serię bez ciężaru.' },
  video: yt('seria rozgrzewkowa przed ćwiczeniem siłowym')
});

/* Plan: sloty A i B (id ćwiczenia głównego; alternatywa w EX[id].alt) */
const PLANS = {
  A: { key: 'A', name: 'Trening A', sub: 'Całe ciało · nacisk na pośladki i plecy', cls: 'pa', slots: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'] },
  B: { key: 'B', name: 'Trening B', sub: 'Całe ciało · nacisk na nogi i tył ud', cls: 'pb', slots: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] }
};
const PLAN_KEYS = ['A', 'B'];
const WARMUP = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'];

/* =========================================================
   Wiedza
   ========================================================= */
const KNOWLEDGE = [
  { t: 'Jak chudnie się z brzucha i ud', b: '<p>Nie da się spalać tłuszczu „punktowo” — sto brzuszków dziennie nie zabiera tłuszczu z brzucha. Ciało oddaje tłuszcz z całego organizmu, w kolejności, którą decydują geny (u kobiet brzuch, uda i biodra często schodzą ostatnie — to normalne).</p><p>Co naprawdę decyduje:</p><ul><li><strong>deficyt kalorii</strong> — jesz trochę mniej, niż spalasz (kalkulator poniżej),</li><li><strong>trening siłowy</strong> — buduje mięśnie, które „rzeźbią” kształt sylwetki pod tłuszczem,</li><li><strong>czas i regularność</strong> — tygodnie i miesiące, nie dni.</li></ul>' },
  { t: 'Dlaczego siłownia nie zrobi z Ciebie „kulturystki”', b: '<p>Kobiety mają ok. 10–20 razy mniej testosteronu niż mężczyźni. Mięśnie u kobiet rosną powoli — kilka kilogramów w ciągu <em>lat</em> regularnej pracy. Osoby o bardzo umięśnionej sylwetce trenują latami pod to konkretnie, jedzą pod to i często wspomagają się farmakologią.</p><p>To, co dostaniesz z 3 treningów w tygodniu: jędrność, „zaokrąglone” pośladki, mocniejsze plecy, prostszą postawę i wyższą przemianę materii (mięśnie spalają energię nawet w spoczynku).</p>' },
  { t: 'Rekompozycja — możesz jednocześnie chudnąć i budować', b: '<p>Jako początkująca masz „przywilej nowicjuszki”: przez pierwsze miesiące ciało potrafi jednocześnie tracić tłuszcz i budować mięśnie. Dlatego w tym planie:</p><ul><li>deficyt jest <strong>mały</strong> (10–20%, nie głodówka),</li><li>białko jest <strong>wysokie</strong> (1,6–2,0 g/kg),</li><li>trening siłowy jest ważniejszy niż kardio.</li></ul><p>Efekt: waga może stać w miejscu, a centymetry i zdjęcia się zmieniają. To sukces, nie porażka.</p>' },
  { t: 'Tempo: 0,25–0,5 kg tygodniowo i jak reagować', b: '<p>Zdrowe tempo chudnięcia to <strong>0,25–0,5 kg na tydzień</strong> (1–2 kg miesięcznie). Szybciej = tracisz mięśnie, energię i zwykle wracasz do punktu wyjścia.</p><p>Co 2 tygodnie spójrz na średnią wagę i obwody:</p><ul><li>waga i centymetry stoją przez 2–3 tygodnie → odejmij <strong>100 kcal</strong> dziennie,</li><li>spada energia i siła na treningu, ciągły głód, gorszy sen → dodaj <strong>100–150 kcal</strong>,</li><li>schodzi w tempie 0,25–0,5 kg/tydz. → nic nie zmieniaj.</li></ul>' },
  { t: 'Białko — ile, po co, skąd', b: '<p>Cel: <strong>1,6–2,0 g na kg masy ciała</strong> (np. 60 kg → 100–120 g dziennie). Białko chroni mięśnie w deficycie, syci na długo i „kosztuje” organizm najwięcej energii w trawieniu.</p><p>Proste źródła: pierś z kurczaka i indyka, chudy twaróg, skyr, jogurt grecki, jajka, ryby, tofu, soczewica, ciecierzyca, odżywka białkowa (to po prostu sproszkowane białko z mleka — wygodne, nie „chemia”).</p><p>Rozłóż na <strong>3–4 posiłki</strong>, po 25–40 g w każdym — ciało lepiej to wykorzystuje niż jedną wielką porcję wieczorem.</p>' },
  { t: 'Kardio a siłownia — kroki są ważniejsze niż „katowanie się”', b: '<p>Siłownia buduje sylwetkę, kardio pomaga sercu i dokłada trochę spalania. Ale najwięcej energii w tygodniu „zjada” <strong>zwykłe chodzenie</strong>: 8–10 tys. kroków dziennie to więcej niż dwa mordercze treningi na bieżni — i nie zabiera sił na trening siłowy.</p><ul><li>2 × 20–30 min spokojnego kardio (tempo rozmowy) w tygodniu,</li><li>8 000–10 000 kroków dziennie,</li><li>bez interwałów przez pierwsze 8 tygodni — najpierw baza.</li></ul>' },
  { t: 'Sen i regeneracja; ból mięśni a ból stawu', b: '<p>Mięśnie rosną, gdy śpisz, nie gdy trenujesz. Celuj w <strong>7–9 godzin</strong>. Niewyspana = większy głód, gorsze wyniki, wolniejsze chudnięcie.</p><p><strong>Zakwasy (DOMS)</strong> — tępy ból mięśni 1–2 dni po treningu — są normalne, zwłaszcza na początku. Nie oznaczają dobrego ani złego treningu; z czasem znikają.</p><p><strong>Ból stawu</strong> — ostry, kłujący, w kolanie, barku, nadgarstku, w trakcie ruchu — nie jest normalny. Zmniejsz ciężar, zmień ćwiczenie na alternatywę, a jeśli wraca — skonsultuj z fizjoterapeutą.</p>' },
  { t: 'Cykl miesiączkowy a trening i waga', b: '<p>W drugiej połowie cyklu (przed okresem) ciało zatrzymuje wodę — waga potrafi skoczyć o <strong>1–2 kg</strong>, choć tłuszczu nie przybyło. Porównuj wagę z tą samą fazą cyklu miesiąc wcześniej, nie z zeszłym tygodniem.</p><p>W gorsze dni: możesz obniżyć ciężar o 10–20%, zrobić 2 serie zamiast 3 albo tylko rozgrzewkę i spacer. To nie jest „strata” — konsekwencja przez miesiące wygrywa z jednym idealnym tygodniem.</p><p>Wiele kobiet czuje się najsilniej tuż po okresie i w środku cyklu — to dobry moment, żeby dołożyć ciężar.</p>' },
  { t: 'Jak jeść „normalnie” i nadal chudnąć (80/20)', b: '<p>Nie musisz jeść idealnie. Zasada <strong>80/20</strong>: 80% posiłków „w planie” (białko + warzywa + rozsądna porcja węglowodanów i tłuszczu), 20% — to, na co masz ochotę.</p><p>Liczy się <strong>budżet tygodnia</strong>, nie jeden dzień. Kolacja na mieście raz–dwa razy w tygodniu mieści się w tym budżecie, jeśli reszta dni jest w porządku. Nie „odrabiaj” jej głodówką następnego dnia — wróć po prostu do planu.</p><p>Praktyczne: zacznij posiłek od białka i warzyw, pij wodę, jedz powoli — sytość przychodzi po ok. 20 minutach.</p>' },
  { t: 'Kiedy zrobić krok wstecz lub iść do lekarza', b: '<p>Zatrzymaj się i skonsultuj z lekarzem lub dietetykiem, jeśli zauważysz:</p><ul><li>zanik lub nieregularność miesiączki,</li><li>zawroty głowy, omdlenia, kołatanie serca,</li><li>przewlekłe zmęczenie, które nie mija po przespanej nocy,</li><li>wypadanie włosów, ciągłe zimno, problemy ze snem,</li><li>obsesyjne myśli o jedzeniu, lęk przed posiłkami.</li></ul><p>Zbyt duży deficyt (poniżej ok. 1 400 kcal bez opieki specjalisty) prowadzi do utraty mięśni, spadku energii i zaburzeń hormonalnych. Lepsze wolniej niż wcale.</p><p class="mut small">To ogólne wskazówki, nie porada medyczna. W razie wątpliwości porozmawiaj z lekarzem.</p>' }
];

const PROTEIN_EXAMPLES = [
  ['150 g piersi z kurczaka', '≈ 35 g'], ['200 g skyru / jogurtu greckiego', '≈ 20 g'], ['2 jajka', '≈ 13 g'],
  ['100 g chudego twarogu', '≈ 18 g'], ['150 g łososia', '≈ 30 g'], ['150 g tofu', '≈ 18 g'], ['miarka odżywki białkowej', '≈ 22 g']
];
