'use strict';

/* =========================================================
   Kardio
   ========================================================= */
const CARDIO_TYPES = [['walk', 'Marsz z nachyleniem'], ['elliptical', 'Orbitrek'], ['bike', 'Rower'], ['outdoor', 'Spacer / marsz na zewnątrz'], ['other', 'Inne']];
function cardioTypeName(t) { const f = CARDIO_TYPES.filter(function (x) { return x[0] === t; })[0]; return f ? f[1] : 'Kardio'; }

function renderCardio() {
  resetView();
  const today = todayISO();
  const ws = weekStats(today);
  const goalMin = 60;
  let html = '<h2>Kardio i kroki</h2>';
  html += '<div class="card"><h3><span class="ic">' + icon('heart') + '</span>Ten tydzień</h3>' +
    '<div class="weekbar"><div class="track"><div class="fill" style="width:' + Math.min(100, Math.round(ws.cardioMin / goalMin * 100)) + '%"></div></div>' +
    '<div class="lbls"><span><strong>' + ws.cardioMin + ' min</strong> z ok. 40–60</span><span>' + ws.cardio + '/2 ' + plural(ws.cardio, 'sesja', 'sesje', 'sesji') + '</span></div></div>' +
    '<div class="kpi" style="margin-top:10px"><div><div class="v">' + (ws.stepsToday != null ? ws.stepsToday.toLocaleString('pl-PL') : '—') + '</div><div class="l">kroki dziś</div></div><div><div class="v">' + (ws.stepsAvg != null ? ws.stepsAvg.toLocaleString('pl-PL') : '—') + '</div><div class="l">średnio w tygodniu (cel ' + settings.stepsGoal.toLocaleString('pl-PL') + ')</div></div></div></div>';

  html += '<div class="card"><h3><span class="ic">' + icon('walk') + '</span>Kroki dziś</h3><div class="row"><input id="stepsIn" type="text" inputmode="numeric" placeholder="np. 8500" value="' + (steps[today] != null ? steps[today] : '') + '" aria-label="Liczba kroków dziś"><button type="button" id="stepsSave" class="btn soft">Zapisz</button></div>' +
    '<p class="mut small" style="margin:8px 0 0">Liczbę kroków znajdziesz w aplikacji Zdrowie (iPhone) lub Google Fit / Samsung Health. Cel: 8 000–10 000 dziennie — to daje więcej niż ciężkie kardio.</p></div>';

  html += '<div class="card"><h3><span class="ic">' + icon('play') + '</span>Zapisz sesję kardio</h3>' +
    '<label class="field"><span>Data</span><input id="cdate" type="date" value="' + today + '"></label>' +
    '<label class="field"><span>Rodzaj</span><select id="ctype">' + CARDIO_TYPES.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + '</option>'; }).join('') + '</select></label>' +
    '<div class="grid2"><label class="field"><span>Czas (min)</span><input id="cmin" type="text" inputmode="decimal" placeholder="np. 25"></label>' +
    '<label class="field"><span>Dystans (km, opcjonalnie)</span><input id="ckm" type="text" inputmode="decimal" placeholder="np. 2,5"></label></div>' +
    '<label class="field"><span>Średnie tętno (opcjonalnie)</span><input id="chr" type="text" inputmode="numeric" placeholder="np. 125"></label>' +
    '<div class="field"><span class="lbl">Samopoczucie (1 = ciężko, 5 = super)</span><div class="seg" id="cfeel">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-f="' + n + '"' + (n === 4 ? ' class="on"' : '') + '>' + n + '</button>'; }).join('') + '</div></div>' +
    '<p class="pacebox" id="cpace">Tempo: <strong>—</strong></p>' +
    '<button type="button" id="csave" class="btn primary">Zapisz kardio</button></div>';

  html += '<details class="acc"><summary><span class="n">?</span>Ile i jakie kardio</summary><div class="body"><ul>' +
    '<li><strong>2 sesje w tygodniu po 20–30 min</strong> w spokojnym tempie — takim, przy którym możesz swobodnie rozmawiać.</li>' +
    '<li>Marsz z nachyleniem na bieżni, orbitrek, rower, spacer na zewnątrz — co lubisz.</li>' +
    '<li>W dni bez siłowni albo 10–15 min zaraz po treningu siłowym.</li>' +
    '<li><strong>8 000–10 000 kroków dziennie</strong> — to najważniejsze „kardio”.</li>' +
    '<li>Bez interwałów przez pierwsze 8 tygodni — najpierw baza.</li></ul></div></details>';

  html += '<h2>Historia kardio</h2>';
  html += cardio.length ? '<ul class="list">' + cardio.slice().reverse().map(function (r) {
    return '<li><div class="li-main"><div>' + esc(cardioTypeName(r.type)) + ' · ' + fmtNum(r.min) + ' min' + (r.km ? ' · ' + fmtNum(r.km) + ' km' : '') + (r.hr ? ' · ' + r.hr + ' ud./min' : '') + (r.feel ? ' · ' + r.feel + '/5' : '') + '</div><div class="li-date">' + fmtDate(r.date) + '</div></div>' +
      '<button type="button" class="del" data-c="' + r.id + '" aria-label="Usuń sesję">✕</button></li>';
  }).join('') + '</ul>' : emptyState('Jeszcze nic tu nie ma. Pierwszy spacer po treningu? Zapisz go wyżej.');
  view.innerHTML = html;

  let feel = 4;
  function updPace() {
    const m = parseNum(document.getElementById('cmin').value), km = parseNum(document.getElementById('ckm').value);
    document.getElementById('cpace').innerHTML = 'Tempo: <strong>' + (m && km ? fmtPace(m / km) + ' min/km' : '—') + '</strong>';
  }
  view.addEventListener('input', function (e) { if (e.target.id === 'cmin' || e.target.id === 'ckm') updPace(); });
  view.addEventListener('click', function (e) {
    const fb = e.target.closest('#cfeel button');
    if (fb) { feel = +fb.dataset.f; document.querySelectorAll('#cfeel button').forEach(function (b) { b.classList.toggle('on', b === fb); }); return; }
    if (e.target.id === 'stepsSave') {
      const n = parseInt0(document.getElementById('stepsIn').value);
      if (n == null) { delete steps[today]; } else steps[today] = n;
      saveKey('steps', steps); toast(n != null && n >= settings.stepsGoal ? 'Cel kroków zrobiony!' : 'Kroki zapisane');
      renderCardio(); return;
    }
    if (e.target.id === 'csave') {
      const m = parseNum(document.getElementById('cmin').value);
      if (!m) { toast('Podaj czas w minutach'); return; }
      cardio.push({ id: uid(), date: document.getElementById('cdate').value || today, type: document.getElementById('ctype').value, min: m, km: parseNum(document.getElementById('ckm').value), hr: parseInt0(document.getElementById('chr').value), feel: feel });
      cardio.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      saveKey('cardio', cardio); toast('Kardio zapisane'); renderCardio(); return;
    }
    const del = e.target.closest('.del');
    if (del && del.dataset.c && confirm('Usunąć tę sesję kardio?')) {
      cardio = cardio.filter(function (r) { return r.id !== del.dataset.c; });
      saveKey('cardio', cardio); renderCardio();
    }
  });
}
function fmtPace(minPerKm) {
  if (!isFinite(minPerKm) || minPerKm <= 0) return '—';
  let m = Math.floor(minPerKm), s = Math.round((minPerKm - m) * 60);
  if (s === 60) { m++; s = 0; }
  return m + ':' + pad2(s);
}

