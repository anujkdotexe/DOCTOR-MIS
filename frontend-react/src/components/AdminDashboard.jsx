import React, { useEffect, useState } from 'react'
import { fetchDoctors, createDoctor, deleteDoctor, updateDoctor, fetchAppointmentsAdmin, updateAppointmentStatus } from '../api'

export default function AdminDashboard(){
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newDoc, setNewDoc] = useState({ name:'', specialization:'', city:'', hospital:'' })
  const [notice, setNotice] = useState('')

  async function load(){
    setLoading(true)
    const [dRes, aRes] = await Promise.all([fetchDoctors(), fetchAppointmentsAdmin()])
    if(dRes && dRes.success) setDoctors(dRes.data || [])
    if(aRes && aRes.success) setAppointments(aRes.data || [])
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  async function addDoctor(e){
    e.preventDefault()
    setNotice('')
    const res = await createDoctor(newDoc)
    if(res && res.success){ setNewDoc({ name:'', specialization:'', city:'', hospital:'' }); setNotice('Doctor added successfully.'); load() }
    else setNotice(res?.message || 'Add failed')
  }

  const [editDoc, setEditDoc] = useState(null)

  async function startEdit(d){
    setEditDoc({ ...d })
  }

  async function saveEdit(e){
    e.preventDefault()
    if(!editDoc || !editDoc.id) return
    const res = await updateDoctor(editDoc.id, editDoc)
    if(res && res.success){ setEditDoc(null); setNotice('Doctor updated successfully.'); load() }
    else setNotice(res?.message || 'Update failed')
  }

  async function removeDoctor(id){
    if(!confirm('Delete doctor?')) return
    const res = await deleteDoctor(id)
    if(res && res.success) { setNotice('Doctor deleted successfully.'); load() }
    else setNotice(res?.message || 'Delete failed')
  }

  async function changeStatus(id, status){
    const res = await updateAppointmentStatus(id, status)
    if(res && res.success) { setNotice('Appointment status updated.'); load() }
    else setNotice(res?.message || 'Update failed')
  }

  return (
    <div className="page admin">
      <div className="section-head">
        <span className="eyebrow">Admin area</span>
        <h2>Manage doctors and appointments</h2>
      </div>
      {notice && <p className="form-alert success" role="status">{notice}</p>}
      {loading ? <p>Loading…</p> : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <section className="card">
            <h3>Doctors</h3>
            <form onSubmit={addDoctor} style={{marginBottom:12,display:'grid',gap:10}}>
              <input placeholder="Name" required value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} />
              <input placeholder="Specialization" required value={newDoc.specialization} onChange={e=>setNewDoc({...newDoc,specialization:e.target.value})} />
              <input placeholder="City" required value={newDoc.city} onChange={e=>setNewDoc({...newDoc,city:e.target.value})} />
              <input placeholder="Hospital" required value={newDoc.hospital} onChange={e=>setNewDoc({...newDoc,hospital:e.target.value})} />
              <div className="form-actions"><button className="btn primary" type="submit">Add Doctor</button></div>
            </form>

            <div className="admin-list">
              {doctors.map(d=> (
                <div key={d.id} className="admin-row">
                  <div>
                    <strong>{d.name}</strong><div style={{fontSize:12,color:'#666'}}>{d.specialization} — {d.city}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>startEdit(d)} aria-label={`Edit ${d.name}`} className="btn ghost">Edit</button>
                    <button onClick={()=>removeDoctor(d.id)} aria-label={`Delete ${d.name}`} className="btn ghost">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h3>Appointments</h3>
            <div className="admin-list">
              {appointments.map(a=> (
                <div key={a.id} className="admin-row appointment-row">
                  <div><strong>{a.patient_name}</strong> — {a.doctor_name} <span style={{color:'#666'}}>({a.appointment_date} {a.appointment_time})</span></div>
                  <div style={{marginTop:6}}>
                    <select defaultValue={a.status} onChange={e=>changeStatus(a.id,e.target.value)}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {editDoc && (
        <div className="modal-backdrop" onClick={()=>setEditDoc(null)}>
          <form className="card modal-card" onClick={e=>e.stopPropagation()} onSubmit={saveEdit} aria-modal="true" role="dialog">
            <h3>Edit Doctor</h3>
            <label>Name<input required value={editDoc.name} onChange={e=>setEditDoc({...editDoc,name:e.target.value})} /></label>
            <label>Specialization<input required value={editDoc.specialization} onChange={e=>setEditDoc({...editDoc,specialization:e.target.value})} /></label>
            <label>City<input required value={editDoc.city} onChange={e=>setEditDoc({...editDoc,city:e.target.value})} /></label>
            <label>Hospital<input required value={editDoc.hospital} onChange={e=>setEditDoc({...editDoc,hospital:e.target.value})} /></label>
            <div style={{textAlign:'right',marginTop:12}}>
              <button type="button" className="btn ghost" onClick={()=>setEditDoc(null)}>Cancel</button>
              <button className="btn primary" style={{marginLeft:8}} type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
