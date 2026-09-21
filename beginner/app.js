'use strict';

/* =========================================================
   Magazyn danych (localStorage, prefiks gf., wersjonowany, odporny)
   ========================================================= */
const DB_V = 1;
const KEY_PREFIX = 'gf.';

function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    if (raw == null) return fallback;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object' || obj.v !== DB_V) return fallback;
    return obj.d;
  } catch (e) { return fallback; }
}
function saveKey(key, data) {
  try { localStorage.setItem(KEY_PREFIX + key, JSON.stringify({ v: DB_V, d: data })); }
  catch (e) { toast('Nie udało się zapisać danych'); }
}
function dropKey(key) { try { localStorage.removeItem(KEY_PREFIX + key); } catch (e) {} }

function cleanSessions(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function (s) {
    return s && typeof s === 'object' && typeof s.date === 'string' && PLANS[s.plan] && Array.isArray(s.exercises);
  }).map(function (s) {
    s.exercises = s.exercises.filter(function (e) { return e && typeof e === 'object' && EX[e.id]; });
    return s;
  });
}
function cleanDated(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(function (r) { return r && typeof r === 'object' && typeof r.date === 'string'; });
}
function cleanNotes(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {};
  Object.keys(o).forEach(function (k) { if (typeof o[k] === 'string' && o[k].trim()) out[k] = o[k]; });
  return out;
}
function cleanSteps(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {};
  Object.keys(o).forEach(function (k) { if (/^\d{4}-\d{2}-\d{2}$/.test(k) && typeof o[k] === 'number' && o[k] >= 0) out[k] = o[k]; });
  return out;
}
function normSettings(s) {
  s = (s && typeof s === 'object') ? s : {};
  if (typeof s.timer !== 'boolean') s.timer = true;
  if (typeof s.vibrate !== 'boolean') s.vibrate = true;
  if (s.cycleStart === undefined) s.cycleStart = null;
  if (!s.rest || typeof s.rest !== 'object') s.rest = {};
  if (!s.alt || typeof s.alt !== 'object') s.alt = {};
  if (['auto', 'light', 'dark'].indexOf(s.theme) < 0) s.theme = 'auto';
  if (typeof s.stepsGoal !== 'number') s.stepsGoal = 8000;
  return s;
}
function normProfile(p) {
  p = (p && typeof p === 'object') ? p : {};
  if (typeof p.name !== 'string') p.name = '';
  ['age', 'height', 'weight'].forEach(function (k) { if (typeof p[k] !== 'number') p[k] = null; });
  if ([1.2, 1.375, 1.55].indexOf(p.activity) < 0) p.activity = 1.55;
  if (['lose', 'recomp', 'build'].indexOf(p.goal) < 0) p.goal = 'lose';
  p.onboarded = !!p.onboarded;
  return p;
}

let sessions = cleanSessions(loadKey('sessions', []));
let cardio = cleanDated(loadKey('cardio', []));
let measures = cleanDated(loadKey('measures', []));
let notes = cleanNotes(loadKey('notes', {}));
let settings = normSettings(loadKey('settings', {}));
let profile = normProfile(loadKey('profile', {}));
let steps = cleanSteps(loadKey('steps', {}));

function persistAll() {
  saveKey('sessions', sessions); saveKey('cardio', cardio); saveKey('measures', measures);
  saveKey('notes', notes); saveKey('settings', settings); saveKey('profile', profile); saveKey('steps', steps);
}

