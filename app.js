'use strict';

/* =========================================================
   Plan treningowy (na sztywno)
   inc = sugerowany skok progresji (kg)
   restSec = domyślny timer przerwy (dolna granica zakresu)
   ========================================================= */
const PLANS = {
  A: {
    key: 'A', name: 'Trening A', sub: 'Klatka + plecy I', day: 'poniedziałek', cls: 'pa',
    exercises: [
      { id: 'a1', name: 'Wyciskanie sztangi na ławce płaskiej', sets: 4, min: 5, max: 8, repsLabel: '5–8', rest: '2–3 min', restSec: 120, inc: 2.5 },
      { id: 'a2', name: 'Wyciskanie hantli na ławce skośnej 30°', sets: 3, min: 8, max: 12, repsLabel: '8–12', rest: '2 min', restSec: 120, inc: 2.5 },
      { id: 'a3', name: 'Wiosłowanie z podparciem klatki', sets: 3, min: 8, max: 12, repsLabel: '8–12', rest: '2 min', restSec: 120, inc: 2.5 },
      { id: 'a4', name: 'Ściąganie drążka do klatki (wyciąg górny)', sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, inc: 2.5 },
      { id: 'a5', name: 'Rozpiętki na maszynie / pec deck', sets: 2, min: 12, max: 15, repsLabel: '12–15', rest: '90 s', restSec: 90, inc: 2.5 },
      { id: 'a6', name: 'Uginanie ramion z hantlami', sets: 2, min: 10, max: 12, repsLabel: '10–12', rest: '60–90 s', restSec: 60, inc: 2.5 },
      { id: 'a7', name: 'Allahy — spięcia brzucha na wyciągu klęcząc', sets: 3, min: 10, max: 15, repsLabel: '10–15', rest: '60–90 s', restSec: 60, inc: 2.5 }
    ]
  },
  B: {
    key: 'B', name: 'Trening B', sub: 'Nogi + barki', day: 'czwartek', cls: 'pb',
    exercises: [
      { id: 'b1', name: 'Wyciskanie nogami na suwnicy', sets: 4, min: 8, max: 12, repsLabel: '8–12', rest: '2–3 min', restSec: 120, inc: 5 },
      { id: 'b2', name: 'Uginanie nóg leżąc / siedząc', sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '90 s', restSec: 90, inc: 5 },
      { id: 'b3', name: 'Przysiad bułgarski z hantlami', sets: 3, min: 8, max: 10, repsLabel: '8–10 / noga', rest: '2 min', restSec: 120, inc: 5 },
      { id: 'b4', name: 'Wspięcia na palce', sets: 4, min: 12, max: 15, repsLabel: '12–15', rest: '60 s', restSec: 60, inc: 5 },
      { id: 'b5', name: 'Wyciskanie hantli nad głowę siedząc (oparcie)', sets: 3, min: 8, max: 12, repsLabel: '8–12', rest: '2 min', restSec: 120, inc: 2.5 },
      { id: 'b6', name: 'Wznosy hantli bokiem', sets: 3, min: 12, max: 15, repsLabel: '12–15', rest: '60–90 s', restSec: 60, inc: 2.5 },
      { id: 'b7', name: 'Unoszenie nóg / kolan w zwisie na drążku', sets: 3, min: 10, max: 15, repsLabel: '10–15', rest: '90 s', restSec: 90, inc: 2.5 }
    ]
  },
  C: {
    key: 'C', name: 'Trening C', sub: 'Klatka + plecy II', day: 'sobota', cls: 'pc',
    exercises: [
      { id: 'c1', name: 'Wyciskanie hantli na ławce płaskiej', sets: 4, min: 8, max: 12, repsLabel: '8–12', rest: '2 min', restSec: 120, inc: 2.5 },
      { id: 'c2', name: 'Podciąganie nachwytem / ściąganie wyciągu', sets: 3, min: 6, max: 10, repsLabel: '6–10', rest: '2 min', restSec: 120, inc: 2.5 },
      { id: 'c3', name: 'Wyciskanie na maszynie siedząc / dipy z asystą', sets: 3, min: 8, max: 12, repsLabel: '8–12', rest: '2 min', restSec: 120, inc: 2.5 },
      { id: 'c4', name: 'Wiosłowanie jednorącz hantlem (podparcie na ławce)', sets: 3, min: 10, max: 12, repsLabel: '10–12 / str.', rest: '90 s', restSec: 90, inc: 2.5 },
      { id: 'c5', name: 'Krzyżowanie linek wyciągu (brama)', sets: 3, min: 12, max: 15, repsLabel: '12–15', rest: '60–90 s', restSec: 60, inc: 2.5 },
      { id: 'c6', name: 'Prostowanie ramion na wyciągu (triceps)', sets: 3, min: 10, max: 12, repsLabel: '10–12', rest: '60–90 s', restSec: 60, inc: 2.5 },
      { id: 'c7', name: 'Face pull', sets: 2, min: 15, max: 20, repsLabel: '15–20', rest: '60 s', restSec: 60, inc: 2.5 },
      { id: 'c8', name: 'Spięcia brzucha z obciążeniem (maszyna / talerz)', sets: 3, min: 10, max: 15, repsLabel: '10–15', rest: '60–90 s', restSec: 60, inc: 2.5 }
    ]
  }
};

const PLAN_KEYS = ['A', 'B', 'C'];
const EX_BY_ID = {};
PLAN_KEYS.forEach(function (k) {
  PLANS[k].exercises.forEach(function (ex) { EX_BY_ID[ex.id] = Object.assign({ plan: k }, ex); });
});

/* =========================================================
   Magazyn danych (localStorage, wersjonowany, odporny)
   ========================================================= */
const DB_V = 1;

function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem('gym.' + key);
    if (raw == null) return fallback;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object' || obj.v !== DB_V) return fallback;
    return obj.d;
  } catch (e) { return fallback; }
}
function saveKey(key, data) {
  try { localStorage.setItem('gym.' + key, JSON.stringify({ v: DB_V, d: data })); }
  catch (e) { toast('Błąd zapisu danych'); }
}
function dropKey(key) { try { localStorage.removeItem('gym.' + key); } catch (e) {} }

function cleanSessions(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function (s) {
    return s && typeof s === 'object' && typeof s.date === 'string' && PLANS[s.plan] && Array.isArray(s.exercises);
  });
}
function cleanRuns(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function (r) { return r && typeof r === 'object' && typeof r.date === 'string'; });
}
function cleanMeasures(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function (m) { return m && typeof m === 'object' && typeof m.date === 'string'; });
}
function cleanNotes(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {};
  Object.keys(o).forEach(function (k) {
    if (typeof o[k] === 'string' && o[k].trim()) out[k] = o[k];
  });
  return out;
}

function normSettings(s) {
  s = (s && typeof s === 'object') ? s : {};
  if (typeof s.timer !== 'boolean') s.timer = true;
  if (typeof s.vibrate !== 'boolean') s.vibrate = true;
  if (s.cycleStart === undefined) s.cycleStart = null;
  if (!s.rest || typeof s.rest !== 'object') s.rest = {};   // { exId: sekundy }
  return s;
}

let sessions = cleanSessions(loadKey('sessions', []));
let runs = cleanRuns(loadKey('runs', []));
let measures = cleanMeasures(loadKey('measures', []));
let notes = cleanNotes(loadKey('notes', {}));   // { exId: tekst notatki }
let settings = normSettings(loadKey('settings', {}));

function persist() {
  saveKey('sessions', sessions);
  saveKey('runs', runs);
  saveKey('measures', measures);
  saveKey('notes', notes);
  saveKey('settings', settings);
}

/* =========================================================
   Pomocnicze
   ========================================================= */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function parseISO(iso) {
  const p = String(iso).split('-');
  return new Date(+p[0], +p[1] - 1, +p[2] || 1);
}
function fmtDate(iso) {
  const p = String(iso).split('-');
  if (p.length < 3) return iso;
  return p[2] + '.' + p[1] + '.' + p[0];
}
const WEEKDAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

