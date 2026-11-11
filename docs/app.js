/* ============================================================
   Data shape (see data.js):
   BUS_DATA row = [From, To, Via, "Departure Time", TypeOfService, Operator, ServiceDays, TimeCategory, NoOfStops]
   ============================================================ */

const IDX = { FROM:0, TO:1, VIA:2, TIME:3, TYPE:4, OPERATOR:5, DAYS:6, CATEGORY:7, STOPS:8 };

const TIME_CATEGORIES = ['Early Morning','Morning','Afternoon','Evening','Night','Late Night'];
const MAX_RENDER = 250;

const state = {
  from: '',
  to: '',
  activeCategories: new Set(TIME_CATEGORIES),
  type: '',
  days: '',
  sort: 'time'
};

// Helper to convert AM/PM time strings into total minutes from midnight for accurate numerical sorting.
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/^(\d+):(\d+)\s*(AM|PM)?/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// ---------- setup: datalists & selects ----------
function populateOptions(){
  const fromList = document.getElementById('fromList');
  const toList = document.getElementById('toList');
  const typeSelect = document.getElementById('typeSelect');
  const daysSelect = document.getElementById('daysSelect');

  if (fromList) fromList.innerHTML = META.froms.map(c => `<option value="${escapeHtml(c)}">`).join('');
  if (toList) toList.innerHTML = META.tos.map(c => `<option value="${escapeHtml(c)}">`).join('');

  if (typeSelect) {
    typeSelect.innerHTML = '<option value="">All Types</option>';
    META.types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      typeSelect.appendChild(opt);
    });
  }

  if (daysSelect) {
  daysSelect.innerHTML = '<option value="">All Days</option>';

  META.days
    .filter(d => d !== "All Days")
    .forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      daysSelect.appendChild(opt);
    });
}
}
function buildTimeChips(){
  const wrap = document.getElementById('timeChips');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  TIME_CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip active';
    chip.textContent = cat;
    chip.dataset.cat = cat;
    chip.addEventListener('click', () => {
      if(state.activeCategories.has(cat)){
        state.activeCategories.delete(cat);
        chip.classList.remove('active');
      } else {
        state.activeCategories.add(cat);
        chip.classList.add('active');
      }
      runSearch();
    });
    wrap.appendChild(chip);
  });
}