/* =========================================================
   Pomocnicze
   ========================================================= */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function isoOf(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function todayISO() { return isoOf(new Date()); }
function parseISO(iso) { const p = String(iso).split('-'); return new Date(+p[0], +p[1] - 1, +p[2] || 1); }
function fmtDate(iso) { const p = String(iso).split('-'); return p.length < 3 ? iso : p[2] + '.' + p[1] + '.' + p[0]; }
function addDays(iso, n) { const d = parseISO(iso); d.setDate(d.getDate() + n); return isoOf(d); }
function daysBetween(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
function weekStart(iso) { const d = parseISO(iso); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); return isoOf(d); }
const WEEKDAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
function fmtLong(iso) { const d = parseISO(iso); return WEEKDAYS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }

function parseNum(str) {
  if (str == null) return null;
  const s = String(str).trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return isFinite(n) && n >= 0 ? n : null;
}
function parseInt0(str) { const n = parseNum(str); return n == null ? null : Math.round(n); }
function fmtNum(n) { if (n == null || !isFinite(n)) return ''; return String(Math.round(n * 100) / 100).replace('.', ','); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function plural(n, one, few, many) { if (n === 1) return one; const m10 = n % 10, m100 = n % 100; return (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? few : many; }
function fmtDur(sec) { const m = Math.floor(sec / 60), s = sec % 60; return m + ':' + pad2(s); }

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { t.hidden = true; }, 2400);
}
function download(name, text, mime) {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
function stamp() { return todayISO().replace(/-/g, ''); }
function icon(name) {
  const I = {
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    swap: '<svg viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 19V6M6 12l6-6 6 6"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5z"/><path d="M8 11h8M8 15h6"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 3c.5 3-2.2 4.4-2.2 7 0 1.4.9 2.4 2 2.4.1-1.5 1-2.1 1.6-3 1.5 1.5 2.6 3 2.6 5.3A4 4 0 0 1 8 14.7C8 10 11 8.5 12 3z"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    ruler: '<svg viewBox="0 0 24 24"><path d="M3 8h18v8H3z"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>',
    photo: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15.5H5.5A1.5 1.5 0 0 0 4 21z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15.5h5.5A1.5 1.5 0 0 1 20 21z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    walk: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="M9 20l2.5-5L9 12l3-4 3 2.5 3.5.5"/><path d="M12 8l-4 1.5L6.5 13"/><path d="M11.5 15L15 17l1 4"/></svg>',
    calc: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/></svg>'
  };
  return I[name] || '';
}
function emptyState(text, kind) {
  const art = kind === 'photo'
    ? '<svg viewBox="0 0 110 90"><rect class="e2" x="18" y="22" width="74" height="52" rx="10"/><path class="e1" d="M30 30h12l4-6h18l4 6h12v36H30z"/><circle class="e1" cx="55" cy="48" r="9"/><path class="e3" d="M8 80h94"/></svg>'
    : kind === 'chart'
      ? '<svg viewBox="0 0 110 90"><path class="e2" d="M14 72 L34 50 L54 58 L74 34 L96 42 V78 H14z"/><path class="e1" d="M14 72 L34 50 L54 58 L74 34 L96 42"/><circle class="e1" cx="74" cy="34" r="3"/><path class="e3" d="M8 80h94"/></svg>'
      : '<svg viewBox="0 0 110 90"><circle class="e2" cx="55" cy="42" r="26"/><path class="e1" d="M40 44l10 9 20-20"/><path class="e3" d="M8 80h94"/></svg>';
  return '<div class="empty">' + art + '<p>' + text + '</p></div>';
}

/* =========================================================
   Motyw
   ========================================================= */
function applyTheme() {
  const root = document.documentElement;
  if (settings.theme === 'light' || settings.theme === 'dark') root.setAttribute('data-theme', settings.theme);
  else root.removeAttribute('data-theme');
}

/* =========================================================
   Cykl 8 tygodni: tydz. 1–2 wprowadzenie, 8 = deload
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
  const days = daysBetween(start, todayISO());
  if (days < 0) return 1;
  return (Math.floor(days / 7)) % 8 + 1;
}
function isDeload() { return cycleWeek() === 8; }
function isIntro() { return cycleWeek() <= 2; }
function targetSets(ex) { return (isDeload() || isIntro()) ? Math.min(2, ex.sets) : ex.sets; }
function roundToStep(w, step) { return Math.round(w / step) * step; }

const REST_MAX = 600, REST_STEP = 15;
function restForEx(ex) { const r = settings.rest[ex.id]; return (typeof r === 'number' && r >= 0) ? r : ex.restSec; }
function fmtRest(sec) { return (!sec || sec <= 0) ? 'wył.' : Math.floor(sec / 60) + ':' + pad2(sec % 60); }

function activeExId(slotId) {
  const main = EX[slotId];
  return (settings.alt[slotId] && main.alt) ? main.alt : slotId;
}

/* =========================================================
   Ostatnie wyniki, rekordy i progresja
   ========================================================= */
function lastResult(exId) {
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i];
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
function fmtLast(lr, ex) {
  if (!lr) return 'Ostatnio: jeszcze nie robiłaś';
  const unit = ex.unit === 's' ? ' s' : '';
  const reps = lr.reps.map(function (r) { return (typeof r === 'number' && r > 0) ? r : '–'; }).join('/');
  let w = '';
  if (!ex.noWeight) w = (lr.weight != null ? fmtNum(lr.weight) + ' kg' : '— kg') + (reps ? ' × ' : '');
  return 'Ostatnio (' + fmtDate(lr.date) + '): ' + w + reps + unit;
}
function progressionFor(ex) {
  const lr = lastResult(ex.id);
  if (!lr || lr.deload) return null;
  const done = lr.reps.filter(function (r) { return typeof r === 'number' && r > 0; });
  if (done.length < 2) return null;
  if (!done.every(function (r) { return r >= ex.max; })) return null;
  if (ex.noWeight || lr.weight == null) return { kind: 'harder' };
  return { kind: 'weight', inc: ex.inc, from: lr.weight, to: Math.max(0, lr.weight + ex.inc) };
}
function bestBefore(exId, beforeTs) {
  let bestW = null, bestR = 0;
  sessions.forEach(function (s) {
    if (s.ts >= beforeTs) return;
    s.exercises.forEach(function (e) {
      if (e.id !== exId) return;
      if (typeof e.weight === 'number' && e.weight > 0 && (bestW == null || e.weight > bestW)) bestW = e.weight;
      (e.reps || []).forEach(function (r) { if (typeof r === 'number' && r > bestR) bestR = r; });
    });
  });
  return { weight: bestW, reps: bestR };
}

/* =========================================================
   Statystyki tygodnia, następny trening, seria
   ========================================================= */
function lastSession() { return sessions.length ? sessions[sessions.length - 1] : null; }
function nextPlanKey() {
  const drafts = PLAN_KEYS.filter(function (k) { return !!loadDraft(k); });
  if (drafts.length) return drafts[0];
  const ls = lastSession();
  if (!ls) return 'A';
  return ls.plan === 'A' ? 'B' : 'A';
}
function weekStats(iso) {
  const ws = weekStart(iso || todayISO()), we = addDays(ws, 6);
  const w = sessions.filter(function (s) { return s.date >= ws && s.date <= we; }).length;
  const c = cardio.filter(function (s) { return s.date >= ws && s.date <= we; });
  const cmin = c.reduce(function (a, s) { return a + (s.min || 0); }, 0);
  let stepDays = 0, stepSum = 0;
  for (let i = 0; i < 7; i++) { const d = addDays(ws, i); if (steps[d] != null) { stepDays++; stepSum += steps[d]; } }
  return { workouts: w, cardio: c.length, cardioMin: cmin, stepsAvg: stepDays ? Math.round(stepSum / stepDays) : null, stepsToday: steps[todayISO()] || null };
}
function weekStreak() {
  const weeks = {};
  sessions.forEach(function (s) { weeks[weekStart(s.date)] = true; });
  let cur = weekStart(todayISO());
  if (!weeks[cur]) cur = addDays(cur, -7);
  let n = 0;
  while (weeks[cur]) { n++; cur = addDays(cur, -7); }
  return n;
}
function lastDateOf(arr) { let last = null; arr.forEach(function (x) { if (!last || x.date > last) last = x.date; }); return last; }

/* =========================================================
   Szkic treningu (autozapis)
   ========================================================= */
function draftKey(plan) { return 'draft.' + plan; }
function loadDraft(plan) { const d = loadKey(draftKey(plan), null); return (d && typeof d === 'object' && d.ex) ? d : null; }
let workoutOpenedAt = 0;
function saveDraftFromDOM(plan) {
  const prev = loadDraft(plan);
  const d = { date: todayISO(), startedAt: prev && prev.startedAt ? prev.startedAt : Date.now(), ex: {} };
  document.querySelectorAll('.excard').forEach(function (card) {
    const id = card.dataset.ex;
    const wEl = card.querySelector('input.w');
    const w = wEl ? wEl.value : '';
    const reps = Array.prototype.map.call(card.querySelectorAll('input.reps'), function (i) { return i.value; });
    const done = Array.prototype.map.call(card.querySelectorAll('input.done'), function (i) { return i.checked; });
    if (w !== '' || reps.some(function (r) { return r !== ''; }) || done.some(Boolean)) d.ex[id] = { w: w, reps: reps, done: done };
  });
  if (Object.keys(d.ex).length) saveKey(draftKey(plan), d); else dropKey(draftKey(plan));
}

/* =========================================================
   Timer przerwy
   ========================================================= */
let timerInt = null, timerEnd = 0, timerOver = false;
function startRestTimer(sec, label) {
  if (!settings.timer) return;
  stopRestTimer();
  timerEnd = Date.now() + sec * 1000; timerOver = false;
  const bar = document.getElementById('timerbar');
  document.getElementById('timerlabel').textContent = label;
  bar.classList.remove('over'); bar.hidden = false;
  tickTimer();
  timerInt = setInterval(tickTimer, 250);
}
function tickTimer() {
  const bar = document.getElementById('timerbar');
  const left = Math.ceil((timerEnd - Date.now()) / 1000);
  if (left <= 0) {
    document.getElementById('timertime').textContent = '0:00';
    if (!timerOver) {
      timerOver = true; bar.classList.add('over');
      document.getElementById('timerlabel').textContent = 'Przerwa skończona — lecimy dalej';
      buzz([400, 120, 400, 120, 400]); beep();
      setTimeout(stopRestTimer, 6000);
    }
    return;
  }
  document.getElementById('timertime').textContent = fmtDur(left);
}
function stopRestTimer() { if (timerInt) clearInterval(timerInt); timerInt = null; document.getElementById('timerbar').hidden = true; }
function buzz(pattern) { if (!settings.vibrate) return; try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} }
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
   Wykresy SVG
   ========================================================= */
function svgChart(series, opts) {
  opts = opts || {};
  const W = 340, H = opts.h || 130, P = 30, PB = 18, PT = 8;
  let allPts = [];
  series.forEach(function (s) { allPts = allPts.concat(s.points); });
  if (!allPts.length) return emptyState('Wykres pojawi się po dwóch zapisach.', 'chart');
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  allPts.forEach(function (p) { if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x; if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; });
  if (minY === maxY) { minY -= 1; maxY += 1; }
  const spanY = maxY - minY; minY -= spanY * 0.1; maxY += spanY * 0.1;
  const sx = function (x) { return maxX === minX ? (P + (W - 2 * P) / 2) : P + (x - minX) / (maxX - minX) * (W - 2 * P); };
  const sy = function (y) { return PT + (1 - (y - minY) / (maxY - minY)) * (H - PT - PB); };
  let out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="wykres">';
  out += '<line class="axis" x1="' + P + '" y1="' + sy(minY) + '" x2="' + (W - P) + '" y2="' + sy(minY) + '" stroke-width="1"/>';
  series.forEach(function (s) {
    const pts = s.points.slice().sort(function (a, b) { return a.x - b.x; });
    if (pts.length > 1) {
      const path = pts.map(function (p, i) { return (i ? 'L' : 'M') + sx(p.x).toFixed(1) + ' ' + sy(p.y).toFixed(1); }).join(' ');
      out += '<path d="' + path + ' L' + sx(pts[pts.length - 1].x).toFixed(1) + ' ' + sy(minY) + ' L' + sx(pts[0].x).toFixed(1) + ' ' + sy(minY) + 'Z" fill="' + s.color + '" opacity=".08"/>';
      out += '<path d="' + path + '" fill="none" stroke="' + s.color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    pts.forEach(function (p) { out += '<circle cx="' + sx(p.x).toFixed(1) + '" cy="' + sy(p.y).toFixed(1) + '" r="3.4" fill="' + s.color + '"/>'; });
  });
  const vals = series[0].points.map(function (p) { return p.y; });
  const lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  out += '<text class="tick" x="2" y="' + (sy(hi) + 4) + '">' + fmtNum(hi) + '</text>';
  if (hi !== lo) out += '<text class="tick" x="2" y="' + (sy(lo) + 4) + '">' + fmtNum(lo) + '</text>';
  const d1 = new Date(minX), d2 = new Date(maxX);
  out += '<text class="tick" x="' + P + '" y="' + (H - 4) + '">' + pad2(d1.getDate()) + '.' + pad2(d1.getMonth() + 1) + '</text>';
  if (minX !== maxX) out += '<text class="tick" x="' + (W - P) + '" y="' + (H - 4) + '" text-anchor="end">' + pad2(d2.getDate()) + '.' + pad2(d2.getMonth() + 1) + '</text>';
  return out + '</svg>';
}
function ringSVG(frac, cls) {
  const r = 32, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, frac));
  return '<svg viewBox="0 0 78 78" aria-hidden="true"><circle class="track" cx="39" cy="39" r="' + r + '"/><circle class="bar" cx="39" cy="39" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - f)).toFixed(1) + '"/></svg>';
}