/* Parsowanie liczb: "77,5" => 77.5 */
function parseNum(str) {
  if (str == null) return null;
  const s = String(str).trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return isFinite(n) && n >= 0 ? n : null;
}
function parseInt0(str) {
  const n = parseNum(str);
  return n == null ? null : Math.round(n);
}
function fmtNum(n) {
  if (n == null || !isFinite(n)) return '';
  return String(Math.round(n * 100) / 100).replace('.', ',');
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { t.hidden = true; }, 2200);
}

/* =========================================================
   Cykl 8-tygodniowy
   ========================================================= */
function cycleStartDate() {
  if (settings.cycleStart) return settings.cycleStart;
  let first = null;
  sessions.forEach(function (s) { if (!first || s.date < first) first = s.date; });
  return first;
}
function cycleWeek() {
  const start = cycleStartDate();
  if (!start) return 1;
  const days = Math.floor((parseISO(todayISO()) - parseISO(start)) / 86400000);
  if (days < 0) return 1;
  return (Math.floor(days / 7)) % 8 + 1;
}
function isDeload() { return cycleWeek() === 8; }
function roundToPlate(w) { return Math.round(w / 2.5) * 2.5; }

/* Czas przerwy dla ćwiczenia: własny (jeśli ustawiony) lub domyślny z planu. */
const REST_MAX = 600, REST_STEP = 15;
function restForEx(ex) {
  const r = settings.rest[ex.id];
  return (typeof r === 'number' && r >= 0) ? r : ex.restSec;
}
function fmtRest(sec) {
  if (!sec || sec <= 0) return 'wył.';
  return Math.floor(sec / 60) + ':' + pad2(sec % 60);
}

/* =========================================================
   Ostatnie wyniki i progresja
   ========================================================= */
function lastResult(exId) {
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i];
    if (!Array.isArray(s.exercises)) continue;
    for (let j = 0; j < s.exercises.length; j++) {
      const e = s.exercises[j];
      if (e && e.id === exId) {
        const reps = Array.isArray(e.reps) ? e.reps.filter(function (r) { return typeof r === 'number' && r > 0; }) : [];
        if (reps.length || (typeof e.weight === 'number' && e.weight > 0)) {
          return { weight: typeof e.weight === 'number' ? e.weight : null, reps: Array.isArray(e.reps) ? e.reps : [], date: s.date, deload: !!s.deload };
        }
      }
    }
  }
  return null;
}
function fmtLast(lr) {
  if (!lr) return 'Ostatnio: —';
  const w = lr.weight != null ? fmtNum(lr.weight) + ' kg' : '— kg';
  const reps = lr.reps.map(function (r) { return (typeof r === 'number' && r > 0) ? r : '–'; }).join('/');
  return 'Ostatnio (' + fmtDate(lr.date) + '): ' + w + (reps ? ' × ' + reps : '');
}
/* Progresja: w ostatniej (nie-deloadowej) sesji wszystkie serie na górze zakresu */
function progressionFor(ex) {
  const lr = lastResult(ex.id);
  if (!lr || lr.deload || lr.weight == null) return null;
  const done = lr.reps.filter(function (r) { return typeof r === 'number' && r > 0; });
  if (done.length < ex.sets) return null;
  const allTop = done.every(function (r) { return r >= ex.max; });
  if (!allTop) return null;
  return { inc: ex.inc, from: lr.weight, to: lr.weight + ex.inc };
}

/* =========================================================
   Szkic treningu (autozapis)
   ========================================================= */
function draftKey(plan) { return 'draft.' + plan; }
function loadDraft(plan) {
  const d = loadKey(draftKey(plan), null);
  return (d && typeof d === 'object' && d.ex) ? d : null;
}
function saveDraftFromDOM(plan) {
  const d = { date: todayISO(), ex: {} };
  document.querySelectorAll('.excard').forEach(function (card) {
    const id = card.dataset.ex;
    const w = card.querySelector('input.w').value;
    const reps = Array.prototype.map.call(card.querySelectorAll('input.reps'), function (i) { return i.value; });
    const done = Array.prototype.map.call(card.querySelectorAll('input.done'), function (i) { return i.checked; });
    if (w !== '' || reps.some(function (r) { return r !== ''; }) || done.some(Boolean)) {
      d.ex[id] = { w: w, reps: reps, done: done };
    }
  });
  if (Object.keys(d.ex).length) saveKey(draftKey(plan), d);
  else dropKey(draftKey(plan));
}

/* =========================================================
   Timer przerwy
   ========================================================= */
let timerInt = null, timerEnd = 0, timerOver = false;
function startRestTimer(sec, label) {
  if (!settings.timer) return;
  stopRestTimer();
  timerEnd = Date.now() + sec * 1000;
  timerOver = false;
  const bar = document.getElementById('timerbar');
  document.getElementById('timerlabel').textContent = label;
  bar.classList.remove('over');
  bar.hidden = false;
  tickTimer();
  timerInt = setInterval(tickTimer, 250);
}
function tickTimer() {
  const bar = document.getElementById('timerbar');
  const left = Math.ceil((timerEnd - Date.now()) / 1000);
  if (left <= 0) {
    document.getElementById('timertime').textContent = '0:00';
    if (!timerOver) {
      timerOver = true;
      bar.classList.add('over');
      document.getElementById('timerlabel').textContent = 'Przerwa skończona — jedziemy!';
      if (settings.vibrate) {
        try { if (navigator.vibrate) navigator.vibrate([500, 150, 500, 150, 500]); } catch (e) {}
      }
      beep();
      setTimeout(stopRestTimer, 6000);
    }
    return;
  }
  document.getElementById('timertime').textContent = Math.floor(left / 60) + ':' + pad2(left % 60);
}
function stopRestTimer() {
  if (timerInt) clearInterval(timerInt);
  timerInt = null;
  document.getElementById('timerbar').hidden = true;
}
let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25].forEach(function (t) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.12, audioCtx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + 0.18);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + 0.2);
    });
  } catch (e) {}
}

/* =========================================================
   Wykresy SVG (bez bibliotek)
   ========================================================= */
function svgChart(series, opts) {
  opts = opts || {};
  const W = 340, H = opts.h || 130, P = 26, PB = 18, PT = 8;
  let allPts = [];
  series.forEach(function (s) { allPts = allPts.concat(s.points); });
  if (!allPts.length) return '<p class="mut small">Brak danych do wykresu.</p>';
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  allPts.forEach(function (p) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  });
  if (minY === maxY) { minY -= 1; maxY += 1; }
  const spanY = maxY - minY;
  minY -= spanY * 0.08; maxY += spanY * 0.08;
  const sx = function (x) { return maxX === minX ? (P + (W - 2 * P) / 2) : P + (x - minX) / (maxX - minX) * (W - 2 * P); };
  const sy = function (y) { return PT + (1 - (y - minY) / (maxY - minY)) * (H - PT - PB); };
  let out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="wykres">';
  out += '<line x1="' + P + '" y1="' + sy(minY) + '" x2="' + (W - P) + '" y2="' + sy(minY) + '" stroke="#2c3a4f" stroke-width="1"/>';
  series.forEach(function (s) {
    const pts = s.points.slice().sort(function (a, b) { return a.x - b.x; });
    if (pts.length > 1) {
      const path = pts.map(function (p, i) { return (i ? 'L' : 'M') + sx(p.x).toFixed(1) + ' ' + sy(p.y).toFixed(1); }).join(' ');
      out += '<path d="' + path + '" fill="none" stroke="' + s.color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    pts.forEach(function (p) {
      out += '<circle cx="' + sx(p.x).toFixed(1) + '" cy="' + sy(p.y).toFixed(1) + '" r="3.2" fill="' + s.color + '"/>';
    });
  });
  const s0 = series[0];
  if (s0 && s0.points.length) {
    const vals = s0.points.map(function (p) { return p.y; });
    const lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    out += '<text x="2" y="' + (sy(hi) + 4) + '" fill="#8fa0b5" font-size="10">' + fmtNum(hi) + '</text>';
    if (hi !== lo) out += '<text x="2" y="' + (sy(lo) + 4) + '" fill="#8fa0b5" font-size="10">' + fmtNum(lo) + '</text>';
  }
  const dts = allPts.map(function (p) { return p.x; });
  const d1 = new Date(Math.min.apply(null, dts)), d2 = new Date(Math.max.apply(null, dts));
  out += '<text x="' + P + '" y="' + (H - 4) + '" fill="#8fa0b5" font-size="10">' + pad2(d1.getDate()) + '.' + pad2(d1.getMonth() + 1) + '</text>';
  if (+d1 !== +d2) out += '<text x="' + (W - P) + '" y="' + (H - 4) + '" text-anchor="end" fill="#8fa0b5" font-size="10">' + pad2(d2.getDate()) + '.' + pad2(d2.getMonth() + 1) + '</text>';
  out += '</svg>';
  return out;
}

