/* ============================================================
   search.js — Search page logic (index.html)
   ============================================================ */

let currentPage  = 1;
let totalPages   = 1;
let activeFilters = {};

const grid        = document.getElementById('doctors-grid');
const resultsInfo = document.getElementById('results-count');
const paginationEl= document.getElementById('pagination');

/* ---- Populate filter dropdowns from /api/doctors/meta ---- */
async function initFilters() {
  try {
    const meta = await API.getDoctorMeta();
    const specSel = document.getElementById('filter-spec');
    const citySel = document.getElementById('filter-city');

    meta.specializations.forEach(s => {
      specSel.insertAdjacentHTML('beforeend', `<option value="${s}">${s}</option>`);
    });
    meta.cities.forEach(c => {
      citySel.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`);
    });

    // Also build specialty chips
    const chipsEl = document.getElementById('specialty-chips');
    if (chipsEl) {
      meta.specializations.forEach(s => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.setAttribute('data-spec', s);
        chip.innerHTML  = `<span class="chip-icon">${specIcon(s)}</span>${s}`;
        chip.addEventListener('click', () => toggleChip(chip, s));
        chipsEl.appendChild(chip);
      });
    }
  } catch (e) {
    console.warn('Could not load filter metadata:', e.message);
  }
}

function toggleChip(el, spec) {
  const isActive = el.classList.contains('active');
  document.querySelectorAll('#specialty-chips .chip').forEach(c => c.classList.remove('active'));
  if (isActive) {
    delete activeFilters.specialization;
    document.getElementById('filter-spec').value = '';
  } else {
    el.classList.add('active');
    activeFilters.specialization = spec;
    document.getElementById('filter-spec').value = spec;
  }
  currentPage = 1;
  loadDoctors();
}

/* ---- Main load function ---- */
async function loadDoctors() {
  grid.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div></div>';

  const params = {
    ...activeFilters,
    page : currentPage,
    limit: 12,
  };

  // Strip empty values
  Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

  try {
    const res = await API.getDoctors(params);
    totalPages = res.pages || 1;

    if (resultsInfo) {
      resultsInfo.textContent = `${res.total} doctor${res.total !== 1 ? 's' : ''} found`;
    }

    if (res.data.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your filters or search term.</p>
        </div>`;
    } else {
      grid.innerHTML = res.data.map(buildDoctorCard).join('');
    }

    renderPagination();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>${err.message}</h3></div>`;
  }
}

/* ---- Pagination ---- */
function renderPagination() {
  if (!paginationEl || totalPages <= 1) { if (paginationEl) paginationEl.innerHTML = ''; return; }

  let html = '';
  const prev = currentPage > 1;
  const next = currentPage < totalPages;

  html += `<button class="page-btn" ${!prev ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 3) {
      html += `<span style="padding:0 6px;color:var(--text-muted)">…</span>`;
    }
  }
  html += `<button class="page-btn" ${!next ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">›</button>`;
  paginationEl.innerHTML = html;
}

function changePage(p) {
  currentPage = p;
  loadDoctors();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Hero search bar ---- */
let searchTimeout;
function onHeroSearch(val) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (val.trim()) activeFilters.name = val.trim();
    else delete activeFilters.name;
    currentPage = 1;
    loadDoctors();
  }, 450);
}

/* ---- Advanced filter inputs ---- */
function applyFilters() {
  activeFilters = {};
  const name  = document.getElementById('search-name')?.value.trim();
  const spec  = document.getElementById('filter-spec')?.value;
  const city  = document.getElementById('filter-city')?.value;
  const hosp  = document.getElementById('filter-hospital')?.value.trim();
  const rat   = document.getElementById('filter-rating')?.value;
  const exp   = document.getElementById('filter-exp')?.value;

  if (name)  activeFilters.name           = name;
  if (spec)  activeFilters.specialization = spec;
  if (city)  activeFilters.city           = city;
  if (hosp)  activeFilters.hospital       = hosp;
  if (rat)   activeFilters.min_rating     = rat;
  if (exp)   activeFilters.experience     = exp;

  // Sync chips
  document.querySelectorAll('#specialty-chips .chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-spec') === spec);
  });

  currentPage = 1;
  loadDoctors();
}

function clearFilters() {
  activeFilters = {};
  ['search-name','filter-spec','filter-city','filter-hospital','filter-rating','filter-exp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('#specialty-chips .chip').forEach(c => c.classList.remove('active'));
  currentPage = 1;
  loadDoctors();
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  initFilters();
  loadDoctors();
});