/* =========================================================
   Widoki
   ========================================================= */
let view = document.getElementById('view');
function resetView() {
  const fresh = view.cloneNode(false);
  view.parentNode.replaceChild(fresh, view);
  view = fresh;
}
function updateWeekChip() {
  const chip = document.getElementById('weekchip');
  const wk = cycleWeek();
  chip.hidden = false;
  chip.textContent = 'Tydzień ' + wk + '/8' + (wk <= 2 ? ' · start' : wk === 8 ? ' · lżej' : '');
  chip.classList.toggle('deload', wk === 8);
  chip.classList.toggle('intro', wk <= 2);
}
function firstName() { return profile.name ? profile.name.trim().split(/\s+/)[0] : ''; }

/* ---------- Start ---------- */
function renderHome() {
  resetView();
  const today = todayISO();
  const h = new Date().getHours();
  const greet = h < 5 ? 'Dobrej nocy' : h < 12 ? 'Dzień dobry' : h < 18 ? 'Cześć' : 'Dobry wieczór';
  const name = firstName();
  let html = '<div class="hello fade-in"><h2>' + greet + (name ? ', ' + esc(name) : '') + '</h2><p class="date">' + fmtLong(today) + '</p></div>';

  if (isIntro()) html += '<div class="banner"><strong>Faza wprowadzająca (tydzień ' + cycleWeek() + '/2)</strong>Po 2 serie każdego ćwiczenia, lekki ciężar, uczysz się techniki. Od tygodnia 3 przechodzisz na 3 serie.</div>';
  if (isDeload()) html += '<div class="banner deload"><strong>Tydzień 8 — lżejszy tydzień</strong>2 serie, ciężar o 25% mniejszy. Ciało nadrabia i rośnie w siłę właśnie teraz. Potem nowy cykl.</div>';

  const nk = nextPlanKey(), np = PLANS[nk], draft = loadDraft(nk);
  const ls = lastSession();
  html += '<a class="nextcard ' + np.cls + ' fade-in" href="#/workout/' + nk + '">' +
    '<div class="k">' + (draft ? 'Trening w toku' : 'Następny trening') + '</div>' +
    '<div class="t">' + esc(np.name) + '</div>' +
    '<div class="s">' + esc(np.sub) + '</div>' +
    (draft ? '<span class="draftmark">Szkic zapisany — dokończ</span>' : '') +
    '<div class="go">' + (draft ? 'Kontynuuj' : 'Zaczynamy') + icon('back').replace('M15 5l-7 7 7 7', 'M9 5l7 7-7 7') + '</div>' +
    '</a>';
  if (ls) html += '<p class="mut small" style="margin:2px 4px 10px">Ostatnio: ' + esc(PLANS[ls.plan].name) + ', ' + fmtDate(ls.date) + '</p>';
  else html += '<p class="mut small" style="margin:2px 4px 10px">Pierwszy trening przed Tobą — zacznij od rozgrzewki, potem Trening A.</p>';

  const ws = weekStats(today);
  const stepsVal = ws.stepsToday != null ? ws.stepsToday : ws.stepsAvg;
  html += '<div class="card"><h3><span class="ic">' + icon('star') + '</span>Ten tydzień</h3><div class="rings">' +
    '<div class="ring' + (ws.workouts >= 3 ? ' ok' : '') + '">' + ringSVG(ws.workouts / 3) + '<div class="val">' + ws.workouts + '/3</div><div class="lbl">treningi</div></div>' +
    '<div class="ring' + (ws.cardio >= 2 ? ' ok' : '') + '">' + ringSVG(ws.cardio / 2) + '<div class="val">' + ws.cardio + '/2</div><div class="lbl">kardio</div></div>' +
    '<div class="ring' + (stepsVal != null && stepsVal >= settings.stepsGoal ? ' ok' : '') + '">' + ringSVG(stepsVal != null ? stepsVal / settings.stepsGoal : 0) + '<div class="val">' + (stepsVal != null ? (stepsVal >= 1000 ? (Math.round(stepsVal / 100) / 10).toString().replace('.', ',') + ' tys.' : stepsVal) : '—') + '</div><div class="lbl">' + (ws.stepsToday != null ? 'kroki dziś' : 'kroki (śr.)') + '</div></div>' +
    '</div></div>';

  const streak = weekStreak();
  html += '<div class="card"><div class="streakrow"><div class="big">' + streak + '</div><div class="txt"><strong>' + plural(streak, 'tydzień', 'tygodnie', 'tygodni') + ' z rzędu z treningiem</strong><br>' +
    (streak === 0 ? 'Każdy tydzień z jednym treningiem liczy się do serii. Dziś jest dobry dzień, żeby zacząć.' : sessions.length + ' ' + plural(sessions.length, 'trening', 'treningi', 'treningów') + ' łącznie. Przerwa nie zeruje Twojego postępu — po prostu wracamy.') + '</div></div></div>';

  const lm = lastDateOf(measures);
  if (!lm || daysBetween(lm, today) >= 7) {
    html += '<a class="card reminder" href="#/measure" style="display:flex;text-decoration:none;color:inherit"><span class="ic" style="width:40px;height:40px;border-radius:12px;background:var(--accent-soft);color:var(--accent);display:inline-flex;align-items:center;justify-content:center;flex:none">' + icon('ruler').replace('<svg', '<svg style="width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"') + '</span><div class="txt"><strong>' + (lm ? 'Minął tydzień od pomiarów' : 'Zapisz pierwsze pomiary') + '</strong><span class="mut">Rano, na czczo, ten sam dzień tygodnia — 2 minuty.</span></div></a>';
  }

  html += '<div class="tiles">' +
    '<a class="tile" href="#/warmup">' + icon('flame') + 'Rozgrzewka<span class="sub">ok. 10 min</span></a>' +
    '<a class="tile" href="#/cardio">' + icon('heart') + 'Kardio<span class="sub">' + ws.cardioMin + ' min w tym tyg.</span></a>' +
    '<a class="tile" href="#/history">' + icon('clock') + 'Historia<span class="sub">' + sessions.length + ' ' + plural(sessions.length, 'trening', 'treningi', 'treningów') + '</span></a>' +
    '</div>';
  html += '<p class="note-med">To ogólne wskazówki treningowe, nie porada medyczna.</p>';
  view.innerHTML = html;
}