/* =========================================================
   Widoki
   ========================================================= */
let view = document.getElementById('view');

/* Świeży węzeł widoku przy każdym renderze — nasłuchiwacze zdarzeń
   nie kumulują się między renderami. */
function resetView() {
  const fresh = view.cloneNode(false);
  view.parentNode.replaceChild(fresh, view);
  view = fresh;
}

function updateWeekChip() {
  const chip = document.getElementById('weekchip');
  const wk = cycleWeek();
  chip.hidden = false;
  chip.textContent = 'Tydzień ' + wk + '/8';
  chip.classList.toggle('deload', wk === 8);
}

function lastPlanDate(plan) {
  let last = null;
  sessions.forEach(function (s) { if (s.plan === plan && (!last || s.date > last)) last = s.date; });
  return last;
}

function renderHome() {
  resetView();
  const d = new Date();
  let html = '<p class="today">' + WEEKDAYS[d.getDay()] + ', ' + fmtDate(todayISO()) + '</p>';
  if (isDeload()) {
    html += '<div class="banner">DELOAD — tydzień 8: połowa serii, ciężar −30%. Lżej znaczy mądrze.</div>';
  }
  html += '<div class="tiles">';
  PLAN_KEYS.forEach(function (k) {
    const p = PLANS[k];
    const last = lastPlanDate(k);
    const draft = loadDraft(k);
    html += '<a class="tile ' + p.cls + '" href="#/workout/' + k + '">' +
      '<div class="tname">' + esc(p.name) + '</div>' +
      '<div class="tsub">' + esc(p.sub) + ' · ' + esc(p.day) + '</div>' +
      '<div class="tlast">' + (draft ? '<span class="draftmark">● Szkic w toku</span> · ' : '') +
      (last ? 'Ostatnio: ' + fmtDate(last) : 'Jeszcze nie robiony') + '</div></a>';
  });
  html += '</div>';
  html += '<div class="tiles minor">' +
    '<a class="tile" href="#/run"><div class="tname">Bieganie</div><div class="tlast">' + (runs.length ? fmtDate(latestDate(runs)) : '—') + '</div></a>' +
    '<a class="tile" href="#/measure"><div class="tname">Pomiary</div><div class="tlast">' + (measures.length ? fmtDate(latestDate(measures)) : '—') + '</div></a>' +
    '<a class="tile" href="#/history"><div class="tname">Historia</div><div class="tlast">' + sessions.length + ' trening' + plural(sessions.length) + '</div></a>' +
    '</div>';
  view.innerHTML = html;
}
function latestDate(arr) {
  let last = null;
  arr.forEach(function (x) { if (!last || x.date > last) last = x.date; });
  return last;
}
function plural(n) {
  if (n === 1) return '';
  const m10 = n % 10, m100 = n % 100;
  return (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? 'i' : 'ów';
}

/* ---------- Ekran treningu ---------- */
let currentPlan = null;

function renderWorkout(planKey) {
  const p = PLANS[planKey];
  if (!p) { location.hash = '#/home'; return; }
  resetView();
  currentPlan = planKey;
  const draft = loadDraft(planKey);
  const deload = isDeload();

  let html = '<a class="backlink" href="#/home">← Start</a>';
  html += '<div class="planhead"><h2>' + esc(p.name) + ' — ' + esc(p.sub) + '</h2></div>';
  if (deload) html += '<div class="banner">DELOAD: zrób połowę serii z ciężarem −30%.</div>';

  p.exercises.forEach(function (ex, idx) {
    const lr = lastResult(ex.id);
    const prog = deload ? null : progressionFor(ex);
    const dEx = draft && draft.ex[ex.id] ? draft.ex[ex.id] : null;
    const wVal = dEx ? dEx.w : '';
    const targetSets = deload ? Math.max(1, Math.ceil(ex.sets / 2)) : ex.sets;

    html += '<article class="excard ' + p.cls + '" data-ex="' + ex.id + '">';
    html += '<div class="exhead"><span class="exnum">' + (idx + 1) + '</span><h3>' + esc(ex.name) + '</h3></div>';
    html += '<p class="extarget">' + ex.sets + ' × ' + esc(ex.repsLabel) + ' powt. · zalecana przerwa ' + esc(ex.rest) + '</p>';
    html += '<p class="exlast">' + esc(fmtLast(lr)) + '</p>';
    const note = notes[ex.id] || '';
    html += '<div class="note' + (note ? ' has' : '') + '" data-ex="' + ex.id + '">' +
      '<button type="button" class="notepreview">' +
        '<span class="noteicon">🗒️</span>' +
        '<span class="txt' + (note ? '' : ' add') + '">' + (note ? esc(note) : 'Dodaj notatkę…') + '</span>' +
        '<span class="notehint">' + (note ? 'edytuj' : '') + '</span>' +
      '</button>' +
      '<div class="notebox">' +
        '<textarea class="noteedit" rows="3" placeholder="Np. ustawienia maszyny, technika, jak się czułeś…">' + esc(note) + '</textarea>' +
        '<div class="noterow"><button type="button" class="notedone">Gotowe</button></div>' +
      '</div>' +
    '</div>';
    html += '<div class="restctl">' +
      '<span class="restlbl">⏱ Timer przerwy</span>' +
      '<button type="button" class="restminus" aria-label="Skróć przerwę o 15 sekund">−</button>' +
      '<span class="restval">' + fmtRest(restForEx(ex)) + '</span>' +
      '<button type="button" class="restplus" aria-label="Wydłuż przerwę o 15 sekund">+</button>' +
      '</div>';
    if (prog) {
      html += '<span class="badge">Progresja: +' + fmtNum(prog.inc) + ' kg → ' + fmtNum(prog.to) + ' kg</span>';
    }
    if (deload && lr && lr.weight != null) {
      html += '<span class="badge deload">Deload: ' + targetSets + ' serie, ok. ' + fmtNum(roundToPlate(lr.weight * 0.7)) + ' kg</span>';
    }
    html += '<div class="wrow">' +
      '<button type="button" class="step minus" aria-label="Odejmij 2,5 kg">−</button>' +
      '<input class="w" type="text" inputmode="decimal" autocomplete="off" placeholder="kg" value="' + esc(wVal) + '" aria-label="Ciężar w kilogramach">' +
      '<button type="button" class="step plus" aria-label="Dodaj 2,5 kg">+</button>' +
      '<span class="unit">kg</span></div>';
    if (lr) {
      const lw = lr.weight != null ? fmtNum(lr.weight) : '—';
      const lreps = lr.reps.filter(function (r) { return r > 0; }).join('/');
      html += '<div class="copyrow"><button type="button" class="copylast">Powtórz ostatnie (' + esc(lw) + ' kg' + (lreps ? ' × ' + esc(lreps) : '') + ')</button></div>';
    }
    html += '<div class="sets" style="--n:' + ex.sets + '">';
    for (let i = 0; i < ex.sets; i++) {
      const rVal = dEx && dEx.reps[i] != null ? dEx.reps[i] : '';
      const checked = dEx && dEx.done[i] ? ' checked' : '';
      html += '<div class="setcol">' +
        '<span class="slabel">S' + (i + 1) + '</span>' +
        '<input type="checkbox" class="done"' + checked + ' aria-label="Seria ' + (i + 1) + ' wykonana">' +
        '<input class="reps" type="text" inputmode="numeric" autocomplete="off" placeholder="—" value="' + esc(rVal) + '" aria-label="Powtórzenia w serii ' + (i + 1) + '">' +
        '</div>';
    }
    html += '</div></article>';
  });

  html += '<div class="finishbar">' +
    '<button type="button" id="finish" class="btn primary ' + p.cls + '">Zakończ trening ✓</button>' +
    '<button type="button" id="discard" class="btn ghost">Odrzuć szkic</button>' +
    '</div>';
  view.innerHTML = html;

  view.addEventListener('input', workoutInput);
  view.addEventListener('change', workoutChange);
  view.addEventListener('click', workoutClick);
}

function workoutInput(e) {
  if (e.target.matches('.noteedit')) { saveNoteFromEl(e.target.closest('.note')); return; }
  if (e.target.matches('input.w, input.reps')) saveDraftFromDOM(currentPlan);
}

function saveNoteFromEl(noteEl) {
  const exId = noteEl.dataset.ex;
  const val = noteEl.querySelector('.noteedit').value.trim();
  if (val) notes[exId] = val; else delete notes[exId];
  saveKey('notes', notes);
}
function refreshNotePreview(noteEl) {
  const val = notes[noteEl.dataset.ex] || '';
  const txt = noteEl.querySelector('.notepreview .txt');
  const hint = noteEl.querySelector('.notepreview .notehint');
  noteEl.classList.toggle('has', !!val);
  txt.textContent = val || 'Dodaj notatkę…';
  txt.classList.toggle('add', !val);
  if (hint) hint.textContent = val ? 'edytuj' : '';
}
function workoutChange(e) {
  if (!e.target.matches('input.done')) return;
  const card = e.target.closest('.excard');
  const ex = EX_BY_ID[card.dataset.ex];
  if (e.target.checked) {
    const cols = card.querySelectorAll('.setcol');
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].querySelector('input.done') === e.target) {
        const reps = cols[i].querySelector('input.reps');
        if (reps.value === '') {
          const lr = lastResult(ex.id);
          if (lr && typeof lr.reps[i] === 'number' && lr.reps[i] > 0) reps.value = lr.reps[i];
        }
        break;
      }
    }
    const rest = restForEx(ex);
    if (rest > 0) startRestTimer(rest, esc10(ex.name));
  }
  saveDraftFromDOM(currentPlan);
}
function esc10(name) { return name.length > 34 ? name.slice(0, 33) + '…' : name; }