/* =========================================================
   Postępy: pomiary / zdjęcia / historia
   ========================================================= */
const BODY_METRICS = [
  { key: 'weight', label: 'Waga', unit: 'kg', ph: 'np. 64,5', color: '#6d2a57', how: 'rano, po toalecie, przed jedzeniem' },
  { key: 'waist', label: 'Talia', unit: 'cm', ph: 'np. 74', color: '#8a3a4c', how: 'najwęższe miejsce, zwykle nad pępkiem' },
  { key: 'hips', label: 'Biodra', unit: 'cm', ph: 'np. 98', color: '#4f8a5b', how: 'najszersze miejsce pośladków' },
  { key: 'thigh', label: 'Udo', unit: 'cm', ph: 'np. 56', color: '#a8641f', how: 'połowa długości uda, zawsze ta sama noga' },
  { key: 'arm', label: 'Ramię', unit: 'cm', ph: 'np. 27', color: '#3f6f8e', how: 'połowa długości, ręka luźno' },
  { key: 'chest', label: 'Klatka', unit: 'cm', ph: 'np. 88', color: '#7a5aa0', how: 'na wysokości biustu, po wydechu' }
];
function subtabsHTML(on) {
  return '<div class="subtabs"><a href="#/measure"' + (on === 'measure' ? ' class="on"' : '') + '>Pomiary</a><a href="#/photos"' + (on === 'photos' ? ' class="on"' : '') + '>Zdjęcia</a><a href="#/history"' + (on === 'history' ? ' class="on"' : '') + '>Historia</a></div>';
}
function renderProgress(tab, arg) {
  resetView();
  if (tab === 'photos') { renderPhotos(arg); return; }
  if (tab === 'history') { renderHistory(arg); return; }
  renderMeasure();
}

function sortedMeasures() {
  return measures.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.ts || 0) - (b.ts || 0); });
}
function renderMeasure() {
  let html = '<h2>Postępy</h2>' + subtabsHTML('measure');
  html += '<div class="card"><h3><span class="ic">' + icon('ruler') + '</span>Nowy pomiar</h3>' +
    '<label class="field"><span>Data</span><input id="mdate" type="date" value="' + todayISO() + '"></label><div class="grid2">';
  BODY_METRICS.forEach(function (m) {
    html += '<label class="field"><span>' + m.label + ' (' + m.unit + ')</span><input id="m_' + m.key + '" type="text" inputmode="decimal" autocomplete="off" placeholder="' + m.ph + '"></label>';
  });
  html += '</div><p class="mut small">Raz w tygodniu, rano na czczo, ten sam dzień. Wypełnij tylko to, co dziś mierzysz.</p>' +
    '<button type="button" id="msave" class="btn primary">Zapisz pomiar</button></div>';

  const sorted = sortedMeasures();
  if (sorted.length >= 2) {
    const last = sorted[sorted.length - 1], prev = sorted[sorted.length - 2], first = sorted[0];
    const p1 = [], p2 = [];
    BODY_METRICS.forEach(function (m) {
      if (last[m.key] != null && prev[m.key] != null) p1.push(deltaTxt(m.label, last[m.key], prev[m.key], m.unit));
      const firstVal = sorted.filter(function (e) { return e[m.key] != null; })[0];
      if (last[m.key] != null && firstVal && firstVal !== last) p2.push(deltaTxt(m.label, last[m.key], firstVal[m.key], m.unit));
    });
    html += '<div class="card"><h3><span class="ic">' + icon('star') + '</span>Zmiany</h3>';
    if (p1.length) html += '<div class="delta"><div class="mut small">Od poprzedniego pomiaru (' + fmtDate(prev.date) + ' → ' + fmtDate(last.date) + ')</div><div class="row2">' + p1.join('') + '</div></div>';
    if (p2.length) html += '<div class="delta"><div class="mut small">Od startu (' + fmtDate(first.date) + ')</div><div class="row2">' + p2.join('') + '</div></div>';
    html += '</div>';
  }
  html += '<div class="banner info"><strong>Waga to nie wszystko</strong>U kobiet waga naturalnie waha się o 1–2 kg w trakcie cyklu miesiączkowego (woda). Patrz na trend z 3–4 tygodni i porównuj tę samą fazę cyklu, nie pojedyncze dni. Centymetry i zdjęcia mówią więcej niż waga.</div>';

  let anyChart = false;
  BODY_METRICS.forEach(function (m) {
    const pts = sorted.filter(function (e) { return e[m.key] != null; }).map(function (e) { return { x: +parseISO(e.date), y: e[m.key] }; });
    if (pts.length >= 2) { anyChart = true; html += '<p class="charttitle">' + m.label + ' (' + m.unit + ')</p><div class="chartbox">' + svgChart([{ points: pts, color: m.color }]) + '</div>'; }
  });
  if (!anyChart) html += emptyState(sorted.length ? 'Wykres pojawi się, gdy zapiszesz daną wartość co najmniej dwa razy.' : 'Pierwszy pomiar to Twój punkt startu. Za tydzień zobaczysz pierwszą zmianę.', 'chart');

  html += '<details class="acc"><summary><span class="n">?</span>Jak mierzyć, żeby wynik był wiarygodny</summary><div class="body"><ul>' + BODY_METRICS.map(function (m) { return '<li><strong>' + m.label + ':</strong> ' + m.how + '</li>'; }).join('') + '<li>Miarka przylega, ale nie wciska się w skórę. Zawsze te same miejsca.</li></ul></div></details>';

  html += '<h2>Historia pomiarów</h2>';
  html += sorted.length ? '<ul class="list">' + sorted.slice().reverse().map(function (e) {
    const parts = [];
    BODY_METRICS.forEach(function (m) { if (e[m.key] != null) parts.push(m.key === 'weight' ? fmtNum(e[m.key]) + ' kg' : m.label.toLowerCase() + ' ' + fmtNum(e[m.key])); });
    return '<li><div class="li-main"><div>' + (parts.length ? parts.join(' · ') : '—') + '</div><div class="li-date">' + fmtDate(e.date) + '</div></div><button type="button" class="del" data-m="' + e.id + '" aria-label="Usuń pomiar">✕</button></li>';
  }).join('') + '</ul>' : '';
  view.innerHTML = html;

  view.addEventListener('click', function (e) {
    if (e.target.id === 'msave') {
      const entry = { id: uid(), date: document.getElementById('mdate').value || todayISO(), ts: Date.now() };
      let any = false;
      BODY_METRICS.forEach(function (m) { const v = parseNum(document.getElementById('m_' + m.key).value); entry[m.key] = v; if (v != null) any = true; });
      if (!any) { toast('Podaj przynajmniej jedną wartość'); return; }
      measures.push(entry); saveKey('measures', measures);
      if (entry.weight) { profile.weight = entry.weight; saveKey('profile', profile); }
      toast('Pomiar zapisany'); renderProgress('measure'); return;
    }
    const del = e.target.closest('.del');
    if (del && del.dataset.m && confirm('Usunąć ten pomiar?')) {
      measures = measures.filter(function (m) { return m.id !== del.dataset.m; });
      saveKey('measures', measures); renderProgress('measure');
    }
  });
}
function deltaTxt(label, now, prev, unit) {
  const d = Math.round((now - prev) * 10) / 10;
  const cls = d > 0 ? 'up' : d < 0 ? 'downgood' : 'same';
  return '<span>' + label + ': <strong class="' + cls + '">' + (d > 0 ? '+' : '') + fmtNum(d) + ' ' + unit + '</strong></span>';
}

