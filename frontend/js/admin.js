/* ============================================================
   admin.js — Admin Dashboard logic
   ============================================================ */

/* ---------- Guard: redirect non-admins ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!API.isAdmin()) {
    showToast('Admin access required.', 'error');
    setTimeout(() => location.href = '../login.html', 1000);
    return;
  }
  updateAdminNav();
  const page = document.body.dataset.adminPage;
  if (page === 'doctors')      initDoctorsPage();
  else if (page === 'appointments') initAppointmentsPage();
  else initDashboard();
});

function updateAdminNav() {
  const user = API.getUser();
  const el   = document.getElementById('admin-user-label');
  if (el) el.textContent = user?.name || 'Admin';
}

/* ============================================================
   DASHBOARD — stats overview
   ============================================================ */
async function initDashboard() {
  try {
    const [docsRes, apptRes] = await Promise.all([
      API.getDoctors({ limit: 1 }),
      API.getAppointments({ limit: 1 }),
    ]);
    setEl('stat-doctors', docsRes.total);
    setEl('stat-appointments', apptRes.total);

    const pendingRes    = await API.getAppointments({ status: 'pending', limit: 1 });
    const confirmedRes  = await API.getAppointments({ status: 'confirmed', limit: 1 });
    setEl('stat-pending',   pendingRes.total);
    setEl('stat-confirmed', confirmedRes.total);

    loadRecentDoctors();
    loadRecentAppointments();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

async function loadRecentDoctors() {
  try {
    const res  = await API.getDoctors({ limit: 5 });
    const tbody= document.getElementById('recent-doctors-body');
    if (!tbody) return;
    tbody.innerHTML = res.data.map(d => `
      <tr>
        <td><img src="${d.photo_url || ''}" class="table-avatar" onerror="this.outerHTML='<span style=font-size:1.5rem>${specIcon(d.specialization)}</span>'"></td>
        <td>${d.name}</td>
        <td>${d.specialization}</td>
        <td>${d.city}</td>
        <td>${d.rating}</td>
      </tr>`).join('');
  } catch (e) { console.warn(e); }
}

async function loadRecentAppointments() {
  try {
    const res  = await API.getAppointments({ limit: 5 });
    const tbody= document.getElementById('recent-appt-body');
    if (!tbody) return;
    tbody.innerHTML = res.data.map(a => `
      <tr>
        <td>${a.patient_name}</td>
        <td>${a.doctor_name}</td>
        <td>${a.appointment_date}</td>
        <td><span class="badge badge-${a.status}">${a.status}</span></td>
      </tr>`).join('');
  } catch (e) { console.warn(e); }
}

/* ============================================================
   DOCTORS PAGE
   ============================================================ */
let doctorPage   = 1;
let editingDocId = null;

async function initDoctorsPage() {
  loadDoctorsTable();
  document.getElementById('btn-add-doctor')?.addEventListener('click', () => openDoctorModal());
  document.getElementById('doctor-form')?.addEventListener('submit', saveDoctorForm);
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('search-doctors-input')?.addEventListener('input', e => {
    doctorPage = 1;
    loadDoctorsTable(e.target.value.trim());
  });
}

async function loadDoctorsTable(search = '') {
  const tbody = document.getElementById('doctors-table-body');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px">Loading…</td></tr>';
  try {
    const res = await API.getDoctors({ name: search || undefined, page: doctorPage, limit: 15 });
    tbody.innerHTML = res.data.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <img src="${d.photo_url || ''}" class="table-avatar" onerror="this.style.display='none'">
            <strong>${d.name}</strong>
          </div>
        </td>
        <td>${d.specialization}</td>
        <td>${d.city}</td>
        <td>${d.hospital}</td>
        <td><span class="stars">${renderStars(parseFloat(d.rating))}</span> ${d.rating}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="openDoctorModal(${d.id})" style="margin-right:6px">Edit</button>
          <button class="btn btn-sm btn-danger"  onclick="deleteDoctor(${d.id}, '${d.name}')">Delete</button>
        </td>
      </tr>`).join('') || '<tr><td colspan="7" style="text-align:center">No records</td></tr>';

    renderTablePagination('doctors-pagination', res, (p) => { doctorPage = p; loadDoctorsTable(search); });
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:var(--danger);padding:24px">${e.message}</td></tr>`;
  }
}

function openDoctorModal(id = null) {
  editingDocId = id;
  const modal  = document.getElementById('doctor-modal');
  const title  = document.getElementById('modal-title');
  const form   = document.getElementById('doctor-form');

  form.reset();
  if (id) {
    title.textContent = 'Edit Doctor';
    API.getDoctor(id).then(res => {
      const d = res.data;
      ['name','specialization','city','hospital','rating','experience_years','photo_url','bio','phone','email','available_days','available_time','consultation_fee'].forEach(f => {
        const el = form.elements[f];
        if (el) el.value = d[f] || '';
      });
    }).catch(e => showToast(e.message, 'error'));
  } else {
    title.textContent = 'Add New Doctor';
  }
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('doctor-modal')?.classList.remove('open');
  editingDocId = null;
}

async function saveDoctorForm(e) {
  e.preventDefault();
  const form = e.target;
  const body = Object.fromEntries(new FormData(form));

  try {
    if (editingDocId) {
      await API.updateDoctor(editingDocId, body);
      showToast('Doctor updated successfully!', 'success');
    } else {
      await API.addDoctor(body);
      showToast('Doctor added successfully!', 'success');
    }
    closeModal();
    loadDoctorsTable();
    if (typeof initDashboard === 'function') initDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteDoctor(id, name) {
  if (!confirm(`Delete Dr. ${name}? This cannot be undone.`)) return;
  try {
    await API.deleteDoctor(id);
    showToast(`${name} removed.`, 'success');
    loadDoctorsTable();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

/* ============================================================
   APPOINTMENTS PAGE
   ============================================================ */
let apptPage = 1;

async function initAppointmentsPage() {
  loadAppointmentsTable();
  document.getElementById('appt-status-filter')?.addEventListener('change', () => { apptPage = 1; loadAppointmentsTable(); });
}

async function loadAppointmentsTable() {
  const tbody  = document.getElementById('appt-table-body');
  if (!tbody)  return;
  const status = document.getElementById('appt-status-filter')?.value;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px">Loading…</td></tr>';
  try {
    const res = await API.getAppointments({ status: status || undefined, page: apptPage, limit: 15 });
    tbody.innerHTML = res.data.map(a => `
      <tr>
        <td>#${a.id}</td>
        <td>${a.patient_name}<br><small style="color:var(--text-muted)">${a.patient_email}</small></td>
        <td>${a.doctor_name}<br><small style="color:var(--text-muted)">${a.specialization}</small></td>
        <td>${a.appointment_date} ${a.appointment_time}</td>
        <td>${a.city}</td>
        <td><span class="badge badge-${a.status}">${a.status}</span></td>
        <td>
          ${a.status === 'pending'    ? `<button class="btn btn-sm btn-accent"  onclick="updateStatus(${a.id},'confirmed')">Confirm</button>` : ''}
          ${a.status !== 'cancelled'  ? `<button class="btn btn-sm btn-danger"  onclick="updateStatus(${a.id},'cancelled')" style="margin-left:4px">Cancel</button>` : '–'}
        </td>
      </tr>`).join('') || '<tr><td colspan="7" style="text-align:center">No appointments</td></tr>';

    renderTablePagination('appt-pagination', res, (p) => { apptPage = p; loadAppointmentsTable(); });
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:var(--danger);padding:24px">${e.message}</td></tr>`;
  }
}

async function updateStatus(id, status) {
  try {
    await API.updateApptStatus(id, status);
    showToast(`Appointment ${status}.`, 'success');
    loadAppointmentsTable();
  } catch (e) { showToast(e.message, 'error'); }
}

/* ============================================================
   TABLE PAGINATION HELPER
   ============================================================ */
function renderTablePagination(containerId, res, onChangePage) {
  const el = document.getElementById(containerId);
  if (!el || res.pages <= 1) { if (el) el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= res.pages; i++) {
    html += `<button class="page-btn ${i === res.page ? 'active' : ''}" onclick="(${onChangePage.toString()})(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}