/* ---------- Onboarding ---------- */
let onbStep = 0;
function renderOnboarding() {
  resetView();
  const dots = [0, 1, 2].map(function (i) { return '<i' + (i === onbStep ? ' class="on"' : '') + '></i>'; }).join('');
  const art = '<svg class="illu" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="62" fill="var(--accent-soft)"/><circle cx="75" cy="75" r="44" fill="none" stroke="var(--accent)" stroke-width="7" stroke-dasharray="200 80" stroke-linecap="round" transform="rotate(-90 75 75)"/><path d="M58 76l11 11 24-24" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  let html = '<div class="onb fade-in"><div class="dots">' + dots + '</div>';
  if (onbStep === 0) {
    html += art + '<h2 class="center">Cześć! Zbudujmy Twój dziennik</h2><p class="lead center">Trzy krótkie pytania, żeby apka mówiła do Ciebie po imieniu i policzyła Twoje kalorie. Możesz to pominąć.</p>' +
      '<label class="field"><span>Jak masz na imię?</span><input id="onName" type="text" autocomplete="given-name" placeholder="np. Paula" value="' + esc(profile.name) + '"></label>';
  } else if (onbStep === 1) {
    html += '<h2>Dane do kalkulatora</h2><p class="lead">Przydadzą się do policzenia, ile jeść. Wszystko zostaje w telefonie.</p>' +
      '<div class="grid3"><label class="field"><span>Wiek</span><input id="onAge" type="text" inputmode="numeric" placeholder="28" value="' + (profile.age || '') + '"></label>' +
      '<label class="field"><span>Wzrost (cm)</span><input id="onH" type="text" inputmode="decimal" placeholder="165" value="' + (profile.height || '') + '"></label>' +
      '<label class="field"><span>Waga (kg)</span><input id="onW" type="text" inputmode="decimal" placeholder="65" value="' + (profile.weight || '') + '"></label></div>' +
      '<div class="field"><span class="lbl">Aktywność na co dzień</span><div class="choice">' +
      '<label><input type="radio" name="onAct" value="1.2"' + (profile.activity === 1.2 ? ' checked' : '') + '><div>Siedząca<div class="d">biuro, mało ruchu poza treningami</div></div></label>' +
      '<label><input type="radio" name="onAct" value="1.375"' + (profile.activity === 1.375 ? ' checked' : '') + '><div>Lekko aktywna<div class="d">trochę chodzenia, 1–2 treningi</div></div></label>' +
      '<label><input type="radio" name="onAct" value="1.55"' + (profile.activity === 1.55 ? ' checked' : '') + '><div>Umiarkowanie aktywna<div class="d">3 treningi + 8–10 tys. kroków</div></div></label>' +
      '</div></div>';
  } else {
    html += '<h2>Jaki masz cel?</h2><p class="lead">Od tego zależy, jak duży deficyt policzy kalkulator.</p><div class="choice">' +
      '<label><input type="radio" name="onGoal" value="lose"' + (profile.goal === 'lose' ? ' checked' : '') + '><div>Schudnąć<div class="d">deficyt 15–20%, ok. 0,25–0,5 kg tygodniowo</div></div></label>' +
      '<label><input type="radio" name="onGoal" value="recomp"' + (profile.goal === 'recomp' ? ' checked' : '') + '><div>Jędrniej, rekompozycja<div class="d">mały deficyt ~10%, dużo białka</div></div></label>' +
      '<label><input type="radio" name="onGoal" value="build"' + (profile.goal === 'build' ? ' checked' : '') + '><div>Budować mięśnie<div class="d">lekka nadwyżka +5–10%</div></div></label>' +
      '</div>';
  }
  html += '<div class="actions"><button type="button" id="onNext" class="btn primary">' + (onbStep === 2 ? 'Gotowe — zaczynamy' : 'Dalej') + '</button>' +
    '<button type="button" id="onSkip" class="btn ghost">Pomiń</button></div></div>';
  view.innerHTML = html;
  if (onbStep === 0) { const i = document.getElementById('onName'); setTimeout(function () { i.focus(); }, 50); }

  function collect() {
    if (onbStep === 0) profile.name = document.getElementById('onName').value.trim().slice(0, 30);
    if (onbStep === 1) {
      profile.age = parseInt0(document.getElementById('onAge').value);
      profile.height = parseNum(document.getElementById('onH').value);
      profile.weight = parseNum(document.getElementById('onW').value);
      const a = document.querySelector('input[name="onAct"]:checked'); if (a) profile.activity = +a.value;
    }
    if (onbStep === 2) { const g = document.querySelector('input[name="onGoal"]:checked'); if (g) profile.goal = g.value; }
  }
  function finish() {
    profile.onboarded = true;
    saveKey('profile', profile);
    if (profile.weight && !measures.length) {
      measures.push({ id: uid(), date: todayISO(), ts: Date.now(), weight: profile.weight, waist: null, hips: null, thigh: null, arm: null, chest: null });
      saveKey('measures', measures);
    }
    onbStep = 0;
    location.hash = '#/home';
    toast(profile.name ? 'Miło Cię poznać, ' + profile.name + '!' : 'Gotowe — miłego treningu!');
  }
  view.addEventListener('click', function (e) {
    if (e.target.id === 'onNext') { collect(); if (onbStep < 2) { onbStep++; renderOnboarding(); } else finish(); }
    if (e.target.id === 'onSkip') { collect(); finish(); }
  });
  view.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); document.getElementById('onNext').click(); } });
}