/* ---------- Zdjęcia (IndexedDB) ---------- */
const POSES = [['front', 'przód'], ['side', 'bok'], ['back', 'tył']];
function poseName(p) { const f = POSES.filter(function (x) { return x[0] === p; })[0]; return f ? f[1] : p; }
let photoDbP = null;
function photoDb() {
  if (photoDbP) return photoDbP;
  photoDbP = new Promise(function (resolve, reject) {
    if (!window.indexedDB) { reject(new Error('noidb')); return; }
    const req = indexedDB.open('gf-photos', 1);
    req.onupgradeneeded = function () { const db = req.result; if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos', { keyPath: 'id' }); };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
  photoDbP.catch(function () { photoDbP = null; });
  return photoDbP;
}
function photoTx(mode, fn) {
  return photoDb().then(function (db) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction('photos', mode);
      const st = tx.objectStore('photos');
      const out = fn(st);
      tx.oncomplete = function () { resolve(out && out.result !== undefined ? out.result : out); };
      tx.onerror = function () { reject(tx.error); };
      tx.onabort = function () { reject(tx.error); };
    });
  });
}
function photoAll() { return photoTx('readonly', function (st) { return st.getAll(); }).then(function (r) { return (r || []).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.ts || 0) - (b.ts || 0); }); }).catch(function () { return []; }); }
function photoPut(p) { return photoTx('readwrite', function (st) { st.put(p); }); }
function photoDel(id) { return photoTx('readwrite', function (st) { st.delete(id); }); }
function photoClear() { return photoTx('readwrite', function (st) { st.clear(); }); }

function compressImage(file) {
  return new Promise(function (resolve, reject) {
    const MAX = 1200;
    const draw = function (img, w, h) {
      const scale = Math.min(1, MAX / Math.max(w, h));
      const cw = Math.round(w * scale), ch = Math.round(h * scale);
      const c = document.createElement('canvas'); c.width = cw; c.height = ch;
      c.getContext('2d').drawImage(img, 0, 0, cw, ch);
      if (c.toBlob) c.toBlob(function (b) { b ? resolve({ blob: b, w: cw, h: ch }) : reject(new Error('blob')); }, 'image/jpeg', 0.8);
      else { const d = c.toDataURL('image/jpeg', 0.8); fetch(d).then(function (r) { return r.blob(); }).then(function (b) { resolve({ blob: b, w: cw, h: ch }); }, reject); }
    };
    if (window.createImageBitmap) {
      createImageBitmap(file, { imageOrientation: 'from-image' }).then(function (bmp) { draw(bmp, bmp.width, bmp.height); bmp.close && bmp.close(); }).catch(function () { viaImg(); });
    } else viaImg();
    function viaImg() {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () { try { draw(img, img.naturalWidth, img.naturalHeight); } catch (e) { reject(e); } URL.revokeObjectURL(url); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('img')); };
      img.src = url;
    }
  });
}
let photoUrls = [];
function revokePhotoUrls() { photoUrls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} }); photoUrls = []; }
function photoUrl(p) { const u = URL.createObjectURL(p.blob); photoUrls.push(u); return u; }