function workoutClick(e) {
  const stepBtn = e.target.closest('.step');
  if (stepBtn) {
    const card = stepBtn.closest('.excard');
    const input = card.querySelector('input.w');
    let w = parseNum(input.value);
    if (w == null) {
      const lr = lastResult(card.dataset.ex);
      w = lr && lr.weight != null ? lr.weight : 0;
      if (stepBtn.classList.contains('minus') && w === 0) w = 2.5;
    } else {
      w += stepBtn.classList.contains('plus') ? 2.5 : -2.5;
    }
    if (w < 0) w = 0;
    input.value = fmtNum(w);
    saveDraftFromDOM(currentPlan);
    return;
  }
  const notePrev = e.target.closest('.notepreview');
  if (notePrev) {
    const noteEl = notePrev.closest('.note');
    noteEl.classList.add('open');
    const ta = noteEl.querySelector('.noteedit');
    ta.focus();
    const v = ta.value; ta.value = ''; ta.value = v;   // kursor na końcu
    return;
  }
  if (e.target.closest('.notedone')) {
    const noteEl = e.target.closest('.note');
    saveNoteFromEl(noteEl);
    refreshNotePreview(noteEl);
    noteEl.classList.remove('open');
    return;
  }
  const restBtn = e.target.closest('.restminus, .restplus');
  if (restBtn) {
    const card = restBtn.closest('.excard');
    const ex = EX_BY_ID[card.dataset.ex];
    let cur = restForEx(ex) + (restBtn.classList.contains('restplus') ? REST_STEP : -REST_STEP);
    if (cur < 0) cur = 0;
    if (cur > REST_MAX) cur = REST_MAX;
    settings.rest[ex.id] = cur;
    saveKey('settings', settings);
    card.querySelector('.restval').textContent = fmtRest(cur);
    return;
  }
  const copyBtn = e.target.closest('.copylast');
  if (copyBtn) {
    const card = copyBtn.closest('.excard');
    const lr = lastResult(card.dataset.ex);
    if (!lr) return;
    card.querySelector('input.w').value = lr.weight != null ? fmtNum(lr.weight) : '';
    card.querySelectorAll('input.reps').forEach(function (inp, i) {
      inp.value = (typeof lr.reps[i] === 'number' && lr.reps[i] > 0) ? lr.reps[i] : '';
    });
    saveDraftFromDOM(currentPlan);
    toast('Skopiowano ostatni wynik');
    return;
  }
  if (e.target.id === 'finish') { finishWorkout(); return; }
  if (e.target.id === 'discard') {
    if (confirm('Odrzucić wpisane dane tego treningu?')) {
      dropKey(draftKey(currentPlan));
      renderWorkout(currentPlan);
      toast('Szkic odrzucony');
    }
  }
}

function finishWorkout() {
  const plan = currentPlan;
  const entries = [];
  document.querySelectorAll('.excard').forEach(function (card) {
    const id = card.dataset.ex;
    const w = parseNum(card.querySelector('input.w').value);
    const reps = Array.prototype.map.call(card.querySelectorAll('input.reps'), function (i) { return parseInt0(i.value); });
    const done = Array.prototype.map.call(card.querySelectorAll('input.done'), function (i) { return i.checked; });
    const hasReps = reps.some(function (r) { return r != null && r > 0; });
    if (w != null || hasReps) {
      entries.push({ id: id, weight: w, reps: reps.map(function (r) { return r == null ? 0 : r; }), done: done });
    }
  });
  if (!entries.length) { toast('Wpisz najpierw jakiś wynik'); return; }
  sessions.push({
    id: uid(), plan: plan, date: todayISO(), ts: Date.now(),
    week: cycleWeek(), deload: isDeload(), exercises: entries
  });
  sessions.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.ts || 0) - (b.ts || 0); });
  saveKey('sessions', sessions);
  dropKey(draftKey(plan));
  stopRestTimer();
  location.hash = '#/home';
  toast('Zapisano ' + PLANS[plan].name + ' ✓');
}

