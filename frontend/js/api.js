/* ============================================================
   api.js — Shared API helper
   Change BASE_URL to your deployed Render.com URL when live.
   ============================================================ */

const API = (() => {
  const BASE_URL = 'http://localhost:5000/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  function setSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function isLoggedIn() { return !!getToken(); }
  function isAdmin()    { const u = getUser(); return u && u.role === 'admin'; }

  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token   = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res  = await fetch(`${BASE_URL}${path}`, { ...options, headers: { ...headers, ...options.headers } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  }

  return {
    BASE_URL,
    getToken, getUser, setSession, clearSession, isLoggedIn, isAdmin,

    // AUTH
    register : (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login    : (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),

    // DOCTORS
    getDoctors   : (params = {}) => request(`/doctors?${new URLSearchParams(params)}`),
    getDoctorMeta: ()             => request('/doctors/meta'),
    getDoctor    : (id)           => request(`/doctors/${id}`),
    addDoctor    : (body)         => request('/doctors',    { method: 'POST',   body: JSON.stringify(body) }),
    updateDoctor : (id, body)     => request(`/doctors/${id}`, { method: 'PUT',  body: JSON.stringify(body) }),
    deleteDoctor : (id)           => request(`/doctors/${id}`, { method: 'DELETE' }),

    // APPOINTMENTS
    bookAppointment   : (body)        => request('/appointments',              { method: 'POST',  body: JSON.stringify(body) }),
    getAppointments   : (params = {}) => request(`/appointments?${new URLSearchParams(params)}`),
    updateApptStatus  : (id, status)  => request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  };
})();

/* ============================================================
   TOAST NOTIFICATION HELPER
   ============================================================ */
function showToast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

/* ============================================================
   STAR RATING HELPER
   ============================================================ */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ============================================================
   SPECIALTY ICON MAP
   ============================================================ */
const SPEC_ICONS = {
  'Cardiologist'       : '🫀',
  'Dermatologist'      : '🧴',
  'Neurologist'        : '🧠',
  'Orthopedic Surgeon' : '🦴',
  'Pediatrician'       : '👶',
  'Gynecologist'       : '🌸',
  'Psychiatrist'       : '🧘',
  'General Physician'  : '🩺',
  'ENT Specialist'     : '👂',
  'Ophthalmologist'    : '👁️',
  'Oncologist'         : '🎗️',
  'Endocrinologist'    : '💉',
};

function specIcon(spec) { return SPEC_ICONS[spec] || '🏥'; }

/* ============================================================
   DOCTOR CARD HTML BUILDER
   ============================================================ */
function buildDoctorCard(doc) {
  const fee     = doc.consultation_fee === 0 ? '<span class="fee-free">Free</span>' : `₹${doc.consultation_fee}`;
  const expBand = doc.experience_years <= 5 ? 'Junior' : doc.experience_years <= 15 ? 'Mid-level' : 'Senior';
  const avatar  = doc.photo_url
    ? `<img src="${doc.photo_url}" alt="${doc.name}" class="doctor-avatar" loading="lazy">`
    : `<div class="doctor-avatar-placeholder">${specIcon(doc.specialization)}</div>`;

  return `
    <div class="doctor-card" data-id="${doc.id}" onclick="location.href='doctor.html?id=${doc.id}'">
      <div class="card-header">
        ${avatar}
        <div>
          <div class="card-name">${doc.name}</div>
          <div class="card-specialty">${specIcon(doc.specialization)} ${doc.specialization}</div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info-row"><span class="icon">🏥</span> ${doc.hospital}</div>
        <div class="card-info-row"><span class="icon">📍</span> ${doc.city}</div>
        <div class="rating-row">
          <span class="stars">${renderStars(parseFloat(doc.rating))}</span>
          <span class="rating-num">${parseFloat(doc.rating).toFixed(1)}</span>
          <span class="exp-badge">${doc.experience_years}yr · ${expBand}</span>
        </div>
      </div>
      <div class="card-footer">
        <div>
          <div class="fee-label">Consultation</div>
          <div class="fee-amount">${fee}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); location.href='appointment.html?id=${doc.id}'">
          Book Now
        </button>
      </div>
    </div>`;
}

/* ============================================================
   NAVBAR AUTH STATE UPDATER
   ============================================================ */
function updateNavbar() {
  const user    = API.getUser();
  const authEl  = document.getElementById('nav-auth');
  if (!authEl) return;

  if (user) {
    authEl.innerHTML = `
      <span class="navbar-user">👤 ${user.name.split(' ')[0]}</span>
      ${API.isAdmin() ? '<a href="admin/index.html" class="btn btn-sm btn-accent">Admin</a>' : ''}
      <button class="btn btn-sm btn-outline" onclick="logout()" style="color:#FDEBD0;border-color:#FDEBD0;">Logout</button>`;
  } else {
    authEl.innerHTML = `
      <a href="login.html" class="btn btn-sm btn-outline" style="color:#FDEBD0;border-color:#FDEBD0;">Login</a>
      <a href="register.html" class="btn btn-sm btn-primary">Register</a>`;
  }
}

function logout() {
  API.clearSession();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => location.href = 'index.html', 800);
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});