function renderPhotos(arg) {
  revokePhotoUrls();
  view.innerHTML = '<h2>Postępy</h2>' + subtabsHTML('photos') + '<p class="mut small center">Wczytuję zdjęcia…</p>';
  photoAll().then(function (photos) {
    let html = '<h2>Postępy</h2>' + subtabsHTML('photos');
    const last = photos.length ? photos[photos.length - 1].date : null;
    const due = !last || daysBetween(last, todayISO()) >= 28;
    html += '<div class="card"><h3><span class="ic">' + icon('photo') + '</span>Dodaj zdjęcie</h3>' +
      '<p class="small mut">Co 4 tygodnie, 3 ujęcia (przód / bok / tył), w tym samym stroju, świetle i miejscu. ' + (due ? '<strong>' + (last ? 'Minęły 4 tygodnie — pora na nowe.' : 'Zrób pierwszy komplet — to Twój punkt odniesienia.') + '</strong>' : 'Następne ok. ' + fmtDate(addDays(last, 28)) + '.') + '</p>' +
      '<div class="grid2"><label class="field"><span>Data</span><input id="pdate" type="date" value="' + todayISO() + '"></label>' +
      '<label class="field"><span>Ujęcie</span><select id="ppose">' + POSES.map(function (p) { return '<option value="' + p[0] + '">' + p[1] + '</option>'; }).join('') + '</select></label></div>' +
      '<input type="file" id="pfile" accept="image/*" capture="environment" hidden>' +
      '<input type="file" id="pfile2" accept="image/*" hidden>' +
      '<div class="grid2"><button type="button" id="pcam" class="btn primary">Aparat</button><button type="button" id="pgal" class="btn soft">Z galerii</button></div>' +
      '<p class="mut small" style="margin:10px 0 0">Zdjęcia nigdy nie opuszczają Twojego telefonu — zapisują się tylko w pamięci tej aplikacji i są zmniejszane, żeby nie zajmować miejsca.</p></div>';

    if (photos.length >= 2) {
      const pose = POSES.some(function (p) { return p[0] === arg; }) ? arg : (photos.filter(function (p) { return p.pose === 'front'; }).length >= 2 ? 'front' : photos[photos.length - 1].pose);
      const set = photos.filter(function (p) { return p.pose === pose; });
      html += '<div class="card"><h3><span class="ic">' + icon('swap') + '</span>Wtedy / teraz</h3>' +
        '<div class="seg n3" id="poseSeg">' + POSES.map(function (p) { return '<button type="button" data-pose="' + p[0] + '"' + (p[0] === pose ? ' class="on"' : '') + '>' + p[1] + '</button>'; }).join('') + '</div>';
      if (set.length >= 2) {
        const a = set[0], b = set[set.length - 1];
        html += '<div class="grid2" style="margin-top:10px"><label class="field"><span>Wtedy</span><select id="cmpA">' + set.map(function (p) { return '<option value="' + p.id + '"' + (p === a ? ' selected' : '') + '>' + fmtDate(p.date) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span>Teraz</span><select id="cmpB">' + set.map(function (p) { return '<option value="' + p.id + '"' + (p === b ? ' selected' : '') + '>' + fmtDate(p.date) + '</option>'; }).join('') + '</select></label></div>' +
          '<div class="seg n2" id="cmpMode" style="margin-bottom:10px"><button type="button" data-mode="side" class="on">Obok siebie</button><button type="button" data-mode="overlay">Suwak</button></div>' +
          '<div id="cmpBox"></div>';
      } else html += '<p class="mut small" style="margin-top:10px">Dla ujęcia „' + poseName(pose) + '” potrzebujesz co najmniej dwóch zdjęć z różnych dat.</p>';
      html += '</div>';
    }

    html += '<h2>Galeria</h2>';
    if (!photos.length) html += emptyState('Brak zdjęć. Pierwszy komplet warto zrobić dziś — za 4 tygodnie porównasz.', 'photo');
    else {
      const byDate = {};
      photos.forEach(function (p) { (byDate[p.date] = byDate[p.date] || []).push(p); });
      Object.keys(byDate).sort().reverse().forEach(function (d) {
        html += '<div class="photodate">' + fmtDate(d) + '</div><div class="photogrid">' + byDate[d].map(function (p) {
          return '<div class="photo"><img src="' + photoUrl(p) + '" alt="Zdjęcie sylwetki, ' + poseName(p.pose) + ', ' + fmtDate(p.date) + '" loading="lazy"><span class="tag">' + poseName(p.pose) + '</span><button type="button" class="del" data-p="' + p.id + '" aria-label="Usuń zdjęcie">✕</button></div>';
        }).join('') + '</div>';
      });
    }
    view.innerHTML = html;

    function byId(id) { return photos.filter(function (p) { return p.id === id; })[0]; }
    let mode = 'side';
    function drawCompare() {
      const box = document.getElementById('cmpBox'); if (!box) return;
      const a = byId(document.getElementById('cmpA').value), b = byId(document.getElementById('cmpB').value);
      if (!a || !b) return;
      if (mode === 'side') {
        box.innerHTML = '<div class="compare"><div><div class="photo"><img src="' + photoUrl(a) + '" alt="Wtedy"></div><div class="cap">wtedy · ' + fmtDate(a.date) + '</div></div><div><div class="photo"><img src="' + photoUrl(b) + '" alt="Teraz"></div><div class="cap">teraz · ' + fmtDate(b.date) + '</div></div></div>';
      } else {
        box.innerHTML = '<div class="overlay" id="ovl" style="--cut:50%"><img src="' + photoUrl(a) + '" alt="Wtedy"><img class="now" src="' + photoUrl(b) + '" alt="Teraz"><div class="handle"></div></div>' +
          '<input type="range" id="ovlRange" min="0" max="100" value="50" aria-label="Suwak porównania"><div class="row between small mut"><span>wtedy · ' + fmtDate(a.date) + '</span><span>teraz · ' + fmtDate(b.date) + '</span></div>';
      }
    }
    drawCompare();
    view.addEventListener('input', function (e) {
      if (e.target.id === 'ovlRange') { const o = document.getElementById('ovl'); if (o) o.style.setProperty('--cut', e.target.value + '%'); }
    });
    view.addEventListener('change', function (e) {
      if (e.target.id === 'cmpA' || e.target.id === 'cmpB') drawCompare();
      if (e.target.id === 'pfile' || e.target.id === 'pfile2') {
        const f = e.target.files && e.target.files[0]; e.target.value = '';
        if (!f) return;
        if (!/^image\//.test(f.type)) { toast('To nie jest plik zdjęcia'); return; }
        toast('Zapisuję zdjęcie…');
        compressImage(f).then(function (r) {
          return photoPut({ id: uid(), date: document.getElementById('pdate').value || todayISO(), pose: document.getElementById('ppose').value, blob: r.blob, w: r.w, h: r.h, ts: Date.now() });
        }).then(function () { toast('Zdjęcie zapisane'); renderProgress('photos'); }).catch(function (err) {
          const quota = err && (err.name === 'QuotaExceededError' || /quota/i.test(String(err.message || err.name)));
          toast(quota ? 'Brak miejsca w pamięci telefonu — usuń stare zdjęcia lub zwolnij miejsce' : 'Nie udało się zapisać zdjęcia');
        });
      }
    });
    view.addEventListener('click', function (e) {
      if (e.target.id === 'pcam') { document.getElementById('pfile').click(); return; }
      if (e.target.id === 'pgal') { document.getElementById('pfile2').click(); return; }
      const ps = e.target.closest('#poseSeg button'); if (ps) { location.hash = '#/photos/' + ps.dataset.pose; return; }
      const mb = e.target.closest('#cmpMode button');
      if (mb) { mode = mb.dataset.mode; document.querySelectorAll('#cmpMode button').forEach(function (b) { b.classList.toggle('on', b === mb); }); drawCompare(); return; }
      const del = e.target.closest('.photo .del');
      if (del && confirm('Usunąć to zdjęcie?')) photoDel(del.dataset.p).then(function () { toast('Usunięto'); renderProgress('photos'); });
    });
  });
}

/* ---------- Historia ćwiczeń ---------- */
function renderHistory(exId) {
  let selected = exId && EX[exId] && !EX[exId].warm ? exId : null;
  if (!selected) { for (let i = sessions.length - 1; i >= 0 && !selected; i--) if (sessions[i].exercises[0]) selected = sessions[i].exercises[0].id; }
  if (!selected) selected = 'a1';
  const sel = EX[selected];
  let html = '<h2>Postępy</h2>' + subtabsHTML('history');
  html += '<label class="field"><span>Ćwiczenie</span><select id="hsel">';
  PLAN_KEYS.forEach(function (k) {
    html += '<optgroup label="' + esc(PLANS[k].name) + '">' + PLANS[k].slots.map(function (id) { return '<option value="' + id + '"' + (id === selected ? ' selected' : '') + '>' + esc(EX[id].name) + '</option>'; }).join('') + '</optgroup>';
  });
  const alts = Object.keys(EX).filter(function (id) { return /x$/.test(id); });
  html += '<optgroup label="Alternatywy">' + alts.map(function (id) { return '<option value="' + id + '"' + (id === selected ? ' selected' : '') + '>' + esc(EX[id].name) + '</option>'; }).join('') + '</optgroup></select></label>';

  const hist = [];
  sessions.forEach(function (s) { s.exercises.forEach(function (e) { if (e.id === selected) hist.push({ date: s.date, weight: e.weight, reps: e.reps || [], deload: !!s.deload, intro: !!s.intro }); }); });
  const color = sel.id.charAt(0) === 'b' ? '#8a3a4c' : '#6d2a57';
  if (sel.noWeight) {
    const pts = hist.map(function (h) { const r = h.reps.filter(function (x) { return x > 0; }); return r.length ? { x: +parseISO(h.date), y: Math.max.apply(null, r) } : null; }).filter(Boolean);
    html += '<p class="charttitle">Najlepsza seria (' + (sel.unit === 's' ? 'sekundy' : 'powtórzenia') + ')</p><div class="chartbox">' + svgChart([{ points: pts, color: color }]) + '</div>';
  } else {
    const pts = hist.filter(function (h) { return h.weight != null; }).map(function (h) { return { x: +parseISO(h.date), y: h.weight }; });
    html += '<p class="charttitle">Ciężar (kg) w czasie</p><div class="chartbox">' + svgChart([{ points: pts, color: color }]) + '</div>';
  }
  html += hist.length ? '<ul class="list">' + hist.slice().reverse().map(function (h) {
    const reps = h.reps.filter(function (r) { return r > 0; }).join('/');
    return '<li><div class="li-main"><div>' + (sel.noWeight ? '' : (h.weight != null ? fmtNum(h.weight) + ' kg' : '— kg') + (reps ? ' × ' : '')) + reps + (sel.unit === 's' ? ' s' : '') + (h.deload ? ' <span class="mut small">(lżejszy tydzień)</span>' : h.intro ? ' <span class="mut small">(wprowadzenie)</span>' : '') + '</div><div class="li-date">' + fmtDate(h.date) + '</div></div></li>';
  }).join('') + '</ul>' : emptyState('Jeszcze nie robiłaś tego ćwiczenia. Pierwszy zapis pojawi się po treningu.');

  html += '<h2>Ostatnie treningi</h2>';
  html += sessions.length ? '<ul class="list">' + sessions.slice().reverse().slice(0, 12).map(function (s) {
    const n = s.exercises.length;
    return '<li><div class="li-main"><div>' + esc(PLANS[s.plan].name) + ' · ' + n + ' ' + plural(n, 'ćwiczenie', 'ćwiczenia', 'ćwiczeń') + (s.dur ? ' · ' + Math.round(s.dur / 60) + ' min' : '') + '</div><div class="li-date">' + fmtDate(s.date) + ' · tydzień ' + (s.week || '?') + '</div></div><button type="button" class="del" data-s="' + s.id + '" aria-label="Usuń trening">✕</button></li>';
  }).join('') + '</ul>' : emptyState('Tu pojawią się Twoje treningi. Pierwszy krok: rozgrzewka, potem Trening A.');
  view.innerHTML = html;
  document.getElementById('hsel').addEventListener('change', function () { location.hash = '#/history/' + this.value; });
  view.addEventListener('click', function (e) {
    const del = e.target.closest('.del');
    if (del && del.dataset.s && confirm('Usunąć ten trening z historii?')) {
      sessions = sessions.filter(function (s) { return s.id !== del.dataset.s; });
      saveKey('sessions', sessions); updateWeekChip(); renderProgress('history', selected);
    }
  });
}

/* =========================================================
   Wiedza + kalkulator
   ========================================================= */
const MIN_KCAL = 1400;
function calcNutrition(p) {
  if (!p.age || !p.height || !p.weight) return null;
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;
  const tdee = bmr * p.activity;
  let lo, hi, label;
  if (p.goal === 'lose') { lo = tdee * 0.80; hi = tdee * 0.85; label = 'deficyt 15–20%'; }
  else if (p.goal === 'recomp') { lo = tdee * 0.88; hi = tdee * 0.92; label = 'deficyt ok. 10%'; }
  else { lo = tdee * 1.05; hi = tdee * 1.10; label = 'nadwyżka 5–10%'; }
  let target = Math.round((lo + hi) / 2);
  const clamped = target < MIN_KCAL;
  if (clamped) { target = MIN_KCAL; lo = Math.max(lo, MIN_KCAL); hi = Math.max(hi, MIN_KCAL); }
  const pLo = Math.round(p.weight * 1.6), pHi = Math.round(p.weight * 2.0), pMid = (pLo + pHi) / 2;
  const fLo = Math.round(p.weight * 0.8), fHi = Math.round(p.weight * 1.0), fMid = (fLo + fHi) / 2;
  const carbs = Math.max(0, Math.round((target - pMid * 4 - fMid * 9) / 4));
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), lo: Math.round(lo), hi: Math.round(hi), target: target, clamped: clamped, label: label, pLo: pLo, pHi: pHi, fLo: fLo, fHi: fHi, carbs: carbs };
}
function renderLearn(sub) {
  resetView();
  let html = '<h2>Wiedza</h2><p class="lead">Krótkie odpowiedzi na pytania, które ma każda początkująca. Rozwiń to, co Cię ciekawi.</p>';

  html += '<div class="card" id="calc"><h3><span class="ic">' + icon('calc') + '</span>Kalkulator: ile jeść</h3>' +
    '<div class="grid3"><label class="field"><span>Wiek</span><input id="kAge" type="text" inputmode="numeric" value="' + (profile.age || '') + '" placeholder="28"></label>' +
    '<label class="field"><span>Wzrost (cm)</span><input id="kH" type="text" inputmode="decimal" value="' + (profile.height || '') + '" placeholder="165"></label>' +
    '<label class="field"><span>Waga (kg)</span><input id="kW" type="text" inputmode="decimal" value="' + (profile.weight || '') + '" placeholder="65"></label></div>' +
    '<label class="field"><span>Aktywność</span><select id="kAct"><option value="1.2"' + (profile.activity === 1.2 ? ' selected' : '') + '>Siedząca (1,2)</option><option value="1.375"' + (profile.activity === 1.375 ? ' selected' : '') + '>Lekko aktywna (1,375)</option><option value="1.55"' + (profile.activity === 1.55 ? ' selected' : '') + '>Umiarkowanie aktywna — 3 treningi + kroki (1,55)</option></select></label>' +
    '<label class="field"><span>Cel</span><select id="kGoal"><option value="lose"' + (profile.goal === 'lose' ? ' selected' : '') + '>Schudnąć (deficyt 15–20%)</option><option value="recomp"' + (profile.goal === 'recomp' ? ' selected' : '') + '>Rekompozycja / jędrniej (deficyt ~10%)</option><option value="build"' + (profile.goal === 'build' ? ' selected' : '') + '>Budować mięśnie (+5–10%)</option></select></label>' +
    '<button type="button" id="kGo" class="btn primary">Policz</button><div id="kOut"></div></div>';

  html += '<details class="acc" open><summary><span class="n">★</span>Jak działa Twój plan</summary><div class="body">' +
    '<p><strong>A i B na zmianę</strong>, 3 razy w tygodniu, z co najmniej jednym dniem przerwy między treningami (np. pon–śr–pt). Tydzień 1: A–B–A, tydzień 2: B–A–B. Apka sama podpowiada, który jest następny.</p>' +
    '<p><strong>Tygodnie 1–2 (wprowadzenie):</strong> 2 serie, lekki ciężar, uczysz się ruchu. <strong>Tygodnie 3–7:</strong> pełne 3 serie. <strong>Tydzień 8:</strong> lżej — 2 serie i ciężar −25%. Potem nowy cykl.</p>' +
    '<p><strong>Zapas 2–3 powtórzeń</strong> — kończysz serię, gdy czujesz, że dałabyś radę zrobić jeszcze 2–3 powtórzenia z dobrą techniką, ale ich nie robisz. Nie trenujesz „do upadku”. Dzięki temu technika zostaje czysta, a regeneracja jest szybsza.</p>' +
    '<p><strong>Progresja:</strong> pracujesz w podanym zakresie (np. 10–12). Gdy we wszystkich seriach zrobisz górną granicę z zapasem — następnym razem dołóż: +1 kg (hantle), +2,5 kg (maszyny) lub +5 kg (suwnica, hip thrust). Apka pokaże zieloną plakietkę, gdy to Twój moment.</p>' +
    '<p><strong>Technika zawsze ważniejsza niż ciężar.</strong> Jeśli technika się sypie — odejmij, nie dodawaj.</p></div></details>';

  KNOWLEDGE.forEach(function (k, i) { html += '<details class="acc"><summary><span class="n">' + (i + 1) + '</span>' + esc(k.t) + '</summary><div class="body">' + k.b + '</div></details>'; });
  html += '<p class="note-med">To ogólne wskazówki, nie porada medyczna. W razie wątpliwości porozmawiaj z lekarzem lub dietetykiem.</p>';
  view.innerHTML = html;

  function showCalc(save) {
    const p = { age: parseInt0(document.getElementById('kAge').value), height: parseNum(document.getElementById('kH').value), weight: parseNum(document.getElementById('kW').value), activity: +document.getElementById('kAct').value, goal: document.getElementById('kGoal').value };
    const out = document.getElementById('kOut');
    const r = calcNutrition(p);
    if (!r) { if (save) toast('Uzupełnij wiek, wzrost i wagę'); out.innerHTML = ''; return; }
    if (save) { profile.age = p.age; profile.height = p.height; profile.weight = p.weight; profile.activity = p.activity; profile.goal = p.goal; saveKey('profile', profile); }
    out.innerHTML = '<div class="tiles4"><div class="main"><div class="v">' + r.target.toLocaleString('pl-PL') + '</div><div class="u">kcal dziennie (' + r.label + ': ' + r.lo.toLocaleString('pl-PL') + '–' + r.hi.toLocaleString('pl-PL') + ')</div></div>' +
      '<div><div class="v">' + r.pLo + '–' + r.pHi + '</div><div class="u">g</div><div class="l">białko</div></div>' +
      '<div><div class="v">' + r.fLo + '–' + r.fHi + '</div><div class="u">g</div><div class="l">tłuszcze</div></div>' +
      '<div><div class="v">≈ ' + r.carbs + '</div><div class="u">g</div><div class="l">węglowodany</div></div>' +
      '<div><div class="v">25 g · 2 l</div><div class="u"></div><div class="l">błonnik · woda</div></div></div>' +
      (r.clamped ? '<div class="banner deload"><strong>Podniosłam wynik do 1 400 kcal</strong>Poniżej tej granicy nie schodź bez opieki dietetyka lub lekarza: za duży deficyt to utrata mięśni, spadek energii i zaburzenia cyklu. Lepiej wolniej, ale trwale.</div>' : '') +
      '<p class="small mut">Podstawowa przemiana (BMR): ' + r.bmr.toLocaleString('pl-PL') + ' kcal · całkowite zapotrzebowanie (TDEE): ' + r.tdee.toLocaleString('pl-PL') + ' kcal. To punkt startu — po 2 tygodniach skoryguj według tempa zmian (sekcja 4).</p>' +
      '<p class="small" style="margin-top:10px"><strong>Jak „wygląda” 100 g białka:</strong></p><ul class="small" style="margin:4px 0 0;padding-left:18px">' + PROTEIN_EXAMPLES.map(function (e) { return '<li>' + e[0] + ' ' + e[1] + '</li>'; }).join('') + '</ul>' +
      '<p class="small mut">Przykład: kurczak 150 g + skyr 200 g + 2 jajka + twaróg 100 g ≈ 86 g; dołóż rybę albo odżywkę i masz 100+.</p>';
  }
  document.getElementById('kGo').addEventListener('click', function () { showCalc(true); });
  if (profile.age && profile.height && profile.weight) showCalc(false);
  if (sub === 'calc') setTimeout(function () { const c = document.getElementById('calc'); if (c) c.scrollIntoView({ block: 'start' }); }, 30);
}

/* =========================================================
   Więcej: ustawienia, dane, eksport / import
   ========================================================= */
function renderSettings() {
  resetView();
  const start = cycleStartDate();
  const lastS = sessions[sessions.length - 1];
  let html = '<h2>Więcej</h2>';
  html += '<div class="card"><h3><span class="ic">' + icon('star') + '</span>Ty</h3>' +
    '<label class="field"><span>Imię</span><input id="sName" type="text" value="' + esc(profile.name) + '" placeholder="np. Paula" autocomplete="given-name"></label>' +
    '<div class="field"><span class="lbl">Motyw</span><div class="seg n3" id="sTheme">' + [['auto', 'Auto'], ['light', 'Jasny'], ['dark', 'Ciemny']].map(function (t) { return '<button type="button" data-t="' + t[0] + '"' + (settings.theme === t[0] ? ' class="on"' : '') + '>' + t[1] + '</button>'; }).join('') + '</div></div>' +
    '<div class="field"><span class="lbl">Cel kroków dziennie</span><div class="seg n3" id="sSteps">' + [6000, 8000, 10000].map(function (n) { return '<button type="button" data-n="' + n + '"' + (settings.stepsGoal === n ? ' class="on"' : '') + '>' + n.toLocaleString('pl-PL') + '</button>'; }).join('') + '</div></div>' +
    '<p class="small"><a href="#/learn/calc">Dane do kalkulatora (wiek, wzrost, waga, cel) →</a></p></div>';

  html += '<div class="card"><h3><span class="ic">' + icon('clock') + '</span>Trening</h3>' +
    '<div class="setrow"><div>Timer przerwy po odhaczeniu serii<div class="d">Wyłącz, jeśli wolisz trenować „bez timera”.</div></div><span class="switch"><input type="checkbox" id="stimer"' + (settings.timer ? ' checked' : '') + '><span class="knob"></span></span></div>' +
    '<div class="setrow"><div>Wibracja po przerwie<div class="d">Działa na Androidzie; iPhone nie obsługuje wibracji ze strony.</div></div><span class="switch"><input type="checkbox" id="svibrate"' + (settings.vibrate ? ' checked' : '') + '><span class="knob"></span></span></div>' +
    '<p class="mut small" style="margin:8px 0 0">Długość przerwy ustawiasz osobno przy każdym ćwiczeniu (± 15 s; „wył.” blokuje timer dla tego ćwiczenia).</p></div>';

  html += '<div class="card"><h3><span class="ic">' + icon('flame') + '</span>Cykl 8 tygodni</h3>' +
    '<p class="small">Tydzień <strong>' + cycleWeek() + '/8</strong>' + (start ? ' · start cyklu: ' + fmtDate(start) : ' · cykl ruszy z pierwszym treningiem') + '. Tygodnie 1–2 to wprowadzenie (2 serie), tydzień 8 jest lżejszy. Reset zaczyna od nowa od tygodnia 1.</p>' +
    '<button type="button" id="scycle" class="btn wide">Reset cyklu (nowy tydzień 1)</button></div>';

  html += '<div class="card"><h3><span class="ic">' + icon('book') + '</span>Dane i kopia zapasowa</h3><div class="stack">' +
    '<button type="button" id="sexp" class="btn wide soft">Eksport kopii zapasowej (JSON, ze zdjęciami)</button>' +
    '<button type="button" id="simp" class="btn wide">Import z kopii (JSON)</button>' +
    '<input type="file" id="sfile" accept=".json,application/json" hidden>' +
    '<button type="button" id="scsv1" class="btn wide">Eksport CSV — treningi</button>' +
    '<button type="button" id="scsv2" class="btn wide">Eksport CSV — kardio</button>' +
    '<button type="button" id="scsv3" class="btn wide">Eksport CSV — pomiary</button>' +
    (lastS ? '<button type="button" id="sdel" class="btn danger wide">Usuń ostatni trening (' + esc(PLANS[lastS.plan].name) + ', ' + fmtDate(lastS.date) + ')</button>' : '') +
    '</div><p class="mut small" style="margin:12px 0 0">Wszystko jest tylko w tym telefonie — nie ma konta ani chmury. Raz na jakiś czas zrób eksport JSON: to pełna kopia (razem ze zdjęciami), którą możesz wczytać na nowym telefonie.</p></div>';

  html += '<div class="card flat"><h3>O aplikacji</h3><p class="small">Progres — dziennik treningowy na start. Działa offline po pierwszym otwarciu. Zdjęcia i dane nigdy nie opuszczają telefonu. Treści w zakładce „Wiedza” to ogólne wskazówki, nie porada medyczna.</p>' +
    '<p class="small"><strong>Dodaj do ekranu głównego:</strong> iPhone — Safari → Udostępnij → „Do ekranu początkowego”. Android — Chrome → menu ⋮ → „Dodaj do ekranu głównego” / „Zainstaluj aplikację”.</p></div>';
  view.innerHTML = html;

  document.getElementById('sName').addEventListener('change', function () { profile.name = this.value.trim().slice(0, 30); saveKey('profile', profile); toast('Zapisano imię'); });
  document.getElementById('stimer').addEventListener('change', function () { settings.timer = this.checked; saveKey('settings', settings); });
  document.getElementById('svibrate').addEventListener('change', function () { settings.vibrate = this.checked; saveKey('settings', settings); if (this.checked) buzz(120); });
  document.getElementById('sfile').addEventListener('change', function () { const f = this.files && this.files[0]; if (f) importJSON(f); this.value = ''; });
  view.addEventListener('click', function (e) {
    const tb = e.target.closest('#sTheme button');
    if (tb) { settings.theme = tb.dataset.t; saveKey('settings', settings); applyTheme(); document.querySelectorAll('#sTheme button').forEach(function (b) { b.classList.toggle('on', b === tb); }); return; }
    const sb = e.target.closest('#sSteps button');
    if (sb) { settings.stepsGoal = +sb.dataset.n; saveKey('settings', settings); document.querySelectorAll('#sSteps button').forEach(function (b) { b.classList.toggle('on', b === sb); }); return; }
    switch (e.target.id) {
      case 'scycle':
        if (confirm('Zacząć nowy cykl od dziś (tydzień 1, faza wprowadzająca)?')) { settings.cycleStart = todayISO(); saveKey('settings', settings); updateWeekChip(); renderSettings(); toast('Nowy cykl — tydzień 1'); }
        break;
      case 'sexp': exportJSON(); break;
      case 'simp': document.getElementById('sfile').click(); break;
      case 'scsv1': exportCSVWorkouts(); break;
      case 'scsv2': exportCSVCardio(); break;
      case 'scsv3': exportCSVMeasures(); break;
      case 'sdel':
        if (sessions.length && confirm('Usunąć ostatni zapisany trening?')) { sessions.pop(); saveKey('sessions', sessions); updateWeekChip(); renderSettings(); toast('Trening usunięty'); }
        break;
    }
  });
}

function blobToDataURL(blob) {
  return new Promise(function (resolve, reject) { const r = new FileReader(); r.onload = function () { resolve(r.result); }; r.onerror = function () { reject(r.error); }; r.readAsDataURL(blob); });
}
function dataURLToBlob(d) {
  const m = /^data:([^;]+);base64,(.*)$/.exec(d);
  if (!m) return null;
  const bin = atob(m[2]); const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: m[1] });
}
function exportJSON() {
  toast('Przygotowuję kopię…');
  photoAll().then(function (photos) {
    return Promise.all(photos.map(function (p) { return blobToDataURL(p.blob).then(function (d) { return { id: p.id, date: p.date, pose: p.pose, w: p.w, h: p.h, ts: p.ts, data: d }; }); }));
  }).then(function (photos) {
    const data = { app: 'gf-progres', version: DB_V, exportedAt: new Date().toISOString(), sessions: sessions, cardio: cardio, measures: measures, notes: notes, settings: settings, profile: profile, steps: steps, photos: photos };
    download('progres-kopia-' + stamp() + '.json', JSON.stringify(data), 'application/json');
    toast('Kopia zapisana do pliku' + (photos.length ? ' (ze zdjęciami)' : ''));
  }).catch(function () { toast('Nie udało się przygotować kopii'); });
}
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const d = JSON.parse(reader.result);
      if (!d || typeof d !== 'object') throw new Error('bad');
      const ns = cleanSessions(d.sessions), nc = cleanDated(d.cardio), nm = cleanDated(d.measures);
      const np = Array.isArray(d.photos) ? d.photos.filter(function (p) { return p && typeof p.data === 'string' && typeof p.date === 'string'; }) : [];
      if (!ns.length && !nc.length && !nm.length && !np.length) throw new Error('empty');
      if (!confirm('Wczytać kopię? Zastąpi obecne dane (treningi: ' + ns.length + ', kardio: ' + nc.length + ', pomiary: ' + nm.length + ', zdjęcia: ' + np.length + ').')) return;
      sessions = ns; cardio = nc; measures = nm;
      notes = cleanNotes(d.notes); steps = cleanSteps(d.steps);
      if (d.settings && typeof d.settings === 'object') settings = normSettings(d.settings);
      if (d.profile && typeof d.profile === 'object') profile = normProfile(d.profile);
      persistAll(); applyTheme(); updateWeekChip();
      const restore = np.length ? photoClear().then(function () {
        return np.reduce(function (chain, p) {
          return chain.then(function () { const b = dataURLToBlob(p.data); return b ? photoPut({ id: p.id || uid(), date: p.date, pose: p.pose || 'front', blob: b, w: p.w, h: p.h, ts: p.ts || Date.now() }) : null; });
        }, Promise.resolve());
      }) : Promise.resolve();
      restore.then(function () { renderSettings(); toast('Kopia wczytana'); }).catch(function () { renderSettings(); toast('Dane wczytane, ale zdjęcia się nie zmieściły'); });
    } catch (e) { toast('Nie udało się odczytać pliku'); }
  };
  reader.readAsText(file);
}
function csvText(rows) {
  return '﻿' + rows.map(function (r) { return r.map(function (f) { f = f == null ? '' : String(f); return /[;"\n]/.test(f) ? '"' + f.replace(/"/g, '""') + '"' : f; }).join(';'); }).join('\r\n');
}
function exportCSVWorkouts() {
  const rows = [['Data', 'Tydzień', 'Trening', 'Ćwiczenie', 'Ciężar (kg)', 'Seria 1', 'Seria 2', 'Seria 3', 'Faza', 'Czas (min)']];
  sessions.forEach(function (s) {
    s.exercises.forEach(function (e) {
      const ex = EX[e.id], reps = e.reps || [];
      rows.push([s.date, s.week || '', PLANS[s.plan].name, ex ? ex.name : e.id, fmtNum(e.weight), reps[0] || '', reps[1] || '', reps[2] || '', s.deload ? 'lżejszy' : s.intro ? 'wprowadzenie' : '', s.dur ? Math.round(s.dur / 60) : '']);
    });
  });
  download('treningi-' + stamp() + '.csv', csvText(rows), 'text/csv;charset=utf-8');
}
function exportCSVCardio() {
  const rows = [['Data', 'Rodzaj', 'Czas (min)', 'Dystans (km)', 'Tętno', 'Samopoczucie (1–5)']];
  cardio.forEach(function (r) { rows.push([r.date, cardioTypeName(r.type), fmtNum(r.min), fmtNum(r.km), r.hr || '', r.feel || '']); });
  const days = Object.keys(steps).sort();
  if (days.length) { rows.push([]); rows.push(['Data', 'Kroki']); days.forEach(function (d) { rows.push([d, steps[d]]); }); }
  download('kardio-' + stamp() + '.csv', csvText(rows), 'text/csv;charset=utf-8');
}
function exportCSVMeasures() {
  const rows = [['Data'].concat(BODY_METRICS.map(function (m) { return m.label + ' (' + m.unit + ')'; }))];
  sortedMeasures().forEach(function (e) { rows.push([e.date].concat(BODY_METRICS.map(function (m) { return fmtNum(e[m.key]); }))); });
  download('pomiary-' + stamp() + '.csv', csvText(rows), 'text/csv;charset=utf-8');
}