/* ---------- Bieganie ---------- */
function renderRun() {
  resetView();
  let html = '<h2>Bieganie</h2><div class="card">' +
    '<label class="field"><span>Data</span><input id="rdate" type="date" value="' + todayISO() + '"></label>' +
    '<div class="grid2">' +
    '<label class="field"><span>Czas (min)</span><input id="rmin" type="text" inputmode="decimal" placeholder="np. 35"></label>' +
    '<label class="field"><span>Dystans (km)</span><input id="rkm" type="text" inputmode="decimal" placeholder="np. 5,2"></label>' +
    '</div>' +
    '<label class="field"><span>Średnie tętno (opcjonalnie)</span><input id="rhr" type="text" inputmode="numeric" placeholder="np. 145"></label>' +
    '<label class="field"><span>Samopoczucie (1–5)</span><div class="seg" id="rfeel">' +
    [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-f="' + n + '"' + (n === 3 ? ' class="on"' : '') + '>' + n + '</button>'; }).join('') +
    '</div></label>' +
    '<p class="pacebox" id="rpace">Tempo: <strong>—</strong></p>' +
    '<button type="button" id="rsave" class="btn primary">Zapisz bieg</button>' +
    '</div>';
  html += '<h2>Historia biegów</h2><ul class="list" id="rlist">' + runListHTML() + '</ul>';
  view.innerHTML = html;

  let feel = 3;
  function updPace() {
    const m = parseNum(document.getElementById('rmin').value);
    const km = parseNum(document.getElementById('rkm').value);
    document.getElementById('rpace').innerHTML = 'Tempo: <strong>' + (m && km ? fmtPace(m / km) + ' min/km' : '—') + '</strong>';
  }
  view.addEventListener('input', function (e) {
    if (e.target.id === 'rmin' || e.target.id === 'rkm') updPace();
  });
  view.addEventListener('click', function (e) {
    const fb = e.target.closest('#rfeel button');
    if (fb) {
      feel = +fb.dataset.f;
      document.querySelectorAll('#rfeel button').forEach(function (b) { b.classList.toggle('on', b === fb); });
      return;
    }
    if (e.target.id === 'rsave') {
      const m = parseNum(document.getElementById('rmin').value);
      const km = parseNum(document.getElementById('rkm').value);
      if (!m || !km) { toast('Podaj czas i dystans'); return; }
      const hr = parseInt0(document.getElementById('rhr').value);
      runs.push({ id: uid(), date: document.getElementById('rdate').value || todayISO(), min: m, km: km, hr: hr, feel: feel });
      runs.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      saveKey('runs', runs);
      toast('Bieg zapisany ✓');
      renderRun();
      return;
    }
    const del = e.target.closest('.del');
    if (del && del.dataset.run) {
      if (confirm('Usunąć ten bieg?')) {
        runs = runs.filter(function (r) { return r.id !== del.dataset.run; });
        saveKey('runs', runs);
        renderRun();
      }
    }
  });
}
function fmtPace(minPerKm) {
  if (!isFinite(minPerKm) || minPerKm <= 0) return '—';
  let m = Math.floor(minPerKm);
  let s = Math.round((minPerKm - m) * 60);
  if (s === 60) { m++; s = 0; }
  return m + ':' + pad2(s);
}
function runListHTML() {
  if (!runs.length) return '<li><span class="mut">Brak zapisanych biegów.</span></li>';
  return runs.slice().reverse().map(function (r) {
    return '<li><div class="li-main"><div>' + fmtNum(r.km) + ' km w ' + fmtNum(r.min) + ' min · ' + fmtPace(r.min / r.km) + ' min/km' +
      (r.hr ? ' · ' + r.hr + ' ud./min' : '') + (r.feel ? ' · ' + r.feel + '/5' : '') + '</div>' +
      '<div class="li-date">' + fmtDate(r.date) + '</div></div>' +
      '<button type="button" class="del" data-run="' + r.id + '" aria-label="Usuń bieg">✕</button></li>';
  }).join('');
}

/* ---------- Pomiary ---------- */
/* Wspólna konfiguracja metryk ciała: formularz, delty, wykresy, lista, CSV.
   Klucze weight/waist muszą zostać — starsze wpisy używają tych nazw. */
const BODY_METRICS = [
  { key: 'weight', label: 'Waga', unit: 'kg', ph: 'np. 82,4', color: '#3b82f6' },
  { key: 'waist', label: 'Pas', unit: 'cm', ph: 'np. 86,5', color: '#f97316' },
  { key: 'chest', label: 'Klatka', unit: 'cm', ph: 'np. 102', color: '#22c55e' },
  { key: 'biceps', label: 'Biceps', unit: 'cm', ph: 'np. 38,5', color: '#a78bfa' },
  { key: 'hips', label: 'Biodra', unit: 'cm', ph: 'np. 98', color: '#f472b6' },
  { key: 'thigh', label: 'Udo', unit: 'cm', ph: 'np. 60', color: '#fbbf24' },
  { key: 'calf', label: 'Łydka', unit: 'cm', ph: 'np. 38', color: '#7dd3fc' }
];

function renderMeasure() {
  resetView();
  let html = '<h2>Pomiary</h2><div class="card">' +
    '<label class="field"><span>Data</span><input id="mdate" type="date" value="' + todayISO() + '"></label>' +
    '<div class="grid2">';
  BODY_METRICS.forEach(function (m) {
    html += '<label class="field"><span>' + m.label + ' (' + m.unit + ')</span>' +
      '<input id="m_' + m.key + '" type="text" inputmode="decimal" autocomplete="off" placeholder="' + m.ph + '"></label>';
  });
  html += '</div>' +
    '<p class="mut small">Wypełnij tylko to, co dziś mierzysz — reszta może zostać pusta.</p>' +
    '<button type="button" id="msave" class="btn primary">Zapisz pomiar</button>' +
    '</div>';

  const sorted = measures.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  if (sorted.length >= 2) {
    const last = sorted[sorted.length - 1], prev = sorted[sorted.length - 2];
    const parts = [];
    BODY_METRICS.forEach(function (m) {
      if (last[m.key] != null && prev[m.key] != null) parts.push(deltaTxt(m.label, last[m.key], prev[m.key], m.unit));
    });
    if (parts.length) {
      html += '<div class="delta">Zmiana od poprzedniego pomiaru (' + fmtDate(prev.date) + ' → ' + fmtDate(last.date) + '): ' +
        parts.join(' · ') + '</div>';
    }
  }
  let anyChart = false;
  BODY_METRICS.forEach(function (m) {
    const pts = sorted.filter(function (e) { return e[m.key] != null; })
      .map(function (e) { return { x: +parseISO(e.date), y: e[m.key] }; });
    if (pts.length >= 2) {
      anyChart = true;
      html += '<p class="charttitle">' + m.label + ' (' + m.unit + ')</p><div class="chartbox">' +
        svgChart([{ points: pts, color: m.color }]) + '</div>';
    }
  });
  if (!anyChart && sorted.length) {
    html += '<p class="mut small">Wykres danej wartości pojawi się, gdy zapiszesz ją co najmniej dwa razy.</p>';
  }

  html += '<h2>Historia pomiarów</h2><ul class="list">' + (sorted.length ? sorted.slice().reverse().map(function (e) {
    const parts = [];
    BODY_METRICS.forEach(function (m) {
      if (e[m.key] != null) {
        parts.push(m.key === 'weight' ? fmtNum(e[m.key]) + ' kg' : m.label.toLowerCase() + ' ' + fmtNum(e[m.key]));
      }
    });
    return '<li><div class="li-main"><div>' + (parts.length ? parts.join(' · ') : '—') + '</div>' +
      '<div class="li-date">' + fmtDate(e.date) + '</div></div>' +
      '<button type="button" class="del" data-m="' + e.id + '" aria-label="Usuń pomiar">✕</button></li>';
  }).join('') : '<li><span class="mut">Brak pomiarów.</span></li>') + '</ul>';
  view.innerHTML = html;

  view.addEventListener('click', function (e) {
    if (e.target.id === 'msave') {
      const entry = { id: uid(), date: document.getElementById('mdate').value || todayISO() };
      let any = false;
      BODY_METRICS.forEach(function (m) {
        const v = parseNum(document.getElementById('m_' + m.key).value);
        entry[m.key] = v;
        if (v != null) any = true;
      });
      if (!any) { toast('Podaj przynajmniej jedną wartość'); return; }
      measures.push(entry);
      saveKey('measures', measures);
      toast('Pomiar zapisany ✓');
      renderMeasure();
      return;
    }
    const del = e.target.closest('.del');
    if (del && del.dataset.m) {
      if (confirm('Usunąć ten pomiar?')) {
        measures = measures.filter(function (m) { return m.id !== del.dataset.m; });
        saveKey('measures', measures);
        renderMeasure();
      }
    }
  });
}
function deltaTxt(label, now, prev, unit) {
  if (now == null || prev == null) return label + ': —';
  const d = Math.round((now - prev) * 10) / 10;
  const cls = d > 0 ? 'up' : d < 0 ? 'downgood' : '';
  const sign = d > 0 ? '+' : '';
  return label + ': <span class="' + cls + '">' + sign + fmtNum(d) + ' ' + unit + '</span>';
}

/* ---------- Historia ---------- */
function renderHistory(exId) {
  resetView();
  let selected = exId && EX_BY_ID[exId] ? exId : null;
  if (!selected) {
    for (let i = sessions.length - 1; i >= 0 && !selected; i--) {
      if (sessions[i].exercises[0]) selected = sessions[i].exercises[0].id;
    }
  }
  if (!selected) selected = 'a1';

  let html = '<h2>Historia ćwiczeń</h2>' +
    '<label class="field"><span>Ćwiczenie</span><select id="hsel">';
  PLAN_KEYS.forEach(function (k) {
    html += '<optgroup label="' + esc(PLANS[k].name + ' — ' + PLANS[k].sub) + '">';
    PLANS[k].exercises.forEach(function (ex) {
      html += '<option value="' + ex.id + '"' + (ex.id === selected ? ' selected' : '') + '>' + esc(ex.name) + '</option>';
    });
    html += '</optgroup>';
  });
  html += '</select></label>';

  const hist = [];
  sessions.forEach(function (s) {
    (s.exercises || []).forEach(function (e) {
      if (e && e.id === selected) hist.push({ date: s.date, weight: e.weight, reps: e.reps || [], deload: !!s.deload });
    });
  });

  const pts = hist.filter(function (h) { return h.weight != null; }).map(function (h) { return { x: +parseISO(h.date), y: h.weight }; });
  html += '<p class="charttitle">Ciężar (kg) w czasie</p><div class="chartbox">' + svgChart([{ points: pts, color: accentFor(selected) }]) + '</div>';

  html += '<ul class="list">' + (hist.length ? hist.slice().reverse().map(function (h) {
    const reps = h.reps.filter(function (r) { return r > 0; }).join('/');
    return '<li><div class="li-main"><div>' + (h.weight != null ? fmtNum(h.weight) + ' kg' : '— kg') + (reps ? ' × ' + reps : '') +
      (h.deload ? ' <span class="mut small">(deload)</span>' : '') + '</div>' +
      '<div class="li-date">' + fmtDate(h.date) + '</div></div></li>';
  }).join('') : '<li><span class="mut">Brak zapisów dla tego ćwiczenia.</span></li>') + '</ul>';
  view.innerHTML = html;

  document.getElementById('hsel').addEventListener('change', function () {
    location.hash = '#/history/' + this.value;
  });
}
function accentFor(exId) {
  const p = EX_BY_ID[exId] ? EX_BY_ID[exId].plan : 'A';
  return p === 'A' ? '#3b82f6' : p === 'B' ? '#22c55e' : '#f97316';
}

/* ---------- Rozgrzewka ---------- */
function renderWarmup() {
  resetView();
  let html = '<div class="guide">';
  html += '<h2>Rozgrzewka</h2>';
  html += '<p class="lead">Rozgrzewka wg schematu RAMP, spersonalizowana pod <span class="k">zablokowany staw krzyżowo-biodrowy (SI)</span> i podrażniony <span class="k">nerw kulszowy</span>. Wykonuj przed każdym treningiem — całość ok. 10–15 min.</p>';

  html += '<div class="disclaimer">⚠️ <strong>To nie jest porada medyczna.</strong> Masz zdiagnozowany uraz — najlepiej skonsultuj ten zestaw z <strong>fizjoterapeutą</strong>. Zasada nadrzędna: ćwicz <strong>bez bólu</strong>. Ostry lub promieniujący ból, drętwienie albo mrowienie w nodze = od razu przerwij dane ćwiczenie. Mobilizacja nerwu ma być delikatnym „ślizgiem", nigdy mocnym rozciąganiem.</div>';

  html += '<div class="card"><h3><span class="tag pw">1</span> Rozgrzej (Raise) — 5 min</h3>' +
    '<p>Podnieś tętno i temperaturę ciała spokojnym, <span class="k">mało uderzeniowym</span> cardio — łagodniejszym dla stawu SI i kulszowego niż bieżnia:</p>' +
    '<ul><li>rower stacjonarny, orbitrek lub szybki marsz — <span class="k">5 min</span>, tempo konwersacyjne</li></ul></div>';

  html += '<div class="card"><h3><span class="tag pw">2</span> Aktywuj (Activate) — pośladki i głęboki core</h3>' +
    '<p class="mut small">Kluczowe przy dysfunkcji SI: silne pośladki i głęboki core stabilizują miednicę i odciążają staw oraz mięsień gruszkowaty.</p>' +
    '<ul>' +
    '<li><span class="k">Mostek biodrowy</span> — 2 × 10–12, mocno ściśnij pośladki na górze</li>' +
    '<li><span class="k">Muszelka (clamshell)</span> — 2 × 12 / strona, kolana zgięte, miednica nieruchoma (mięsień pośladkowy średni)</li>' +
    '<li><span class="k">Bird-dog</span> (naprzemienny wyprost ręka + przeciwna noga w klęku) — 2 × 8 / strona, przytrzymaj 3–5 s; nie pozwól obracać się miednicy</li>' +
    '<li><span class="k">Dead bug (martwy robak)</span> — 2 × 8 / strona, lędźwie dociśnięte do podłogi</li>' +
    '<li><span class="k">Napięcie poprzecznego brzucha</span> — delikatnie „wciągnij" brzuch, 5 × 5 s</li>' +
    '</ul></div>';

  html += '<div class="card"><h3><span class="tag pw">3</span> Mobilizuj (Mobilise) — biodra i lędźwie</h3>' +
    '<ul>' +
    '<li><span class="k">Kot–krowa</span> — 8–10 powtórzeń, płynnie</li>' +
    '<li><span class="k">Rotacje bioder 90/90</span> (siad, przekładanie kolan) — 8 / strona</li>' +
    '<li><span class="k">Kolano do klatki</span> pojedynczo — 5 / strona, delikatnie</li>' +
    '<li><span class="k">Rozciąganie mięśnia gruszkowatego</span> (wersja modyfikowana: kostka na przeciwnym kolanie, przyciągnij udo do klatki) — 2 × 20–30 s / strona, <span class="hl legs">tylko do lekkiego napięcia, nie do bólu</span>. Gruszkowaty często uciska nerw kulszowy.</li>' +
    '</ul></div>';

  html += '<div class="card"><h3><span class="tag pw">4</span> Mobilizacja nerwu kulszowego (nerve flossing)</h3>' +
    '<p>Delikatny „ślizg" nerwu — <span class="k">ruchy przeciwstawne</span>, bez ciągnięcia bólu:</p>' +
    '<ul>' +
    '<li><span class="k">Siedząc na krześle:</span> wyprostuj kolano i <span class="k">zegnij stopę do siebie</span>, jednocześnie odchylając głowę w tył → wróć i zegnij kolano, wyciągając palce stopy i pochylając głowę w przód. 10 płynnych powtórzeń / strona.</li>' +
    '<li><span class="k">Alternatywa leżąc:</span> przyciągnij kolano do klatki, potem prostuj kolano ze stopą zgiętą do siebie i wracaj. 10 / strona.</li>' +
    '</ul>' +
    '<p class="mut small">To ma być ślizg, nie rozciąganie. Jeśli nasila drętwienie lub ból promieniujący w nogę — zmniejsz zakres albo odpuść.</p></div>';

  html += '<div class="card"><h3><span class="tag pw">5</span> Przygotuj (Potentiate) — serie rozgrzewkowe</h3>' +
    '<ul>' +
    '<li>Przed pierwszym ćwiczeniem zrób <span class="k">1–2 serie rozgrzewkowe</span> z lekkim ciężarem (ok. 40–60% roboczego), stopniowo dochodząc do ciężaru z planu.</li>' +
    '<li>Utrzymuj <span class="k">neutralny kręgosłup i napięty core</span> — to najważniejsza ochrona stawu SI.</li>' +
    '</ul></div>';

  html += '<div class="card"><h3>🧭 Wskazówki pod Twój uraz (SI + kulszowy)</h3>' +
    '<ul>' +
    '<li>Przy przysiadach, wyciskaniu nogami i martwym trzymaj <span class="k">neutralną miednicę i napięty brzuch</span> — nie „zwijaj" lędźwi na dole.</li>' +
    '<li>Uważaj na <span class="k">asymetryczne i rotacyjne</span> obciążenia (przysiad bułgarski, wiosłowanie jednorącz) — kontroluj miednicę, w gorsze dni zmniejsz zakres lub ciężar.</li>' +
    '<li><span class="k">Unikaj</span> ruchów nasilających promieniujący ból lub drętwienie nogi. Nic nie rób „na siłę".</li>' +
    '<li>Ćwiczenia aktywujące pośladki (mostek, muszelka) warto robić <span class="k">codziennie</span> — odciążają staw SI i gruszkowaty.</li>' +
    '<li>W gorszy dzień skróć rozgrzewkę do: Raise + Activate + nerve flossing.</li>' +
    '</ul></div>';

  html += '<div class="card"><h3>📚 Źródła</h3><p class="src">Zestaw oparty na ogólnodostępnych, rzetelnych materiałach:</p>' +
    '<ul class="src">' +
    '<li>Protokół RAMP (Raise–Activate–Mobilise–Potentiate) — Third Space, O\'Hanlon Performance</li>' +
    '<li>Ćwiczenia na dysfunkcję stawu SI (mostek, muszelka, bird-dog, stabilizacja core) — Hinge Health, Frontiers in Physiology (2024)</li>' +
    '<li>Nerve flossing / ślizgi nerwu kulszowego — GoodRx, HealthCentral</li>' +
    '<li>Rozciąganie mięśnia gruszkowatego przy rwie kulszowej — Spine-health, JAG PT</li>' +
    '</ul>' +
    '<p class="src mut">To materiały edukacyjne, nie zastępują diagnozy ani planu od Twojego fizjoterapeuty.</p></div>';

  html += '</div>';
  view.innerHTML = html;
}

/* ---------- Instrukcja ---------- */
function renderGuide() {
  resetView();
  const wk = cycleWeek();
  let html = '<div class="guide">';
  html += '<h2>Instrukcja</h2>';
  html += '<p class="lead">Twój plan i zasady progresji z Excela — w skrócie, zawsze pod ręką. ' +
    'Jesteś w <span class="k">tygodniu ' + wk + '/8</span>' + (wk === 8 ? ' (deload)' : '') + '.</p>';

  html += '<div class="card"><h3>🎯 Jak działa progresja (RIR 1–2)</h3>' +
    '<p>Każdą serię wykonuj z zapasem <span class="k">1–2 powtórzeń</span> (RIR 1–2) — kończ ją, gdy w baku zostają jeszcze 1–2 czyste powtórzenia, nie do upadku.</p>' +
    '<p>Gdy w danym ćwiczeniu osiągniesz <span class="k">górną granicę zakresu we wszystkich seriach</span>, następnym razem dołóż ciężar:</p>' +
    '<ul>' +
    '<li><span class="hl">+2,5 kg</span> — góra ciała (klatka, plecy, barki, ramiona, brzuch)</li>' +
    '<li><span class="hl legs">+5 kg</span> — nogi: suwnica, uginanie nóg, przysiad bułgarski, wspięcia na palce</li>' +
    '</ul>' +
    '<p class="mut small">Aplikacja sama policzy to za Ciebie — na ekranie treningu zobaczysz zieloną plakietkę „Progresja: +X kg", gdy warunek jest spełniony.</p></div>';

  html += '<div class="card"><h3>🔄 Cykl 8 tygodni i deload</h3>' +
    '<p>Cykl liczony jest od <span class="k">pierwszego zapisanego treningu</span>. Tydzień <span class="k">8 to deload</span> — lżejszy tydzień na regenerację:</p>' +
    '<ul><li><span class="k">połowa serii</span> w każdym ćwiczeniu</li><li>ciężar <span class="k">−30%</span></li></ul>' +
    '<p class="mut small">W tygodniu 8 aplikacja pokaże pomarańczowy baner i podpowie orientacyjny ciężar deloadu. Nowy cykl (powrót do tygodnia 1) uruchomisz w zakładce „Więcej → Reset cyklu".</p></div>';

  html += '<div class="card"><h3>🗓️ Plan tygodnia</h3>' +
    '<p><span class="k">3 treningi siłowe</span> rotacyjnie:</p>' +
    '<ul>' +
    '<li><h3 style="margin:4px 0"><span class="tag pa">A</span> Klatka + plecy I<span class="day">poniedziałek</span></h3></li>' +
    '<li><h3 style="margin:4px 0"><span class="tag pb">B</span> Nogi + barki<span class="day">czwartek</span></h3></li>' +
    '<li><h3 style="margin:4px 0"><span class="tag pc">C</span> Klatka + plecy II<span class="day">sobota</span></h3></li>' +
    '</ul>' +
    '<p>Do tego, w wolne dni:</p>' +
    '<ul>' +
    '<li><span class="k">Bieganie 2× w tygodniu</span> — 30–40 min, tempo konwersacyjne (takie, przy którym dasz radę rozmawiać)</li>' +
    '<li><span class="k">Pomiary 1× w tygodniu</span> — waga i pas (możesz też dopisać obwody: klatka, biceps, biodra, udo, łydka)</li>' +
    '</ul></div>';

  html += '<div class="card"><h3>⚡ Jak błyskawicznie zapisać trening</h3>' +
    '<ol>' +
    '<li>Wejdź w kafel <span class="k">A</span>, <span class="k">B</span> lub <span class="k">C</span> na ekranie startowym.</li>' +
    '<li>Wpisz <span class="k">ciężar</span> — albo dostrój przyciskami <span class="k">− / +</span> co 2,5 kg.</li>' +
    '<li>Po wykonanej serii <span class="k">odhacz ptaszek</span> — startuje timer przerwy (możesz go wyłączyć w „Więcej").</li>' +
    '<li>Wpisz liczbę <span class="k">powtórzeń</span> w każdej serii.</li>' +
    '<li>Przycisk <span class="k">„Powtórz ostatnie"</span> kopiuje cały poprzedni wynik jednym tapnięciem.</li>' +
    '<li><span class="k">„Zakończ trening"</span> zapisuje sesję z datą.</li>' +
    '</ol>' +
    '<p class="mut small">Wszystko zapisuje się na bieżąco (autozapis szkicu) — po zablokowaniu ekranu nic nie ginie. Szare „Ostatnio: …" pod nazwą ćwiczenia to Twój poprzedni wynik.</p></div>';

  html += '<div class="card"><h3>📈 Pomiary i historia</h3>' +
    '<p>W <span class="k">Pomiarach</span> zapisujesz wagę, pas i obwody — pod spodem rosną wykresy i zmiana tydzień do tygodnia.</p>' +
    '<p>W <span class="k">Historii</span> wybierasz ćwiczenie i widzisz wszystkie sesje oraz wykres progresu ciężaru w czasie.</p></div>';

  html += '<div class="card"><h3>💾 Kopia zapasowa (ważne!)</h3>' +
    '<p>Dane trzymane są <span class="k">tylko w tym telefonie</span> (w pamięci przeglądarki). Nie ma konta ani chmury.</p>' +
    '<ul>' +
    '<li>Co jakiś czas rób <span class="k">Eksport kopii (JSON)</span> w zakładce „Więcej" — to pełny backup do przywrócenia.</li>' +
    '<li><span class="k">Eksport CSV</span> otworzysz w Excelu (średniki, polskie znaki).</li>' +
    '</ul>' +
    '<p class="mut small">Wyczyszczenie danych przeglądarki albo odinstalowanie aplikacji usuwa historię — dlatego warto mieć świeży plik JSON.</p></div>';

  html += '</div>';
  view.innerHTML = html;
}

/* ---------- Ustawienia / dane ---------- */
function renderSettings() {
  resetView();
  const start = cycleStartDate();
  const lastS = sessions[sessions.length - 1];
  let html = '<h2>Ustawienia</h2><div class="card">' +
    '<div class="setrow"><div>Timer przerwy po odhaczeniu serii</div>' +
    '<span class="switch"><input type="checkbox" id="stimer"' + (settings.timer ? ' checked' : '') + '><span class="knob"></span></span></div>' +
    '<div class="setrow"><div>Wibracja po zakończeniu przerwy</div>' +
    '<span class="switch"><input type="checkbox" id="svibrate"' + (settings.vibrate ? ' checked' : '') + '><span class="knob"></span></span></div>' +
    '<p class="mut small" style="margin:8px 2px 0">Czas przerwy ustawiasz osobno dla każdego ćwiczenia na ekranie treningu (± 15 s, „wył." blokuje timer). Wibracja działa na Androidzie — iPhone (Safari) nie obsługuje wibracji ze strony.</p>' +
    '</div>';

  html += '<h2>Cykl</h2><div class="card">' +
    '<p class="mut small">Tydzień ' + cycleWeek() + '/8' + (start ? ' · start cyklu: ' + fmtDate(start) : ' · cykl ruszy z pierwszym treningiem') + '. Tydzień 8 = deload.</p>' +
    '<button type="button" id="scycle" class="btn wide">Reset cyklu (nowy tydzień 1)</button>' +
    '</div>';

  html += '<h2>Dane</h2><div class="card" style="display:grid;gap:8px">' +
    '<button type="button" id="sexp" class="btn wide">Eksport kopii zapasowej (JSON)</button>' +
    '<button type="button" id="simp" class="btn wide">Import z kopii (JSON)</button>' +
    '<input type="file" id="sfile" accept=".json,application/json" hidden>' +
    '<button type="button" id="scsv1" class="btn wide">Eksport CSV — treningi</button>' +
    '<button type="button" id="scsv2" class="btn wide">Eksport CSV — biegi</button>' +
    '<button type="button" id="scsv3" class="btn wide">Eksport CSV — pomiary</button>' +
    (lastS ? '<button type="button" id="sdel" class="btn danger wide">Usuń ostatni trening (' + esc(PLANS[lastS.plan].name) + ', ' + fmtDate(lastS.date) + ')</button>' : '') +
    '</div>' +
    '<p class="mut small" style="margin:14px 2px">Dane trzymane są tylko w tym telefonie (localStorage przeglądarki). Rób co jakiś czas eksport JSON — to pełna kopia zapasowa.</p>';
  view.innerHTML = html;

  document.getElementById('stimer').addEventListener('change', function () {
    settings.timer = this.checked;
    saveKey('settings', settings);
  });
  document.getElementById('svibrate').addEventListener('change', function () {
    settings.vibrate = this.checked;
    saveKey('settings', settings);
    if (this.checked) { try { if (navigator.vibrate) navigator.vibrate(120); } catch (e) {} }
  });
  view.addEventListener('click', function (e) {
    switch (e.target.id) {
      case 'scycle':
        if (confirm('Zacząć nowy cykl od dziś (tydzień 1)?')) {
          settings.cycleStart = todayISO();
          saveKey('settings', settings);
          updateWeekChip();
          renderSettings();
          toast('Nowy cykl — tydzień 1');
        }
        break;
      case 'sexp': exportJSON(); break;
      case 'simp': document.getElementById('sfile').click(); break;
      case 'scsv1': exportCSVWorkouts(); break;
      case 'scsv2': exportCSVRuns(); break;
      case 'scsv3': exportCSVMeasures(); break;
      case 'sdel':
        if (sessions.length && confirm('Usunąć ostatni zapisany trening?')) {
          sessions.pop();
          saveKey('sessions', sessions);
          renderSettings();
          toast('Trening usunięty');
        }
        break;
    }
  });
  document.getElementById('sfile').addEventListener('change', function () {
    const f = this.files && this.files[0];
    if (f) importJSON(f);
    this.value = '';
  });
}

function download(name, text, mime) {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function stamp() { return todayISO().replace(/-/g, ''); }

function exportJSON() {
  const data = { app: 'gym-tracker', version: DB_V, exportedAt: new Date().toISOString(), sessions: sessions, runs: runs, measures: measures, notes: notes, settings: settings };
  download('trening-kopia-' + stamp() + '.json', JSON.stringify(data, null, 2), 'application/json');
  toast('Kopia zapisana do pliku');
}
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const d = JSON.parse(reader.result);
      if (!d || typeof d !== 'object') throw new Error('bad');
      const ns = cleanSessions(d.sessions), nr = cleanRuns(d.runs), nm = cleanMeasures(d.measures);
      if (!ns.length && !nr.length && !nm.length) throw new Error('empty');
      if (!confirm('Wczytać kopię? Zastąpi obecne dane (treningi: ' + ns.length + ', biegi: ' + nr.length + ', pomiary: ' + nm.length + ').')) return;
      sessions = ns; runs = nr; measures = nm;
      notes = cleanNotes(d.notes);
      if (d.settings && typeof d.settings === 'object') settings = normSettings(d.settings);
      persist();
      updateWeekChip();
      renderSettings();
      toast('Kopia wczytana ✓');
    } catch (e) {
      toast('Nie udało się odczytać pliku');
    }
  };
  reader.readAsText(file);
}