/* ---------- Ekran treningu ---------- */
let currentPlan = null, elapsedInt = null;

function exCardHTML(slotId, idx, plan, draft) {
  const exId = activeExId(slotId), ex = EX[exId], main = EX[slotId];
  const isAlt = exId !== slotId;
  const lr = lastResult(ex.id);
  const deload = isDeload();
  const prog = deload ? null : progressionFor(ex);
  const dEx = draft && draft.ex[ex.id] ? draft.ex[ex.id] : null;
  const wVal = dEx ? dEx.w : '';
  const nSets = targetSets(ex);
  const unit = ex.unit === 's' ? 's' : 'powt.';
  const note = notes[ex.id] || '';

  let html = '<article class="excard card ' + plan.cls + '" data-ex="' + ex.id + '" data-slot="' + slotId + '">';
  html += '<div class="exhead"><div class="exillu">' + SV.thumb(ILLU[ex.id][1]) + '</div><div><div class="exnum">Ćwiczenie ' + (idx + 1) + (isAlt ? '<span class="altmark">alternatywa</span>' : '') + '</div><h3>' + esc(ex.name) + '</h3></div></div>';
  html += '<p class="extarget">' + nSets + ' × ' + esc(ex.repsLabel) + (ex.unit === 's' ? '' : ' powt.') + ' · przerwa ' + esc(ex.rest) + (nSets < ex.sets ? ' · <strong>' + (deload ? 'lżejszy tydzień' : 'faza wprowadzająca') + '</strong>' : '') + '</p>';
  html += '<p class="exlast">' + esc(fmtLast(lr, ex)) + '</p>';
  html += '<div class="note' + (note ? ' has' : '') + '" data-ex="' + ex.id + '">' +
    '<button type="button" class="notepreview">' + icon('note') + '<span class="txt">' + (note ? esc(note) : 'Dodaj notatkę (np. ustawienie siedziska)') + '</span></button>' +
    '<div class="notebox"><textarea class="noteedit" rows="3" placeholder="Np. siedzisko na 4, uchwyt szeroki, jak się czułaś…">' + esc(note) + '</textarea>' +
    '<div class="noterow"><button type="button" class="notedone btn sm soft">Gotowe</button></div></div></div>';
  html += '<div class="restctl"><span class="restlbl">Timer przerwy</span>' +
    '<button type="button" class="restminus" aria-label="Skróć przerwę o 15 sekund">−</button><span class="restval">' + fmtRest(restForEx(ex)) + '</span>' +
    '<button type="button" class="restplus" aria-label="Wydłuż przerwę o 15 sekund">+</button></div>';
  if (prog && prog.kind === 'weight') {
    html += ex.assist
      ? '<span class="badge">' + icon('up') + 'Progres: zmniejsz asystę ' + fmtNum(prog.from) + ' → ' + fmtNum(prog.to) + ' kg</span>'
      : '<span class="badge">' + icon('up') + 'Progres: dołóż +' + fmtNum(prog.inc) + ' kg → ' + fmtNum(prog.to) + ' kg</span>';
  } else if (prog && prog.kind === 'harder') {
    html += '<span class="badge">' + icon('up') + 'Wszystkie serie na maksimum — czas na trudniejszą wersję</span>';
  }
  if (deload && lr && lr.weight != null && !ex.noWeight) {
    html += '<span class="badge deload">Lżej: ' + nSets + ' serie, ok. ' + fmtNum(roundToStep(lr.weight * 0.75, ex.step)) + ' kg</span>';
  }
  if (!ex.noWeight) {
    html += '<div class="wrow"><button type="button" class="step minus" aria-label="Odejmij ' + fmtNum(ex.step) + ' kg">−</button>' +
      '<input class="w" type="text" inputmode="decimal" autocomplete="off" placeholder="kg" value="' + esc(wVal) + '" aria-label="Ciężar w kilogramach">' +
      '<button type="button" class="step plus" aria-label="Dodaj ' + fmtNum(ex.step) + ' kg">+</button><span class="unit">kg</span></div>';
  }
  if (lr) {
    const lw = !ex.noWeight && lr.weight != null ? fmtNum(lr.weight) + ' kg' : '';
    const lreps = lr.reps.filter(function (r) { return r > 0; }).join('/');
    html += '<div class="copyrow"><button type="button" class="copylast">Powtórz ostatnie (' + esc(lw) + (lw && lreps ? ' × ' : '') + esc(lreps) + (ex.unit === 's' ? ' s' : '') + ')</button></div>';
  }
  html += '<div class="sets" style="--n:' + nSets + '">';
  for (let i = 0; i < nSets; i++) {
    const rVal = dEx && dEx.reps[i] != null ? dEx.reps[i] : '';
    const checked = dEx && dEx.done[i] ? ' checked' : '';
    html += '<div class="setcol"><span class="slabel">Seria ' + (i + 1) + '</span>' +
      '<input type="checkbox" class="done"' + checked + ' aria-label="Seria ' + (i + 1) + ' wykonana">' +
      '<input class="reps" type="text" inputmode="numeric" autocomplete="off" placeholder="' + unit + '" value="' + esc(rVal) + '" aria-label="' + (ex.unit === 's' ? 'Sekundy' : 'Powtórzenia') + ' w serii ' + (i + 1) + '"></div>';
  }
  html += '</div>';
  html += '<div class="exactions"><a class="btn soft" href="#/ex/' + ex.id + '?back=workout/' + plan.key + '">' + icon('info') + 'Jak wykonać</a>' +
    (main.alt ? '<button type="button" class="btn swap">' + icon('swap') + (isAlt ? 'Wróć do głównego' : 'Zamień na alternatywę') + '</button>' : '<span></span>') + '</div>';
  return html + '</article>';
}

