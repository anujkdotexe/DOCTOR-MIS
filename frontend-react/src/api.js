const API_ROOT = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

function authHeaders(){
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchDoctors(params = ''){
  const res = await fetch(`${API_ROOT}/doctors${params ? `?${params}` : ''}`)
  return res.json()
}

export async function fetchDoctor(id){
  const res = await fetch(`${API_ROOT}/doctors/${id}`)
  return res.json()
}

export async function createDoctor(data){
  const res = await fetch(`${API_ROOT}/doctors`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function updateDoctor(id, data){
  const res = await fetch(`${API_ROOT}/doctors/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteDoctor(id){
  const res = await fetch(`${API_ROOT}/doctors/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  return res.json()
}

export async function bookAppointment(data){
  const res = await fetch(`${API_ROOT}/appointments`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function fetchAppointmentsAdmin(params = ''){
  const res = await fetch(`${API_ROOT}/appointments${params ? `?${params}` : ''}`, {
    headers: { ...authHeaders() }
  })
  return res.json()
}

export async function updateAppointmentStatus(id, status){
  const res = await fetch(`${API_ROOT}/appointments/${id}/status`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ status })
  })
  return res.json()
}

export async function registerUser(data){
  const res = await fetch(`${API_ROOT}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export async function loginUser(data){
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  })
  return res.json()
}

export default {
  fetchDoctors, fetchDoctor, createDoctor, updateDoctor, deleteDoctor,
  bookAppointment, fetchAppointmentsAdmin, updateAppointmentStatus,
  registerUser, loginUser,
}