/* CSV: średniki, przecinek dziesiętny, UTF-8 z BOM (Excel PL) */
function csvText(rows) {
  return '\ufeff' + rows.map(function (r) {
    return r.map(function (f) {
      f = f == null ? '' : String(f);
      return /[;"\n]/.test(f) ? '"' + f.replace(/"/g, '""') + '"' : f;
    }).join(';');
  }).join('\r\n');
}
function exportCSVWorkouts() {
  const rows = [['Data', 'Tydzień', 'Trening', 'Ćwiczenie', 'Ciężar (kg)', 'Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Deload']];
  sessions.forEach(function (s) {
    (s.exercises || []).forEach(function (e) {
      const ex = EX_BY_ID[e.id];
      const reps = e.reps || [];
      rows.push([s.date, s.week || '', PLANS[s.plan].name, ex ? ex.name : e.id, fmtNum(e.weight),
        reps[0] || '', reps[1] || '', reps[2] || '', reps[3] || '', s.deload ? 'tak' : '']);
    });
  });
  download('treningi-' + stamp() + '.csv', csvText(rows), 'text/csv;charset=utf-8');
}
function exportCSVRuns() {
  const rows = [['Data', 'Czas (min)', 'Dystans (km)', 'Tempo (min/km)', 'Tętno', 'Samopoczucie (1–5)']];
  runs.forEach(function (r) {
    rows.push([r.date, fmtNum(r.min), fmtNum(r.km), fmtPace(r.min / r.km), r.hr || '', r.feel || '']);
  });
  download('biegi-' + stamp() + '.csv', csvText(rows), 'text/csv;charset=utf-8');
}
function exportCSVMeasures() {
  const rows = [['Data'].concat(BODY_METRICS.map(function (m) { return m.label + ' (' + m.unit + ')'; }))];
  measures.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (e) {
    rows.push([e.date].concat(BODY_METRICS.map(function (m) { return fmtNum(e[m.key]); })));
  });
  download('pomiary-' + stamp() + '.csv', csvText(rows), 'text/csv;charset=utf-8');
}

/* =========================================================
   Router
   ========================================================= */
function router() {
  stopRestTimer();
  const hash = (location.hash || '#/home').replace(/^#\//, '');
  const parts = hash.split('/');
  const route = parts[0] || 'home';
  updateWeekChip();

  document.querySelectorAll('.bottomnav a').forEach(function (a) {
    const nav = a.dataset.nav;
    a.classList.toggle('on', nav === route || (route === 'workout' && nav === 'home'));
  });

  switch (route) {
    case 'workout': renderWorkout(parts[1]); break;
    case 'run': renderRun(); break;
    case 'measure': renderMeasure(); break;
    case 'history': renderHistory(parts[1]); break;
    case 'warmup': renderWarmup(); break;
    case 'guide': renderGuide(); break;
    case 'settings': renderSettings(); break;
    default: renderHome();
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
document.getElementById('timerstop').addEventListener('click', stopRestTimer);
router();

/* =========================================================
   Service worker
   ========================================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
