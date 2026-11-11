/* TMAL 1095/B – homer bisus map. Static page: Leaflet + data.js + state (localStorage / state.json). */
(() => {
  'use strict';

  const STATE_KEY = 'tmal1095b.hatchState.v1';
  const UI_KEY = 'tmal1095b.ui.v1';
  const LABEL_MIN_ZOOM = 17;
  const LABEL_MAX_COUNT = 600;

  const CATS = [
    { key: 'y2011', color: '#e03131' },
    { key: 'y1999', color: '#f08c00' },
    { key: 'zero_new', color: '#15aabf' },
    { key: 'zero', color: '#2f9e44' },
    { key: 'other', color: '#1c7ed6' },
  ];
  const CAT_COLOR = Object.fromEntries(CATS.map(c => [c.key, c.color]));

  const I18N = {
    ru: {
      title: 'תמ"ל/1095/ב · חומר ביסוס',
      searchPh: 'гуш или гуш/חלקה, напр. 3991/41',
      find: 'Найти',
      legend: 'Год חומר ביסוס',
      cat_y2011: '> 2010', cat_y1999: '1999–2010', cat_zero_new: 'הסדר после 2010',
      cat_zero: 'הסדר до 2010 / неизвестно', cat_other: 'до 1999',
      ttgOutline: 'актуальный — תת"ג', kasOutline: 'актуальный — תצ"ר כשר לרישום', hiddenOutline: 'hatch выключен',
      display: 'Отображение',
      quickMode: 'Быстрый режим: клик вкл/выкл hatch',
      planOnly: 'Только חלקות проекта (1.5.5)',
      peekHidden: 'Временно показать выключенные',
      showLabels: 'Подписи (с зума 17)',
      opacity: 'Прозрачность',
      progress: 'Прогресс',
      hiddenList: 'Выключенные חלקות',
      saving: 'Сохранение',
      export: 'Скачать state.json',
      import: 'Загрузить…',
      reset: 'Сбросить',
      resetConfirm: 'Точно? Нажмите ещё раз',
      saveHelpFile: 'Статус сохраняется в этом браузере автоматически. Чтобы он был в git и на других компьютерах — скачайте state.json и закоммитьте рядом с index.html.',
      stAll: 'Всего חלקות', stHidden: 'hatch выключен', stPlan: 'Из них проекта (1.5.5)',
      srcLocal: 'Источник: этот браузер', srcRemote: 'Источник: state.json из репозитория', srcNone: 'Источник: новый (пусто)',
      updated: 'изменено', dirty: 'Есть изменения, которых нет в state.json', clean: 'Совпадает с state.json',
      noRemote: 'state.json не найден (откройте через GitHub Pages / сервер)',
      p_plan: 'В проекте', p_full: 'בשלמותה', p_part: 'בחלקה', p_no: 'нет',
      p_mith: 'מתחם', p_area: 'שטח רשום', p_hb: 'חומר ביסוס', p_from: 'Источник выбора',
      p_layer: 'TALAR в слое', p_ttg: 'תת"ג', p_kas: 'כשר לרישום', p_pag: 'פגת תוקף', p_bik: 'בביקורת',
      from_ORIGIN: 'исходный', from_TTG: 'תת"ג', from_KASHER: 'תצ"ר כשר', from_PAG: 'תצ"ר פג תוקף',
      fromReport: '* номер из דוח תמורות (в слое 0)',
      hide: 'Выключить hatch', show: 'Включить hatch',
      notFound: 'Не найдено', foundGush: 'חלקות в гуше',
      imported: 'Загружено', importErr: 'Не удалось прочитать файл',
      showBtn: 'вкл',
      saveHelpSb: 'Статус сохраняется в Supabase сразу при клике и виден на всех компьютерах. state.json — только резервная копия.',
      srcSb: 'Источник: Supabase', sbOk: 'синхронизировано', sbSending: 'отправка…',
      sbOffline: 'нет связи с Supabase', sbPending: 'ждут отправки', sbLive: 'live',
      base_osm: 'OpenStreetMap', base_sat: 'Спутник (Esri)', base_none: 'Без подложки',
    },
    he: {
      title: 'תמ"ל/1095/ב · חומר ביסוס',
      searchPh: 'גוש או גוש/חלקה, למשל 3991/41',
      find: 'חיפוש',
      legend: 'שנת חומר ביסוס',
      cat_y2011: 'אחרי 2010', cat_y1999: '\u20661999–2010\u2069', cat_zero_new: 'הסדר אחרי 2010',
      cat_zero: 'הסדר עד 2010 / לא ידוע', cat_other: 'לפני 1999',
      ttgOutline: 'עדכני – תת"ג', kasOutline: 'עדכני – תצ"ר כשר לרישום', hiddenOutline: 'מילוי כבוי',
      display: 'תצוגה',
      quickMode: 'מצב מהיר: לחיצה מכבה/מדליקה מילוי',
      planOnly: 'רק חלקות התכנית (1.5.5)',
      peekHidden: 'הצג זמנית חלקות כבויות',
      showLabels: 'תוויות (מזום 17)',
      opacity: 'שקיפות',
      progress: 'התקדמות',
      hiddenList: 'חלקות כבויות',
      saving: 'שמירה',
      export: 'הורדת state.json',
      import: 'טעינה…',
      reset: 'איפוס',
      resetConfirm: 'בטוח? לחצו שוב',
      saveHelpFile: 'הסטטוס נשמר אוטומטית בדפדפן זה. כדי שיישמר ב-git ובמחשבים אחרים – הורידו את state.json ובצעו commit ליד index.html.',
      stAll: 'סה"כ חלקות', stHidden: 'מילוי כבוי', stPlan: 'מתוכן בתכנית (1.5.5)',
      srcLocal: 'מקור: דפדפן זה', srcRemote: 'מקור: state.json מהמאגר', srcNone: 'מקור: חדש (ריק)',
      updated: 'עודכן', dirty: 'יש שינויים שאינם ב-state.json', clean: 'זהה ל-state.json',
      noRemote: 'state.json לא נמצא (פתחו דרך GitHub Pages / שרת)',
      p_plan: 'בתכנית', p_full: 'בשלמותה', p_part: 'בחלקה', p_no: 'לא',
      p_mith: 'מתחם', p_area: 'שטח רשום', p_hb: 'חומר ביסוס', p_from: 'מקור הבחירה',
      p_layer: 'TALAR בשכבה', p_ttg: 'תת"ג', p_kas: 'כשר לרישום', p_pag: 'פגת תוקף', p_bik: 'בביקורת',
      from_ORIGIN: 'מקורי', from_TTG: 'תת"ג', from_KASHER: 'תצ"ר כשר', from_PAG: 'תצ"ר פג תוקף',
      fromReport: '* המספר מדוח התמורות (בשכבה 0)',
      hide: 'כיבוי מילוי', show: 'הדלקת מילוי',
      notFound: 'לא נמצא', foundGush: 'חלקות בגוש',
      imported: 'נטען', importErr: 'לא ניתן לקרוא את הקובץ',
      showBtn: 'הדלק',
      saveHelpSb: 'הסטטוס נשמר ב-Supabase מיד בלחיצה ונראה בכל המחשבים. state.json – גיבוי בלבד.',
      srcSb: 'מקור: Supabase', sbOk: 'מסונכרן', sbSending: 'שולח…',
      sbOffline: 'אין חיבור ל-Supabase', sbPending: 'ממתינים לשליחה', sbLive: 'live',
      base_osm: 'OpenStreetMap', base_sat: 'תצלום אוויר (Esri)', base_none: 'ללא רקע',
    },
  };

  // ---------- storage helpers (never throw) ----------
  const store = {
    get(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; } },
    del(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };

  const ui = Object.assign({ lang: 'ru', opacity: 0.55, cats: {}, planOnly: false, labels: true, collapsed: false }, store.get(UI_KEY) || {});
  const saveUi = () => store.set(UI_KEY, ui);
  // In LTR (Russian) text, isolate Hebrew runs so punctuation/numbers around them stay in place.
  const HEB_RUN = /[\u0590-\u05FF][\u0590-\u05FF"'״׳.\s]*[\u0590-\u05FF"']|[\u0590-\u05FF]/g;
  const isolate = (s) => String(s).replace(HEB_RUN, m => '\u2068' + m + '\u2069');
  const t = (k) => {
    const s = (I18N[ui.lang] && I18N[ui.lang][k]) || I18N.ru[k] || k;
    return (ui.lang === 'ru' && k !== 'title') ? isolate(s) : s;
  };

  // ---------- state ----------
  const CFG = window.APP_CONFIG || {};
  const SB_ON = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase && window.supabase.createClient);
  const TABLE = CFG.table || 'parcel_status';
  const sb = SB_ON ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;

  const emptyState = () => ({ version: 1, updated: null, hidden: {} });
  let state = emptyState();
  let pending = {};          // Supabase mode: parcel id -> hidden (not yet confirmed by the server)
  let stateSource = 'none';
  let remoteSnapshot = null; // file mode: JSON of hidden keys from state.json, or null if unavailable
  const sync = { online: false, sending: false, realtime: '', serverCount: null };

  const isValidState = (s) => s && typeof s === 'object' && s.hidden && typeof s.hidden === 'object';
  const normHidden = (h) => JSON.stringify(Object.keys(h).filter(k => h[k]).sort());

  function persist() {
    state.updated = new Date().toISOString();
    store.set(STATE_KEY, { ...state, pending });
    renderStateInfo();
  }

  async function loadStateFile() {
    const local = store.get(STATE_KEY);
    let remote = null;
    if (location.protocol.startsWith('http')) {
      try {
        const r = await fetch('state.json', { cache: 'no-store' });
        if (r.ok) { const j = await r.json(); if (isValidState(j)) remote = j; }
      } catch { /* offline or missing */ }
    }
    if (remote) remoteSnapshot = normHidden(remote.hidden);
    const lv = isValidState(local) ? local : null;
    if (lv && remote) {
      const useRemote = (remote.updated || '') > (lv.updated || '');
      state = useRemote ? remote : lv; stateSource = useRemote ? 'remote' : 'local';
      if (useRemote) store.set(STATE_KEY, state);
    } else if (lv) { state = lv; stateSource = 'local'; }
    else if (remote) { state = remote; stateSource = 'remote'; }
    else { state = emptyState(); stateSource = 'none'; }
    state = { version: 1, updated: state.updated || null, hidden: Object.fromEntries(Object.entries(state.hidden).filter(([, v]) => v)) };
  }

  // ---- Supabase mode ----
  async function fetchServer() {
    const rows = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb.from(TABLE).select('parcel_id,hidden').range(from, from + 999);
      if (error) throw error;
      rows.push(...data);
      if (data.length < 1000) break;
    }
    return rows;
  }

  async function loadStateSupabase() {
    const local = store.get(STATE_KEY);
    if (isValidState(local)) { state = { version: 1, updated: local.updated || null, hidden: local.hidden }; pending = local.pending || {}; }
    stateSource = 'sb';
    try {
      const rows = await fetchServer();
      sync.online = true; sync.serverCount = rows.length;
      // First connection with an empty table: upload what this browser already has.
      if (rows.length === 0 && Object.keys(pending).length === 0) {
        Object.keys(state.hidden).filter(k => state.hidden[k]).forEach(k => { pending[k] = true; });
      }
      const hidden = {};
      rows.forEach(r => { if (r.hidden) hidden[r.parcel_id] = true; });
      Object.entries(pending).forEach(([id, h]) => { if (h) hidden[id] = true; else delete hidden[id]; });
      state.hidden = hidden;
    } catch (err) {
      sync.online = false;
      console.warn('Supabase load failed, using browser copy', err);
    }
    state.hidden = Object.fromEntries(Object.entries(state.hidden).filter(([, v]) => v));
    store.set(STATE_KEY, { ...state, pending });
  }

  let flushTimer = null;
  function scheduleFlush(ms = 300) { if (!SB_ON) return; clearTimeout(flushTimer); flushTimer = setTimeout(flush, ms); }
  async function flush() {
    if (!SB_ON || sync.sending) return;
    const batch = Object.entries(pending);
    if (!batch.length) return;
    sync.sending = true; renderStateInfo();
    const now = new Date().toISOString();
    try {
      for (let i = 0; i < batch.length; i += 500) {
        const rows = batch.slice(i, i + 500).map(([parcel_id, hidden]) => ({ parcel_id, hidden, updated_at: now }));
        const { error } = await sb.from(TABLE).upsert(rows, { onConflict: 'parcel_id' });
        if (error) throw error;
      }
      batch.forEach(([id, h]) => { if (pending[id] === h) delete pending[id]; });
      sync.online = true;
    } catch (err) {
      sync.online = false;
      console.warn('Supabase write failed, will retry', err);
      scheduleFlush(15000);
    } finally {
      sync.sending = false;
      store.set(STATE_KEY, { ...state, pending });
      renderStateInfo();
      if (sync.online && Object.keys(pending).length) scheduleFlush(50);
    }
  }

  function applyRemoteRow(id, hidden) {
    if (!byId.has(id) || pending[id] !== undefined) return;
    if (!!state.hidden[id] === !!hidden) return;
    if (hidden) state.hidden[id] = true; else delete state.hidden[id];
    store.set(STATE_KEY, { ...state, pending });
    restyle(id); renderStats(); scheduleLabels();
    const l = byId.get(id); if (l && l.isPopupOpen()) l.setPopupContent(popupHtml(l.feature.properties));
  }

  function startRealtime() {
    sb.channel('parcel_status_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (payload) => {
        const row = (payload.new && payload.new.parcel_id) ? payload.new : payload.old;
        if (!row || !row.parcel_id) return;
        applyRemoteRow(row.parcel_id, payload.eventType === 'DELETE' ? false : !!row.hidden);
      })
      .subscribe((status) => { sync.realtime = status; renderStateInfo(); });
  }

  async function resyncFromServer() {
    if (!SB_ON) return;
    try {
      const rows = await fetchServer();
      sync.online = true; sync.serverCount = rows.length;
      const srv = {}; rows.forEach(r => { srv[r.parcel_id] = !!r.hidden; });
      byId.forEach((_, id) => applyRemoteRow(id, !!srv[id]));
      renderStateInfo();
      scheduleFlush(50);
    } catch { sync.online = false; renderStateInfo(); }
  }

  // Change one or many parcels; the single place that mutates `state.hidden`.
  function setHiddenMany(changes) {
    const ids = [];
    Object.entries(changes).forEach(([id, h]) => {
      if (!!state.hidden[id] === !!h) return;
      if (h) state.hidden[id] = true; else delete state.hidden[id];
      if (SB_ON) pending[id] = !!h;
      ids.push(id);
    });
    if (!ids.length) return;
    persist();
    if (ids.length > 50) restyle(); else ids.forEach(restyle);
    renderStats(); scheduleLabels();
    ids.forEach(id => { const l = byId.get(id); if (l && l.isPopupOpen()) l.setPopupContent(popupHtml(l.feature.properties)); });
    scheduleFlush();
  }

  // ---------- map ----------
  const D = window.MAP_DATA;
  const map = L.map('map', { preferCanvas: true, zoomControl: false, minZoom: 11, maxZoom: 21 });
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
  const canvas = L.canvas({ padding: 0.5, tolerance: 3 });
  const bases = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxNativeZoom: 19, maxZoom: 21, attribution: '© OpenStreetMap' }),
    sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 19, maxZoom: 21, attribution: 'Esri, Maxar' }),
    none: L.layerGroup(),
  };
  let baseControl = null;
  const activeBase = () => ['osm', 'sat', 'none'].find(k => map.hasLayer(bases[k])) || 'osm';
  function buildBaseControl() {
    const cur = baseControl ? activeBase() : (ui.base || 'osm');
    if (baseControl) baseControl.remove();
    Object.values(bases).forEach(b => map.removeLayer(b));
    bases[cur].addTo(map);
    baseControl = L.control.layers({ [t('base_osm')]: bases.osm, [t('base_sat')]: bases.sat, [t('base_none')]: bases.none }, null, { position: 'topright' }).addTo(map);
  }
  map.on('baselayerchange', () => { ui.base = activeBase(); saveUi(); });

  const boundary = L.geoJSON(D.boundary, { renderer: canvas, interactive: false, style: { color: '#0000ff', weight: 3, opacity: 0.9, fill: false } });

  const byId = new Map();
  const isHidden = (id) => !!state.hidden[id];

  function styleFor(p) {
    const hidden = isHidden(p.id);
    const peek = document.getElementById('peekHidden').checked;
    const catOn = ui.cats[p.c] !== false;
    const planOk = !ui.planOnly || !!p.pl;
    let fillOpacity = ui.opacity;
    if (!catOn || !planOk) fillOpacity = 0;
    if (hidden && !peek) fillOpacity = 0;
    const s = { color: '#343a40', weight: 0.6, opacity: 0.9, fillColor: CAT_COLOR[p.c] || '#adb5bd', fillOpacity, dashArray: null };
    if (fillOpacity > 0 && p.ch === 'TTG') { s.color = '#ffffff'; s.weight = 2.5; }
    if (fillOpacity > 0 && p.ch === 'KASHER') { s.color = '#be4bdb'; s.weight = 2.5; }
    if (hidden) { s.color = '#495057'; s.weight = 1; s.dashArray = '4 4'; if (peek) s.fillOpacity = ui.opacity * 0.35; }
    if (!planOk && !hidden) { s.opacity = 0.35; }
    return s;
  }

  const parcels = L.geoJSON(D.parcels, {
    renderer: canvas,
    style: f => styleFor(f.properties),
    onEachFeature: (f, layer) => {
      byId.set(f.properties.id, layer);
      layer.on('click', (ev) => {
        if (document.getElementById('quickMode').checked) {
          L.DomEvent.stop(ev);
          toggle(f.properties.id);
        } else {
          layer.bindPopup(() => popupHtml(f.properties), { maxWidth: 320 }).openPopup(ev.latlng);
        }
      });
    },
  });

  function restyle(id) {
    if (id) { const l = byId.get(id); if (l) l.setStyle(styleFor(l.feature.properties)); }
    else parcels.eachLayer(l => l.setStyle(styleFor(l.feature.properties)));
  }

  function toggle(id) { setHiddenMany({ [id]: !isHidden(id) }); }
  window.__toggleParcel = toggle; // used by popup button

  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function popupHtml(p) {
    const row = (k, v) => (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) ? '' : `<tr><td>${esc(t(k))}</td><td>${esc(Array.isArray(v) ? v.join(', ') : v)}</td></tr>`;
    const plan = p.pl ? (p.pl === 'בשלמותה' ? t('p_full') : t('p_part')) : t('p_no');
    const hidden = isHidden(p.id);
    return `<div class="pp" dir="${ui.lang === 'he' ? 'rtl' : 'ltr'}">
      <h3>${esc(p.id)}</h3>
      <table>
        ${row('p_hb', p.lb)}
        ${row('p_from', t('from_' + p.ch))}
        ${row('p_plan', plan)}
        ${row('p_mith', p.m)}
        ${row('p_area', p.ar)}
        ${row('p_layer', p.tal)}
        ${row('p_ttg', p.ttg)}
        ${row('p_kas', p.kas)}
        ${row('p_pag', p.pag)}
        ${row('p_bik', p.bik)}
      </table>
      ${p.rep ? `<div class="muted small">${esc(t('fromReport'))}</div>` : ''}
      <button class="btn ${hidden ? '' : 'primary'}" onclick="window.__toggleParcel('${esc(p.id)}')">${esc(hidden ? t('show') : t('hide'))}</button>
    </div>`;
  }

  // ---------- labels ----------
  const labelLayer = L.layerGroup().addTo(map);
  function renderLabels() {
    labelLayer.clearLayers();
    if (!ui.labels || map.getZoom() < LABEL_MIN_ZOOM) return;
    const b = map.getBounds();
    let n = 0;
    parcels.eachLayer(l => {
      if (n >= LABEL_MAX_COUNT) return;
      const p = l.feature.properties;
      if (ui.planOnly && !p.pl) return;
      const lb = l.getBounds();
      if (!b.intersects(lb)) return;
      const c = lb.getCenter();
      if (!b.contains(c)) return;
      n++;
      const bik = p.bik.length ? `<br><span class="bik">BIKORET ${esc(p.bik.join(', '))}</span>` : '';
      L.tooltip({ permanent: true, direction: 'center', className: 'lbl' + (isHidden(p.id) ? ' off' : ''), interactive: false })
        .setLatLng(c).setContent(`<b>${esc(p.h)}</b><br>${esc(p.lb)}${bik}`).addTo(labelLayer);
    });
  }
  let labelTimer = null;
  const scheduleLabels = () => { clearTimeout(labelTimer); labelTimer = setTimeout(renderLabels, 60); };
  map.on('moveend zoomend', scheduleLabels);

  // ---------- panel ----------
  const $ = (id) => document.getElementById(id);
  function applyI18n() {
    document.documentElement.lang = ui.lang;
    document.documentElement.dir = ui.lang === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $('langBtn').textContent = ui.lang === 'ru' ? 'HE' : 'RU';
    renderLegend(); renderStats(); renderStateInfo(); buildBaseControl();
  }

  function renderLegend() {
    const counts = {};
    D.parcels.features.forEach(f => { counts[f.properties.c] = (counts[f.properties.c] || 0) + 1; });
    $('legend').innerHTML = CATS.map(c => `
      <li><label><input type="checkbox" data-cat="${c.key}" ${ui.cats[c.key] === false ? '' : 'checked'}>
        <span class="swatch" style="background:${c.color}"></span><span>${esc(t('cat_' + c.key))}</span>
        <span class="count">${counts[c.key] || 0}</span></label></li>`).join('');
    $('legend').querySelectorAll('input[data-cat]').forEach(cb => cb.addEventListener('change', () => {
      ui.cats[cb.dataset.cat] = cb.checked; saveUi(); restyle();
    }));
  }

  function renderStats() {
    const feats = D.parcels.features;
    const total = feats.length;
    const hiddenIds = Object.keys(state.hidden);
    const planTotal = feats.filter(f => f.properties.pl).length;
    const planHidden = feats.filter(f => f.properties.pl && isHidden(f.properties.id)).length;
    const pct = planTotal ? Math.round(planHidden / planTotal * 100) : 0;
    $('stats').innerHTML = `
      ${esc(t('stAll'))}: <b>${total}</b> · ${esc(t('stHidden'))}: <b>${hiddenIds.length}</b><br>
      ${esc(t('stPlan'))}: <b>${planHidden}</b> / ${planTotal} (${pct}%)
      <div class="bar"><span style="width:${pct}%"></span></div>`;
    const sorted = hiddenIds.sort((a, b) => { const [ga, ha] = a.split('/').map(Number); const [gb, hb] = b.split('/').map(Number); return ga - gb || ha - hb; });
    $('hiddenList').innerHTML = sorted.map(id => `<li><a data-zoom="${esc(id)}">${esc(id)}</a><button class="btn" data-show="${esc(id)}">${esc(t('showBtn'))}</button></li>`).join('');
  }

  function renderStateInfo() {
    const el = $('stateInfo'); if (!el) return;
    const when = state.updated ? new Date(state.updated).toLocaleString(ui.lang === 'he' ? 'he-IL' : 'ru-RU') : '—';
    $('saveHelp').textContent = t(SB_ON ? 'saveHelpSb' : 'saveHelpFile');
    if (SB_ON) {
      const np = Object.keys(pending).length;
      let line;
      if (sync.sending) line = `<span class="muted">⟳ ${esc(t('sbSending'))}</span>`;
      else if (!sync.online) line = `<span class="dirty">● ${esc(t('sbOffline'))}${np ? ` · ${np} ${esc(t('sbPending'))}` : ''}</span>`;
      else if (np) line = `<span class="dirty">● ${np} ${esc(t('sbPending'))}</span>`;
      else line = `<span class="ok">✓ ${esc(t('sbOk'))}</span>`;
      const live = sync.realtime === 'SUBSCRIBED' ? ` · <span class="ok">${esc(t('sbLive'))}</span>` : '';
      el.innerHTML = `${esc(t('srcSb'))} · ${esc(t('updated'))}: ${esc(when)}<br>${line}${live}`;
      return;
    }
    const src = { local: t('srcLocal'), remote: t('srcRemote'), none: t('srcNone') }[stateSource] || '';
    let syncLine;
    if (remoteSnapshot === null) syncLine = `<span class="muted">${esc(t('noRemote'))}</span>`;
    else if (remoteSnapshot === normHidden(state.hidden)) syncLine = `<span class="ok">✓ ${esc(t('clean'))}</span>`;
    else syncLine = `<span class="dirty">● ${esc(t('dirty'))}</span>`;
    el.innerHTML = `${esc(src)} · ${esc(t('updated'))}: ${esc(when)}<br>${syncLine}`;
  }

  function zoomTo(id) {
    const l = byId.get(id); if (!l) return false;
    map.fitBounds(l.getBounds(), { maxZoom: 19, padding: [40, 40] });
    const prev = l.options.weight;
    l.setStyle({ weight: 5, color: '#fa5252' });
    setTimeout(() => restyle(id), 1600);
    return prev !== undefined;
  }

  // search
  $('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('searchInput').value.trim();
    const m = q.match(/^(\d+)\s*[/\\ ,.-]?\s*(\d+)?$/);
    $('searchMsg').textContent = '';
    if (!m) { $('searchMsg').textContent = t('notFound'); return; }
    if (m[2]) {
      if (!zoomTo(`${+m[1]}/${+m[2]}`)) $('searchMsg').textContent = t('notFound');
    } else {
      const ls = []; byId.forEach((l, id) => { if (id.startsWith(`${+m[1]}/`)) ls.push(l); });
      if (!ls.length) { $('searchMsg').textContent = t('notFound'); return; }
      map.fitBounds(L.featureGroup(ls).getBounds(), { padding: [30, 30] });
      $('searchMsg').textContent = `${t('foundGush')}: ${ls.length}`;
    }
  });

  $('hiddenList').addEventListener('click', (e) => {
    const z = e.target.closest('[data-zoom]'); if (z) zoomTo(z.dataset.zoom);
    const s = e.target.closest('[data-show]'); if (s) toggle(s.dataset.show);
  });

  $('quickMode').addEventListener('change', () => { map.closePopup(); map.getContainer().style.cursor = $('quickMode').checked ? 'pointer' : ''; });
  $('planOnly').checked = ui.planOnly;
  $('planOnly').addEventListener('change', () => { ui.planOnly = $('planOnly').checked; saveUi(); restyle(); renderLabels(); });
  $('peekHidden').addEventListener('change', () => restyle());
  $('showLabels').checked = ui.labels;
  $('showLabels').addEventListener('change', () => { ui.labels = $('showLabels').checked; saveUi(); renderLabels(); });
  $('opacity').value = ui.opacity;
  $('opacity').addEventListener('input', () => { ui.opacity = +$('opacity').value; saveUi(); restyle(); });
  $('langBtn').addEventListener('click', () => { ui.lang = ui.lang === 'ru' ? 'he' : 'ru'; saveUi(); applyI18n(); map.closePopup(); });
  $('collapseBtn').addEventListener('click', () => {
    ui.collapsed = !ui.collapsed; saveUi();
    $('panel').classList.toggle('collapsed', ui.collapsed);
    $('collapseBtn').textContent = ui.collapsed ? '+' : '–';
  });

  // export / import / reset
  $('exportBtn').addEventListener('click', () => {
    const keys = Object.keys(state.hidden).sort((a, b) => { const [ga, ha] = a.split('/').map(Number); const [gb, hb] = b.split('/').map(Number); return ga - gb || ha - hb; });
    const out = { version: 1, updated: state.updated || new Date().toISOString(), hidden: Object.fromEntries(keys.map(k => [k, true])) };
    const blob = new Blob([JSON.stringify(out, null, 2) + '\n'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'state.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('importInput').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (!isValidState(j)) throw new Error('bad');
      const changes = {};
      byId.forEach((_, id) => { changes[id] = !!j.hidden[id]; });
      if (!SB_ON) stateSource = 'local';
      setHiddenMany(changes);
      $('searchMsg').textContent = `${t('imported')}: ${Object.keys(state.hidden).length}`;
    } catch { $('searchMsg').textContent = t('importErr'); }
    e.target.value = '';
  });
  let resetArmed = null;
  $('resetBtn').addEventListener('click', () => {
    const b = $('resetBtn');
    if (!resetArmed) {
      b.classList.add('armed'); b.textContent = t('resetConfirm');
      resetArmed = setTimeout(() => { resetArmed = null; b.classList.remove('armed'); b.textContent = t('reset'); }, 3000);
      return;
    }
    clearTimeout(resetArmed); resetArmed = null; b.classList.remove('armed'); b.textContent = t('reset');
    if (!SB_ON) stateSource = 'local';
    setHiddenMany(Object.fromEntries(Object.keys(state.hidden).map(id => [id, false])));
  });

  // ---------- init ----------
  (async () => {
    if (SB_ON) await loadStateSupabase(); else await loadStateFile();
    if (ui.collapsed) { $('panel').classList.add('collapsed'); $('collapseBtn').textContent = '+'; }
    applyI18n();
    boundary.addTo(map);
    parcels.addTo(map);
    boundary.bringToFront();
    map.fitBounds(boundary.getBounds(), { padding: [20, 20] });
    restyle(); renderLabels(); renderStats();
    if (SB_ON) {
      startRealtime();
      scheduleFlush(50);
      window.addEventListener('online', () => resyncFromServer());
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') resyncFromServer(); });
    }
    window.__appReady = true;
  })();
})();