function renderWorkout(planKey) {
  const p = PLANS[planKey];
  if (!p) { location.hash = '#/home'; return; }
  resetView();
  currentPlan = planKey;
  const draft = loadDraft(planKey);
  workoutOpenedAt = draft && draft.startedAt ? draft.startedAt : Date.now();

  let html = '<a class="backlink" href="#/home">' + icon('back').replace('<svg', '<svg style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"') + 'Start</a>';
  html += '<div class="planhead row between"><div><h2>' + esc(p.name) + '</h2><div class="sub">' + esc(p.sub) + '</div></div><div class="elapsed" id="elapsed">0:00</div></div>';
  if (isIntro()) html += '<div class="banner"><strong>Faza wprowadzająca</strong>2 serie każdego ćwiczenia, lekki ciężar. Celem jest technika, nie zmęczenie.</div>';
  if (isDeload()) html += '<div class="banner deload"><strong>Lżejszy tydzień (8/8)</strong>2 serie, ciężar −25%. Zostaw sobie dużo zapasu.</div>';
  html += '<p class="mut small" style="margin:0 2px 10px">Kończ serie z zapasem 2–3 powtórzeń — czyli tak, żebyś dała radę zrobić jeszcze 2–3, ale nie robisz. <a href="#/learn">Dlaczego?</a></p>';

  p.slots.forEach(function (slotId, idx) { html += exCardHTML(slotId, idx, p, draft); });
  html += '<div class="finishbar"><button type="button" id="finish" class="btn primary ' + p.cls + '">Zakończ trening</button>' +
    '<button type="button" id="discard" class="btn ghost">Odrzuć szkic</button></div>';
  view.innerHTML = html;

  view.addEventListener('input', workoutInput);
  view.addEventListener('change', workoutChange);
  view.addEventListener('click', workoutClick);
  clearInterval(elapsedInt);
  const tickElapsed = function () { const el = document.getElementById('elapsed'); if (el) el.textContent = fmtDur(Math.max(0, Math.floor((Date.now() - workoutOpenedAt) / 1000))); };
  tickElapsed();
  elapsedInt = setInterval(tickElapsed, 1000);
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
  noteEl.classList.toggle('has', !!val);
  noteEl.querySelector('.notepreview .txt').textContent = val || 'Dodaj notatkę (np. ustawienie siedziska)';
}
function workoutChange(e) {
  if (!e.target.matches('input.done')) return;
  const card = e.target.closest('.excard');
  const ex = EX[card.dataset.ex];
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
    buzz(30);
    const rest = restForEx(ex);
    if (rest > 0) startRestTimer(rest, ex.short);
  }
  saveDraftFromDOM(currentPlan);
}
function workoutClick(e) {
  const stepBtn = e.target.closest('.step');
  if (stepBtn) {
    const card = stepBtn.closest('.excard');
    const ex = EX[card.dataset.ex];
    const input = card.querySelector('input.w');
    let w = parseNum(input.value);
    const lr = lastResult(ex.id);
    if (w == null && lr && lr.weight != null) w = lr.weight;
    else w = (w == null ? 0 : w) + (stepBtn.classList.contains('plus') ? ex.step : -ex.step);
    if (w < 0) w = 0;
    input.value = fmtNum(w);
    saveDraftFromDOM(currentPlan);
    return;
  }
  const notePrev = e.target.closest('.notepreview');
  if (notePrev) {
    const noteEl = notePrev.closest('.note');
    noteEl.classList.add('open');
    const ta = noteEl.querySelector('.noteedit'); ta.focus();
    const v = ta.value; ta.value = ''; ta.value = v;
    return;
  }
  if (e.target.closest('.notedone')) {
    const noteEl = e.target.closest('.note');
    saveNoteFromEl(noteEl); refreshNotePreview(noteEl); noteEl.classList.remove('open');
    return;
  }
  const restBtn = e.target.closest('.restminus, .restplus');
  if (restBtn) {
    const card = restBtn.closest('.excard');
    const ex = EX[card.dataset.ex];
    let cur = restForEx(ex) + (restBtn.classList.contains('restplus') ? REST_STEP : -REST_STEP);
    cur = Math.max(0, Math.min(REST_MAX, cur));
    settings.rest[ex.id] = cur; saveKey('settings', settings);
    card.querySelector('.restval').textContent = fmtRest(cur);
    return;
  }
  const copyBtn = e.target.closest('.copylast');
  if (copyBtn) {
    const card = copyBtn.closest('.excard');
    const lr = lastResult(card.dataset.ex);
    if (!lr) return;
    const wEl = card.querySelector('input.w');
    if (wEl) wEl.value = lr.weight != null ? fmtNum(lr.weight) : '';
    card.querySelectorAll('input.reps').forEach(function (inp, i) { inp.value = (typeof lr.reps[i] === 'number' && lr.reps[i] > 0) ? lr.reps[i] : ''; });
    saveDraftFromDOM(currentPlan);
    toast('Skopiowano ostatni wynik');
    return;
  }
  const swapBtn = e.target.closest('.swap');
  if (swapBtn) {
    const card = swapBtn.closest('.excard');
    const slot = card.dataset.slot;
    saveDraftFromDOM(currentPlan);
    settings.alt[slot] = !settings.alt[slot];
    saveKey('settings', settings);
    const y = window.scrollY;
    renderWorkout(currentPlan);
    window.scrollTo(0, y);
    toast(settings.alt[slot] ? 'Zamieniono na alternatywę' : 'Wróciłaś do głównego ćwiczenia');
    return;
  }
  if (e.target.id === 'finish') { finishWorkout(); return; }
  if (e.target.id === 'discard') {
    if (confirm('Odrzucić wpisane dane tego treningu?')) { dropKey(draftKey(currentPlan)); renderWorkout(currentPlan); toast('Szkic odrzucony'); }
  }
}
function finishWorkout() {
  const plan = currentPlan;
  const entries = [];
  document.querySelectorAll('.excard').forEach(function (card) {
    const id = card.dataset.ex;
    const wEl = card.querySelector('input.w');
    const w = wEl ? parseNum(wEl.value) : null;
    const reps = Array.prototype.map.call(card.querySelectorAll('input.reps'), function (i) { return parseInt0(i.value); });
    const done = Array.prototype.map.call(card.querySelectorAll('input.done'), function (i) { return i.checked; });
    const hasReps = reps.some(function (r) { return r != null && r > 0; });
    if (w != null || hasReps || done.some(Boolean)) entries.push({ id: id, slot: card.dataset.slot, weight: w, reps: reps.map(function (r) { return r == null ? 0 : r; }), done: done });
  });
  if (!entries.length) { toast('Wpisz najpierw jakiś wynik'); return; }
  const now = Date.now();
  const s = { id: uid(), plan: plan, date: todayISO(), ts: now, week: cycleWeek(), deload: isDeload(), intro: isIntro(), dur: Math.round((now - workoutOpenedAt) / 1000), exercises: entries };
  sessions.push(s);
  sessions.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.ts || 0) - (b.ts || 0); });
  saveKey('sessions', sessions);
  dropKey(draftKey(plan));
  stopRestTimer();
  buzz([60, 40, 60]);
  location.hash = '#/done/' + s.id;
}

