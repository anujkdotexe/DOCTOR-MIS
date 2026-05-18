import React, { useEffect, useState } from 'react'
import { fetchDoctors, bookAppointment } from '../api'

export default function Appointments(){
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ doctor_id:'', patient_name:'', patient_email:'', patient_phone:'', appointment_date:'', appointment_time:'', reason:'' })
  const [msg, setMsg] = useState(null)

  useEffect(()=>{
    fetchDoctors().then(r=>{ if(r && r.success) setDoctors(r.data || []) })
  },[])

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    const res = await bookAppointment(form)
    if(res && res.success){
      setMsg({ type:'success', text: res.message })
      setForm({ doctor_id:'', patient_name:'', patient_email:'', patient_phone:'', appointment_date:'', appointment_time:'', reason:'' })
    } else {
      setMsg({ type:'error', text: res?.message || 'Booking failed' })
    }
  }

  return (
    <div className="page">
      <h2>Book Appointment</h2>
      <form onSubmit={submit} style={{maxWidth:560}}>
        <label>Doctor
          <select required value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value})}>
            <option value="">— choose —</option>
            {doctors.map(d=> <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
          </select>
        </label>
        <label>Name<input required value={form.patient_name} onChange={e=>setForm({...form,patient_name:e.target.value})} /></label>
        <label>Email<input required type="email" value={form.patient_email} onChange={e=>setForm({...form,patient_email:e.target.value})} /></label>
        <label>Phone<input required value={form.patient_phone} onChange={e=>setForm({...form,patient_phone:e.target.value})} /></label>
        <label>Date<input required type="date" value={form.appointment_date} onChange={e=>setForm({...form,appointment_date:e.target.value})} /></label>
        <label>Time<input required type="time" value={form.appointment_time} onChange={e=>setForm({...form,appointment_time:e.target.value})} /></label>
        <label>Reason<textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} /></label>
        <div className="form-actions"><button className="btn" type="submit">Book Appointment</button></div>
      </form>
      {msg && <p style={{color: msg.type==='success' ? 'green' : 'red'}}>{msg.text}</p>}
    </div>
  )
}
