import React, { useEffect, useState } from 'react'
import { fetchDoctors, createDoctor, deleteDoctor, updateDoctor, fetchAppointmentsAdmin, updateAppointmentStatus } from '../api'

export default function AdminDashboard(){
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newDoc, setNewDoc] = useState({ name:'', specialization:'', city:'', hospital:'' })

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
    const res = await createDoctor(newDoc)
    if(res && res.success){ setNewDoc({ name:'', specialization:'', city:'', hospital:'' }); load() }
    else alert(res?.message || 'Add failed')
  }

  async function removeDoctor(id){
    if(!confirm('Delete doctor?')) return
    const res = await deleteDoctor(id)
    if(res && res.success) load()
    else alert(res?.message || 'Delete failed')
  }

  async function changeStatus(id, status){
    const res = await updateAppointmentStatus(id, status)
    if(res && res.success) load()
    else alert(res?.message || 'Update failed')
  }

  return (
    <div className="page admin">
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading…</p> : (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <section>
            <h3>Doctors</h3>
            <form onSubmit={addDoctor} style={{marginBottom:12}}>
              <input placeholder="Name" required value={newDoc.name} onChange={e=>setNewDoc({...newDoc,name:e.target.value})} />
              <input placeholder="Specialization" required value={newDoc.specialization} onChange={e=>setNewDoc({...newDoc,specialization:e.target.value})} />
              <input placeholder="City" required value={newDoc.city} onChange={e=>setNewDoc({...newDoc,city:e.target.value})} />
              <input placeholder="Hospital" required value={newDoc.hospital} onChange={e=>setNewDoc({...newDoc,hospital:e.target.value})} />
              <div className="form-actions"><button className="btn" type="submit">Add Doctor</button></div>
            </form>

            <div>
              {doctors.map(d=> (
                <div key={d.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:8,borderBottom:'1px solid #eee'}}>
                  <div>
                    <strong>{d.name}</strong><div style={{fontSize:12,color:'#666'}}>{d.specialization} — {d.city}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>removeDoctor(d.id)} className="btn ghost">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3>Appointments</h3>
            <div>
              {appointments.map(a=> (
                <div key={a.id} style={{padding:8,borderBottom:'1px solid #eee'}}>
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
    </div>
  )
}