/* ---------- Podsumowanie treningu ---------- */
function renderDone(id) {
  const s = sessions.filter(function (x) { return x.id === id; })[0];
  if (!s) { location.hash = '#/home'; return; }
  resetView();
  let setsDone = 0, volume = 0;
  const prs = [];
  s.exercises.forEach(function (e) {
    const ex = EX[e.id]; if (!ex) return;
    const reps = (e.reps || []).filter(function (r) { return r > 0; });
    setsDone += Math.max(reps.length, (e.done || []).filter(Boolean).length);
    if (typeof e.weight === 'number') volume += e.weight * reps.reduce(function (a, b) { return a + b; }, 0);
    const best = bestBefore(e.id, s.ts);
    if (!ex.noWeight && typeof e.weight === 'number' && e.weight > 0) {
      if (best.weight == null) prs.push(esc(ex.short) + ': pierwszy zapis — ' + fmtNum(e.weight) + ' kg');
      else if (!ex.assist && e.weight > best.weight) prs.push(esc(ex.short) + ': nowy rekord ' + fmtNum(e.weight) + ' kg (było ' + fmtNum(best.weight) + ')');
      else if (ex.assist && e.weight < best.weight) prs.push(esc(ex.short) + ': mniej asysty — ' + fmtNum(e.weight) + ' kg');
    } else if (ex.noWeight && reps.length) {
      const mx = Math.max.apply(null, reps);
      if (best.reps > 0 && mx > best.reps) prs.push(esc(ex.short) + ': nowy rekord ' + mx + (ex.unit === 's' ? ' s' : ' powt.') + ' (było ' + best.reps + ')');
    }
  });
  const phrases = ['Zrobiłaś to.', 'Kolejny trening w kieszeni.', 'Tak wygląda konsekwencja.', 'Ciało Ci podziękuje.'];
  const name = firstName();
  let html = '<div class="donewrap"><svg class="ringck" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54"/><path d="M38 62l14 14 30-32"/></svg>' +
    '<h2>Brawo' + (name ? ', ' + esc(name) : '') + '!</h2><p class="mut">' + phrases[s.ts % phrases.length] + ' ' + esc(PLANS[s.plan].name) + ' zapisany.</p></div>';
  html += '<div class="stats"><div class="stat"><div class="v">' + fmtDur(s.dur || 0) + '</div><div class="l">czas</div></div>' +
    '<div class="stat"><div class="v">' + setsDone + '</div><div class="l">' + plural(setsDone, 'seria', 'serie', 'serii') + '</div></div>' +
    '<div class="stat"><div class="v">' + s.exercises.length + '</div><div class="l">' + plural(s.exercises.length, 'ćwiczenie', 'ćwiczenia', 'ćwiczeń') + '</div></div></div>';
  if (volume > 0) html += '<p class="center mut small">Łącznie podniosłaś ok. <strong>' + fmtNum(Math.round(volume)) + ' kg</strong>.</p>';
  if (prs.length) html += '<div class="card"><h3><span class="ic">' + icon('star') + '</span>Rekordy</h3><ul class="prlist">' + prs.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul></div>';
  const ws = weekStats(s.date);
  html += '<div class="card tint"><strong>Ten tydzień: ' + ws.workouts + '/3 ' + plural(ws.workouts, 'trening', 'treningi', 'treningów') + '.</strong> ' + (ws.workouts >= 3 ? 'Plan tygodnia zrobiony — reszta to regeneracja i spacery.' : 'Następny: ' + PLANS[s.plan === 'A' ? 'B' : 'A'].name + ', najlepiej po dniu przerwy.') + '</div>';
  html += '<div class="stack" style="margin-top:14px"><a class="btn primary" href="#/home">Wróć na start</a><a class="btn ghost" href="#/cardio">Dodaj 10–15 min kardio po treningu</a></div>';
  view.innerHTML = html;
}

/* ---------- Instrukcja ćwiczenia ---------- */
function renderExercise(idWithQuery) {
  const parts = String(idWithQuery || '').split('?');
  const ex = EX[parts[0]];
  if (!ex) { location.hash = '#/home'; return; }
  const q = parts[1] || '';
  const m = /back=([^&]+)/.exec(q);
  const back = m ? decodeURIComponent(m[1]) : (ex.warm ? 'warmup' : 'home');
  resetView();
  let html = '<a class="backlink" href="#/' + esc(back) + '">' + icon('back').replace('<svg', '<svg style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"') + 'Wróć</a>';
  html += '<div class="instr fade-in"><h2>' + esc(ex.name) + '</h2>';
  if (!ex.warm) html += '<p class="lead">' + ex.sets + ' serie × ' + esc(ex.repsLabel) + (ex.unit === 's' ? '' : ' powt.') + ' · przerwa ' + esc(ex.rest) + '</p>';
  else if (ex.dose) html += '<p class="lead">' + esc(ex.dose) + '</p>';
  html += '<div class="illu">' + SV.mv(ILLU[ex.id][0], ILLU[ex.id][1]) + '<div class="cap"><span>pozycja startowa</span><span>pozycja końcowa</span></div></div>';
  html += '<div class="card"><h3><span class="ic">' + icon('heart') + '</span>Jakie mięśnie pracują</h3><div class="muscles">' + bodySVG(ex.primary, ex.secondary) +
    '<div><div class="chips">' + ex.primary.map(function (k) { return '<span>' + MUSCLE_NAMES[k] + '</span>'; }).join('') + ex.secondary.map(function (k) { return '<span class="sec">' + MUSCLE_NAMES[k] + '</span>'; }).join('') + '</div><p class="small" style="margin-top:8px">' + esc(ex.musclesText) + '</p></div></div></div>';
  html += '<div class="card"><h3><span class="ic">' + icon('settings') + '</span>Jak znaleźć i ustawić sprzęt</h3><p>' + esc(ex.setup) + '</p></div>';
  html += '<div class="card"><h3><span class="ic">' + icon('check') + '</span>Krok po kroku</h3><ol>' + ex.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>';
  html += '<div class="card"><h3><span class="ic">' + icon('info') + '</span>Najczęstsze błędy</h3>' + ex.mistakes.map(function (mm) { return '<div class="mistake"><span class="x">✕</span><div><div>' + esc(mm.e) + '</div><div class="fix">' + esc(mm.fix) + '</div></div></div>'; }).join('') + '</div>';
  html += '<div class="cue">„' + esc(ex.cue) + '”</div>';
  html += '<div class="card" style="margin-top:12px"><h3><span class="ic">' + icon('star') + '</span>Ciężar na start</h3><div class="weight"><div class="big">' + esc(ex.start.big) + '</div><div class="small">' + esc(ex.start.txt || 'Pierwsze serie zawsze lekko — najpierw technika, potem kilogramy.') + '</div></div></div>';
  html += '<a class="btn wide soft" href="' + esc(ex.video) + '" target="_blank" rel="noopener noreferrer">' + icon('play') + 'Zobacz filmy z techniką (YouTube)' + icon('ext') + '</a>';
  html += '<p class="mut small center" style="margin-top:6px">Otwiera wyszukiwarkę YouTube w nowej karcie — wymaga internetu.</p>';
  if (ex.alt) html += '<div class="card flat" style="margin-top:12px"><strong>Brak sprzętu albo za trudne?</strong><br><a href="#/ex/' + ex.alt + '?back=' + encodeURIComponent(back) + '">Zobacz alternatywę: ' + esc(EX[ex.alt].name) + '</a></div>';
  html += '</div>';
  view.innerHTML = html;
}