function tickClock(){
  const el = document.getElementById('liveClock');
  if (!el) return;
  const now = new Date();
  el.textContent = `BOARD TIME: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
}

// ---------- filtering ----------
function normalize(s){ return (s||'').trim().toLowerCase(); }

function filterData(){
  const from = normalize(state.from);
  const to = normalize(state.to);

  return BUS_DATA.filter(r => {
    if(from && !normalize(r[IDX.FROM]).includes(from)) return false;
    if(to && !normalize(r[IDX.TO]).includes(to)) return false;
    if(state.type && r[IDX.TYPE] !== state.type) return false;
    if(state.days && r[IDX.DAYS] !== state.days) return false;
    if(state.activeCategories.size < TIME_CATEGORIES.length && !state.activeCategories.has(r[IDX.CATEGORY])) return false;
    return true;
  });
}

function sortData(rows){
  const sorted = rows.slice();
  if(state.sort === 'time'){
    sorted.sort((a,b) => parseTimeToMinutes(a[IDX.TIME]) - parseTimeToMinutes(b[IDX.TIME]));
  } else if(state.sort === 'stops'){
    sorted.sort((a,b) => a[IDX.STOPS] - b[IDX.STOPS]);
  }
  return sorted;
}

// ---------- rendering ----------
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function typeTagClass(type){
  const t = (type||'').toLowerCase();
  if(t === 'volvo') return 'tag-type-volvo';
  if(t === 'ac') return 'tag-type-ac';
  if(t === 'hvac') return 'tag-type-hvac';
  return '';
}

function renderRow(r){
  const [from, to, via, time, type, operator, days, category, stops] = r;
  const daysClass = days === 'Closed' ? 'days-closed' : '';
  const opText = operator ? escapeHtml(operator) : '';
  const daysText = days ? escapeHtml(days) : '';

  return `
    <div class="row">
      <div class="col-time"><div class="time-plain">${escapeHtml(time)}</div></div>
      <div class="col-route">
        <div class="route-line">${escapeHtml(from)}<span class="arrow">→</span>${escapeHtml(to)}</div>
        ${via ? `<div class="route-via">via ${escapeHtml(via)}</div>` : ''}
      </div>
      <div class="col-tags">
        ${category ? `<span class="tag tag-time">${escapeHtml(category)}</span>` : ''}
        ${type ? `<span class="tag ${typeTagClass(type)}">${escapeHtml(type)}</span>` : ''}
      </div>
      <div class="col-meta">
        ${opText ? `<div>${opText}</div>` : ''}
        ${daysText ? `<div class="${daysClass}">${daysText}</div>` : ''}
      </div>
      <div class="col-stops">${stops}</div>
    </div>
  `;
}

function renderStats(rows){
  const strip = document.getElementById('statsStrip');
  if(!strip) return;
  if(rows.length === 0){ strip.hidden = true; return; }

  const opCounts = {};
  rows.forEach(r => { const op = r[IDX.OPERATOR]; if(op) opCounts[op] = (opCounts[op]||0)+1; });
  const topOp = Object.entries(opCounts).sort((a,b)=>b[1]-a[1])[0];

  const avgStops = (rows.reduce((s,r)=>s+r[IDX.STOPS],0) / rows.length).toFixed(1);

  strip.hidden = false;
  strip.innerHTML = `
    <div class="stat-cell">
      <div class="stat-label">Top operator</div>
      <div class="stat-value">${topOp ? escapeHtml(topOp[0]) : '—'}</div>
    </div>
    <div class="stat-cell">
      <div class="stat-label">Avg. stops</div>
      <div class="stat-value">${avgStops}</div>
    </div>
  `;
}

function runSearch(){
  const filtered = filterData();
  const sorted = sortData(filtered);
  const toRender = sorted.slice(0, MAX_RENDER);

  const body = document.getElementById('resultsBody');
  const empty = document.getElementById('emptyState');
  const moreNote = document.getElementById('moreNote');
  const countEl = document.getElementById('resultCount');

  if (countEl) {
    countEl.innerHTML = filtered.length ? `<b>${filtered.length}</b> departure${filtered.length===1?'':'s'} match` : '';
  }

  renderStats(filtered);

  if(filtered.length === 0){
    if (body) body.innerHTML = '';
    if (empty) empty.hidden = false;
    if (moreNote) moreNote.hidden = true;
    return;
  }
  if (empty) empty.hidden = true;
  if (body) body.innerHTML = toRender.map(renderRow).join('');

  if(filtered.length > MAX_RENDER){
    if (moreNote) {
      moreNote.hidden = false;
      moreNote.textContent = `Showing first ${MAX_RENDER} of ${filtered.length} — add a destination or narrow the time of day to see a focused list.`;
    }
  } else {
    if (moreNote) moreNote.hidden = true;
  }
}

// ---------- wiring ----------
function init(){
  if (typeof META === 'undefined' || typeof BUS_DATA === 'undefined') return;

  populateOptions();
  buildTimeChips();
  tickClock();
  
  if (!window.clockInterval) {
    window.clockInterval = setInterval(tickClock, 1000);
  }

  const fromInput = document.getElementById('fromInput');
  const toInput = document.getElementById('toInput');
  const swapBtn = document.getElementById('swapBtn');
  const toggleAdvBtn = document.getElementById('toggleAdvBtn');
  const advRow = document.getElementById('advRow');
  const typeSelect = document.getElementById('typeSelect');
  const daysSelect = document.getElementById('daysSelect');
  const sortSelect = document.getElementById('sortSelect');

  if (fromInput) fromInput.addEventListener('input', () => { state.from = fromInput.value; runSearch(); });
  if (toInput) toInput.addEventListener('input', () => { state.to = toInput.value; runSearch(); });

  if (swapBtn && fromInput && toInput) {
    swapBtn.addEventListener('click', () => {
      const tmp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = tmp;
      state.from = fromInput.value;
      state.to = toInput.value;
      runSearch();
    });
  }

  if (toggleAdvBtn && advRow) {
    toggleAdvBtn.addEventListener('click', () => {
      const isHidden = advRow.hidden;
      advRow.hidden = !isHidden;
      const iconEl = toggleAdvBtn.querySelector('.adv-toggle-icon');
      if (iconEl) {
        iconEl.textContent = isHidden ? '−' : '＋';
      }
    });
  }

  if (typeSelect) typeSelect.addEventListener('change', () => { state.type = typeSelect.value; runSearch(); });
  if (daysSelect) daysSelect.addEventListener('change', () => { state.days = daysSelect.value; runSearch(); });
  if (sortSelect) sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; runSearch(); });

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', e => e.preventDefault());
  }

  runSearch();
}

if (typeof BUS_DATA !== 'undefined' && typeof META !== 'undefined') {
  init();
}