/* ---------- Rozgrzewka ---------- */
let guideInt = null, guideEnd = 0, guideOver = false;
function renderWarmup(sub, n) {
  resetView();
  clearInterval(guideInt);
  if (sub === 'go') { renderGuided(parseInt(n, 10) || 0); return; }
  const total = WARMUP.reduce(function (a, id) { return a + EX[id].dur; }, 0);
  let html = '<h2>Rozgrzewka</h2><p class="lead">Ok. ' + Math.round(total / 60) + ' minut przed każdym treningiem. Rozgrzane mięśnie pracują lepiej i są bezpieczniejsze — to nie jest opcjonalne.</p>';
  html += '<a class="btn primary" href="#/warmup/go/0">' + icon('play') + 'Start — tryb prowadzony</a>';
  html += '<div class="stack" style="margin-top:12px">';
  WARMUP.forEach(function (id, i) {
    const ex = EX[id];
    html += '<div class="card wstep"><div class="exillu">' + SV.thumb(ILLU[id][1]) + '</div><div><h3>' + (i + 1) + '. ' + esc(ex.short) + '</h3><div class="dose">' + esc(ex.dose) + '</div></div><a class="more" href="#/ex/' + id + '?back=warmup">Jak?</a></div>';
  });
  html += '</div>';
  html += '<div class="card tint" style="margin-top:12px"><strong>Po rozgrzewce</strong><br>Pierwsze ćwiczenie z planu zacznij od 1 serii wprowadzającej na ok. połowie ciężaru. W gorszy dzień skróć rozgrzewkę do kardio + mostków + przysiadów.</div>';
  view.innerHTML = html;
}
function renderGuided(n) {
  const ids = WARMUP;
  if (n >= ids.length) {
    const nk = nextPlanKey();
    view.innerHTML = '<div class="donewrap"><svg class="ringck" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54"/><path d="M38 62l14 14 30-32"/></svg><h2>Rozgrzana!</h2><p class="mut">Ciało gotowe. Teraz czas na trening.</p></div>' +
      '<div class="stack"><a class="btn primary" href="#/workout/' + nk + '">Przejdź do: ' + esc(PLANS[nk].name) + '</a><a class="btn ghost" href="#/warmup">Wróć do listy</a></div>';
    return;
  }
  const ex = EX[ids[n]];
  let html = '<div class="guided fade-in"><div class="prog">' + ids.map(function (_, i) { return '<i class="' + (i < n ? 'past' : i === n ? 'on' : '') + '"></i>'; }).join('') + '</div>';
  html += '<div class="mut small">Krok ' + (n + 1) + ' z ' + ids.length + '</div>';
  html += '<div class="bigtime" id="gtime">' + fmtDur(ex.dur) + '</div>';
  html += '<div class="stepname">' + esc(ex.short) + '</div><div class="dose">' + esc(ex.dose) + '</div>';
  html += '<div class="exillu">' + SV.thumb(ILLU[ex.id][1]) + '</div>';
  html += '<div class="ctrls"><a class="btn" href="#/warmup/go/' + (n - 1) + '"' + (n === 0 ? ' style="visibility:hidden"' : '') + '>Wstecz</a><a class="btn primary" href="#/warmup/go/' + (n + 1) + '">' + (n === ids.length - 1 ? 'Gotowe' : 'Dalej') + '</a></div>';
  html += '<div class="card instr-box"><ol style="margin:0;padding-left:20px">' + ex.steps.map(function (s) { return '<li style="margin:5px 0">' + esc(s) + '</li>'; }).join('') + '</ol><p class="mut small" style="margin:8px 0 0">„' + esc(ex.cue) + '” · <a href="#/ex/' + ex.id + '?back=' + encodeURIComponent('warmup/go/' + n) + '">pełna instrukcja</a></p></div>';
  html += '<a class="btn ghost wide" href="#/warmup">Przerwij rozgrzewkę</a></div>';
  view.innerHTML = html;
  guideEnd = Date.now() + ex.dur * 1000; guideOver = false;
  const tick = function () {
    const el = document.getElementById('gtime'); if (!el) { clearInterval(guideInt); return; }
    const left = Math.ceil((guideEnd - Date.now()) / 1000);
    if (left <= 0) {
      el.textContent = '0:00'; el.classList.add('over');
      if (!guideOver) { guideOver = true; beep(); buzz([300, 100, 300]); }
      return;
    }
    el.textContent = fmtDur(left);
  };
  tick();
  guideInt = setInterval(tick, 250);
}

/* =========================================================
   Router
   ========================================================= */
function router() {
  stopRestTimer();
  clearInterval(elapsedInt); clearInterval(guideInt);
  const hash = (location.hash || '#/home').replace(/^#\//, '');
  const parts = hash.split('/');
  const route = parts[0] || 'home';
  updateWeekChip();
  const navMap = { home: 'home', workout: 'home', done: 'home', warmup: 'warmup', cardio: 'cardio', measure: 'progress', photos: 'progress', history: 'progress', learn: 'learn', settings: 'settings' };
  document.querySelectorAll('.bottomnav a').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === navMap[route]); });
  if (!profile.onboarded && route !== 'welcome') { location.hash = '#/welcome'; return; }
  switch (route) {
    case 'welcome': renderOnboarding(); break;
    case 'workout': renderWorkout(parts[1]); break;
    case 'done': renderDone(parts[1]); break;
    case 'ex': renderExercise(parts.slice(1).join('/')); break;
    case 'warmup': renderWarmup(parts[1], parts[2]); break;
    case 'cardio': renderCardio(); break;
    case 'measure': renderProgress('measure'); break;
    case 'photos': renderProgress('photos', parts[1]); break;
    case 'history': renderProgress('history', parts[1]); break;
    case 'learn': renderLearn(parts[1]); break;
    case 'settings': renderSettings(); break;
    default: renderHome();
  }
  window.scrollTo(0, 0);
}
function init() {
  applyTheme();
  window.addEventListener('hashchange', router);
  document.getElementById('timerstop').addEventListener('click', stopRestTimer);
  router();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
}
document.addEventListener('DOMContentLoaded', init);
